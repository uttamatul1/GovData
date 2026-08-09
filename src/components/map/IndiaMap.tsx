import { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';
import { useMapStore } from '../../store/map.store';
import { statesData } from '../../data';
import { useChoropleth } from '../../hooks/useChoropleth';
import { useMetricData } from '../../hooks/useMetricData';
import { Loader2 } from 'lucide-react';
import { MapModeSelector } from './MapModeSelector';

const GEOJSON_SOURCES = [
  '/india-states.json',
  'https://gist.githubusercontent.com/jbrobst/56c13bbbf9d97d187fea01ca62ea5112/raw/e388c4cae20aa53cb5090210a42ebb9b765c0a36/india_states.geojson',
];

const NAME_TO_CODE: Record<string, string> = {
  'Andhra Pradesh': 'IN-AP', 'Arunachal Pradesh': 'IN-AR', 'Assam': 'IN-AS',
  'Bihar': 'IN-BR', 'Chhattisgarh': 'IN-CT', 'Goa': 'IN-GA', 'Gujarat': 'IN-GJ',
  'Haryana': 'IN-HR', 'Himachal Pradesh': 'IN-HP', 'Jharkhand': 'IN-JH',
  'Karnataka': 'IN-KA', 'Kerala': 'IN-KL', 'Madhya Pradesh': 'IN-MP',
  'Maharashtra': 'IN-MH', 'Manipur': 'IN-MN', 'Meghalaya': 'IN-ML',
  'Mizoram': 'IN-MZ', 'Nagaland': 'IN-NL', 'Odisha': 'IN-OR', 'Orissa': 'IN-OR',
  'Punjab': 'IN-PB', 'Rajasthan': 'IN-RJ', 'Sikkim': 'IN-SK',
  'Tamil Nadu': 'IN-TN', 'Telangana': 'IN-TG', 'Tripura': 'IN-TR',
  'Uttar Pradesh': 'IN-UP', 'Uttarakhand': 'IN-UT', 'Uttaranchal': 'IN-UT',
  'West Bengal': 'IN-WB',
  'Andaman and Nicobar Islands': 'IN-AN', 'Andaman and Nicobar': 'IN-AN',
  'Andaman & Nicobar Island': 'IN-AN', 'Chandigarh': 'IN-CH',
  'Dadra and Nagar Haveli': 'IN-DN', 'Dadra and Nagar Haveli and Daman and Diu': 'IN-DN',
  'Dadra & Nagar Haveli': 'IN-DN', 'Daman and Diu': 'IN-DN', 'Daman & Diu': 'IN-DN',
  'Delhi': 'IN-DL', 'NCT of Delhi': 'IN-DL',
  'Jammu and Kashmir': 'IN-JK', 'Jammu & Kashmir': 'IN-JK',
  'Ladakh': 'IN-LA', 'Lakshadweep': 'IN-LD',
  'Puducherry': 'IN-PY', 'Pondicherry': 'IN-PY',
};

function getStateCode(properties: any): string | null {
  const name = properties.ST_NM || properties.NAME_1 || properties.name || properties.NAME || properties.st_nm || '';
  return NAME_TO_CODE[name] || NAME_TO_CODE[name.trim()] || null;
}

export function IndiaMap() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    activeSector, activeMetricId, hoveredStateCode, mapMode,
    setHoveredStateCode, setTooltipPos, setSelectedStateCode,
  } = useMapStore();
  const { metric } = useMetricData(activeSector, activeMetricId);
  const colorScale = useChoropleth(activeSector, metric?.stateData || [], metric?.higherIsBetter ?? true);

  const [geoData, setGeoData] = useState<any>(null);
  const [useFallback, setUseFallback] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dimensions, setDimensions] = useState({ width: 800, height: 700 });

  // Fetch GeoJSON
  useEffect(() => {
    let cancelled = false;
    async function loadGeo() {
      for (const url of GEOJSON_SOURCES) {
        try {
          const res = await fetch(url);
          if (!res.ok) continue;
          const data = await res.json();
          if (data?.features?.length > 0 && !cancelled) {
            setGeoData(data);
            setLoading(false);
            return;
          }
        } catch { continue; }
      }
      if (!cancelled) { setUseFallback(true); setLoading(false); }
    }
    loadGeo();
    return () => { cancelled = true; };
  }, []);

  // Measure container
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        if (width > 0) setDimensions({ width, height: Math.max(500, width * 0.85) });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const handleClick = useCallback(
    (stateCode: string | null) => { setSelectedStateCode(stateCode); },
    [setSelectedStateCode]
  );

  const getLatestValue = useCallback(
    (stateCode: string) => {
      if (!metric) return null;
      const sd = metric.stateData.find((d) => d.stateCode === stateCode);
      if (!sd || sd.history.length === 0) return null;
      return [...sd.history].sort((a, b) => b.year - a.year)[0].value;
    },
    [metric]
  );

  // Helper: get all values for normalization
  const getAllValues = useCallback(() => {
    if (!metric) return [];
    return metric.stateData.map((sd) => {
      if (sd.history.length === 0) return null;
      return [...sd.history].sort((a, b) => b.year - a.year)[0].value;
    }).filter((v): v is number => v !== null);
  }, [metric]);

  // ─── RENDER MAP ───
  useEffect(() => {
    if (!svgRef.current || !metric || loading) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    const { width, height } = dimensions;

    const projection = d3.geoMercator()
      .center([82.5, 23.5])
      .scale(Math.min(width, height) * 1.15)
      .translate([width / 2, height / 2]);

    const g = svg.append('g');

    // Night mode background
    if (mapMode === 'night') {
      svg.insert('rect', ':first-child')
        .attr('width', width)
        .attr('height', height)
        .attr('fill', '#0a0e1a')
        .attr('rx', 12);
    }



    // Compute ranks for rank mode
    const rankedCodes = metric.stateData
      .map((sd) => ({
        code: sd.stateCode,
        val: sd.history.length > 0 ? [...sd.history].sort((a, b) => b.year - a.year)[0].value : null,
      }))
      .filter((x) => x.val !== null)
      .sort((a, b) => {
        if (metric.higherIsBetter) return (b.val as number) - (a.val as number);
        return (a.val as number) - (b.val as number);
      });
    const rankMap = new Map<string, number>();
    rankedCodes.forEach((x, i) => rankMap.set(x.code, i + 1));

    if (geoData && !useFallback) {
      const pathGenerator = d3.geoPath().projection(projection);

      // Draw base shapes for all modes
      g.selectAll('path')
        .data(geoData.features)
        .join('path')
        .attr('d', (d: any) => pathGenerator(d) || '')
        .attr('data-code', (d: any) => getStateCode(d.properties) || '')
        .attr('fill', (d: any) => {
          const code = getStateCode(d.properties);
          if (!code) return '#e5e7eb';
          const val = getLatestValue(code);

          if (mapMode === 'night') {
            if (val === null) return '#1a1f36';
            const c = colorScale(val);
            return d3.color(c)?.brighter(0.3)?.formatHex() || c;
          }
          return val !== null ? colorScale(val) : '#e5e7eb';
        })
        .attr('stroke', mapMode === 'night' ? '#2a3050' : '#ffffff')
        .attr('stroke-width', mapMode === 'night' ? 0.5 : 0.8)
        .style('cursor', 'pointer')
        .style('transition', 'stroke 0.12s ease, stroke-width 0.12s ease, opacity 0.12s ease')

        .on('mouseenter', (event: MouseEvent, d: any) => {
          const code = getStateCode(d.properties);
          if (code) {
            setHoveredStateCode(code);
            if (containerRef.current) {
              const rect = containerRef.current.getBoundingClientRect();
              setTooltipPos({ x: event.clientX - rect.left, y: event.clientY - rect.top });
            }
          }
        })
        .on('mousemove', (event: MouseEvent) => {
          if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            setTooltipPos({ x: event.clientX - rect.left, y: event.clientY - rect.top });
          }
        })
        .on('mouseleave', () => {
          setHoveredStateCode(null);
          setTooltipPos(null);
        })
        .on('click', (_event: any, d: any) => {
          const code = getStateCode(d.properties);
          if (code) handleClick(code);
        });



      // ─── LABELS ───
      if (mapMode === 'rank') {
        g.selectAll('text.rank-label')
          .data(geoData.features)
          .join('text')
          .attr('class', 'rank-label')
          .attr('x', (d: any) => pathGenerator.centroid(d)?.[0] || 0)
          .attr('y', (d: any) => pathGenerator.centroid(d)?.[1] || 0)
          .text((d: any) => {
            const c = getStateCode(d.properties);
            if (!c) return '';
            const rank = rankMap.get(c);
            return rank ? `#${rank}` : '';
          })
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'central')
          .style('fill', 'hsl(var(--foreground))')
          .style('font-size', '8.5px')
          .style('font-weight', '800')
          .style('pointer-events', 'none')
          .style('text-shadow', '0 0 3px hsl(var(--background))');
      } else {
        g.selectAll('text.label')
          .data(geoData.features)
          .join('text')
          .attr('class', 'label')
          .attr('x', (d: any) => pathGenerator.centroid(d)?.[0] || 0)
          .attr('y', (d: any) => pathGenerator.centroid(d)?.[1] || 0)
          .text((d: any) => { const c = getStateCode(d.properties); return c ? c.replace('IN-', '') : ''; })
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'central')
          .style('fill', mapMode === 'night' ? '#ffffff' : 'hsl(var(--foreground))')
          .style('font-size', '6.5px')
          .style('font-weight', '600')
          .style('pointer-events', 'none')
          .style('opacity', 0.7);
      }
    } else {
      // Fallback bubble map
      const stateGroups = g.selectAll('g.state')
        .data(statesData)
        .join('g')
        .attr('class', 'state')
        .style('cursor', 'pointer')
        .on('mouseenter', (event: MouseEvent, d: any) => {
          setHoveredStateCode(d.code);
          if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            setTooltipPos({ x: event.clientX - rect.left, y: event.clientY - rect.top });
          }
        })
        .on('mousemove', (event: MouseEvent) => {
          if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            setTooltipPos({ x: event.clientX - rect.left, y: event.clientY - rect.top });
          }
        })
        .on('mouseleave', () => {
          setHoveredStateCode(null);
          setTooltipPos(null);
        })
        .on('click', (_event: any, d: any) => handleClick(d.code));

      stateGroups.append('circle')
        .attr('cx', (d: any) => projection([d.centroidLng, d.centroidLat])?.[0] || 0)
        .attr('cy', (d: any) => projection([d.centroidLng, d.centroidLat])?.[1] || 0)
        .attr('data-code', (d: any) => d.code)
        .attr('r', (d: any) => d.area > 100000 ? 18 : d.area > 30000 ? 14 : 10)
        .attr('fill', (d: any) => {
          const val = getLatestValue(d.code);
          return val !== null ? colorScale(val) : '#e5e7eb';
        })
        .attr('stroke', '#ffffff')
        .attr('stroke-width', 1.5)
        .attr('opacity', 0.9)
        .style('transition', 'r 0.12s ease, stroke 0.12s ease, stroke-width 0.12s ease');

      stateGroups.append('text')
        .attr('x', (d: any) => projection([d.centroidLng, d.centroidLat])?.[0] || 0)
        .attr('y', (d: any) => (projection([d.centroidLng, d.centroidLat])?.[1] || 0) + 1)
        .text((d: any) => d.code.replace('IN-', ''))
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'central')
        .style('fill', '#ffffff')
        .style('font-size', (d: any) => d.area > 100000 ? '9px' : '7px')
        .style('font-weight', '700')
        .style('pointer-events', 'none');
    }
  }, [geoData, useFallback, metric, colorScale, dimensions, activeSector, activeMetricId, mapMode, setHoveredStateCode, handleClick, getLatestValue, getAllValues, loading, setTooltipPos]);

  // ─── HOVER STYLING (lightweight, no D3 re-render) ───
  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);

    if (geoData && !useFallback) {
      svg.selectAll('path[data-code]')
        .attr('stroke', function() {
          const code = d3.select(this).attr('data-code');
          return code === hoveredStateCode
            ? (mapMode === 'night' ? '#60a5fa' : 'hsl(var(--foreground))')
            : (mapMode === 'night' ? '#2a3050' : '#ffffff');
        })
        .attr('stroke-width', function() {
          const code = d3.select(this).attr('data-code');
          return code === hoveredStateCode ? 2.5 : 0.8;
        })
        .style('opacity', function() {
          const code = d3.select(this).attr('data-code');
          if (!hoveredStateCode) return 1;
          return code === hoveredStateCode ? 1 : 0.55;
        });
    } else {
      svg.selectAll('circle[data-code]')
        .attr('stroke', function() {
          const code = d3.select(this).attr('data-code');
          return code === hoveredStateCode ? 'hsl(var(--foreground))' : '#ffffff';
        })
        .attr('stroke-width', function() {
          const code = d3.select(this).attr('data-code');
          return code === hoveredStateCode ? 3 : 1.5;
        })
        .attr('r', function() {
          const code = d3.select(this).attr('data-code');
          const state = statesData.find(s => s.code === code);
          const baseR = state ? (state.area > 100000 ? 18 : state.area > 30000 ? 14 : 10) : 12;
          return code === hoveredStateCode ? baseR + 5 : baseR;
        });
    }
  }, [hoveredStateCode, geoData, useFallback, mapMode]);

  if (loading) {
    return (
      <div ref={containerRef} className="w-full h-full min-h-[350px] sm:min-h-[500px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="text-sm font-medium">Loading India map…</span>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full h-full min-h-[350px] sm:min-h-[500px] flex items-center justify-center relative">
      {/* Map Mode Selector */}
      <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10">
        <MapModeSelector />
      </div>

      <svg ref={svgRef} width={dimensions.width} height={dimensions.height} className="overflow-visible" />
    </div>
  );
}
