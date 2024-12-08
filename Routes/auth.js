const express = require('express');
const router = express.Router();
const authController = require('../Controllers/authController');

// Signup route
router.post('/signup', authController.signup);

// Login route
router.post('/login', authController.login);

// Logout route
router.post('/logout', authController.logout);

module.exports = router;
