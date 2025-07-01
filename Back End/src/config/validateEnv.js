const { logger } = require('./logger');

const requiredEnvVars = {
  // Server
  PORT: 'Server port number',
  
  // Database
  DB_USER: 'Database username',
  DB_PASS: 'Database password',
  DB_NAME: 'Database name',
  DB_HOST: 'Database host',
  DB_PORT: 'Database port',
  
  // JWT
  JWT_SECRET: 'JWT secret key',
  JWT_REFRESH_SECRET: 'JWT refresh secret key',
  JWT_EXPIRES_IN: 'JWT token expiration time (e.g., 1h, 7d)',
  JWT_REFRESH_EXPIRES_IN: 'JWT refresh token expiration time (e.g., 7d, 30d)',
  
  // Uber API
  UBER_CLIENT_ID: 'Uber API client ID',
  UBER_CLIENT_SECRET: 'Uber API client secret',
  UBER_SERVER_TOKEN: 'Uber API server token',
  
  // Lyft API
  LYFT_CLIENT_ID: 'Lyft API client ID',
  LYFT_CLIENT_SECRET: 'Lyft API client secret',
  
  // Email
  EMAIL_HOST: 'SMTP host',
  EMAIL_PORT: 'SMTP port',
  EMAIL_USER: 'SMTP username',
  EMAIL_PASS: 'SMTP password',
  EMAIL_FROM: 'Sender email address',
  
  // Payment
  STRIPE_SECRET_KEY: 'Stripe secret key',
  STRIPE_WEBHOOK_SECRET: 'Stripe webhook secret',
  
  // Frontend
  FRONTEND_URL: 'Frontend application URL',
  
  // Redis
  REDIS_URL: 'Redis connection URL'
};

const optionalEnvVars = {
  NODE_ENV: 'Node environment (development, test, production)',
  LOG_LEVEL: 'Log level (error, warn, info, debug)',
  CORS_ORIGIN: 'CORS origin (comma-separated for multiple)',
  RATE_LIMIT_WINDOW_MS: 'Rate limit window in milliseconds',
  RATE_LIMIT_MAX_REQUESTS: 'Maximum requests per window',
  DB_TEST_MODE: 'Database test mode flag'
};

function validateEnv() {
  const missingVars = [];
  const warnings = [];
  
  // Check required environment variables
  for (const [key, description] of Object.entries(requiredEnvVars)) {
    if (!process.env[key]) {
      missingVars.push({ key, description });
    }
  }
  
  // Check optional environment variables and provide warnings
  for (const [key, description] of Object.entries(optionalEnvVars)) {
    if (!process.env[key]) {
      warnings.push({ key, description });
    }
  }
  
  // Throw error if required variables are missing
  if (missingVars.length > 0) {
    const errorMessage = 'Missing required environment variables:\n' +
      missingVars.map(({ key, description }) => `- ${key}: ${description}`).join('\n');
    
    logger.error(errorMessage);
    throw new Error(errorMessage);
  }
  
  // Log warnings for missing optional variables
  if (warnings.length > 0) {
    const warningMessage = 'Missing optional environment variables (using defaults):\n' +
      warnings.map(({ key, description }) => `- ${key}: ${description}`).join('\n');
    
    logger.warn(warningMessage);
  }
  
  // Validate specific format requirements
  validateFormatRequirements();
  
  // Validate environment-specific requirements
  validateEnvironmentRequirements();
  
  logger.info('Environment variables validated successfully');
}

function validateFormatRequirements() {
  // Validate NODE_ENV
  if (process.env.NODE_ENV && !['development', 'test', 'production'].includes(process.env.NODE_ENV)) {
    throw new Error('NODE_ENV must be one of: development, test, production');
  }
  
  // Validate numeric values
  const numericVars = ['DB_PORT', 'EMAIL_PORT', 'PORT'];
  for (const varName of numericVars) {
    if (process.env[varName] && isNaN(parseInt(process.env[varName]))) {
      throw new Error(`${varName} must be a number`);
    }
  }
  
  // Validate JWT secrets
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters long');
  }
  
  if (process.env.JWT_REFRESH_SECRET && process.env.JWT_REFRESH_SECRET.length < 32) {
    throw new Error('JWT_REFRESH_SECRET must be at least 32 characters long');
  }
  
  // Validate email format
  if (process.env.EMAIL_FROM && !isValidEmail(process.env.EMAIL_FROM)) {
    throw new Error('EMAIL_FROM must be a valid email address');
  }
  
  // Validate URLs
  if (process.env.FRONTEND_URL && !isValidUrl(process.env.FRONTEND_URL)) {
    throw new Error('FRONTEND_URL must be a valid URL');
  }
  
  if (process.env.REDIS_URL && !isValidUrl(process.env.REDIS_URL)) {
    throw new Error('REDIS_URL must be a valid URL');
  }
}

function validateEnvironmentRequirements() {
  const env = process.env.NODE_ENV || 'development';
  
  if (env === 'production') {
    // Production-specific validations
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'your-secret-key') {
      throw new Error('JWT_SECRET must be set to a secure value in production');
    }
    
    if (!process.env.JWT_REFRESH_SECRET || process.env.JWT_REFRESH_SECRET === 'your-refresh-secret-key') {
      throw new Error('JWT_REFRESH_SECRET must be set to a secure value in production');
    }
    
    if (process.env.NODE_ENV === 'development') {
      logger.warn('Running in production mode with development NODE_ENV');
    }
  }
  
  if (env === 'test') {
    // Test-specific validations
    if (!process.env.JWT_SECRET) {
      process.env.JWT_SECRET = 'test-secret-key-for-testing-only';
    }
    
    if (!process.env.JWT_REFRESH_SECRET) {
      process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-key-for-testing-only';
    }
  }
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

module.exports = validateEnv; 