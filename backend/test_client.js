const axios = require('axios');

async function run() {
    try {
        const res = await axios.post('http://localhost:5000/api/recipes/generate', { ingredients: 'lemon, water, salt, sugar' });
        console.log(res.data);
    } catch(e) {
        console.error("HTTP Error", e.message, e.response?.data);
    }
}
run();
