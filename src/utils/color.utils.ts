import * as d3 from 'd3';
import type { Sector } from '../types';

export const sectorColors: Record<Sector, string> = {
  population: '#7F77DD',
  health: '#D85A30',
  education: '#1D9E75',
  economy: '#378ADD',
  labour: '#BA7517',
  agriculture: '#639922',
  social: '#D4537E',
  safety: '#8B5CF6',
};

// ─── Semantic green–yellow–red scale ─────────────────────────────────────────
// Good end (green)  →  neutral mid (amber)  →  Poor end (red)
// `higherIsBetter = true`  → high value gets green, low value gets red
// `higherIsBetter = false` → low value gets green, high value gets red

const GREEN  = '#16a34a'; // Tailwind green-600
const YELLOW = '#ca8a04'; // Tailwind yellow-600
const RED    = '#dc2626'; // Tailwind red-600

/** Returns a D3 sequential scale that maps a data range to a green→yellow→red (or reversed) gradient. */
export function getChoroplethScale(
  _sector: Sector,
  min: number,
  max: number,
  higherIsBetter: boolean,
) {
  const interpolator = higherIsBetter
    ? d3.interpolateRgbBasis([RED, YELLOW, GREEN])   // low=red → high=green
    : d3.interpolateRgbBasis([GREEN, YELLOW, RED]);  // low=green → high=red

  return d3.scaleSequential()
    .domain([min, max])
    .interpolator(interpolator)
    .clamp(true);
}

/** Night-mode variant — vivid neon glows on dark background. */
export function getNightChoroplethScale(
  _sector: Sector,
  min: number,
  max: number,
  higherIsBetter: boolean,
) {
  const interpolator = higherIsBetter
    ? d3.interpolateRgbBasis(['#7f1d1d', '#78350f', '#14532d'])   // dark red → dark amber → dark green
    : d3.interpolateRgbBasis(['#14532d', '#78350f', '#7f1d1d']);

  return d3.scaleSequential()
    .domain([min, max])
    .interpolator(interpolator)
    .clamp(true);
}

/** Single-value semantic colour lookup — no D3 scale needed. */
export function getSemanticColor(
  value: number,
  min: number,
  max: number,
  higherIsBetter: boolean,
): string {
  const scale = getChoroplethScale('health', min, max, higherIsBetter);
  return scale(value);
}

/** Returns the legend gradient stops as a CSS string (left = bad, right = good). */
export function getLegendGradient(higherIsBetter: boolean): string {
  return higherIsBetter
    ? `linear-gradient(to right, ${RED}, ${YELLOW}, ${GREEN})`
    : `linear-gradient(to right, ${GREEN}, ${YELLOW}, ${RED})`;
}

export const MAP_GREEN  = GREEN;
export const MAP_YELLOW = YELLOW;
export const MAP_RED    = RED;
