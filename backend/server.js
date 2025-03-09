// Import necessary modules
const express = require('express');
const cors = require('cors');

// Create an instance of an Express app
const app = express();

// Set up middleware
app.use(cors());  // Enable Cross-Origin Resource Sharing if necessary
app.use(express.json());  // Parse incoming JSON requests

// Test API route to check server status
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Start the server
const PORT = process.env.PORT || 5000;

const db = require('./config/db');  // Correct import for the db module

// Call the function to create the database and tables
db.createDatabaseAndTables().then(() => {
  console.log('Database and tables setup complete');
}).catch(err => {
  console.error('Error setting up the database and tables:', err);
});