const Player = require('../models/player.model');

// Player Controller
const PlayerController = {
  // Get all players
  getAllPlayers: async (req, res) => {
    try {
      const players = await Player.findAll();
      
      // For non-admin users, remove player points
      if (!req.isAdmin) {
        const playersWithoutPoints = players.map(player => {
          const { player_points, ...playerData } = player;
          return playerData;
        });
        return res.status(200).json(playersWithoutPoints);
      }
      
      res.status(200).json(players);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get player by id
  getPlayerById: async (req, res) => {
    try {
      const player = await Player.findById(req.params.id);
      
      if (!player) {
        return res.status(404).json({ message: 'Player not found' });
      }
      
      // For non-admin users, remove player points
      if (!req.isAdmin) {
        const { player_points, ...playerData } = player;
        return res.status(200).json(playerData);
      }
      
      res.status(200).json(player);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Create player (admin only)
  createPlayer: async (req, res) => {
    try {
      const player = await Player.create(req.body);
      res.status(201).json(player);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update player (admin only)
  updatePlayer: async (req, res) => {
    try {
      const player = await Player.findById(req.params.id);
      
      if (!player) {
        return res.status(404).json({ message: 'Player not found' });
      }
      
      const updatedPlayer = await Player.update(req.params.id, req.body);
      res.status(200).json(updatedPlayer);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Delete player (admin only)
  deletePlayer: async (req, res) => {
    try {
      const player = await Player.findById(req.params.id);
      
      if (!player) {
        return res.status(404).json({ message: 'Player not found' });
      }
      
      await Player.delete(req.params.id);
      res.status(200).json({ message: 'Player deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get players by category
  getPlayersByCategory: async (req, res) => {
    try {
      const players = await Player.findByCategory(req.params.category);
      
      // For non-admin users, remove player points
      if (!req.isAdmin) {
        const playersWithoutPoints = players.map(player => {
          const { player_points, ...playerData } = player;
          return playerData;
        });
        return res.status(200).json(playersWithoutPoints);
      }
      
      res.status(200).json(players);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get tournament summary (admin)
  getTournamentSummary: async (req, res) => {
    try {
      const summary = await Player.getTournamentSummary();
      res.status(200).json(summary);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Bulk import players (admin only)
  bulkImportPlayers: async (req, res) => {
    try {
      if (!Array.isArray(req.body)) {
        return res.status(400).json({ message: 'Input must be an array of players' });
      }
      
      const players = await Player.bulkCreate(req.body);
      res.status(201).json(players);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = PlayerController;