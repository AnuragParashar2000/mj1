const mongoose = require('mongoose');

const discussionSchema = mongoose.Schema(
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
        question: {
            type: String,
            required: true,
        },
        replies: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    ref: 'User',
                },
                reply: {
                    type: String,
                    required: true,
                },
                createdAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Discussion', discussionSchema);
