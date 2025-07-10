const nodemailer = require('nodemailer');
const { logger } = require('../config/logger');

let transporter;
if (process.env.NODE_ENV === 'development') {
  // Use mock transport for development
  transporter = nodemailer.createTransport({
    jsonTransport: true
  });
  logger.info('Using mock email transport in development mode');
} else {
  // Production SMTP transport
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  logger.info('Using SMTP transport in production mode');
}

// Verify transporter connection
transporter.verify((error, success) => {
  if (error) {
    logger.error('Email service error:', error);
  } else {
    logger.info('Email service is ready to send messages');
  }
});

// Helper function to send emails with development mode logging
const sendEmail = async (mailOptions) => {
  try {
    const info = await transporter.sendMail(mailOptions);
    if (process.env.NODE_ENV === 'development') {
      logger.info('Development mode - Email would have been sent:');
      logger.info(JSON.stringify(mailOptions, null, 2));
    }
    return info;
  } catch (error) {
    logger.error('Error sending email:', error);
    throw error;
  }
};

const sendWelcomeEmail = async (user) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: user.email,
    subject: 'Welcome to My Ride Link™',
    html: `
      <h1>Welcome to My Ride Link™, ${user.firstName}!</h1>
      <p>Thank you for joining our ride-sharing platform. We're excited to have you on board!</p>
      <p>To get started, please verify your email address by clicking the link below:</p>
      <a href="${process.env.EMAIL_VERIFICATION_URL}/${user.verificationToken}">Verify Email</a>
      <p>If you have any questions, feel free to contact our support team.</p>
      <p>Best regards,<br>The My Ride Link™ Team</p>
    `,
  };

  await sendEmail(mailOptions);
  logger.info(`Welcome email sent to ${user.email}`);
};

const sendVerificationEmail = async (user, token) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: user.email,
    subject: 'Verify Your Email - My Ride Link™',
    html: `
      <h1>Email Verification</h1>
      <p>Hello ${user.firstName},</p>
      <p>Please verify your email address by clicking the link below:</p>
      <a href="${process.env.EMAIL_VERIFICATION_URL}/${token}">Verify Email</a>
      <p>This link will expire in 24 hours.</p>
      <p>If you didn't request this verification, please ignore this email.</p>
      <p>Best regards,<br>The My Ride Link™ Team</p>
    `,
  };

  await sendEmail(mailOptions);
  logger.info(`Verification email sent to ${user.email}`);
};

const sendPasswordResetEmail = async (user, token) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: user.email,
    subject: 'Password Reset - My Ride Link™',
    html: `
      <h1>Password Reset Request</h1>
      <p>Hello ${user.firstName},</p>
      <p>We received a request to reset your password. Click the link below to reset it:</p>
      <a href="${process.env.PASSWORD_RESET_URL}/${token}">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
      <p>Best regards,<br>The My Ride Link™ Team</p>
    `,
  };

  await sendEmail(mailOptions);
  logger.info(`Password reset email sent to ${user.email}`);
};

const sendPasswordChangedEmail = async (user) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: user.email,
    subject: 'Password Changed - My Ride Link™',
    html: `
      <h1>Password Changed Successfully</h1>
      <p>Hello ${user.firstName},</p>
      <p>Your password has been successfully changed.</p>
      <p>If you didn't make this change, please contact our support team immediately.</p>
      <p>Best regards,<br>The My Ride Link™ Team</p>
    `,
  };

  await sendEmail(mailOptions);
  logger.info(`Password changed notification sent to ${user.email}`);
};

const sendAccountLockedEmail = async (user) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: user.email,
    subject: 'Account Locked - My Ride Link™',
    html: `
      <h1>Account Locked</h1>
      <p>Hello ${user.firstName},</p>
      <p>Your account has been temporarily locked due to multiple failed login attempts.</p>
      <p>To unlock your account, please click the link below:</p>
      <a href="${process.env.ACCOUNT_UNLOCK_URL}/${user.unlockToken}">Unlock Account</a>
      <p>If you didn't attempt to log in, please contact our support team immediately.</p>
      <p>Best regards,<br>The My Ride Link™ Team</p>
    `,
  };

  await sendEmail(mailOptions);
  logger.info(`Account locked notification sent to ${user.email}`);
};

module.exports = {
  sendWelcomeEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendPasswordChangedEmail,
  sendAccountLockedEmail,
}; 