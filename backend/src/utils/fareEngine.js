module.exports = function calculateFare({ base = 2.5, perMile = 1.5, perMinute = 0.25, miles, minutes }) {
  return +(base + (perMile * miles) + (perMinute * minutes)).toFixed(2);
}; 