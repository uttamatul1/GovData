import { Info } from 'lucide-react';

export function DataDisclaimer() {
  return (
    <div className="bg-muted/50 border-t p-4 mt-auto">
      <div className="container mx-auto flex items-start gap-3 text-sm text-muted-foreground">
        <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <p>
          Data sourced from official Government of India publications. Historical values are as published. 
          Simulated projections are approximate and not official government estimates.
        </p>
      </div>
    </div>
  );
}
