const express = require('express');
const router = express.Router();
const { getSnippets, saveSnippet } = require('../controllers/snippetController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getSnippets)
    .post(protect, saveSnippet);

module.exports = router;
