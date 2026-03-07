const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html }) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail', // You can change this or make it configurable
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER ? `"SkillSphereX" <${process.env.EMAIL_USER}>` : '"SkillSphereX" <noreply@skillspherex.com>',
            to,
            subject,
            html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email: ', error);
        throw error;
    }
};

module.exports = sendEmail;
