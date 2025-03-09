const User = require('../models/user.model');

// Check if user is admin
const isAdmin = async (req, res, next) => {
  try {
    const userId = req.userId;
    
    const user = await User.findById(userId);
    
    if (!user || !user.is_admin) {
      return res.status(403).json({ message: 'Requires Admin Role' });
    }
    
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  isAdmin
};