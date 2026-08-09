import { Slider } from '../ui/slider';
import { useSimulatorStore } from '../../store/simulator.store';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface SimulatorSliderProps {
  id: string;
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  currentGovtValue: number;
  capReason: string;
  defaultValue?: number;
}

export function SimulatorSlider({ id, label, unit, min, max, step, currentGovtValue, capReason, defaultValue }: SimulatorSliderProps) {
  const value = useSimulatorStore((state) => state.inputs[id] ?? defaultValue ?? currentGovtValue);
  const setInputValue = useSimulatorStore((state) => state.setInputValue);

  return (
    <div className="flex flex-col gap-3 py-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <label className="text-sm font-medium">{label}</label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-4 h-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-[200px] text-xs">{capReason}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="text-sm font-bold text-primary">
          {value}{unit}
        </div>
      </div>
      
      <div className="relative pt-2 pb-6">
        <Slider
          min={min}
          max={max}
          step={step}
          value={[value]}
          onValueChange={(val) => setInputValue(id, val[0])}
          className="my-2"
        />
        
        {/* Notch for current govt value */}
        <div 
          className="absolute top-1.5 w-3 h-3 bg-foreground transform -translate-x-1/2 rotate-45 pointer-events-none" 
          style={{ left: `${((currentGovtValue - min) / (max - min)) * 100}%` }}
          title={`Current Official Value: ${currentGovtValue}${unit}`}
        />
        
        <div className="flex justify-between absolute bottom-0 w-full text-xs text-muted-foreground">
          <span>{min}{unit}</span>
          <span>{max}{unit}</span>
        </div>
      </div>
    </div>
  );
}
