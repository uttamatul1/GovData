import { SectorPills } from '../components/shared/SectorPills';
import { MetricSelector } from '../components/shared/MetricSelector';
import { DataDisclaimer } from '../components/shared/DataDisclaimer';
import { DidYouKnow } from '../components/shared/DidYouKnow';

import { IndiaMap } from '../components/map/IndiaMap';
import { MapLegend } from '../components/map/MapLegend';
import { StateTooltip } from '../components/map/StateTooltip';
import { StateDrawer } from '../components/map/StateDrawer';

export function ExplorePage() {
  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto scrollbar-thin">
      <div className="container mx-auto px-4 py-4 flex-1 flex flex-col">
        <SectorPills />
        <MetricSelector />
        <div className="flex-1 relative mt-4 border rounded-xl overflow-hidden map-container-bg">
          <IndiaMap />
          <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 z-10 max-w-[calc(100%-1rem)]">
            <MapLegend />
          </div>
          <StateTooltip />
        </div>
        <DidYouKnow />
      </div>
      <StateDrawer />
      <DataDisclaimer />
    </div>
  );
}
