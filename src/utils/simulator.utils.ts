// ────────────────────────────────────────────────────────────────────────────
// Simulation Engine v2 — Diminishing Returns + Cross-Sector Effects
// ────────────────────────────────────────────────────────────────────────────
//
// Design principles:
// 1. At DEFAULT allocations → every metric returns the exact govt baseline value
// 2. Logarithmic scaling: first ₹ matters most, each additional ₹ helps less
// 3. Cross-sector multipliers: spending in one sector ripples through others
// 4. Realistic floors/ceilings based on global benchmarks
// 5. Trade-offs: you can't max everything — over-spending creates inflation pressure
//
// Helper: diminishing returns curve
// ratio = userBudget / defaultBudget (1.0 = unchanged)
// Returns a "boost factor" that ranges roughly from -1 (starved) to +1 (maxed)
// using a log-sigmoid hybrid: fast improvement up front, flattening at the top
// ────────────────────────────────────────────────────────────────────────────

import type { BudgetAllocations } from '../store/simulator.store';

// ── Baselines (must match SimulatorOutput currentValue props exactly) ───────
export const BASELINES = {
  imr: 27,           // per 1,000 live births (SRS 2022)
  u5mr: 35,          // per 1,000 live births
  mmr: 97,           // per 100,000 live births
  literacy: 77.7,    // % (NSO Survey)
  ger: 79.6,         // % secondary GER (UDISE+)
  gdpGrowth: 7.2,    // % real GDP growth
  inflation: 5.4,    // % CPI
  agriGrowth: 3.3,   // % agri GVA growth
  farmerIncome: 10218, // ₹/month
  cyberResolution: 32, // %
  convictionRate: 57,  // %
  crimeIndex: 268.8,   // per lakh
  employment: 0,       // delta in lakhs (0 at baseline)
} as const;

// ── Default FY25 allocations (imported values for reference) ────────────────
export const DEFAULT_ALLOC = {
  health: 0.89,
  education: 1.13,
  agriculture: 1.27,
  infrastructure: 11.11,
  rural: 1.77,
  socialWelfare: 1.93,
} as const;

const GDP_LAKH_CRORE = 296; // India GDP FY24

// ── Utility: diminishing-returns curve ──────────────────────────────────────
// Takes a budget ratio (user/default) and returns an improvement factor.
// At ratio=1 → returns 0 (no change from baseline)
// At ratio=2 → returns ~0.35 (35% of max theoretical improvement)
// At ratio=0 → returns large negative (collapse)
function diminishingFactor(ratio: number, sensitivity: number = 1): number {
  if (ratio <= 0) return -2 * sensitivity;
  // ln(1) = 0, ln(2) ≈ 0.693, ln(0.5) ≈ -0.693
  // Scale by sensitivity so different metrics can respond differently
  return Math.log(ratio) * sensitivity;
}

// Sigmoid clamp: smoothly limits value between min and max
function sigmoidClamp(value: number, min: number, max: number): number {
  const mid = (min + max) / 2;
  const range = max - min;
  // Map value to 0-1 range using sigmoid
  const normalized = 1 / (1 + Math.exp(-4 * (value - mid) / range));
  return min + normalized * range;
}

// ── Cross-sector context (computed once, shared across all formulas) ─────────
export interface CrossSectorContext {
  healthRatio: number;
  educationRatio: number;
  agricultureRatio: number;
  infrastructureRatio: number;
  ruralRatio: number;
  socialWelfareRatio: number;
  fiscalDeficit: number;     // % of GDP (higher = worse)
  isOverBudget: boolean;
  overBudgetAmount: number;  // ₹ lakh crore over
}

export function buildCrossSectorContext(
  allocs: BudgetAllocations,
  totalFixed: number,
  totalBudget: number
): CrossSectorContext {
  const totalSpent = totalFixed + Object.values(allocs).reduce((a, b) => a + b, 0);
  const remaining = totalBudget - totalSpent;
  const baseDeficit = 5.9; // FY25 baseline fiscal deficit % GDP
  const overBudgetAmount = remaining < 0 ? Math.abs(remaining) : 0;
  const fiscalDeficit = baseDeficit + (overBudgetAmount / GDP_LAKH_CRORE) * 100;

  return {
    healthRatio: allocs.health / DEFAULT_ALLOC.health,
    educationRatio: allocs.education / DEFAULT_ALLOC.education,
    agricultureRatio: allocs.agriculture / DEFAULT_ALLOC.agriculture,
    infrastructureRatio: allocs.infrastructure / DEFAULT_ALLOC.infrastructure,
    ruralRatio: allocs.rural / DEFAULT_ALLOC.rural,
    socialWelfareRatio: allocs.socialWelfare / DEFAULT_ALLOC.socialWelfare,
    fiscalDeficit,
    isOverBudget: remaining < 0,
    overBudgetAmount,
  };
}

// ════════════════════════════════════════════════════════════════════════════
//  HEALTH OUTCOMES
// ════════════════════════════════════════════════════════════════════════════

export function simulateIMR(ctx: CrossSectorContext): number {
  // Primary driver: health budget (with diminishing returns)
  const healthEffect = diminishingFactor(ctx.healthRatio, 0.5);
  // Cross-sector: rural dev helps sanitation, social welfare helps nutrition
  const ruralBoost = diminishingFactor(ctx.ruralRatio, 0.12);
  const socialBoost = diminishingFactor(ctx.socialWelfareRatio, 0.1);
  // Penalty: high inflation makes healthcare unaffordable
  const inflationPenalty = ctx.fiscalDeficit > 7 ? (ctx.fiscalDeficit - 7) * 0.8 : 0;

  const totalEffect = healthEffect + ruralBoost + socialBoost;
  // Each unit of effect = ~18% improvement in IMR (diminishing)
  const newIMR = BASELINES.imr * Math.exp(-totalEffect * 0.35) + inflationPenalty;
  return Math.max(5, Math.min(60, Math.round(newIMR)));
}

export function simulateU5MR(ctx: CrossSectorContext): number {
  // U5MR tracks with IMR but slightly worse (children are more vulnerable)
  const healthEffect = diminishingFactor(ctx.healthRatio, 0.45);
  const ruralBoost = diminishingFactor(ctx.ruralRatio, 0.15);
  const socialBoost = diminishingFactor(ctx.socialWelfareRatio, 0.12);
  const inflationPenalty = ctx.fiscalDeficit > 7 ? (ctx.fiscalDeficit - 7) * 1.0 : 0;

  const totalEffect = healthEffect + ruralBoost + socialBoost;
  const newU5MR = BASELINES.u5mr * Math.exp(-totalEffect * 0.32) + inflationPenalty;
  return Math.max(6, Math.min(75, Math.round(newU5MR)));
}

export function simulateMMR(ctx: CrossSectorContext): number {
  // MMR is very sensitive to health infrastructure
  const healthEffect = diminishingFactor(ctx.healthRatio, 0.6);
  const ruralBoost = diminishingFactor(ctx.ruralRatio, 0.18); // Rural health infra matters
  const socialBoost = diminishingFactor(ctx.socialWelfareRatio, 0.08);
  const inflationPenalty = ctx.fiscalDeficit > 7 ? (ctx.fiscalDeficit - 7) * 2.5 : 0;

  const totalEffect = healthEffect + ruralBoost + socialBoost;
  const newMMR = BASELINES.mmr * Math.exp(-totalEffect * 0.3) + inflationPenalty;
  return Math.max(20, Math.min(250, Math.round(newMMR)));
}

// ════════════════════════════════════════════════════════════════════════════
//  EDUCATION OUTCOMES
// ════════════════════════════════════════════════════════════════════════════

export function simulateLiteracyRate(ctx: CrossSectorContext): number {
  const eduEffect = diminishingFactor(ctx.educationRatio, 0.5);
  // Cross-sector: social welfare (mid-day meals, scholarships keep kids in school)
  const socialBoost = diminishingFactor(ctx.socialWelfareRatio, 0.12);
  // Infra helps: digital connectivity, school buildings
  const infraBoost = diminishingFactor(ctx.infrastructureRatio, 0.06);

  const totalEffect = eduEffect + socialBoost + infraBoost;
  // Literacy has a high baseline (77.7%), so gains are harder
  const maxGain = 100 - BASELINES.literacy; // ~22.3% room to grow
  const gain = maxGain * (1 - Math.exp(-totalEffect * 0.6));
  // Losses are faster (cutting education destroys literacy)
  const loss = totalEffect < 0 ? totalEffect * 8 : 0;

  return Math.min(100, Math.max(40, Math.round((BASELINES.literacy + gain + loss) * 10) / 10));
}

export function simulateGER(ctx: CrossSectorContext): number {
  const eduEffect = diminishingFactor(ctx.educationRatio, 0.55);
  const socialBoost = diminishingFactor(ctx.socialWelfareRatio, 0.1);
  const infraBoost = diminishingFactor(ctx.infrastructureRatio, 0.05);

  const totalEffect = eduEffect + socialBoost + infraBoost;
  const maxGain = 120 - BASELINES.ger;
  const gain = maxGain * (1 - Math.exp(-totalEffect * 0.5));
  const loss = totalEffect < 0 ? totalEffect * 10 : 0;

  return Math.min(120, Math.max(30, Math.round((BASELINES.ger + gain + loss) * 10) / 10));
}

// ════════════════════════════════════════════════════════════════════════════
//  ECONOMY OUTCOMES
// ════════════════════════════════════════════════════════════════════════════

// Dynamic repo rate: RBI reacts to inflation
export function simulateRepoRate(ctx: CrossSectorContext): number {
  const baseRepo = 6.5;
  const projectedInflation = simulateInflation(ctx);
  // RBI hiking rule: if inflation > 6% target, raise repo by 0.5 for each % above
  if (projectedInflation > 6.0) {
    return Math.min(9.0, baseRepo + (projectedInflation - 6.0) * 0.5);
  }
  // If inflation very low, RBI cuts
  if (projectedInflation < 4.0) {
    return Math.max(4.0, baseRepo - (4.0 - projectedInflation) * 0.4);
  }
  return baseRepo;
}

export function simulateGDPGrowth(ctx: CrossSectorContext): number {
  // Infrastructure is the primary GDP driver (2.45x multiplier)
  const infraEffect = diminishingFactor(ctx.infrastructureRatio, 0.7);
  // Education boosts long-term productivity
  const eduEffect = diminishingFactor(ctx.educationRatio, 0.15);
  // Health: healthy workers are productive workers
  const healthEffect = diminishingFactor(ctx.healthRatio, 0.08);
  // Rural development: market access helps commerce
  const ruralEffect = diminishingFactor(ctx.ruralRatio, 0.06);

  const positiveEffects = infraEffect + eduEffect + healthEffect + ruralEffect;

  // PENALTIES:
  // High fiscal deficit crowds out private investment
  const deficitPenalty = ctx.fiscalDeficit > 6.5
    ? (ctx.fiscalDeficit - 6.5) * 0.6
    : 0;
  // High inflation erodes growth
  const projectedInflation = simulateInflation(ctx);
  const inflationPenalty = projectedInflation > 6.0
    ? (projectedInflation - 6.0) * 0.35
    : 0;

  const gdp = BASELINES.gdpGrowth + positiveEffects * 2.8 - deficitPenalty - inflationPenalty;
  return Math.max(-5, Math.min(15, Math.round(gdp * 10) / 10));
}

export function simulateInflation(ctx: CrossSectorContext): number {
  // Inflation drivers:
  // 1. Fiscal deficit (more govt spending = more money in system)
  const deficitEffect = (ctx.fiscalDeficit - 5.9) * 0.5;
  // 2. Infrastructure spending (demand-pull: construction booms raise prices)
  const infraDemand = diminishingFactor(ctx.infrastructureRatio, 0.2);
  // 3. Agriculture MSP hikes → food inflation (major component of CPI)
  const agriEffect = diminishingFactor(ctx.agricultureRatio, 0.25);
  // 4. Social welfare cash transfers → more money chasing goods
  const socialEffect = diminishingFactor(ctx.socialWelfareRatio, 0.1);

  // Inflation dampeners:
  // Better supply chain (infra) can reduce costs in the long run
  const supplyEffect = ctx.infrastructureRatio > 1.2
    ? Math.min(0.3, (ctx.infrastructureRatio - 1.2) * 0.15)
    : 0;

  const inflation = BASELINES.inflation + deficitEffect + infraDemand * 1.5 + agriEffect * 1.2 + socialEffect * 0.8 - supplyEffect;
  return Math.max(1, Math.min(15, Math.round(inflation * 10) / 10));
}

// Employment generation from infrastructure and other spending
export function simulateEmployment(ctx: CrossSectorContext): number {
  // Infrastructure generates ~33 lakh jobs per ₹1L Cr capex
  const infraJobs = (ctx.infrastructureRatio - 1) * 11.11 * 3.3;
  // Rural dev (MGNREGA + construction) generates employment
  const ruralJobs = (ctx.ruralRatio - 1) * 1.77 * 8;
  // Social welfare creates jobs in healthcare, education delivery
  const socialJobs = (ctx.socialWelfareRatio - 1) * 1.93 * 2.5;
  // High inflation destroys purchasing power → reduces demand → job losses
  const projectedInflation = simulateInflation(ctx);
  const inflationJobLoss = projectedInflation > 7 ? (projectedInflation - 7) * 5 : 0;

  const totalJobs = infraJobs + ruralJobs + socialJobs - inflationJobLoss;
  return Math.round(totalJobs * 10) / 10; // in lakhs
}

// ════════════════════════════════════════════════════════════════════════════
//  AGRICULTURE OUTCOMES
// ════════════════════════════════════════════════════════════════════════════

export function simulateAgriGrowth(ctx: CrossSectorContext): number {
  const agriEffect = diminishingFactor(ctx.agricultureRatio, 0.55);
  // Cross-sector: rural dev → better irrigation, roads to markets
  const ruralBoost = diminishingFactor(ctx.ruralRatio, 0.2);
  // Infrastructure: cold chains, logistics, market connectivity
  const infraBoost = diminishingFactor(ctx.infrastructureRatio, 0.08);
  // Penalty: cutting agri credit destroys growth
  const starvationPenalty = ctx.agricultureRatio < 0.5 ? (0.5 - ctx.agricultureRatio) * 8 : 0;

  const totalEffect = agriEffect + ruralBoost + infraBoost;
  const growth = BASELINES.agriGrowth + totalEffect * 3.5 - starvationPenalty;
  return Math.max(-5, Math.min(12, Math.round(growth * 10) / 10));
}

export function simulateFarmerIncome(ctx: CrossSectorContext): number {
  const agriEffect = diminishingFactor(ctx.agricultureRatio, 0.5);
  const ruralBoost = diminishingFactor(ctx.ruralRatio, 0.2);
  const infraBoost = diminishingFactor(ctx.infrastructureRatio, 0.06);
  // Inflation erodes purchasing power
  const projectedInflation = simulateInflation(ctx);
  const inflationErosion = projectedInflation > 6
    ? (projectedInflation - 6) * 300
    : 0;

  const totalEffect = agriEffect + ruralBoost + infraBoost;
  const income = BASELINES.farmerIncome * (1 + totalEffect * 0.35) - inflationErosion;
  return Math.max(3000, Math.min(30000, Math.round(income)));
}

// ════════════════════════════════════════════════════════════════════════════
//  LAW & SAFETY OUTCOMES
// ════════════════════════════════════════════════════════════════════════════

// Police density scales with social welfare + some baseline
export function simulatePoliceDensity(ctx: CrossSectorContext): number {
  const baseline = 152; // per lakh
  const socialEffect = diminishingFactor(ctx.socialWelfareRatio, 0.4);
  return Math.max(100, Math.min(280, Math.round(baseline * (1 + socialEffect * 0.25))));
}

// Cyber crime resolution improves with social welfare (funding labs, cyber police)
export function simulateCyberResolution(ctx: CrossSectorContext): number {
  const socialEffect = diminishingFactor(ctx.socialWelfareRatio, 0.5);
  // Infra helps: better digital infrastructure for tracking
  const infraBoost = diminishingFactor(ctx.infrastructureRatio, 0.1);
  // Education: more tech-literate police force
  const eduBoost = diminishingFactor(ctx.educationRatio, 0.08);

  const totalEffect = socialEffect + infraBoost + eduBoost;
  const resolution = BASELINES.cyberResolution + totalEffect * 25;
  return Math.max(10, Math.min(85, Math.round(resolution)));
}

// Court conviction rate improves with judiciary funding
export function simulateConvictionRate(ctx: CrossSectorContext): number {
  const socialEffect = diminishingFactor(ctx.socialWelfareRatio, 0.45);
  // Education: legal literacy helps
  const eduBoost = diminishingFactor(ctx.educationRatio, 0.06);

  const totalEffect = socialEffect + eduBoost;
  const rate = BASELINES.convictionRate + totalEffect * 15;
  return Math.max(30, Math.min(90, Math.round(rate)));
}

// Overall crime index: lower is better
export function simulateCrimeIndex(ctx: CrossSectorContext): number {
  // More police → less crime
  const policeEffect = diminishingFactor(ctx.socialWelfareRatio, 0.35);
  // Education → less crime (opportunity cost of crime rises)
  const eduEffect = diminishingFactor(ctx.educationRatio, 0.2);
  // Social welfare → poverty reduction → less crime
  const socialEffect = diminishingFactor(ctx.socialWelfareRatio, 0.15);
  // Rural dev → less rural distress → fewer crimes
  const ruralEffect = diminishingFactor(ctx.ruralRatio, 0.1);
  // Inflation → more desperation → more crime
  const projectedInflation = simulateInflation(ctx);
  const inflationCrimePush = projectedInflation > 7 ? (projectedInflation - 7) * 8 : 0;

  const totalEffect = policeEffect + eduEffect + socialEffect + ruralEffect;
  const index = BASELINES.crimeIndex * Math.exp(-totalEffect * 0.18) + inflationCrimePush;
  return Math.max(120, Math.min(450, Math.round(index * 10) / 10));
}

// ════════════════════════════════════════════════════════════════════════════
//  CENTRALIZED OUTCOME COMPUTATION
// ════════════════════════════════════════════════════════════════════════════

export interface AllOutcomes {
  // Health
  imr: number;
  u5mr: number;
  mmr: number;
  // Education
  literacyRate: number;
  ger: number;
  // Economy
  gdpGrowth: number;
  inflation: number;
  repoRate: number;
  fiscalDeficit: number;
  employment: number;
  // Agriculture
  agriGrowth: number;
  farmerIncome: number;
  // Law & Safety
  policeDensity: number;
  cyberResolution: number;
  convictionRate: number;
  crimeIndex: number;
  // Meta
  ctx: CrossSectorContext;
}

export function computeAllOutcomes(
  allocs: BudgetAllocations,
  totalFixed: number,
  totalBudget: number
): AllOutcomes {
  const ctx = buildCrossSectorContext(allocs, totalFixed, totalBudget);

  return {
    imr: simulateIMR(ctx),
    u5mr: simulateU5MR(ctx),
    mmr: simulateMMR(ctx),
    literacyRate: simulateLiteracyRate(ctx),
    ger: simulateGER(ctx),
    gdpGrowth: simulateGDPGrowth(ctx),
    inflation: simulateInflation(ctx),
    repoRate: simulateRepoRate(ctx),
    fiscalDeficit: ctx.fiscalDeficit,
    employment: simulateEmployment(ctx),
    agriGrowth: simulateAgriGrowth(ctx),
    farmerIncome: simulateFarmerIncome(ctx),
    policeDensity: simulatePoliceDensity(ctx),
    cyberResolution: simulateCyberResolution(ctx),
    convictionRate: simulateConvictionRate(ctx),
    crimeIndex: simulateCrimeIndex(ctx),
    ctx,
  };
}
