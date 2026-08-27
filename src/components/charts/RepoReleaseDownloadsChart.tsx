import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { GitHubRelease } from '../../types/github';

interface RepoReleaseDownloadsChartProps {
  releases: GitHubRelease[];
}

export const RepoReleaseDownloadsChart: React.FC<RepoReleaseDownloadsChartProps> = ({ releases }) => {
  if (!releases || releases.length === 0) {
    return null;
  }

  const data = [...releases]
    .map(rel => ({
      name: rel.tag_name,
      downloads: rel.total_download_count || 0,
      assetsCount: rel.assets?.length || 0,
      publishedAt: new Date(rel.published_at || rel.created_at).toLocaleDateString(),
    }))
    .reverse(); // Show oldest to newest or by release order

  const total = data.reduce((acc, curr) => acc + curr.downloads, 0);
  if (total === 0) {
    return null;
  }

  return (
    <div className="w-full bg-gh-surface/80 border border-gh-border/80 rounded-2xl p-4 sm:p-5 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-gh-text flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-gh-green inline-block" />
            Total Downloads per Release
          </h3>
          <p className="text-xs text-gh-muted mt-0.5">
            Cumulative binary asset download trends across published tags ({total.toLocaleString()} total)
          </p>
        </div>
      </div>

      <div className="h-60 sm:h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#30363d" vertical={false} />
            <XAxis
              dataKey="name"
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
              tickFormatter={value => value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#161b22',
                borderColor: '#30363d',
                borderRadius: '12px',
                color: '#f0f6fc',
                fontSize: '12px',
              }}
              formatter={(val: any) => [`${Number(val || 0).toLocaleString()} downloads`, 'Total Downloads']}
            />
            <Bar dataKey="downloads" name="Downloads" fill="#3fb950" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
