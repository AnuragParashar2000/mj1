const mongoose = require('mongoose');

const courseSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please add a course title'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Please add a course description'],
        },
        instructor: {
            type: String,
            required: [true, 'Please add an instructor name'],
        },
        duration: {
            type: String,
            required: [true, 'Please add a course duration'],
        },
        coverImage: {
            type: String,
            default: 'https://via.placeholder.com/300x200?text=SkillSphereX+Course',
        },
        category: {
            type: String,
            required: [true, 'Please specify a category'],
        },
        isPremium: {
            type: Boolean,
            default: false,
        },
        price: {
            type: Number,
            default: 0,
        },
        lessons: [
            {
                title: String,
                content: String,
                videoUrl: String,
                hasCodingChallenge: {
                    type: Boolean,
                    default: false
                },
                defaultLanguage: {
                    type: String,
                    default: 'javascript'
                },
                starterCode: String
            },
        ],
        resources: [
            {
                title: String,
                url: String,
                fileType: String
            },
        ],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Course', courseSchema);
