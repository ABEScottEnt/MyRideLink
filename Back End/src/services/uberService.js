const axios = require('axios');
const { logger } = require('../config/logger');

class UberService {
  constructor() {
    this.client = axios.create({
      baseURL: 'https://api.uber.com/v1.2',
      headers: {
        'Authorization': `Bearer ${process.env.UBER_SERVER_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
  }

  async getFareEstimate(pickup, dropoff) {
    try {
      const response = await this.client.post('/estimates/price', {
        start_latitude: pickup.latitude,
        start_longitude: pickup.longitude,
        end_latitude: dropoff.latitude,
        end_longitude: dropoff.longitude
      });

      // Process and return the best fare estimate
      const estimates = response.data.prices;
      const bestEstimate = estimates.reduce((best, current) => {
        return (!best || current.low_estimate < best.low_estimate) ? current : best;
      }, null);

      return {
        service: 'UBER',
        estimate: bestEstimate.low_estimate,
        highEstimate: bestEstimate.high_estimate,
        duration: bestEstimate.duration,
        distance: bestEstimate.distance,
        productId: bestEstimate.product_id,
        currency: bestEstimate.currency_code,
        surgeMultiplier: bestEstimate.surge_multiplier
      };
    } catch (error) {
      logger.error('Uber API error:', error);
      throw new Error('Failed to get Uber fare estimate');
    }
  }
}

module.exports = new UberService(); 