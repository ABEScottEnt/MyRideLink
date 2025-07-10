const request = require('supertest');
const { app } = require('../src/app');
const { User } = require('../src/models');

describe('API Endpoints', () => {
  let authToken;
  let testUser;

  beforeAll(async () => {
    // Create test user
    testUser = await User.create({
      email: 'test@example.com',
      password: 'Test123!@#',
      firstName: 'Test',
      lastName: 'User',
      phoneNumber: '+1234567890',
      role: 'rider'
    });

    // Login to get token
    const loginResponse = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'test@example.com',
        password: 'Test123!@#'
      });

    authToken = loginResponse.body.token;
  });

  afterAll(async () => {
    // Cleanup
    await User.destroy({ where: { email: 'test@example.com' } });
  });

  describe('Health Check', () => {
    it('should return 200 OK', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
    });
  });

  describe('Authentication', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'newuser@example.com',
          password: 'NewUser123!@#',
          firstName: 'New',
          lastName: 'User',
          phoneNumber: '+1987654321',
          role: 'rider'
        });

      expect(response.status).toBe(201);
      expect(response.body.user).toHaveProperty('id');
    });

    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Test123!@#'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });
  });

  describe('Rides', () => {
    it('should get ride history', async () => {
      const response = await request(app)
        .get('/api/v1/rides/history')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.rides)).toBe(true);
    });
  });

  describe('Payments', () => {
    it('should process payment', async () => {
      const response = await request(app)
        .post('/api/v1/payments/process')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          amount: 10.00,
          currency: 'USD',
          paymentMethod: 'card',
          rideId: 1
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('transactionId');
    });
  });

  describe('Notifications', () => {
    it('should update notification preferences', async () => {
      const response = await request(app)
        .put('/api/v1/notifications/preferences')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          emailNotifications: true,
          pushNotifications: true,
          smsNotifications: false
        });

      expect(response.status).toBe(200);
      expect(response.body.preferences).toHaveProperty('emailNotifications');
    });
  });

  describe('API Documentation', () => {
    it('should serve Swagger documentation', async () => {
      const response = await request(app).get('/api-docs');
      expect(response.status).toBe(200);
    });
  });
}); 