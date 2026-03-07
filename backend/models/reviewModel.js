const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema(
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
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Prevent user from submitting more than one review per course
reviewSchema.index({ user: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
