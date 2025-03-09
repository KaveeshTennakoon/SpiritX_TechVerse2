const express = require('express');
const PlayerController = require('../controllers/player.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const { isAdmin } = require('../middleware/admin.middleware');

const router = express.Router();

// Public routes (auth required but not admin)
router.get('/', verifyToken, PlayerController.getAllPlayers);
router.get('/:id', verifyToken, PlayerController.getPlayerById);
router.get('/category/:category', verifyToken, PlayerController.getPlayersByCategory);

// Admin-only routes
router.post('/', [verifyToken, isAdmin], PlayerController.createPlayer);
router.put('/:id', [verifyToken, isAdmin], PlayerController.updatePlayer);
router.delete('/:id', [verifyToken, isAdmin], PlayerController.deletePlayer);
router.get('/admin/tournament-summary', [verifyToken, isAdmin], PlayerController.getTournamentSummary);
router.post('/admin/bulk-import', [verifyToken, isAdmin], PlayerController.bulkImportPlayers);

module.exports = router;