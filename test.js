require('dotenv').config({path: './backend/.env'});
const axios = require('axios');

async function test() {
    console.log("Key:", process.env.GEMINI_API_KEY);
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
    
    // Build Gemini payload for REST API
    const textPrompt = `Generate 1 recipe JSON`;
    const parts = [{ text: textPrompt }];
    const payload = {
        contents: [{ parts }]
    };

    try {
        const apiRes = await axios.post(url, payload, { headers: { "Content-Type": "application/json" } });
        console.log("Response:", apiRes.data.candidates[0].content.parts[0].text);
    } catch (apiError) {
        console.error("Error:", apiError.response ? apiError.response.data : apiError.message);
    }
}

test();
