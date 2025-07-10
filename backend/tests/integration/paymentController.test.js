const request = require('supertest');
const app = require('../../src/app');
const { Ride, User, Payment } = require('../../src/models');
const { generateToken } = require('../../src/utils/tokenUtils');

describe('Payment Controller', () => {
  let riderToken;
  let testRider;
  let testRide;

  beforeAll(async () => {
    // Create test user
    testRider = await User.create({
      email: 'rider@test.com',
      password: 'password123',
      name: 'Test Rider',
      role: 'rider',
      isVerified: true,
    });

    riderToken = generateToken(testRider);

    // Create test ride
    testRide = await Ride.create({
      riderId: testRider.id,
      status: 'completed',
      origin: { lat: 37.7749, lng: -122.4194 },
      destination: { lat: 37.7833, lng: -122.4167 },
      fare: 25.00,
      distance: 5.2,
      duration: 15,
    });
  });

  afterAll(async () => {
    await User.destroy({ where: {} });
    await Ride.destroy({ where: {} });
    await Payment.destroy({ where: {} });
  });

  describe('POST /api/v1/payments/rides/:rideId/payment-intent', () => {
    it('should create a payment intent', async () => {
      const response = await request(app)
        .post(`/api/v1/payments/rides/${testRide.id}/payment-intent`)
        .set('Authorization', `Bearer ${riderToken}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.paymentIntent).toHaveProperty('client_secret');
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .post(`/api/v1/payments/rides/${testRide.id}/payment-intent`);

      expect(response.status).toBe(401);
    });

    it('should return 404 for non-existent ride', async () => {
      const response = await request(app)
        .post('/api/v1/payments/rides/99999/payment-intent')
        .set('Authorization', `Bearer ${riderToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/v1/payments/webhook', () => {
    it('should handle successful payment', async () => {
      const response = await request(app)
        .post('/api/v1/payments/webhook')
        .set('stripe-signature', 'test_signature')
        .send({
          type: 'payment_intent.succeeded',
          data: {
            object: {
              id: 'test_payment_intent',
              amount: 2500,
              status: 'succeeded',
            },
          },
        });

      expect(response.status).toBe(200);
    });

    it('should handle failed payment', async () => {
      const response = await request(app)
        .post('/api/v1/payments/webhook')
        .set('stripe-signature', 'test_signature')
        .send({
          type: 'payment_intent.payment_failed',
          data: {
            object: {
              id: 'test_payment_intent',
              amount: 2500,
              status: 'failed',
            },
          },
        });

      expect(response.status).toBe(200);
    });
  });

  describe('GET /api/v1/payments/:paymentId', () => {
    let testPayment;

    beforeAll(async () => {
      testPayment = await Payment.create({
        rideId: testRide.id,
        amount: 25.00,
        status: 'succeeded',
        paymentIntentId: 'test_payment_intent',
      });
    });

    it('should return payment details', async () => {
      const response = await request(app)
        .get(`/api/v1/payments/${testPayment.id}`)
        .set('Authorization', `Bearer ${riderToken}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.payment.id).toBe(testPayment.id);
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .get(`/api/v1/payments/${testPayment.id}`);

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/v1/payments/:paymentId/refund', () => {
    let testPayment;

    beforeAll(async () => {
      testPayment = await Payment.create({
        rideId: testRide.id,
        amount: 25.00,
        status: 'succeeded',
        paymentIntentId: 'test_payment_intent',
      });
    });

    it('should process refund', async () => {
      const response = await request(app)
        .post(`/api/v1/payments/${testPayment.id}/refund`)
        .set('Authorization', `Bearer ${riderToken}`)
        .send({ amount: 25.00 });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.refund).toHaveProperty('id');
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .post(`/api/v1/payments/${testPayment.id}/refund`)
        .send({ amount: 25.00 });

      expect(response.status).toBe(401);
    });
  });
}); 