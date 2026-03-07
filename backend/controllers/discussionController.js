const asyncHandler = require('express-async-handler');
const Discussion = require('../models/discussionModel');

// @desc    Get discussions for a course
// @route   GET /api/discussions/:courseId
// @access  Private
const getDiscussions = asyncHandler(async (req, res) => {
    const discussions = await Discussion.find({ course: req.params.courseId })
        .populate('user', 'name')
        .populate('replies.user', 'name')
        .sort('-createdAt');
    res.json(discussions);
});

// @desc    Create a new discussion question
// @route   POST /api/discussions
// @access  Private
const createDiscussion = asyncHandler(async (req, res) => {
    const { courseId, question } = req.body;

    const discussion = await Discussion.create({
        user: req.user._id,
        course: courseId,
        question,
    });

    const populatedDiscussion = await Discussion.findById(discussion._id).populate('user', 'name');
    res.status(201).json(populatedDiscussion);
});

// @desc    Add a reply to a discussion
// @route   POST /api/discussions/:id/reply
// @access  Private
const addReply = asyncHandler(async (req, res) => {
    const discussion = await Discussion.findById(req.params.id);

    if (discussion) {
        const reply = {
            user: req.user._id,
            reply: req.body.reply,
        };

        discussion.replies.push(reply);
        await discussion.save();

        const updatedDiscussion = await Discussion.findById(req.params.id)
            .populate('user', 'name')
            .populate('replies.user', 'name');
        res.json(updatedDiscussion);
    } else {
        res.status(404);
        throw new Error('Discussion not found');
    }
});

module.exports = { getDiscussions, createDiscussion, addReply };
