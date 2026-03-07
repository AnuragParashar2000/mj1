const asyncHandler = require('express-async-handler');
const Snippet = require('../models/snippetModel');

// @desc    Get user snippets
// @route   GET /api/snippets
// @access  Private
const getSnippets = asyncHandler(async (req, res) => {
    const { courseId, lessonIndex } = req.query;

    let query = { user: req.user.id };

    if (courseId) query.courseId = courseId;
    if (lessonIndex) query.lessonIndex = parseInt(lessonIndex);

    const snippets = await Snippet.find(query).sort({ updatedAt: -1 });
    res.status(200).json(snippets);
});

// @desc    Save or update a snippet
// @route   POST /api/snippets
// @access  Private
const saveSnippet = asyncHandler(async (req, res) => {
    const { language, code, courseId, lessonIndex } = req.body;

    if (!code) {
        res.status(400);
        throw new Error('Please add code to save');
    }

    // Try to find existing snippet for this specific course/lesson to update it
    let filter = { user: req.user.id };
    let isSpecificLesson = false;

    if (courseId && lessonIndex !== undefined) {
        filter.courseId = courseId;
        filter.lessonIndex = lessonIndex;
        isSpecificLesson = true;
    }

    // If it's a specific lesson, we want to update the existing one
    if (isSpecificLesson) {
        const existingSnippet = await Snippet.findOne(filter);
        if (existingSnippet) {
            existingSnippet.code = code;
            existingSnippet.language = language || existingSnippet.language;
            await existingSnippet.save();
            return res.status(200).json(existingSnippet);
        }
    }

    // Otherwise create a new one
    const snippet = await Snippet.create({
        user: req.user.id,
        language,
        code,
        courseId: courseId || null,
        lessonIndex: lessonIndex !== undefined ? lessonIndex : null
    });

    res.status(201).json(snippet);
});

module.exports = {
    getSnippets,
    saveSnippet
};
