/**
 * Validate if a payment method is supported.
 * @param {string} method - Payment method (e.g., 'card', 'paypal', 'apple_pay')
 * @returns {boolean}
 */
function isValidPaymentMethod(method) {
  const supportedMethods = ['card', 'paypal', 'apple_pay', 'google_pay', 'stripe'];
  return supportedMethods.includes(method);
}

/**
 * Format an amount to two decimal places.
 * @param {number} amount
 * @returns {string}
 */
function formatAmount(amount) {
  return Number(amount).toFixed(2);
}

/**
 * Validate if a currency code is supported.
 * @param {string} currency - ISO currency code (e.g., 'USD', 'EUR')
 * @returns {boolean}
 */
function isValidCurrency(currency) {
  const supportedCurrencies = ['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD'];
  return supportedCurrencies.includes(currency);
}

module.exports = {
  isValidPaymentMethod,
  formatAmount,
  isValidCurrency
}; 