require('dotenv').config({ path: '.env.test' });

// Set test environment
process.env.NODE_ENV = 'test';
process.env.PORT = 3001;
process.env.JWT_SECRET = 'test-secret-key-for-testing-only';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-key-for-testing-only';
process.env.JWT_EXPIRES_IN = '1h';
process.env.DB_TEST_MODE = 'true';

// Mock external services before importing app
jest.mock('firebase-admin', () => ({
  initializeApp: jest.fn(),
  messaging: () => ({
    send: jest.fn().mockResolvedValue({ messageId: 'test-message-id' })
  })
}));

jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    paymentIntents: {
      create: jest.fn().mockResolvedValue({ clientSecret: 'test-secret' }),
      confirm: jest.fn().mockResolvedValue({ status: 'succeeded' })
    }
  }));
});

jest.mock('winston', () => ({
  createLogger: jest.fn(() => ({
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  })),
  format: {
    combine: jest.fn(),
    timestamp: jest.fn(),
    json: jest.fn(),
    colorize: jest.fn(),
    simple: jest.fn(),
  },
  transports: {
    Console: jest.fn(),
    File: jest.fn(),
  },
}));

// Mock logger for tests
jest.mock('../src/config/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
  add: jest.fn()
}));

// Mock Redis for tests
jest.mock('ioredis', () => {
  return jest.fn().mockImplementation(() => ({
    on: jest.fn(),
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue('OK'),
    del: jest.fn().mockResolvedValue(1),
    quit: jest.fn().mockResolvedValue('OK')
  }));
});

// Mock rate-limit-redis
jest.mock('rate-limit-redis', () => ({
  RedisStore: jest.fn().mockImplementation(() => ({
    client: {},
    prefix: 'test:'
  }))
}));

// Mock nodemailer
jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn().mockResolvedValue({ messageId: 'test-message-id' })
  })
}));

let sequelize;
let models;

// Global setup
beforeAll(async () => {
  try {
    // Import database and models
    const dbConfig = require('../src/config/database');
    sequelize = dbConfig.sequelize;
    models = require('../src/models');
    
    // Test database connection
    await sequelize.authenticate();
    
    // Sync database for tests
    await sequelize.sync({ force: true });
  } catch (error) {
    console.warn('Database connection failed, running tests without database:', error.message);
    // Continue with tests even if database is not available
  }
});

// Global teardown
afterAll(async () => {
  try {
    if (sequelize) {
      await sequelize.close();
    }
  } catch (error) {
    console.warn('Error closing database connection:', error.message);
  }
});

// Reset database between tests
beforeEach(async () => {
  try {
    if (sequelize && sequelize.authenticate) {
      await sequelize.truncate({ cascade: true });
    }
  } catch (error) {
    console.warn('Error truncating database:', error.message);
  }
});

// Clean up database after each test
afterEach(async () => {
  try {
    if (sequelize && models) {
      const { User, Vehicle, Ride, Payment, Review, Notification, Location } = models;
      
      await Promise.all([
        User && User.destroy ? User.destroy({ where: {}, force: true }) : Promise.resolve(),
        Vehicle && Vehicle.destroy ? Vehicle.destroy({ where: {}, force: true }) : Promise.resolve(),
        Ride && Ride.destroy ? Ride.destroy({ where: {}, force: true }) : Promise.resolve(),
        Payment && Payment.destroy ? Payment.destroy({ where: {}, force: true }) : Promise.resolve(),
        Review && Review.destroy ? Review.destroy({ where: {}, force: true }) : Promise.resolve(),
        Notification && Notification.destroy ? Notification.destroy({ where: {}, force: true }) : Promise.resolve(),
        Location && Location.destroy ? Location.destroy({ where: {}, force: true }) : Promise.resolve(),
      ]);
    }
  } catch (error) {
    console.warn('Error cleaning up database:', error.message);
  }
});

// Mock console methods to keep test output clean
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
  log: jest.fn(),
};

// Global test timeout
jest.setTimeout(10000);

// Reset all mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
}); 