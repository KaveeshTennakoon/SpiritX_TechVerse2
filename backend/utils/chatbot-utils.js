const Player = require('../models/player.model');
const Team = require('../models/team.model');
const User = require('../models/user.model');

// Utility functions for the Spiriter chatbot
const ChatbotUtils = {
  // Process user query
  processQuery: async (query, userId) => {
    query = query.toLowerCase();
    
    // Check if query is about player stats
    if (query.includes('stats') && (query.includes('player') || query.includes('stats for'))) {
      // Try to extract player name
      const players = await Player.findAll();
      
      // Look for player names in the query
      let matchedPlayer = null;
      for (const player of players) {
        if (query.includes(player.name.toLowerCase())) {
          matchedPlayer = player;
          break;
        }
      }
      
      if (matchedPlayer) {
        return formatPlayerStats(matchedPlayer);
      }
      
      return "Which player's stats would you like to know about?";
    }
    
    // Check if query is about best team
    if (query.includes('best team') || query.includes('strongest team') || 
        query.includes('recommend team') || query.includes('suggest team')) {
      return await suggestBestTeam(userId);
    }
    
    // Check if query is about player points (reject these)
    if (query.includes('points') || query.includes('score')) {
      return "I'm not allowed to reveal player points. I can help you with other information about players.";
    }
    
    // Default response
    return "I don't have enough knowledge to answer that question.";
  },
  
  // Get suggested best team
  getBestTeam: async () => {
    try {
      const allPlayers = await Player.findAll();
      
      // Sort players by points in descending order
      const sortedPlayers = [...allPlayers].sort((a, b) => 
        b.player_points - a.player_points
      );
      
      // Select top 11 players
      const bestTeam = sortedPlayers.slice(0, 11);
      
      return bestTeam;
    } catch (error) {
      console.error('Error getting best team:', error);
      throw error;
    }
  }
};

// Helper function to format player stats response
const formatPlayerStats = (player) => {
  return `
    Here are ${player.name}'s stats:
    University: ${player.university}
    Category: ${player.category}
    Total Runs: ${player.total_runs}
    Balls Faced: ${player.balls_faced}
    Innings Played: ${player.innings_played}
    Wickets: ${player.wickets}
    Overs Bowled: ${player.overs_bowled}
    Runs Conceded: ${player.runs_conceded}
  `;
};

// Helper function to suggest best team
const suggestBestTeam = async (userId) => {
  try {
    const bestTeam = await ChatbotUtils.getBestTeam();
    const user = await User.findById(userId);
    
    // Calculate total value of suggested team
    const totalValue = bestTeam.reduce((sum, player) => 
      sum + player.player_value, 0
    );
    
    // Check if user can afford this team
    const canAfford = totalValue <= 9000000;
    
    // Format team suggestion
    let response = "Based on player statistics, here's the best team I can suggest:\n\n";
    
    bestTeam.forEach((player, index) => {
      response += `${index + 1}. ${player.name} (${player.university}) - ${player.category}\n`;
    });
    
    if (!canAfford) {
      response += "\nNote: This team exceeds the budget of Rs.9,000,000. You may need to make adjustments.";
    }
    
    return response;
  } catch (error) {
    console.error('Error suggesting best team:', error);
    return "I'm having trouble suggesting a team. Please try again later.";
  }
};

module.exports = ChatbotUtils;