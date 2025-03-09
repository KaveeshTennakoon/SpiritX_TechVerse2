require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./config/db');

// Import routes
const authRoutes = require('./routes/auth.routes');
const playerRoutes = require('./routes/player.routes');
const teamRoutes = require('./routes/team.routes');
const chatbotRoutes = require('./routes/chatbot.routes');

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Create the database and tables if they don't exist
db.createDatabaseAndTables().then(() => {
  console.log('Database and tables setup complete');
}).catch(err => {
  console.error('Error setting up the database and tables:', err);
});

// Simple middleware to check admin status
app.use((req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.startsWith('Bearer ') 
      ? req.headers.authorization.slice(7) 
      : req.headers.authorization;
    
    try {
      const jwt = require('jsonwebtoken');
      const config = require('./config/auth.config');
      const decoded = jwt.verify(token, config.secret);
      
      // Set flag for controllers to use
      req.userId = decoded.id;
      
      // Check if user is admin
      const User = require('./models/user.model');
      User.findById(decoded.id).then(user => {
        req.isAdmin = user && user.is_admin;
        next();
      }).catch(() => {
        // If there's an error, just continue without setting isAdmin
        req.isAdmin = false;
        next();
      });
    } catch (error) {
      // If token verification fails, continue without setting isAdmin
      req.isAdmin = false;
      next();
    }
  } else {
    req.isAdmin = false;
    next();
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/chatbot', chatbotRoutes);

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'Spirit11 Fantasy Cricket Game API is running!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});