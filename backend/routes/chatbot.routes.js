const express = require('express');
const ChatbotController = require('../controllers/chatbot.controller');
const { verifyToken } = require('../middleware/auth.middleware');

const router = express.Router();

// Process chatbot query
router.post('/query', verifyToken, ChatbotController.processQuery);

// Get best team suggestion
router.get('/best-team', verifyToken, ChatbotController.getBestTeam);

module.exports = router;