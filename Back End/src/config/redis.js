// Basic Redis client setup for development. Replace with your production config as needed.
let redisClient;
try {
  const Redis = require('ioredis');
  redisClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
} catch (e) {
  // Fallback mock if ioredis is not installed
  redisClient = {
    get: async () => null,
    setex: async () => {},
  };
}
module.exports = redisClient; 