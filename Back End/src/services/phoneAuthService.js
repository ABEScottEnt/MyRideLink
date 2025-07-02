const twilio = require('twilio');
const { User } = require('../models');
const { generateAccessToken, generateRefreshToken } = require('../utils/tokenUtils');
const { ValidationError, AuthenticationError } = require('../middleware/errorHandler');
const { logger } = require('../config/logger');

let twilioClient = null;

function getTwilioClient() {
  if (twilioClient) return twilioClient;
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const phone = process.env.TWILIO_PHONE_NUMBER;
  if (!sid || !token || !phone) {
    throw new Error('Twilio credentials are not set in environment variables. Please set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER.');
  }
  twilioClient = require('twilio')(sid, token);
  return twilioClient;
}

// Store verification codes in memory (in production, use Redis)
const verificationCodes = new Map();
const VERIFICATION_CODE_EXPIRY = 10 * 60 * 1000; // 10 minutes

/**
 * Generate a random 6-digit verification code
 * @returns {string} - 6-digit code
 */
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Send SMS verification code
 * @param {string} phoneNumber - Phone number to send code to
 * @returns {Promise<Object>} - Result of SMS sending
 */
const sendVerificationCode = async (phoneNumber) => {
  try {
    // Generate verification code
    const code = generateVerificationCode();
    
    // Store code with expiry
    verificationCodes.set(phoneNumber, {
      code,
      expiry: Date.now() + VERIFICATION_CODE_EXPIRY,
      attempts: 0
    });

    // Send SMS
    const message = await getTwilioClient().messages.create({
      body: `Your MyRideLink verification code is: ${code}. Valid for 10 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber
    });

    logger.info(`Verification code sent to ${phoneNumber}: ${message.sid}`);
    
    return {
      success: true,
      messageId: message.sid
    };
  } catch (error) {
    logger.error('Error sending verification code:', error);
    throw new Error('Failed to send verification code');
  }
};

/**
 * Verify SMS code
 * @param {string} phoneNumber - Phone number
 * @param {string} code - Verification code
 * @returns {Promise<boolean>} - Whether code is valid
 */
const verifyCode = async (phoneNumber, code) => {
  const storedData = verificationCodes.get(phoneNumber);
  
  if (!storedData) {
    throw new ValidationError('No verification code found for this phone number');
  }

  if (Date.now() > storedData.expiry) {
    verificationCodes.delete(phoneNumber);
    throw new ValidationError('Verification code has expired');
  }

  if (storedData.attempts >= 3) {
    verificationCodes.delete(phoneNumber);
    throw new ValidationError('Too many failed attempts. Please request a new code.');
  }

  storedData.attempts += 1;

  if (storedData.code !== code) {
    throw new ValidationError('Invalid verification code');
  }

  // Code is valid, remove it
  verificationCodes.delete(phoneNumber);
  return true;
};

/**
 * Authenticate user with phone number
 * @param {string} phoneNumber - Phone number
 * @param {string} code - Verification code
 * @returns {Promise<Object>} - User data and tokens
 */
const authenticateWithPhone = async (phoneNumber, code) => {
  try {
    // Verify the code
    await verifyCode(phoneNumber, code);

    // Check if user exists
    let user = await User.findOne({ 
      where: { phoneNumber } 
    });

    if (!user) {
      // Create new user
      user = await User.create({
        email: '', // Will be updated later
        firstName: '', // Will be updated later
        lastName: '', // Will be updated later
        phoneNumber,
        isPhoneVerified: true,
        authProvider: 'phone',
        password: null // No password for phone auth
      });
      
      logger.info(`New user created via phone: ${phoneNumber}`);
    } else {
      // Update existing user's phone verification
      await user.update({
        isPhoneVerified: true,
        authProvider: 'phone'
      });
      
      logger.info(`Existing user logged in via phone: ${phoneNumber}`);
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
        phoneNumber: user.phoneNumber,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified,
        authProvider: user.authProvider
      },
      accessToken,
      refreshToken
    };
  } catch (error) {
    logger.error('Phone authentication error:', error);
    throw error;
  }
};

/**
 * Check if phone number is already verified
 * @param {string} phoneNumber - Phone number to check
 * @returns {Promise<boolean>} - Whether phone is verified
 */
const isPhoneVerified = async (phoneNumber) => {
  const user = await User.findOne({ where: { phoneNumber } });
  return user ? user.isPhoneVerified : false;
};

module.exports = {
  sendVerificationCode,
  verifyCode,
  authenticateWithPhone,
  isPhoneVerified
}; 