require('dotenv').config();
const axios = require('axios');

async function test() {
    console.log("Key:", process.env.GEMINI_API_KEY);
    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`;
        const apiRes = await axios.get(url);
        const fs = require('fs');
        fs.writeFileSync('test_error.json', JSON.stringify(apiRes.data, null, 2));
    } catch (apiError) {
        const fs = require('fs');
        fs.writeFileSync('test_error.json', JSON.stringify(apiError.response ? apiError.response.data : apiError.message, null, 2));
    }
}

test();
