import type { Metric } from '../types';
import { statesData } from '../data/states.data';

// ────────────────────────────────────────────────────────────────────────────
//  Data Validation — catches duplicates, missing data, and inconsistencies.
//  Designed to run:
//    1. At import time in DEV (console warnings)
//    2. As a standalone CLI (npm run validate-data)
// ────────────────────────────────────────────────────────────────────────────

export type IssueSeverity = 'ERROR' | 'WARNING' | 'INFO';

export interface DataIssue {
  severity: IssueSeverity;
  metricId: string;
  metricLabel: string;
  stateCode?: string;
  description: string;
}

/** Master list of all state/UT codes from statesData */
const allStateCodes = new Set(statesData.map((s) => s.code));
const stateNameMap: Record<string, string> = Object.fromEntries(
  statesData.map((s) => [s.code, s.name]),
);

/**
 * Validate a list of metrics and return all issues found.
 */
export function validateMetrics(metrics: Metric[]): DataIssue[] {
  const issues: DataIssue[] = [];
  const seenIds = new Map<string, string>();

  for (const metric of metrics) {
    // ── Duplicate metric ID ──
    if (seenIds.has(metric.id)) {
      issues.push({
        severity: 'ERROR',
        metricId: metric.id,
        metricLabel: metric.label,
        description: `Duplicate metric ID "${metric.id}" — also used by "${seenIds.get(metric.id)}"`,
      });
    }
    seenIds.set(metric.id, metric.label);

    // ── National data ──
    const natYearSet = new Set<number>();
    for (const dp of metric.nationalData) {
      if (natYearSet.has(dp.year)) {
        issues.push({
          severity: 'ERROR',
          metricId: metric.id,
          metricLabel: metric.label,
          description: `National data has DUPLICATE year ${dp.year}`,
        });
      }
      natYearSet.add(dp.year);
    }

    // Chronological check
    for (let i = 1; i < metric.nationalData.length; i++) {
      if (metric.nationalData[i].year <= metric.nationalData[i - 1].year) {
        issues.push({
          severity: 'WARNING',
          metricId: metric.id,
          metricLabel: metric.label,
          description: `National data not chronological: year ${metric.nationalData[i].year} follows ${metric.nationalData[i - 1].year}`,
        });
      }
    }

    // ── State data ──
    const stateCodeCounts = new Map<string, number>();
    const stateCodesInMetric = new Set<string>();

    for (const sm of metric.stateData) {
      stateCodeCounts.set(sm.stateCode, (stateCodeCounts.get(sm.stateCode) || 0) + 1);
      stateCodesInMetric.add(sm.stateCode);

      // Unit mismatch
      if (sm.unit !== metric.unit) {
        issues.push({
          severity: 'ERROR',
          metricId: metric.id,
          metricLabel: metric.label,
          stateCode: sm.stateCode,
          description: `Unit mismatch: metric="${metric.unit}", stateMetric="${sm.unit}"`,
        });
      }

      // MetricId mismatch
      if (sm.metricId !== metric.id) {
        issues.push({
          severity: 'ERROR',
          metricId: metric.id,
          metricLabel: metric.label,
          stateCode: sm.stateCode,
          description: `MetricId mismatch: metric.id="${metric.id}", stateMetric.metricId="${sm.metricId}"`,
        });
      }

      // Duplicate years in history
      const histYearSet = new Set<number>();
      for (const dp of sm.history) {
        if (histYearSet.has(dp.year)) {
          issues.push({
            severity: 'ERROR',
            metricId: metric.id,
            metricLabel: metric.label,
            stateCode: sm.stateCode,
            description: `Duplicate year ${dp.year} in state history`,
          });
        }
        histYearSet.add(dp.year);
      }

      // Non-chronological history
      for (let i = 1; i < sm.history.length; i++) {
        if (sm.history[i].year <= sm.history[i - 1].year) {
          issues.push({
            severity: 'WARNING',
            metricId: metric.id,
            metricLabel: metric.label,
            stateCode: sm.stateCode,
            description: `History not chronological: year ${sm.history[i].year} follows ${sm.history[i - 1].year}`,
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
          description: `Only ${sm.history.length} data point(s) — may be insufficient for trend analysis`,
        });
      }

      // Repeated identical values (copy-paste detection)
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
            description: `Value ${val} repeated ${count} times — possible copy-paste error`,
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

    // Duplicate state entries
    for (const [code, count] of stateCodeCounts) {
      if (count > 1) {
        issues.push({
          severity: 'ERROR',
          metricId: metric.id,
          metricLabel: metric.label,
          stateCode: code,
          description: `State "${stateNameMap[code] ?? code}" appears ${count} times — DUPLICATE ENTRY`,
        });
      }
    }

    // Missing major states (non-UT)
    const majorStates = statesData.filter((s) => s.region !== 'ut').map((s) => s.code);
    const missing = majorStates.filter((c) => !stateCodesInMetric.has(c));
    if (missing.length > 0) {
      issues.push({
        severity: 'INFO',
        metricId: metric.id,
        metricLabel: metric.label,
        description: `Missing ${missing.length} major state(s): ${missing.map((c) => stateNameMap[c] ?? c).join(', ')}`,
      });
    }
  }

  return issues;
}

/**
 * Run validation in DEV mode — prints warnings to the console.
 * Does NOT throw; safe to call at module load time.
 */
export function validateInDev(metrics: Metric[]): void {
  const issues = validateMetrics(metrics);
  if (issues.length === 0) return;

  const errors = issues.filter((i) => i.severity === 'ERROR');
  const warnings = issues.filter((i) => i.severity === 'WARNING');
  const infos = issues.filter((i) => i.severity === 'INFO');

  console.groupCollapsed(
    `%c[Data Validation] ${issues.length} issue(s) found — ${errors.length} errors, ${warnings.length} warnings, ${infos.length} info`,
    errors.length > 0 ? 'color: red; font-weight: bold' : 'color: orange; font-weight: bold',
  );

  for (const issue of errors) {
    const state = issue.stateCode ? ` [${stateNameMap[issue.stateCode] ?? issue.stateCode}]` : '';
    console.error(`🔴 [${issue.metricId}]${state} ${issue.description}`);
  }
  for (const issue of warnings) {
    const state = issue.stateCode ? ` [${stateNameMap[issue.stateCode] ?? issue.stateCode}]` : '';
    console.warn(`🟡 [${issue.metricId}]${state} ${issue.description}`);
  }
  for (const issue of infos) {
    console.info(`🔵 [${issue.metricId}] ${issue.description}`);
  }

  console.groupEnd();
}

/**
 * Standalone CLI runner — exits with code 1 if any ERRORs are found.
 * Used by `npm run validate-data`.
 */
export function runValidationCLI(metrics: Metric[]): void {
  const issues = validateMetrics(metrics);

  const errors = issues.filter((i) => i.severity === 'ERROR');
  const warnings = issues.filter((i) => i.severity === 'WARNING');
  const infos = issues.filter((i) => i.severity === 'INFO');

  console.log('\n════════════════════════════════════════════════════════════');
  console.log('  DATA VALIDATION REPORT');
  console.log('════════════════════════════════════════════════════════════\n');
  console.log(`Total Issues: ${issues.length}`);
  console.log(`  🔴 ERRORS:   ${errors.length}`);
  console.log(`  🟡 WARNINGS: ${warnings.length}`);
  console.log(`  🔵 INFO:     ${infos.length}\n`);

  for (const severity of ['ERROR', 'WARNING', 'INFO'] as const) {
    const filtered = issues.filter((i) => i.severity === severity);
    if (filtered.length === 0) continue;
    const icon = severity === 'ERROR' ? '🔴' : severity === 'WARNING' ? '🟡' : '🔵';
    console.log(`── ${icon} ${severity}S (${filtered.length}) ──\n`);
    for (const issue of filtered) {
      const state = issue.stateCode ? ` [${stateNameMap[issue.stateCode] ?? issue.stateCode}]` : '';
      console.log(`  ${icon} [${issue.metricId}] ${issue.metricLabel}${state}`);
      console.log(`     ${issue.description}`);
    }
    console.log('');
  }

  if (errors.length > 0) {
    console.error(`\n❌ Validation FAILED with ${errors.length} error(s).\n`);
    process.exit(1);
  } else {
    console.log(`\n✅ Validation PASSED (${warnings.length} warnings, ${infos.length} info).\n`);
  }
}
