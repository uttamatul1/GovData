import { SimulatorOutput } from '../SimulatorOutput';
import { useHealthSimulator } from '../../../hooks/useSimulator';
import { Card, CardContent } from '../../ui/card';
import { Zap } from 'lucide-react';

export function HealthSimulator() {
  const { imr, u5mr, mmr, derived, budget, crossEffects } = useHealthSimulator();

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
            Inputs scale with diminishing returns — first ₹ matters most. Rural dev & social welfare also boost health outcomes.
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
            methodNote="Diminishing returns: doubling health budget drops IMR ~30%. Cross-boosted by rural dev & social welfare."
            source="SRS 2022"
          />
          <SimulatorOutput
            label="Under-5 Mortality Rate (U5MR)"
            unit="per 1,000 live births"
            currentValue={35}
            simulatedValue={u5mr}
            higherIsBetter={false}
            methodNote="Tracks IMR closely. Children are more vulnerable to nutrition cuts (social welfare dependency)."
            source="SRS 2022"
          />
          <SimulatorOutput
            label="Maternal Mortality Ratio (MMR)"
            unit="per 100,000 live births"
            currentValue={97}
            simulatedValue={mmr}
            higherIsBetter={false}
            methodNote="Very sensitive to health infra. Rural development boosts through better facility access."
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
