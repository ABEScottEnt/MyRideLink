const logger = require('../config/logger');

// This file contains all the logic for calculating ride fares in our ride-sharing app

// Different types of vehicles and their pricing
// STANDARD: Regular cars (like Toyota Camry)
// SUV: Larger vehicles (like Toyota Highlander)
// LUXURY: Premium vehicles (like Mercedes-Benz)
const VEHICLE_TYPES = {
  STANDARD: {
    baseFare: 5.00,      // Starting price for the ride
    perKmRate: 2.50,     // Price per kilometer
    perMinuteRate: 0.50, // Price per minute
    minimumFare: 10.00   // Minimum price for any ride
  },
  SUV: {
    baseFare: 7.00,      // Higher starting price for larger vehicles
    perKmRate: 3.50,     // Higher per kilometer rate
    perMinuteRate: 0.75, // Higher per minute rate
    minimumFare: 15.00   // Higher minimum fare
  },
  LUXURY: {
    baseFare: 10.00,     // Premium starting price
    perKmRate: 5.00,     // Premium per kilometer rate
    perMinuteRate: 1.00, // Premium per minute rate
    minimumFare: 20.00   // Premium minimum fare
  }
};

// Times when prices are higher due to high demand
// Morning rush hour: 7 AM to 9 AM
// Evening rush hour: 5 PM to 7 PM
const PEAK_HOURS = [
  { start: 7, end: 9, multiplier: 1.3 },  // 30% higher prices during morning rush
  { start: 17, end: 19, multiplier: 1.3 } // 30% higher prices during evening rush
];

// Calculate how far the ride is in kilometers
// Uses a special formula (Haversine) to calculate distance between two points on Earth
const calculateDistance = (origin, destination) => {
  const R = 6371; // Earth's size in kilometers
  const lat1 = origin.latitude * Math.PI / 180;
  const lat2 = destination.latitude * Math.PI / 180;
  const deltaLat = (destination.latitude - origin.latitude) * Math.PI / 180;
  const deltaLon = (destination.longitude - origin.longitude) * Math.PI / 180;

  const a = Math.sin(deltaLat/2) * Math.sin(deltaLat/2) +
    Math.cos(lat1) * Math.cos(lat2) *
    Math.sin(deltaLon/2) * Math.sin(deltaLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Estimate how long the ride will take in minutes
// Uses average speed of 30 km/h in the city
const calculateDuration = (distance, averageSpeed = 30) => {
  return (distance / averageSpeed) * 60;
};

// Check if it's rush hour right now
// Returns true if current time is during morning or evening rush hour
const isPeakHour = () => {
  const now = new Date();
  const currentHour = now.getHours();
  
  return PEAK_HOURS.some(peak => 
    currentHour >= peak.start && currentHour < peak.end
  );
};

// Calculate how much more expensive the ride should be based on demand
// More expensive when there are more riders than drivers
const calculateSurgeMultiplier = (activeRides, availableDrivers, eventMultiplier = 1.0) => {
  // If no drivers available, price goes up a lot
  if (availableDrivers === 0) return 3.0;
  
  // Calculate how busy it is (ratio of rides to drivers)
  const demandRatio = activeRides / availableDrivers;
  
  // Base multiplier starts at 1.0 (normal price)
  let multiplier = 1.0;
  
  // Increase price based on how busy it is
  if (demandRatio > 2) multiplier = 2.0;
  else if (demandRatio > 1.5) multiplier = 1.5;
  else if (demandRatio > 1) multiplier = 1.2;
  
  // If it's rush hour, make it more expensive
  if (isPeakHour()) multiplier *= 1.3;
  
  // If there's a special event (like a concert), make it more expensive
  multiplier *= eventMultiplier;
  
  return multiplier;
};

// Calculate the basic fare without any surge pricing
const calculateBaseFare = (distance, duration, vehicleType = 'STANDARD') => {
  // Get the pricing for the chosen vehicle type
  const config = VEHICLE_TYPES[vehicleType] || VEHICLE_TYPES.STANDARD;
  
  // Calculate each part of the fare
  const distanceFare = distance * config.perKmRate;    // Price for distance
  const timeFare = duration * config.perMinuteRate;    // Price for time
  const totalFare = config.baseFare + distanceFare + timeFare;  // Add everything together
  
  // Make sure the fare is at least the minimum price
  return Math.max(totalFare, config.minimumFare);
};

// Convert money between different currencies (like USD to EUR)
const convertCurrency = (amount, fromCurrency, toCurrency) => {
  // If it's the same currency, no need to convert
  if (fromCurrency === toCurrency) return amount;
  
  // Exchange rates (these would normally come from a real-time API)
  const rates = {
    USD: { EUR: 0.85, INR: 75.0 },  // 1 USD = 0.85 EUR or 75 INR
    EUR: { USD: 1.18, INR: 88.0 },  // 1 EUR = 1.18 USD or 88 INR
    INR: { USD: 0.013, EUR: 0.011 } // 1 INR = 0.013 USD or 0.011 EUR
  };
  
  // Check if we can convert between these currencies
  if (!rates[fromCurrency] || !rates[fromCurrency][toCurrency]) {
    throw new Error(`Cannot convert between ${fromCurrency} and ${toCurrency}`);
  }
  
  // Do the conversion
  return amount * rates[fromCurrency][toCurrency];
};

// Main function that calculates the total fare for a ride
// This is what other parts of the app will use to get the price
const calculateFare = (origin, destination, activeRides = 0, availableDrivers = 1, vehicleType = 'STANDARD', currency = 'USD', eventMultiplier = 1.0) => {
  try {
    // Step 1: Figure out how far and how long the ride will be
    const distance = calculateDistance(origin, destination);
    const duration = calculateDuration(distance);

    // Step 2: Calculate the basic fare
    const baseFare = calculateBaseFare(distance, duration, vehicleType);

    // Step 3: Calculate if we need to charge more due to high demand
    const surgeMultiplier = calculateSurgeMultiplier(activeRides, availableDrivers, eventMultiplier);

    // Step 4: Calculate the final price
    const finalFare = baseFare * surgeMultiplier;

    // Step 5: Round to 2 decimal places (like $10.99)
    const roundedFinalFare = Math.round(finalFare * 100) / 100;

    // Step 6: Convert to the requested currency if needed
    const convertedFare = convertCurrency(roundedFinalFare, 'USD', currency);

    // Step 7: Return all the details about the fare
    return {
      baseFare,           // Price before surge
      distance,           // How far in kilometers
      duration,           // How long in minutes
      surgeMultiplier,    // How much more expensive due to demand
      finalFare: convertedFare,  // Final price
      currency,           // What currency the price is in
      breakdown: {        // Detailed breakdown of the price
        baseCharge: VEHICLE_TYPES[vehicleType].baseFare,
        distanceCharge: distance * VEHICLE_TYPES[vehicleType].perKmRate,
        timeCharge: duration * VEHICLE_TYPES[vehicleType].perMinuteRate,
        surgeCharge: baseFare * (surgeMultiplier - 1),
      }
    };
  } catch (error) {
    // If anything goes wrong, log it and tell the user
    logger.error('Error calculating fare:', error);
    throw new Error('Failed to calculate fare');
  }
};

// Make these functions available to other parts of the app
module.exports = {
  calculateFare,
  calculateDistance,
  calculateDuration,
  calculateSurgeMultiplier,
  VEHICLE_TYPES,
  PEAK_HOURS
}; 