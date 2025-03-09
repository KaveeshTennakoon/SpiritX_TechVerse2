require('dotenv').config();
const mysql = require('mysql2/promise');

// Create a connection pool using environment variables
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Function to create the database and tables
const createDatabaseAndTables = async () => {
  try {
    // Connect to MySQL server (no database selected at this point)
    const connection = await pool.getConnection();
    
    // Step 1: Create the database
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
    console.log(`Database '${process.env.DB_NAME}' created successfully or already exists`);

    // Step 2: Use the created database
    await connection.query(`USE ${process.env.DB_NAME}`);

    // Step 3: Create tables
    const createPlayersTable = `
      CREATE TABLE IF NOT EXISTS players (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        university VARCHAR(100) NOT NULL,
        category VARCHAR(50) NOT NULL,
        total_runs INT DEFAULT 0,
        balls_faced INT DEFAULT 0,
        innings_played INT DEFAULT 0,
        wickets INT DEFAULT 0,
        overs_bowled FLOAT DEFAULT 0,
        runs_conceded INT DEFAULT 0,
        player_points FLOAT DEFAULT 0,
        player_value INT DEFAULT 0
      );
    `;
    
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        is_admin BOOLEAN DEFAULT FALSE,
        budget INT DEFAULT 9000000,
        team_points FLOAT DEFAULT 0
      );
    `;
    
    const createUserTeamsTable = `
      CREATE TABLE IF NOT EXISTS user_teams (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        player_id INT,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (player_id) REFERENCES players(id),
        UNIQUE (user_id, player_id)
      );
    `;

    // Execute table creation queries
    await connection.query(createPlayersTable);
    await connection.query(createUsersTable);
    await connection.query(createUserTeamsTable);

    console.log('Tables created successfully');
    
    connection.release();  // Release the connection
  } catch (err) {
    console.error('Error creating database or tables:', err);
    process.exit(1);
  }
};

// Export the pool and createDatabaseAndTables function
module.exports = {
  pool,
  createDatabaseAndTables
};
