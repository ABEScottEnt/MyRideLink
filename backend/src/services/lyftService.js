const axios = require('axios');
const { logger } = require('../config/logger');

class LyftService {
  constructor() {
    this.client = axios.create({
      baseURL: 'https://api.lyft.com/v1',
      headers: {
        'Authorization': `Bearer ${process.env.LYFT_CLIENT_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
  }

  async getFareEstimate(pickup, dropoff) {
    try {
      const response = await this.client.post('/cost', {
        start: {
          latitude: pickup.latitude,
          longitude: pickup.longitude
        },
        end: {
          latitude: dropoff.latitude,
          longitude: dropoff.longitude
        }
      });

      // Process and return the best fare estimate
      const estimates = response.data.cost_estimates;
      const bestEstimate = estimates.reduce((best, current) => {
        return (!best || current.estimated_cost_cents_min < best.estimated_cost_cents_min) ? current : best;
      }, null);

      return {
        service: 'LYFT',
        estimate: bestEstimate.estimated_cost_cents_min / 100,
        highEstimate: bestEstimate.estimated_cost_cents_max / 100,
        duration: bestEstimate.estimated_duration_seconds,
        distance: bestEstimate.estimated_distance_miles * 1.60934, // Convert to kilometers
        productId: bestEstimate.ride_type,
        currency: 'USD',
        surgeMultiplier: bestEstimate.primetime_percentage ? (bestEstimate.primetime_percentage / 100) + 1 : 1
      };
    } catch (error) {
      logger.error('Lyft API error:', error);
      throw new Error('Failed to get Lyft fare estimate');
    }
  }
}

module.exports = new LyftService(); 