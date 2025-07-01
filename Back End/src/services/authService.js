const bcrypt = require('bcrypt');
const { User } = require('../models');
const { generateTokens, verifyToken, blacklistToken } = require('../utils/tokenUtils');
const { AuthenticationError, ValidationError } = require('../middleware/errorHandler');
const { logger } = require('../config/logger');
const emailService = require('./emailService');

const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 30 * 60 * 1000; // 30 minutes in milliseconds

const register = async (userData) => {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email: userData.email } });
    if (existingUser) {
      throw new ValidationError('Email already registered');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    // Create user
    const user = await User.create({
      ...userData,
      password: hashedPassword,
      role: 'user', // Default role
      isVerified: false,
      loginAttempts: 0,
      lockUntil: null,
    });

    // Generate verification token
    const verificationToken = await generateTokens(user, 'verification');

    // Send welcome email with verification link
    await emailService.sendWelcomeEmail(user);

    logger.info(`New user registered: ${user.email}`);
    return user;
  } catch (error) {
    logger.error('Registration error:', error);
    throw error;
  }
};

const login = async (email, password) => {
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new AuthenticationError('Invalid credentials');
    }

    // Check if account is locked
    if (user.lockUntil && user.lockUntil > Date.now()) {
      throw new AuthenticationError('Account is locked. Please try again later.');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      // Increment login attempts
      user.loginAttempts += 1;
      
      // Lock account if max attempts reached
      if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
        user.lockUntil = Date.now() + LOCK_TIME;
        await user.save();
        await emailService.sendAccountLockedEmail(user);
        throw new AuthenticationError('Account locked due to too many failed attempts');
      }

      await user.save();
      throw new AuthenticationError('Invalid credentials');
    }

    // Reset login attempts on successful login
    if (user.loginAttempts > 0) {
      user.loginAttempts = 0;
      user.lockUntil = null;
      await user.save();
    }

    // Generate tokens
    const { accessToken, refreshToken } = await generateTokens(user);

    logger.info(`User logged in: ${user.email}`);
    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isVerified: user.isVerified,
      },
      accessToken,
      refreshToken,
    };
  } catch (error) {
    logger.error('Login error:', error);
    throw error;
  }
};

const refreshAccessToken = async (refreshToken) => {
  try {
    const decoded = await verifyToken(refreshToken, 'refresh');
    const user = await User.findByPk(decoded.userId);
    
    if (!user) {
      throw new AuthenticationError('User not found');
    }

    const { accessToken, refreshToken: newRefreshToken } = await generateTokens(user);
    
    // Blacklist old refresh token
    await blacklistToken(refreshToken);

    return { accessToken, refreshToken: newRefreshToken };
  } catch (error) {
    logger.error('Token refresh error:', error);
    throw error;
  }
};

const logout = async (token) => {
  try {
    await blacklistToken(token);
    logger.info('User logged out successfully');
  } catch (error) {
    logger.error('Logout error:', error);
    throw error;
  }
};

const verifyEmail = async (token) => {
  try {
    const decoded = await verifyToken(token, 'verification');
    const user = await User.findByPk(decoded.userId);

    if (!user) {
      throw new AuthenticationError('User not found');
    }

    if (user.isVerified) {
      throw new ValidationError('Email already verified');
    }

    user.isVerified = true;
    await user.save();

    logger.info(`Email verified for user: ${user.email}`);
    return user;
  } catch (error) {
    logger.error('Email verification error:', error);
    throw error;
  }
};

const requestPasswordReset = async (email) => {
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new ValidationError('No account found with this email');
    }

    const resetToken = await generateTokens(user, 'password-reset');
    await emailService.sendPasswordResetEmail(user, resetToken);

    logger.info(`Password reset requested for: ${email}`);
  } catch (error) {
    logger.error('Password reset request error:', error);
    throw error;
  }
};

const resetPassword = async (token, newPassword) => {
  try {
    const decoded = await verifyToken(token, 'password-reset');
    const user = await User.findByPk(decoded.userId);

    if (!user) {
      throw new AuthenticationError('User not found');
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    // Blacklist reset token
    await blacklistToken(token);

    // Send password changed notification
    await emailService.sendPasswordChangedEmail(user);

    logger.info(`Password reset for user: ${user.email}`);
  } catch (error) {
    logger.error('Password reset error:', error);
    throw error;
  }
};

const changePassword = async (userId, currentPassword, newPassword) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new AuthenticationError('User not found');
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      throw new AuthenticationError('Current password is incorrect');
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    // Send password changed notification
    await emailService.sendPasswordChangedEmail(user);

    logger.info(`Password changed for user: ${user.email}`);
  } catch (error) {
    logger.error('Password change error:', error);
    throw error;
  }
};

module.exports = {
  register,
  login,
  refreshAccessToken,
  logout,
  verifyEmail,
  requestPasswordReset,
  resetPassword,
  changePassword,
}; 