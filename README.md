## SkillSphereX – AI-Powered Skill & Assessment Platform

SkillSphereX is a full-stack learning platform where students can discover courses, take structured quizzes, earn badges/certificates, and get guidance from an AI mentor that uses their real activity data.

### Tech Stack

- **Frontend**: React (Vite), React Router, Axios, Lucide icons.
- **Backend**: Node.js, Express 5, MongoDB (Mongoose), JWT auth, bcrypt.
- **AI Integration**: OpenAI Chat Completions API (with safe rule-based fallback).

### Key Features

- **Course & Assessment Flow**
  - Admin-managed course catalog with lessons and video links.
  - Per-course quizzes with auto-grading and attempt history.
  - Tiered achievement system (Bronze/Silver/Gold badges) and printable certificates.

- **AI Personal Skill Mentor**
  - Aggregates a learner’s enrollments, quiz attempts, progress, and the catalog.
  - Generates a personalized, time-bound learning plan (4-week schedule) using their goal and weekly hours.
  - Graceful fallback to an on-platform mentor when external AI is not available.

- **Smart Quiz Experience**
  - Difficulty levels on quizzes (e.g., Beginner and Advanced DSA quizzes).
  - Adaptive suggestion of advanced quizzes for learners who pass easily.
  - Smart feedback for learners who fail multiple times, encouraging targeted revision.

- **Student Dashboard**
  - My Learning Dashboard with progress on enrolled courses.
  - Professional Achievements (badges and certificates).
  - Learning Timeline showing enrollment, progress, and completion history.
  - First-time guided onboarding explaining Courses, AI Mentor, and Dashboard sections.

- **Admin Dashboard**
  - Manage Courses (create, edit, delete).
  - User Management with role changes (student/admin) and user deletion.
  - Platform Analytics:
    - Total users, courses, attempts, average pass score.
    - Engagement chart: quiz attempts per course.
    - Course funnel (enrolled → completed → certified, with rates).
    - Top performers and students who need attention.

### Running the Project

1. Install dependencies:

```bash
npm install
npm install --prefix backend
npm install --prefix frontend
```

2. Configure `.env` in the project root:

```bash
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
NODE_ENV=development
OPENAI_API_KEY=your_openai_key   # optional; app falls back if missing or rate-limited
OPENAI_MODEL=gpt-4.1-mini
```

3. Seed demo data (admin user, demo courses, quizzes):

```bash
cd backend
node seeds/seedDemoData.js
cd ..
```

4. Start the app:

```bash
npm run dev
```

Frontend will be available on the Vite dev URL (e.g., `http://localhost:5174`), and the API on `http://localhost:5001`.

### Demo Credentials

- **Admin**
  - Email: `admin@skillspherex.com`
  - Password: `Admin@123`

- **Student**
  - Register a new account from the Register page.

### Recommended Exam Demo Flow

1. **Student Journey**
   - Register/login as a student.
   - Enroll in a course and view lessons.
   - Take a quiz, see auto-grading, and (optionally) unlock advanced DSA quiz.
   - Earn a badge/certificate and view it from the dashboard and certificate screen.
   - Open **AI Skill Mentor**, enter a goal and weekly hours, and show the personalized plan.

2. **Admin Journey**
   - Log in as admin (`admin@skillspherex.com` / `Admin@123`).
   - Show **Manage Courses** (demo courses), **User Management** (roles and actions), and **Analytics**:
     - Engagement chart (attempts per course).
     - Course funnel metrics.
     - Top performers and struggling students.

