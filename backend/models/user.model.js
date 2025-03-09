const { pool } = require('../config/db');
const bcrypt = require('bcrypt');

// User Model
const User = {
  // Create a new user
  create: async (user) => {
    try {
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt);
      
      const [result] = await pool.query(
        'INSERT INTO users (username, password, is_admin, budget) VALUES (?, ?, ?, ?)',
        [user.username, hashedPassword, user.is_admin || false, user.budget || 9000000]
      );
      
      return { id: result.insertId, username: user.username };
    } catch (error) {
      throw error;
    }
  },

  // Find a user by username
  findByUsername: async (username) => {
    try {
      const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  // Find a user by id
  findById: async (id) => {
    try {
      const [rows] = await pool.query('SELECT id, username, is_admin, budget, team_points FROM users WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  // Update user budget
  updateBudget: async (userId, budget) => {
    try {
      await pool.query('UPDATE users SET budget = ? WHERE id = ?', [budget, userId]);
      return { id: userId, budget };
    } catch (error) {
      throw error;
    }
  },

  // Update team points
  updateTeamPoints: async (userId, points) => {
    try {
      await pool.query('UPDATE users SET team_points = ? WHERE id = ?', [points, userId]);
      return { id: userId, team_points: points };
    } catch (error) {
      throw error;
    }
  },

  // Get all users for leaderboard
  getLeaderboard: async () => {
    try {
      const [rows] = await pool.query('SELECT id, username, team_points FROM users ORDER BY team_points DESC');
      return rows;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = User;