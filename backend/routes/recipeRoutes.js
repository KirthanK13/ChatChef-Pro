const express = require('express');
const router = express.Router();
const multer = require('multer');
const recipeController = require('../controllers/recipeController');

// Set up multer to keep images in memory rather than writing to disk
const upload = multer({ storage: multer.memoryStorage() });

router.post('/generate', upload.array('images', 5), recipeController.generateRecipe);

module.exports = router;
