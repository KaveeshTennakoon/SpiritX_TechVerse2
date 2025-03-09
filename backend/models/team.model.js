const { pool } = require('../config/db');
const Player = require('./player.model');
const User = require('./user.model');

// Team Model
const Team = {
  // Add player to user's team
  addPlayer: async (userId, playerId) => {
    try {
      // First check if player already exists in team
      const [existingPlayer] = await pool.query(
        'SELECT * FROM user_teams WHERE user_id = ? AND player_id = ?',
        [userId, playerId]
      );
      
      if (existingPlayer.length > 0) {
        throw new Error('Player already in team');
      }
      
      // Get current team count
      const [teamCount] = await pool.query(
        'SELECT COUNT(*) as count FROM user_teams WHERE user_id = ?',
        [userId]
      );
      
      if (teamCount[0].count >= 11) {
        throw new Error('Team already has 11 players');
      }
      
      // Get player value
      const player = await Player.findById(playerId);
      if (!player) {
        throw new Error('Player not found');
      }
      
      // Check user's budget
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }
      
      if (user.budget < player.player_value) {
        throw new Error('Insufficient budget');
      }
      
      // Add player to team
      await pool.query(
        'INSERT INTO user_teams (user_id, player_id) VALUES (?, ?)',
        [userId, playerId]
      );
      
      // Update user's budget
      const newBudget = user.budget - player.player_value;
      await User.updateBudget(userId, newBudget);
      
      // Calculate and update team points if team is complete
      await Team.calculateTeamPoints(userId);
      
      return { success: true, message: 'Player added to team' };
    } catch (error) {
      throw error;
    }
  },

  // Remove player from user's team
  removePlayer: async (userId, playerId) => {
    try {
      // Check if player exists in team
      const [existingPlayer] = await pool.query(
        'SELECT * FROM user_teams WHERE user_id = ? AND player_id = ?',
        [userId, playerId]
      );
      
      if (existingPlayer.length === 0) {
        throw new Error('Player not in team');
      }
      
      // Get player value to refund
      const player = await Player.findById(playerId);
      if (!player) {
        throw new Error('Player not found');
      }
      
      // Remove player from team
      await pool.query(
        'DELETE FROM user_teams WHERE user_id = ? AND player_id = ?',
        [userId, playerId]
      );
      
      // Update user's budget (refund the player's value)
      const user = await User.findById(userId);
      const newBudget = user.budget + player.player_value;
      await User.updateBudget(userId, newBudget);
      
      // Recalculate team points
      await Team.calculateTeamPoints(userId);
      
      return { success: true, message: 'Player removed from team' };
    } catch (error) {
      throw error;
    }
  },

  // Get user's team
  getUserTeam: async (userId) => {
    try {
      const [rows] = await pool.query(
        `SELECT p.* 
         FROM user_teams ut 
         JOIN players p ON ut.player_id = p.id 
         WHERE ut.user_id = ?`,
        [userId]
      );
      
      return rows;
    } catch (error) {
      throw error;
    }
  },

  // Calculate team points
  calculateTeamPoints: async (userId) => {
    try {
      const team = await Team.getUserTeam(userId);
      
      // Only calculate if team has 11 players
      if (team.length === 11) {
        // Sum up all player points
        const totalPoints = team.reduce((sum, player) => sum + player.player_points, 0);
        
        // Update user's team points
        await User.updateTeamPoints(userId, totalPoints);
        
        return totalPoints;
      } else {
        // If team is incomplete, set points to 0
        await User.updateTeamPoints(userId, 0);
        return 0;
      }
    } catch (error) {
      throw error;
    }
  },

  // Get team count
  getTeamCount: async (userId) => {
    try {
      const [result] = await pool.query(
        'SELECT COUNT(*) as count FROM user_teams WHERE user_id = ?',
        [userId]
      );
      
      return result[0].count;
    } catch (error) {
      throw error;
    }
  },

  // Check if team is complete (has 11 players)
  isTeamComplete: async (userId) => {
    try {
      const count = await Team.getTeamCount(userId);
      return count === 11;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = Team;