// Mock firebase-admin to prevent real Firebase calls
jest.mock('firebase-admin');

const {
  sendEmail,
  sendRideConfirmation,
  sendRideStatusUpdate,
  sendPaymentConfirmation,
} = require('../../src/services/notificationService');

describe('Notification Service', () => {
  const mockUser = {
    id: 1,
    email: 'test@example.com',
    name: 'Test User',
  };

  const mockRide = {
    id: 1,
    origin: { lat: 37.7749, lng: -122.4194 },
    destination: { lat: 37.7833, lng: -122.4167 },
    fare: 25.00,
    status: 'accepted',
  };

  describe('sendEmail', () => {
    it('should send email successfully', async () => {
      const result = await sendEmail({
        to: mockUser.email,
        subject: 'Test Email',
        html: '<p>Test content</p>',
      });

      expect(result).toHaveProperty('messageId');
    });

    it('should handle email sending failure', async () => {
      const result = await sendEmail({
        to: 'invalid-email',
        subject: 'Test Email',
        html: '<p>Test content</p>',
      }).catch(error => error);

      expect(result).toBeInstanceOf(Error);
    });
  });

  describe('sendRideConfirmation', () => {
    it('should send ride confirmation to rider', async () => {
      const result = await sendRideConfirmation(mockRide, mockUser, 'rider');

      expect(result).toHaveProperty('messageId');
    });

    it('should send ride confirmation to driver', async () => {
      const result = await sendRideConfirmation(mockRide, mockUser, 'driver');

      expect(result).toHaveProperty('messageId');
    });
  });

  describe('sendRideStatusUpdate', () => {
    it('should send status update to rider', async () => {
      const result = await sendRideStatusUpdate(mockRide, mockUser, 'rider');

      expect(result).toHaveProperty('messageId');
    });

    it('should send status update to driver', async () => {
      const result = await sendRideStatusUpdate(mockRide, mockUser, 'driver');

      expect(result).toHaveProperty('messageId');
    });
  });

  describe('sendPaymentConfirmation', () => {
    it('should send payment confirmation', async () => {
      const result = await sendPaymentConfirmation(mockRide, mockUser);

      expect(result).toHaveProperty('messageId');
    });

    it('should handle missing user email', async () => {
      const userWithoutEmail = { ...mockUser, email: null };
      const result = await sendPaymentConfirmation(mockRide, userWithoutEmail)
        .catch(error => error);

      expect(result).toBeInstanceOf(Error);
    });
  });
}); 