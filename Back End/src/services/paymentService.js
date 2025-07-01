const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Ride, Payment, User, Driver } = require('../models');
const { logger } = require('../config/logger');

// Create a payment intent for a ride
const createPaymentIntent = async (rideId, amount, currency = 'usd') => {
  try {
    const ride = await Ride.findByPk(rideId, {
      include: [
        {
          model: User,
          as: 'rider',
          attributes: ['id', 'email', 'firstName', 'lastName'],
        },
      ],
    });

    if (!ride) {
      throw new Error('Ride not found');
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata: {
        rideId,
        riderId: ride.riderId,
        driverId: ride.driverId,
      },
      receipt_email: ride.rider.email,
      description: `Ride from ${ride.originLatitude},${ride.originLongitude} to ${ride.destinationLatitude},${ride.destinationLongitude}`,
    });

    // Create payment record
    const payment = await Payment.create({
      rideId,
      amount,
      currency,
      status: 'pending',
      stripePaymentIntentId: paymentIntent.id,
      stripeClientSecret: paymentIntent.client_secret,
    });

    return {
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
      paymentId: payment.id,
    };
  } catch (error) {
    logger.error('Error creating payment intent:', error);
    throw error;
  }
};

// Handle successful payment
const handleSuccessfulPayment = async (paymentIntentId) => {
  try {
    const payment = await Payment.findOne({
      where: { stripePaymentIntentId: paymentIntentId },
      include: [Ride],
    });

    if (!payment) {
      throw new Error('Payment not found');
    }

    // Update payment status
    payment.status = 'completed';
    await payment.save();

    // Update ride status
    payment.Ride.status = 'completed';
    await payment.Ride.save();

    logger.info(`Payment completed for ride ${payment.rideId}`);
    return payment;
  } catch (error) {
    logger.error('Error handling successful payment:', error);
    throw error;
  }
};

// Handle failed payment
const handleFailedPayment = async (paymentIntentId) => {
  try {
    const payment = await Payment.findOne({
      where: { stripePaymentIntentId: paymentIntentId },
      include: [Ride],
    });

    if (!payment) {
      throw new Error('Payment not found');
    }

    // Update payment status
    payment.status = 'failed';
    await payment.save();

    // Update ride status
    payment.Ride.status = 'payment_failed';
    await payment.Ride.save();

    logger.info(`Payment failed for ride ${payment.rideId}`);
    return payment;
  } catch (error) {
    logger.error('Error handling failed payment:', error);
    throw error;
  }
};

// Get payment details
const getPaymentDetails = async (paymentId) => {
  try {
    const payment = await Payment.findByPk(paymentId, {
      include: [
        {
          model: Ride,
          include: [
            {
              model: User,
              as: 'rider',
              attributes: ['id', 'firstName', 'lastName', 'email'],
            },
            {
              model: Driver,
              include: [{
                model: User,
                attributes: ['id', 'firstName', 'lastName', 'email'],
              }],
            },
          ],
        },
      ],
    });

    if (!payment) {
      throw new Error('Payment not found');
    }

    return payment;
  } catch (error) {
    logger.error('Error getting payment details:', error);
    throw error;
  }
};

// Refund payment
const refundPayment = async (paymentId, amount = null) => {
  try {
    const payment = await Payment.findByPk(paymentId);
    if (!payment) {
      throw new Error('Payment not found');
    }

    if (payment.status !== 'completed') {
      throw new Error('Can only refund completed payments');
    }

    // Create refund in Stripe
    const refund = await stripe.refunds.create({
      payment_intent: payment.stripePaymentIntentId,
      amount: amount ? Math.round(amount * 100) : undefined, // Convert to cents if amount provided
    });

    // Update payment status
    payment.status = 'refunded';
    await payment.save();

    logger.info(`Payment ${paymentId} refunded successfully`);
    return {
      payment,
      refund,
    };
  } catch (error) {
    logger.error('Error refunding payment:', error);
    throw error;
  }
};

module.exports = {
  createPaymentIntent,
  handleSuccessfulPayment,
  handleFailedPayment,
  getPaymentDetails,
  refundPayment,
}; 