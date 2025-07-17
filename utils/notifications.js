const nodemailer = require('nodemailer');

// Email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendEmail = async (to, subject, text) => {
  // Log instead of sending
  console.log(`[MOCK EMAIL] To: ${to} | Subject: ${subject} | Text: ${text}`);
  return true;
};

// SMS (mocked)
exports.sendSMS = async (to, message) => {
  // Integrate Twilio here; for now, just log
  console.log(`[MOCK SMS] To: ${to} | Message: ${message}`);
  return true;
};

// Push Notification (mocked)
exports.sendPush = async (to, message) => {
  // Integrate Firebase here; for now, just log
  console.log(`[MOCK PUSH] To: ${to} | Message: ${message}`);
  return true;
}; 