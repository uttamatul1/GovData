import { create } from 'zustand';
import type { Sector } from '../types';
import { getDefaultMetricId } from '../data';

export type MapMode = 'night' | 'rank';

interface MapState {
  hoveredStateCode: string | null;
  setHoveredStateCode: (code: string | null) => void;
  tooltipPos: { x: number; y: number } | null;
  setTooltipPos: (pos: { x: number; y: number } | null) => void;
  selectedStateCode: string | null;
  setSelectedStateCode: (code: string | null) => void;
  activeSector: Sector;
  setActiveSector: (sector: Sector) => void;
  activeMetricId: string;
  setActiveMetricId: (id: string) => void;
  mapMode: MapMode;
  setMapMode: (mode: MapMode) => void;
}

export const useMapStore = create<MapState>((set) => ({
  hoveredStateCode: null,
  setHoveredStateCode: (code) => set({ hoveredStateCode: code }),
  tooltipPos: null,
  setTooltipPos: (pos) => set({ tooltipPos: pos }),
  selectedStateCode: null,
  setSelectedStateCode: (code) => set({ selectedStateCode: code }),
  activeSector: 'health',
  setActiveSector: (sector) =>
    set({
      activeSector: sector,
      activeMetricId: getDefaultMetricId(sector),
    }),
  activeMetricId: 'imr',
  setActiveMetricId: (id) => set({ activeMetricId: id }),
  mapMode: 'night',
  setMapMode: (mode) => set({ mapMode: mode }),
}));
