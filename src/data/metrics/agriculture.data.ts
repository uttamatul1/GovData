import type { Metric } from '../../types';
import type { MetricMeta } from '../../utils/buildMetrics';
import { buildMetrics } from '../../utils/buildMetrics';
import nationalJson from '../json/agriculture.national.json';
import stateJson from '../json/agriculture.states.json';

// ────────────────────────────────────────────────────────────────────────────
//  Sources: Directorate of Economics & Statistics, Ministry of Agriculture
//           & Farmers Welfare, MoSPI
// ────────────────────────────────────────────────────────────────────────────

const agricultureMeta: MetricMeta[] = [
  {
    id: 'agri_gdp_growth',
    label: 'Agricultural GDP Growth',
    sector: 'agriculture',
    unit: '%',
    description: 'Year-on-year growth rate of Gross Value Added (GVA) from agriculture and allied sectors at constant prices.',
    sourceReport: 'Directorate of Economics & Statistics / MoSPI',
    higherIsBetter: true,
  },
  {
    id: 'foodgrain_prod',
    label: 'Foodgrain Production',
    sector: 'agriculture',
    unit: 'million tonnes',
    description: 'Total production of foodgrains (rice, wheat, coarse cereals, pulses) in million tonnes.',
    sourceReport: 'Agricultural Statistics at a Glance / Ministry of Agriculture & Farmers Welfare',
    higherIsBetter: true,
  },
];

export const agricultureMetrics: Metric[] = buildMetrics(agricultureMeta, nationalJson, stateJson);
