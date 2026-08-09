import { SimulatorOutput } from '../SimulatorOutput';
import { useHealthSimulator } from '../../../hooks/useSimulator';
import { Card, CardContent } from '../../ui/card';

export function HealthSimulator() {
  const { imr, u5mr, mmr, derived, budget } = useHealthSimulator();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
      <div className="lg:col-span-4 flex flex-col gap-4 bg-muted/20 p-5 rounded-xl border overflow-y-auto scrollbar-thin">
        <h3 className="font-semibold text-lg">
          Budget → Health Inputs
        </h3>
        <p className="text-xs text-muted-foreground -mt-2">
          Your ₹{budget.toFixed(2)}L Cr health allocation translates to:
        </p>

        <DerivedInput label="Health Expenditure (% GDP)" value={`${derived.health_gdp}%`} benchmark="WHO recommends 5%" />
        <DerivedInput label="PHCs per 1L Population" value={derived.phc_density.toFixed(1)} benchmark="Current: 4.6" />
        <DerivedInput label="Immunisation Coverage" value={`${derived.immunisation}%`} benchmark="Current: 76%" />
        <DerivedInput label="Sanitation Coverage" value={`${derived.sanitation}%`} benchmark="Current: 70%" />

        <div className="mt-auto pt-3 border-t">
          <p className="text-[10px] text-muted-foreground italic">
            Inputs auto-calculated from your health budget allocation. More ₹ → higher spending % of GDP,
            more PHCs, better immunisation & sanitation coverage.
          </p>
        </div>
      </div>
      
      <div className="lg:col-span-8 flex flex-col gap-4">
        <h3 className="font-semibold text-lg">Projected Outcomes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SimulatorOutput
            label="Infant Mortality Rate (IMR)"
            unit="per 1,000 live births"
            currentValue={27}
            simulatedValue={imr}
            higherIsBetter={false}
            methodNote="IMR ≈ 57 - 14.2×(health_gdp) - 0.8×(phc) - 0.18×(imm) - 0.12×(san)"
            source="SRS 2022"
          />
          <SimulatorOutput
            label="Under-5 Mortality Rate (U5MR)"
            unit="per 1,000 live births"
            currentValue={35}
            simulatedValue={u5mr}
            higherIsBetter={false}
            methodNote="U5MR ≈ 71.8 - 16.5×(health_gdp) - 1.0×(phc) - 0.22×(imm) - 0.15×(san)"
            source="SRS 2022"
          />
          <SimulatorOutput
            label="Maternal Mortality Ratio (MMR)"
            unit="per 100,000 live births"
            currentValue={97}
            simulatedValue={mmr}
            higherIsBetter={false}
            methodNote="MMR ≈ 206.6 - 45×(health_gdp) - 3.5×(phc) - 0.5×(imm) - 0.6×(san)"
            source="SRS Special Bulletin 2020"
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
