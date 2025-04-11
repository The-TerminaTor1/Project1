const User = require('../model/User');

/**
 * Find a user by their email address
 * @param {string} email - User's email
 * @returns {Promise<Object|null>} User object or null if not found
 */
const findUserByEmail = async (email) => {
  try {
    return await User.findOne({ email });
  } catch (error) {
    console.error('Error finding user by email:', error);
    throw error;
  }
};

/**
 * Update a user's password
 * @param {string} email - User's email
 * @param {string} password - New hashed password
 * @returns {Promise<boolean>} Success status
 */
const updatePassword = async (email, password) => {
  try {
    const result = await User.updateOne(
      { email }, 
      { $set: { password } }
    );
    return result.modifiedCount > 0;
  } catch (error) {
    console.error('Error updating password:', error);
    throw error;
  }
};

/**
 * Create a new user
 * @param {Object} userData - User data object
 * @returns {Promise<Object>} Created user object
 */
const createUser = async (userData) => {
  try {
    const user = new User(userData);
    return await user.save();
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

module.exports = {
  findUserByEmail,
  updatePassword,
  createUser
};