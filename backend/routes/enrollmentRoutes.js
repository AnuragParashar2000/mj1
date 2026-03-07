const express = require('express');
const router = express.Router();
const {
    enrollInCourse,
    getMyCourses,
    updateProgress,
} = require('../controllers/enrollmentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, enrollInCourse);
router.get('/my-courses', protect, getMyCourses);
router.put('/:courseId/progress', protect, updateProgress);

module.exports = router;
