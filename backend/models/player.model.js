const { pool } = require('../config/db');
const { calculatePlayerPoints, calculatePlayerValue } = require('../utils/player-calculation');

// Player Model
const Player = {
  // Get all players
  findAll: async () => {
    try {
      const [rows] = await pool.query('SELECT * FROM players');
      return rows;
    } catch (error) {
      throw error;
    }
  },

  // Get player by id
  findById: async (id) => {
    try {
      const [rows] = await pool.query('SELECT * FROM players WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  // Get players by name
  findByName: async (name) => {
    try {
      const [rows] = await pool.query('SELECT * FROM players WHERE name LIKE ?', [`%${name}%`]);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  // Create new player
  create: async (player) => {
    try {
      // Calculate points and value
      const points = calculatePlayerPoints(player);
      const value = calculatePlayerValue(points);
      
      const [result] = await pool.query(
        'INSERT INTO players (name, university, category, total_runs, balls_faced, innings_played, wickets, overs_bowled, runs_conceded, player_points, player_value) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          player.name, 
          player.university, 
          player.category, 
          player.total_runs || 0, 
          player.balls_faced || 0, 
          player.innings_played || 0, 
          player.wickets || 0, 
          player.overs_bowled || 0, 
          player.runs_conceded || 0,
          points,
          value
        ]
      );
      
      return { id: result.insertId, ...player, player_points: points, player_value: value };
    } catch (error) {
      throw error;
    }
  },

  // Update player
  update: async (id, player) => {
    try {
      // Calculate points and value
      const points = calculatePlayerPoints(player);
      const value = calculatePlayerValue(points);
      
      await pool.query(
        'UPDATE players SET name = ?, university = ?, category = ?, total_runs = ?, balls_faced = ?, innings_played = ?, wickets = ?, overs_bowled = ?, runs_conceded = ?, player_points = ?, player_value = ? WHERE id = ?',
        [
          player.name, 
          player.university, 
          player.category, 
          player.total_runs || 0, 
          player.balls_faced || 0, 
          player.innings_played || 0, 
          player.wickets || 0, 
          player.overs_bowled || 0, 
          player.runs_conceded || 0,
          points,
          value,
          id
        ]
      );
      
      return { id, ...player, player_points: points, player_value: value };
    } catch (error) {
      throw error;
    }
  },

  // Delete player
  delete: async (id) => {
    try {
      await pool.query('DELETE FROM players WHERE id = ?', [id]);
      return { id };
    } catch (error) {
      throw error;
    }
  },

  // Get players by category
  findByCategory: async (category) => {
    try {
      const [rows] = await pool.query('SELECT * FROM players WHERE category = ?', [category]);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  // Get tournament summary
  getTournamentSummary: async () => {
    try {
      // Get overall stats
      const [totalRunsResult] = await pool.query('SELECT SUM(total_runs) as overall_runs FROM players');
      const [totalWicketsResult] = await pool.query('SELECT SUM(wickets) as overall_wickets FROM players');
      
      // Get highest run scorer
      const [highestRunScorer] = await pool.query('SELECT id, name, university, total_runs FROM players ORDER BY total_runs DESC LIMIT 1');
      
      // Get highest wicket taker
      const [highestWicketTaker] = await pool.query('SELECT id, name, university, wickets FROM players ORDER BY wickets DESC LIMIT 1');
      
      return {
        overall_runs: totalRunsResult[0].overall_runs || 0,
        overall_wickets: totalWicketsResult[0].overall_wickets || 0,
        highest_run_scorer: highestRunScorer[0] || null,
        highest_wicket_taker: highestWicketTaker[0] || null
      };
    } catch (error) {
      throw error;
    }
  },

  // Bulk insert players (for initial data loading)
  bulkCreate: async (players) => {
    try {
      const values = players.map(player => {
        const points = calculatePlayerPoints(player);
        const value = calculatePlayerValue(points);
        
        return [
          player.name, 
          player.university, 
          player.category, 
          player.total_runs || 0, 
          player.balls_faced || 0, 
          player.innings_played || 0, 
          player.wickets || 0, 
          player.overs_bowled || 0, 
          player.runs_conceded || 0,
          points,
          value
        ];
      });
      
      if (values.length === 0) return [];
      
      const placeholders = values.map(() => '(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').join(', ');
      const flatValues = values.flat();
      
      await pool.query(
        `INSERT INTO players 
         (name, university, category, total_runs, balls_faced, innings_played, wickets, overs_bowled, runs_conceded, player_points, player_value) 
         VALUES ${placeholders}`,
        flatValues
      );
      
      // Return the newly added players
      return await Player.findAll();
    } catch (error) {
      throw error;
    }
  }
};

module.exports = Player;