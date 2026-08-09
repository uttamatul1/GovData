import { useMemo } from 'react';
import { reportsData } from '../data';

export function useReportCalendar() {
  return useMemo(() => {
    return [...reportsData].sort((a, b) => {
      // Sort by next expected date ascending
      return new Date(a.nextExpected).getTime() - new Date(b.nextExpected).getTime();
    });
  }, []);
}
