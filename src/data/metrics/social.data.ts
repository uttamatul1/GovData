import type { Metric } from '../../types';
import type { MetricMeta } from '../../utils/buildMetrics';
import { buildMetrics } from '../../utils/buildMetrics';
import nationalJson from '../json/social.national.json';
import stateJson from '../json/social.states.json';

// ────────────────────────────────────────────────────────────────────────────
//  Sources: NITI Aayog MPI, Planning Commission, UNDP HDR, GDL
// ────────────────────────────────────────────────────────────────────────────

const socialMeta: MetricMeta[] = [
  {
    id: 'poverty_hcr',
    label: 'Poverty Headcount Ratio',
    sector: 'social',
    unit: '%',
    description: 'Percentage of the population living below the national poverty line (Tendulkar methodology / NITI Aayog MPI).',
    sourceReport: 'NITI Aayog MPI / Planning Commission',
    higherIsBetter: false,
  },
  {
    id: 'hdi',
    label: 'Human Development Index',
    sector: 'social',
    unit: '',
    description: 'Composite index measuring average achievement in health, education, and standard of living.',
    sourceReport: 'UNDP Human Development Report / NITI Aayog / GDL',
    higherIsBetter: true,
  },
];

export const socialMetrics: Metric[] = buildMetrics(socialMeta, nationalJson, stateJson);
