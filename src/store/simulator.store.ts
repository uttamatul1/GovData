import { create } from 'zustand';

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

// Map budget allocations to policy simulator inputs
export function budgetToHealthInputs(healthBudget: number): {
  health_gdp: number;
  phc_density: number;
  immunisation: number;
  sanitation: number;
} {
  // India's GDP ~₹296 lakh crore (FY24). Health budget as % GDP:
  const gdpLakhCrore = 296;
  const healthGdpPct = (healthBudget / gdpLakhCrore) * 100;
  // More budget → more PHCs, better immunisation, better sanitation
  const phcDensity = 3.0 + (healthBudget / 0.89) * 1.6; // Scale from baseline
  const immunisation = 60 + Math.min(40, (healthBudget / 0.89) * 16);
  const sanitation = 50 + Math.min(50, (healthBudget / 0.89) * 20);

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
  // More budget → lower PTR (more teachers), more digital classrooms
  const ptr = Math.max(10, 35 - (eduBudget / 1.13) * 9);
  const digital = Math.min(100, (eduBudget / 1.13) * 22);

  return {
    edu_exp: Math.round(eduExpPct * 100) / 100,
    ptr: Math.round(ptr),
    digital_classroom: Math.round(digital),
  };
}

export function budgetToAgricultureInputs(agriBudget: number): {
  msp_inc: number;
  irrigation: number;
  credit_growth: number;
} {
  // More budget → higher MSP hikes possible, irrigation expansion, credit flow
  const mspInc = (agriBudget / 1.27) * 5;
  const irrigation = 40 + Math.min(60, (agriBudget / 1.27) * 13);
  const creditGrowth = (agriBudget / 1.27) * 12;

  return {
    msp_inc: Math.round(mspInc * 10) / 10,
    irrigation: Math.min(100, Math.round(irrigation)),
    credit_growth: Math.round(creditGrowth * 10) / 10,
  };
}

export function budgetToEconomyInputs(infraBudget: number): {
  capex: number;
  repo_rate: number;
  fiscal_deficit: number;
} {
  const gdpLakhCrore = 296;
  const capexPct = (infraBudget / gdpLakhCrore) * 100;

  return {
    capex: Math.round(capexPct * 100) / 100,
    repo_rate: 6.5,       // RBI decides this, not budget
    fiscal_deficit: 5.9,   // Derived from total spending
  };
}
