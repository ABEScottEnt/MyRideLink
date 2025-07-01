const express = require('express');
const router = express.Router();
const healthController = require('../controllers/healthController');
const { sequelize } = require('../config/database');
const { logger } = require('../config/logger');

/**
 * @swagger
 * tags:
 *   name: Health
 *   description: Health check endpoints
 */

/**
 * @swagger
 * /api/v1/health:
 *   get:
 *     tags: [Health]
 *     summary: Check API health
 *     description: Check if the API is running and connected to the database
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     uptime:
 *                       type: number
 *                       description: Server uptime in seconds
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *                     database:
 *                       type: object
 *                       properties:
 *                         status:
 *                           type: string
 *                           example: connected
 *       503:
 *         description: Service unavailable
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Service unavailable
 */
router.get('/', async (req, res) => {
  try {
    // Check database connection
    await sequelize.authenticate();

    res.status(200).json({
      status: 'success',
      data: {
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        database: {
          status: 'connected'
        }
      }
    });
  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(503).json({
      status: 'error',
      message: 'Service unavailable'
    });
  }
});

router.get('/detailed', healthController.detailed);
router.get('/database', healthController.testDatabase);
router.get('/environment', healthController.environment);

module.exports = router; 