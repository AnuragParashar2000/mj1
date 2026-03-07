const express = require('express');
const router = express.Router();
const { addReview, getCourseReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, addReview);

router.route('/:courseId')
    .get(getCourseReviews);

module.exports = router;
