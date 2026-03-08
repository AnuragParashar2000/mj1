const asyncHandler = require('express-async-handler');
const { generateQuizFromContent, summarizeContent } = require('../utils/aiService');
const axios = require('axios');
const Course = require('../models/courseModel');
const Enrollment = require('../models/enrollmentModel');
const { Attempt } = require('../models/quizModel');

// @desc    Generate an AI-powered personalized learning plan for the current user
// @route   POST /api/ai/learning-path
// @access  Private
const getLearningPath = asyncHandler(async (req, res) => {
  const { goal, weeklyHours } = req.body;

  // Load core learning data for this user
  const [enrollments, attempts, allCourses] = await Promise.all([
    Enrollment.find({ user: req.user._id }).populate('course'),
    Attempt.find({ user: req.user._id }).populate({
      path: 'quiz',
      populate: { path: 'course' },
    }),
    Course.find({}),
  ]);

  // Lightweight summary to send to the AI / to use heuristically
  const learningSnapshot = {
    user: {
      id: req.user._id,
      name: req.user.name,
      role: req.user.role,
    },
    goal: goal || 'Not specified',
    weeklyHours: weeklyHours || 5,
    enrollments: enrollments.map((e) => ({
      courseId: e.course?._id,
      title: e.course?.title,
      category: e.course?.category,
      progress: e.progress,
      completed: e.completed,
      badgeEarned: e.badgeEarned,
      certificateEarned: e.certificateEarned,
    })),
    attempts: attempts.map((a) => ({
      quizId: a.quiz?._id,
      quizTitle: a.quiz?.title,
      courseTitle: a.quiz?.course?.title,
      score: a.score,
      passed: a.passed,
      createdAt: a.createdAt,
    })),
    catalog: allCourses.map((c) => ({
      id: c._id,
      title: c.title,
      category: c.category,
      duration: c.duration,
    })),
  };

  // If no API key is configured, fall back to a rule-based mentor so the
  // feature still works during demos without external AI access.
  if (!process.env.OPENAI_API_KEY) {
    const beginnerTracks = learningSnapshot.catalog.slice(0, 3);
    return res.status(200).json({
      mode: 'rule-based',
      summary: 'AI key not configured – using an on-platform mentor.',
      learningSnapshot,
      plan: {
        focusAreas: [
          'Complete any in-progress courses to 100% before starting many new ones.',
          'Retake quizzes where your score is below 70% and review the course lessons in those topics.',
        ],
        suggestedCourses: beginnerTracks,
        weeklyPlan: [
          'Spend 2–3 focused sessions per week on your primary course.',
          'Use one session per week just for quiz practice and reflection.',
        ],
        mindsetTips: [
          'Keep assessments low-stakes: they are a diagnostic, not a judgment.',
          'Track your improvements across attempts rather than single scores.',
        ],
      },
    });
  }

  // AI-backed mentor: call an LLM to turn the snapshot into a concrete plan
  try {
    const prompt = `
You are an expert AI learning coach inside a platform called SkillSphereX.
The platform offers online courses with quizzes, enrollments, badges, and certificates.

You are given structured JSON data about a learner:
- Their goal and available weekly study hours
- Their enrolled courses and progress
- Their quiz attempts and scores
- The full course catalog (title, category, duration)

TASK:
1. Analyse their current state and weaknesses.
2. Recommend 3–6 specific courses from the catalog as a step-by-step learning path.
3. Design a weekly study schedule for the next 4 weeks that fits within their weekly hours.
4. Suggest when they should take or retake quizzes, based on their past attempts.
5. Give 3 short, motivational tips tailored to their situation.

RESPONSE FORMAT:
Return a valid JSON object with the following shape (no extra keys, no commentary):
{
  "summary": "one-paragraph overview",
  "focusAreas": ["short bullet", "short bullet"],
  "recommendedCourses": [
    { "id": "courseId", "title": "Course title", "reason": "why this course" }
  ],
  "weeklySchedule": [
    {
      "week": 1,
      "hours": 5,
      "activities": ["bullet", "bullet"]
    }
  ],
  "quizStrategy": ["short bullet", "short bullet"],
  "motivationTips": ["short sentence", "short sentence", "short sentence"]
}

Here is the learner data (as JSON):
${JSON.stringify(learningSnapshot, null, 2)}
`;

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
        messages: [
          {
            role: 'system',
            content:
              'You are a precise learning coach. Always return STRICTLY valid JSON as instructed.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.4,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const content = response.data.choices?.[0]?.message?.content || '{}';
    let plan;
    try {
      plan = JSON.parse(content);
    } catch {
      // If the model responded with non-JSON for some reason, still return
      // something useful rather than failing the entire request.
      plan = { summary: content };
    }

    return res.status(200).json({
      mode: 'ai',
      learningSnapshot,
      plan,
    });
  } catch (error) {
    console.error('AI mentor error:', error.message);

    // Graceful fallback: if the external AI call fails (e.g., 401/429/rate limit),
    // still provide a useful on-platform, rule-based plan instead of a hard error.
    const fallbackCourses = learningSnapshot.catalog.slice(0, 3);
    return res.status(200).json({
      mode: 'rule-based-fallback',
      learningSnapshot,
      plan: {
        summary:
          'External AI service is temporarily unavailable, so this plan was generated using your enrollments, quiz history, and catalog data directly on the platform.',
        focusAreas: [
          'Finish any courses where progress is between 40% and 90% before starting too many new ones.',
          'Prioritize topics where your past quiz scores are below the passing threshold.',
        ],
        recommendedCourses: fallbackCourses.map((c, index) => ({
          id: c.id,
          title: c.title,
          reason:
            index === 0
              ? 'Best primary course to align with your current goal and available time.'
              : 'Supplementary course to deepen or broaden your core skills.',
        })),
        weeklySchedule: [
          {
            week: 1,
            hours: weeklyHours || 5,
            activities: [
              'Review course content for your main course and re-watch any difficult lessons.',
              'Attempt or reattempt quizzes in your weakest topic area.',
            ],
          },
          {
            week: 2,
            hours: weeklyHours || 5,
            activities: [
              'Progress at least 20% further in your main course.',
              'Take a timed practice quiz and reflect on mistakes.',
            ],
          },
        ],
        quizStrategy: [
          'Always do a quick revision of notes before retaking any quiz.',
          'If you fail a quiz twice, slow down and focus on the underlying concept instead of guessing.',
        ],
        motivationTips: [
          'Consistency beats intensity – even 45 focused minutes daily compounds quickly.',
          'Use your badges and certificates as milestones, not the final destination.',
          'Track your improvements across quiz attempts to see real growth.',
        ],
      },
    });
  }
});

// @desc    Generate quiz questions from lesson content
// @route   POST /api/ai/generate-quiz
// @access  Private/Admin
const generateQuiz = asyncHandler(async (req, res) => {
  const { content } = req.body;
  if (!content) {
    res.status(400);
    throw new Error('Content is required');
  }
  const questions = await generateQuizFromContent(content);
  res.json(questions);
});

// @desc    Summarize lesson content
// @route   POST /api/ai/summarize
// @access  Private
const summarizeLesson = asyncHandler(async (req, res) => {
  const { content } = req.body;
  if (!content) {
    res.status(400);
    throw new Error('Content is required');
  }
  const summary = await summarizeContent(content);
  res.json({ summary });
});

module.exports = {
  getLearningPath,
  generateQuiz,
  summarizeLesson,
};

