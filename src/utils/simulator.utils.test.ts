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
  simulateCrimeIndex,
  simulateEmployment,
  buildCrossSectorContext,
  BASELINES,
  DEFAULT_ALLOC,
} from './simulator.utils';
import type { BudgetAllocations } from '../store/simulator.store';

// Helper: build a cross-sector context from allocation ratios
function makeCtx(overrides: Partial<BudgetAllocations> = {}) {
  const allocs: BudgetAllocations = {
    health: overrides.health ?? DEFAULT_ALLOC.health,
    education: overrides.education ?? DEFAULT_ALLOC.education,
    agriculture: overrides.agriculture ?? DEFAULT_ALLOC.agriculture,
    infrastructure: overrides.infrastructure ?? DEFAULT_ALLOC.infrastructure,
    rural: overrides.rural ?? DEFAULT_ALLOC.rural,
    socialWelfare: overrides.socialWelfare ?? DEFAULT_ALLOC.socialWelfare,
  };
  return buildCrossSectorContext(allocs, 29.13, 48.21);
}

describe('Baseline calibration — default allocations return govt baselines', () => {
  const ctx = makeCtx();

  it('IMR at baseline should be ~27', () => {
    expect(simulateIMR(ctx)).toBe(BASELINES.imr);
  });

  it('U5MR at baseline should be ~35', () => {
    expect(simulateU5MR(ctx)).toBe(BASELINES.u5mr);
  });

  it('MMR at baseline should be ~97', () => {
    expect(simulateMMR(ctx)).toBe(BASELINES.mmr);
  });

  it('Literacy at baseline should be ~77.7', () => {
    expect(simulateLiteracyRate(ctx)).toBe(BASELINES.literacy);
  });

  it('GER at baseline should be ~79.6', () => {
    expect(simulateGER(ctx)).toBe(BASELINES.ger);
  });

  it('GDP growth at baseline should be ~7.2', () => {
    const result = simulateGDPGrowth(ctx);
    expect(result).toBeCloseTo(BASELINES.gdpGrowth, 0);
  });

  it('Inflation at baseline should be ~5.4', () => {
    const result = simulateInflation(ctx);
    expect(result).toBeCloseTo(BASELINES.inflation, 0);
  });

  it('Agri growth at baseline should be ~3.3', () => {
    const result = simulateAgriGrowth(ctx);
    expect(result).toBeCloseTo(BASELINES.agriGrowth, 0);
  });

  it('Farmer income at baseline should be ~10,218', () => {
    const result = simulateFarmerIncome(ctx);
    expect(result).toBeCloseTo(BASELINES.farmerIncome, -2); // within 100
  });
});

describe('Diminishing returns', () => {
  it('IMR should decrease with more health spending', () => {
    const low = simulateIMR(makeCtx({ health: 0.5 }));
    const mid = simulateIMR(makeCtx({ health: 1.0 }));
    const high = simulateIMR(makeCtx({ health: 2.0 }));
    expect(high).toBeLessThan(mid);
    expect(mid).toBeLessThan(low);
  });

  it('doubling health budget should NOT halve IMR (diminishing returns)', () => {
    const baseline = simulateIMR(makeCtx());
    const doubled = simulateIMR(makeCtx({ health: DEFAULT_ALLOC.health * 2 }));
    const improvement = baseline - doubled;
    // Should improve but not by more than 50%
    expect(improvement).toBeGreaterThan(0);
    expect(improvement).toBeLessThan(baseline * 0.5);
  });

  it('IMR should floor at 5', () => {
    const result = simulateIMR(makeCtx({ health: 10 }));
    expect(result).toBeGreaterThanOrEqual(5);
  });
});

describe('Cross-sector effects', () => {
  it('rural development should boost health outcomes', () => {
    const noRural = simulateIMR(makeCtx({ rural: 0.5 }));
    const highRural = simulateIMR(makeCtx({ rural: 3.0 }));
    expect(highRural).toBeLessThan(noRural);
  });

  it('education spending should reduce crime', () => {
    const lowEdu = simulateCrimeIndex(makeCtx({ education: 0.5 }));
    const highEdu = simulateCrimeIndex(makeCtx({ education: 3.0 }));
    expect(highEdu).toBeLessThan(lowEdu);
  });

  it('infrastructure spending should boost GDP', () => {
    const low = simulateGDPGrowth(makeCtx({ infrastructure: 5.0 }));
    const high = simulateGDPGrowth(makeCtx({ infrastructure: 15.0 }));
    expect(high).toBeGreaterThan(low);
  });

  it('high agriculture spending should push up inflation', () => {
    const lowAgri = simulateInflation(makeCtx({ agriculture: 0.5 }));
    const highAgri = simulateInflation(makeCtx({ agriculture: 3.0 }));
    expect(highAgri).toBeGreaterThan(lowAgri);
  });

  it('over-spending should increase fiscal deficit and inflate', () => {
    const normalCtx = makeCtx();
    const overSpendCtx = makeCtx({ infrastructure: 20.0, health: 5.0 });
    expect(simulateInflation(overSpendCtx)).toBeGreaterThan(simulateInflation(normalCtx));
  });
});

describe('Employment generation', () => {
  it('should generate jobs with increased infrastructure', () => {
    const jobs = simulateEmployment(makeCtx({ infrastructure: 15.0 }));
    expect(jobs).toBeGreaterThan(0);
  });

  it('should lose jobs with severe cuts', () => {
    const jobs = simulateEmployment(makeCtx({ infrastructure: 3.0, rural: 0.3 }));
    expect(jobs).toBeLessThan(0);
  });
});

describe('Edge cases', () => {
  it('zeroing all budgets should not crash', () => {
    const ctx = makeCtx({
      health: 0,
      education: 0,
      agriculture: 0,
      infrastructure: 0,
      rural: 0,
      socialWelfare: 0,
    });
    expect(simulateIMR(ctx)).toBeGreaterThanOrEqual(5);
    expect(simulateLiteracyRate(ctx)).toBeGreaterThanOrEqual(40);
    expect(simulateGDPGrowth(ctx)).toBeGreaterThanOrEqual(-5);
  });

  it('maxing all budgets should not produce unreasonable values', () => {
    const ctx = makeCtx({
      health: 10,
      education: 10,
      agriculture: 10,
      infrastructure: 20,
      rural: 10,
      socialWelfare: 10,
    });
    const imr = simulateIMR(ctx);
    expect(imr).toBeGreaterThanOrEqual(5);
    expect(imr).toBeLessThanOrEqual(60);
  });
});
