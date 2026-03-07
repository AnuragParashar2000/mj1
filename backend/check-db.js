const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Course = require('./models/courseModel');

async function checkCourses() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const premiumCourses = await Course.find({ isPremium: true });
        console.log('Premium Courses Found:', JSON.stringify(premiumCourses, null, 2));
        process.exit(0);
    } catch (error) {
        console.error('DATABASE ERROR:', error);
        process.exit(1);
    }
}

checkCourses();
