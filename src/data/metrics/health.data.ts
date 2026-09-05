import type { Metric } from '../../types';
import type { MetricMeta } from '../../utils/buildMetrics';
import { buildMetrics } from '../../utils/buildMetrics';
import nationalJson from '../json/health.national.json';
import stateJson from '../json/health.states.json';

// ────────────────────────────────────────────────────────────────────────────
//  Sources: Sample Registration System (SRS) Bulletins, NFHS (1,2,3,4,5),
//           World Health Organization (WHO), World Bank Open Data
//  Coverage: 18 major states + UTs. SRS data for IMR/MMR published as
//  3-year rolling averages; individual year values interpolated where noted.
// ────────────────────────────────────────────────────────────────────────────

const healthMeta: MetricMeta[] = [
  {
    id: 'imr',
    label: 'Infant Mortality Rate',
    sector: 'health',
    unit: 'per 1,000 live births',
    description: 'Deaths per 1,000 live births before age 1. Sourced from SRS annual bulletins & World Bank indicators.',
    sourceReport: 'Sample Registration System (SRS) / World Bank Data',
    higherIsBetter: false,
  },
  {
    id: 'mmr',
    label: 'Maternal Mortality Ratio',
    sector: 'health',
    unit: 'per 100,000 live births',
    description: 'Maternal deaths per 100,000 live births. Sourced from SRS bulletins and World Bank / WHO health databases.',
    sourceReport: 'SRS Special Bulletins / WHO / World Bank',
    higherIsBetter: false,
  },
  {
    id: 'tfr',
    label: 'Total Fertility Rate',
    sector: 'health',
    unit: 'children per woman',
    description: 'Average number of children born per woman. Sourced from SRS bulletins, NFHS surveys & UN Population Division.',
    sourceReport: 'SRS / NFHS / UN Population Data',
    higherIsBetter: false,
  },
];

export const healthMetrics: Metric[] = buildMetrics(healthMeta, nationalJson, stateJson);
