import type { Report } from '../../types';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { ExternalLink, Calendar, Compass, History } from 'lucide-react';
import { formatReportDate } from '../../utils/format.utils';
import { useNavigate } from 'react-router-dom';
import { useMapStore } from '../../store/map.store';

export function ReportCard({ report }: { report: Report }) {
  const navigate = useNavigate();
  const { setActiveSector } = useMapStore();

  const handleExplore = (sector: any) => {
    setActiveSector(sector);
    navigate('/');
  };

  const handleTimeline = () => {
    navigate('/timeline');
  };

  return (
    <Card className="flex flex-col h-full hover:shadow-md transition-shadow">
      <CardContent className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start gap-4 mb-3">
          <div>
            <h3 className="font-bold text-lg leading-tight">{report.shortName}</h3>
            <p className="text-sm text-muted-foreground line-clamp-1" title={report.name}>{report.name}</p>
          </div>
          <Badge variant={report.status === 'active' ? 'default' : 'secondary'} className="capitalize">
            {report.status}
          </Badge>
        </div>

        <p className="text-xs text-muted-foreground mb-4 line-clamp-2 flex-1">
          {report.description}
        </p>

        <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs mb-4">
          <div>
            <p className="text-muted-foreground mb-0.5">Issuing Body</p>
            <p className="font-medium truncate" title={report.issuingBody}>{report.issuingBody}</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-0.5">Frequency</p>
            <p className="font-medium capitalize">{report.frequency}</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-0.5">Last Release</p>
            <p className="font-medium flex items-center gap-1">
              <Calendar className="w-3 h-3 text-primary" />
              {formatReportDate(report.lastRelease)}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground mb-0.5">Next Expected</p>
            <p className="font-medium flex items-center gap-1">
              <Calendar className="w-3 h-3 text-muted-foreground" />
              {formatReportDate(report.nextExpected)}
            </p>
          </div>
        </div>

        {/* Action cross-links */}
        <div className="flex items-center gap-2 mb-3 pt-2 border-t text-xs">
          <button
            onClick={() => handleExplore(report.sector[0] || 'health')}
            className="flex-1 inline-flex items-center justify-center gap-1 py-1 px-2 rounded bg-muted/50 hover:bg-primary/10 hover:text-primary transition-colors font-medium text-[11px]"
          >
            <Compass className="w-3 h-3" /> Explore Data
          </button>
          <button
            onClick={handleTimeline}
            className="flex-1 inline-flex items-center justify-center gap-1 py-1 px-2 rounded bg-muted/50 hover:bg-primary/10 hover:text-primary transition-colors font-medium text-[11px]"
          >
            <History className="w-3 h-3" /> Timeline
          </button>
        </div>

        <div className="pt-2 mt-auto border-t flex justify-between items-center">
          <div className="flex gap-1 flex-wrap">
            {report.sector.map((s) => (
              <Badge key={s} variant="outline" className="text-[10px] capitalize px-1.5 py-0">
                {s}
              </Badge>
            ))}
          </div>
          <a
            href={report.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline text-xs flex items-center gap-1 font-medium shrink-0 ml-2"
          >
            Official URL <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
