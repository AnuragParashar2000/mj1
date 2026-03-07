const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const Course = require('../models/courseModel');
const { Quiz } = require('../models/quizModel');
const User = require('../models/userModel');

// Load environment variables
dotenv.config();

const seed = async () => {
  try {
    await connectDB();

    console.log('Seeding demo data...');

    // Ensure an admin user exists for managing content
    let admin = await User.findOne({ email: 'admin@skillspherex.com' });
    if (!admin) {
      admin = await User.create({
        name: 'Platform Admin',
        email: 'admin@skillspherex.com',
        password: 'Admin@123', // pre-save hook will hash this
        role: 'admin',
      });
      console.log('Created demo admin user: admin@skillspherex.com / Admin@123');
    } else {
      console.log('Demo admin already exists:', admin.email);
    }

    // Clear existing demo courses/quizzes created by this script (optional)
    await Quiz.deleteMany({});
    await Course.deleteMany({});

    // Demo courses
    const courses = await Course.insertMany([
      {
        title: 'Full-Stack Web Development Foundations',
        description:
          'A structured, project-based introduction to HTML, CSS, JavaScript, React, Node.js, and MongoDB using a real-world skill platform as the capstone.',
        instructor: 'SkillSphereX Faculty',
        duration: '6 Weeks',
        coverImage:
          'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=800',
        category: 'Full-Stack Development',
        isPremium: true,
        price: 15,
        lessons: [
          {
            title: 'Getting Started with the Web',
            content:
              'Understand how the web works, HTTP basics, and how browsers render HTML and CSS.',
            videoUrl: 'https://www.youtube.com/watch?v=5YDVJaItmaY',
          },
          {
            title: 'Modern JavaScript Essentials',
            content:
              'Variables, functions, ES6+ features, promises, and async/await in the context of web apps.',
            videoUrl: 'https://www.youtube.com/watch?v=Sb7S5tPZr4k',
          },
          {
            title: 'React & Component-Based UIs',
            content:
              'Building reusable components, props, state, hooks, and routing with React Router.',
            videoUrl: 'https://www.youtube.com/watch?v=SqcY0GlETPk',
          },
          {
            title: 'Node.js, Express, and MongoDB',
            content:
              'REST APIs with Express, MongoDB data modeling, and authentication using JWT.',
            videoUrl: 'https://www.youtube.com/watch?v=Oe421EPjeBE',
          },
          {
            title: 'Capstone: Building SkillSphereX',
            content:
              'Design and implement the SkillSphereX platform with courses, quizzes, and AI mentor integration.',
            videoUrl: 'https://www.youtube.com/watch?v=0mVbNp1ol_w',
          },
        ],
      },
      {
        title: 'Data Structures & Algorithms for Interviews',
        description:
          'Master the most common data structures and algorithms asked in technical interviews with practice questions and quizzes.',
        instructor: 'Interview Prep Team',
        duration: '4 Weeks',
        coverImage:
          'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=800',
        category: 'Algorithms & Problem Solving',
        lessons: [
          {
            title: 'Time & Space Complexity',
            content:
              'Big-O notation, complexity classes, and how to reason about performance.',
            videoUrl: 'https://www.youtube.com/watch?v=MOe-v6tKDAk',
          },
          {
            title: 'Arrays & Strings',
            content:
              'Patterns for sliding window, two pointers, and frequency maps.',
            videoUrl: 'https://www.youtube.com/watch?v=ZWXQ3c5tIwE',
          },
          {
            title: 'Linked Lists & Hash Tables',
            content:
              'Implementation ideas and common interview problems involving lists and maps.',
            videoUrl: 'https://www.youtube.com/watch?v=0lP6cX4ZUmw',
          },
          {
            title: 'Trees & Graphs',
            content:
              'Traversal techniques (DFS/BFS), shortest paths, and topological sort.',
            videoUrl: 'https://www.youtube.com/watch?v=0eUVejasGQg',
          },
        ],
      },
    ]);

    console.log(`Created ${courses.length} demo courses.`);

    // Create quizzes for each course
    const [fullStack, dsa] = courses;

    await Quiz.create({
      course: fullStack._id,
      title: 'Full-Stack Web Development Checkpoint',
      description: 'Assess your understanding of the core full-stack concepts.',
      difficulty: 'Beginner',
      passingScore: 70,
      questions: [
        {
          questionText: 'Which HTTP method is typically used to create a new resource?',
          options: ['GET', 'POST', 'PUT', 'DELETE'],
          correctAnswer: 1,
        },
        {
          questionText: 'In React, which hook is primarily used for managing component state?',
          options: ['useState', 'useEffect', 'useMemo', 'useRef'],
          correctAnswer: 0,
        },
        {
          questionText: 'What does JWT stand for?',
          options: [
            'Java Web Token',
            'JSON Web Token',
            'JavaScript Web Token',
            'Joined Web Token',
          ],
          correctAnswer: 1,
        },
        {
          questionText: 'Which database is used in this project stack?',
          options: ['MySQL', 'PostgreSQL', 'MongoDB', 'SQLite'],
          correctAnswer: 2,
        },
      ],
    });

    await Quiz.create({
      course: dsa._id,
      title: 'DSA Core Concepts Quiz',
      description: 'Quick check on core data structures and algorithms.',
      difficulty: 'Beginner',
      passingScore: 65,
      questions: [
        {
          questionText: 'What is the time complexity of binary search on a sorted array?',
          options: ['O(1)', 'O(n)', 'O(log n)', 'O(n log n)'],
          correctAnswer: 2,
        },
        {
          questionText: 'Which data structure is best suited for implementing a FIFO queue?',
          options: ['Stack', 'Linked List', 'Hash Table', 'Binary Tree'],
          correctAnswer: 1,
        },
        {
          questionText:
            'Which traversal visits the left subtree, then the node, then the right subtree?',
          options: ['Pre-order', 'In-order', 'Post-order', 'Level-order'],
          correctAnswer: 1,
        },
      ],
    });

    // Advanced quiz for DSA to demonstrate adaptive difficulty
    await Quiz.create({
      course: dsa._id,
      title: 'DSA Advanced Challenges',
      description: 'Harder questions for learners who clear the core quiz easily.',
      difficulty: 'Advanced',
      passingScore: 75,
      questions: [
        {
          questionText:
            'Which data structure is typically used to implement Dijkstra’s shortest path algorithm efficiently?',
          options: ['Queue', 'Stack', 'Priority Queue (Min-Heap)', 'Hash Map'],
          correctAnswer: 2,
        },
        {
          questionText:
            'What is the time complexity of inserting an element into a balanced binary search tree (average case)?',
          options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
          correctAnswer: 1,
        },
        {
          questionText:
            'Which algorithmic paradigm does the QuickSort algorithm primarily use?',
          options: ['Dynamic Programming', 'Divide and Conquer', 'Greedy', 'Backtracking'],
          correctAnswer: 1,
        },
      ],
    });

    console.log('Created quizzes for demo courses.');
    console.log('Seeding complete.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seed();

