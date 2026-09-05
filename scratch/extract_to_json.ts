/**
 * Extract all hard-coded metric data from TS files into flat JSON files.
 * Run with: npx tsx scratch/extract_to_json.ts
 */
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { allMetrics } from '../src/data/index';
import type { Metric, Sector } from '../src/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const JSON_DIR = path.resolve(__dirname, '../src/data/json');

// Ensure output directory exists
fs.mkdirSync(JSON_DIR, { recursive: true });

// Group metrics by sector
const bySector = new Map<Sector, Metric[]>();
for (const m of allMetrics) {
  const list = bySector.get(m.sector) || [];
  list.push(m);
  bySector.set(m.sector, list);
}

// Also build a combined metadata file
interface MetricMeta {
  id: string;
  label: string;
  sector: Sector;
  unit: string;
  description: string;
  sourceReport: string;
  higherIsBetter: boolean;
}

const allMeta: MetricMeta[] = [];

for (const [sector, metrics] of bySector) {
  // Map sector to filename-safe name
  const sectorFile = sector === 'safety' ? 'crime' : sector;

  // National data: { metricId: DataPoint[] }
  const national: Record<string, any[]> = {};

  // State data: { metricId: { stateCode: DataPoint[] } }
  const states: Record<string, Record<string, any[]>> = {};

  for (const m of metrics) {
    // Collect metadata
    allMeta.push({
      id: m.id,
      label: m.label,
      sector: m.sector,
      unit: m.unit,
      description: m.description,
      sourceReport: m.sourceReport,
      higherIsBetter: m.higherIsBetter,
    });

    // National data — strip redundancy
    national[m.id] = m.nationalData.map((dp) => ({
      year: dp.year,
      value: dp.value,
      source: dp.source,
      dataType: dp.dataType,
    }));

    // State data — flatten to { stateCode: DataPoint[] }
    const stateMap: Record<string, any[]> = {};
    for (const sm of m.stateData) {
      stateMap[sm.stateCode] = sm.history.map((dp) => ({
        year: dp.year,
        value: dp.value,
        source: dp.source,
        dataType: dp.dataType,
      }));
    }
    states[m.id] = stateMap;
  }

  // Write national JSON
  const natPath = path.join(JSON_DIR, `${sectorFile}.national.json`);
  fs.writeFileSync(natPath, JSON.stringify(national, null, 2), 'utf-8');
  console.log(`✅ ${natPath}`);

  // Write state JSON
  const statePath = path.join(JSON_DIR, `${sectorFile}.states.json`);
  fs.writeFileSync(statePath, JSON.stringify(states, null, 2), 'utf-8');
  console.log(`✅ ${statePath}`);
}

// Write combined metadata
const metaPath = path.join(JSON_DIR, 'metrics.meta.json');
fs.writeFileSync(metaPath, JSON.stringify(allMeta, null, 2), 'utf-8');
console.log(`\n✅ ${metaPath}`);

console.log(`\nDone! Extracted ${allMeta.length} metrics across ${bySector.size} sectors.`);
