import React from 'react';
import {
  Star,
  Download,
  GitFork,
  GitPullRequest,
  AlertCircle,
  MessageSquare,
  ExternalLink,
  ChevronRight,
  Lock,
  GitCommit,
} from 'lucide-react';
import { RepoDetailedStats } from '../../types/stats';
import { Badge } from '../common/Badge';

interface RepoListCardProps {
  stats: RepoDetailedStats;
  onSelect: () => void;
  compact?: boolean;
}

export const RepoListCard: React.FC<RepoListCardProps> = ({
  stats,
  onSelect,
  compact = false,
}) => {
  const { repo, totalDownloads, openPullRequestsCount, openIssuesCount, discussionsCount } = stats;

  const getLanguageColor = (lang: string | null) => {
    switch (lang) {
      case 'Rust': return 'orange';
      case 'TypeScript': return 'blue';
      case 'JavaScript': return 'orange';
      case 'Kotlin': return 'purple';
      case 'Go': return 'cyan';
      case 'Python': return 'blue';
      default: return 'gray';
    }
  };

  return (
    <div
      onClick={onSelect}
      className="group relative bg-gh-surface/70 hover:bg-gh-surface border border-gh-border/70 hover:border-gh-blue/40 rounded-2xl p-4 sm:p-5 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-glow-blue/20 backdrop-blur-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <img
            src={repo.owner.avatar_url}
            alt={repo.owner.login}
            className="w-10 h-10 rounded-xl border border-gh-border/60 flex-shrink-0"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-semibold text-gh-text group-hover:text-gh-blue transition-colors truncate">
                {repo.name}
              </h3>
              {repo.private ? (
                <Badge variant="red" size="sm" icon={<Lock size={10} />}>
                  Private
                </Badge>
              ) : (
                <Badge variant="gray" size="sm">
                  Public
                </Badge>
              )}
              {repo.language && (
                <Badge variant={getLanguageColor(repo.language)} size="sm">
                  {repo.language}
                </Badge>
              )}
            </div>
            <p className="text-xs text-gh-muted line-clamp-2 mt-1 leading-relaxed">
              {repo.description || 'No description provided.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0 text-gh-muted group-hover:text-gh-blue transition-colors">
          <span className="text-xs hidden sm:inline font-medium">Details</span>
          <ChevronRight size={16} className="transform group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-4 pt-3 border-t border-gh-border/40 text-xs">
        <div className="flex items-center gap-1.5 text-gh-text/90">
          <Star size={13} className="text-gh-blue flex-shrink-0" />
          <span className="font-semibold">{repo.stargazers_count.toLocaleString()}</span>
        </div>

        <div className="flex items-center gap-1.5 text-gh-text/90">
          <Download size={13} className="text-gh-green flex-shrink-0" />
          <span className="font-semibold">{totalDownloads.toLocaleString()}</span>
        </div>

        <div className="flex items-center gap-1.5 text-gh-text/90">
          <GitFork size={13} className="text-gh-pink flex-shrink-0" />
          <span className="font-semibold">{repo.forks_count.toLocaleString()}</span>
        </div>

        <div className="flex items-center gap-1.5 text-gh-text/90">
          <GitPullRequest size={13} className="text-gh-purple flex-shrink-0" />
          <span className="font-semibold">{openPullRequestsCount}</span>
          <span className="text-gh-muted text-[10px]">open PRs</span>
        </div>

        <div className="flex items-center gap-1.5 text-gh-text/90">
          <AlertCircle size={13} className="text-gh-orange flex-shrink-0" />
          <span className="font-semibold">{openIssuesCount}</span>
          <span className="text-gh-muted text-[10px]">issues</span>
        </div>

        <div className="flex items-center gap-1.5 text-gh-text/90">
          <MessageSquare size={13} className="text-gh-cyan flex-shrink-0" />
          <span className="font-semibold">{discussionsCount}</span>
          <span className="text-gh-muted text-[10px]">topics</span>
        </div>
      </div>
    </div>
  );
};
