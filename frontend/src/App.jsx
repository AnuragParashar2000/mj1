import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import CourseList from './pages/CourseList';
import CourseView from './pages/CourseView';
import LessonView from './pages/LessonView';
import AdminCourses from './pages/Admin/AdminCourses';
import QuizView from './pages/QuizView';
import Analytics from './pages/Admin/Analytics';
import UserManagement from './pages/Admin/UserManagement';
import CertificateView from './pages/CertificateView';
import AIMentor from './pages/AIMentor';
import Landing from './pages/Landing';
import Compiler from './pages/Compiler';
import Leaderboard from './pages/Leaderboard';
import PrivateRoute from './components/PrivateRoute';
import ChatWidget from './components/ChatWidget';
import './index.css';

function App() {
  return (
    <Router>
      <ChatWidget />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/courses" element={<PrivateRoute><CourseList /></PrivateRoute>} />
        <Route path="/course/:id" element={<PrivateRoute><CourseView /></PrivateRoute>} />
        <Route path="/lesson/:courseId/:lessonIndex" element={<PrivateRoute><LessonView /></PrivateRoute>} />
        <Route path="/mentor" element={<PrivateRoute><AIMentor /></PrivateRoute>} />
        <Route path="/admin/courses" element={<PrivateRoute><AdminCourses /></PrivateRoute>} />
        <Route path="/admin/analytics" element={<PrivateRoute><Analytics /></PrivateRoute>} />
        <Route path="/admin/users" element={<PrivateRoute><UserManagement /></PrivateRoute>} />
        <Route path="/compiler" element={<PrivateRoute><Compiler /></PrivateRoute>} />
        <Route path="/quiz/:id" element={<PrivateRoute><QuizView /></PrivateRoute>} />
        <Route path="/certificate/:id" element={<PrivateRoute><CertificateView /></PrivateRoute>} />
        <Route path="/leaderboard" element={<PrivateRoute><Leaderboard /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
