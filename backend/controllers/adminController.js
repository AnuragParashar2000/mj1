const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const Course = require('../models/courseModel');
const Enrollment = require('../models/enrollmentModel');
const { Attempt } = require('../models/quizModel');

// @desc    Get platform-level analytics for admin dashboard
// @route   GET /api/admin/stats
// @access  Private/Admin
const getPlatformStats = asyncHandler(async (req, res) => {
  const [totalUsers, totalCourses, totalAttempts, attempts, enrollments] = await Promise.all([
    User.countDocuments({}),
    Course.countDocuments({}),
    Attempt.countDocuments({}),
    Attempt.find({}).populate([
      {
        path: 'quiz',
        select: 'course',
        populate: { path: 'course', select: 'title' },
      },
      { path: 'user', select: 'name email' },
    ]),
    Enrollment.find({}).populate('course user'),
  ]);

  let averageScore = 0;
  if (attempts.length > 0) {
    const sum = attempts.reduce((acc, a) => acc + (a.score || 0), 0);
    averageScore = Math.round(sum / attempts.length);
  }

  // Build a simple "attempts per course" distribution for engagement charts
  const attemptsPerCourseMap = {};
  attempts.forEach((attempt) => {
    const course = attempt.quiz && attempt.quiz.course;
    if (!course) return;
    const id = course._id.toString();
    if (!attemptsPerCourseMap[id]) {
      attemptsPerCourseMap[id] = {
        courseId: id,
        title: course.title,
        attempts: 0,
      };
    }
    attemptsPerCourseMap[id].attempts += 1;
  });

  const attemptsPerCourse = Object.values(attemptsPerCourseMap).sort(
    (a, b) => b.attempts - a.attempts
  );

  // Course-level funnel: enrollments → completed → certificates
  const funnelsByCourse = {};
  enrollments.forEach((en) => {
    if (!en.course) return;
    const id = en.course._id.toString();
    if (!funnelsByCourse[id]) {
      funnelsByCourse[id] = {
        courseId: id,
        title: en.course.title,
        enrolled: 0,
        completed: 0,
        certificates: 0,
      };
    }
    funnelsByCourse[id].enrolled += 1;
    if (en.completed) funnelsByCourse[id].completed += 1;
    if (en.certificateEarned) funnelsByCourse[id].certificates += 1;
  });

  const courseFunnels = Object.values(funnelsByCourse).map((f) => {
    const completionRate = f.enrolled ? Math.round((f.completed / f.enrolled) * 100) : 0;
    const certificationRate = f.enrolled ? Math.round((f.certificates / f.enrolled) * 100) : 0;
    return {
      ...f,
      completionRate,
      certificationRate,
    };
  });

  // Student-level performance for top/struggling views
  const userScores = {};
  attempts.forEach((attempt) => {
    if (!attempt.user) return;
    const id = attempt.user._id.toString();
    if (!userScores[id]) {
      userScores[id] = {
        userId: id,
        name: attempt.user.name,
        email: attempt.user.email,
        totalScore: 0,
        attempts: 0,
      };
    }
    userScores[id].totalScore += attempt.score || 0;
    userScores[id].attempts += 1;
  });

  const performance = Object.values(userScores).map((u) => ({
    ...u,
    averageScore: u.attempts ? Math.round(u.totalScore / u.attempts) : 0,
  }));

  const sortedByScore = performance.sort((a, b) => b.averageScore - a.averageScore);
  const topPerformers = sortedByScore.slice(0, 3);
  const needsAttention = sortedByScore
    .filter((u) => u.attempts >= 2 && u.averageScore < 60)
    .slice(0, 3);

  // User growth stats (last 7 days)
  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();

  const userGrowth = last7Days.map(date => ({
    date,
    count: enrollments.filter(e => {
      try {
        return e.createdAt && e.createdAt.toISOString().split('T')[0] === date;
      } catch (err) {
        console.error('Error processing enrollment date:', e._id, err);
        return false;
      }
    }).length
  }));

  // Revenue stats (last 7 days)
  const revenueStats = last7Days.map(date => {
    const amount = enrollments
      .filter(e => {
        try {
          return e.createdAt && e.createdAt.toISOString().split('T')[0] === date;
        } catch (err) {
          return false;
        }
      })
      .reduce((acc, e) => acc + (e.paidAmount || 0), 0);
    return { date, amount };
  });

  const totalRevenue = enrollments.reduce((acc, e) => acc + (e.paidAmount || 0), 0);

  const popularCourses = Object.values(funnelsByCourse)
    .sort((a, b) => b.enrolled - a.enrolled)
    .slice(0, 5);

  res.status(200).json({
    totalUsers,
    totalCourses,
    totalAttempts,
    totalRevenue,
    averageScore,
    userGrowth,
    revenueStats,
    popularCourses,
    courseFunnels,
    topPerformers,
    needsAttention,
  });
});

// @desc    Get all users (admin only, without passwords)
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password').sort({ createdAt: -1 });
  res.status(200).json(users);
});

// @desc    Update a user's role (student/admin)
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;

  if (!['student', 'admin'].includes(role)) {
    res.status(400);
    throw new Error('Invalid role');
  }

  // Prevent an admin from accidentally changing their own role
  if (req.params.id.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error('You cannot change your own role');
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.role = role;
  await user.save();

  const safeUser = user.toObject();
  delete safeUser.password;

  res.status(200).json(safeUser);
});

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  // Do not allow deleting yourself
  if (req.params.id.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error('You cannot delete your own account from this screen');
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  await user.deleteOne();
  res.status(200).json({ message: 'User deleted' });
});

module.exports = {
  getPlatformStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
};


