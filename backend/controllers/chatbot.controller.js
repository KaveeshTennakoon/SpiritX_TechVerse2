const ChatbotUtils = require('../utils/chatbot-utils');

// Chatbot Controller
const ChatbotController = {
  // Process user query
  processQuery: async (req, res) => {
    try {
      const userId = req.userId;
      const { query } = req.body;
      
      if (!query) {
        return res.status(400).json({ message: 'Query is required' });
      }
      
      const response = await ChatbotUtils.processQuery(query, userId);
      
      res.status(200).json({ response });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  
  // Get best team suggestion
  getBestTeam: async (req, res) => {
    try {
      const bestTeam = await ChatbotUtils.getBestTeam();
      
      // Remove points from player data
      const teamWithoutPoints = bestTeam.map(player => {
        const { player_points, ...playerWithoutPoints } = player;
        return playerWithoutPoints;
      });
      
      res.status(200).json({
        message: "Here's the best team based on player statistics:",
        team: teamWithoutPoints
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = ChatbotController;