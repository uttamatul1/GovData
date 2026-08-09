import { useMemo } from 'react';
import { reportsData } from '../data';
import { TimelineEvent } from '../components/timeline/TimelineEvent';
import { DataDisclaimer } from '../components/shared/DataDisclaimer';

export function TimelinePage() {
  const allEvents = useMemo(() => {
    const events = [];
    for (const report of reportsData) {
      for (const history of report.history) {
        events.push({
          reportName: report.name,
          sectors: report.sector,
          event: history
        });
      }
    }
    // Sort descending by year
    return events.sort((a, b) => b.event.year - a.event.year);
  }, []);

  return (
    <div className="flex-1 flex flex-col h-full bg-background">
      <div className="container mx-auto px-4 py-6 flex-1 flex flex-col">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Report Timeline</h2>
          <p className="text-muted-foreground">
            A chronological view of major government surveys, censuses, and statistical releases.
          </p>
        </div>

        <div className="max-w-4xl mx-auto w-full pb-8 pt-4 pl-4 pr-2">
          {allEvents.map((item, index) => (
            <TimelineEvent 
              key={`${item.reportName}-${item.event.year}-${index}`}
              reportName={item.reportName}
              sectors={item.sectors}
              event={item.event}
            />
          ))}
          
          {allEvents.length === 0 && (
            <div className="text-center text-muted-foreground py-12">
              No historical data events found.
            </div>
          )}
        </div>
      </div>
      <DataDisclaimer />
    </div>
  );
}
