const User = require('../models/User');

exports.getMe = async (req, res) => {
  try {
    res.json({ success: true, data: req.user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateMe = async (req, res) => {
  try {
    const updates = req.body;
    Object.assign(req.user, updates);
    await req.user.save();
    res.json({ success: true, data: req.user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getNearbyDrivers = async (req, res) => {
  try {
    // Mock: return all users with role 'driver'
    const drivers = await User.find({ role: 'driver', isActive: true });
    res.json({ success: true, data: drivers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}; 