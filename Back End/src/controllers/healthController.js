const { logger } = require('../config/logger');
const { sequelize } = require('../config/database');
const Redis = require('ioredis');
const { AppError } = require('../middleware/errorHandler');

// Initialize Redis client for health check
let redis = null;
try {
  redis = new Redis(process.env.REDIS_URL);
} catch (error) {
  logger.warn('Redis not available for health check');
}

const healthController = {
  // Basic health check
  check: async (req, res) => {
    res.status(200).json({
      status: 'success',
      message: 'Server is healthy',
      timestamp: new Date().toISOString(),
    });
  },

  // Detailed health check with database status
  detailed: async (req, res, next) => {
    try {
      // Check database connection
      await sequelize.authenticate();

      // Get database status
      const dbStatus = {
        connected: true,
        dialect: sequelize.getDialect(),
        database: sequelize.getDatabaseName(),
        host: sequelize.config.host,
        port: sequelize.config.port,
      };

      // Get system information
      const systemInfo = {
        nodeVersion: process.version,
        platform: process.platform,
        memory: process.memoryUsage(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV,
      };

      res.status(200).json({
        status: 'success',
        message: 'Detailed health check completed',
        timestamp: new Date().toISOString(),
        database: dbStatus,
        system: systemInfo,
      });
    } catch (error) {
      next(new AppError('Health check failed', 500));
    }
  },

  // Database connection test
  testDatabase: async (req, res, next) => {
    try {
      await sequelize.authenticate();
      res.status(200).json({
        status: 'success',
        message: 'Database connection successful',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(new AppError('Database connection failed', 500));
    }
  },

  // Environment information (for debugging)
  environment: (req, res) => {
    const envInfo = {
      nodeEnv: process.env.NODE_ENV,
      port: process.env.PORT,
      database: {
        host: process.env.DB_HOST,
        name: process.env.DB_NAME,
        user: process.env.DB_USER,
      },
      // Don't expose sensitive information in production
      ...(process.env.NODE_ENV === 'development' && {
        jwtSecret: process.env.JWT_SECRET ? 'Set' : 'Not Set',
        jwtRefreshSecret: process.env.JWT_REFRESH_SECRET ? 'Set' : 'Not Set',
      }),
    };

    res.status(200).json({
      status: 'success',
      message: 'Environment information retrieved',
      data: envInfo,
    });
  },

  healthCheck: async (req, res) => {
    const startTime = Date.now();
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      checks: {
        database: 'unknown',
        redis: 'unknown',
        memory: 'unknown'
      }
    };

    try {
      // Check database connection
      try {
        await sequelize.authenticate();
        health.checks.database = 'healthy';
      } catch (error) {
        health.checks.database = 'unhealthy';
        health.status = 'degraded';
        logger.error('Database health check failed:', error.message);
      }

      // Check Redis connection
      if (redis) {
        try {
          await redis.ping();
          health.checks.redis = 'healthy';
        } catch (error) {
          health.checks.redis = 'unhealthy';
          health.status = 'degraded';
          logger.error('Redis health check failed:', error.message);
        }
      } else {
        health.checks.redis = 'not_configured';
      }

      // Check memory usage
      const memUsage = process.memoryUsage();
      const memUsageMB = {
        rss: Math.round(memUsage.rss / 1024 / 1024),
        heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
        heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
        external: Math.round(memUsage.external / 1024 / 1024)
      };

      // Set memory status based on usage
      if (memUsageMB.heapUsed > 512) { // 512MB threshold
        health.checks.memory = 'warning';
        if (health.status === 'healthy') health.status = 'degraded';
      } else {
        health.checks.memory = 'healthy';
      }

      health.memory = memUsageMB;
      health.responseTime = Date.now() - startTime;

      // Determine overall status
      const unhealthyChecks = Object.values(health.checks).filter(check => check === 'unhealthy');
      if (unhealthyChecks.length > 0) {
        health.status = 'unhealthy';
      }

      const statusCode = health.status === 'healthy' ? 200 : 
                        health.status === 'degraded' ? 200 : 503;

      res.status(statusCode).json(health);

    } catch (error) {
      logger.error('Health check failed:', error);
      health.status = 'unhealthy';
      health.error = error.message;
      res.status(503).json(health);
    }
  },

  detailedHealthCheck: async (req, res) => {
    const startTime = Date.now();
    const detailedHealth = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      system: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        pid: process.pid
      },
      checks: {
        database: { status: 'unknown', details: {} },
        redis: { status: 'unknown', details: {} },
        memory: { status: 'unknown', details: {} },
        disk: { status: 'unknown', details: {} }
      }
    };

    try {
      // Detailed database check
      try {
        const startDb = Date.now();
        await sequelize.authenticate();
        const dbTime = Date.now() - startDb;
        
        detailedHealth.checks.database = {
          status: 'healthy',
          details: {
            responseTime: dbTime,
            dialect: sequelize.getDialect(),
            host: sequelize.config.host,
            port: sequelize.config.port,
            database: sequelize.config.database
          }
        };
      } catch (error) {
        detailedHealth.checks.database = {
          status: 'unhealthy',
          details: {
            error: error.message,
            code: error.code
          }
        };
        detailedHealth.status = 'degraded';
      }

      // Detailed Redis check
      if (redis) {
        try {
          const startRedis = Date.now();
          await redis.ping();
          const redisTime = Date.now() - startRedis;
          
          detailedHealth.checks.redis = {
            status: 'healthy',
            details: {
              responseTime: redisTime,
              url: process.env.REDIS_URL
            }
          };
        } catch (error) {
          detailedHealth.checks.redis = {
            status: 'unhealthy',
            details: {
              error: error.message,
              code: error.code
            }
          };
          detailedHealth.status = 'degraded';
        }
      } else {
        detailedHealth.checks.redis = {
          status: 'not_configured',
          details: {
            message: 'Redis not configured'
          }
        };
      }

      // Detailed memory check
      const memUsage = process.memoryUsage();
      const memUsageMB = {
        rss: Math.round(memUsage.rss / 1024 / 1024),
        heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
        heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
        external: Math.round(memUsage.external / 1024 / 1024)
      };

      const memThreshold = 512; // 512MB
      const memStatus = memUsageMB.heapUsed > memThreshold ? 'warning' : 'healthy';
      
      detailedHealth.checks.memory = {
        status: memStatus,
        details: {
          usage: memUsageMB,
          threshold: memThreshold,
          percentage: Math.round((memUsageMB.heapUsed / memThreshold) * 100)
        }
      };

      if (memStatus === 'warning' && detailedHealth.status === 'healthy') {
        detailedHealth.status = 'degraded';
      }

      detailedHealth.responseTime = Date.now() - startTime;

      // Determine overall status
      const unhealthyChecks = Object.values(detailedHealth.checks)
        .filter(check => check.status === 'unhealthy');
      
      if (unhealthyChecks.length > 0) {
        detailedHealth.status = 'unhealthy';
      }

      const statusCode = detailedHealth.status === 'healthy' ? 200 : 
                        detailedHealth.status === 'degraded' ? 200 : 503;

      res.status(statusCode).json(detailedHealth);

    } catch (error) {
      logger.error('Detailed health check failed:', error);
      detailedHealth.status = 'unhealthy';
      detailedHealth.error = error.message;
      res.status(503).json(detailedHealth);
    }
  },
};

module.exports = healthController; 