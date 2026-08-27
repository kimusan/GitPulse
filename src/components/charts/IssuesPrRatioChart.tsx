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
import { AggregateStats } from '../../types/stats';

interface IssuesPrRatioChartProps {
  stats: AggregateStats;
}

export const IssuesPrRatioChart: React.FC<IssuesPrRatioChartProps> = ({ stats }) => {
  const data = [
    {
      category: 'Pull Requests',
      Open: stats.totalOpenPRs,
      Merged: stats.totalMergedPRs,
      Closed: stats.totalClosedPRs,
    },
    {
      category: 'Issues',
      Open: stats.totalOpenIssues,
      Closed: stats.totalClosedIssues,
    },
  ];

  return (
    <div className="w-full bg-gh-surface/80 border border-gh-border/80 rounded-2xl p-4 sm:p-5 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-gh-text flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-gh-purple inline-block" />
            PR & Issue Resolution Flow
          </h3>
          <p className="text-xs text-gh-muted mt-0.5">
            Active vs resolved status overview
          </p>
        </div>
      </div>

      <div className="h-56 sm:h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 10, right: 20, left: 30, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#30363d" horizontal={false} />
            <XAxis type="number" stroke="#8b949e" fontSize={11} axisLine={false} tickLine={false} />
            <YAxis
              dataKey="category"
              type="category"
              stroke="#8b949e"
              fontSize={11}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#161b22',
                borderColor: '#30363d',
                borderRadius: '12px',
                color: '#f0f6fc',
                fontSize: '12px',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} iconType="circle" />
            <Bar dataKey="Open" fill="#d29922" stackId="a" radius={[0, 0, 0, 0]} />
            <Bar dataKey="Merged" fill="#bc8cff" stackId="a" radius={[0, 0, 0, 0]} />
            <Bar dataKey="Closed" fill="#3fb950" stackId="a" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
