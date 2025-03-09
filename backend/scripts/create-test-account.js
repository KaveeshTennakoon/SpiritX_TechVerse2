require('dotenv').config();
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');

// Function to create the test account with predefined team
const createTestAccount = async () => {
  try {
    // Create connection using environment variables
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'spirit11'
    });
    
    console.log('Connected to database');
    
    // Check if user exists
    const [existingUser] = await connection.execute(
      'SELECT * FROM users WHERE username = ?',
      ['spiritx_2025']
    );
    
    let userId;
    
    if (existingUser.length > 0) {
      console.log('Test account already exists');
      userId = existingUser[0].id;
      
      // Delete existing team entries
      await connection.execute(
        'DELETE FROM user_teams WHERE user_id = ?',
        [userId]
      );
      
      // Reset budget
      await connection.execute(
        'UPDATE users SET budget = ? WHERE id = ?',
        [9000000, userId]
      );
      
      console.log('Cleared existing team entries and reset budget');
    } else {
      // Create password hash
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('SpiritX@2025', salt);
      
      // Create user
      const [result] = await connection.execute(
        'INSERT INTO users (username, password, is_admin, budget) VALUES (?, ?, ?, ?)',
        ['spiritx_2025', hashedPassword, false, 9000000]
      );
      
      console.log('Test account created with ID:', result.insertId);
      userId = result.insertId;
    }
    
    // Add specified players to team
    const playerNames = [
      'Danushka Kumara',
      'Jeewan Thirimanne',
      'Charith Shanaka',
      'Pathum Dhananjaya',
      'Suranga Bandara',
      'Sammu Sandakan',
      'Minod Rathnayake',
      'Lakshan Gunathilaka',
      'Sadeera Rajapaksa',
      'Danushka Jayawickrama',
      'Lakshan Vandersay'
    ];
    
    let totalPoints = 0;
    let remainingBudget = 9000000;
    
    // Find player IDs and add to team
    for (const playerName of playerNames) {
      const [player] = await connection.execute(
        'SELECT id, player_value, player_points FROM players WHERE name = ?',
        [playerName]
      );
      
      if (player.length > 0) {
        // Add player to team
        await connection.execute(
          'INSERT INTO user_teams (user_id, player_id) VALUES (?, ?)',
          [userId, player[0].id]
        );
        
        // Update budget and accumulate points
        remainingBudget -= player[0].player_value;
        totalPoints += player[0].player_points;
        
        console.log(`Added player ${playerName} to team (Value: ${player[0].player_value})`);
      } else {
        console.log(`Player ${playerName} not found`);
      }
    }
    
    // Update user budget and team points
    await connection.execute(
      'UPDATE users SET budget = ?, team_points = ? WHERE id = ?',
      [remainingBudget, totalPoints, userId]
    );
    
    console.log(`Updated budget to ${remainingBudget} and team points to ${totalPoints}`);
    
    // Close connection
    connection.end();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error creating test account:', error);
  }
};

// Run the script
createTestAccount();