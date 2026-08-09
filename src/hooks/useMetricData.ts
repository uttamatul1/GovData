import { useMemo } from 'react';
import { allMetrics } from '../data';
import type { Sector } from '../types';
export function useMetricData(sector: Sector, metricId: string) {
  const metric = useMemo(() => {
    return allMetrics.find((m) => m.sector === sector && m.id === metricId) || null;
  }, [sector, metricId]);

  return { metric };
}

export function useMetricsBySector(sector: Sector) {
  return useMemo(() => allMetrics.filter((m) => m.sector === sector), [sector]);
}
