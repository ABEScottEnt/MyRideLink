const admin = require('firebase-admin');

jest.mock('firebase-admin', () => ({
  initializeApp: jest.fn(() => ({
    messaging: () => ({
      send: jest.fn().mockResolvedValue({ messageId: 'mock-message-id' }),
      sendMulticast: jest.fn().mockResolvedValue({
        successCount: 1,
        failureCount: 0,
        responses: [{ messageId: 'mock-message-id' }]
      })
    })
  })),
  credential: {
    cert: jest.fn()
  }
}));

module.exports = admin; 