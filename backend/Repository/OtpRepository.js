const Otp = require('../model/Otp');

/**
 * Find OTP record by email
 * @param {string} email - User's email
 * @returns {Promise<Object|null>} OTP record or null
 */
const findOtpByEmail = async (email) => {
  try {
    return await Otp.findOne({ email });
  } catch (error) {
    console.error('Error finding OTP:', error);
    throw error;
  }
};

/**
 * Create or update OTP for a user
 * @param {string} email - User's email
 * @param {Object} otpData - OTP data to save
 * @returns {Promise<Object>} Updated OTP record
 */
const upsertOtpByEmail = async (email, otpData) => {
  try {
    return await Otp.findOneAndUpdate(
      { email },
      otpData,
      { upsert: true, new: true }
    );
  } catch (error) {
    console.error('Error upserting OTP:', error);
    throw error;
  }
};

module.exports = {
  findOtpByEmail,
  upsertOtpByEmail
};