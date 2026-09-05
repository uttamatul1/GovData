import type { Metric } from '../../types';
import type { MetricMeta } from '../../utils/buildMetrics';
import { buildMetrics } from '../../utils/buildMetrics';
import nationalJson from '../json/education.national.json';
import stateJson from '../json/education.states.json';

// ────────────────────────────────────────────────────────────────────────────
//  Sources: Census of India (2001, 2011), UDISE+ (Ministry of Education),
//           AISHE (All India Survey on Higher Education), NSO Household Survey
//  State literacy from Census 2001 & 2011 (official). Post-2011 interpolated
//  from NSO 75th Round (2017-18) and MoE Annual Reports.
// ────────────────────────────────────────────────────────────────────────────

const educationMeta: MetricMeta[] = [
  {
    id: 'literacy_rate',
    label: 'Literacy Rate',
    sector: 'education',
    unit: '%',
    description: 'Percentage of the population aged 7 years and above who can read and write with understanding.',
    sourceReport: 'Census of India / NSO Survey / UDISE+',
    higherIsBetter: true,
  },
  {
    id: 'ger_secondary',
    label: 'GER (Secondary)',
    sector: 'education',
    unit: '%',
    description: 'Gross Enrolment Ratio at the secondary level (Classes IX–X). Sourced from UDISE+ / Ministry of Education.',
    sourceReport: 'UDISE+ / Ministry of Education',
    higherIsBetter: true,
  },
  {
    id: 'higher_ed_ger',
    label: 'Higher Education GER',
    sector: 'education',
    unit: '%',
    description: 'Gross Enrolment Ratio in Higher Education (18–23 age group). Target under NEP 2020: 50% by 2035.',
    sourceReport: 'All India Survey on Higher Education (AISHE)',
    higherIsBetter: true,
  },
  {
    id: 'higher_ed_enrolment',
    label: 'Higher Education Enrolment',
    sector: 'education',
    unit: 'students',
    description: 'Total student enrolment in higher education institutions (universities, colleges, and stand-alone institutes). Sourced from AISHE.',
    sourceReport: 'AISHE 2021-22 (Ministry of Education)',
    higherIsBetter: true,
  },
];

export const educationMetrics: Metric[] = buildMetrics(educationMeta, nationalJson, stateJson);
