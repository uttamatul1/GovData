export * from './states.data';
export * from './reports.data';

import { healthMetrics } from './metrics/health.data';
import { educationMetrics } from './metrics/education.data';
import { economyMetrics } from './metrics/economy.data';
import { labourMetrics } from './metrics/labour.data';
import { agricultureMetrics } from './metrics/agriculture.data';
import { populationMetrics } from './metrics/population.data';
import { socialMetrics } from './metrics/social.data';
import { crimeMetrics } from './metrics/crime.data';
import type { Metric, Sector } from '../types';

export const allMetrics: Metric[] = [
  ...healthMetrics,
  ...educationMetrics,
  ...economyMetrics,
  ...labourMetrics,
  ...agricultureMetrics,
  ...populationMetrics,
  ...socialMetrics,
  ...crimeMetrics,
];

/** Returns the first metric ID for a given sector, useful for auto-selection */
export function getDefaultMetricId(sector: Sector): string {
  const m = allMetrics.find((metric) => metric.sector === sector);
  return m?.id ?? 'imr';
}

/** Returns all metrics belonging to a sector */
export function getMetricsBySector(sector: Sector): Metric[] {
  return allMetrics.filter((m) => m.sector === sector);
}
