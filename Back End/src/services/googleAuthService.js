const { OAuth2Client } = require('google-auth-library');
const { User } = require('../models');
const { generateAccessToken, generateRefreshToken } = require('../utils/tokenUtils');
const { ValidationError, AuthenticationError } = require('../middleware/errorHandler');
const { logger } = require('../config/logger');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * Verify Google ID token
 * @param {string} idToken - Google ID token
 * @returns {Promise<Object>} - Google user info
 */
const verifyGoogleToken = async (idToken) => {
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    
    const payload = ticket.getPayload();
    return {
      googleId: payload.sub,
      email: payload.email,
      firstName: payload.given_name,
      lastName: payload.family_name,
      picture: payload.picture,
      emailVerified: payload.email_verified
    };
  } catch (error) {
    logger.error('Google token verification failed:', error);
    throw new AuthenticationError('Invalid Google token');
  }
};

/**
 * Authenticate user with Google
 * @param {string} idToken - Google ID token
 * @returns {Promise<Object>} - User data and tokens
 */
const authenticateWithGoogle = async (idToken) => {
  try {
    // Verify Google token
    const googleUser = await verifyGoogleToken(idToken);
    
    if (!googleUser.emailVerified) {
      throw new ValidationError('Google email not verified');
    }

    // Check if user exists
    let user = await User.findOne({ 
      where: { email: googleUser.email } 
    });

    if (!user) {
      // Create new user
      user = await User.create({
        email: googleUser.email,
        firstName: googleUser.firstName,
        lastName: googleUser.lastName,
        phoneNumber: '', // Will be updated later
        isEmailVerified: true,
        authProvider: 'google',
        googleId: googleUser.googleId,
        profilePicture: googleUser.picture,
        password: null // No password for Google auth
      });
      
      logger.info(`New user created via Google: ${user.email}`);
    } else {
      // Update existing user's Google info
      await user.update({
        googleId: googleUser.googleId,
        profilePicture: googleUser.picture,
        authProvider: 'google',
        isEmailVerified: true
      });
      
      logger.info(`Existing user logged in via Google: ${user.email}`);
    }

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified,
        profilePicture: user.profilePicture,
        authProvider: user.authProvider
      },
      accessToken,
      refreshToken
    };
  } catch (error) {
    logger.error('Google authentication error:', error);
    throw error;
  }
};

module.exports = {
  authenticateWithGoogle,
  verifyGoogleToken
}; 