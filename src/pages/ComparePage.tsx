import { useMemo, useState } from 'react';
import { useAppStore } from '../store/app.store';
import { useMapStore } from '../store/map.store';
import { DataDisclaimer } from '../components/shared/DataDisclaimer';
import { Button } from '../components/ui/button';
import { X, Plus, ChevronDown } from 'lucide-react';
import { statesData, allMetrics, getMetricsBySector } from '../data';
import type { Sector } from '../types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { formatValue } from '../utils/format.utils';

const COMPARE_COLORS = ['#378ADD', '#7F77DD', '#D85A30', '#BA7517'];

const SECTOR_OPTIONS: { value: Sector; label: string }[] = [
  { value: 'health', label: 'Health' },
  { value: 'education', label: 'Education' },
  { value: 'economy', label: 'Economy' },
  { value: 'labour', label: 'Labour' },
  { value: 'agriculture', label: 'Agriculture' },
  { value: 'population', label: 'Population' },
  { value: 'social', label: 'Social' },
];

// Default states to pre-select for a meaningful comparison
const DEFAULT_STATES = ['IN-MH', 'IN-UP', 'IN-KL'];

export function ComparePage() {
  const { selectedStates, toggleStateSelection, clearStateSelection } = useAppStore();
  const { activeSector: globalSector, activeMetricId: globalMetricId } = useMapStore();

  // Compare page has its own sector/metric state so it doesn't depend on Explore page
  const [compareSector, setCompareSector] = useState<Sector>(globalSector);
  const [compareMetricId, setCompareMetricId] = useState<string>(globalMetricId);
  const [showStateList, setShowStateList] = useState(false);

  const sectorMetrics = useMemo(() => getMetricsBySector(compareSector), [compareSector]);

  // Auto-select first metric when sector changes
  const handleSectorChange = (sector: Sector) => {
    setCompareSector(sector);
    const firstMetric = getMetricsBySector(sector)[0];
    if (firstMetric) setCompareMetricId(firstMetric.id);
  };

  const metric = useMemo(
    () => allMetrics.find((m) => m.id === compareMetricId) || sectorMetrics[0] || null,
    [compareMetricId, sectorMetrics]
  );

  // If no states selected, use defaults
  const effectiveStates = selectedStates.length > 0 ? selectedStates : DEFAULT_STATES;

  // Find which of the effective states actually have data for this metric
  const statesWithData = useMemo(() => {
    if (!metric) return [];
    return effectiveStates.filter((code) =>
      metric.stateData.some((sd) => sd.stateCode === code && sd.history.length > 0)
    );
  }, [metric, effectiveStates]);

  const statesWithoutData = useMemo(() => {
    if (!metric) return [];
    return effectiveStates.filter((code) =>
      !metric.stateData.some((sd) => sd.stateCode === code && sd.history.length > 0)
    );
  }, [metric, effectiveStates]);

  // Build unified chart data: merge all years from all selected states + national
  const chartData = useMemo(() => {
    if (!metric || statesWithData.length === 0) return [];

    const allYears = new Set<number>();
    const stateHistories: Record<string, Record<number, number>> = {};

    for (const code of statesWithData) {
      const stateMetric = metric.stateData.find((sd) => sd.stateCode === code);
      if (!stateMetric) continue;

      stateHistories[code] = {};
      for (const dp of stateMetric.history) {
        allYears.add(dp.year);
        stateHistories[code][dp.year] = dp.value;
      }
    }

    // Also include national data years
    for (const dp of metric.nationalData) {
      allYears.add(dp.year);
    }

    const sortedYears = Array.from(allYears).sort();
    return sortedYears.map((year) => {
      const entry: Record<string, number | null> = { year };
      for (const code of statesWithData) {
        entry[code] = stateHistories[code]?.[year] ?? null;
      }
      const nd = metric.nationalData.find((d) => d.year === year);
      entry['national'] = nd?.value ?? null;
      return entry;
    });
  }, [metric, statesWithData]);

  // Build data table: latest value for each state
  const tableData = useMemo(() => {
    if (!metric) return [];
    return effectiveStates.map((code) => {
      const stateInfo = statesData.find((s) => s.code === code);
      const stateMetric = metric.stateData.find((sd) => sd.stateCode === code);
      const latestPoint = stateMetric?.history?.length
        ? stateMetric.history[stateMetric.history.length - 1]
        : null;
      return {
        code,
        name: stateInfo?.name || code,
        region: stateInfo?.region || 'unknown',
        value: latestPoint?.value ?? null,
        year: latestPoint?.year ?? null,
        source: latestPoint?.source ?? null,
      };
    });
  }, [metric, effectiveStates]);

  // National latest
  const nationalLatest = metric?.nationalData?.length
    ? metric.nationalData[metric.nationalData.length - 1]
    : null;

  // Available states that aren't already selected
  const availableStates = statesData.filter((s) => !effectiveStates.includes(s.code));

  return (
    <div className="flex-1 flex flex-col h-full bg-background">
      <div className="container mx-auto px-4 py-6 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-xl sm:text-3xl font-bold mb-1">Compare States</h2>
            <p className="text-muted-foreground text-xs sm:text-sm">
              Compare historical trends side-by-side across states and the national average.
            </p>
          </div>
          {selectedStates.length > 0 && (
            <Button variant="outline" size="sm" onClick={clearStateSelection} className="self-start sm:self-auto text-xs h-8">
              Clear All
            </Button>
          )}
        </div>

        {/* Sector + Metric Selector */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 whitespace-nowrap">
            {SECTOR_OPTIONS.map((s) => (
              <button
                key={s.value}
                onClick={() => handleSectorChange(s.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 ${
                  compareSector === s.value
                    ? 'bg-primary text-primary-foreground shadow-sm font-semibold'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="h-6 w-px bg-border hidden sm:block shrink-0" />

          <div className="relative shrink-0 w-full sm:w-auto">
            <select
              value={compareMetricId}
              onChange={(e) => setCompareMetricId(e.target.value)}
              className="w-full sm:w-auto appearance-none bg-muted border border-input rounded-lg px-3 py-1.5 pr-8 text-xs sm:text-sm font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {sectorMetrics.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        {/* State chips + add button */}
        <div className="flex flex-wrap gap-2 items-center mb-4">
          {effectiveStates.map((code, index) => {
            const stateInfo = statesData.find((s) => s.code === code);
            const hasData = statesWithData.includes(code);
            return (
              <div
                key={code}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm ${
                  hasData ? 'bg-muted/30' : 'bg-muted/10 opacity-60'
                }`}
              >
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: hasData ? COMPARE_COLORS[index % COMPARE_COLORS.length] : '#999' }}
                />
                <span className="font-medium">{stateInfo?.name || code}</span>
                {!hasData && <span className="text-[10px] text-muted-foreground">(no data)</span>}
                <button
                  onClick={() => toggleStateSelection(code)}
                  className="text-muted-foreground hover:text-foreground ml-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
          {effectiveStates.length < 4 && (
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowStateList(!showStateList)}
                className="rounded-full"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
              {showStateList && (
                <div className="absolute top-full mt-2 left-0 z-20 bg-popover border rounded-lg shadow-lg p-2 max-h-60 overflow-y-auto scrollbar-thin w-56">
                  {availableStates.map((state) => {
                    // Show which states have data for this metric
                    const hasMetricData = metric?.stateData.some(
                      (sd) => sd.stateCode === state.code && sd.history.length > 0
                    );
                    return (
                      <button
                        key={state.code}
                        onClick={() => {
                          toggleStateSelection(state.code);
                          if (effectiveStates.length >= 3) setShowStateList(false);
                        }}
                        className="w-full text-left text-sm px-3 py-1.5 rounded-md hover:bg-muted transition truncate flex justify-between items-center"
                      >
                        <span>{state.name}</span>
                        {hasMetricData && (
                          <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
          {selectedStates.length === 0 && (
            <span className="text-xs text-muted-foreground italic ml-2">
              Showing default states • click a state on the Explore map or add above
            </span>
          )}
        </div>

        {/* Chart */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="bg-muted/20 border rounded-xl p-6 flex-1 min-h-[320px]">
            <h3 className="font-semibold text-lg mb-1 text-center">
              {metric?.label || 'Select a metric'}
              {metric?.unit && (
                <span className="text-sm font-normal text-muted-foreground ml-2">({metric.unit})</span>
              )}
            </h3>
            {metric?.description && (
              <p className="text-xs text-muted-foreground text-center mb-4 max-w-2xl mx-auto">
                {metric.description}
              </p>
            )}

            {statesWithData.length === 0 ? (
              <div className="flex items-center justify-center h-60 text-muted-foreground text-sm">
                <p>No data available for the selected states and metric. Try different states or a different metric.</p>
              </div>
            ) : (
              <div className="w-full h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{ top: 10, right: 30, left: -10, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="hsl(var(--border))"
                    />
                    <XAxis
                      dataKey="year"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                      tickFormatter={(val) => formatValue(val)}
                    />
                    <RechartsTooltip
                      contentStyle={{
                        borderRadius: '8px',
                        border: '1px solid hsl(var(--border))',
                        background: 'hsl(var(--background))',
                        fontSize: '13px',
                      }}
                      labelStyle={{
                        fontWeight: 'bold',
                        color: 'hsl(var(--foreground))',
                        marginBottom: '4px',
                      }}
                      formatter={(value: number, name: string) => {
                        if (value === null) return ['-', ''];
                        if (name === 'national') return [formatValue(value), 'National Avg'];
                        const stateName = statesData.find((s) => s.code === name)?.name || name;
                        return [`${formatValue(value)} ${metric?.unit || ''}`, stateName];
                      }}
                    />
                    <Legend
                      formatter={(value: string) => {
                        if (value === 'national') return 'National Average';
                        return statesData.find((s) => s.code === value)?.name || value;
                      }}
                      iconType="circle"
                      wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }}
                    />
                    {/* National average dashed line */}
                    <Line
                      type="monotone"
                      dataKey="national"
                      name="national"
                      stroke="hsl(var(--muted-foreground))"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={false}
                      activeDot={{ r: 4 }}
                      connectNulls
                    />
                    {/* Lines for each state with data */}
                    {statesWithData.map((code, index) => (
                      <Line
                        key={code}
                        type="monotone"
                        dataKey={code}
                        name={code}
                        stroke={COMPARE_COLORS[index % COMPARE_COLORS.length]}
                        strokeWidth={3}
                        dot={{ r: 4, strokeWidth: 2, fill: 'hsl(var(--background))' }}
                        activeDot={{ r: 6, strokeWidth: 0 }}
                        connectNulls
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Data Table */}
          {tableData.length > 0 && metric && (
            <div className="border rounded-xl overflow-x-auto scrollbar-thin">
              <table className="w-full text-xs sm:text-sm min-w-[520px]">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left px-4 py-2.5 font-semibold">State</th>
                    <th className="text-left px-4 py-2.5 font-semibold">Region</th>
                    <th className="text-right px-4 py-2.5 font-semibold">
                      Latest {metric.label}
                    </th>
                    <th className="text-right px-4 py-2.5 font-semibold">Year</th>
                    <th className="text-right px-4 py-2.5 font-semibold">Source</th>
                  </tr>
                </thead>
                <tbody>
                  {/* National row */}
                  {nationalLatest && (
                    <tr className="border-t bg-primary/5">
                      <td className="px-4 py-2 font-semibold text-primary">India (National)</td>
                      <td className="px-4 py-2 text-muted-foreground">—</td>
                      <td className="px-4 py-2 text-right font-bold">
                        {formatValue(nationalLatest.value)} {metric.unit}
                      </td>
                      <td className="px-4 py-2 text-right text-muted-foreground">{nationalLatest.year}</td>
                      <td className="px-4 py-2 text-right text-xs text-muted-foreground">{nationalLatest.source}</td>
                    </tr>
                  )}
                  {tableData.map((row) => (
                    <tr key={row.code} className="border-t hover:bg-muted/20 transition">
                      <td className="px-4 py-2 font-medium flex items-center gap-2">
                        <div
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{
                            backgroundColor: statesWithData.includes(row.code)
                              ? COMPARE_COLORS[statesWithData.indexOf(row.code) % COMPARE_COLORS.length]
                              : '#999',
                          }}
                        />
                        {row.name}
                      </td>
                      <td className="px-4 py-2 text-muted-foreground capitalize">{row.region}</td>
                      <td className="px-4 py-2 text-right font-semibold">
                        {row.value !== null ? `${formatValue(row.value)} ${metric.unit}` : '—'}
                      </td>
                      <td className="px-4 py-2 text-right text-muted-foreground">{row.year ?? '—'}</td>
                      <td className="px-4 py-2 text-right text-xs text-muted-foreground">{row.source ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Warning for states without data */}
          {statesWithoutData.length > 0 && (
            <p className="text-xs text-muted-foreground">
              ⚠ No {metric?.label} data available for:{' '}
              {statesWithoutData.map((c) => statesData.find((s) => s.code === c)?.name || c).join(', ')}
            </p>
          )}
        </div>
      </div>
      <DataDisclaimer />
    </div>
  );
}
