const rateLimit = require('express-rate-limit');
const { logger } = require('../config/logger');

// Check if Redis is available
let redis = null;
let RedisStore = null;

try {
  const { RedisStore: Store } = require('rate-limit-redis');
  const Redis = require('ioredis');
  
  // Initialize Redis client
  redis = new Redis(process.env.REDIS_URL, {
    retryStrategy: (times) => {
      const delay = Math.min(times * 50, 2000);
      return delay;
    }
  });

  redis.on('error', (err) => {
    logger.error('Redis error:', err);
  });

  RedisStore = Store;
} catch (error) {
  logger.warn('Redis not available, using memory store for rate limiting');
}

// Create store based on availability
const createStore = () => {
  if (RedisStore && redis) {
    return new RedisStore({
      client: redis,
      prefix: 'rl:api:'
    });
  }
  return undefined; // Use default memory store
};

// General API rate limiter
const apiLimiter = rateLimit({
  store: createStore(),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Auth endpoints rate limiter
const authLimiter = rateLimit({
  store: createStore(),
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: 'Too many login attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Payment endpoints rate limiter
const paymentLimiter = rateLimit({
  store: createStore(),
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 requests per windowMs
  message: {
    success: false,
    message: 'Too many payment attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// WebSocket connection rate limiter
const wsLimiter = rateLimit({
  store: createStore(),
  windowMs: 60 * 1000, // 1 minute
  max: 30, // Limit each IP to 30 connections per windowMs
  message: {
    success: false,
    message: 'Too many WebSocket connections, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = {
  apiLimiter,
  authLimiter,
  paymentLimiter,
  wsLimiter
}; 