const mongoose = require('mongoose');

const questionSchema = mongoose.Schema({
    questionText: {
        type: String,
        required: true,
    },
    options: [
        {
            type: String,
            required: true,
        },
    ],
    correctAnswer: {
        type: Number, // Index of the correct option
        required: true,
    },
});

const quizSchema = mongoose.Schema(
    {
        course: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Course',
        },
        title: {
            type: String,
            required: [true, 'Please add a quiz title'],
        },
        description: {
            type: String,
        },
        difficulty: {
            type: String,
            enum: ['Beginner', 'Intermediate', 'Advanced'],
            default: 'Beginner',
        },
        questions: [questionSchema],
        passingScore: {
            type: Number,
            default: 60, // Percentage
        },
    },
    {
        timestamps: true,
    }
);

// Results/Attempts Schema
const attemptSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        quiz: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Quiz',
        },
        score: {
            type: Number,
            required: true,
        },
        passed: {
            type: Boolean,
            required: true,
        },
        answers: [Number], // Indicies of user's answers
    },
    {
        timestamps: true,
    }
);

const Quiz = mongoose.model('Quiz', quizSchema);
const Attempt = mongoose.model('Attempt', attemptSchema);

module.exports = { Quiz, Attempt };
