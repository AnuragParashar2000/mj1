const express = require('express');
const router = express.Router();
const {
  getPlatformStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes here are protected and admin-only
router.get('/stats', protect, authorize('admin'), getPlatformStats);
router.get('/users', protect, authorize('admin'), getAllUsers);
router.put('/users/:id/role', protect, authorize('admin'), updateUserRole);
router.delete('/users/:id', protect, authorize('admin'), deleteUser);

module.exports = router;


