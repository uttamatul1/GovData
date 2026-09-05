import type { Metric } from '../../types';
import type { MetricMeta } from '../../utils/buildMetrics';
import { buildMetrics } from '../../utils/buildMetrics';
import nationalJson from '../json/population.national.json';
import stateJson from '../json/population.states.json';

// ────────────────────────────────────────────────────────────────────────────
//  Sources: Census of India, Registrar General of India (RGI),
//           UN Population Division, NFHS
// ────────────────────────────────────────────────────────────────────────────

const populationMeta: MetricMeta[] = [
  {
    id: 'total_pop',
    label: 'Total Population',
    sector: 'population',
    unit: 'crore',
    description: 'Total population in crores. Sourced from Census of India, RGI Population Projections & UN Population Division.',
    sourceReport: 'Census of India / RGI / UN Data',
    higherIsBetter: false,
  },
  {
    id: 'sex_ratio',
    label: 'Sex Ratio',
    sector: 'population',
    unit: 'females per 1,000 males',
    description: 'Number of females per 1,000 males in the total population. Sourced from Census & NFHS.',
    sourceReport: 'Census of India / NFHS-5 (2019-21)',
    higherIsBetter: true,
  },
];

export const populationMetrics: Metric[] = buildMetrics(populationMeta, nationalJson, stateJson);
