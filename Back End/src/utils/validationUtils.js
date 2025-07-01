/**
 * Validates latitude and longitude coordinates
 * @param {Object} coordinates - Object containing latitude and longitude
 * @returns {boolean} - True if coordinates are valid
 */
function validateCoordinates(coordinates) {
  if (!coordinates || typeof coordinates !== 'object') {
    return false;
  }

  const { latitude, longitude } = coordinates;

  // Check if latitude and longitude are numbers
  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    return false;
  }

  // Validate latitude range (-90 to 90)
  if (latitude < -90 || latitude > 90) {
    return false;
  }

  // Validate longitude range (-180 to 180)
  if (longitude < -180 || longitude > 180) {
    return false;
  }

  return true;
}

module.exports = {
  validateCoordinates
}; 