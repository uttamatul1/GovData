import { describe, it, expect } from 'vitest';
import {
  simulateIMR,
  simulateU5MR,
  simulateMMR,
  simulateLiteracyRate,
  simulateGER,
  simulateGDPGrowth,
  simulateInflation,
  simulateAgriGrowth,
  simulateFarmerIncome,
} from './simulator.utils';

describe('simulateIMR', () => {
  it('should return a valid positive number', () => {
    const result = simulateIMR(1.9, 4.6, 76, 70);
    expect(result).toBeGreaterThanOrEqual(5);
    expect(result).toBeLessThan(85);
  });

  it('should decrease IMR as health spending increases', () => {
    const low = simulateIMR(1.0, 4.6, 76, 70);
    const high = simulateIMR(5.0, 4.6, 76, 70);
    expect(high).toBeLessThan(low);
  });

  it('should floor at 5', () => {
    const result = simulateIMR(10, 30, 100, 100);
    expect(result).toBe(5);
  });
});

describe('simulateU5MR', () => {
  it('should return a valid positive number', () => {
    const result = simulateU5MR(1.9, 4.6, 76, 70);
    expect(result).toBeGreaterThanOrEqual(6);
  });

  it('should be higher than IMR for same inputs', () => {
    const imr = simulateIMR(1.9, 4.6, 76, 70);
    const u5mr = simulateU5MR(1.9, 4.6, 76, 70);
    expect(u5mr).toBeGreaterThanOrEqual(imr);
  });
});

describe('simulateMMR', () => {
  it('should return a positive number', () => {
    const result = simulateMMR(1.9, 4.6, 76, 70);
    expect(result).toBeGreaterThanOrEqual(20);
  });

  it('should decrease with higher health spending', () => {
    const low = simulateMMR(1.0, 4.6, 76, 70);
    const high = simulateMMR(5.0, 4.6, 76, 70);
    expect(high).toBeLessThan(low);
  });
});

describe('simulateLiteracyRate', () => {
  it('should return a value between 50 and 100', () => {
    const result = simulateLiteracyRate(3.1, 26, 22);
    expect(result).toBeGreaterThanOrEqual(50);
    expect(result).toBeLessThanOrEqual(100);
  });

  it('should cap at 100', () => {
    const result = simulateLiteracyRate(10.0, 10, 100);
    expect(result).toBe(100);
  });

  it('should increase with more education spending', () => {
    const low = simulateLiteracyRate(2.0, 26, 22);
    const high = simulateLiteracyRate(6.0, 26, 22);
    expect(high).toBeGreaterThan(low);
  });
});

describe('simulateGER', () => {
  it('should return a valid positive number', () => {
    const result = simulateGER(3.1, 26, 22);
    expect(result).toBeGreaterThan(0);
  });
});

describe('simulateGDPGrowth', () => {
  it('should return a reasonable value', () => {
    const result = simulateGDPGrowth(6.5, 5.9, 3.3);
    expect(result).toBeGreaterThan(-10);
    expect(result).toBeLessThan(20);
  });

  it('should increase with higher capex', () => {
    const low = simulateGDPGrowth(6.5, 5.9, 2.0);
    const high = simulateGDPGrowth(6.5, 5.9, 8.0);
    expect(high).toBeGreaterThan(low);
  });
});

describe('simulateInflation', () => {
  it('should decrease with higher repo rate', () => {
    const low = simulateInflation(8.0, 5.9, 3.3);
    const high = simulateInflation(4.0, 5.9, 3.3);
    expect(high).toBeGreaterThan(low);
  });
});

describe('simulateAgriGrowth', () => {
  it('should increase with irrigation coverage', () => {
    const low = simulateAgriGrowth(5.0, 40, 12);
    const high = simulateAgriGrowth(5.0, 80, 12);
    expect(high).toBeGreaterThan(low);
  });
});

describe('simulateFarmerIncome', () => {
  it('should return income above baseline', () => {
    const result = simulateFarmerIncome(5.0, 53, 12);
    expect(result).toBeGreaterThan(10000);
  });

  it('should increase with higher MSP', () => {
    const low = simulateFarmerIncome(2.0, 53, 12);
    const high = simulateFarmerIncome(10.0, 53, 12);
    expect(high).toBeGreaterThan(low);
  });
});
