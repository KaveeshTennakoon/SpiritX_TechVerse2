// Authentication configuration
module.exports = {
  secret: process.env.JWT_SECRET || "spirit11-secret-key",
  jwtExpiration: 86400 // 24 hours
};