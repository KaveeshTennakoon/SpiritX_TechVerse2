const Team = require('../models/team.model');
const User = require('../models/user.model');
const Player = require('../models/player.model');

// Team Controller
const TeamController = {
  // Get user's team
  getUserTeam: async (req, res) => {
    try {
      // Get user ID from JWT token
      const userId = req.userId;
      
      const team = await Team.getUserTeam(userId);
      const teamCount = await Team.getTeamCount(userId);
      const user = await User.findById(userId);
      
      // Remove points from player data for user view
      const teamForUser = team.map(player => {
        const { player_points, ...playerWithoutPoints } = player;
        return playerWithoutPoints;
      });
      
      res.status(200).json({
        team: teamForUser,
        team_count: teamCount,
        team_complete: teamCount === 11,
        budget: user.budget,
        team_points: teamCount === 11 ? user.team_points : 0
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Add player to team
  addPlayerToTeam: async (req, res) => {
    try {
      const userId = req.userId;
      const playerId = req.params.playerId;
      
      const result = await Team.addPlayer(userId, playerId);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Remove player from team
  removePlayerFromTeam: async (req, res) => {
    try {
      const userId = req.userId;
      const playerId = req.params.playerId;
      
      const result = await Team.removePlayer(userId, playerId);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Get team completeness status
  getTeamStatus: async (req, res) => {
    try {
      const userId = req.userId;
      
      const teamCount = await Team.getTeamCount(userId);
      const isComplete = await Team.isTeamComplete(userId);
      
      res.status(200).json({
        team_count: teamCount,
        is_complete: isComplete,
        status: `${teamCount}/11 players selected`
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
    },
    // Get user budget
  getUserBudget: async (req, res) => {
    try {
      const userId = req.userId;
      
      const user = await User.findById(userId);
      const team = await Team.getUserTeam(userId);
      
      // Calculate how much spent on each player
      const playerSpending = team.map(player => ({
        id: player.id,
        name: player.name,
        value: player.player_value
      }));
      
      const totalSpent = playerSpending.reduce((sum, player) => sum + player.value, 0);
      
      res.status(200).json({
        available_budget: user.budget,
        total_spent: totalSpent,
        initial_budget: 9000000,
        player_spending: playerSpending
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get leaderboard
  getLeaderboard: async (req, res) => {
    try {
      const leaderboard = await User.getLeaderboard();
      
      // Add current user indicator
      const userId = req.userId;
      const leaderboardWithCurrentUser = leaderboard.map(user => ({
        ...user,
        is_current_user: user.id === parseInt(userId)
      }));
      
      res.status(200).json(leaderboardWithCurrentUser);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = TeamController;