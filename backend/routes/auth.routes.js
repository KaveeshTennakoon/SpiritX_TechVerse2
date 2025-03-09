const express = require('express');
const AuthController = require('../controllers/auth.controller');

const router = express.Router();

// Register a new user
router.post('/signup', AuthController.signup);

// Login user
router.post('/login', AuthController.login);

// Admin creation (only accessible with a secret key)
router.post('/create-admin', AuthController.createAdmin);

module.exports = router;