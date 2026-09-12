import { SimulatorOutput } from '../SimulatorOutput';
import { useEconomySimulator } from '../../../hooks/useSimulator';
import { Card, CardContent } from '../../ui/card';
import { AlertTriangle, Zap, Briefcase } from 'lucide-react';

export function EconomySimulator() {
  const { gdpGrowth, inflation, repoRate, employment, derived, budget, effectiveDeficit, crossEffects } = useEconomySimulator();
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
        <DerivedInput
          label="RBI Repo Rate (Dynamic)"
          value={`${repoRate.toFixed(1)}%`}
          benchmark={`${repoRate > 6.5 ? '⚠ Hiked to fight inflation' : repoRate < 6.5 ? '✓ Cut due to low inflation' : 'Unchanged at 6.5%'}`}
          warn={repoRate > 7.5}
        />
        <DerivedInput
          label="Effective Fiscal Deficit"
          value={`${effectiveDeficit.toFixed(1)}%`}
          benchmark={`FRBM target: 3% • ${isHighDeficit ? '⚠ HIGH' : 'Manageable'}`}
          warn={isHighDeficit}
        />

        {/* Employment indicator */}
        <Card className={`bg-card/50 ${employment > 0 ? 'border-emerald-500/30' : employment < -3 ? 'border-red-500/30' : ''}`}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5" /> Employment Impact
              </span>
              <span className={`text-sm font-bold ${employment > 0 ? 'text-emerald-500' : employment < 0 ? 'text-red-500' : 'text-muted-foreground'}`}>
                {employment > 0 ? '+' : ''}{employment.toFixed(1)}L jobs
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              Net change from infra, rural dev & inflation effects
            </p>
          </CardContent>
        </Card>

        {isHighDeficit && (
          <div className="p-2 bg-red-500/10 border border-red-500/20 rounded-md text-[10px] text-red-600 dark:text-red-400 flex items-start gap-1.5">
            <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" />
            <span>High fiscal deficit increases inflation, raises borrowing costs, and risks sovereign rating downgrade. RBI is forced to hike rates.</span>
          </div>
        )}

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
            ⚖️ Trade-off: Infrastructure spending drives GDP & jobs but excess demand pushes inflation up. RBI dynamically reacts by adjusting the repo rate.
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
            methodNote="Infrastructure capex has 2.45x GDP multiplier. Penalized by high deficit & inflation. Education provides long-term boost."
            source="MoSPI"
          />
          <SimulatorOutput
            label="CPI Inflation"
            unit="%"
            currentValue={5.4}
            simulatedValue={inflation}
            higherIsBetter={false}
            methodNote="Driven by fiscal deficit + infra demand-pull + agri MSP hikes. Supply improvements from infra partially offset."
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
