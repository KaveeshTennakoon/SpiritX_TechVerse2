import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { players } from './data/players.js';
import { leaderboardData } from './data/leaderboard.js';

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.get('/api/players', (req, res) => {
  const { role, university, search } = req.query;
  
  let filteredPlayers = [...players];
  
  if (role && role !== 'All Roles') {
    filteredPlayers = filteredPlayers.filter(player => player.role === role);
  }
  
  if (university && university !== 'All Universities') {
    filteredPlayers = filteredPlayers.filter(player => player.university === university);
  }
  
  if (search) {
    const searchLower = search.toLowerCase();
    filteredPlayers = filteredPlayers.filter(player => 
      player.name.toLowerCase().includes(searchLower) ||
      player.university.toLowerCase().includes(searchLower)
    );
  }
  
  res.json(filteredPlayers);
});

app.get('/api/leaderboard', (req, res) => {
  const { page = 1, limit = 10, university, timeframe = 'all' } = req.query;
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  
  let filtered = [...leaderboardData];
  
  if (university && university !== 'All Universities') {
    filtered = filtered.filter(entry => entry.university === university);
  }
  
  // Sort by points in descending order
  filtered.sort((a, b) => b.points - a.points);
  
  const total = filtered.length;
  const totalPages = Math.ceil(total / limitNum);
  const start = (pageNum - 1) * limitNum;
  const end = start + limitNum;
  
  res.json({
    data: filtered.slice(start, end),
    pagination: {
      total,
      totalPages,
      currentPage: pageNum,
      hasNext: pageNum < totalPages,
      hasPrev: pageNum > 1
    }
  });
});

app.get('/api/players/:id', (req, res) => {
  const player = players.find(p => p.id === parseInt(req.params.id));
  if (!player) {
    return res.status(404).json({ message: 'Player not found' });
  }
  res.json(player);
});

app.post('/api/teams', (req, res) => {
  const { players: teamPlayers } = req.body;
  
  const roles = {
    'Batsman': { current: 0, max: 4 },
    'Bowler': { current: 0, max: 4 },
    'All-rounder': { current: 0, max: 2 },
    'Wicket-keeper': { current: 0, max: 1 }
  };
  
  let totalCost = 0;
  const BUDGET_LIMIT = 9000000;
  
  for (const playerId of teamPlayers) {
    const player = players.find(p => p.id === playerId);
    if (!player) {
      return res.status(400).json({ message: `Player with ID ${playerId} not found` });
    }
    
    roles[player.role].current++;
    totalCost += player.price;
  }
  
  for (const [role, limits] of Object.entries(roles)) {
    if (limits.current > limits.max) {
      return res.status(400).json({ 
        message: `Too many ${role}s. Maximum allowed: ${limits.max}`
      });
    }
  }
  
  if (totalCost > BUDGET_LIMIT) {
    return res.status(400).json({ 
      message: 'Team cost exceeds budget limit'
    });
  }
  
  res.status(201).json({ 
    message: 'Team created successfully',
    totalCost,
    composition: roles
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});