const { OpenAI } = require('openai');
require('dotenv').config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY.replace(/['"]+/g, '') // remove quotes just in case
});

async function testKey() {
    try {
        console.log("Testing with key ending in: " + process.env.OPENAI_API_KEY.slice(-5));
        const response = await openai.models.list();
        console.log("SUCCESS! Models retrieved:", response.data.length);
    } catch (error) {
        console.error("ERROR from OpenAI API:");
        console.error("Status:", error.status);
        if (error.error) {
            console.error("Code:", error.error.code);
            console.error("Type:", error.error.type);
            console.error("Message:", error.error.message);
        } else {
            console.error(error.message);
        }
    }
}

testKey();
