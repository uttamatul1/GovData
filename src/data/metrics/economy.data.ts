import type { Metric } from '../../types';
import type { MetricMeta } from '../../utils/buildMetrics';
import { buildMetrics } from '../../utils/buildMetrics';
import nationalJson from '../json/economy.national.json';
import stateJson from '../json/economy.states.json';

// ────────────────────────────────────────────────────────────────────────────
//  Sources: MoSPI (Ministry of Statistics), RBI Handbook of Statistics,
//           World Bank Open Data, IMF
// ────────────────────────────────────────────────────────────────────────────

const economyMeta: MetricMeta[] = [
  {
    id: 'pci',
    label: 'Per Capita Income',
    sector: 'economy',
    unit: '₹',
    description: 'Net State Domestic Product / Net National Income per capita at current prices in Indian Rupees.',
    sourceReport: 'MoSPI / RBI Handbook of Statistics',
    higherIsBetter: true,
  },
  {
    id: 'gdp_growth',
    label: 'GDP Growth Rate',
    sector: 'economy',
    unit: '%',
    description: 'Real GDP growth rate year-on-year percentage change. Sourced from MoSPI, RBI & World Bank.',
    sourceReport: 'MoSPI / RBI / World Bank',
    higherIsBetter: true,
  },
];

export const economyMetrics: Metric[] = buildMetrics(economyMeta, nationalJson, stateJson);
