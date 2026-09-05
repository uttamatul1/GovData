/**
 * Data Audit Script — Run with: npx tsx scratch/audit_data.ts
 * Scans all hard-coded metric data for:
 *   1. Duplicate data points (same stateCode + year within a metric)
 *   2. Missing states (states listed in statesData but absent from a metric's stateData)
 *   3. Inconsistencies (unit mismatch, non-chronological years, duplicate metric IDs)
 *   4. Coverage gaps (metric has < 5 state entries)
 */

import { allMetrics } from '../src/data/index';
import { statesData } from '../src/data/states.data';

interface Issue {
  severity: 'ERROR' | 'WARNING' | 'INFO';
  metricId: string;
  metricLabel: string;
  stateCode?: string;
  description: string;
}

const issues: Issue[] = [];

// ─── All state codes from statesData ────
const allStateCodes = new Set(statesData.map((s) => s.code));
const stateNameMap = Object.fromEntries(statesData.map((s) => [s.code, s.name]));

// ─── Track metric IDs for duplicate check ────
const seenMetricIds = new Map<string, string>();

for (const metric of allMetrics) {
  // 1. Duplicate metric ID
  if (seenMetricIds.has(metric.id)) {
    issues.push({
      severity: 'ERROR',
      metricId: metric.id,
      metricLabel: metric.label,
      description: `Duplicate metric ID "${metric.id}" — also used by "${seenMetricIds.get(metric.id)}"`,
    });
  }
  seenMetricIds.set(metric.id, metric.label);

  // 2. National data checks
  const natYears = metric.nationalData.map((d) => d.year);
  // Duplicate years in national data
  const natYearSet = new Set<number>();
  for (const y of natYears) {
    if (natYearSet.has(y)) {
      issues.push({
        severity: 'ERROR',
        metricId: metric.id,
        metricLabel: metric.label,
        description: `National data has DUPLICATE year ${y}`,
      });
    }
    natYearSet.add(y);
  }
  // Non-chronological
  for (let i = 1; i < natYears.length; i++) {
    if (natYears[i] <= natYears[i - 1]) {
      issues.push({
        severity: 'WARNING',
        metricId: metric.id,
        metricLabel: metric.label,
        description: `National data is NOT chronological at index ${i}: year ${natYears[i]} follows ${natYears[i - 1]}`,
      });
    }
  }

  // 3. State data checks
  const stateCodesInMetric = new Set<string>();
  const duplicateStateEntries = new Map<string, number>();

  for (const sm of metric.stateData) {
    // Count state entries
    duplicateStateEntries.set(sm.stateCode, (duplicateStateEntries.get(sm.stateCode) || 0) + 1);
    stateCodesInMetric.add(sm.stateCode);

    // Unit mismatch
    if (sm.unit !== metric.unit) {
      issues.push({
        severity: 'ERROR',
        metricId: metric.id,
        metricLabel: metric.label,
        stateCode: sm.stateCode,
        description: `Unit mismatch: metric unit="${metric.unit}" but stateMetric unit="${sm.unit}"`,
      });
    }

    // metricId mismatch
    if (sm.metricId !== metric.id) {
      issues.push({
        severity: 'ERROR',
        metricId: metric.id,
        metricLabel: metric.label,
        stateCode: sm.stateCode,
        description: `MetricId mismatch: metric.id="${metric.id}" but stateMetric.metricId="${sm.metricId}"`,
      });
    }

    // Duplicate years within history
    const histYears = sm.history.map((d) => d.year);
    const histYearSet = new Set<number>();
    for (const y of histYears) {
      if (histYearSet.has(y)) {
        issues.push({
          severity: 'ERROR',
          metricId: metric.id,
          metricLabel: metric.label,
          stateCode: sm.stateCode,
          description: `Duplicate year ${y} in state history`,
        });
      }
      histYearSet.add(y);
    }

    // Non-chronological history
    for (let i = 1; i < histYears.length; i++) {
      if (histYears[i] <= histYears[i - 1]) {
        issues.push({
          severity: 'WARNING',
          metricId: metric.id,
          metricLabel: metric.label,
          stateCode: sm.stateCode,
          description: `History NOT chronological at index ${i}: year ${histYears[i]} follows ${histYears[i - 1]}`,
        });
      }
    }

    // Too few data points
    if (sm.history.length < 3) {
      issues.push({
        severity: 'WARNING',
        metricId: metric.id,
        metricLabel: metric.label,
        stateCode: sm.stateCode,
        description: `Only ${sm.history.length} data points — may be insufficient for trend analysis`,
      });
    }

    // Suspicious value: exact same value repeated
    const valueCounts = new Map<number, number>();
    for (const dp of sm.history) {
      valueCounts.set(dp.value, (valueCounts.get(dp.value) || 0) + 1);
    }
    for (const [val, count] of valueCounts) {
      if (count >= 3) {
        issues.push({
          severity: 'WARNING',
          metricId: metric.id,
          metricLabel: metric.label,
          stateCode: sm.stateCode,
          description: `Value ${val} repeated ${count} times — may indicate copy-paste error`,
        });
      }
    }

    // Unknown state code
    if (!allStateCodes.has(sm.stateCode)) {
      issues.push({
        severity: 'ERROR',
        metricId: metric.id,
        metricLabel: metric.label,
        stateCode: sm.stateCode,
        description: `State code "${sm.stateCode}" not found in statesData`,
      });
    }
  }

  // Duplicate state entries in metric
  for (const [code, count] of duplicateStateEntries) {
    if (count > 1) {
      issues.push({
        severity: 'ERROR',
        metricId: metric.id,
        metricLabel: metric.label,
        stateCode: code,
        description: `State "${stateNameMap[code] || code}" appears ${count} times in stateData — DUPLICATE ENTRY`,
      });
    }
  }

  // Missing states — 28 states should have data for most metrics
  const majorStates = statesData.filter((s) => s.region !== 'ut').map((s) => s.code);
  const missingMajor = majorStates.filter((c) => !stateCodesInMetric.has(c));
  if (missingMajor.length > 0) {
    issues.push({
      severity: 'INFO',
      metricId: metric.id,
      metricLabel: metric.label,
      description: `Missing ${missingMajor.length} major state(s): ${missingMajor.map((c) => stateNameMap[c] || c).join(', ')}`,
    });
  }
}

// ─── Print Results ────
console.log('\n════════════════════════════════════════════════════════════');
console.log('  DATA AUDIT REPORT');
console.log('════════════════════════════════════════════════════════════\n');

const errors = issues.filter((i) => i.severity === 'ERROR');
const warnings = issues.filter((i) => i.severity === 'WARNING');
const infos = issues.filter((i) => i.severity === 'INFO');

console.log(`Total Issues: ${issues.length}`);
console.log(`  🔴 ERRORS:   ${errors.length}`);
console.log(`  🟡 WARNINGS: ${warnings.length}`);
console.log(`  🔵 INFO:     ${infos.length}`);
console.log('');

for (const severity of ['ERROR', 'WARNING', 'INFO'] as const) {
  const filtered = issues.filter((i) => i.severity === severity);
  if (filtered.length === 0) continue;
  const icon = severity === 'ERROR' ? '🔴' : severity === 'WARNING' ? '🟡' : '🔵';
  console.log(`\n── ${icon} ${severity}S (${filtered.length}) ──\n`);
  for (const issue of filtered) {
    const state = issue.stateCode ? ` [${stateNameMap[issue.stateCode] || issue.stateCode}]` : '';
    console.log(`  ${icon} [${issue.metricId}] ${issue.metricLabel}${state}`);
    console.log(`     ${issue.description}`);
  }
}

// Summary table: metric coverage
console.log('\n\n── COVERAGE MATRIX ──\n');
console.log('Metric ID'.padEnd(25) + 'Label'.padEnd(35) + 'States'.padEnd(8) + 'Missing');
console.log('─'.repeat(90));
for (const metric of allMetrics) {
  const stateCount = metric.stateData.length;
  const majorStates = statesData.filter((s) => s.region !== 'ut').map((s) => s.code);
  const missing = majorStates.filter((c) => !metric.stateData.some((sm) => sm.stateCode === c));
  console.log(
    metric.id.padEnd(25) +
    metric.label.substring(0, 33).padEnd(35) +
    String(stateCount).padEnd(8) +
    (missing.length > 0 ? `${missing.length} missing` : '✅')
  );
}
