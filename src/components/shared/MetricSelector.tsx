import { useState } from 'react';
import { useMapStore } from '../../store/map.store';
import { getMetricsBySector } from '../../data';
import { cn } from '../../lib/utils';
import { Info } from 'lucide-react';
import { MetricInfoModal } from './MetricInfoModal';
import type { Metric } from '../../types';

export function MetricSelector() {
  const { activeSector, activeMetricId, setActiveMetricId } = useMapStore();
  const metrics = getMetricsBySector(activeSector);
  const [selectedInfoMetric, setSelectedInfoMetric] = useState<Metric | null>(null);

  if (metrics.length === 0) return null;

  return (
    <>
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 my-1 sm:justify-center whitespace-nowrap px-1">
        {metrics.map((m) => {
          const isActive = activeMetricId === m.id;
          return (
            <div key={m.id} className="inline-flex items-center shrink-0">
              <button
                onClick={() => setActiveMetricId(m.id)}
                className={cn(
                  'px-2.5 sm:px-3 py-1.5 rounded-l-md text-xs font-medium border transition-all',
                  isActive
                    ? 'bg-primary text-primary-foreground border-primary font-semibold'
                    : 'bg-background text-muted-foreground border-border hover:bg-muted hover:text-foreground'
                )}
              >
                {m.label}
              </button>
              <button
                onClick={() => setSelectedInfoMetric(m)}
                title={`Information about ${m.label}`}
                className={cn(
                  'px-1.5 py-1.5 rounded-r-md text-xs border-y border-r transition-all flex items-center justify-center',
                  isActive
                    ? 'bg-primary/90 text-primary-foreground border-primary hover:bg-primary'
                    : 'bg-background text-muted-foreground border-border hover:bg-muted hover:text-foreground'
                )}
              >
                <Info className="w-3 h-3" />
              </button>
            </div>
          );
        })}
      </div>

      <MetricInfoModal
        metric={selectedInfoMetric}
        isOpen={!!selectedInfoMetric}
        onClose={() => setSelectedInfoMetric(null)}
      />
    </>
  );
}
