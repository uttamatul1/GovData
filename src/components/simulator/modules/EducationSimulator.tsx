import { SimulatorOutput } from '../SimulatorOutput';
import { useEducationSimulator } from '../../../hooks/useSimulator';
import { Card, CardContent } from '../../ui/card';
import { Zap } from 'lucide-react';

export function EducationSimulator() {
  const { literacyRate, ger, derived, budget, crossEffects } = useEducationSimulator();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
      <div className="lg:col-span-4 flex flex-col gap-4 bg-muted/20 p-5 rounded-xl border overflow-y-auto scrollbar-thin">
        <h3 className="font-semibold text-lg">
          Budget → Education Inputs
        </h3>
        <p className="text-xs text-muted-foreground -mt-2">
          Your ₹{budget.toFixed(2)}L Cr education allocation translates to:
        </p>

        <DerivedInput label="Education Exp. (% GDP)" value={`${derived.edu_exp}%`} benchmark="NEP 2020 target: 6%" />
        <DerivedInput label="Pupil-Teacher Ratio" value={`${derived.ptr}:1`} benchmark="RTE mandate: 30:1" />
        <DerivedInput label="Digital Classroom Coverage" value={`${derived.digital_classroom}%`} benchmark="Current: ~22%" />

        {/* Cross-sector effects */}
        {crossEffects.length > 0 && (
          <div className="space-y-1.5 pt-3 border-t">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-500" /> Ripple Effects
            </p>
            {crossEffects.map((effect, i) => (
              <p key={i} className="text-[10px] text-muted-foreground bg-muted/40 rounded px-2 py-1">
                {effect}
              </p>
            ))}
          </div>
        )}

        <div className="mt-auto pt-3 border-t">
          <p className="text-[10px] text-muted-foreground italic">
            More ₹ → higher % GDP spend, lower pupil-teacher ratios, more digital classrooms. Social welfare (mid-day meals) also keeps kids in school.
          </p>
        </div>
      </div>
      
      <div className="lg:col-span-8 flex flex-col gap-4">
        <h3 className="font-semibold text-lg">Projected Outcomes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SimulatorOutput
            label="Literacy Rate"
            unit="%"
            currentValue={77.7}
            simulatedValue={literacyRate}
            higherIsBetter={true}
            methodNote="High baseline = harder gains. Social welfare & infra (connectivity) provide cross-sector boosts."
            source="NSO Survey"
          />
          <SimulatorOutput
            label="Gross Enrolment Ratio (Secondary)"
            unit="%"
            currentValue={79.6}
            simulatedValue={ger}
            higherIsBetter={true}
            methodNote="Responds to education spending + social welfare scholarships. Cuts cause rapid decline."
            source="UDISE+ 2021-22"
          />
        </div>
      </div>
    </div>
  );
}

function DerivedInput({ label, value, benchmark }: { label: string; value: string; benchmark: string }) {
  return (
    <Card className="bg-card/50">
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{label}</span>
          <span className="text-sm font-bold text-primary">{value}</span>
        </div>
        <p className="text-[10px] text-muted-foreground mt-0.5">{benchmark}</p>
      </CardContent>
    </Card>
  );
}
