const express = require('express');
const router = express.Router();

// Import the controller
const authController = require('../Controllers/AuthController');

// Use the controller functions
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPasswordWithToken);
router.post('/reset-password', authController.resetPassword);

//adding register and login routes
router.post('/register', authController.register);
router.post('/login', authController.login);
module.exports = router;