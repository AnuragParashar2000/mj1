const mongoose = require('mongoose');

const snippetSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        language: {
            type: String,
            required: [true, 'Please provide the language'],
            default: 'javascript',
        },
        code: {
            type: String,
            required: [true, 'Please provide the code snippet'],
        },
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            default: null,
        },
        lessonIndex: {
            type: Number,
            default: null,
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Snippet', snippetSchema);
