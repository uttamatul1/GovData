import type { Metric } from '../../types';
import type { MetricMeta } from '../../utils/buildMetrics';
import { buildMetrics } from '../../utils/buildMetrics';
import nationalJson from '../json/crime.national.json';
import stateJson from '../json/crime.states.json';

// ────────────────────────────────────────────────────────────────────────────
//  Source: National Crime Records Bureau (NCRB) — "Crime in India" reports
//  Rates are per 1,00,000 (1 lakh) population unless stated otherwise.
//  Expanded to cover all 28 states + 8 union territories.
// ────────────────────────────────────────────────────────────────────────────

const crimeMeta: MetricMeta[] = [
  {
    id: 'total_crime_rate',
    label: 'IPC Crime Rate',
    sector: 'safety',
    unit: 'per lakh population',
    description: 'Rate of cognizable crimes registered under the Indian Penal Code (IPC) per 1,00,000 population. (Note: Higher registered crime rates reflect higher reporting/registration).',
    sourceReport: 'NCRB — Crime in India 2022',
    higherIsBetter: false,
  },
  {
    id: 'total_cognizable_crime_rate',
    label: 'Total Cognizable Crime Rate (IPC + SLL)',
    sector: 'safety',
    unit: 'per lakh population',
    description: 'Total rate of cognizable crimes registered under both IPC (Indian Penal Code) and SLL (Special & Local Laws) per 1,00,000 population.',
    sourceReport: 'NCRB — Crime in India Compendium',
    higherIsBetter: false,
  },
  {
    id: 'murder_rate',
    label: 'Murder Rate',
    sector: 'safety',
    unit: 'per lakh population',
    description: 'Rate of murders (Section 302 IPC / Section 103 BNS) per 1,00,000 population.',
    sourceReport: 'NCRB — Crime in India',
    higherIsBetter: false,
  },
  {
    id: 'crimes_women',
    label: 'Crimes Against Women',
    sector: 'safety',
    unit: 'per lakh women',
    description: 'Rate of total crimes against women (including assault, sexual harassment, kidnapping, dowry deaths, rape) per 1,00,000 female population.',
    sourceReport: 'NCRB — Crime in India',
    higherIsBetter: false,
  },
  {
    id: 'cybercrime',
    label: 'Cyber Crimes',
    sector: 'safety',
    unit: 'cases (thousands)',
    description: 'Total number of cyber crime cases registered under the IT Act and IPC, in thousands.',
    sourceReport: 'NCRB — Crime in India',
    higherIsBetter: false,
  },
];

export const crimeMetrics: Metric[] = buildMetrics(crimeMeta, nationalJson, stateJson);
