import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { StarHistoryPoint } from '../../types/stats';
import { Star, TrendingUp, Calendar, Sparkles, Award } from 'lucide-react';
import clsx from 'clsx';

interface RepoStarHistoryChartProps {
  starHistory?: StarHistoryPoint[];
  repoName: string;
  totalStars: number;
  createdAt: string;
  compact?: boolean;
}

type TimeRange = 'all' | '1y' | '90d';
type ViewMode = 'cumulative' | 'monthly';

export const RepoStarHistoryChart: React.FC<RepoStarHistoryChartProps> = ({
  starHistory = [],
  repoName,
  totalStars,
  createdAt,
  compact = false,
}) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('cumulative');

  // Format and process points chronologically
  const rawData = useMemo(() => {
    if (!starHistory || starHistory.length === 0) {
      if (totalStars > 0) {
        return [
          { date: createdAt, stars: 0 },
          { date: new Date().toISOString(), stars: totalStars },
        ];
      }
      return [];
    }

    // Sort ascending by timestamp
    const sorted = [...starHistory].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Ensure we start from repo creation
    const points: StarHistoryPoint[] = [];
    if (sorted.length === 0 || sorted[0].stars > 0) {
      points.push({ date: createdAt, stars: 0 });
    }
    points.push(...sorted);

    // Ensure we terminate at current totalStars
    const last = points[points.length - 1];
    if (last && last.stars < totalStars) {
      points.push({ date: new Date().toISOString(), stars: totalStars });
    }

    return points;
  }, [starHistory, totalStars, createdAt]);

  // Filter based on selected time range
  const filteredData = useMemo(() => {
    if (rawData.length === 0) return [];
    if (timeRange === 'all') return rawData;

    const now = Date.now();
    const rangeMs = timeRange === '1y' ? 365 * 86400 * 1000 : 90 * 86400 * 1000;
    const cutoff = now - rangeMs;

    const inRange = rawData.filter(p => new Date(p.date).getTime() >= cutoff);
    if (inRange.length === 0) {
      // Find the last point before cutoff
      const before = rawData.filter(p => new Date(p.date).getTime() < cutoff);
      const startingStars = before.length > 0 ? before[before.length - 1].stars : 0;
      return [
        { date: new Date(cutoff).toISOString(), stars: startingStars },
        { date: new Date().toISOString(), stars: totalStars },
      ];
    }

    // Prepend point at the cutoff boundary to anchor line
    const firstInRange = inRange[0];
    const prevPoints = rawData.filter(p => new Date(p.date).getTime() < cutoff);
    const startStars = prevPoints.length > 0 ? prevPoints[prevPoints.length - 1].stars : 0;

    if (new Date(firstInRange.date).getTime() > cutoff) {
      return [{ date: new Date(cutoff).toISOString(), stars: startStars }, ...inRange];
    }

    return inRange;
  }, [rawData, timeRange, totalStars]);

  // Aggregate monthly additions for bar mode
  const monthlyData = useMemo(() => {
    if (rawData.length <= 1) return [];

    const monthMap: Record<string, { month: string; newStars: number; timestamp: number }> = {};

    for (let i = 1; i < rawData.length; i++) {
      const p = rawData[i];
      const prev = rawData[i - 1];
      const added = Math.max(0, p.stars - prev.stars);
      const d = new Date(p.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });

      if (!monthMap[key]) {
        monthMap[key] = { month: label, newStars: 0, timestamp: d.getTime() };
      }
      monthMap[key].newStars += added;
    }

    const items = Object.values(monthMap).sort((a, b) => a.timestamp - b.timestamp);
    if (timeRange === 'all') return items;

    const rangeMs = timeRange === '1y' ? 365 * 86400 * 1000 : 90 * 86400 * 1000;
    const cutoff = Date.now() - rangeMs;
    return items.filter(m => m.timestamp >= cutoff);
  }, [rawData, timeRange]);

  // Velocity calculations
  const statsSummary = useMemo(() => {
    if (rawData.length === 0) {
      return { last30d: 0, last90d: 0, avgPerMonth: 0, firstStarDate: null };
    }

    const now = Date.now();
    const cutoff30 = now - 30 * 86400 * 1000;
    const cutoff90 = now - 90 * 86400 * 1000;

    const point30 = rawData.filter(p => new Date(p.date).getTime() < cutoff30).pop();
    const point90 = rawData.filter(p => new Date(p.date).getTime() < cutoff90).pop();

    const starsAt30 = point30 ? point30.stars : 0;
    const starsAt90 = point90 ? point90.stars : 0;

    const last30d = Math.max(0, totalStars - starsAt30);
    const last90d = Math.max(0, totalStars - starsAt90);

    const firstStarPoint = rawData.find(p => p.stars > 0);
    const firstDate = firstStarPoint ? new Date(firstStarPoint.date) : new Date(createdAt);
    const monthsActive = Math.max(1, (now - firstDate.getTime()) / (30.4 * 86400 * 1000));
    const avgPerMonth = (totalStars / monthsActive).toFixed(1);

    return {
      last30d,
      last90d,
      avgPerMonth: parseFloat(avgPerMonth),
      firstStarDate: firstDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    };
  }, [rawData, totalStars, createdAt]);

  // Extract recent unique stargazers with avatars
  const recentStargazers = useMemo(() => {
    const withUsers = starHistory.filter(p => p.user && p.user.login);
    const uniqueMap = new Map<string, { login: string; avatar_url: string; date: string }>();

    for (let i = withUsers.length - 1; i >= 0; i--) {
      const u = withUsers[i];
      if (u.user && !uniqueMap.has(u.user.login)) {
        uniqueMap.set(u.user.login, {
          login: u.user.login,
          avatar_url: u.user.avatar_url,
          date: new Date(u.date).toLocaleDateString(),
        });
      }
      if (uniqueMap.size >= 10) break;
    }

    return Array.from(uniqueMap.values());
  }, [starHistory]);

  if (totalStars === 0) {
    return (
      <div className="w-full bg-gh-surface/80 border border-gh-border/80 rounded-2xl p-4 sm:p-5 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-2">
          <Star size={16} className="text-gh-yellow fill-gh-yellow/30" />
          <h3 className="text-sm font-semibold text-gh-text">Stars Over Time</h3>
        </div>
        <div className="py-8 flex flex-col items-center justify-center text-center text-gh-muted space-y-2 bg-gh-card/20 rounded-xl border border-gh-border/40">
          <Star size={32} className="text-gh-yellow/40 stroke-1" />
          <p className="text-xs font-semibold text-gh-text">No stars yet for {repoName}</p>
          <p className="text-[11px] text-gh-muted max-w-sm">
            This repository has 0 stargazers so far. When users star this project on GitHub, its growth curve will appear here.
          </p>
        </div>
      </div>
    );
  }

  // Format data points for AreaChart
  const chartData = filteredData.map(p => {
    const d = new Date(p.date);
    return {
      date: p.date,
      displayDate: d.toLocaleDateString('en-US', {
        month: 'short',
        day: filteredData.length > 30 ? undefined : 'numeric',
        year: 'numeric',
      }),
      tooltipDate: d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      stars: p.stars,
      user: p.user,
    };
  });

  return (
    <div className="w-full bg-gh-surface/80 border border-gh-border/80 rounded-2xl p-4 sm:p-5 backdrop-blur-sm shadow-sm space-y-4">
      {/* Header & Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-gh-yellow/15 border border-gh-yellow/30 text-gh-yellow flex items-center justify-center">
              <Star size={14} className="fill-gh-yellow" />
            </span>
            <h3 className="text-sm font-bold text-gh-text flex items-center gap-2">
              Stars Over Time
              <span className="text-xs px-2 py-0.5 rounded-full bg-gh-yellow/10 border border-gh-yellow/30 text-gh-yellow font-mono font-bold">
                ★ {totalStars.toLocaleString()}
              </span>
            </h3>
          </div>
          <p className="text-xs text-gh-muted mt-0.5">
            Stargazer acquisition momentum and cumulative trajectory
          </p>
        </div>

        {/* View Mode & Time Range Filter */}
        <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-gh-card border border-gh-border rounded-xl p-0.5 text-[11px]">
            <button
              onClick={() => setViewMode('cumulative')}
              className={clsx(
                'px-2.5 py-1 rounded-lg font-semibold transition-colors',
                viewMode === 'cumulative'
                  ? 'bg-gh-yellow text-black shadow-sm'
                  : 'text-gh-muted hover:text-gh-text'
              )}
            >
              Cumulative
            </button>
            <button
              onClick={() => setViewMode('monthly')}
              className={clsx(
                'px-2.5 py-1 rounded-lg font-semibold transition-colors',
                viewMode === 'monthly'
                  ? 'bg-gh-yellow text-black shadow-sm'
                  : 'text-gh-muted hover:text-gh-text'
              )}
            >
              Monthly
            </button>
          </div>

          {/* Time Range Filter */}
          <div className="flex items-center bg-gh-card border border-gh-border rounded-xl p-0.5 text-[11px]">
            {(['all', '1y', '90d'] as const).map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={clsx(
                  'px-2.5 py-1 rounded-lg font-semibold transition-colors uppercase',
                  timeRange === range
                    ? 'bg-gh-blue text-white shadow-sm'
                    : 'text-gh-muted hover:text-gh-text'
                )}
              >
                {range === 'all' ? 'All' : range}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Velocity Metric Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
        <div className="px-3 py-2 rounded-xl bg-gh-card/60 border border-gh-border/50">
          <span className="text-[10px] text-gh-muted font-medium flex items-center gap-1">
            <TrendingUp size={11} className="text-gh-green" /> 30-Day Growth
          </span>
          <p className="font-bold text-gh-text mt-0.5">
            {statsSummary.last30d > 0 ? `+${statsSummary.last30d}` : '0'} stars
          </p>
        </div>

        <div className="px-3 py-2 rounded-xl bg-gh-card/60 border border-gh-border/50">
          <span className="text-[10px] text-gh-muted font-medium flex items-center gap-1">
            <Sparkles size={11} className="text-gh-purple" /> 90-Day Growth
          </span>
          <p className="font-bold text-gh-text mt-0.5">
            {statsSummary.last90d > 0 ? `+${statsSummary.last90d}` : '0'} stars
          </p>
        </div>

        <div className="px-3 py-2 rounded-xl bg-gh-card/60 border border-gh-border/50">
          <span className="text-[10px] text-gh-muted font-medium flex items-center gap-1">
            <Award size={11} className="text-gh-yellow" /> Velocity / Month
          </span>
          <p className="font-bold text-gh-text mt-0.5">
            ~{statsSummary.avgPerMonth} stars/mo
          </p>
        </div>

        <div className="px-3 py-2 rounded-xl bg-gh-card/60 border border-gh-border/50">
          <span className="text-[10px] text-gh-muted font-medium flex items-center gap-1">
            <Calendar size={11} className="text-gh-cyan" /> First Star
          </span>
          <p className="font-bold text-gh-text mt-0.5 truncate">
            {statsSummary.firstStarDate || 'N/A'}
          </p>
        </div>
      </div>

      {/* Main Chart Canvas */}
      <div className={clsx('w-full', compact ? 'h-52' : 'h-64 sm:h-72')}>
        <ResponsiveContainer width="100%" height="100%">
          {viewMode === 'cumulative' ? (
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="starGrowthGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e3b341" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#e3b341" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#30363d" vertical={false} />
              <XAxis
                dataKey="displayDate"
                stroke="#8b949e"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                minTickGap={25}
              />
              <YAxis
                stroke="#8b949e"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                domain={[0, 'auto']}
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
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="p-2.5 space-y-1.5 text-xs bg-gh-surface border border-gh-border rounded-xl shadow-xl">
                        <div className="font-bold text-gh-yellow flex items-center gap-1.5">
                          <Star size={13} className="fill-gh-yellow" />
                          <span>{data.stars.toLocaleString()} Stars</span>
                        </div>
                        <div className="text-[11px] text-gh-muted">{data.tooltipDate}</div>
                        {data.user && (
                          <div className="flex items-center gap-1.5 pt-1 border-t border-gh-border/50 text-[11px] text-gh-text">
                            <img
                              src={data.user.avatar_url}
                              alt={data.user.login}
                              className="w-4 h-4 rounded-full border border-gh-border"
                            />
                            <span>@{data.user.login}</span>
                          </div>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="stars"
                name="Total Stars"
                stroke="#e3b341"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#starGrowthGradient)"
                activeDot={{ r: 5, fill: '#e3b341', stroke: '#ffffff', strokeWidth: 1.5 }}
              />
            </AreaChart>
          ) : (
            <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#30363d" vertical={false} />
              <XAxis
                dataKey="month"
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
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#161b22',
                  borderColor: '#30363d',
                  borderRadius: '12px',
                  color: '#f0f6fc',
                  fontSize: '12px',
                }}
                formatter={(val: any) => [`+${val} stars`, 'New Stars']}
                labelFormatter={(label: any) => `Month: ${label}`}
              />
              <Bar
                dataKey="newStars"
                name="New Stars"
                fill="#e3b341"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Recent Stargazers Avatar Showcase */}
      {recentStargazers.length > 0 && (
        <div className="pt-2 border-t border-gh-border/40 flex items-center justify-between gap-3 text-xs flex-wrap">
          <div className="flex items-center gap-1.5 text-gh-muted text-[11px]">
            <span className="font-semibold text-gh-text">Recent Stargazers:</span>
          </div>
          <div className="flex items-center -space-x-1.5 overflow-hidden py-1">
            {recentStargazers.map(u => (
              <a
                key={u.login}
                href={`https://github.com/${u.login}`}
                target="_blank"
                rel="noopener noreferrer"
                title={`@${u.login} (starred on ${u.date})`}
                className="hover:scale-125 hover:z-10 transition-transform relative"
              >
                <img
                  src={u.avatar_url}
                  alt={u.login}
                  className="w-6 h-6 rounded-full border-2 border-gh-surface shadow-sm object-cover"
                />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
