import { SimulatorOutput } from '../SimulatorOutput';
import { useEducationSimulator } from '../../../hooks/useSimulator';
import { Card, CardContent } from '../../ui/card';

export function EducationSimulator() {
  const { literacyRate, ger, derived, budget } = useEducationSimulator();

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

        <div className="mt-auto pt-3 border-t">
          <p className="text-[10px] text-muted-foreground italic">
            More ₹ → higher % GDP spend, lower pupil-teacher ratios, more digital classrooms.
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
            methodNote="Lit% ≈ 71.6 + 4.5×(edu_exp) - 0.3×(ptr_excess) + 0.2×(digital_cov)"
            source="NSO Survey"
          />
          <SimulatorOutput
            label="Gross Enrolment Ratio (Secondary)"
            unit="%"
            currentValue={79.6}
            simulatedValue={ger}
            higherIsBetter={true}
            methodNote="GER ≈ 74.4 + 5.0×(edu_exp) - 0.25×(ptr_excess) + 0.15×(digital_cov)"
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
