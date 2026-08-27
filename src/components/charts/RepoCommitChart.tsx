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
import { CommitActivityWeek } from '../../types/github';

interface RepoCommitChartProps {
  commitActivity: CommitActivityWeek[];
  totalCommitsLastYear: number;
}

export const RepoCommitChart: React.FC<RepoCommitChartProps> = ({
  commitActivity,
  totalCommitsLastYear,
}) => {
  if (!commitActivity || commitActivity.length === 0) {
    return null;
  }

  // Format last 16 weeks of commit activity
  const recentWeeks = commitActivity.slice(-16);
  const data = recentWeeks.map((w, idx) => {
    const d = new Date(w.week * 1000);
    return {
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      commits: w.total || 0,
    };
  });

  return (
    <div className="w-full bg-gh-surface/80 border border-gh-border/80 rounded-2xl p-4 sm:p-5 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-gh-text flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-gh-purple inline-block" />
            Commit Activity Velocity
          </h3>
          <p className="text-xs text-gh-muted mt-0.5">
            Weekly code pushes over the last 16 weeks ({totalCommitsLastYear.toLocaleString()} annual total)
          </p>
        </div>
      </div>

      <div className="h-56 sm:h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="repoCommitGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#bc8cff" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#bc8cff" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#30363d" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="#8b949e"
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#8b949e"
              fontSize={10}
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
              }}
              formatter={(val: any) => [`${Number(val || 0)} commits`, 'Commits']}
            />
            <Area
              type="monotone"
              dataKey="commits"
              name="Commits"
              stroke="#bc8cff"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#repoCommitGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
