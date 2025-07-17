const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  type: String,
  message: String,
  ride: { type: mongoose.Schema.Types.ObjectId, ref: 'Ride' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  meta: Object
}, { timestamps: true });

module.exports = mongoose.model('Log', logSchema); 