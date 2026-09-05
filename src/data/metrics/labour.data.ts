import type { Metric } from '../../types';
import type { MetricMeta } from '../../utils/buildMetrics';
import { buildMetrics } from '../../utils/buildMetrics';
import nationalJson from '../json/labour.national.json';
import stateJson from '../json/labour.states.json';

// ────────────────────────────────────────────────────────────────────────────
//  Sources: Periodic Labour Force Survey (PLFS), CMIE, MoSPI
// ────────────────────────────────────────────────────────────────────────────

const labourMeta: MetricMeta[] = [
  {
    id: 'lfpr',
    label: 'Labour Force Participation Rate',
    sector: 'labour',
    unit: '%',
    description: 'Percentage of the working-age population (15+) that is either employed or seeking employment (usual status, principal + subsidiary).',
    sourceReport: 'Periodic Labour Force Survey (PLFS) / CMIE',
    higherIsBetter: true,
  },
  {
    id: 'unemployment',
    label: 'Unemployment Rate (Usual Status)',
    sector: 'labour',
    unit: '%',
    description: 'Percentage of the labour force (15+) that is without work and seeking employment under Usual Status (Principal + Subsidiary Status, PS+SS).',
    sourceReport: 'Periodic Labour Force Survey (PLFS) / MoSPI',
    higherIsBetter: false,
  },
  {
    id: 'female_lfpr',
    label: 'Female LFPR',
    sector: 'labour',
    unit: '%',
    description: 'Labour Force Participation Rate for women aged 15 and above (usual status).',
    sourceReport: 'Periodic Labour Force Survey (PLFS)',
    higherIsBetter: true,
  },
  {
    id: 'youth_unemp',
    label: 'Youth Unemployment (15-24)',
    sector: 'labour',
    unit: '%',
    description: 'Unemployment rate among the youth population aged 15-24 years (usual status).',
    sourceReport: 'Periodic Labour Force Survey (PLFS)',
    higherIsBetter: false,
  },
];

export const labourMetrics: Metric[] = buildMetrics(labourMeta, nationalJson, stateJson);
