const axios = require('axios');

const executeCode = async (req, res) => {
    const { script, language, versionIndex } = req.body;

    if (!script || !language || !versionIndex) {
        return res.status(400).json({ message: 'Script, language, and versionIndex are required' });
    }

    try {
        const response = await axios.post('https://api.jdoodle.com/v1/execute', {
            clientId: process.env.JDOODLE_CLIENT_ID || '41709bc42e5c7a45dfb3c208feed8e06',
            clientSecret: process.env.JDOODLE_CLIENT_SECRET || 'bff5225bd4e4d8e52d5876ef2233a1ed09487f7d0343f7cd896a8f1e9e323f16',
            script,
            language,
            versionIndex
        });

        // Format JDoodle specific error output for the frontend
        let outputData = response.data;
        if (outputData.error || outputData.compilationStatus) {
            outputData.error = outputData.error || outputData.compilationStatus;
        }

        res.json(outputData);
    } catch (error) {
        console.error('JDoodle API error:', error.response ? error.response.data : error.message);
        res.status(500).json({ message: 'Failed to execute code on JDoodle', details: error.message });
    }
};

module.exports = { executeCode };
