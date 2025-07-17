const Payment = require('../models/Payment');
const Ride = require('../models/Ride');
const stripe = require('../utils/stripe');

exports.charge = async (req, res) => {
  try {
    const { rideId, amount, currency, paymentMethodId } = req.body;
    const ride = await Ride.findById(rideId);
    if (!ride) return res.status(404).json({ message: 'Ride not found' });
    // Create Stripe payment intent (mocked)
    const paymentIntent = await stripe.createPaymentIntent({
      amount: Math.round(amount * 100),
      currency: currency || 'usd',
      paymentMethodId
    });
    // Save payment
    const payment = await Payment.create({
      user: req.user._id,
      ride: ride._id,
      amount,
      currency: currency || 'usd',
      status: 'paid',
      stripePaymentId: paymentIntent.id
    });
    ride.payment = payment._id;
    await ride.save();
    res.json({ payment, paymentIntent });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}; 