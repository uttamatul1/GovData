import { useMemo } from 'react';
import { getChoroplethScale } from '../utils/color.utils';
import type { Sector, StateMetric } from '../types';
import * as d3 from 'd3';

export function useChoropleth(sector: Sector, stateData: StateMetric[], higherIsBetter: boolean) {
  return useMemo(() => {
    if (!stateData || stateData.length === 0) {
      return () => '#f3f4f6'; // default gray
    }
    
    // Extract latest value for each state
    const values = stateData.map(sd => {
      const sorted = [...sd.history].sort((a, b) => b.year - a.year);
      return sorted[0]?.value ?? 0;
    });
    
    const min = d3.min(values) ?? 0;
    const max = d3.max(values) ?? 100;
    
    return getChoroplethScale(sector, min, max, higherIsBetter);
  }, [sector, stateData, higherIsBetter]);
}
