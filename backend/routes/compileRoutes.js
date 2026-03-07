const express = require('express');
const router = express.Router();
const { executeCode } = require('../controllers/compileController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', executeCode);

module.exports = router;
