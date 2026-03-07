const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

// Configure CORS origins
const allowedOrigins = [
    process.env.FRONTEND_URL,
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000"
].filter(Boolean);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        credentials: true
    }
});

// Configure Socket.io Connection
io.on('connection', (socket) => {
    console.log(`User Connected: ${socket.id}`);

    // Join global room
    socket.join('global_chat');

    socket.on('send_message', (data) => {
        // Broadcast to everyone in global_chat except sender
        socket.to('global_chat').emit('receive_message', data);
    });

    socket.on('disconnect', () => {
        console.log(`User Disconnected: ${socket.id}`);
    });
    // Middleware
    app.use(cors({
        origin: allowedOrigins,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }));
    // Handle Stripe webhook as raw body BEFORE express.json() parses it globally
    app.use('/api/payments/webhook', express.raw({ type: 'application/json' }), require('./routes/paymentRoutes'));

    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(helmet({
        crossOriginResourcePolicy: false,
    }));

    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
    }

    // Routes
    app.use('/api/users', require('./routes/userRoutes'));
    app.use('/api/courses', require('./routes/courseRoutes'));
    app.use('/api/quizzes', require('./routes/quizRoutes'));
    app.use('/api/enrollments', require('./routes/enrollmentRoutes'));
    app.use('/api/payments', require('./routes/paymentRoutes')); // Add general payment routes
    app.use('/api/ai', require('./routes/aiRoutes'));
    app.use('/api/admin', require('./routes/adminRoutes'));
    app.use('/api/snippets', require('./routes/snippetRoutes'));
    app.use('/api/compile', require('./routes/compileRoutes'));
    app.use('/api/reviews', require('./routes/reviewRoutes'));
    app.use('/api/discussions', require('./routes/discussionRoutes'));

    app.get('/', (req, res) => {
        res.json({ message: 'Welcome to SkillSphereX API' });
    });

    // Error Handler Middleware
    app.use((err, req, res, next) => {
        const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
        res.status(statusCode);
        res.json({
            message: err.message,
            stack: process.env.NODE_ENV === 'production' ? null : err.stack,
        });
    });

    const PORT = process.env.PORT || 5001;

    server.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
