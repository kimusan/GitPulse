import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';
import { RepoDetailedStats } from '../../types/stats';

interface DownloadsBreakdownChartProps {
  statsMap: Record<number, RepoDetailedStats>;
}

export const DownloadsBreakdownChart: React.FC<DownloadsBreakdownChartProps> = ({ statsMap }) => {
  const data = Object.values(statsMap)
    .filter(st => st.totalDownloads > 0)
    .map(st => ({
      name: st.repo.name,
      downloads: st.totalDownloads,
    }))
    .sort((a, b) => b.downloads - a.downloads);

  const COLORS = ['#3fb950', '#58a6ff', '#bc8cff', '#d29922', '#f85149', '#39c5cf'];

  if (data.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-gh-surface/80 border border-gh-border/80 rounded-2xl p-4 sm:p-5 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-sm font-semibold text-gh-text flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-gh-green inline-block" />
            Release Downloads Distribution
          </h3>
          <p className="text-xs text-gh-muted mt-0.5">
            Share of binary asset downloads across projects
          </p>
        </div>
      </div>

      <div className="h-56 sm:h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="downloads"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={4}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#161b22',
                borderColor: '#30363d',
                borderRadius: '12px',
                color: '#f0f6fc',
                fontSize: '12px',
              }}
              formatter={(val: any) => [`${Number(val || 0).toLocaleString()} downloads`, '']}
            />
            <Legend
              wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
              iconType="circle"
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
