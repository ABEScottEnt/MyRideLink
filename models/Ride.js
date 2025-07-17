const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  rider: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  driver: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  pickup: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    address: String
  },
  dropoff: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    address: String
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'in_progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  fare: {
    type: Number,
    required: true
  },
  service: {
    type: String,
    enum: ['uber', 'lyft'],
    default: 'uber'
  },
  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment'
  },
  estimatedDuration: Number, // in minutes
  estimatedDistance: Number, // in miles
  actualDuration: Number,
  actualDistance: Number,
  notes: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Ride', rideSchema); 