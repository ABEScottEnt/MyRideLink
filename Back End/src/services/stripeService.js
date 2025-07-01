const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

/**
 * Create a payment intent
 * @param {number} amount - Amount in cents
 * @param {string} currency - Currency code
 * @returns {Promise<Object>} Payment intent
 */
const createPaymentIntent = async (amount, currency = 'usd') => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
    });
    return paymentIntent;
  } catch (error) {
    throw new Error(`Failed to create payment intent: ${error.message}`);
  }
};

/**
 * Confirm a payment
 * @param {string} paymentIntentId - Payment intent ID
 * @returns {Promise<Object>} Confirmed payment
 */
const confirmPayment = async (paymentIntentId) => {
  try {
    const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId);
    return paymentIntent;
  } catch (error) {
    throw new Error(`Failed to confirm payment: ${error.message}`);
  }
};

module.exports = {
  createPaymentIntent,
  confirmPayment
}; 