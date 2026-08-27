import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { GitHubRelease } from '../../types/github';
import { Download, Package } from 'lucide-react';

interface RepoReleaseDownloadsChartProps {
  releases: GitHubRelease[];
}

export const RepoReleaseDownloadsChart: React.FC<RepoReleaseDownloadsChartProps> = ({ releases }) => {
  if (!releases || releases.length === 0) {
    return (
      <div className="w-full bg-gh-surface/80 border border-gh-border/80 rounded-2xl p-4 sm:p-5 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2.5 h-2.5 rounded-full bg-gh-green inline-block" />
          <h3 className="text-sm font-semibold text-gh-text">Total Downloads per Release</h3>
        </div>
        <div className="py-6 flex flex-col items-center justify-center text-center text-gh-muted space-y-2 bg-gh-card/20 rounded-xl border border-gh-border/40">
          <Package size={28} className="text-gh-muted/60" />
          <p className="text-xs font-medium">No published releases found for this repository.</p>
        </div>
      </div>
    );
  }

  // Map and sort releases chronologically
  const sortedReleases = [...releases].sort((a, b) => {
    const timeA = new Date(a.published_at || a.created_at).getTime();
    const timeB = new Date(b.published_at || b.created_at).getTime();
    return timeA - timeB;
  });

  let runningCumulative = 0;
  const data = sortedReleases.map(rel => {
    const assetDownloads = (rel.assets || []).reduce((acc, a) => acc + (a.download_count || 0), 0);
    const releaseDownloads = rel.total_download_count || assetDownloads || 0;
    runningCumulative += releaseDownloads;

    return {
      name: rel.tag_name,
      'Release Downloads': releaseDownloads,
      'Cumulative Downloads': runningCumulative,
      assetsCount: rel.assets?.length || 0,
      publishedAt: new Date(rel.published_at || rel.created_at).toLocaleDateString(),
    };
  });

  const totalDownloads = data.reduce((acc, curr) => acc + curr['Release Downloads'], 0);

  return (
    <div className="w-full bg-gh-surface/80 border border-gh-border/80 rounded-2xl p-4 sm:p-5 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-gh-text flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-gh-green inline-block" />
            Total Downloads per Release
          </h3>
          <p className="text-xs text-gh-muted mt-0.5">
            {totalDownloads.toLocaleString()} total downloads across {releases.length} release tags (similar to traffic telemetry)
          </p>
        </div>
      </div>

      <div className="h-60 sm:h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="releaseDlGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3fb950" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#3fb950" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="cumDlGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#58a6ff" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#58a6ff" stopOpacity={0.0} />
              </linearGradient>
            </defs>
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
              tickFormatter={value => (value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value)}
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
              formatter={(val: any, name: any) => [
                `${Number(val || 0).toLocaleString()} downloads`,
                name || 'Downloads',
              ]}
            />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} iconType="circle" />
            <Area
              type="monotone"
              dataKey="Release Downloads"
              stroke="#3fb950"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#releaseDlGradient)"
              dot={{ r: 4, fill: '#3fb950' }}
              activeDot={{ r: 6 }}
            />
            <Area
              type="monotone"
              dataKey="Cumulative Downloads"
              stroke="#58a6ff"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              fillOpacity={1}
              fill="url(#cumDlGradient)"
              dot={{ r: 3, fill: '#58a6ff' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
