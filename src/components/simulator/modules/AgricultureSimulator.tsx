import { SimulatorOutput } from '../SimulatorOutput';
import { useAgricultureSimulator } from '../../../hooks/useSimulator';
import { Card, CardContent } from '../../ui/card';
import { Zap } from 'lucide-react';

export function AgricultureSimulator() {
  const { agriGrowth, farmerIncome, derived, budget, crossEffects } = useAgricultureSimulator();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
      <div className="lg:col-span-4 flex flex-col gap-4 bg-muted/20 p-5 rounded-xl border overflow-y-auto scrollbar-thin">
        <h3 className="font-semibold text-lg">
          Budget → Agriculture Inputs
        </h3>
        <p className="text-xs text-muted-foreground -mt-2">
          Your ₹{budget.toFixed(2)}L Cr agriculture allocation translates to:
        </p>

        <DerivedInput label="Avg MSP Increase" value={`${derived.msp_inc}%`} benchmark="Recent avg: ~5% YoY" />
        <DerivedInput label="Irrigation Coverage" value={`${derived.irrigation}%`} benchmark="Current: ~53%" />
        <DerivedInput label="Agri Credit Growth" value={`${derived.credit_growth}%`} benchmark="Current: ~12% YoY" />

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
            ⚖️ Trade-off: High MSP support boosts farmer income but raises food inflation, hurting urban consumers.
          </p>
        </div>
      </div>
      
      <div className="lg:col-span-8 flex flex-col gap-4">
        <h3 className="font-semibold text-lg">Projected Outcomes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SimulatorOutput
            label="Agricultural GDP Growth"
            unit="%"
            currentValue={3.3}
            simulatedValue={agriGrowth}
            higherIsBetter={true}
            methodNote="Boosted by rural dev (roads, cold chains) and infra (logistics). Diminishing returns on budget alone."
            source="MoSPI"
          />
          <SimulatorOutput
            label="Avg Monthly Farmer Income"
            unit="₹"
            currentValue={10218}
            simulatedValue={farmerIncome}
            higherIsBetter={true}
            methodNote="Income gains eroded by high inflation. Rural dev + infra provide cross-sector market access boost."
            source="SAS 2019"
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
