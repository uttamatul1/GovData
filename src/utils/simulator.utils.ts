// ────────────────────────────────────────────────────────────────────────────
// Simulation formulas — calibrated so that at default FY25 budget inputs,
// each function returns the government-reported baseline value.
// Coefficients preserve relative sensitivity; intercepts are shifted.
// ────────────────────────────────────────────────────────────────────────────

export function simulateIMR(healthGdp: number, phc: number, immunisation: number, sanitation: number): number {
  // Baseline inputs: healthGdp≈0.30, phc≈4.6, imm≈76, san≈70 → target 27
  const imr = 57 - (14.2 * healthGdp) - (0.8 * phc) - (0.18 * immunisation) - (0.12 * sanitation);
  return Math.max(5, Math.round(imr));
}

export function simulateU5MR(healthGdp: number, phc: number, immunisation: number, sanitation: number): number {
  // Baseline inputs → target 35
  const u5mr = 71.8 - (16.5 * healthGdp) - (1.0 * phc) - (0.22 * immunisation) - (0.15 * sanitation);
  return Math.max(6, Math.round(u5mr));
}

export function simulateMMR(healthGdp: number, phc: number, immunisation: number, sanitation: number): number {
  // Baseline inputs → target 97
  const mmr = 206.6 - (45 * healthGdp) - (3.5 * phc) - (0.5 * immunisation) - (0.6 * sanitation);
  return Math.max(20, Math.round(mmr));
}

export function simulateLiteracyRate(eduExp: number, ptr: number, digitalClassroom: number): number {
  // Baseline inputs: eduExp≈0.38, ptr≈26, digital≈22 → target 77.7
  const lit = 71.6 + (4.5 * eduExp) - (0.3 * (ptr > 30 ? ptr - 30 : 0)) + (0.2 * digitalClassroom);
  return Math.min(100, Math.round(lit * 10) / 10);
}

export function simulateGER(eduExp: number, ptr: number, digitalClassroom: number): number {
  // Baseline inputs → target 79.6 (Secondary GER)
  const ger = 74.4 + (5.0 * eduExp) - (0.25 * (ptr > 30 ? ptr - 30 : 0)) + (0.15 * digitalClassroom);
  return Math.min(120, Math.round(ger * 10) / 10);
}

export function simulateGDPGrowth(repoRate: number, fiscalDeficit: number, capex: number): number {
  // Baseline inputs: repo=6.5, deficit=5.9, capex≈3.75 → target 7.2
  const growth = 8.3 - (0.5 * repoRate) - (0.3 * (fiscalDeficit - 3)) + (0.8 * capex);
  return Math.max(-10, Math.round(growth * 10) / 10);
}

export function simulateInflation(repoRate: number, fiscalDeficit: number, capex: number): number {
  // Baseline inputs → target 5.4
  const inflation = 6.4 - (0.6 * repoRate) + (0.4 * fiscalDeficit) + (0.15 * capex);
  return Math.max(0, Math.round(inflation * 10) / 10);
}

export function simulateAgriGrowth(mspInc: number, irrigation: number, creditGrowth: number): number {
  // Baseline inputs: msp=5.0, irrigation=53, credit=12.0 → target 3.3
  const growth = -2.15 + (0.2 * mspInc) + (0.05 * irrigation) + (0.15 * creditGrowth);
  return Math.round(growth * 10) / 10;
}

export function simulateFarmerIncome(mspInc: number, irrigation: number, creditGrowth: number): number {
  // Baseline inputs → target 10,218
  const income = 4643 + (350 * mspInc) + (45 * irrigation) + (120 * creditGrowth);
  return Math.round(income);
}
