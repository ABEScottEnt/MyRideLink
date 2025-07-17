const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../utils/notifications');

function generateToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1d' });
}

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const user = await User.create({ name, email, password, phone });
    await sendEmail(user.email, 'Welcome!', 'Thanks for registering.');
    res.status(201).json({ token: generateToken(user), user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    res.json({ token: generateToken(user), user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}; 