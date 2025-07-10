const { calculateFare, calculateSurgeMultiplier, convertCurrency } = require('../../../src/services/fareCalculator');

describe('Fare Calculator', () => {
  describe('calculateSurgeMultiplier', () => {
    it('should return 1.0 for demand ratio <= 1', () => {
      expect(calculateSurgeMultiplier(0.5)).toBe(1.0);
      expect(calculateSurgeMultiplier(1.0)).toBe(1.0);
    });

    it('should return 1.2 for demand ratio < 2', () => {
      expect(calculateSurgeMultiplier(1.5)).toBe(1.2);
    });

    it('should return 1.5 for demand ratio < 3', () => {
      expect(calculateSurgeMultiplier(2.5)).toBe(1.5);
    });

    it('should return 2.0 for demand ratio >= 3', () => {
      expect(calculateSurgeMultiplier(3.0)).toBe(2.0);
      expect(calculateSurgeMultiplier(4.0)).toBe(2.0);
    });
  });

  describe('calculateFare', () => {
    it('should calculate basic fare correctly', () => {
      const result = calculateFare(5, 10);
      expect(result.finalFare).toBe(22.5);
      expect(result.breakdown.baseFare).toBe(5);
      expect(result.breakdown.distanceCharge).toBe(12.5);
      expect(result.breakdown.timeCharge).toBe(5);
    });

    it('should apply minimum fare', () => {
      const result = calculateFare(1, 2);
      expect(result.finalFare).toBe(10);
    });

    it('should apply surge multiplier', () => {
      const result = calculateFare(5, 10, 'standard', 2.5);
      expect(result.surgeMultiplier).toBe(1.5);
      expect(result.finalFare).toBe(33.75);
    });

    it('should handle zero distance and duration', () => {
      const result = calculateFare(0, 0);
      expect(result.finalFare).toBe(10);
    });

    it('should handle different currencies', () => {
      const result = calculateFare(5, 10, 'standard', 1, 'EUR');
      expect(result.currency).toBe('EUR');
    });
  });

  describe('convertCurrency', () => {
    it('should return same amount for same currency', () => {
      expect(convertCurrency(100, 'USD', 'USD')).toBe(100);
    });

    it('should convert USD to EUR correctly', () => {
      expect(convertCurrency(100, 'USD', 'EUR')).toBe(85);
    });

    it('should convert EUR to INR correctly', () => {
      expect(convertCurrency(100, 'EUR', 'INR')).toBe(8800);
    });

    it('should throw error for unsupported currency', () => {
      expect(() => convertCurrency(100, 'USD', 'XYZ')).toThrow();
    });
  });
}); 