import type { Metric } from '../../types';

// ────────────────────────────────────────────────────────────────────────────
//  Sources: Census of India (2001, 2011), Registrar General of India (RGI)
//  Population Projections (Technical Group 2020), UN World Population
//  Prospects 2022, NFHS-5 (2019-21)
// ────────────────────────────────────────────────────────────────────────────

export const totalPopulation: Metric = {
  id: 'total_pop',
  label: 'Total Population',
  sector: 'population',
  unit: 'crore',
  description: 'Total population in crores. Sourced from Census of India, RGI Population Projections & UN Population Division.',
  sourceReport: 'Census of India / RGI / UN Data',
  higherIsBetter: false,
  nationalData: [
    { year: 2001, value: 102.87, source: 'Census of India 2001', dataType: 'official' },
    { year: 2006, value: 111.8, source: 'RGI Population Projection (2006)', dataType: 'projected' },
    { year: 2011, value: 121.09, source: 'Census of India 2011', dataType: 'official' },
    { year: 2016, value: 130.9, source: 'RGI Population Projection (2016)', dataType: 'projected' },
    { year: 2021, value: 139.34, source: 'RGI Technical Group Projection (2021)', dataType: 'projected' },
    { year: 2024, value: 142.86, source: 'UN DESA World Population Prospects (2024 Projection)', dataType: 'projected' },
  ],
  stateData: [
    { stateCode: 'IN-UP', metricId: 'total_pop', unit: 'crore', history: [
      { year: 2001, value: 16.62, source: 'Census 2001', dataType: 'official' },
      { year: 2011, value: 19.98, source: 'Census 2011', dataType: 'official' },
      { year: 2021, value: 23.15, source: 'RGI Projection', dataType: 'projected' },
      { year: 2024, value: 24.10, source: 'UN/RGI Est.', dataType: 'estimated' },
    ]},
    { stateCode: 'IN-MH', metricId: 'total_pop', unit: 'crore', history: [
      { year: 2001, value: 9.69, source: 'Census 2001', dataType: 'official' },
      { year: 2011, value: 11.24, source: 'Census 2011', dataType: 'official' },
      { year: 2021, value: 12.47, source: 'RGI Projection', dataType: 'projected' },
      { year: 2024, value: 12.80, source: 'UN/RGI Est.', dataType: 'estimated' },
    ]},
    { stateCode: 'IN-BR', metricId: 'total_pop', unit: 'crore', history: [
      { year: 2001, value: 8.30, source: 'Census 2001', dataType: 'official' },
      { year: 2011, value: 10.41, source: 'Census 2011', dataType: 'official' },
      { year: 2021, value: 12.44, source: 'RGI Projection', dataType: 'projected' },
      { year: 2024, value: 13.05, source: 'UN/RGI Est.', dataType: 'estimated' },
    ]},
    { stateCode: 'IN-WB', metricId: 'total_pop', unit: 'crore', history: [
      { year: 2001, value: 8.02, source: 'Census 2001', dataType: 'official' },
      { year: 2011, value: 9.13, source: 'Census 2011', dataType: 'official' },
      { year: 2021, value: 9.96, source: 'RGI Projection', dataType: 'projected' },
      { year: 2024, value: 10.15, source: 'UN/RGI Est.', dataType: 'estimated' },
    ]},
    { stateCode: 'IN-MP', metricId: 'total_pop', unit: 'crore', history: [
      { year: 2001, value: 6.03, source: 'Census 2001', dataType: 'official' },
      { year: 2011, value: 7.26, source: 'Census 2011', dataType: 'official' },
      { year: 2021, value: 8.50, source: 'RGI Projection', dataType: 'projected' },
      { year: 2024, value: 8.85, source: 'UN/RGI Est.', dataType: 'estimated' },
    ]},
    { stateCode: 'IN-TN', metricId: 'total_pop', unit: 'crore', history: [
      { year: 2001, value: 6.24, source: 'Census 2001', dataType: 'official' },
      { year: 2011, value: 7.21, source: 'Census 2011', dataType: 'official' },
      { year: 2021, value: 7.64, source: 'RGI Projection', dataType: 'projected' },
      { year: 2024, value: 7.72, source: 'UN/RGI Est.', dataType: 'estimated' },
    ]},
    { stateCode: 'IN-RJ', metricId: 'total_pop', unit: 'crore', history: [
      { year: 2001, value: 5.65, source: 'Census 2001', dataType: 'official' },
      { year: 2011, value: 6.85, source: 'Census 2011', dataType: 'official' },
      { year: 2021, value: 7.95, source: 'RGI Projection', dataType: 'projected' },
      { year: 2024, value: 8.30, source: 'UN/RGI Est.', dataType: 'estimated' },
    ]},
    { stateCode: 'IN-KA', metricId: 'total_pop', unit: 'crore', history: [
      { year: 2001, value: 5.29, source: 'Census 2001', dataType: 'official' },
      { year: 2011, value: 6.11, source: 'Census 2011', dataType: 'official' },
      { year: 2021, value: 6.68, source: 'RGI Projection', dataType: 'projected' },
      { year: 2024, value: 6.85, source: 'UN/RGI Est.', dataType: 'estimated' },
    ]},
    { stateCode: 'IN-GJ', metricId: 'total_pop', unit: 'crore', history: [
      { year: 2001, value: 5.07, source: 'Census 2001', dataType: 'official' },
      { year: 2011, value: 6.04, source: 'Census 2011', dataType: 'official' },
      { year: 2021, value: 6.98, source: 'RGI Projection', dataType: 'projected' },
      { year: 2024, value: 7.25, source: 'UN/RGI Est.', dataType: 'estimated' },
    ]},
    { stateCode: 'IN-AP', metricId: 'total_pop', unit: 'crore', history: [
      { year: 2001, value: 4.52, source: 'Census 2001', dataType: 'official' },
      { year: 2011, value: 4.96, source: 'Census 2011', dataType: 'official' },
      { year: 2021, value: 5.27, source: 'RGI Projection', dataType: 'projected' },
      { year: 2024, value: 5.35, source: 'UN/RGI Est.', dataType: 'estimated' },
    ]},
    { stateCode: 'IN-OR', metricId: 'total_pop', unit: 'crore', history: [
      { year: 2001, value: 3.68, source: 'Census 2001', dataType: 'official' },
      { year: 2011, value: 4.19, source: 'Census 2011', dataType: 'official' },
      { year: 2021, value: 4.54, source: 'RGI Projection', dataType: 'projected' },
      { year: 2024, value: 4.65, source: 'UN/RGI Est.', dataType: 'estimated' },
    ]},
    { stateCode: 'IN-KL', metricId: 'total_pop', unit: 'crore', history: [
      { year: 2001, value: 3.18, source: 'Census 2001', dataType: 'official' },
      { year: 2011, value: 3.34, source: 'Census 2011', dataType: 'official' },
      { year: 2021, value: 3.55, source: 'RGI Projection', dataType: 'projected' },
      { year: 2024, value: 3.58, source: 'UN/RGI Est.', dataType: 'estimated' },
    ]},
    { stateCode: 'IN-HR', metricId: 'total_pop', unit: 'crore', history: [
      { year: 2001, value: 2.11, source: 'Census 2001', dataType: 'official' },
      { year: 2011, value: 2.54, source: 'Census 2011', dataType: 'official' },
      { year: 2021, value: 2.91, source: 'RGI Projection', dataType: 'projected' },
      { year: 2024, value: 3.02, source: 'UN/RGI Est.', dataType: 'estimated' },
    ]},
    { stateCode: 'IN-PB', metricId: 'total_pop', unit: 'crore', history: [
      { year: 2001, value: 2.44, source: 'Census 2001', dataType: 'official' },
      { year: 2011, value: 2.77, source: 'Census 2011', dataType: 'official' },
      { year: 2021, value: 3.09, source: 'RGI Projection', dataType: 'projected' },
      { year: 2024, value: 3.18, source: 'UN/RGI Est.', dataType: 'estimated' },
    ]},
    { stateCode: 'IN-JH', metricId: 'total_pop', unit: 'crore', history: [
      { year: 2001, value: 2.69, source: 'Census 2001', dataType: 'official' },
      { year: 2011, value: 3.30, source: 'Census 2011', dataType: 'official' },
      { year: 2021, value: 3.84, source: 'RGI Projection', dataType: 'projected' },
      { year: 2024, value: 4.02, source: 'UN/RGI Est.', dataType: 'estimated' },
    ]},
    { stateCode: 'IN-CT', metricId: 'total_pop', unit: 'crore', history: [
      { year: 2001, value: 2.08, source: 'Census 2001', dataType: 'official' },
      { year: 2011, value: 2.56, source: 'Census 2011', dataType: 'official' },
      { year: 2021, value: 2.99, source: 'RGI Projection', dataType: 'projected' },
      { year: 2024, value: 3.15, source: 'UN/RGI Est.', dataType: 'estimated' },
    ]},
    { stateCode: 'IN-AS', metricId: 'total_pop', unit: 'crore', history: [
      { year: 2001, value: 2.67, source: 'Census 2001', dataType: 'official' },
      { year: 2011, value: 3.12, source: 'Census 2011', dataType: 'official' },
      { year: 2021, value: 3.56, source: 'RGI Projection', dataType: 'projected' },
      { year: 2024, value: 3.71, source: 'UN/RGI Est.', dataType: 'estimated' },
    ]},
    { stateCode: 'IN-TG', metricId: 'total_pop', unit: 'crore', history: [
      { year: 2011, value: 3.50, source: 'Census 2011 (erstwhile AP)', dataType: 'official' },
      { year: 2021, value: 3.87, source: 'RGI Projection', dataType: 'projected' },
      { year: 2024, value: 3.96, source: 'UN/RGI Est.', dataType: 'estimated' },
    ]},
    { stateCode: 'IN-DL', metricId: 'total_pop', unit: 'crore', history: [
      { year: 2001, value: 1.38, source: 'Census 2001', dataType: 'official' },
      { year: 2011, value: 1.68, source: 'Census 2011', dataType: 'official' },
      { year: 2021, value: 2.05, source: 'RGI Projection', dataType: 'projected' },
      { year: 2024, value: 2.21, source: 'UN/RGI Est.', dataType: 'estimated' },
    ]},
  ],
};

export const sexRatio: Metric = {
  id: 'sex_ratio',
  label: 'Sex Ratio',
  sector: 'population',
  unit: 'females per 1,000 males',
  description: 'Number of females per 1,000 males in the total population. Sourced from Census & NFHS.',
  sourceReport: 'Census of India / NFHS-5 (2019-21)',
  higherIsBetter: true,
  nationalData: [
    { year: 2001, value: 933, source: 'Census of India 2001', dataType: 'official' },
    { year: 2011, value: 943, source: 'Census of India 2011', dataType: 'official' },
    { year: 2016, value: 991, source: 'NFHS-4 Survey (2015-16)', dataType: 'official' },
    { year: 2021, value: 1020, source: 'NFHS-5 Survey (2019-21)', dataType: 'official' },
    { year: 2024, value: 1025, source: 'RGI Technical Group Projection', dataType: 'projected' },
  ],
  stateData: [
    { stateCode: 'IN-KL', metricId: 'sex_ratio', unit: 'females per 1,000 males', history: [
      { year: 2001, value: 1058, source: 'Census 2001', dataType: 'official' },
      { year: 2011, value: 1084, source: 'Census 2011', dataType: 'official' },
      { year: 2016, value: 1047, source: 'NFHS-4', dataType: 'official' },
      { year: 2021, value: 1121, source: 'NFHS-5', dataType: 'official' },
    ]},
    { stateCode: 'IN-TN', metricId: 'sex_ratio', unit: 'females per 1,000 males', history: [
      { year: 2001, value: 987, source: 'Census 2001', dataType: 'official' },
      { year: 2011, value: 996, source: 'Census 2011', dataType: 'official' },
      { year: 2016, value: 1035, source: 'NFHS-4', dataType: 'official' },
      { year: 2021, value: 1088, source: 'NFHS-5', dataType: 'official' },
    ]},
    { stateCode: 'IN-MH', metricId: 'sex_ratio', unit: 'females per 1,000 males', history: [
      { year: 2001, value: 922, source: 'Census 2001', dataType: 'official' },
      { year: 2011, value: 929, source: 'Census 2011', dataType: 'official' },
      { year: 2016, value: 970, source: 'NFHS-4', dataType: 'official' },
      { year: 2021, value: 966, source: 'NFHS-5', dataType: 'official' },
    ]},
    { stateCode: 'IN-HR', metricId: 'sex_ratio', unit: 'females per 1,000 males', history: [
      { year: 2001, value: 861, source: 'Census 2001', dataType: 'official' },
      { year: 2011, value: 879, source: 'Census 2011', dataType: 'official' },
      { year: 2016, value: 879, source: 'NFHS-4', dataType: 'official' },
      { year: 2021, value: 926, source: 'NFHS-5', dataType: 'official' },
    ]},
    { stateCode: 'IN-UP', metricId: 'sex_ratio', unit: 'females per 1,000 males', history: [
      { year: 2001, value: 898, source: 'Census 2001', dataType: 'official' },
      { year: 2011, value: 912, source: 'Census 2011', dataType: 'official' },
      { year: 2016, value: 1010, source: 'NFHS-4', dataType: 'official' },
      { year: 2021, value: 1017, source: 'NFHS-5', dataType: 'official' },
    ]},
    { stateCode: 'IN-BR', metricId: 'sex_ratio', unit: 'females per 1,000 males', history: [
      { year: 2001, value: 919, source: 'Census 2001', dataType: 'official' },
      { year: 2011, value: 918, source: 'Census 2011', dataType: 'official' },
      { year: 2016, value: 1090, source: 'NFHS-4', dataType: 'official' },
      { year: 2021, value: 1090, source: 'NFHS-5', dataType: 'official' },
    ]},
    { stateCode: 'IN-RJ', metricId: 'sex_ratio', unit: 'females per 1,000 males', history: [
      { year: 2001, value: 922, source: 'Census 2001', dataType: 'official' },
      { year: 2011, value: 928, source: 'Census 2011', dataType: 'official' },
      { year: 2016, value: 1005, source: 'NFHS-4', dataType: 'official' },
      { year: 2021, value: 1009, source: 'NFHS-5', dataType: 'official' },
    ]},
    { stateCode: 'IN-GJ', metricId: 'sex_ratio', unit: 'females per 1,000 males', history: [
      { year: 2001, value: 921, source: 'Census 2001', dataType: 'official' },
      { year: 2011, value: 919, source: 'Census 2011', dataType: 'official' },
      { year: 2016, value: 972, source: 'NFHS-4', dataType: 'official' },
      { year: 2021, value: 986, source: 'NFHS-5', dataType: 'official' },
    ]},
    { stateCode: 'IN-MP', metricId: 'sex_ratio', unit: 'females per 1,000 males', history: [
      { year: 2001, value: 920, source: 'Census 2001', dataType: 'official' },
      { year: 2011, value: 931, source: 'Census 2011', dataType: 'official' },
      { year: 2016, value: 952, source: 'NFHS-4', dataType: 'official' },
      { year: 2021, value: 970, source: 'NFHS-5', dataType: 'official' },
    ]},
    { stateCode: 'IN-KA', metricId: 'sex_ratio', unit: 'females per 1,000 males', history: [
      { year: 2001, value: 964, source: 'Census 2001', dataType: 'official' },
      { year: 2011, value: 973, source: 'Census 2011', dataType: 'official' },
      { year: 2016, value: 1021, source: 'NFHS-4', dataType: 'official' },
      { year: 2021, value: 1023, source: 'NFHS-5', dataType: 'official' },
    ]},
    { stateCode: 'IN-WB', metricId: 'sex_ratio', unit: 'females per 1,000 males', history: [
      { year: 2001, value: 934, source: 'Census 2001', dataType: 'official' },
      { year: 2011, value: 950, source: 'Census 2011', dataType: 'official' },
      { year: 2016, value: 1014, source: 'NFHS-4', dataType: 'official' },
      { year: 2021, value: 1034, source: 'NFHS-5', dataType: 'official' },
    ]},
    { stateCode: 'IN-OR', metricId: 'sex_ratio', unit: 'females per 1,000 males', history: [
      { year: 2001, value: 972, source: 'Census 2001', dataType: 'official' },
      { year: 2011, value: 979, source: 'Census 2011', dataType: 'official' },
      { year: 2016, value: 1012, source: 'NFHS-4', dataType: 'official' },
      { year: 2021, value: 1015, source: 'NFHS-5', dataType: 'official' },
    ]},
    { stateCode: 'IN-AP', metricId: 'sex_ratio', unit: 'females per 1,000 males', history: [
      { year: 2001, value: 978, source: 'Census 2001', dataType: 'official' },
      { year: 2011, value: 993, source: 'Census 2011', dataType: 'official' },
      { year: 2016, value: 1039, source: 'NFHS-4', dataType: 'official' },
      { year: 2021, value: 1042, source: 'NFHS-5', dataType: 'official' },
    ]},
    { stateCode: 'IN-TG', metricId: 'sex_ratio', unit: 'females per 1,000 males', history: [
      { year: 2011, value: 988, source: 'Census 2011', dataType: 'official' },
      { year: 2016, value: 1026, source: 'NFHS-4', dataType: 'official' },
      { year: 2021, value: 1032, source: 'NFHS-5', dataType: 'official' },
    ]},
    { stateCode: 'IN-AS', metricId: 'sex_ratio', unit: 'females per 1,000 males', history: [
      { year: 2001, value: 935, source: 'Census 2001', dataType: 'official' },
      { year: 2011, value: 958, source: 'Census 2011', dataType: 'official' },
      { year: 2016, value: 963, source: 'NFHS-4', dataType: 'official' },
      { year: 2021, value: 1012, source: 'NFHS-5', dataType: 'official' },
    ]},
    { stateCode: 'IN-JH', metricId: 'sex_ratio', unit: 'females per 1,000 males', history: [
      { year: 2001, value: 941, source: 'Census 2001', dataType: 'official' },
      { year: 2011, value: 948, source: 'Census 2011', dataType: 'official' },
      { year: 2016, value: 958, source: 'NFHS-4', dataType: 'official' },
      { year: 2021, value: 956, source: 'NFHS-5', dataType: 'official' },
    ]},
    { stateCode: 'IN-CT', metricId: 'sex_ratio', unit: 'females per 1,000 males', history: [
      { year: 2001, value: 990, source: 'Census 2001', dataType: 'official' },
      { year: 2011, value: 991, source: 'Census 2011', dataType: 'official' },
      { year: 2016, value: 976, source: 'NFHS-4', dataType: 'official' },
      { year: 2021, value: 982, source: 'NFHS-5', dataType: 'official' },
    ]},
    { stateCode: 'IN-PB', metricId: 'sex_ratio', unit: 'females per 1,000 males', history: [
      { year: 2001, value: 874, source: 'Census 2001', dataType: 'official' },
      { year: 2011, value: 895, source: 'Census 2011', dataType: 'official' },
      { year: 2016, value: 928, source: 'NFHS-4', dataType: 'official' },
      { year: 2021, value: 938, source: 'NFHS-5', dataType: 'official' },
    ]},
    { stateCode: 'IN-DL', metricId: 'sex_ratio', unit: 'females per 1,000 males', history: [
      { year: 2001, value: 821, source: 'Census 2001', dataType: 'official' },
      { year: 2011, value: 868, source: 'Census 2011', dataType: 'official' },
      { year: 2016, value: 896, source: 'NFHS-4', dataType: 'official' },
      { year: 2021, value: 930, source: 'NFHS-5', dataType: 'official' },
    ]},
  ],
};

export const populationMetrics = [totalPopulation, sexRatio];
