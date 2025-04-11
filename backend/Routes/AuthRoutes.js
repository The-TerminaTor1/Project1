const express = require('express');
const router = express.Router();
const authController = require('../Controllers/AuthController');
const authMiddleware = require('../Middleware/authMiddleware');

// Public routes
router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.post('/send-otp', authController.sendOtp);
router.post('/verify-otp', authController.verifyOtp);
router.post('/reset-password', authController.resetPassword);

// Protected route (example)
router.get('/profile', authMiddleware, authController.getProfile);

module.exports = router;
