const express = require('express');
const router = express.Router();
const { getLearningPath, generateQuiz, summarizeLesson } = require('../controllers/aiController');
const { protect, authorize } = require('../middleware/authMiddleware');

// AI-powered personal mentor routes
router.post('/learning-path', protect, getLearningPath);
router.post('/generate-quiz', protect, authorize('admin'), generateQuiz);
router.post('/summarize', protect, summarizeLesson);

module.exports = router;

