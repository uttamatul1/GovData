import { format, parseISO, differenceInDays } from 'date-fns';

export function formatValue(value: number, unit?: string) {
  if (value === null || value === undefined) return '-';
  const formatted = new Intl.NumberFormat('en-IN').format(value);
  return unit ? `${formatted} ${unit}` : formatted;
}

export function formatReportDate(isoString: string) {
  return format(parseISO(isoString), 'MMM yyyy');
}

export function daysUntil(isoString: string) {
  return differenceInDays(parseISO(isoString), new Date());
}
