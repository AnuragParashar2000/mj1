const express = require('express');
const router = express.Router();
const {
    getDiscussions,
    createDiscussion,
    addReply
} = require('../controllers/discussionController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, createDiscussion);

router.route('/:courseId')
    .get(protect, getDiscussions);

router.route('/:id/reply')
    .post(protect, addReply);

module.exports = router;
