const { OpenAI } = require('openai');
const dotenv = require('dotenv');

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate 5 multiple-choice questions based on lesson content.
 */
const generateQuizFromContent = async (content) => {
    const prompt = `
    Based on the following educational content, generate 5 high-quality multiple-choice questions.
    Each question should have 4 options and 1 correct answer.
    Return ONLY a JSON array in this format:
    [
      {
        "question": "The question text",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswer": "The exact text of the correct option"
      }
    ]

    Content:
    ${content}
    `;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
        });

        const resultText = response.choices[0].message.content;
        return JSON.parse(resultText);
    } catch (error) {
        console.error('AI Quiz Generation Error:', error);
        throw new Error('Failed to generate quiz');
    }
};

/**
 * Generate a 3-bullet point summary of long content.
 */
const summarizeContent = async (content) => {
    const prompt = `
    Summarize the following educational content into exactly 3 concise bullet points.
    Return ONLY the bullet points, no extra text.

    Content:
    ${content}
    `;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.5,
        });

        return response.choices[0].message.content.trim();
    } catch (error) {
        console.error('AI Summarization Error:', error);
        throw new Error('Failed to summarize content');
    }
};

/**
 * Generate a personalized study reminder note.
 */
const generateReminderNote = async (userName, studyData) => {
    const prompt = `
    Generate a short, motivational study reminder for a student named ${userName}.
    They are currently studying: ${studyData.courseTitle}.
    Progress: ${studyData.progress}%.
    Last session: ${studyData.lastSession}.
    
    Make it friendly and encouraging. Mention a specific next step like taking a quiz or watching the next lesson.
    Keep it under 3 sentences.
    `;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.8,
        });

        return response.choices[0].message.content.trim();
    } catch (error) {
        return `Hey ${userName}, ready to jump back into ${studyData.courseTitle}? You're doing great at ${studyData.progress}%!`;
    }
};

module.exports = {
    generateQuizFromContent,
    summarizeContent,
    generateReminderNote,
};
