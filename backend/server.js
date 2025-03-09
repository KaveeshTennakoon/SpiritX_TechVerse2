// Import necessary modules
const express = require('express');
const cors = require('cors');
const db = require('./config/db');  // Correct import for the db module

// Create an instance of an Express app
const app = express();

// Set up middleware
app.use(cors());  // Enable Cross-Origin Resource Sharing if necessary
app.use(express.json());  // Parse incoming JSON requests

// Test API route to check server status
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// API route to save player data
app.post('/api/players', async (req, res) => {
  const { name, university, category, total_runs, balls_faced, innings_played, wickets, overs_bowled, runs_conceded } = req.body;

  try {
    const [result] = await db.pool.query(
      `INSERT INTO players (name, university, category, total_runs, balls_faced, innings_played, wickets, overs_bowled, runs_conceded) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, university, category, total_runs, balls_faced, innings_played, wickets, overs_bowled, runs_conceded]
    );
    res.status(201).json({ message: 'Player data saved successfully', playerId: result.insertId });
  } catch (err) {
    console.error('Error saving player data:', err);
    res.status(500).json({ message: 'Error saving player data' });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;

// Call the function to create the database and tables
db.createDatabaseAndTables().then(() => {
  console.log('Database and tables setup complete');
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Error setting up the database and tables:', err);
});