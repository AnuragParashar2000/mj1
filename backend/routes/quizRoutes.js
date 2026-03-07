const express = require('express');
const router = express.Router();
const {
    getQuizzesByCourse,
    createQuiz,
    submitQuiz,
    getQuizAttempts,
} = require('../controllers/quizController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/course/:courseId', protect, getQuizzesByCourse);
router.post('/', protect, authorize('admin'), createQuiz);
router.post('/:id/submit', protect, submitQuiz);
router.get('/:id/attempts', protect, getQuizAttempts);

module.exports = router;
