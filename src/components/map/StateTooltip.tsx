import { useMapStore } from '../../store/map.store';
import { useMetricData } from '../../hooks/useMetricData';
import { statesData } from '../../data';
import { formatValue } from '../../utils/format.utils';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '../../lib/utils';

export function StateTooltip() {
  const { hoveredStateCode, tooltipPos, selectedStateCode, activeSector, activeMetricId } = useMapStore();
  const { metric } = useMetricData(activeSector, activeMetricId);

  // Don't show tooltip if drawer is open for same state, or no hover
  const showCode = hoveredStateCode && hoveredStateCode !== selectedStateCode ? hoveredStateCode : null;

  if (!showCode || !metric) return null;

  const stateInfo = statesData.find((s) => s.code === showCode);
  const stateMetricData = metric.stateData.find((d) => d.stateCode === showCode);

  if (!stateInfo) return null;

  // Calculate position with boundary offsets (assume card width ~240px, height ~140px)
  const left = tooltipPos ? Math.min(tooltipPos.x + 15, window.innerWidth - 260) : 16;
  const top = tooltipPos ? Math.max(16, tooltipPos.y - 120) : 16;

  const style: React.CSSProperties = tooltipPos
    ? { position: 'absolute', left: `${left}px`, top: `${top}px`, transform: 'translate3d(0,0,0)' }
    : { position: 'absolute', top: '16px', right: '16px' };

  // If no metric data for this state, show basic info
  if (!stateMetricData) {
    return (
      <div
        style={style}
        className="bg-background/95 backdrop-blur-sm border shadow-xl rounded-xl p-3 w-60 pointer-events-none z-30 transition-all duration-75"
      >
        <h3 className="font-bold text-base leading-tight">{stateInfo.name}</h3>
        <p className="text-xs text-muted-foreground capitalize">{stateInfo.region} Region</p>
        <p className="text-xs text-muted-foreground mt-2 italic">No data available for {metric.label}</p>
      </div>
    );
  }

  const sortedHistory = [...stateMetricData.history].sort((a, b) => b.year - a.year);
  const latest = sortedHistory[0];
  const previous = sortedHistory[1];

  const value = latest?.value ?? 0;
  const isBetter = previous ? (metric.higherIsBetter ? value > previous.value : value < previous.value) : true;

  return (
    <div
      style={style}
      className="bg-background/95 backdrop-blur-sm border shadow-xl rounded-xl p-3 w-60 pointer-events-none z-30 transition-all duration-75"
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="font-bold text-lg leading-tight">{stateInfo.name}</h3>
          <p className="text-xs text-muted-foreground capitalize">{stateInfo.region} Region</p>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs text-muted-foreground">{metric.label}</p>
        <div className="flex items-end gap-2">
          <span className="text-2xl font-bold">{formatValue(value)}</span>
          <span className="text-xs mb-1 text-muted-foreground">{metric.unit}</span>
        </div>

        {previous && (
          <div className="flex items-center gap-1 mt-2 text-xs">
            <span
              className={cn(
                'flex items-center gap-0.5',
                isBetter ? 'text-delta-improvement' : 'text-delta-worsening'
              )}
            >
              {isBetter ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {Math.abs(value - previous.value).toFixed(1)}
            </span>
            <span className="text-muted-foreground">vs {previous.year}</span>
          </div>
        )}
      </div>
    </div>
  );
}
