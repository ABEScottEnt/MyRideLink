const nodemailer = require('nodemailer');
const winston = require('winston');

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Send email using Nodemailer
exports.sendEmail = async ({ to, subject, text, html }) => {
  try {
    if (process.env.NODE_ENV === 'test') {
      winston.info('Email not sent in test environment:', { to, subject });
      return { success: true, message: 'Email not sent in test environment' };
    }

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to,
      subject,
      text,
      html: html || text
    };

    const info = await transporter.sendMail(mailOptions);
    winston.info('Email sent successfully:', { to, messageId: info.messageId });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    winston.error('Error sending email:', error);
    throw error;
  }
};

// Send ride confirmation email
exports.sendRideConfirmationEmail = async (ride, user) => {
  try {
    const subject = 'Ride Confirmation - My Ride Link™';
    const text = `
      Dear ${user.firstName},

      Your ride has been confirmed!

      Ride Details:
      From: ${ride.origin}
      To: ${ride.destination}
      Estimated fare: $${ride.fare}
      Estimated duration: ${ride.estimatedDuration} minutes

      Your driver will arrive shortly.

      Thank you for using My Ride Link™!
    `;

    const html = `
      <h2>Ride Confirmation</h2>
      <p>Dear ${user.firstName},</p>
      <p>Your ride has been confirmed!</p>
      <h3>Ride Details:</h3>
      <ul>
        <li><strong>From:</strong> ${ride.origin}</li>
        <li><strong>To:</strong> ${ride.destination}</li>
        <li><strong>Estimated fare:</strong> $${ride.fare}</li>
        <li><strong>Estimated duration:</strong> ${ride.estimatedDuration} minutes</li>
      </ul>
      <p>Your driver will arrive shortly.</p>
      <p>Thank you for using My Ride Link™!</p>
    `;

    return await exports.sendEmail({
      to: user.email,
      subject,
      text,
      html
    });
  } catch (error) {
    winston.error('Error sending ride confirmation email:', error);
    throw error;
  }
};

// Send ride status update email
exports.sendRideStatusEmail = async (ride, user, status) => {
  try {
    const statusMessages = {
      ACCEPTED: {
        subject: 'Driver Assigned - My Ride Link™',
        text: 'A driver has accepted your ride request.'
      },
      STARTED: {
        subject: 'Ride Started - My Ride Link™',
        text: 'Your ride has started.'
      },
      COMPLETED: {
        subject: 'Ride Completed - My Ride Link™',
        text: 'Your ride has been completed.'
      },
      CANCELLED: {
        subject: 'Ride Cancelled - My Ride Link™',
        text: 'Your ride has been cancelled.'
      }
    };

    const message = statusMessages[status];
    if (!message) {
      throw new Error(`Invalid ride status: ${status}`);
    }

    const html = `
      <h2>${message.subject}</h2>
      <p>Dear ${user.firstName},</p>
      <p>${message.text}</p>
      <p>Thank you for using My Ride Link™!</p>
    `;

    return await exports.sendEmail({
      to: user.email,
      subject: message.subject,
      text: message.text,
      html
    });
  } catch (error) {
    winston.error('Error sending ride status email:', error);
    throw error;
  }
};

// Send payment confirmation email
exports.sendPaymentConfirmationEmail = async (payment, user) => {
  try {
    const subject = 'Payment Confirmation - My Ride Link™';
    const text = `
      Dear ${user.firstName},

      Your payment has been confirmed.

      Payment Details:
      Amount: $${payment.amount}
      Status: ${payment.status}
      Date: ${new Date().toLocaleString()}

      Thank you for using My Ride Link™!
    `;

    const html = `
      <h2>Payment Confirmation</h2>
      <p>Dear ${user.firstName},</p>
      <p>Your payment has been confirmed.</p>
      <h3>Payment Details:</h3>
      <ul>
        <li><strong>Amount:</strong> $${payment.amount}</li>
        <li><strong>Status:</strong> ${payment.status}</li>
        <li><strong>Date:</strong> ${new Date().toLocaleString()}</li>
      </ul>
      <p>Thank you for using My Ride Link™!</p>
    `;

    return await exports.sendEmail({
      to: user.email,
      subject,
      text,
      html
    });
  } catch (error) {
    winston.error('Error sending payment confirmation email:', error);
    throw error;
  }
}; 