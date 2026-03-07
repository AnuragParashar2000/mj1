const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    getMe,
    getLeaderboard,
    updateStudyTime,
    getStudentStats,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.get('/leaderboard', getLeaderboard);
router.post('/study-session', protect, updateStudyTime);
router.get('/stats', protect, getStudentStats);

module.exports = router;
