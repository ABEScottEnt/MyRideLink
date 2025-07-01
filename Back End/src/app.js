const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { logger } = require('./config/logger');
const validateEnv = require('./config/validateEnv');
const errorHandler = require('./middleware/errorHandler');
const corsMiddleware = require('./middleware/cors');
const securityMiddleware = require('./middleware/security');
const compressionMiddleware = require('./middleware/compression');
const { apiLimiter } = require('./middleware/rateLimiter');
const { requestLogger, errorLogger } = require('./middleware/logger');
const swagger = require('./docs/swagger');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { healthCheck, detailedHealthCheck } = require('./controllers/healthController');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const rideRoutes = require('./routes/rideRoutes');
const paymentRoutes = require('./routes/payment');
const notificationRoutes = require('./routes/notification');
const adminRoutes = require('./routes/admin');
const fareComparisonRoutes = require('./routes/fareComparison');

// Validate environment variables
validateEnv();

// Initialize express app
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Global middleware
app.use(corsMiddleware);
app.use(securityMiddleware);
app.use(compressionMiddleware);
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(requestLogger);
app.use(apiLimiter);

// Security middleware
app.use(helmet());
app.use(cors());

// Compression middleware
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Health check endpoints
app.get('/health', healthCheck);
app.get('/health/detailed', detailedHealthCheck);

// API Documentation
app.use('/api-docs', swagger.serve, swagger.setup);

// API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/rides', rideRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/fare-comparison', fareComparisonRoutes);
app.use('/api/v1/admin', adminRoutes);

// Error handling
app.use(errorLogger);
app.use(errorHandler);

// Handle unhandled routes
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Can't find ${req.originalUrl} on this server!`
  });
});

// Database initialization function
async function initializeDatabase() {
  try {
    const skipDbInit = process.env.DB_TEST_MODE === 'false';
    if (!skipDbInit) {
      const { testConnection, syncModels } = require('./config/database');
      
      // Test database connection
      logger.info('Testing database connection...');
      const isConnected = await testConnection();
      if (!isConnected) {
        throw new Error('Database connection failed');
      }
      
      // Sync database models
      logger.info('Synchronizing database models...');
      const isSynced = await syncModels(process.env.NODE_ENV === 'development');
      if (!isSynced) {
        throw new Error('Database model synchronization failed');
      }
      
      logger.info('Database initialized successfully');
    }
  } catch (error) {
    logger.error('Database initialization failed:', error);
    throw error;
  }
}

// Initialize database before exporting
initializeDatabase().catch((error) => {
  logger.error('Failed to initialize database:', error);
  process.exit(1);
});

module.exports = { app, server, io }; 