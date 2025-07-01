require('dotenv').config();
const { sequelize } = require('../src/config/database');
const { logger } = require('../src/config/logger');

async function testConnection() {
  try {
    await sequelize.authenticate();
    logger.info('✅ Database connection successful');
    process.exit(0);
  } catch (error) {
    logger.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}

testConnection(); 