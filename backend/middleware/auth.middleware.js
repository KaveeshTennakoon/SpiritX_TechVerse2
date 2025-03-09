const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');
const User = require('../models/user.model');

// Verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token'] || req.headers['authorization'];
  
  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }
  
  // Remove Bearer prefix if present
  const tokenValue = token.startsWith('Bearer ') ? token.slice(7) : token;
  
  jwt.verify(tokenValue, config.secret, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
    
    try {
      // Set userId in request
      req.userId = decoded.id;
      
      // Check if user exists
      const user = await User.findById(decoded.id);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      next();
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  });
};

module.exports = {
  verifyToken
};