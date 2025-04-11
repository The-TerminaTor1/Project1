const express = require('express');
const router = express.Router();
const authController = require('../Controllers/AuthController');
const authMiddleware = require('../Middleware/authMiddleware');

// Public routes
router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.post('/send-otp', authController.sendOtp);
router.post('/verify-otp', authController.verifyOtp);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/otp', authController.resetPasswordWithOtp);
router.post('/reset-password/:token', authController.resetPasswordWithToken);

// Protected route (example)
router.post('/reset-password',  authMiddleware, authController.resetPassword);
router.get('/profile', authMiddleware, authController.getProfile);

module.exports = router;