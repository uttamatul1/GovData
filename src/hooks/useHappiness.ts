import { useMemo, useRef, useEffect, useState } from 'react';
import {
  useSimulatorStore,
  DEFAULT_DISCRETIONARY,
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

interface HappinessReason {
  text: string;
  impact: 'positive' | 'negative' | 'neutral';
  points: number;
}

interface HappinessResult {
  score: number; // 0-100
  emoji: string;
  label: string;
  reasons: HappinessReason[];
  delta: number; // change from previous
  showDialog: boolean;
}

// Baseline values (government actuals — must match SimulatorOutput currentValue props)
const BASELINE = {
  imr: 27,
  u5mr: 35,
  mmr: 97,
  literacy: 80.9,    // PLFS 2023-24 national literacy (Age 7+)
  ger: 79.6,         // Secondary GER (matches EducationSimulator)
  gdpGrowth: 7.2,    // FY25 real GDP growth (matches EconomySimulator)
  inflation: 5.4,
  agriGrowth: 3.3,   // Agri GVA growth (matches AgricultureSimulator)
  farmerIncome: 10218,
};

function getEmoji(score: number): string {
  if (score >= 90) return '🤩';
  if (score >= 75) return '😄';
  if (score >= 60) return '🙂';
  if (score >= 45) return '😐';
  if (score >= 30) return '😟';
  if (score >= 15) return '😢';
  return '😭';
}

function getLabel(score: number): string {
  if (score >= 90) return 'Ecstatic';
  if (score >= 75) return 'Very Happy';
  if (score >= 60) return 'Content';
  if (score >= 45) return 'Neutral';
  if (score >= 30) return 'Unhappy';
  if (score >= 15) return 'Distressed';
  return 'Miserable';
}

export function useHappiness(): HappinessResult {
  const allocations = useSimulatorStore((s) => s.budgetAllocations);
  const prevScoreRef = useRef<number | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const dialogTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const result = useMemo(() => {
    const reasons: HappinessReason[] = [];
    let totalPoints = 50; // Start at neutral baseline

    // ─── Health impacts ───
    const healthDerived = budgetToHealthInputs(allocations.health);
    const simIMR = simulateIMR(healthDerived.health_gdp, healthDerived.phc_density, healthDerived.immunisation, healthDerived.sanitation);
    const simU5MR = simulateU5MR(healthDerived.health_gdp, healthDerived.phc_density, healthDerived.immunisation, healthDerived.sanitation);
    const simMMR = simulateMMR(healthDerived.health_gdp, healthDerived.phc_density, healthDerived.immunisation, healthDerived.sanitation);

    // IMR
    const imrDelta = BASELINE.imr - simIMR;
    if (imrDelta > 3) {
      const pts = Math.min(12, Math.round(imrDelta * 1.5));
      totalPoints += pts;
      reasons.push({ text: `Infant mortality dropped by ${imrDelta} points — more babies surviving their first year!`, impact: 'positive', points: pts });
    } else if (imrDelta < -2) {
      const pts = Math.max(-15, Math.round(imrDelta * 2));
      totalPoints += pts;
      reasons.push({ text: `Infant mortality worsened by ${Math.abs(imrDelta)} points — more newborns at risk.`, impact: 'negative', points: pts });
    }

    // MMR
    const mmrDelta = BASELINE.mmr - simMMR;
    if (mmrDelta > 10) {
      const pts = Math.min(10, Math.round(mmrDelta / 5));
      totalPoints += pts;
      reasons.push({ text: `Maternal mortality reduced by ${mmrDelta} — safer pregnancies for mothers.`, impact: 'positive', points: pts });
    } else if (mmrDelta < -5) {
      const pts = Math.max(-12, Math.round(mmrDelta / 3));
      totalPoints += pts;
      reasons.push({ text: `Maternal mortality increased by ${Math.abs(mmrDelta)} — mothers face greater risk.`, impact: 'negative', points: pts });
    }

    // U5MR
    const u5mrDelta = BASELINE.u5mr - simU5MR;
    if (u5mrDelta > 3) {
      const pts = Math.min(8, Math.round(u5mrDelta));
      totalPoints += pts;
      reasons.push({ text: `Under-5 mortality improved by ${u5mrDelta} points — children are healthier!`, impact: 'positive', points: pts });
    } else if (u5mrDelta < -2) {
      const pts = Math.max(-10, Math.round(u5mrDelta * 1.5));
      totalPoints += pts;
      reasons.push({ text: `Under-5 mortality worsened — more children at risk from preventable diseases.`, impact: 'negative', points: pts });
    }

    // ─── Education impacts ───
    const eduDerived = budgetToEducationInputs(allocations.education);
    const simLiteracy = simulateLiteracyRate(eduDerived.edu_exp, eduDerived.ptr, eduDerived.digital_classroom);
    const simGER = simulateGER(eduDerived.edu_exp, eduDerived.ptr, eduDerived.digital_classroom);

    const litDelta = simLiteracy - BASELINE.literacy;
    if (litDelta > 2) {
      const pts = Math.min(8, Math.round(litDelta * 2));
      totalPoints += pts;
      reasons.push({ text: `Literacy rate improved to ${simLiteracy}% — a more educated population!`, impact: 'positive', points: pts });
    } else if (litDelta < -1) {
      const pts = Math.max(-8, Math.round(litDelta * 2));
      totalPoints += pts;
      reasons.push({ text: `Literacy stagnated at ${simLiteracy}% — education system needs more investment.`, impact: 'negative', points: pts });
    }

    const gerDelta = simGER - BASELINE.ger;
    if (gerDelta > 3) {
      const pts = Math.min(6, Math.round(gerDelta));
      totalPoints += pts;
      reasons.push({ text: `Higher education enrolment rose to ${simGER}% — more youth pursuing degrees.`, impact: 'positive', points: pts });
    } else if (gerDelta < -2) {
      const pts = Math.max(-6, Math.round(gerDelta));
      totalPoints += pts;
      reasons.push({ text: `Higher education access declined — fewer students can afford college.`, impact: 'negative', points: pts });
    }

    // ─── Economy impacts ───
    const econDerived = budgetToEconomyInputs(allocations.infrastructure);
    const remaining = getRemainingBudget(allocations);
    const effectiveDeficit = remaining < 0
      ? econDerived.fiscal_deficit + (Math.abs(remaining) / 296) * 100
      : econDerived.fiscal_deficit;

    const simGDP = simulateGDPGrowth(econDerived.repo_rate, effectiveDeficit, econDerived.capex);
    const simInflation = simulateInflation(econDerived.repo_rate, effectiveDeficit, econDerived.capex);

    const gdpDelta = simGDP - BASELINE.gdpGrowth;
    if (gdpDelta > 0.5) {
      const pts = Math.min(10, Math.round(gdpDelta * 4));
      totalPoints += pts;
      reasons.push({ text: `GDP growth surged to ${simGDP}% — the economy is booming, creating jobs!`, impact: 'positive', points: pts });
    } else if (gdpDelta < -0.5) {
      const pts = Math.max(-10, Math.round(gdpDelta * 4));
      totalPoints += pts;
      reasons.push({ text: `GDP growth slowed to ${simGDP}% — economic slowdown threatens livelihoods.`, impact: 'negative', points: pts });
    }

    const inflationDelta = simInflation - BASELINE.inflation;
    if (inflationDelta > 1) {
      const pts = Math.max(-12, Math.round(-inflationDelta * 3));
      totalPoints += pts;
      reasons.push({ text: `Inflation rose to ${simInflation}% — families struggle to afford essentials like food & fuel.`, impact: 'negative', points: pts });
    } else if (inflationDelta < -0.5) {
      const pts = Math.min(8, Math.round(Math.abs(inflationDelta) * 3));
      totalPoints += pts;
      reasons.push({ text: `Inflation contained at ${simInflation}% — purchasing power improved for citizens.`, impact: 'positive', points: pts });
    }

    // ─── Agriculture impacts ───
    const agriDerived = budgetToAgricultureInputs(allocations.agriculture);
    const simAgriGrowth = simulateAgriGrowth(agriDerived.msp_inc, agriDerived.irrigation, agriDerived.credit_growth);
    const simFarmerIncome = simulateFarmerIncome(agriDerived.msp_inc, agriDerived.irrigation, agriDerived.credit_growth);

    const agriDelta = simAgriGrowth - BASELINE.agriGrowth;
    if (agriDelta > 0.5) {
      const pts = Math.min(6, Math.round(agriDelta * 3));
      totalPoints += pts;
      reasons.push({ text: `Agriculture growing at ${simAgriGrowth}% — farmers see better harvests!`, impact: 'positive', points: pts });
    } else if (agriDelta < -0.5) {
      const pts = Math.max(-6, Math.round(agriDelta * 3));
      totalPoints += pts;
      reasons.push({ text: `Agricultural growth slowed — rural distress increases.`, impact: 'negative', points: pts });
    }

    const incomeDelta = simFarmerIncome - BASELINE.farmerIncome;
    if (incomeDelta > 1000) {
      const pts = Math.min(8, Math.round(incomeDelta / 500));
      totalPoints += pts;
      reasons.push({ text: `Farmer income rose to ₹${simFarmerIncome.toLocaleString()}/month — rural prosperity!`, impact: 'positive', points: pts });
    } else if (incomeDelta < -500) {
      const pts = Math.max(-8, Math.round(incomeDelta / 500));
      totalPoints += pts;
      reasons.push({ text: `Farmer income dropped to ₹${simFarmerIncome.toLocaleString()}/month — agrarian crisis deepens.`, impact: 'negative', points: pts });
    }

    // ─── Fiscal health ───
    if (remaining < -1) {
      const deficitPenalty = Math.max(-20, Math.round(remaining * 3));
      totalPoints += deficitPenalty;
      reasons.push({ text: `Deficit spending of ₹${Math.abs(remaining).toFixed(1)}L Cr — future generations bear the debt burden.`, impact: 'negative', points: deficitPenalty });
    } else if (remaining > 2) {
      const pts = Math.min(5, Math.round(remaining));
      totalPoints += pts;
      reasons.push({ text: `Fiscal discipline maintained with ₹${remaining.toFixed(1)}L Cr surplus — stable economy!`, impact: 'positive', points: pts });
    }

    // ─── Social welfare check ───
    const socialDelta = allocations.socialWelfare - DEFAULT_DISCRETIONARY.socialWelfare;
    if (socialDelta > 0.5) {
      const pts = Math.min(6, Math.round(socialDelta * 3));
      totalPoints += pts;
      reasons.push({ text: `Social welfare spending increased — vulnerable communities get better support.`, impact: 'positive', points: pts });
    } else if (socialDelta < -0.3) {
      const pts = Math.max(-8, Math.round(socialDelta * 4));
      totalPoints += pts;
      reasons.push({ text: `Social welfare cuts — the poorest citizens lose pension & nutrition support.`, impact: 'negative', points: pts });
    }

    // Rural development check
    const ruralDelta = allocations.rural - DEFAULT_DISCRETIONARY.rural;
    if (ruralDelta > 0.3) {
      const pts = Math.min(5, Math.round(ruralDelta * 3));
      totalPoints += pts;
      reasons.push({ text: `Rural development boost — better roads, housing, and drinking water for villages.`, impact: 'positive', points: pts });
    } else if (ruralDelta < -0.3) {
      const pts = Math.max(-6, Math.round(ruralDelta * 3));
      totalPoints += pts;
      reasons.push({ text: `Rural development cuts — villages face infrastructure neglect.`, impact: 'negative', points: pts });
    }

    // Clamp score
    const score = Math.max(0, Math.min(100, Math.round(totalPoints)));

    // Sort reasons by impact
    reasons.sort((a, b) => {
      if (a.impact === 'negative' && b.impact !== 'negative') return -1;
      if (a.impact !== 'negative' && b.impact === 'negative') return 1;
      return Math.abs(b.points) - Math.abs(a.points);
    });

    return {
      score,
      emoji: getEmoji(score),
      label: getLabel(score),
      reasons: reasons.slice(0, 6), // Show top 6 reasons
    };
  }, [allocations]);

  // Track score changes and trigger dialog
  useEffect(() => {
    if (prevScoreRef.current !== null) {
      const delta = Math.abs(result.score - prevScoreRef.current);
      if (delta >= 3) {
        setShowDialog(true);
        if (dialogTimerRef.current) clearTimeout(dialogTimerRef.current);
        dialogTimerRef.current = setTimeout(() => setShowDialog(false), 8000);
      }
    }
    prevScoreRef.current = result.score;

    return () => {
      if (dialogTimerRef.current) clearTimeout(dialogTimerRef.current);
    };
  }, [result.score]);

  const delta = prevScoreRef.current !== null ? result.score - (prevScoreRef.current ?? result.score) : 0;

  return {
    ...result,
    delta,
    showDialog,
  };
}
