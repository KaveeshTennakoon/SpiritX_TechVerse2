require('dotenv').config();
const fs = require('fs');
const csv = require('csv-parser');
const mysql = require('mysql2/promise');
const { calculatePlayerPoints, calculatePlayerValue } = require('../utils/player-calculation');

// Connect to database and load player data from CSV
const loadPlayerData = async () => {
  try {
    // Create connection using environment variables
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'spirit11'
    });
    
    console.log('Connected to database');
    
    // Clear existing players - handle foreign key constraints
    try {
      // First delete from user_teams to remove the foreign key references
      await connection.query('DELETE FROM user_teams');
      console.log('Cleared user_teams table');
      
      // Then it's safe to truncate or delete from players
      await connection.query('DELETE FROM players');
      console.log('Cleared players table');
    } catch (error) {
      console.error('Error clearing tables:', error);
      console.log('Continuing with import anyway...');
    }
    
    // Read and parse CSV file
    const players = [];
    
    // Check if CSV file exists
    const csvFilePath = './data/sample_data.csv';
    if (!fs.existsSync(csvFilePath)) {
      console.error(`CSV file not found: ${csvFilePath}`);
      console.log('Please ensure the CSV file is in the data directory');
      connection.end();
      return;
    }
    
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (row) => {
        // Transform row data to match our player model
        const player = {
          name: row.Name,
          university: row.University,
          category: row.Category,
          total_runs: parseInt(row['Total Runs']) || 0,
          balls_faced: parseInt(row['Balls Faced']) || 0,
          innings_played: parseInt(row['Innings Played']) || 0,
          wickets: parseInt(row.Wickets) || 0,
          overs_bowled: parseFloat(row['Overs Bowled']) || 0,
          runs_conceded: parseInt(row['Runs Conceded']) || 0
        };
        
        // Calculate points and value
        const points = calculatePlayerPoints(player);
        const value = calculatePlayerValue(points);
        
        players.push({
          ...player,
          player_points: points,
          player_value: value
        });
      })
      .on('end', async () => {
        console.log(`Parsed ${players.length} players from CSV`);
        
        // Prepare SQL for bulk insert
        if (players.length === 0) {
          console.log('No players to insert');
          connection.end();
          return;
        }
        
        // Build query and values for bulk insert
        const placeholders = players.map(() => 
          '(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        ).join(', ');
        
        const values = players.flatMap(player => [
          player.name,
          player.university,
          player.category,
          player.total_runs,
          player.balls_faced,
          player.innings_played,
          player.wickets,
          player.overs_bowled,
          player.runs_conceded,
          player.player_points,
          player.player_value
        ]);
        
        // Insert players in bulk
        try {
          await connection.query(`
            INSERT INTO players 
            (name, university, category, total_runs, balls_faced, innings_played, 
             wickets, overs_bowled, runs_conceded, player_points, player_value)
            VALUES ${placeholders}
          `, values);
          
          console.log(`Inserted ${players.length} players into database`);
        } catch (error) {
          console.error('Error inserting players:', error);
        }
        
        // Close connection
        connection.end();
        console.log('Database connection closed');
      });
  } catch (error) {
    console.error('Database connection failed:', error);
  }
};

// Run the script
loadPlayerData();