export type Sector =
  | 'population'
  | 'health'
  | 'education'
  | 'economy'
  | 'labour'
  | 'agriculture'
  | 'social'
  | 'safety';

export type DataType = 'official' | 'estimated' | 'projected';

export interface DataPoint {
  year: number;
  value: number;
  source: string;        // e.g. "NFHS-5"
  reportRound?: string;  // e.g. "5th Round"
  dataType: DataType;
}

export interface StateMetric {
  stateCode: string;     // ISO 3166-2 code e.g. "IN-MH"
  metricId: string;
  unit: string;
  history: DataPoint[];  // Chronological, at least 5 data points
}

export interface Metric {
  id: string;
  label: string;
  sector: Sector;
  unit: string;
  description: string;
  sourceReport: string;
  higherIsBetter: boolean;
  nationalData: DataPoint[];
  stateData: StateMetric[];
}
