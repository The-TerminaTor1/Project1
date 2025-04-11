const nodemailer = require('nodemailer');
<<<<<<< HEAD

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
=======
const dotenv = require('dotenv').config()

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
>>>>>>> 94f95e0b1d0657b9301f6f9769fc621664f55b00

/**
 * Send an email
 * @param {Object} mailOptions - Email options
 * @returns {Promise<Object>} Email send info
 */
const sendMail = async (mailOptions) => {
<<<<<<< HEAD
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
=======
    try {
        const fromEmail = {from: process.env.EMAIL_USER};
        const option = {...mailOptions, fromEmail};
        const transporter = createTransporter();
        return await transporter.sendMail(mailOptions);
      } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}

module.exports = {
    sendMail,
}
>>>>>>> 94f95e0b1d0657b9301f6f9769fc621664f55b00
