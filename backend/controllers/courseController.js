const asyncHandler = require('express-async-handler');
const Course = require('../models/courseModel');
const Review = require('../models/reviewModel');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
const getCourses = asyncHandler(async (req, res) => {
    const courses = await Course.find({});

    // Add average rating to each course
    const coursesWithRatings = await Promise.all(courses.map(async (course) => {
        const reviews = await Review.find({ course: course._id });
        const reviewCount = reviews.length;
        const averageRating = reviewCount > 0
            ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount
            : 0;

        return {
            ...course.toObject(),
            averageRating: Math.round(averageRating * 10) / 10,
            reviewCount
        };
    }));

    res.status(200).json(coursesWithRatings);
});

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
const getCourseById = asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id);

    if (course) {
        res.status(200).json(course);
    } else {
        res.status(404);
        throw new Error('Course not found');
    }
});

// @desc    Create a course
// @route   POST /api/courses
// @access  Private/Admin
const createCourse = asyncHandler(async (req, res) => {
    const { title, description, instructor, duration, coverImage, category } = req.body;

    const course = await Course.create({
        title,
        description,
        instructor,
        duration,
        coverImage,
        category,
    });

    if (course) {
        res.status(201).json(course);
    } else {
        res.status(400);
        throw new Error('Invalid course data');
    }
});

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private/Admin
const updateCourse = asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id);

    if (course) {
        const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        res.status(200).json(updatedCourse);
    } else {
        res.status(404);
        throw new Error('Course not found');
    }
});

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private/Admin
const deleteCourse = asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id);

    if (course) {
        await Course.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Course removed' });
    } else {
        res.status(404);
        throw new Error('Course not found');
    }
});

module.exports = {
    getCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
};
