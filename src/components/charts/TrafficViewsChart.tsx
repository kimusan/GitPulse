import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { TrafficViewsData } from '../../types/github';

interface TrafficViewsChartProps {
  data: TrafficViewsData;
  repoName: string;
}

export const TrafficViewsChart: React.FC<TrafficViewsChartProps> = ({ data, repoName }) => {
  if (!data || !data.views || data.views.length === 0) {
    return null;
  }

  const formattedData = data.views.map(v => {
    const d = new Date(v.timestamp);
    return {
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      Views: v.count,
      'Unique Visitors': v.uniques,
    };
  });

  return (
    <div className="w-full bg-gh-surface/80 border border-gh-border/80 rounded-2xl p-4 sm:p-5 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-gh-text flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-gh-cyan inline-block" />
            Traffic Views & Unique Visitors ({repoName})
          </h3>
          <p className="text-xs text-gh-muted mt-0.5">
            Total {data.count.toLocaleString()} views · {data.uniques.toLocaleString()} unique visitors (14-day history)
          </p>
        </div>
      </div>

      <div className="h-56 sm:h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#30363d" vertical={false} />
            <XAxis dataKey="date" stroke="#8b949e" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="#8b949e" fontSize={11} tickLine={false} axisLine={false} />
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
            <Line type="monotone" dataKey="Views" stroke="#39c5cf" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="Unique Visitors" stroke="#58a6ff" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
