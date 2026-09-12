import { create } from 'zustand';
import { computeAllOutcomes, type AllOutcomes } from '../utils/simulator.utils';

// FY 2024-25 Union Budget figures in ₹ Lakh Crore
export const TOTAL_BUDGET = 48.21; // Total expenditure

// Fixed/non-discretionary allocations (Union Budget 2024-25 Expenditure Profile)
export const FIXED_ALLOCATIONS = {
  defence: 6.215,           // Ministry of Defence total allocation
  interestPayments: 12.09,  // Debt servicing & interest obligations
  subsidies: 4.10,          // Food, fertilizer, & fuel subsidies
  pensions: 2.40,          // Central pensions & retirement benefits
  otherFixed: 4.325,        // Statutory transfers & establishment heads
} as const;

export const TOTAL_FIXED = Object.values(FIXED_ALLOCATIONS).reduce((a, b) => a + b, 0); // ~29.13L Cr

// Default discretionary allocations (FY25 actuals, approximate)
export const DEFAULT_DISCRETIONARY: BudgetAllocations = {
  health: 0.89,       // MoHFW allocation
  education: 1.13,    // MoE allocation
  agriculture: 1.27,  // MoA + PM-KISAN etc.
  infrastructure: 11.11, // Capital expenditure (roads, railways, etc.)
  rural: 1.77,        // MoRD allocation
  socialWelfare: 1.93, // Social schemes, SC/ST welfare etc.
};

export const TOTAL_DEFAULT_DISCRETIONARY = Object.values(DEFAULT_DISCRETIONARY).reduce((a, b) => a + b, 0);

export interface BudgetAllocations {
  health: number;
  education: number;
  agriculture: number;
  infrastructure: number;
  rural: number;
  socialWelfare: number;
}

export type BudgetSector = keyof BudgetAllocations;

export const BUDGET_SECTORS: { key: BudgetSector; label: string; color: string; icon: string }[] = [
  { key: 'health', label: 'Health & Family Welfare', color: '#D85A30', icon: '🏥' },
  { key: 'education', label: 'Education & Literacy', color: '#1D9E75', icon: '📚' },
  { key: 'agriculture', label: 'Agriculture & Allied', color: '#639922', icon: '🌾' },
  { key: 'infrastructure', label: 'Infrastructure & Capex', color: '#378ADD', icon: '🏗️' },
  { key: 'rural', label: 'Rural Development', color: '#BA7517', icon: '🏘️' },
  { key: 'socialWelfare', label: 'Social Welfare', color: '#D4537E', icon: '🤝' },
];

interface SimulatorState {
  inputs: Record<string, number>;
  setInputValue: (id: string, value: number) => void;
  resetInputs: () => void;

  // Budget game
  budgetAllocations: BudgetAllocations;
  setBudgetAllocation: (sector: BudgetSector, amount: number) => void;
  resetBudget: () => void;
}

export const useSimulatorStore = create<SimulatorState>((set) => ({
  inputs: {},
  setInputValue: (id, value) =>
    set((state) => ({
      inputs: { ...state.inputs, [id]: value },
    })),
  resetInputs: () => set({ inputs: {} }),

  // Budget game
  budgetAllocations: { ...DEFAULT_DISCRETIONARY },
  setBudgetAllocation: (sector, amount) =>
    set((state) => ({
      budgetAllocations: {
        ...state.budgetAllocations,
        [sector]: Math.max(0, Math.round(amount * 100) / 100),
      },
    })),
  resetBudget: () =>
    set({
      budgetAllocations: { ...DEFAULT_DISCRETIONARY },
      inputs: {},
    }),
}));

// Derived helper: total discretionary allocated
export function getTotalDiscretionary(allocs: BudgetAllocations): number {
  return Object.values(allocs).reduce((a, b) => a + b, 0);
}

// Derived helper: remaining budget (negative = deficit)
export function getRemainingBudget(allocs: BudgetAllocations): number {
  const totalExpenditure = TOTAL_FIXED + getTotalDiscretionary(allocs);
  return TOTAL_BUDGET - totalExpenditure;
}

// ── Centralized outcome computation ─────────────────────────────────────────
// Single function that takes the full budget and returns ALL projected metrics.
// This is the key change: cross-sector effects are computed in one pass.
export function getAllOutcomes(allocs: BudgetAllocations): AllOutcomes {
  return computeAllOutcomes(allocs, TOTAL_FIXED, TOTAL_BUDGET);
}

// ── Derived health inputs (for display in simulator panels) ─────────────────
export function budgetToHealthInputs(healthBudget: number): {
  health_gdp: number;
  phc_density: number;
  immunisation: number;
  sanitation: number;
} {
  const gdpLakhCrore = 296;
  const healthGdpPct = (healthBudget / gdpLakhCrore) * 100;
  const ratio = healthBudget / DEFAULT_DISCRETIONARY.health;
  // More budget → more PHCs, better immunisation, better sanitation (with diminishing returns)
  const phcDensity = 4.6 * Math.pow(ratio, 0.4);
  const immunisation = Math.min(100, 76 * Math.pow(ratio, 0.3));
  const sanitation = Math.min(100, 70 * Math.pow(ratio, 0.35));

  return {
    health_gdp: Math.round(healthGdpPct * 100) / 100,
    phc_density: Math.round(phcDensity * 10) / 10,
    immunisation: Math.min(100, Math.round(immunisation)),
    sanitation: Math.min(100, Math.round(sanitation)),
  };
}

export function budgetToEducationInputs(eduBudget: number): {
  edu_exp: number;
  ptr: number;
  digital_classroom: number;
} {
  const gdpLakhCrore = 296;
  const eduExpPct = (eduBudget / gdpLakhCrore) * 100;
  const ratio = eduBudget / DEFAULT_DISCRETIONARY.education;
  // More budget → lower PTR (more teachers), more digital classrooms
  const ptr = Math.max(10, Math.round(26 / Math.pow(ratio, 0.35)));
  const digital = Math.min(100, Math.round(22 * Math.pow(ratio, 0.5)));

  return {
    edu_exp: Math.round(eduExpPct * 100) / 100,
    ptr,
    digital_classroom: digital,
  };
}

export function budgetToAgricultureInputs(agriBudget: number): {
  msp_inc: number;
  irrigation: number;
  credit_growth: number;
} {
  const ratio = agriBudget / DEFAULT_DISCRETIONARY.agriculture;
  const mspInc = Math.round(5 * Math.pow(ratio, 0.6) * 10) / 10;
  const irrigation = Math.min(100, Math.round(53 * Math.pow(ratio, 0.4)));
  const creditGrowth = Math.round(12 * Math.pow(ratio, 0.5) * 10) / 10;

  return {
    msp_inc: mspInc,
    irrigation,
    credit_growth: creditGrowth,
  };
}

export function budgetToEconomyInputs(infraBudget: number, allocs: BudgetAllocations): {
  capex: number;
  repo_rate: number;
  fiscal_deficit: number;
} {
  const gdpLakhCrore = 296;
  const capexPct = (infraBudget / gdpLakhCrore) * 100;
  const outcomes = getAllOutcomes(allocs);

  return {
    capex: Math.round(capexPct * 100) / 100,
    repo_rate: outcomes.repoRate,
    fiscal_deficit: outcomes.fiscalDeficit,
  };
}
