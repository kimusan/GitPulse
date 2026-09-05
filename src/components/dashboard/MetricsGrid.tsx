import React from 'react';
import {
  Star,
  Download,
  GitPullRequest,
  AlertCircle,
  MessageSquare,
  GitFork,
  GitCommit,
  Eye,
  Users,
  Code2,
  Bookmark,
  Share2,
} from 'lucide-react';
import { StatCard } from './StatCard';
import { AggregateStats } from '../../types/stats';
import { VisibleMetricsConfig } from '../../types/config';

interface MetricsGridProps {
  stats: AggregateStats;
  visibleMetrics: VisibleMetricsConfig;
  compact?: boolean;
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({
  stats,
  visibleMetrics,
  compact = false,
}) => {
  const prMergeRate =
    stats.totalOpenPRs + stats.totalMergedPRs + stats.totalClosedPRs > 0
      ? Math.round(
          (stats.totalMergedPRs /
            (stats.totalOpenPRs + stats.totalMergedPRs + stats.totalClosedPRs)) *
            100
        )
      : 0;

  const issueResolutionRate =
    stats.totalOpenIssues + stats.totalClosedIssues > 0
      ? Math.round(
          (stats.totalClosedIssues /
            (stats.totalOpenIssues + stats.totalClosedIssues)) *
            100
        )
      : 0;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
      {visibleMetrics.stars && (
        <StatCard
          title="Total Stars"
          value={stats.totalStars}
          subtitle={`Across ${stats.totalReposTracked} repositories`}
          icon={Star}
          color="blue"
          compact={compact}
          trend={{ value: '+8.4%', positive: true }}
        />
      )}

      {visibleMetrics.downloads && (
        <StatCard
          title="Release Downloads"
          value={stats.totalDownloads}
          subtitle={
            stats.mostDownloadedRepo
              ? `Top: ${stats.mostDownloadedRepo.repo.name}`
              : 'All binary releases'
          }
          icon={Download}
          color="green"
          compact={compact}
          trend={{ value: '+14.2%', positive: true }}
        />
      )}

      {visibleMetrics.pullRequests && (
        <StatCard
          title="Pull Requests"
          value={stats.totalOpenPRs + stats.totalMergedPRs}
          subtitle={`${stats.totalOpenPRs} open · ${stats.totalMergedPRs} merged (${prMergeRate}%)`}
          icon={GitPullRequest}
          color="purple"
          compact={compact}
        />
      )}

      {visibleMetrics.issues && (
        <StatCard
          title="Issues Velocity"
          value={stats.totalOpenIssues}
          subtitle={`${stats.totalClosedIssues} resolved (${issueResolutionRate}%)`}
          icon={AlertCircle}
          color="orange"
          compact={compact}
        />
      )}

      {visibleMetrics.discussions && (
        <StatCard
          title="Discussions"
          value={stats.totalDiscussions}
          subtitle={`${stats.totalDiscussionComments} community replies`}
          icon={MessageSquare}
          color="cyan"
          compact={compact}
        />
      )}

      {visibleMetrics.forks && (
        <StatCard
          title="Total Forks"
          value={stats.totalForks}
          subtitle={`${stats.totalWatchers} watchers`}
          icon={GitFork}
          color="pink"
          compact={compact}
        />
      )}

      {visibleMetrics.commitVelocity && (
        <StatCard
          title="Commits (1 Year)"
          value={stats.totalCommitsYear}
          subtitle="Annual code velocity"
          icon={GitCommit}
          color="green"
          compact={compact}
        />
      )}

      {visibleMetrics.topContributors && (
        <StatCard
          title="Contributors"
          value={stats.totalUniqueContributors}
          subtitle={`Top Language: ${stats.topLanguage}`}
          icon={Users}
          color="purple"
          compact={compact}
        />
      )}
    </div>
  );
};
