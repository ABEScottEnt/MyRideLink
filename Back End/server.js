process.env.NODE_ENV = process.env.NODE_ENV || 'development';
require('dotenv').config();

// Import the app with all middleware and routes configured
const { app, server, io } = require('./src/app');
const { logger } = require('./src/config/logger');

const PORT = process.env.PORT || 3000;

// Handle graceful shutdown
const shutdown = async () => {
  logger.info('Shutting down server...');
  try {
    await new Promise((resolve, reject) => {
      server.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    logger.info('Server closed successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Error during server shutdown:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  logger.error('Unhandled Promise Rejection:', error);
  logger.error('Error stack:', error && error.stack);
  shutdown();
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  logger.error('Error stack:', error && error.stack);
  shutdown();
});

// Handle SIGTERM and SIGINT
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// Start the server
server.listen(PORT, () => {
  logger.info(`✅ Server running on port ${PORT}`);
  logger.info(`✅ API Documentation available at http://localhost:${PORT}/api-docs`);
  logger.info(`✅ Health check available at http://localhost:${PORT}/health`);
}); 