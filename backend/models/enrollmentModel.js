const mongoose = require('mongoose');

const enrollmentSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Course',
        },
        completedLessons: [
            {
                type: String, // Lesson Title or ID
            },
        ],
        progress: {
            type: Number,
            default: 0, // Percentage 0-100
        },
        completed: {
            type: Boolean,
            default: false,
        },
        certificateEarned: {
            type: Boolean,
            default: false,
        },
        badgeEarned: {
            type: String, // E.g., 'Bronze', 'Silver', 'Gold'
            default: null,
        },
        paidAmount: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Enrollment', enrollmentSchema);
