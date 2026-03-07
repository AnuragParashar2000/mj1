const asyncHandler = require('express-async-handler');
const Review = require('../models/reviewModel');

// @desc    Add review for a course
// @route   POST /api/reviews
// @access  Private
const addReview = asyncHandler(async (req, res) => {
    const { courseId, rating, comment } = req.body;

    const reviewExists = await Review.findOne({ user: req.user._id, course: courseId });

    if (reviewExists) {
        res.status(400);
        throw new Error('You have already reviewed this course');
    }

    const review = await Review.create({
        user: req.user._id,
        course: courseId,
        rating,
        comment,
    });

    res.status(201).json(review);
});

// @desc    Get reviews for a course
// @route   GET /api/reviews/:courseId
// @access  Public
const getCourseReviews = asyncHandler(async (req, res) => {
    const reviews = await Review.find({ course: req.params.courseId })
        .populate('user', 'name')
        .sort('-createdAt');
    res.json(reviews);
});

module.exports = { addReview, getCourseReviews };
