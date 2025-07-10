const request = require('supertest');
const app = require('../../src/app');
const { Ride, User } = require('../../src/models');
const { generateToken } = require('../../src/utils/tokenUtils');

describe('Ride Controller', () => {
  let riderToken;
  let driverToken;
  let testRider;
  let testDriver;

  beforeAll(async () => {
    // Create test users
    testRider = await User.create({
      email: 'rider@test.com',
      password: 'password123',
      name: 'Test Rider',
      role: 'rider',
      isVerified: true,
    });

    testDriver = await User.create({
      email: 'driver@test.com',
      password: 'password123',
      name: 'Test Driver',
      role: 'driver',
      isVerified: true,
    });

    riderToken = generateToken(testRider);
    driverToken = generateToken(testDriver);
  });

  afterAll(async () => {
    await User.destroy({ where: {} });
    await Ride.destroy({ where: {} });
  });

  describe('POST /api/v1/rides/request', () => {
    it('should create a new ride request', async () => {
      const response = await request(app)
        .post('/api/v1/rides/request')
        .set('Authorization', `Bearer ${riderToken}`)
        .send({
          origin: { lat: 37.7749, lng: -122.4194 },
          destination: { lat: 37.7833, lng: -122.4167 },
        });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.ride).toHaveProperty('id');
      expect(response.body.data.ride.status).toBe('pending');
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .post('/api/v1/rides/request')
        .send({
          origin: { lat: 37.7749, lng: -122.4194 },
          destination: { lat: 37.7833, lng: -122.4167 },
        });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/v1/rides/active', () => {
    it('should return active rides for the user', async () => {
      const response = await request(app)
        .get('/api/v1/rides/active')
        .set('Authorization', `Bearer ${riderToken}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(Array.isArray(response.body.data.rides)).toBe(true);
    });
  });

  describe('GET /api/v1/rides/:rideId', () => {
    let testRide;

    beforeAll(async () => {
      testRide = await Ride.create({
        riderId: testRider.id,
        driverId: testDriver.id,
        status: 'in_progress',
        origin: { lat: 37.7749, lng: -122.4194 },
        destination: { lat: 37.7833, lng: -122.4167 },
        fare: 25.00,
        distance: 5.2,
        duration: 15,
      });
    });

    it('should return ride details', async () => {
      const response = await request(app)
        .get(`/api/v1/rides/${testRide.id}`)
        .set('Authorization', `Bearer ${riderToken}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.ride.id).toBe(testRide.id);
    });

    it('should return 404 for non-existent ride', async () => {
      const response = await request(app)
        .get('/api/v1/rides/99999')
        .set('Authorization', `Bearer ${riderToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/v1/rides/:rideId/status', () => {
    let testRide;

    beforeAll(async () => {
      testRide = await Ride.create({
        riderId: testRider.id,
        driverId: testDriver.id,
        status: 'accepted',
        origin: { lat: 37.7749, lng: -122.4194 },
        destination: { lat: 37.7833, lng: -122.4167 },
        fare: 25.00,
        distance: 5.2,
        duration: 15,
      });
    });

    it('should update ride status', async () => {
      const response = await request(app)
        .post(`/api/v1/rides/${testRide.id}/status`)
        .set('Authorization', `Bearer ${driverToken}`)
        .send({ status: 'in_progress' });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.ride.status).toBe('in_progress');
    });

    it('should only allow driver to update status', async () => {
      const response = await request(app)
        .post(`/api/v1/rides/${testRide.id}/status`)
        .set('Authorization', `Bearer ${riderToken}`)
        .send({ status: 'completed' });

      expect(response.status).toBe(403);
    });
  });
}); 