import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { reportsData } from '../data';
import { ReportCard } from '../components/reports/ReportCard';
import { TimelineEvent } from '../components/timeline/TimelineEvent';
import { DataDisclaimer } from '../components/shared/DataDisclaimer';
import { Input } from '../components/ui/input';
import { Search, FileText, CalendarClock } from 'lucide-react';
import { cn } from '../lib/utils';

export function ReportsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeView = searchParams.get('view') === 'timeline' ? 'timeline' : 'reports';

  const [search, setSearch] = useState('');

  const setView = (view: 'reports' | 'timeline') => {
    setSearchParams(view === 'timeline' ? { view: 'timeline' } : {});
  };

  const filteredReports = reportsData.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.shortName.toLowerCase().includes(search.toLowerCase()) ||
      r.ministry.toLowerCase().includes(search.toLowerCase())
  );

  const allTimelineEvents = reportsData.flatMap((report) =>
    report.history.map((history) => ({
      reportName: report.name,
      sectors: report.sector,
      event: history,
    }))
  ).sort((a, b) => b.event.year - a.event.year);

  return (
    <div className="flex-1 flex flex-col h-full bg-background">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 flex-1 flex flex-col">
        {/* Header with Title & Sub-tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4 sm:mb-6">
          <div>
            <h2 className="text-xl sm:text-3xl font-bold mb-1">Reports & Timeline</h2>
            <p className="text-muted-foreground text-xs sm:text-sm">
              Comprehensive repository of official government publications, censuses, surveys, and chronological release milestones.
            </p>
          </div>

          {/* Sub-tab view toggle */}
          <div className="inline-flex items-center p-1 bg-muted rounded-lg w-full sm:w-auto justify-center shrink-0">
            <button
              onClick={() => setView('reports')}
              className={cn(
                'flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex-1 sm:flex-initial',
                activeView === 'reports'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <FileText className="w-3.5 h-3.5" /> Reports ({reportsData.length})
            </button>
            <button
              onClick={() => setView('timeline')}
              className={cn(
                'flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex-1 sm:flex-initial',
                activeView === 'timeline'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <CalendarClock className="w-3.5 h-3.5" /> Timeline ({allTimelineEvents.length})
            </button>
          </div>
        </div>

        {/* Content View */}
        {activeView === 'reports' ? (
          <>
            <div className="relative w-full max-w-md mb-6">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search reports by title, acronym, or ministry..."
                className="pl-9 text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
              {filteredReports.map((report) => (
                <ReportCard key={report.id} report={report} />
              ))}

              {filteredReports.length === 0 && (
                <div className="col-span-full py-12 text-center text-muted-foreground">
                  No reports found matching "{search}".
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="max-w-4xl mx-auto w-full pb-8 pt-2">
            {allTimelineEvents.map((item, index) => (
              <TimelineEvent
                key={`${item.reportName}-${item.event.year}-${index}`}
                reportName={item.reportName}
                sectors={item.sectors}
                event={item.event}
              />
            ))}

            {allTimelineEvents.length === 0 && (
              <div className="text-center text-muted-foreground py-12">
                No timeline events available.
              </div>
            )}
          </div>
        )}
      </div>
      <DataDisclaimer />
    </div>
  );
}
