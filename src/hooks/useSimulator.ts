import { useMemo } from 'react';
import {
  useSimulatorStore,
  budgetToHealthInputs,
  budgetToEducationInputs,
  budgetToAgricultureInputs,
  budgetToEconomyInputs,
  getRemainingBudget,
} from '../store/simulator.store';
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
} from '../utils/simulator.utils';

export function useHealthSimulator() {
  const allocations = useSimulatorStore((s) => s.budgetAllocations);
  const healthBudget = allocations.health;

  const derived = useMemo(() => budgetToHealthInputs(healthBudget), [healthBudget]);

  const imr = useMemo(
    () => simulateIMR(derived.health_gdp, derived.phc_density, derived.immunisation, derived.sanitation),
    [derived]
  );
  const u5mr = useMemo(
    () => simulateU5MR(derived.health_gdp, derived.phc_density, derived.immunisation, derived.sanitation),
    [derived]
  );
  const mmr = useMemo(
    () => simulateMMR(derived.health_gdp, derived.phc_density, derived.immunisation, derived.sanitation),
    [derived]
  );

  return { imr, u5mr, mmr, derived, budget: healthBudget };
}

export function useEducationSimulator() {
  const allocations = useSimulatorStore((s) => s.budgetAllocations);
  const eduBudget = allocations.education;

  const derived = useMemo(() => budgetToEducationInputs(eduBudget), [eduBudget]);

  const literacyRate = useMemo(
    () => simulateLiteracyRate(derived.edu_exp, derived.ptr, derived.digital_classroom),
    [derived]
  );
  const ger = useMemo(
    () => simulateGER(derived.edu_exp, derived.ptr, derived.digital_classroom),
    [derived]
  );

  return { literacyRate, ger, derived, budget: eduBudget };
}

export function useEconomySimulator() {
  const allocations = useSimulatorStore((s) => s.budgetAllocations);
  const infraBudget = allocations.infrastructure;

  const derived = useMemo(() => budgetToEconomyInputs(infraBudget), [infraBudget]);

  // Factor in deficit from overspending
  const remaining = useMemo(() => getRemainingBudget(allocations), [allocations]);
  const effectiveDeficit = remaining < 0
    ? derived.fiscal_deficit + (Math.abs(remaining) / 296) * 100
    : derived.fiscal_deficit;

  const gdpGrowth = useMemo(
    () => simulateGDPGrowth(derived.repo_rate, effectiveDeficit, derived.capex),
    [derived, effectiveDeficit]
  );
  const inflation = useMemo(
    () => simulateInflation(derived.repo_rate, effectiveDeficit, derived.capex),
    [derived, effectiveDeficit]
  );

  return { gdpGrowth, inflation, derived, budget: infraBudget, effectiveDeficit };
}

export function useAgricultureSimulator() {
  const allocations = useSimulatorStore((s) => s.budgetAllocations);
  const agriBudget = allocations.agriculture;

  const derived = useMemo(() => budgetToAgricultureInputs(agriBudget), [agriBudget]);

  const agriGrowth = useMemo(
    () => simulateAgriGrowth(derived.msp_inc, derived.irrigation, derived.credit_growth),
    [derived]
  );
  const farmerIncome = useMemo(
    () => simulateFarmerIncome(derived.msp_inc, derived.irrigation, derived.credit_growth),
    [derived]
  );

  return { agriGrowth, farmerIncome, derived, budget: agriBudget };
}
