const asyncHandler = require('express-async-handler');
const Enrollment = require('../models/enrollmentModel');
const Course = require('../models/courseModel');

// @desc    Enroll in a course
// @route   POST /api/enrollments
// @access  Private
const enrollInCourse = asyncHandler(async (req, res) => {
    const { courseId } = req.body;

    const alreadyEnrolled = await Enrollment.findOne({
        user: req.user._id,
        course: courseId,
    });

    if (alreadyEnrolled) {
        res.status(400);
        throw new Error('Already enrolled in this course');
    }

    const enrollment = await Enrollment.create({
        user: req.user._id,
        course: courseId,
    });

    res.status(201).json(enrollment);
});

// @desc    Get user's enrolled courses
// @route   GET /api/enrollments/my-courses
// @access  Private
const getMyCourses = asyncHandler(async (req, res) => {
    const enrollments = await Enrollment.find({ user: req.user._id }).populate('course');
    res.status(200).json(enrollments);
});

// @desc    Update course progress
// @route   PUT /api/enrollments/:courseId/progress
// @access  Private
const updateProgress = asyncHandler(async (req, res) => {
    const { lessonTitle } = req.body;
    const enrollment = await Enrollment.findOne({
        user: req.user._id,
        course: req.params.courseId,
    });

    if (!enrollment) {
        res.status(404);
        throw new Error('Enrollment not found');
    }

    if (!enrollment.completedLessons.includes(lessonTitle)) {
        enrollment.completedLessons.push(lessonTitle);

        // Calculate progress
        const course = await Course.findById(req.params.courseId);
        if (course && course.lessons.length > 0) {
            enrollment.progress = Math.round(
                (enrollment.completedLessons.length / course.lessons.length) * 100
            );
            if (enrollment.progress === 100) {
                enrollment.completed = true;
            }
        }

        // Award points for completing a lesson
        const user = await User.findById(req.user._id);
        if (user) {
            user.points += 10;
            await user.save();
        }

        await enrollment.save();
    }

    res.status(200).json(enrollment);
});

module.exports = {
    enrollInCourse,
    getMyCourses,
    updateProgress,
};
