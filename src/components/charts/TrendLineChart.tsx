import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import type { DataPoint } from '../../types';
import { formatValue } from '../../utils/format.utils';

interface TrendLineChartProps {
  data: DataPoint[];
  nationalData?: DataPoint[];
  color: string;
  unit: string;
  higherIsBetter: boolean;
}

export function TrendLineChart({ data, nationalData, color, unit }: TrendLineChartProps) {
  // Merge state data and national data by year
  const years = Array.from(new Set([...data.map(d => d.year), ...(nationalData || []).map(d => d.year)])).sort();
  
  const chartData = years.map(year => {
    const statePoint = data.find(d => d.year === year);
    const nationalPoint = nationalData?.find(d => d.year === year);
    return {
      year,
      stateValue: statePoint?.value ?? null,
      nationalValue: nationalPoint?.value ?? null,
    };
  });

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="year" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            tickFormatter={(val) => formatValue(val)}
          />
          <RechartsTooltip 
            contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', background: 'hsl(var(--background))' }}
            labelStyle={{ fontWeight: 'bold', color: 'hsl(var(--foreground))', marginBottom: '4px' }}
            formatter={(value: number, name: string) => [
              value !== null ? `${formatValue(value)} ${unit}` : '-',
              name === 'nationalValue' ? 'National Average' : 'State Value'
            ]}
          />
          
          {nationalData && (
            <Line 
              type="monotone" 
              dataKey="nationalValue" 
              name="nationalValue"
              stroke="hsl(var(--muted-foreground))" 
              strokeWidth={2} 
              strokeDasharray="5 5" 
              dot={false}
              activeDot={{ r: 4 }}
              connectNulls
            />
          )}
          
          <Line 
            type="monotone" 
            dataKey="stateValue" 
            name="stateValue"
            stroke={color} 
            strokeWidth={3} 
            dot={{ r: 4, strokeWidth: 2, fill: 'hsl(var(--background))' }}
            activeDot={{ r: 6, strokeWidth: 0 }}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
