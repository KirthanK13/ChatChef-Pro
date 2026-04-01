require('dotenv').config();
const axios = require('axios');

async function test() {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY.trim()}`;
    const textPrompt = `Generate 1 recipe JSON`;
    const parts = [{ text: textPrompt }];
    const payload = { contents: [{ parts }] };

    try {
        const apiRes = await axios.post(url, payload, { headers: { "Content-Type": "application/json" } });
        console.log("Response:", apiRes.data.candidates[0].content.parts[0].text);
    } catch (apiError) {
        console.error("Error:", JSON.stringify(apiError.response?.data || apiError.message, null, 2));
    }
}
test();
