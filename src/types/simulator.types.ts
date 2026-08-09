export interface SimulatorInput {
  id: string;
  label: string;
  unit: string;
  currentGovtValue: number;
  min: number;
  max: number;
  step: number;
  capReason: string;       // Tooltip explaining the cap
  sourceForCurrentValue: string;
}

export interface SimulatorOutput {
  id: string;
  label: string;
  unit: string;
  currentValue: number;
  simulatedValue: number;
  source: string;
  methodNote: string;      // What regression/relationship drives this output
}

export interface SimulatorModule {
  id: string;
  title: string;
  description: string;
  inputs: SimulatorInput[];
  outputs: SimulatorOutput[];
}
