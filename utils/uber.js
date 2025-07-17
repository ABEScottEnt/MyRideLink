// Mock Uber API integration
exports.getRideEstimate = async (pickup, dropoff) => {
  // Simulate a network call
  return {
    estimate: 12.50,
    currency: 'USD',
    duration: 900, // seconds
    distance: 5.2 // miles
  };
};

exports.getDriverInfo = async (rideId) => {
  // Simulate a network call
  return {
    driver: {
      name: 'Jane Doe',
      car: 'Toyota Prius',
      license: 'XYZ123',
      rating: 4.9
    },
    eta: 4 // minutes
  };
}; 