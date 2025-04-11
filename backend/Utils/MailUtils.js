const nodemailer = require('nodemailer');

// Create reusable transporter
const createTransporter = () => {
  if (!process.env.NODEMAILER_USER || !process.env.NODEMAILER_PASS) {
    console.error('Email credentials not set in environment variables');
    throw new Error('Email configuration is incomplete');
  }
  
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASS
    }
  });
};

/**
 * Send an email
 * @param {Object} mailOptions - Email options
 * @returns {Promise<Object>} Email send info
 */
const sendMail = async (mailOptions) => {
  try {
    const transporter = createTransporter();
    return await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

/**
 * Generate a random OTP
 * @returns {string} 6-digit OTP
 */
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

module.exports = {
  sendMail,
  generateOtp
};