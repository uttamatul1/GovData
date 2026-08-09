import { useMemo, useState } from 'react';
import {
  useSimulatorStore,
  TOTAL_BUDGET,
  TOTAL_FIXED,
  BUDGET_SECTORS,
  getTotalDiscretionary,
  getRemainingBudget,
} from '../../store/simulator.store';
import type { BudgetSector } from '../../store/simulator.store';
import { AlertTriangle, RotateCcw, IndianRupee, Info } from 'lucide-react';
import { Button } from '../ui/button';
import { SimulatorInfoModal } from './SimulatorInfoModal';

const SECTOR_INFO_DATA: Record<
  BudgetSector,
  {
    title: string;
    category: string;
    description: string;
    fundedSchemes: string[];
    simulationLogic: string;
    baselineSource: string;
  }
> = {
  health: {
    title: 'Health & Family Welfare Budget',
    category: 'Budget Sector',
    description:
      'Covers central health infrastructure, disease control programs, medical research, and subsidized healthcare access for vulnerable families.',
    fundedSchemes: [
      'Ayushman Bharat — PM-JAY (Health Insurance for 50 Cr citizens)',
      'National Health Mission (NHM Rural & Urban)',
      'PM Ayushman Bharat Health Infrastructure Mission (PM-ABHIM)',
      'Establishment of New AIIMS & Upgradation of Medical Colleges',
    ],
    simulationLogic:
      'Every 10% increase in health allocation lowers Infant Mortality Rate (IMR) by ~0.8 per 1,000 live births and increases institutional delivery rates.',
    baselineSource: 'Union Budget FY 2024-25 / Ministry of Health',
  },
  education: {
    title: 'Education & School Literacy Budget',
    category: 'Budget Sector',
    description:
      'Funds primary, secondary, and higher education infrastructure, teacher training, student scholarships, and digital learning platforms.',
    fundedSchemes: [
      'Samagra Shiksha Abhiyan (Universal School Education)',
      'PM POSHAN (Mid-Day Meal Scheme in schools)',
      'PM-SHRI Schools (State-of-the-art exemplar schools)',
      'Higher Education Financing Agency (HEFA) & IIT/NIT grants',
    ],
    simulationLogic:
      'Every 10% increase in education budget improves Secondary GER by 1.2% and lowers pupil-teacher ratios across government schools.',
    baselineSource: 'Union Budget FY 2024-25 / Ministry of Education',
  },
  agriculture: {
    title: 'Agriculture & Farmers Welfare Budget',
    category: 'Budget Sector',
    description:
      'Allocated toward direct cash transfers to farmers, crop insurance subsidies, micro-irrigation infrastructure, and agricultural credit.',
    fundedSchemes: [
      'PM-KISAN (₹6,000/year direct income transfer to 11 Cr farmers)',
      'Pradhan Mantri Fasal Bima Yojana (Crop Insurance)',
      'Pradhan Mantri Krishi Sinchayee Yojana (Micro-Irrigation)',
      'Agriculture Infrastructure Fund (AIF) & Fertilizer Subsidy',
    ],
    simulationLogic:
      'Every ₹10,000 Cr addition boosts foodgrain yield per hectare by 18 kg/ha and enhances rural farmer purchasing power.',
    baselineSource: 'Union Budget FY 2024-25 / Ministry of Agriculture',
  },
  infrastructure: {
    title: 'Infrastructure & Capital Expenditure Budget',
    category: 'Budget Sector',
    description:
      'High-multiplier capital outlay on national highways, railway modernization, port connectivity, dedicated freight corridors, and urban transit.',
    fundedSchemes: [
      'PM Gati Shakti National Master Plan',
      'Bharatmala Pariyojana (National Highway Network)',
      'Indian Railways Modernization (Vande Bharat & Freight Corridors)',
      'National Infrastructure Pipeline (NIP)',
    ],
    simulationLogic:
      'Capital expenditure carries a GDP growth multiplier of 2.45x — every ₹1 Lakh Cr capital outlay boosts real GDP growth by ~0.35 percentage points.',
    baselineSource: 'Union Budget FY 2024-25 / Ministry of Finance',
  },
  rural: {
    title: 'Rural Development & Housing Budget',
    category: 'Budget Sector',
    description:
      'Funds rural wage employment guarantees, affordable rural housing, piped drinking water, and rural road networks.',
    fundedSchemes: [
      'MGNREGA (Mahatma Gandhi Rural Employment Guarantee)',
      'Jal Jeevan Mission (Har Ghar Jal — Piped Tap Water)',
      'Pradhan Mantri Awaas Yojana — Gramin (Rural Housing)',
      'Pradhan Mantri Gram Sadak Yojana (Rural Roads)',
    ],
    simulationLogic:
      'Higher rural outlays directly improve household drinking water access and provide distress wage employment during agricultural off-seasons.',
    baselineSource: 'Union Budget FY 2024-25 / Ministry of Rural Development',
  },
  socialWelfare: {
    title: 'Social Welfare & Empowerment Budget',
    category: 'Budget Sector',
    description:
      'Targeted welfare programs for women, children, elderly, disabled, and marginalized communities to reduce multidimensional poverty.',
    fundedSchemes: [
      'POSHAN 2.0 (Child & Maternal Nutrition Mission)',
      'National Social Assistance Programme (NSAP Old Age & Widow Pensions)',
      'Mission Vatsalya & Mission Shakti (Women & Child Protection)',
      'PM-DAKSH & Welfare Schemes for SC/ST/OBC',
    ],
    simulationLogic:
      'Expanded social welfare funding directly reduces Multidimensional Poverty Headcount Ratio (MPI) and child stunting rates.',
    baselineSource: 'Union Budget FY 2024-25 / Ministry of Social Justice',
  },
};

export function BudgetBar() {
  const allocations = useSimulatorStore((s) => s.budgetAllocations);
  const setBudgetAllocation = useSimulatorStore((s) => s.setBudgetAllocation);
  const resetBudget = useSimulatorStore((s) => s.resetBudget);

  const [activeModalSector, setActiveModalSector] = useState<BudgetSector | null>(null);

  const totalDiscretionary = useMemo(() => getTotalDiscretionary(allocations), [allocations]);
  const remaining = useMemo(() => getRemainingBudget(allocations), [allocations]);
  const isOverBudget = remaining < 0;
  const totalSpent = TOTAL_FIXED + totalDiscretionary;

  return (
    <>
      <div className="bg-card border rounded-xl p-3 sm:p-5 mb-4 sm:mb-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 sm:mb-4">
          <div>
            <h3 className="font-bold text-base sm:text-lg flex items-center gap-1.5 sm:gap-2">
              <IndianRupee className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              Union Budget Allocator
              <span className="text-[10px] sm:text-xs font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                FY 2024-25
              </span>
            </h3>
            <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">
              Total Budget: <span className="font-semibold text-foreground">₹{TOTAL_BUDGET.toFixed(1)}L Cr</span>
              {' '} • Discretionary: <span className="font-semibold text-foreground">₹{(TOTAL_BUDGET - TOTAL_FIXED).toFixed(1)}L Cr</span>
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={resetBudget} className="gap-1 text-xs self-start sm:self-auto h-8 px-2.5">
            <RotateCcw className="w-3.5 h-3.5" />
            Reset to FY25
          </Button>
        </div>

        {/* Stacked Bar */}
        <div className="relative h-7 sm:h-8 bg-muted rounded-full overflow-hidden mb-3">
          {/* Fixed portion */}
          <div
            className="absolute inset-y-0 left-0 bg-gray-400/70 dark:bg-gray-600/70 flex items-center justify-center transition-all"
            style={{ width: `${(TOTAL_FIXED / TOTAL_BUDGET) * 100}%` }}
          >
            <span className="text-[9px] text-white font-semibold tracking-tight truncate px-1">
              Fixed ₹{TOTAL_FIXED.toFixed(1)}L Cr
            </span>
          </div>

          {/* Discretionary segments */}
          {(() => {
            let offset = (TOTAL_FIXED / TOTAL_BUDGET) * 100;
            return BUDGET_SECTORS.map((sector) => {
              const val = allocations[sector.key];
              const widthPct = (val / TOTAL_BUDGET) * 100;
              const segmentEl = (
                <div
                  key={sector.key}
                  className="absolute inset-y-0 transition-all duration-300 flex items-center justify-center"
                  style={{
                    left: `${offset}%`,
                    width: `${Math.max(widthPct, 0)}%`,
                    backgroundColor: sector.color,
                  }}
                  title={`${sector.label}: ₹${val.toFixed(2)}L Cr`}
                >
                  {widthPct > 3 && (
                    <span className="text-[9px] text-white font-semibold truncate px-0.5">
                      {sector.icon}
                    </span>
                  )}
                </div>
              );
              offset += widthPct;
              return segmentEl;
            });
          })()}

          {/* Over-budget marker */}
          {isOverBudget && (
            <div
              className="absolute inset-y-0 right-0 bg-red-500/30 animate-pulse"
              style={{ width: `${Math.min(Math.abs(remaining / TOTAL_BUDGET) * 100, 15)}%` }}
            />
          )}
        </div>

        {/* Remaining indicator */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex flex-wrap gap-2 sm:gap-3 text-[10px] sm:text-[11px]">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm bg-gray-400 dark:bg-gray-600 inline-block" />
              Fixed
            </span>
            {BUDGET_SECTORS.map((s) => (
              <span key={s.key} className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ backgroundColor: s.color }} />
                {s.label.split(' ')[0]}
              </span>
            ))}
          </div>

          <div className={`text-xs sm:text-sm font-bold ${isOverBudget ? 'text-red-500' : 'text-delta-improvement'}`}>
            {isOverBudget ? (
              <span className="flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" />
                DEFICIT: ₹{Math.abs(remaining).toFixed(2)}L Cr over
              </span>
            ) : (
              <span>₹{remaining.toFixed(2)}L Cr remaining</span>
            )}
          </div>
        </div>

        {/* Allocation cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 mt-3 sm:mt-4">
          {BUDGET_SECTORS.map((sector) => (
            <AllocationCard
              key={sector.key}
              sectorKey={sector.key}
              label={sector.label}
              color={sector.color}
              icon={sector.icon}
              value={allocations[sector.key]}
              onChange={(v) => setBudgetAllocation(sector.key, v)}
              onInfoClick={() => setActiveModalSector(sector.key)}
            />
          ))}
        </div>

        {isOverBudget && (
          <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-600 dark:text-red-400 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Deficit Spending Warning:</span> Total allocation exceeds
              total budget by ₹{Math.abs(remaining).toFixed(2)}L Cr. This would increase the fiscal
              deficit beyond {((totalSpent / 296) * 100).toFixed(1)}% of GDP, risking higher inflation.
            </div>
          </div>
        )}
      </div>

      {activeModalSector && (
        <SimulatorInfoModal
          {...SECTOR_INFO_DATA[activeModalSector]}
          isOpen={!!activeModalSector}
          onClose={() => setActiveModalSector(null)}
        />
      )}
    </>
  );
}

function AllocationCard({
  sectorKey: _sectorKey,
  label,
  color,
  icon,
  value,
  onChange,
  onInfoClick,
}: {
  sectorKey: BudgetSector;
  label: string;
  color: string;
  icon: string;
  value: number;
  onChange: (val: number) => void;
  onInfoClick: () => void;
}) {
  const step = 0.1;

  return (
    <div className="border rounded-lg p-3 bg-card hover:shadow-sm transition-shadow relative group">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-base">{icon}</span>
          <span className="text-[11px] font-semibold truncate leading-tight">{label}</span>
        </div>
        <button
          onClick={onInfoClick}
          className="text-muted-foreground hover:text-primary p-0.5 rounded transition"
          title={`Learn what ${label} funds`}
        >
          <Info className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(value - step)}
          className="w-8 h-8 sm:w-7 sm:h-7 rounded-md bg-muted hover:bg-muted/80 active:bg-primary/20 text-foreground font-bold text-sm flex items-center justify-center transition shrink-0 select-none"
          disabled={value <= 0}
        >
          −
        </button>
        <div className="flex-1 text-center">
          <span className="text-base sm:text-lg font-bold" style={{ color }}>
            ₹{value.toFixed(2)}
          </span>
          <p className="text-[9px] text-muted-foreground -mt-0.5">L Cr</p>
        </div>
        <button
          onClick={() => onChange(value + step)}
          className="w-8 h-8 sm:w-7 sm:h-7 rounded-md bg-muted hover:bg-muted/80 active:bg-primary/20 text-foreground font-bold text-sm flex items-center justify-center transition shrink-0 select-none"
        >
          +
        </button>
      </div>
    </div>
  );
}
