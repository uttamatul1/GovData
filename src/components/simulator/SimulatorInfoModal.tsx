import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Info, CheckCircle2, TrendingUp, IndianRupee } from 'lucide-react';

interface SimulatorInfoModalProps {
  title: string;
  category: string;
  description: string;
  fundedSchemes: string[];
  simulationLogic: string;
  baselineSource: string;
  isOpen: boolean;
  onClose: () => void;
}

export function SimulatorInfoModal({
  title,
  category,
  description,
  fundedSchemes,
  simulationLogic,
  baselineSource,
  isOpen,
  onClose,
}: SimulatorInfoModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="capitalize text-xs font-semibold">
              {category}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              Policy Simulator Model
            </Badge>
          </div>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Info className="w-5 h-5 text-primary" />
            {title}
          </DialogTitle>
          <DialogDescription className="text-sm pt-1 text-foreground/80 leading-relaxed">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2 border-t mt-3 text-sm">
          {/* Key Funded Programs */}
          {fundedSchemes.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                <IndianRupee className="w-3.5 h-3.5 text-primary" /> Key Programs & Schemes Funded
              </h4>
              <div className="grid grid-cols-1 gap-1.5 bg-muted/30 p-3 rounded-lg border">
                {fundedSchemes.map((scheme, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{scheme}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Simulation Model Logic */}
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-blue-500" /> Simulation Model Elasticity
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed bg-muted/20 p-2.5 rounded border">
              {simulationLogic}
            </p>
          </div>

          {/* Source Attribution */}
          <div className="flex items-center justify-between text-xs pt-1 border-t">
            <span className="text-muted-foreground font-medium">Baseline Data Source</span>
            <span className="font-semibold">{baselineSource}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
