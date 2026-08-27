import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { CommitTrendPoint } from '../../types/stats';

interface CommitActivityChartProps {
  data: CommitTrendPoint[];
  compact?: boolean;
}

export const CommitActivityChart: React.FC<CommitActivityChartProps> = ({
  data,
  compact = false,
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gh-muted text-sm">
        No commit trend activity data available
      </div>
    );
  }

  return (
    <div className="w-full bg-gh-surface/80 border border-gh-border/80 rounded-2xl p-4 sm:p-5 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-gh-text flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-gh-green inline-block animate-pulse" />
            Commit Activity Velocity (Weekly)
          </h3>
          <p className="text-xs text-gh-muted mt-0.5">
            Total code pushes across tracked repositories over the last 12 weeks
          </p>
        </div>
      </div>

      <div className="h-60 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="commitGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3fb950" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3fb950" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#30363d" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="#8b949e"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#8b949e"
              fontSize={11}
              tickLine={false}
              axisLine={false}
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
              labelStyle={{ fontWeight: 'bold', color: '#58a6ff' }}
            />
            <Area
              type="monotone"
              dataKey="commits"
              name="Commits"
              stroke="#3fb950"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#commitGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
