import type { ReportEvent, Sector } from '../../types';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { CheckCircle2 } from 'lucide-react';

interface TimelineEventProps {
  event: ReportEvent;
  reportName: string;
  sectors: Sector[];
}

export function TimelineEvent({ event, reportName, sectors }: TimelineEventProps) {
  return (
    <div className="flex gap-4 relative">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold border-2 border-background z-10 shrink-0">
          {event.year}
        </div>
        <div className="w-0.5 bg-border h-full absolute top-12 left-6 -translate-x-1/2" />
      </div>
      
      <Card className="flex-1 mb-8">
        <CardContent className="p-5">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
            <div>
              <h3 className="font-bold text-lg">{event.title}</h3>
              <p className="text-muted-foreground">{reportName} {event.round ? `• ${event.round}` : ''}</p>
            </div>
            <div className="flex flex-wrap gap-1">
              {sectors.map(s => (
                <Badge key={s} variant="secondary" className="capitalize">
                  {s}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-foreground">Key Findings:</h4>
            <ul className="space-y-1">
              {event.keyFindings.map((finding, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>{finding}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {(event.sampleSize || event.geographicCoverage) && (
            <div className="mt-4 pt-4 border-t flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground">
              {event.sampleSize && (
                <p><strong className="font-medium">Sample Size:</strong> {event.sampleSize}</p>
              )}
              {event.geographicCoverage && (
                <p><strong className="font-medium">Coverage:</strong> {event.geographicCoverage}</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
