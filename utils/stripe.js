// Mock Stripe integration
exports.createPaymentIntent = async ({ amount, currency, paymentMethodId }) => {
  // Simulate a successful charge
  return {
    id: 'pi_mock_12345',
    amount,
    currency,
    status: 'succeeded',
    payment_method: paymentMethodId
  };
}; 