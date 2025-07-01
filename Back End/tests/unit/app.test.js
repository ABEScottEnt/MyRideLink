const request = require('supertest');
const { app } = require('../../src/app');

describe('Application Setup', () => {
  it('should respond to health check', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'success');
  });

  it('should have API documentation endpoint', async () => {
    const response = await request(app).get('/api-docs');
    expect(response.status).toBe(200);
  });
}); 