import { useLawSafetySimulator } from '../../../hooks/useSimulator';
import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { ShieldCheck, Scale, Zap } from 'lucide-react';
import { BASELINES } from '../../../utils/simulator.utils';

export function LawSafetySimulator() {
  const { policeDensity, cyberResolution, convictionRate, crimeIndex, budget, crossEffects } = useLawSafetySimulator();

  const crimeImproved = crimeIndex < BASELINES.crimeIndex;
  const cyberImproved = cyberResolution > BASELINES.cyberResolution;
  const courtImproved = convictionRate > BASELINES.convictionRate;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Inputs Column */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-5 space-y-5">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  <h3 className="font-bold text-base">Law & Order — Budget Driven</h3>
                </div>
                <Badge variant="outline" className="text-xs">
                  Social Welfare: ₹{budget.toFixed(2)}L Cr
                </Badge>
              </div>

              <p className="text-xs text-muted-foreground">
                Law enforcement capacity scales with your <span className="font-semibold text-foreground">Social Welfare</span> budget allocation.
                Cross-sector effects from education (less crime), inflation (more desperation), and rural development (less distress) also play a role.
              </p>

              {/* Police Density — derived from budget */}
              <div className="border rounded-lg p-3 bg-muted/20">
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="font-semibold">Police Density (per 1 lakh)</span>
                  <span className="font-mono font-bold text-primary">{policeDensity} / 1 lakh</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary/70 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (policeDensity / 280) * 100)}%` }}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">
                  National baseline: 152 • UN Benchmark: 222 • Max achievable: ~280
                </p>
              </div>

              {/* Cross-sector effects */}
              {crossEffects.length > 0 && (
                <div className="space-y-1.5 pt-3 border-t">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-500" /> Cross-Sector Influences
                  </p>
                  {crossEffects.map((effect, i) => (
                    <p key={i} className="text-[10px] text-muted-foreground bg-muted/40 rounded px-2 py-1">
                      {effect}
                    </p>
                  ))}
                </div>
              )}

              <div className="pt-3 border-t">
                <p className="text-[10px] text-muted-foreground italic">
                  💡 Crime is a cross-sector outcome: education reduces it (better opportunities), inflation increases it (desperation), social welfare reduces poverty-driven crime.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Projections Column */}
        <div className="space-y-4">
          <Card className="h-full border-l-4 border-l-emerald-500">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="font-bold text-base flex items-center gap-2">
                  <Scale className="w-5 h-5 text-emerald-500" /> Projected Safety Outcomes
                </h3>
                <Badge variant="secondary" className="text-xs">Cross-Sector Model</Badge>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {/* Cyber Crime Resolution */}
                <div className="border rounded-lg p-3 bg-muted/20">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold">Cyber Crime Resolution Rate</span>
                    <Badge variant="outline" className="text-[10px]">NCRB 2022: {BASELINES.cyberResolution}%</Badge>
                  </div>
                  <div className={`text-2xl font-bold ${cyberImproved ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                    {cyberResolution}%
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {cyberImproved
                      ? `+${cyberResolution - BASELINES.cyberResolution}% improvement — better forensic labs & infra`
                      : `${cyberResolution - BASELINES.cyberResolution}% decline — underfunded cyber police`
                    }
                  </p>
                </div>

                {/* Court Conviction Rate */}
                <div className="border rounded-lg p-3 bg-muted/20">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold">Court Conviction Rate</span>
                    <Badge variant="outline" className="text-[10px]">NCRB 2022: {BASELINES.convictionRate}%</Badge>
                  </div>
                  <div className={`text-2xl font-bold ${courtImproved ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>
                    {convictionRate}%
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {courtImproved
                      ? 'Better-funded fast-track courts improving disposal rates'
                      : 'Judiciary underfunding → cases piling up'
                    }
                  </p>
                </div>

                {/* Crime Rate Index */}
                <div className="border rounded-lg p-3 bg-muted/20">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold">Projected Crime Rate Index</span>
                    <Badge variant="outline" className="text-[10px]">Baseline: {BASELINES.crimeIndex}</Badge>
                  </div>
                  <div className={`text-2xl font-bold ${crimeImproved ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                    {crimeIndex} <span className="text-xs font-normal text-muted-foreground">per lakh</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {crimeImproved
                      ? `Crime down by ${(BASELINES.crimeIndex - crimeIndex).toFixed(1)} — policing + education + welfare reducing crime`
                      : `Crime up by ${(crimeIndex - BASELINES.crimeIndex).toFixed(1)} — budget cuts & inflation fueling desperation`
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
