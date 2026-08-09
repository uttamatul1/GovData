import { SimulatorOutput } from '../SimulatorOutput';
import { useEconomySimulator } from '../../../hooks/useSimulator';
import { Card, CardContent } from '../../ui/card';
import { AlertTriangle } from 'lucide-react';

export function EconomySimulator() {
  const { gdpGrowth, inflation, derived, budget, effectiveDeficit } = useEconomySimulator();
  const isHighDeficit = effectiveDeficit > 6.5;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
      <div className="lg:col-span-4 flex flex-col gap-4 bg-muted/20 p-5 rounded-xl border overflow-y-auto scrollbar-thin">
        <h3 className="font-semibold text-lg">
          Budget → Economy Inputs
        </h3>
        <p className="text-xs text-muted-foreground -mt-2">
          Your ₹{budget.toFixed(2)}L Cr infrastructure allocation translates to:
        </p>

        <DerivedInput label="Capital Expenditure (% GDP)" value={`${derived.capex}%`} benchmark="FY25: 3.3%" />
        <DerivedInput label="RBI Repo Rate" value={`${derived.repo_rate}%`} benchmark="Monetary policy (fixed)" />
        <DerivedInput
          label="Effective Fiscal Deficit"
          value={`${effectiveDeficit.toFixed(1)}%`}
          benchmark={`FRBM target: 3% • ${isHighDeficit ? '⚠ HIGH' : 'Manageable'}`}
          warn={isHighDeficit}
        />

        {isHighDeficit && (
          <div className="p-2 bg-red-500/10 border border-red-500/20 rounded-md text-[10px] text-red-600 dark:text-red-400 flex items-start gap-1.5">
            <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" />
            <span>High fiscal deficit increases inflation, raises borrowing costs, and risks sovereign rating downgrade.</span>
          </div>
        )}

        <div className="mt-auto pt-3 border-t">
          <p className="text-[10px] text-muted-foreground italic">
            Infrastructure budget drives capital expenditure. Over-spending across all sectors increases the fiscal deficit, which feeds back into higher inflation.
          </p>
        </div>
      </div>
      
      <div className="lg:col-span-8 flex flex-col gap-4">
        <h3 className="font-semibold text-lg">Projected Outcomes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SimulatorOutput
            label="Real GDP Growth Rate"
            unit="%"
            currentValue={7.2}
            simulatedValue={gdpGrowth}
            higherIsBetter={true}
            methodNote="GDP% ≈ 8.3 - 0.5×(repo) - 0.3×(deficit-3) + 0.8×(capex)"
            source="MoSPI"
          />
          <SimulatorOutput
            label="CPI Inflation"
            unit="%"
            currentValue={5.4}
            simulatedValue={inflation}
            higherIsBetter={false}
            methodNote="CPI% ≈ 6.4 - 0.6×(repo) + 0.4×(deficit) + 0.15×(capex)"
            source="MoSPI"
          />
        </div>
      </div>
    </div>
  );
}

function DerivedInput({ label, value, benchmark, warn }: { label: string; value: string; benchmark: string; warn?: boolean }) {
  return (
    <Card className={`bg-card/50 ${warn ? 'border-red-500/30' : ''}`}>
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{label}</span>
          <span className={`text-sm font-bold ${warn ? 'text-red-500' : 'text-primary'}`}>{value}</span>
        </div>
        <p className="text-[10px] text-muted-foreground mt-0.5">{benchmark}</p>
      </CardContent>
    </Card>
  );
}
