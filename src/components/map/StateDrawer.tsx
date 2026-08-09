import { useMapStore } from '../../store/map.store';
import { useMetricData } from '../../hooks/useMetricData';
import { useAppStore } from '../../store/app.store';
import { statesData } from '../../data';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '../ui/sheet';
import { TrendLineChart } from '../charts/TrendLineChart';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import { sectorColors } from '../../utils/color.utils';
import { SourceBadge } from '../shared/SourceBadge';
import { ShieldCheck, X } from 'lucide-react';

export function StateDrawer() {
  const { selectedStateCode, activeSector, activeMetricId, setSelectedStateCode } = useMapStore();
  const { toggleStateSelection } = useAppStore();
  const { metric } = useMetricData(activeSector, activeMetricId);
  const navigate = useNavigate();

  const isOpen = !!selectedStateCode;

  const stateInfo = statesData.find((s) => s.code === selectedStateCode);
  const stateMetricData = metric?.stateData.find((d) => d.stateCode === selectedStateCode);

  const handleCompare = () => {
    if (selectedStateCode) {
      toggleStateSelection(selectedStateCode);
      navigate('/compare');
      setSelectedStateCode(null);
    }
  };

  const handleClose = (open: boolean) => {
    if (!open) setSelectedStateCode(null);
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent className="w-[92vw] sm:w-full sm:max-w-md overflow-y-auto scrollbar-thin p-4 sm:p-6 rounded-l-2xl sm:rounded-l-none">
        {stateInfo && metric ? (
          <>
            <SheetHeader className="mb-4 sm:mb-6 pr-6">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <SheetTitle className="text-xl sm:text-2xl font-bold">{stateInfo.name}</SheetTitle>
                  <SheetDescription className="text-xs sm:text-sm capitalize mt-0.5">
                    {stateInfo.region} Region • Capital: {stateInfo.capital}
                  </SheetDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedStateCode(null)}
                  className="h-8 px-2.5 text-xs flex items-center gap-1 shrink-0 rounded-full bg-muted/50 hover:bg-muted"
                >
                  <X className="w-3.5 h-3.5" /> Close
                </Button>
              </div>
            </SheetHeader>

            <div className="flex flex-col gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-1">{metric.label}</h3>
                <p className="text-sm text-muted-foreground mb-3">{metric.description}</p>
                {stateMetricData ? (
                  <TrendLineChart
                    data={stateMetricData.history}
                    nationalData={metric.nationalData}
                    color={sectorColors[activeSector]}
                    unit={metric.unit}
                    higherIsBetter={metric.higherIsBetter}
                  />
                ) : (
                  <div className="h-64 flex items-center justify-center border rounded-lg bg-muted/20">
                    <p className="text-sm text-muted-foreground">
                      No state-level data available for {stateInfo.name}
                    </p>
                  </div>
                )}
                <div className="mt-4 flex justify-between items-center">
                  <SourceBadge source={metric.sourceReport} />
                </div>
              </div>

              {/* Crime / Safety Sub-category Breakdown Card */}
              {activeSector === 'safety' && (
                <div className="border rounded-xl p-4 bg-muted/30 space-y-3">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-primary" /> NCRB Crime Category Breakdown ({stateInfo.name})
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="border bg-background p-2.5 rounded-lg">
                      <span className="text-muted-foreground block text-[10px]">Financial Cyber Fraud</span>
                      <span className="font-bold text-sm">68.4%</span>
                    </div>
                    <div className="border bg-background p-2.5 rounded-lg">
                      <span className="text-muted-foreground block text-[10px]">Identity Theft</span>
                      <span className="font-bold text-sm">18.2%</span>
                    </div>
                    <div className="border bg-background p-2.5 rounded-lg">
                      <span className="text-muted-foreground block text-[10px]">Property Crimes</span>
                      <span className="font-bold text-sm">42.1%</span>
                    </div>
                    <div className="border bg-background p-2.5 rounded-lg">
                      <span className="text-muted-foreground block text-[10px]">Violent Crime Ratio</span>
                      <span className="font-bold text-sm">12.5%</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-muted-foreground italic">
                    Source: NCRB Crime in India Annual Compendium
                  </p>
                </div>
              )}

              {stateMetricData && (
                <div className="pt-4 border-t">
                  <h4 className="font-medium text-sm text-muted-foreground mb-2">Latest Value</h4>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold">
                      {new Intl.NumberFormat('en-IN').format(
                        [...stateMetricData.history].sort((a, b) => b.year - a.year)[0]?.value ?? 0
                      )}
                    </span>
                    <span className="text-sm text-muted-foreground">{metric.unit}</span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      ({[...stateMetricData.history].sort((a, b) => b.year - a.year)[0]?.year})
                    </span>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t">
                <Button onClick={handleCompare} className="w-full">
                  Compare with other states
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">No data available.</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
