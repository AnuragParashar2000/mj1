const asyncHandler = require('express-async-handler');
const { Quiz, Attempt } = require('../models/quizModel');
const Enrollment = require('../models/enrollmentModel');
const sendEmail = require('../utils/sendEmail');

// @desc    Get all quizzes for a course
// @route   GET /api/quizzes/course/:courseId
// @access  Private
const getQuizzesByCourse = asyncHandler(async (req, res) => {
    const quizzes = await Quiz.find({ course: req.params.courseId });
    res.status(200).json(quizzes);
});

// @desc    Create a quiz
// @route   POST /api/quizzes
// @access  Private/Admin
const createQuiz = asyncHandler(async (req, res) => {
    const { course, title, description, questions, passingScore } = req.body;

    const quiz = await Quiz.create({
        course,
        title,
        description,
        questions,
        passingScore,
    });

    if (quiz) {
        res.status(201).json(quiz);
    } else {
        res.status(400);
        throw new Error('Invalid quiz data');
    }
});

// @desc    Submit a quiz and auto-grade
// @route   POST /api/quizzes/:id/submit
// @access  Private
const submitQuiz = asyncHandler(async (req, res) => {
    const { answers } = req.body;
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
        res.status(404);
        throw new Error('Quiz not found');
    }

    let correctCount = 0;
    quiz.questions.forEach((question, index) => {
        if (answers[index] === question.correctAnswer) {
            correctCount++;
        }
    });

    const score = (correctCount / quiz.questions.length) * 100;
    const passed = score >= quiz.passingScore;

    const attempt = await Attempt.create({
        user: req.user._id,
        quiz: quiz._id,
        score,
        passed,
        answers,
    });

    let enrollmentId = null;
    // Unique Edge: Auto-award achievements
    if (passed) {
        const enrollment = await Enrollment.findOne({ user: req.user._id, course: quiz.course });
        if (enrollment) {
            enrollment.certificateEarned = true;
            enrollment.progress = 100;
            enrollment.completed = true;

            // Tiered badging system
            if (score === 100) enrollment.badgeEarned = 'Gold';
            else if (score >= 80) enrollment.badgeEarned = 'Silver';
            else enrollment.badgeEarned = 'Bronze';

            await enrollment.save();
            enrollmentId = enrollment._id;

            // Award points for passing quiz
            const user = await User.findById(req.user._id);
            if (user) {
                user.points += 50;
                await user.save();
            }

            // Send congratulatory email
            try {
                await sendEmail({
                    to: req.user.email,
                    subject: `Congratulations! You've earned a certificate for ${quiz.title}`,
                    html: `
                        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                            <h2 style="color: #4f46e5;">Congratulations, ${req.user.name}!</h2>
                            <p>You have successfully passed the quiz for <strong>${quiz.title}</strong> with a score of ${score}%!</p>
                            <p>You have earned a <strong>${enrollment.badgeEarned} Badge</strong> and your certificate is now available.</p>
                            <br/>
                            <p>Log in to your dashboard to view and download your certificate.</p>
                            <br/>
                            <p>Keep up the great work!</p>
                            <p><strong>The SkillSphereX Team</strong></p>
                        </div>
                    `,
                });
            } catch (error) {
                console.error('Failed to send congratulatory email:', error);
            }
        }
    }

    res.status(200).json({
        score,
        passed,
        correctCount,
        totalQuestions: quiz.questions.length,
        attemptId: attempt._id,
        badgeEarned: passed ? (score === 100 ? 'Gold' : score >= 80 ? 'Silver' : 'Bronze') : null,
        enrollmentId
    });
});

// @desc    Get user attempts for a quiz
// @route   GET /api/quizzes/:id/attempts
// @access  Private
const getQuizAttempts = asyncHandler(async (req, res) => {
    const attempts = await Attempt.find({ user: req.user._id, quiz: req.params.id })
        .sort({ createdAt: -1 });
    res.status(200).json(attempts);
});

module.exports = {
    getQuizzesByCourse,
    createQuiz,
    submitQuiz,
    getQuizAttempts,
};
