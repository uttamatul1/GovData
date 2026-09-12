import { useMemo } from 'react';
import {
  useSimulatorStore,
  budgetToHealthInputs,
  budgetToEducationInputs,
  budgetToAgricultureInputs,
  budgetToEconomyInputs,
  getAllOutcomes,
} from '../store/simulator.store';
import type { AllOutcomes } from '../utils/simulator.utils';

// ── Centralized hook: computes ALL outcomes once ────────────────────────────
function useAllOutcomes(): AllOutcomes {
  const allocations = useSimulatorStore((s) => s.budgetAllocations);
  return useMemo(() => getAllOutcomes(allocations), [allocations]);
}

// ── Health ───────────────────────────────────────────────────────────────────
export function useHealthSimulator() {
  const allocations = useSimulatorStore((s) => s.budgetAllocations);
  const healthBudget = allocations.health;
  const outcomes = useAllOutcomes();

  const derived = useMemo(() => budgetToHealthInputs(healthBudget), [healthBudget]);

  // Cross-sector effects for display
  const crossEffects = useMemo(() => {
    const effects: string[] = [];
    if (outcomes.ctx.ruralRatio > 1.1) effects.push('Rural development is boosting sanitation coverage');
    if (outcomes.ctx.socialWelfareRatio > 1.1) effects.push('Social welfare nutrition programs are improving child health');
    if (outcomes.ctx.fiscalDeficit > 7) effects.push('⚠ High inflation is making healthcare unaffordable');
    if (outcomes.ctx.healthRatio < 0.5) effects.push('⚠ Severe health budget cuts — crisis conditions');
    return effects;
  }, [outcomes]);

  return {
    imr: outcomes.imr,
    u5mr: outcomes.u5mr,
    mmr: outcomes.mmr,
    derived,
    budget: healthBudget,
    crossEffects,
  };
}

// ── Education ────────────────────────────────────────────────────────────────
export function useEducationSimulator() {
  const allocations = useSimulatorStore((s) => s.budgetAllocations);
  const eduBudget = allocations.education;
  const outcomes = useAllOutcomes();

  const derived = useMemo(() => budgetToEducationInputs(eduBudget), [eduBudget]);

  const crossEffects = useMemo(() => {
    const effects: string[] = [];
    if (outcomes.ctx.socialWelfareRatio > 1.1) effects.push('Mid-day meals & scholarships are keeping kids in school');
    if (outcomes.ctx.infrastructureRatio > 1.1) effects.push('Better infrastructure → digital connectivity reaching schools');
    if (outcomes.ctx.educationRatio < 0.5) effects.push('⚠ Education crisis — schools lack teachers and resources');
    return effects;
  }, [outcomes]);

  return {
    literacyRate: outcomes.literacyRate,
    ger: outcomes.ger,
    derived,
    budget: eduBudget,
    crossEffects,
  };
}

// ── Economy ──────────────────────────────────────────────────────────────────
export function useEconomySimulator() {
  const allocations = useSimulatorStore((s) => s.budgetAllocations);
  const infraBudget = allocations.infrastructure;
  const outcomes = useAllOutcomes();

  const derived = useMemo(() => budgetToEconomyInputs(infraBudget, allocations), [infraBudget, allocations]);

  const crossEffects = useMemo(() => {
    const effects: string[] = [];
    if (outcomes.inflation > 7) effects.push('⚠ High inflation is dragging down GDP growth');
    if (outcomes.ctx.fiscalDeficit > 7) effects.push('⚠ Runaway fiscal deficit — RBI forced to hike rates');
    if (outcomes.employment > 10) effects.push(`Infrastructure spending generating ~${outcomes.employment.toFixed(0)}L new jobs`);
    if (outcomes.employment < -5) effects.push('⚠ Economic contraction destroying jobs');
    if (outcomes.ctx.educationRatio > 1.2) effects.push('Higher education spending boosting long-term growth potential');
    return effects;
  }, [outcomes]);

  return {
    gdpGrowth: outcomes.gdpGrowth,
    inflation: outcomes.inflation,
    repoRate: outcomes.repoRate,
    employment: outcomes.employment,
    derived,
    budget: infraBudget,
    effectiveDeficit: outcomes.fiscalDeficit,
    crossEffects,
  };
}

// ── Agriculture ──────────────────────────────────────────────────────────────
export function useAgricultureSimulator() {
  const allocations = useSimulatorStore((s) => s.budgetAllocations);
  const agriBudget = allocations.agriculture;
  const outcomes = useAllOutcomes();

  const derived = useMemo(() => budgetToAgricultureInputs(agriBudget), [agriBudget]);

  const crossEffects = useMemo(() => {
    const effects: string[] = [];
    if (outcomes.ctx.ruralRatio > 1.1) effects.push('Rural roads & cold chains improving market access');
    if (outcomes.ctx.infrastructureRatio > 1.1) effects.push('Logistics infra reducing post-harvest losses');
    if (outcomes.inflation > 7) effects.push('⚠ High inflation eroding farmer purchasing power');
    if (outcomes.ctx.agricultureRatio > 1.5) effects.push('⚠ High MSP hikes may push up food inflation');
    if (outcomes.ctx.agricultureRatio < 0.5) effects.push('⚠ Agrarian crisis — farmer suicides may rise');
    return effects;
  }, [outcomes]);

  return {
    agriGrowth: outcomes.agriGrowth,
    farmerIncome: outcomes.farmerIncome,
    derived,
    budget: agriBudget,
    crossEffects,
  };
}

// ── Law & Safety ─────────────────────────────────────────────────────────────
export function useLawSafetySimulator() {
  const allocations = useSimulatorStore((s) => s.budgetAllocations);
  const socialBudget = allocations.socialWelfare;
  const outcomes = useAllOutcomes();

  const crossEffects = useMemo(() => {
    const effects: string[] = [];
    if (outcomes.ctx.educationRatio > 1.2) effects.push('Higher literacy → reduced crime through better opportunities');
    if (outcomes.inflation > 7) effects.push('⚠ Economic desperation from inflation pushing crime up');
    if (outcomes.ctx.ruralRatio > 1.1) effects.push('Rural development reducing distress-driven crime');
    if (outcomes.ctx.socialWelfareRatio < 0.5) effects.push('⚠ Slashed welfare → poverty-driven crime surge');
    return effects;
  }, [outcomes]);

  return {
    policeDensity: outcomes.policeDensity,
    cyberResolution: outcomes.cyberResolution,
    convictionRate: outcomes.convictionRate,
    crimeIndex: outcomes.crimeIndex,
    budget: socialBudget,
    crossEffects,
  };
}
