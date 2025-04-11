const User = require('../model/User');
const Otp = require('../model/Otp');
const jwt = require('../utils/JwtUtils');
const mailer = require('../utils/MailUtils');
const bcrypt = require('bcryptjs');

// Register
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    // const existing = await User.findOne({ email });
    // if (existing) return res.status(400).json({ message: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });

    res.status(201).json({ message: 'User registered', user });
  } catch (err) {
    next(err);
  }
};

// Login
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.generateToken({ id: user._id, email: user.email });
    res.json({ token, user });
  } catch (err) {
    next(err);
  }
};

// Send OTP
const sendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    await Otp.findOneAndUpdate(
      { email },
      { email, otp: otpCode, createdAt: new Date() },
      { upsert: true, new: true }
    );
    await mailer.sendMail(email, 'Your OTP', `Your OTP is: ${otpCode}`);
    res.json({ message: 'OTP sent successfully' });
  } catch (err) {
    next(err);
  }
};

// Verify OTP
const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const record = await Otp.findOne({ email });

    if (!record || record.otp !== otp)
      return res.status(400).json({ message: 'Invalid OTP' });

    res.json({ message: 'OTP verified' });
  } catch (err) {
    next(err);
  }
};

// Reset Password
const resetPassword = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const updated = await User.updateOne({ email }, { $set: { password: hashed } });

    if (updated.modifiedCount > 0) {
      res.json({ message: 'Password updated successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    next(err);
  }
};

// Profile (example protected route)
const getProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
};

module.exports = {
  registerUser,
  loginUser,
  sendOtp,
  verifyOtp,
  resetPassword,
  getProfile
};
