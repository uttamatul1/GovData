import type { Sector } from './metric.types';

export type ReportFrequency =
  | 'monthly'
  | 'quarterly'
  | 'annual'
  | 'biennial'
  | 'quinquennial'
  | 'decennial'
  | 'ad-hoc';

export type ReportStatus = 'active' | 'discontinued' | 'renamed';

export interface ReportEvent {
  year: number;
  round?: string;
  title: string;
  keyFindings: string[];
  sampleSize?: string;
  geographicCoverage: string;
  methodologyNote?: string;
}

export interface Report {
  id: string;
  name: string;
  shortName: string;
  ministry: string;
  issuingBody: string;
  sector: Sector[];
  frequency: ReportFrequency;
  status: ReportStatus;
  description: string;
  lastRelease: string;       // ISO date string
  nextExpected: string;      // ISO date string (approximate)
  officialUrl: string;
  history: ReportEvent[];
  renamedFrom?: string;
  renamedReason?: string;
  discontinuedReason?: string;
}
