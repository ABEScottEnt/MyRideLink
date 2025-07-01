const uberService = require('./uberService');
const lyftService = require('./lyftService');
const { FareEstimate, PriceHistory } = require('../models');
const { logger } = require('../config/logger');
const redis = require('../config/redis');
const { sequelize } = require('sequelize');

class FareComparisonService {
  async compareFares(userId, pickup, dropoff) {
    try {
      // Check cache first
      const cacheKey = `fare:${pickup.latitude},${pickup.longitude}:${dropoff.latitude},${dropoff.longitude}`;
      const cachedResult = await redis.get(cacheKey);
      
      if (cachedResult) {
        return JSON.parse(cachedResult);
      }

      // Get estimates from both services
      const [uberEstimate, lyftEstimate] = await Promise.all([
        uberService.getFareEstimate(pickup, dropoff),
        lyftService.getFareEstimate(pickup, dropoff)
      ]);

      // Compare and determine best option
      const comparison = {
        uber: uberEstimate,
        lyft: lyftEstimate,
        bestOption: uberEstimate.estimate < lyftEstimate.estimate ? 'UBER' : 'LYFT',
        priceDifference: Math.abs(uberEstimate.estimate - lyftEstimate.estimate),
        timestamp: new Date()
      };

      // Save to database
      await FareEstimate.create({
        userId,
        pickupLocation: { type: 'Point', coordinates: [pickup.longitude, pickup.latitude] },
        dropoffLocation: { type: 'Point', coordinates: [dropoff.longitude, dropoff.latitude] },
        uberEstimate,
        lyftEstimate,
        bestOption: comparison.bestOption,
        estimatedDistance: (uberEstimate.distance + lyftEstimate.distance) / 2,
        estimatedDuration: (uberEstimate.duration + lyftEstimate.duration) / 2
      });

      // Save to price history
      await PriceHistory.create({
        userId,
        route: 'custom', // Could be determined based on saved routes
        pickupLocation: { type: 'Point', coordinates: [pickup.longitude, pickup.latitude] },
        dropoffLocation: { type: 'Point', coordinates: [dropoff.longitude, dropoff.latitude] },
        uberPrice: uberEstimate.estimate,
        lyftPrice: lyftEstimate.estimate,
        priceDifference: comparison.priceDifference,
        bestService: comparison.bestOption,
        dayOfWeek: new Date().getDay(),
        hourOfDay: new Date().getHours()
      });

      // Cache the result for 5 minutes
      await redis.setex(cacheKey, 300, JSON.stringify(comparison));

      return comparison;
    } catch (error) {
      logger.error('Error comparing fares:', error);
      throw new Error('Failed to compare fares');
    }
  }

  async getPriceHistory(userId, route) {
    try {
      const history = await PriceHistory.findAll({
        where: { userId, route },
        order: [['timestamp', 'DESC']],
        limit: 30 // Last 30 entries
      });

      return history;
    } catch (error) {
      logger.error('Error fetching price history:', error);
      throw new Error('Failed to fetch price history');
    }
  }

  async getBestTimeToRide(userId, route) {
    try {
      const history = await PriceHistory.findAll({
        where: { userId, route },
        attributes: [
          'dayOfWeek',
          'hourOfDay',
          [sequelize.fn('AVG', sequelize.col('priceDifference')), 'avgPriceDifference'],
          [sequelize.fn('COUNT', sequelize.col('id')), 'sampleSize']
        ],
        group: ['dayOfWeek', 'hourOfDay'],
        having: sequelize.literal('sampleSize >= 5'),
        order: [[sequelize.fn('AVG', sequelize.col('priceDifference')), 'ASC']]
      });

      return history;
    } catch (error) {
      logger.error('Error analyzing best time to ride:', error);
      throw new Error('Failed to analyze best time to ride');
    }
  }
}

module.exports = new FareComparisonService(); 