import { useMapStore } from '../../store/map.store';
import { useMetricData } from '../../hooks/useMetricData';
import { getChoroplethScale } from '../../utils/color.utils';
import { formatValue } from '../../utils/format.utils';
import * as d3 from 'd3';

export function MapLegend() {
  const { activeSector, activeMetricId } = useMapStore();
  const { metric } = useMetricData(activeSector, activeMetricId);

  if (!metric) return null;

  const values = metric.stateData.map(sd => {
    const sorted = [...sd.history].sort((a,b) => b.year - a.year);
    return sorted[0]?.value ?? 0;
  });
  
  const min = d3.min(values) ?? 0;
  const max = d3.max(values) ?? 100;
  
  const scale = getChoroplethScale(activeSector, min, max, metric.higherIsBetter);
  
  // Create gradient string for the legend bar
  const stops = 10;
  const gradientStops = Array.from({ length: stops + 1 }).map((_, i) => {
    const val = min + (i / stops) * (max - min);
    return `${scale(val)} ${(i / stops) * 100}%`;
  }).join(', ');

  return (
    <div className="bg-background/95 backdrop-blur border rounded-lg p-2.5 sm:p-4 shadow-md min-w-[180px] sm:min-w-[240px]">
      <h4 className="text-xs sm:text-sm font-semibold mb-0.5 sm:mb-1 truncate">{metric.label}</h4>
      <p className="text-[10px] sm:text-xs text-muted-foreground mb-2 sm:mb-3">{metric.unit}</p>

      <div
        className="h-2.5 sm:h-3 w-full rounded-full"
        style={{ background: `linear-gradient(to right, ${gradientStops})` }}
      />

      <div className="flex justify-between mt-1 text-[10px] sm:text-xs font-medium">
        <span>{formatValue(min)}</span>
        <span>{formatValue(max)}</span>
      </div>
    </div>
  );
}
