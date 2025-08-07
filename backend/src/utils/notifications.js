// Email (mocked)
exports.sendEmail = async (to, subject, text) => {
  // Log instead of sending
  console.log(`[MOCK EMAIL] To: ${to} | Subject: ${subject} | Text: ${text}`);
  return true;
};

// SMS (mocked)
exports.sendSMS = async (to, message) => {
  // Log instead of sending
  console.log(`[MOCK SMS] To: ${to} | Message: ${message}`);
  return true;
};

// Push Notification (mocked)
exports.sendPush = async (to, message) => {
  // Log instead of sending
  console.log(`[MOCK PUSH] To: ${to} | Message: ${message}`);
  return true;
};
