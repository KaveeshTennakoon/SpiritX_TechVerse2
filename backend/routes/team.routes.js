const express = require('express');
const TeamController = require('../controllers/team.controller');
const { verifyToken } = require('../middleware/auth.middleware');

const router = express.Router();

// All these routes require authentication
router.get('/', verifyToken, TeamController.getUserTeam);
router.post('/add/:playerId', verifyToken, TeamController.addPlayerToTeam);
router.delete('/remove/:playerId', verifyToken, TeamController.removePlayerFromTeam);
router.get('/status', verifyToken, TeamController.getTeamStatus);
router.get('/budget', verifyToken, TeamController.getUserBudget);
router.get('/leaderboard', verifyToken, TeamController.getLeaderboard);

module.exports = router;