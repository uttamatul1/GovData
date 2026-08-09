import { useState } from 'react';
import { useSimulatorStore } from '../../../store/simulator.store';
import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { ShieldCheck, Info, Scale } from 'lucide-react';
import { SimulatorInfoModal } from '../SimulatorInfoModal';

const INPUT_INFO_DATA: Record<string, { title: string; category: string; description: string; fundedSchemes: string[]; simulationLogic: string; baselineSource: string }> = {
  police_ratio: {
    title: 'Police Personnel per 1 Lakh Population',
    category: 'Policy Input',
    description: 'Number of active police personnel available per 100,000 population. UN benchmark is 222.',
    fundedSchemes: ['Police Modernization Scheme', 'State Police Force Recruitment & Training'],
    simulationLogic: 'Increasing police density directly deters violent crime and reduces overall IPC crime rates.',
    baselineSource: 'Bureau of Police Research & Development (BPR&D) 2022',
  },
  cyber_grant: {
    title: 'Cyber Crime Special Grants',
    category: 'Policy Input',
    description: 'Dedicated financial grants to establish digital forensic labs, AI threat monitoring, and cyber crime stations.',
    fundedSchemes: ['Indian Cyber Crime Coordination Centre (I4C)', 'National Cyber Crime Reporting Portal'],
    simulationLogic: 'Higher cyber grants directly boost online fraud detection and case resolution rates.',
    baselineSource: 'Ministry of Home Affairs (MHA) Cyber Division',
  },
  fast_track_courts: {
    title: 'Fast-Track Special Courts',
    category: 'Policy Input',
    description: 'Specialized courts established for speedy disposal of cases involving sexual offenses, corruption, and cyber fraud.',
    fundedSchemes: ['Fast Track Special Courts (FTSC) Scheme under Centrally Sponsored Schemes'],
    simulationLogic: 'Adding fast-track courts reduces pendency and boosts conviction rates for major crimes.',
    baselineSource: 'Department of Justice / Ministry of Law',
  },
  resolution_rate: {
    title: 'Cyber Crime Resolution Rate',
    category: 'Projected Outcome',
    description: 'Percentage of registered cyber crime cases successfully investigated and resolved.',
    fundedSchemes: ['Forensics Modernization & Specialized Cyber Police Cells'],
    simulationLogic: 'Projected to increase from 32% baseline up to 75% under optimal cyber infrastructure grants.',
    baselineSource: 'NCRB — Cyber Crime Statistics 2022',
  },
  conviction_rate: {
    title: 'Court Conviction Rate',
    category: 'Projected Outcome',
    description: 'Percentage of tried criminal cases resulting in conviction.',
    fundedSchemes: ['Judicial Infrastructure & Fast-Track Courts'],
    simulationLogic: 'Projected to increase from 57% baseline up to 82% under judicial capacity expansion.',
    baselineSource: 'NCRB — Judicial Statistics 2022',
  },
};

export function LawSafetySimulator() {
  const allocations = useSimulatorStore((s) => s.budgetAllocations);
  const socialBudget = allocations.socialWelfare; // Using social welfare / safety budget

  // Local input states
  const [policeRatio, setPoliceRatio] = useState(152); // Baseline ~152 per lakh
  const [cyberGrant, setCyberGrant] = useState(500);  // ₹500 Cr
  const [fastTrackCourts, setFastTrackCourts] = useState(1023); // Baseline ~1023 courts

  const [activeModalKey, setActiveModalKey] = useState<string | null>(null);

  // Projections calculations
  const projectedCyberResolution = Math.min(85, Math.round(32 + (cyberGrant / 500) * 22));
  const projectedConvictionRate = Math.min(90, Math.round(57 + (fastTrackCourts / 1023) * 12));
  const projectedOverallCrimeIndex = Math.max(160, Math.round(268.8 - (policeRatio - 152) * 0.45));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Controls Column */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-5 space-y-5">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  <h3 className="font-bold text-base">Law & Order Inputs</h3>
                </div>
                <Badge variant="outline" className="text-xs">
                  Allocated: ₹{socialBudget.toFixed(2)}L Cr
                </Badge>
              </div>

              {/* Input 1: Police Ratio */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold flex items-center gap-1">
                    Police Density (per 1 lakh)
                    <button onClick={() => setActiveModalKey('police_ratio')} className="text-muted-foreground hover:text-primary">
                      <Info className="w-3.5 h-3.5" />
                    </button>
                  </span>
                  <span className="font-mono font-bold text-primary">{policeRatio} / 1 lakh</span>
                </div>
                <input
                  type="range"
                  min="120"
                  max="250"
                  value={policeRatio}
                  onChange={(e) => setPoliceRatio(Number(e.target.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <p className="text-[10px] text-muted-foreground">National baseline: 152 • UN Benchmark: 222</p>
              </div>

              {/* Input 2: Cyber Crime Grants */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold flex items-center gap-1">
                    Cyber Forensics Grants (₹ Cr)
                    <button onClick={() => setActiveModalKey('cyber_grant')} className="text-muted-foreground hover:text-primary">
                      <Info className="w-3.5 h-3.5" />
                    </button>
                  </span>
                  <span className="font-mono font-bold text-primary">₹{cyberGrant} Cr</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="2500"
                  step="50"
                  value={cyberGrant}
                  onChange={(e) => setCyberGrant(Number(e.target.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <p className="text-[10px] text-muted-foreground">Funds I4C forensics labs & cyber police stations</p>
              </div>

              {/* Input 3: Fast Track Courts */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold flex items-center gap-1">
                    Fast-Track Special Courts
                    <button onClick={() => setActiveModalKey('fast_track_courts')} className="text-muted-foreground hover:text-primary">
                      <Info className="w-3.5 h-3.5" />
                    </button>
                  </span>
                  <span className="font-mono font-bold text-primary">{fastTrackCourts} Courts</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="3000"
                  step="25"
                  value={fastTrackCourts}
                  onChange={(e) => setFastTrackCourts(Number(e.target.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <p className="text-[10px] text-muted-foreground">Speeds up trial disposal for sexual crimes & corruption</p>
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
                <Badge variant="secondary" className="text-xs">Model Projections</Badge>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {/* Outcome 1 */}
                <div className="border rounded-lg p-3 bg-muted/20">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold flex items-center gap-1">
                      Cyber Crime Resolution Rate
                      <button onClick={() => setActiveModalKey('resolution_rate')} className="text-muted-foreground hover:text-primary">
                        <Info className="w-3.5 h-3.5" />
                      </button>
                    </span>
                    <Badge variant="outline" className="text-[10px]">NCRB 2022: 32%</Badge>
                  </div>
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {projectedCyberResolution}%
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    +{projectedCyberResolution - 32}% improvement over baseline
                  </p>
                </div>

                {/* Outcome 2 */}
                <div className="border rounded-lg p-3 bg-muted/20">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold flex items-center gap-1">
                      Court Conviction Rate
                      <button onClick={() => setActiveModalKey('conviction_rate')} className="text-muted-foreground hover:text-primary">
                        <Info className="w-3.5 h-3.5" />
                      </button>
                    </span>
                    <Badge variant="outline" className="text-[10px]">NCRB 2022: 57%</Badge>
                  </div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {projectedConvictionRate}%
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    Disposal efficiency across fast-track courts
                  </p>
                </div>

                {/* Outcome 3 */}
                <div className="border rounded-lg p-3 bg-muted/20">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold">Projected Crime Rate Index</span>
                    <Badge variant="outline" className="text-[10px]">Baseline: 268.8</Badge>
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    {projectedOverallCrimeIndex} <span className="text-xs font-normal text-muted-foreground">per lakh</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {activeModalKey && INPUT_INFO_DATA[activeModalKey] && (
        <SimulatorInfoModal
          {...INPUT_INFO_DATA[activeModalKey]}
          isOpen={!!activeModalKey}
          onClose={() => setActiveModalKey(null)}
        />
      )}
    </div>
  );
}
