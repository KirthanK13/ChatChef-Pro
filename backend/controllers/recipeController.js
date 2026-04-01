const axios = require('axios');

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=800&q=80";

exports.generateRecipe = async (req, res) => {
    try {
        const { ingredients } = req.body;
        const images = req.files || [];

        if (!ingredients && images.length === 0) {
            return res.status(400).json({ error: "Please provide textual ingredients or an image." });
        }

        if (!process.env.GEMINI_API_KEY) {
             return res.status(500).json({ error: "Gemini API Key is missing in .env configurations." });
        }

        let textPrompt = `You are an expert chef. Generate 3 distinct and creative recipes I can make. Return ONLY valid JSON in the exact structure below, with no surrounding markdown formatting or backticks.
{
  "recipes": [
    {
      "name": "Recipe Name",
      "ingredients": ["ingredient 1 list item", "ingredient 2 list item"],
      "steps": ["Step 1 description", "Step 2 description"]
    }
  ]
}
`;
        
        if (ingredients) {
            textPrompt += `\nI have the following ingredients: ${ingredients}. Focus on recipes that utilize these.`;
        }

        if (images.length > 0) {
            textPrompt += `\nAlso identify and incorporate ingredients found in the attached images.`;
        }

        // Build Gemini payload for REST API
        const parts = [{ text: textPrompt }];
        for (let img of images) {
            parts.push({
                inlineData: {
                    data: img.buffer.toString('base64'),
                    mimeType: img.mimetype
                }
            });
        }

        const payload = {
            contents: [{ parts }]
        };

        // 1. Ask Gemini to generate using axios to bypass local Node.js native fetch DNS bugs
        let recipesData = { recipes: [] };
        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY.trim()}`;
            const apiRes = await axios.post(url, payload, { headers: { "Content-Type": "application/json" }, timeout: 60000 });
            
            let responseText = apiRes.data.candidates[0].content.parts[0].text;
            
            // Clean up the text to extract pure JSON
            const jsonStart = responseText.indexOf('{');
            const jsonEnd = responseText.lastIndexOf('}');
            if (jsonStart !== -1 && jsonEnd !== -1) {
                responseText = responseText.substring(jsonStart, jsonEnd + 1);
            }
            recipesData = JSON.parse(responseText);
            
        } catch (apiError) {
            console.error("Gemini API Request failed:", apiError.response?.data || apiError.message);
            // Dynamic mock fallback
            let providedList = ["Mock Ingredient 1", "Mock Ingredient 2"];
            if (ingredients && typeof ingredients === 'string') {
                providedList = ingredients.split(',').map(i => i.trim()).filter(i => i);
            }
            return res.json({
                recipes: [
                    {
                        name: "Mock Fast Error Recipe (API Error)",
                        ingredients: providedList.length > 0 ? providedList : ["Generic Items"],
                        steps: ["Mix the items.", "Cook them.", "Eat."],
                        image: DEFAULT_IMAGE,
                        youtube: null
                    }
                ]
            });
        }

        if (!recipesData.recipes) recipesData.recipes = [];

        // 2. Enhance recipes with YouTube Videos and Pollinations.ai images
        for (let i = 0; i < recipesData.recipes.length; i++) {
            const recipe = recipesData.recipes[i];
            
            try {
                const searchQuery = encodeURIComponent(`${recipe.name} recipe food highly detailed`);
                recipe.image = `https://tse1.mm.bing.net/th?q=${searchQuery}&w=800&h=800&c=7`;
            } catch (imgError) {
                recipe.image = DEFAULT_IMAGE;
            }

            if (process.env.YOUTUBE_API_KEY) {
                try {
                    const ytRes = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
                        params: {
                            part: 'snippet',
                            q: recipe.name + ' recipe tutorial',
                            type: 'video',
                            maxResults: 1,
                            key: process.env.YOUTUBE_API_KEY.trim()
                        }
                    });
                    if (ytRes.data.items && ytRes.data.items.length > 0) {
                        recipe.youtube = `https://www.youtube.com/embed/${ytRes.data.items[0].id.videoId}`;
                    } else {
                        recipe.youtube = null;
                    }
                } catch (ytErr) {
                    console.error(`YouTube API error for ${recipe.name}`, ytErr.message);
                    recipe.youtube = null;
                }
            } else {
                recipe.youtube = null;
            }
        }

        res.json(recipesData);

    } catch (error) {
        console.error("Error generating recipe:", error);
        res.status(500).json({ error: error.message || "Failed to generate recipe" });
    }
};
