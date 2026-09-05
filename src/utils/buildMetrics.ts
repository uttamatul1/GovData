import type { Metric, Sector, DataPoint, DataType, StateMetric } from '../types';

// ────────────────────────────────────────────────────────────────────────────
//  Type-safe shapes for the JSON files produced by the extraction script.
// ────────────────────────────────────────────────────────────────────────────

/**
 * A single data point as stored in JSON.
 * `dataType` is typed as `string` because JSON module imports widen
 * literal unions. The cast to `DataType` happens inside `buildMetrics`.
 */
export interface RawDataPoint {
  year: number;
  value: number;
  source: string;
  dataType: string;
}

/** National JSON shape: { metricId: RawDataPoint[] } */
export type NationalJson = Record<string, RawDataPoint[]>;

/** State JSON shape: { metricId: { stateCode: RawDataPoint[] } } */
export type StateJson = Record<string, Record<string, RawDataPoint[]>>;


/** Metadata for a single metric — all the non-data fields. */
export interface MetricMeta {
  id: string;
  label: string;
  sector: Sector;
  unit: string;
  description: string;
  sourceReport: string;
  higherIsBetter: boolean;
}

// ────────────────────────────────────────────────────────────────────────────
//  buildMetrics — assembles typed Metric[] from JSON + metadata
// ────────────────────────────────────────────────────────────────────────────

/**
 * Given a sector, its metric metadata, national JSON, and state JSON,
 * produce a fully-typed `Metric[]` array identical in shape to the old
 * hand-written data.
 *
 * This is the **single source of truth assembler** — `unit` and `metricId`
 * are derived from the metadata, eliminating the redundancy that caused
 * mismatches in the old hand-coded files.
 */
export function buildMetrics(
  metaList: MetricMeta[],
  nationalJson: NationalJson,
  stateJson: StateJson,
): Metric[] {
  return metaList.map((meta) => {
    const rawNational = nationalJson[meta.id] ?? [];
    const rawStates = stateJson[meta.id] ?? {};

    const nationalData: DataPoint[] = rawNational.map((dp) => ({
      year: dp.year,
      value: dp.value,
      source: dp.source,
      dataType: dp.dataType as DataType,
    }));

    const stateData: StateMetric[] = Object.entries(rawStates).map(
      ([stateCode, history]) => ({
        stateCode,
        metricId: meta.id,   // derived — no more mismatch risk
        unit: meta.unit,      // derived — no more mismatch risk
        history: history.map((dp) => ({
          year: dp.year,
          value: dp.value,
          source: dp.source,
          dataType: dp.dataType as DataType,
        })),
      }),
    );

    return {
      id: meta.id,
      label: meta.label,
      sector: meta.sector,
      unit: meta.unit,
      description: meta.description,
      sourceReport: meta.sourceReport,
      higherIsBetter: meta.higherIsBetter,
      nationalData,
      stateData,
    };
  });
}
