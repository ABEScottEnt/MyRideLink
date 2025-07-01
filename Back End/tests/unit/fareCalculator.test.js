// Mock logger to prevent side effects in tests
jest.mock('../../src/config/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
  stream: { write: jest.fn() }
}));

const { 
  calculateFare, 
  calculateSurgeMultiplier, 
  calculateDistance, 
  calculateDuration,
  VEHICLE_TYPES,
  PEAK_HOURS,
  convertCurrency
} = require('../../src/services/fareCalculator');

describe('Fare Calculator', () => {
  const mockOrigin = { latitude: 37.7749, longitude: -122.4194 };
  const mockDestination = { latitude: 37.7833, longitude: -122.4167 };

  describe('calculateFare', () => {
    it('should calculate base fare for short ride', () => {
      const fare = calculateFare(1, 2, 'standard', 1, 'USD');
      expect(fare.finalFare).toBeGreaterThanOrEqual(10); // min fare
      expect(fare.currency).toBe('USD');
      expect(fare.breakdown.baseFare).toBe(5);
    });
    it('should apply surge multiplier', () => {
      const fare = calculateFare(10, 10, 'standard', 3, 'USD');
      expect(fare.surgeMultiplier).toBeGreaterThan(1);
      expect(fare.finalFare).toBeGreaterThan(10);
    });
    it('should round to 2 decimal places', () => {
      const fare = calculateFare(3.333, 7.777, 'standard', 1, 'USD');
      const decimals = fare.finalFare.toString().split('.')[1]?.length || 0;
      expect(decimals).toBeLessThanOrEqual(2);
    });
  });

  describe('calculateSurgeMultiplier', () => {
    it('should return 1.0 for low demand', () => {
      expect(calculateSurgeMultiplier(0.5)).toBe(1.0);
    });
    it('should return 1.2 for moderate demand', () => {
      expect(calculateSurgeMultiplier(1.5)).toBe(1.2);
    });
    it('should return 1.5 for high demand', () => {
      expect(calculateSurgeMultiplier(2.5)).toBe(1.5);
    });
    it('should return 2.0 for very high demand', () => {
      expect(calculateSurgeMultiplier(3.5)).toBe(2.0);
    });
  });

  describe('convertCurrency', () => {
    it('should return same amount for same currency', () => {
      expect(convertCurrency(100, 'USD', 'USD')).toBe(100);
    });
    it('should convert between supported currencies', () => {
      expect(convertCurrency(100, 'USD', 'EUR')).toBe(85);
      expect(convertCurrency(100, 'USD', 'INR')).toBe(7500);
      expect(convertCurrency(100, 'EUR', 'USD')).toBe(118);
      expect(convertCurrency(100, 'EUR', 'INR')).toBe(8800);
      expect(convertCurrency(100, 'INR', 'USD')).toBeCloseTo(1.3);
      expect(convertCurrency(100, 'INR', 'EUR')).toBeCloseTo(1.1);
    });
    it('should throw error for unsupported currency conversion', () => {
      expect(() => convertCurrency(100, 'USD', 'GBP')).toThrow('Unsupported currency conversion');
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero distance', () => {
      const fare = calculateFare(0, 0, 'standard', 1, 'USD');
      expect(fare.distance).toBe(0);
      expect(fare.finalFare).toBeGreaterThanOrEqual(10);
    });

    it('should handle maximum surge pricing', () => {
      const fare = calculateFare(mockOrigin, mockDestination, 100, 1, 'STANDARD');
      expect(fare.surgeMultiplier).toBeLessThanOrEqual(3.0);
    });

    it('should handle different time zones', () => {
      // Mock Date to test peak hours
      const originalDate = global.Date;
      global.Date = class extends Date {
        constructor() {
          super();
        }
        getHours() {
          return 8; // Morning peak hour
        }
      };

      const fare = calculateFare(mockOrigin, mockDestination, 0, 10, 'STANDARD');
      expect(fare.surgeMultiplier).toBeGreaterThan(1.0);

      // Restore original Date
      global.Date = originalDate;
    });
  });
}); 