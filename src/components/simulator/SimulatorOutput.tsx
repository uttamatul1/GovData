import { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { formatValue } from '../../utils/format.utils';
import { cn } from '../../lib/utils';
import { SourceBadge } from '../shared/SourceBadge';
import { SimulatorInfoModal } from './SimulatorInfoModal';

interface SimulatorOutputProps {
  label: string;
  unit: string;
  currentValue: number;
  simulatedValue: number;
  higherIsBetter: boolean;
  methodNote: string;
  source: string;
}

export function SimulatorOutput({
  label,
  unit,
  currentValue,
  simulatedValue,
  higherIsBetter,
  methodNote,
  source,
}: SimulatorOutputProps) {
  const [showInfoModal, setShowInfoModal] = useState(false);

  const delta = simulatedValue - currentValue;
  const isNeutral = delta === 0;
  const isImprovement = isNeutral ? null : higherIsBetter ? delta > 0 : delta < 0;

  return (
    <>
      <Card className="flex flex-col h-full hover:shadow-md transition-shadow">
        <CardContent className="p-5 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <h4 className="font-semibold text-base flex items-center gap-1.5">
              {label}
              <button
                onClick={() => setShowInfoModal(true)}
                className="text-muted-foreground hover:text-primary p-0.5 rounded transition"
                title={`Learn about ${label} simulation model`}
              >
                <Info className="w-3.5 h-3.5" />
              </button>
            </h4>
            <SourceBadge source={source} />
          </div>

          <div className="flex items-end gap-4 mt-auto mb-2">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Simulated Projection</p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold">{formatValue(simulatedValue)}</span>
                <span className="text-sm text-muted-foreground">{unit}</span>
              </div>
            </div>

            <div className="mb-1">
              {isNeutral ? (
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Minus className="w-4 h-4" /> No change
                </span>
              ) : (
                <span
                  className={cn(
                    'flex items-center gap-1 text-sm font-medium',
                    isImprovement ? 'text-delta-improvement' : 'text-delta-worsening'
                  )}
                >
                  {delta > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  {delta > 0 ? '+' : ''}
                  {formatValue(delta)}
                </span>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center text-xs mt-4 pt-4 border-t border-border">
            <div className="text-muted-foreground">
              Current Govt Baseline:{' '}
              <span className="font-medium text-foreground">
                {formatValue(currentValue)} {unit}
              </span>
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground mt-2 italic">{methodNote}</p>
        </CardContent>
      </Card>

      <SimulatorInfoModal
        title={label}
        category="Projected Outcome Indicator"
        description={`Model projection for ${label}. Target direction: ${higherIsBetter ? 'Higher is Better' : 'Lower is Better'}.`}
        fundedSchemes={[`Baseline Value: ${currentValue} ${unit}`, `Source Survey: ${source}`]}
        simulationLogic={methodNote}
        baselineSource={source}
        isOpen={showInfoModal}
        onClose={() => setShowInfoModal(false)}
      />
    </>
  );
}
