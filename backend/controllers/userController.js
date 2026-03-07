const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const sendEmail = require('../utils/sendEmail');

// @desc    Register new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error('Please add all fields');
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user exists
    const userExists = await User.findOne({ email: normalizedEmail });

    if (userExists) {
        console.log(`[Registration Conflict]: User with email ${normalizedEmail} already exists.`);
        res.status(400);
        throw new Error('User already exists');
    }

    // Create user
    const user = await User.create({
        name,
        email: normalizedEmail,
        password,
        role: role || 'student',
    });

    if (user) {
        // Send a welcome email
        try {
            await sendEmail({
                to: user.email,
                subject: 'Welcome to SkillSphereX!',
                html: `
                    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                        <h2 style="color: #4f46e5;">Welcome to SkillSphereX, ${user.name}!</h2>
                        <p>We are thrilled to have you join our learning community.</p>
                        <p>At SkillSphereX, you can explore cutting-edge courses, participate in automated assessments, and earn verifiable certificates.</p>
                        <br/>
                        <p>To get started:</p>
                        <ul>
                            <li>Browse our course catalog.</li>
                            <li>Join the Global Lounge to connect with other learners.</li>
                        </ul>
                        <br/>
                        <p>Happy Learning!</p>
                        <p><strong>The SkillSphereX Team</strong></p>
                    </div>
                `,
            });
        } catch (error) {
            console.error('Failed to send welcome email:', error);
        }

        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    // Check for user email
    const user = await User.findOne({ email: normalizedEmail });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error('Invalid credentials');
    }
});

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
    res.status(200).json(req.user);
});

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Get leaderboard
// @route   GET /api/users/leaderboard
// @access  Public
const getLeaderboard = asyncHandler(async (req, res) => {
    const leaderboard = await User.find({ role: 'student' })
        .select('name points')
        .sort('-points')
        .limit(10);
    res.json(leaderboard);
});

// @desc    Update study time
// @route   POST /api/users/study-session
// @access  Private
const updateStudyTime = asyncHandler(async (req, res) => {
    const { duration } = req.body;
    if (!duration) {
        res.status(400);
        throw new Error('Please add duration');
    }

    const user = await User.findById(req.user._id);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    user.studySessions.push({ duration });
    await user.save();

    res.status(200).json({ message: 'Study session recorded' });
});

// @desc    Get student statistics for charts
// @route   GET /api/users/stats
// @access  Private
const getStudentStats = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    // Group study sessions by date for the last 7 days
    const last7Days = [...Array(7)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toISOString().split('T')[0];
    }).reverse();

    const stats = last7Days.map(date => {
        const duration = user.studySessions
            .filter(s => {
                try {
                    return s.date && s.date.toISOString().split('T')[0] === date;
                } catch (err) {
                    return false;
                }
            })
            .reduce((total, s) => total + s.duration, 0);
        return { date, duration };
    });

    res.json({
        points: user.points,
        studyStats: stats
    });
});

module.exports = {
    registerUser,
    loginUser,
    getMe,
    getLeaderboard,
    updateStudyTime,
    getStudentStats,
};
