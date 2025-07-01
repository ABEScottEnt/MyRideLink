// This file handles all the security tokens in our app
// Tokens are like digital keys that let users access different parts of the app

const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('../middleware/errorHandler');
const { logger } = require('../config/logger');

// Keep track of tokens that are no longer valid
// In a real app, we'd use Redis instead of a Set
const tokenBlacklist = new Set();

/**
 * Create a new access token for a user
 * Access tokens are like temporary passes that let users use the app
 * They expire after 15 minutes by default
 * 
 * @param {Object} user - The user to create a token for
 * @returns {string} The new access token
 */
const generateAccessToken = (user) => {
  // Store important user info in the token
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    type: 'access'
  };

  // Create the token with our secret key
  return jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
  );
};

/**
 * Create a refresh token for a user
 * Refresh tokens last longer (7 days) and are used to get new access tokens
 * 
 * @param {Object} user - The user to create a token for
 * @returns {string} The new refresh token
 */
const generateRefreshToken = (user) => {
  // Store minimal info in refresh token
  const payload = {
    id: user.id,
    type: 'refresh'
  };

  // Create the token with a different secret key
  return jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );
};

/**
 * Check if an access token is valid
 * This is used every time a user tries to do something in the app
 * 
 * @param {string} token - The access token to check
 * @returns {Object} The decoded token data if valid
 * @throws {AuthenticationError} If the token is invalid or expired
 */
const verifyAccessToken = (token) => {
  try {
    // First check if the token has been blacklisted
    if (isTokenBlacklisted(token)) {
      throw new AuthenticationError('Token has been invalidated');
    }

    // Try to decode and verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.type !== 'access') {
      throw new AuthenticationError('Invalid token type');
    }
    return decoded;
  } catch (error) {
    // Handle different types of errors
    if (error instanceof jwt.TokenExpiredError) {
      throw new AuthenticationError('Token has expired');
    }
    throw new AuthenticationError('Invalid token');
  }
};

/**
 * Check if a refresh token is valid
 * This is used when getting a new access token
 * 
 * @param {string} token - The refresh token to check
 * @returns {Object} The decoded token data if valid
 * @throws {AuthenticationError} If the token is invalid or expired
 */
const verifyRefreshToken = (token) => {
  try {
    // Check if the token has been blacklisted
    if (isTokenBlacklisted(token)) {
      throw new AuthenticationError('Token has been invalidated');
    }

    // Try to decode and verify the token
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    if (decoded.type !== 'refresh') {
      throw new AuthenticationError('Invalid token type');
    }
    return decoded;
  } catch (error) {
    // Handle different types of errors
    if (error instanceof jwt.TokenExpiredError) {
      throw new AuthenticationError('Refresh token has expired');
    }
    throw new AuthenticationError('Invalid refresh token');
  }
};

/**
 * Add a token to the blacklist
 * This is used when a user logs out or when a token needs to be invalidated
 * 
 * @param {string} token - The token to blacklist
 */
const blacklistToken = (token) => {
  try {
    // Decode the token to get its expiration time
    const decoded = jwt.decode(token);
    if (decoded && decoded.exp) {
      // Calculate how long until the token expires
      const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);
      
      // Add to blacklist
      tokenBlacklist.add(token);
      
      // Remove from blacklist after it expires
      setTimeout(() => {
        tokenBlacklist.delete(token);
      }, expiresIn * 1000);
    }
  } catch (error) {
    logger.error('Error blacklisting token:', error);
  }
};

/**
 * Check if a token is in the blacklist
 * 
 * @param {string} token - The token to check
 * @returns {boolean} True if the token is blacklisted
 */
const isTokenBlacklisted = (token) => {
  return tokenBlacklist.has(token);
};

/**
 * Create a token for email verification
 * This token is sent to users when they sign up
 * 
 * @returns {string} The verification token
 */
const generateVerificationToken = () => {
  return jwt.sign(
    { type: 'verification' },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

/**
 * Check if a verification token is valid
 * This is used when users click the verification link in their email
 * 
 * @param {string} token - The verification token to check
 * @returns {Object} The decoded token data if valid
 * @throws {AuthenticationError} If the token is invalid or expired
 */
const verifyVerificationToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.type !== 'verification') {
      throw new AuthenticationError('Invalid token type');
    }
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AuthenticationError('Verification token has expired');
    }
    throw new AuthenticationError('Invalid verification token');
  }
};

/**
 * Create a token for password reset
 * This token is sent to users when they request a password reset
 * 
 * @returns {string} The password reset token
 */
const generatePasswordResetToken = () => {
  return jwt.sign(
    { type: 'password_reset' },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

/**
 * Check if a password reset token is valid
 * This is used when users try to reset their password
 * 
 * @param {string} token - The password reset token to check
 * @returns {Object} The decoded token data if valid
 * @throws {AuthenticationError} If the token is invalid or expired
 */
const verifyPasswordResetToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.type !== 'password_reset') {
      throw new AuthenticationError('Invalid token type');
    }
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AuthenticationError('Password reset token has expired');
    }
    throw new AuthenticationError('Invalid password reset token');
  }
};

// Make all these functions available to other parts of the app
module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  blacklistToken,
  isTokenBlacklisted,
  generateVerificationToken,
  verifyVerificationToken,
  generatePasswordResetToken,
  verifyPasswordResetToken,
}; 