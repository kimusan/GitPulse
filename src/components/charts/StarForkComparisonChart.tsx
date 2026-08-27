import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { StarDistributionPoint } from '../../types/stats';

interface StarForkComparisonChartProps {
  data: StarDistributionPoint[];
  compact?: boolean;
}

export const StarForkComparisonChart: React.FC<StarForkComparisonChartProps> = ({
  data,
  compact = false,
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gh-muted text-sm">
        No repository comparison data available
      </div>
    );
  }

  return (
    <div className="w-full bg-gh-surface/80 border border-gh-border/80 rounded-2xl p-4 sm:p-5 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-gh-text flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-gh-blue inline-block" />
            Repository Community Traction
          </h3>
          <p className="text-xs text-gh-muted mt-0.5">
            Comparison of Stars, Forks, and Release Downloads by repository
          </p>
        </div>
      </div>

      <div className="h-72 sm:h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#30363d" vertical={false} />
            <XAxis
              dataKey="name"
              stroke="#8b949e"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              interval={0}
              angle={-90}
              textAnchor="end"
              height={75}
              dx={-4}
              dy={6}
              tickFormatter={(name: string) => name.length > 15 ? `${name.substring(0, 14)}…` : name}
            />
            <YAxis
              stroke="#8b949e"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={value => value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#161b22',
                borderColor: '#30363d',
                borderRadius: '12px',
                color: '#f0f6fc',
                fontSize: '12px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
              }}
              formatter={(val: any) => [Number(val || 0).toLocaleString(), '']}
            />
            <Legend
              wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
              iconType="circle"
            />
            <Bar dataKey="stars" name="Stars" fill="#58a6ff" radius={[4, 4, 0, 0]} />
            <Bar dataKey="forks" name="Forks" fill="#bc8cff" radius={[4, 4, 0, 0]} />
            <Bar dataKey="downloads" name="Downloads" fill="#3fb950" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
