const { Sequelize } = require('sequelize');
const { logger } = require('./logger');

// Database configuration
const config = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: (msg) => logger.debug(msg),
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    retry: {
      max: 5,
      match: [
        /SequelizeConnectionError/,
        /SequelizeConnectionRefusedError/,
        /SequelizeHostNotFoundError/,
        /SequelizeHostNotReachableError/,
        /SequelizeInvalidConnectionError/,
        /SequelizeConnectionTimedOutError/,
        /TimeoutError/
      ]
    }
  },
  test: {
    username: process.env.DB_USER || 'MyRideDB',
    password: process.env.DB_PASS || 'ridelink',
    database: process.env.DB_NAME || 'my_ride_db_test',
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false,
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      timestamps: true,
      underscored: true,
    },
  },
};

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

let sequelize;
if (process.env.DB_TEST_MODE !== 'false') {
  sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    {
      host: dbConfig.host,
      port: dbConfig.port,
      dialect: dbConfig.dialect,
      logging: dbConfig.logging,
      pool: dbConfig.pool,
      retry: dbConfig.retry
    }
  );
}

// Test the connection
async function testConnection(retries = 5, delay = 5000) {
  if (process.env.DB_TEST_MODE === 'false') return true;
  for (let i = 0; i < retries; i++) {
    try {
      await sequelize.authenticate();
      logger.info('Database connection has been established successfully.');
      return true;
    } catch (error) {
      logger.error(`Database connection attempt ${i + 1} failed:`, error);
      if (i === retries - 1) {
        throw error;
      }
      logger.info(`Retrying in ${delay/1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// Sync database models
async function syncModels(force = false) {
  if (process.env.DB_TEST_MODE === 'false') return true;
  try {
    await sequelize.sync({ force });
    logger.info('Database models synchronized successfully.');
  } catch (error) {
    logger.error('Error synchronizing database models:', error);
    throw error;
  }
}

module.exports = {
  sequelize,
  testConnection,
  syncModels,
}; 