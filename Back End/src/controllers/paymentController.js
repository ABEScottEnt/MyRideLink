const { Payment, Ride, User } = require('../models');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createNotification } = require('../utils/notificationUtils');
const { sendEmail } = require('../utils/emailUtils');
const winston = require('winston');
const { sendPaymentConfirmation } = require('../services/notificationService');

// Add placeholder handlers for missing payment routes
const defaultNotImplemented = (name) => async (req, res) => {
  res.status(501).json({ success: false, message: `${name} not implemented` });
};

const paymentController = {
  createCheckoutSession: async (req, res) => {
    try {
      const { rideId } = req.params;
      const userId = req.user.id;

      const ride = await Ride.findByPk(rideId, {
        include: [
          { model: User, as: 'rider' },
          { model: Payment }
        ]
      });

      if (!ride) {
        return res.status(404).json({
          success: false,
          message: 'Ride not found'
        });
      }

      if (ride.riderId !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to pay for this ride'
        });
      }

      if (ride.paymentStatus === 'COMPLETED') {
        return res.status(400).json({
          success: false,
          message: 'Payment already completed for this ride'
        });
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Ride Payment',
                description: `Ride from ${ride.origin} to ${ride.destination}`
              },
              unit_amount: Math.round(ride.fare * 100) // Convert to cents
            },
            quantity: 1
          }
        ],
        mode: 'payment',
        success_url: `${process.env.FRONTEND_URL}/rides/${rideId}/success`,
        cancel_url: `${process.env.FRONTEND_URL}/rides/${rideId}/cancel`,
        customer: ride.rider.stripeCustomerId,
        metadata: {
          rideId,
          paymentId: ride.Payment.id
        }
      });

      res.json({
        success: true,
        data: {
          sessionId: session.id,
          url: session.url
        }
      });
    } catch (error) {
      winston.error('Error in createCheckoutSession:', error);
      res.status(500).json({
        success: false,
        message: 'Error creating checkout session',
        error: error.message
      });
    }
  },

  // Handle Stripe webhook
  handleWebhook: async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      winston.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const { rideId, paymentId } = session.metadata;

        const payment = await Payment.findByPk(paymentId, {
          include: [
            { model: Ride, include: [{ model: User, as: 'rider' }] }
          ]
        });

        if (!payment) {
          throw new Error('Payment not found');
        }

        // Update payment status
        await payment.update({
          status: 'COMPLETED',
          stripePaymentId: session.payment_intent,
          paymentMethod: session.payment_method_types[0]
        });

        // Update ride payment status
        await payment.Ride.update({
          paymentStatus: 'COMPLETED'
        });

        // Create notification
        await createNotification({
          userId: payment.Ride.riderId,
          rideId: payment.Ride.id,
          type: 'PAYMENT_RECEIVED',
          title: 'Payment Successful',
          message: `Payment of $${payment.amount} has been received for your ride.`,
          channel: 'IN_APP'
        });

        // Send email
        await sendEmail({
          to: payment.Ride.rider.email,
          subject: 'Payment Successful',
          text: `Payment of $${payment.amount} has been received for your ride.`
        });
      }

      res.json({ received: true });
    } catch (error) {
      winston.error('Error processing webhook:', error);
      res.status(500).json({
        success: false,
        message: 'Error processing webhook',
        error: error.message
      });
    }
  },

  // Get payment details
  getPaymentDetails: async (req, res) => {
    try {
      const { paymentId } = req.params;
      const userId = req.user.id;

      const payment = await Payment.findByPk(paymentId, {
        include: [
          { model: Ride, include: [{ model: User, as: 'rider' }] }
        ]
      });

      if (!payment) {
        return res.status(404).json({
          success: false,
          message: 'Payment not found'
        });
      }

      // Check if user is authorized to view payment details
      if (req.user.role !== 'ADMIN' && 
          userId !== payment.userId && 
          userId !== payment.Ride.riderId) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to view payment details'
        });
      }

      res.json({
        success: true,
        data: payment
      });
    } catch (error) {
      winston.error('Error in getPaymentDetails:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching payment details',
        error: error.message
      });
    }
  },

  // Request refund
  requestRefund: async (req, res, next) => {
    try {
      const { paymentId } = req.params;
      const { amount } = req.body;
      const userId = req.user.id;

      const payment = await Payment.findByPk(paymentId);

      // Check if user is authorized to request refund
      if (payment.userId !== userId) {
        throw new Error('Unauthorized to request refund for this payment');
      }

      const result = await Payment.refundPayment(paymentId, amount);

      res.json({
        message: 'Refund processed successfully',
        data: result,
      });
    } catch (error) {
      winston.error('Error processing refund:', error);
      res.status(500).json({
        success: false,
        message: 'Error processing refund',
        error: error.message
      });
    }
  },

  addPaymentMethod: defaultNotImplemented('addPaymentMethod'),
  removePaymentMethod: defaultNotImplemented('removePaymentMethod'),
  setDefaultPaymentMethod: defaultNotImplemented('setDefaultPaymentMethod'),
  getTransactions: defaultNotImplemented('getTransactions'),
  getPaymentMethods: defaultNotImplemented('getPaymentMethods'),
  getPaymentHistory: defaultNotImplemented('getPaymentHistory'),
};

module.exports = paymentController; 