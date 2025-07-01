const { Ride, User, Driver, Payment, Notification, UserPreference } = require('../../../src/models');
const { sendEmailNotification, sendRideConfirmation, sendRideStatusUpdate, sendPaymentConfirmation } = require('../../../src/services/notificationService');
const { sendEmail } = require('../../../src/utils/emailUtils');
const { sendPushNotification } = require('../../../src/config/firebase');

// Mock dependencies
jest.mock('../../../src/models', () => ({
  Ride: {
    findByPk: jest.fn()
  },
  User: {
    findByPk: jest.fn()
  },
  Driver: {
    findByPk: jest.fn()
  },
  Payment: {
    findByPk: jest.fn()
  },
  Notification: {
    create: jest.fn()
  },
  UserPreference: {
    findOne: jest.fn()
  }
}));

jest.mock('../../../src/utils/emailUtils', () => ({
  sendEmail: jest.fn()
}));

jest.mock('../../../src/config/firebase', () => ({
  sendPushNotification: jest.fn(),
  sendMulticastPushNotification: jest.fn()
}));

describe('Notification Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('sendEmailNotification', () => {
    it('should send email successfully', async () => {
      const mockSendMail = jest.fn().mockResolvedValue({ messageId: 'test-id' });
      const mockTransporter = {
        sendMail: mockSendMail
      };
      
      await sendEmailNotification('test@example.com', 'Test Subject', '<p>Test Body</p>');
      
      expect(mockSendMail).toHaveBeenCalledWith({
        from: process.env.EMAIL_FROM,
        to: 'test@example.com',
        subject: 'Test Subject',
        html: '<p>Test Body</p>'
      });
    });

    it('should handle email sending failure', async () => {
      const mockSendMail = jest.fn().mockRejectedValue(new Error('Send failed'));
      const mockTransporter = {
        sendMail: mockSendMail
      };
      
      await expect(sendEmailNotification('test@example.com', 'Test Subject', '<p>Test Body</p>'))
        .rejects.toThrow('Send failed');
    });
  });

  describe('sendRideConfirmation', () => {
    const mockRide = {
      id: 1,
      rider: {
        email: 'rider@example.com',
        firstName: 'John'
      },
      Driver: {
        User: {
          email: 'driver@example.com',
          firstName: 'Mike'
        }
      },
      estimatedFare: 25,
      estimatedDuration: 15
    };

    beforeEach(() => {
      Ride.findByPk.mockResolvedValue(mockRide);
    });

    it('should send ride confirmation to rider', async () => {
      await sendRideConfirmation(1);
      
      expect(Ride.findByPk).toHaveBeenCalledWith(1, expect.any(Object));
      expect(sendEmail).toHaveBeenCalledWith(
        'rider@example.com',
        'Ride Confirmed - My Ride Link™',
        expect.stringContaining('Your ride has been confirmed')
      );
    });

    it('should send ride confirmation to driver', async () => {
      await sendRideConfirmation(1);
      
      expect(sendEmail).toHaveBeenCalledWith(
        'driver@example.com',
        'New Ride Request - My Ride Link™',
        expect.stringContaining('You have a new ride request')
      );
    });
  });

  describe('sendRideStatusUpdate', () => {
    const mockRide = {
      id: 1,
      rider: {
        email: 'rider@example.com',
        firstName: 'John'
      },
      Driver: {
        User: {
          email: 'driver@example.com',
          firstName: 'Mike'
        }
      }
    };

    beforeEach(() => {
      Ride.findByPk.mockResolvedValue(mockRide);
    });

    it('should send status update to rider', async () => {
      await sendRideStatusUpdate(1, 'in_progress');
      
      expect(Ride.findByPk).toHaveBeenCalledWith(1, expect.any(Object));
      expect(sendEmail).toHaveBeenCalledWith(
        'rider@example.com',
        'Ride Started - My Ride Link™',
        expect.stringContaining('Your ride has started')
      );
    });

    it('should handle invalid status', async () => {
      await expect(sendRideStatusUpdate(1, 'invalid_status'))
        .rejects.toThrow('Invalid ride status');
    });
  });

  describe('sendPaymentConfirmation', () => {
    const mockPayment = {
      id: 1,
      amount: 25,
      Ride: {
        rider: {
          email: 'rider@example.com',
          firstName: 'John'
        },
        Driver: {
          User: {
            email: 'driver@example.com',
            firstName: 'Mike'
          }
        }
      }
    };

    beforeEach(() => {
      Payment.findByPk.mockResolvedValue(mockPayment);
    });

    it('should send payment confirmation', async () => {
      await sendPaymentConfirmation(1);
      
      expect(Payment.findByPk).toHaveBeenCalledWith(1, expect.any(Object));
      expect(sendEmail).toHaveBeenCalledWith(
        'rider@example.com',
        'Payment Confirmed - My Ride Link™',
        expect.stringContaining('Your payment of $25 has been confirmed')
      );
    });

    it('should handle missing user email', async () => {
      Payment.findByPk.mockResolvedValue({
        ...mockPayment,
        Ride: {
          ...mockPayment.Ride,
          rider: { ...mockPayment.Ride.rider, email: null }
        }
      });

      await expect(sendPaymentConfirmation(1))
        .rejects.toThrow();
    });
  });
}); 