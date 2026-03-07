const express = require('express');
const router = express.Router();
const { getLearningPath } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

// AI-powered personal mentor routes
router.post('/learning-path', protect, getLearningPath);

module.exports = router;

