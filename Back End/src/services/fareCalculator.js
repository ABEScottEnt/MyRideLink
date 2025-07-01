// Fare calculation constants
const BASE_FARE = 5;
const PER_KM = 2.5;
const PER_MIN = 0.5;
const MIN_FARE = 10;

/**
 * Calculate surge multiplier based on demand ratio
 * @param {number} demandRatio - Ratio of riders to drivers
 * @returns {number} Surge multiplier
 */
function calculateSurgeMultiplier(demandRatio) {
  if (demandRatio <= 1) return 1.0;
  if (demandRatio < 2) return 1.2;
  if (demandRatio < 3) return 1.5;
  return 2.0;
}

/**
 * Calculate fare for a ride
 * @param {number} distanceKm - Distance in kilometers
 * @param {number} durationMin - Duration in minutes
 * @param {string} vehicleType - Vehicle type (default: 'standard')
 * @param {number} demandRatio - Ratio of riders to drivers (for surge)
 * @param {string} currency - Currency code (default: 'USD')
 * @returns {object} Fare breakdown
 */
function calculateFare(distanceKm, durationMin, vehicleType = 'standard', demandRatio = 1, currency = 'USD') {
  let fare = BASE_FARE + (distanceKm * PER_KM) + (durationMin * PER_MIN);
  fare = Math.max(fare, MIN_FARE);
  const surgeMultiplier = calculateSurgeMultiplier(demandRatio);
  fare *= surgeMultiplier;
  return {
    finalFare: Math.round(fare * 100) / 100,
    currency,
    surgeMultiplier,
    distance: distanceKm,
    duration: durationMin,
    breakdown: {
      baseFare: BASE_FARE,
      distanceCharge: distanceKm * PER_KM,
      timeCharge: durationMin * PER_MIN,
      minFare: MIN_FARE,
      surgeMultiplier
    }
  };
}

/**
 * Convert amount between currencies
 * @param {number} amount - Amount to convert
 * @param {string} fromCurrency - Source currency code
 * @param {string} toCurrency - Target currency code
 * @returns {number} Converted amount
 */
function convertCurrency(amount, fromCurrency, toCurrency) {
  if (fromCurrency === toCurrency) return amount;
  const rates = {
    USD: { EUR: 0.85, INR: 75.0 },
    EUR: { USD: 1.18, INR: 88.0 },
    INR: { USD: 0.013, EUR: 0.011 }
  };
  if (!rates[fromCurrency] || !rates[fromCurrency][toCurrency]) {
    throw new Error(`Unsupported currency conversion: ${fromCurrency} to ${toCurrency}`);
  }
  return amount * rates[fromCurrency][toCurrency];
}

module.exports = {
  calculateFare,
  calculateSurgeMultiplier,
  convertCurrency
}; 