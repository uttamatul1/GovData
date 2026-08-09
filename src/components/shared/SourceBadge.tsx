import { Badge } from '../ui/badge';
import { Database } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function SourceBadge({ source }: { source: string }) {
  const navigate = useNavigate();

  if (!source) return null;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate('/reports');
  };

  return (
    <Badge
      variant="outline"
      onClick={handleClick}
      title={`Click to view official report details for ${source}`}
      className="flex items-center gap-1.5 w-fit text-xs text-muted-foreground font-normal hover:border-primary hover:text-primary transition-colors cursor-pointer"
    >
      <Database className="w-3 h-3 text-primary/70" />
      {source}
    </Badge>
  );
}
