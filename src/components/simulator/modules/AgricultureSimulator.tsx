import { SimulatorOutput } from '../SimulatorOutput';
import { useAgricultureSimulator } from '../../../hooks/useSimulator';
import { Card, CardContent } from '../../ui/card';

export function AgricultureSimulator() {
  const { agriGrowth, farmerIncome, derived, budget } = useAgricultureSimulator();

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

        <div className="mt-auto pt-3 border-t">
          <p className="text-[10px] text-muted-foreground italic">
            More ₹ → higher MSP support, irrigation expansion, and credit flow to farmers.
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
            methodNote="Growth% ≈ -2.15 + 0.2×(msp_inc) + 0.05×(irrigation) + 0.15×(credit)"
            source="MoSPI"
          />
          <SimulatorOutput
            label="Avg Monthly Farmer Income"
            unit="₹"
            currentValue={10218}
            simulatedValue={farmerIncome}
            higherIsBetter={true}
            methodNote="Income ≈ ₹4,643 + 350×(msp) + 45×(irrigation) + 120×(credit)"
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
