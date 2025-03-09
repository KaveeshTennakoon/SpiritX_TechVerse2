const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const config = require('../config/auth.config');

// Authentication Controller
const AuthController = {
  // User signup
  signup: async (req, res) => {
    try {
      const { username, password } = req.body;
      
      // Validate input
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
      }
      
      // Check username length (as required in the spec)
      if (username.length < 8) {
        return res.status(400).json({ message: 'Username must be at least 8 characters long' });
      }
      
      // Validate password strength (as required in the spec)
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])/;
      if (!passwordRegex.test(password)) {
        return res.status(400).json({ 
          message: 'Password must contain at least one lowercase letter, one uppercase letter, and one special character' 
        });
      }
      
      // Check if username exists
      const existingUser = await User.findByUsername(username);
      
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }
      
      // Create new user
      const newUser = await User.create({
        username,
        password,
        is_admin: false,
        budget: 9000000
      });
      
      // Create token for auto-login
      const token = jwt.sign({ id: newUser.id }, config.secret, {
        expiresIn: config.jwtExpiration
      });
      
      res.status(201).json({
        message: 'User registered successfully',
        user: {
          id: newUser.id,
          username: newUser.username
        },
        accessToken: token
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // User login
  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      
      // Validate input
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
      }
      
      const user = await User.findByUsername(username);
      
      if (!user) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }
      
      // Compare passwords
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }
      
      // Generate JWT token
      const token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: config.jwtExpiration
      });
      
      res.status(200).json({
        id: user.id,
        username: user.username,
        is_admin: user.is_admin,
        accessToken: token
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Create an admin user (for initial setup)
  createAdmin: async (req, res) => {
    try {
      const { username, password, secretKey } = req.body;
      
      // Verify secret key (add an ADMIN_SECRET_KEY to your .env file)
      if (secretKey !== process.env.ADMIN_SECRET_KEY) {
        return res.status(403).json({ message: 'Invalid secret key' });
      }
      
      // Check if username exists
      const existingUser = await User.findByUsername(username);
      
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }
      
      // Create admin user
      const adminUser = await User.create({
        username,
        password,
        is_admin: true,
        budget: 9000000
      });
      
      res.status(201).json({
        message: 'Admin user created successfully',
        user: {
          id: adminUser.id,
          username: adminUser.username,
          is_admin: true
        }
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = AuthController;