const Ride = require('../models/Ride');
const User = require('../models/User');
const { sendSMS } = require('../utils/notifications');
const calculateFare = require('../utils/fareEngine');

// Create a ride
exports.createRide = async (req, res) => {
  try {
    const { pickup, dropoff, service } = req.body;
    // Simple distance/time mock
    const miles = 5; // TODO: calculate real distance
    const minutes = 15; // TODO: calculate real time
    const fare = calculateFare({ miles, minutes });
    const ride = await Ride.create({
      rider: req.user._id,
      pickup,
      dropoff,
      fare,
      service
    });
    await sendSMS(req.user.phone, `Your ride is requested. Fare: $${fare}`);
    res.status(201).json(ride);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update ride status
exports.updateRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) return res.status(404).json({ message: 'Ride not found' });
    ride.status = req.body.status || ride.status;
    await ride.save();
    res.json(ride);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Cancel ride
exports.cancelRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) return res.status(404).json({ message: 'Ride not found' });
    ride.status = 'cancelled';
    await ride.save();
    res.json(ride);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// List rides for user
exports.getRides = async (req, res) => {
  try {
    const rides = await Ride.find({ rider: req.user._id });
    res.json(rides);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}; 