const cron = require('node-cron');
const Enrollment = require('../models/enrollmentModel');
const User = require('../models/userModel');
const { generateReminderNote } = require('./aiService');
const sendEmail = require('./sendEmail');

const startReminderJob = () => {
    // Run every day at 9:00 AM
    cron.schedule('0 9 * * *', async () => {
        console.log('[Reminder Job]: Checking for inactive students...');

        try {
            // Find enrollments where progress < 100
            const enrollments = await Enrollment.find({ completed: false }).populate('user course');

            for (const enrollment of enrollments) {
                if (!enrollment.user || !enrollment.course) continue;

                const studyData = {
                    courseTitle: enrollment.course.title,
                    progress: enrollment.progress,
                    lastSession: enrollment.updatedAt ? new Date(enrollment.updatedAt).toLocaleDateString() : 'N/A'
                };

                const personalizedNote = await generateReminderNote(enrollment.user.name, studyData);

                const html = `
                    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                        <h2 style="color: #6366f1;">Keep Going, ${enrollment.user.name}!</h2>
                        <p style="font-size: 1.1rem; line-height: 1.6;">${personalizedNote}</p>
                        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                        <p style="font-size: 0.9rem; color: #666;">
                            You're currently at <strong>${enrollment.progress}%</strong> in the <strong>${enrollment.course.title}</strong> course.
                            One small step today brings you closer to your certificate!
                        </p>
                        <a href="${process.env.FRONTEND_URL || 'https://mj1-iota.vercel.app'}/course/${enrollment.course._id}" 
                           style="display: inline-block; background: #6366f1; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; margin-top: 10px;">
                            Resume Learning
                        </a>
                    </div>
                `;

                try {
                    await sendEmail({
                        to: enrollment.user.email,
                        subject: `Your Personalized Learning Update: ${enrollment.course.title}`,
                        html
                    });
                    console.log(`[Reminder Sent]: To ${enrollment.user.email} for ${enrollment.course.title}`);
                } catch (emailErr) {
                    console.error(`[Reminder Failed]: to ${enrollment.user.email}`, emailErr);
                }
            }
        } catch (error) {
            console.error('[Reminder Job Error]:', error);
        }
    });

    console.log('[Reminder Job]: Initialized and scheduled for 9:00 AM daily.');
};

module.exports = startReminderJob;
