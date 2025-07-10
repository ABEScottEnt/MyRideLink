// This file contains functions for working with locations and distances on Earth

/**
 * Calculate how far apart two places are on Earth
 * This uses a special formula called Haversine that accounts for Earth being round
 * 
 * @param {number} lat1 - Latitude of first place (like 40.7128 for New York)
 * @param {number} lon1 - Longitude of first place (like -74.0060 for New York)
 * @param {number} lat2 - Latitude of second place
 * @param {number} lon2 - Longitude of second place
 * @returns {number} Distance in kilometers
 */
function haversineDistance(lat1, lon1, lat2, lon2) {
  // Earth's size in kilometers
  const R = 6371;
  
  // Convert degrees to radians (math needs radians)
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  // Special math formula to calculate distance on a sphere
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  // Multiply by Earth's size to get actual distance
  return R * c;
}

/**
 * Check if a location's coordinates are valid
 * Latitude must be between -90 and 90 degrees
 * Longitude must be between -180 and 180 degrees
 * 
 * @param {number} lat - Latitude to check
 * @param {number} lon - Longitude to check
 * @returns {boolean} True if coordinates are valid, false if not
 */
function isValidCoordinate(lat, lon) {
  return lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;
}

// Make these functions available to other parts of the app
module.exports = {
  haversineDistance,
  isValidCoordinate
}; 