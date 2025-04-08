const express = require('express');
const router = express.Router();

// Import the controller
const authController = require('../Controllers/AuthController');

// Use the controller functions
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPasswordWithToken);
router.post('/reset-password', authController.resetPassword);

module.exports = router;