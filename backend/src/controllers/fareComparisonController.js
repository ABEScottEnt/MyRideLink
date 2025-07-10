const fareComparisonService = require('../services/fareComparisonService');
const { logger } = require('../config/logger');
const { validateCoordinates } = require('../utils/validationUtils');

class FareComparisonController {
  async compareFares(req, res) {
    try {
      const { userId } = req.user;
      const { pickup, dropoff } = req.body;

      // Validate coordinates
      if (!validateCoordinates(pickup) || !validateCoordinates(dropoff)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid coordinates provided'
        });
      }

      const comparison = await fareComparisonService.compareFares(userId, pickup, dropoff);
      
      res.json({
        success: true,
        data: comparison
      });
    } catch (error) {
      logger.error('Error in compareFares controller:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to compare fares'
      });
    }
  }

  async getPriceHistory(req, res) {
    try {
      const { userId } = req.user;
      const { route } = req.params;

      const history = await fareComparisonService.getPriceHistory(userId, route);
      
      res.json({
        success: true,
        data: history
      });
    } catch (error) {
      logger.error('Error in getPriceHistory controller:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch price history'
      });
    }
  }

  async getBestTimeToRide(req, res) {
    try {
      const { userId } = req.user;
      const { route } = req.params;

      const analysis = await fareComparisonService.getBestTimeToRide(userId, route);
      
      res.json({
        success: true,
        data: analysis
      });
    } catch (error) {
      logger.error('Error in getBestTimeToRide controller:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to analyze best time to ride'
      });
    }
  }
}

module.exports = new FareComparisonController(); 