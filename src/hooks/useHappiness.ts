import { useMemo, useRef, useEffect, useState } from 'react';
import {
  useSimulatorStore,
  DEFAULT_DISCRETIONARY,
  getAllOutcomes,
  getRemainingBudget,
} from '../store/simulator.store';
import { BASELINES } from '../utils/simulator.utils';

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

    // Compute ALL outcomes using the new centralized engine
    const outcomes = getAllOutcomes(allocations);
    const remaining = getRemainingBudget(allocations);

    // ─── Health impacts ───
    const imrDelta = BASELINES.imr - outcomes.imr;
    if (imrDelta > 3) {
      const pts = Math.min(12, Math.round(imrDelta * 1.2));
      totalPoints += pts;
      reasons.push({ text: `Infant mortality dropped by ${imrDelta} points — more babies surviving their first year!`, impact: 'positive', points: pts });
    } else if (imrDelta < -2) {
      const pts = Math.max(-15, Math.round(imrDelta * 1.5));
      totalPoints += pts;
      reasons.push({ text: `Infant mortality worsened by ${Math.abs(imrDelta)} points — more newborns at risk.`, impact: 'negative', points: pts });
    }

    const mmrDelta = BASELINES.mmr - outcomes.mmr;
    if (mmrDelta > 10) {
      const pts = Math.min(10, Math.round(mmrDelta / 5));
      totalPoints += pts;
      reasons.push({ text: `Maternal mortality reduced by ${mmrDelta} — safer pregnancies for mothers.`, impact: 'positive', points: pts });
    } else if (mmrDelta < -5) {
      const pts = Math.max(-12, Math.round(mmrDelta / 3));
      totalPoints += pts;
      reasons.push({ text: `Maternal mortality increased by ${Math.abs(mmrDelta)} — mothers face greater risk.`, impact: 'negative', points: pts });
    }

    const u5mrDelta = BASELINES.u5mr - outcomes.u5mr;
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
    const litDelta = outcomes.literacyRate - BASELINES.literacy;
    if (litDelta > 2) {
      const pts = Math.min(8, Math.round(litDelta * 1.5));
      totalPoints += pts;
      reasons.push({ text: `Literacy rate improved to ${outcomes.literacyRate}% — a more educated India!`, impact: 'positive', points: pts });
    } else if (litDelta < -1) {
      const pts = Math.max(-8, Math.round(litDelta * 2));
      totalPoints += pts;
      reasons.push({ text: `Literacy stagnated at ${outcomes.literacyRate}% — education system needs more investment.`, impact: 'negative', points: pts });
    }

    const gerDelta = outcomes.ger - BASELINES.ger;
    if (gerDelta > 3) {
      const pts = Math.min(6, Math.round(gerDelta));
      totalPoints += pts;
      reasons.push({ text: `Higher education enrolment rose to ${outcomes.ger}% — more youth pursuing degrees.`, impact: 'positive', points: pts });
    } else if (gerDelta < -2) {
      const pts = Math.max(-6, Math.round(gerDelta));
      totalPoints += pts;
      reasons.push({ text: `Higher education access declined — fewer students can afford college.`, impact: 'negative', points: pts });
    }

    // ─── Economy impacts (with trade-off narratives) ───
    const gdpDelta = outcomes.gdpGrowth - BASELINES.gdpGrowth;
    if (gdpDelta > 0.5) {
      const pts = Math.min(10, Math.round(gdpDelta * 3.5));
      totalPoints += pts;
      reasons.push({ text: `GDP growth surged to ${outcomes.gdpGrowth}% — the economy is booming, creating jobs!`, impact: 'positive', points: pts });
    } else if (gdpDelta < -0.5) {
      const pts = Math.max(-10, Math.round(gdpDelta * 3.5));
      totalPoints += pts;
      reasons.push({ text: `GDP growth slowed to ${outcomes.gdpGrowth}% — economic slowdown threatens livelihoods.`, impact: 'negative', points: pts });
    }

    const inflationDelta = outcomes.inflation - BASELINES.inflation;
    if (inflationDelta > 1) {
      const pts = Math.max(-12, Math.round(-inflationDelta * 2.5));
      totalPoints += pts;
      reasons.push({ text: `Inflation rose to ${outcomes.inflation}% — families struggle to afford food & fuel.`, impact: 'negative', points: pts });
    } else if (inflationDelta < -0.5) {
      const pts = Math.min(8, Math.round(Math.abs(inflationDelta) * 2.5));
      totalPoints += pts;
      reasons.push({ text: `Inflation contained at ${outcomes.inflation}% — purchasing power improved for citizens.`, impact: 'positive', points: pts });
    }

    // ─── Cross-sector trade-off narratives (the fun part!) ───
    // MSP hikes + food inflation trade-off
    if (outcomes.ctx.agricultureRatio > 1.3 && outcomes.inflation > 6.5) {
      const pts = -4;
      totalPoints += pts;
      reasons.push({ text: `High MSP support boosted farmer income but food prices rose — urban families are upset.`, impact: 'negative', points: pts });
    }

    // Infrastructure boom + inflation trade-off
    if (outcomes.ctx.infrastructureRatio > 1.3 && outcomes.inflation > 6.5) {
      const pts = -3;
      totalPoints += pts;
      reasons.push({ text: `Infrastructure spending generated jobs but demand-pull inflation is heating up the economy.`, impact: 'negative', points: pts });
    }

    // Employment gains
    if (outcomes.employment > 10) {
      const pts = Math.min(8, Math.round(outcomes.employment / 3));
      totalPoints += pts;
      reasons.push({ text: `Capital spending generated ~${Math.round(outcomes.employment)}L new jobs — youth are optimistic!`, impact: 'positive', points: pts });
    } else if (outcomes.employment < -5) {
      const pts = Math.max(-8, Math.round(outcomes.employment / 2));
      totalPoints += pts;
      reasons.push({ text: `Economic contraction destroyed ~${Math.abs(Math.round(outcomes.employment))}L jobs — unemployment crisis.`, impact: 'negative', points: pts });
    }

    // ─── Agriculture impacts ───
    const agriDelta = outcomes.agriGrowth - BASELINES.agriGrowth;
    if (agriDelta > 0.5) {
      const pts = Math.min(6, Math.round(agriDelta * 2.5));
      totalPoints += pts;
      reasons.push({ text: `Agriculture growing at ${outcomes.agriGrowth}% — farmers see better harvests!`, impact: 'positive', points: pts });
    } else if (agriDelta < -0.5) {
      const pts = Math.max(-6, Math.round(agriDelta * 2.5));
      totalPoints += pts;
      reasons.push({ text: `Agricultural growth slowed to ${outcomes.agriGrowth}% — rural distress increases.`, impact: 'negative', points: pts });
    }

    const incomeDelta = outcomes.farmerIncome - BASELINES.farmerIncome;
    if (incomeDelta > 1000) {
      const pts = Math.min(8, Math.round(incomeDelta / 500));
      totalPoints += pts;
      reasons.push({ text: `Farmer income rose to ₹${outcomes.farmerIncome.toLocaleString()}/month — rural prosperity!`, impact: 'positive', points: pts });
    } else if (incomeDelta < -500) {
      const pts = Math.max(-8, Math.round(incomeDelta / 400));
      totalPoints += pts;
      reasons.push({ text: `Farmer income dropped to ₹${outcomes.farmerIncome.toLocaleString()}/month — agrarian crisis deepens.`, impact: 'negative', points: pts });
    }

    // ─── Law & Safety impacts ───
    const crimeDelta = BASELINES.crimeIndex - outcomes.crimeIndex;
    if (crimeDelta > 20) {
      const pts = Math.min(6, Math.round(crimeDelta / 10));
      totalPoints += pts;
      reasons.push({ text: `Crime index dropped to ${outcomes.crimeIndex} per lakh — streets are safer!`, impact: 'positive', points: pts });
    } else if (crimeDelta < -10) {
      const pts = Math.max(-6, Math.round(crimeDelta / 8));
      totalPoints += pts;
      reasons.push({ text: `Crime index rose to ${outcomes.crimeIndex} per lakh — public safety deteriorating.`, impact: 'negative', points: pts });
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
      reasons: reasons.slice(0, 8), // Show top 8 reasons
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
