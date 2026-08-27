import React from 'react';
import {
  Star,
  Download,
  GitFork,
  GitPullRequest,
  AlertCircle,
  MessageSquare,
  GitCommit,
  Layers,
  Code2,
} from 'lucide-react';
import { RepoDetailedStats } from '../../types/stats';
import { Badge } from '../common/Badge';

interface ComparisonViewProps {
  statsMap: Record<number, RepoDetailedStats>;
  onSelectRepo: (id: number) => void;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({
  statsMap,
  onSelectRepo,
}) => {
  const repoList = Object.values(statsMap);

  if (repoList.length === 0) {
    return (
      <div className="py-16 text-center text-gh-muted text-sm bg-gh-surface/40 rounded-2xl border border-gh-border/60">
        <Layers size={32} className="mx-auto mb-2 opacity-50" />
        Select at least 2 repositories in settings to compare them side-by-side
      </div>
    );
  }

  // Max values for visual progress bars
  const maxStars = Math.max(...repoList.map(r => r.repo.stargazers_count), 1);
  const maxDownloads = Math.max(...repoList.map(r => r.totalDownloads), 1);
  const maxForks = Math.max(...repoList.map(r => r.repo.forks_count), 1);
  const maxCommits = Math.max(...repoList.map(r => r.totalCommitsLastYear), 1);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-base sm:text-lg font-bold text-gh-text flex items-center gap-2">
          <Layers size={18} className="text-gh-purple" />
          Side-by-Side Repository Comparison
        </h2>
        <p className="text-xs text-gh-muted mt-0.5">
          Benchmarking community traction and velocity across {repoList.length} tracked repositories
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {repoList.map(st => {
          const { repo, totalDownloads, openPullRequestsCount, openIssuesCount, discussionsCount, totalCommitsLastYear } = st;

          return (
            <div
              key={repo.id}
              onClick={() => onSelectRepo(repo.id)}
              className="bg-gh-surface border border-gh-border hover:border-gh-blue/50 rounded-2xl p-4 sm:p-5 transition-all cursor-pointer shadow-sm hover:shadow-glow-blue/20 flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={repo.owner.avatar_url}
                    alt={repo.owner.login}
                    className="w-9 h-9 rounded-xl border border-gh-border"
                  />
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-gh-text truncate hover:text-gh-blue">
                      {repo.name}
                    </h3>
                    <p className="text-xs text-gh-muted truncate">
                      {repo.language || 'Multi-language'}
                    </p>
                  </div>
                </div>

                {/* Progress Metric Bars */}
                <div className="space-y-3 pt-2 text-xs">
                  {/* Stars Bar */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="flex items-center gap-1 text-gh-muted">
                        <Star size={12} className="text-gh-blue" /> Stars
                      </span>
                      <strong className="text-gh-text">{repo.stargazers_count.toLocaleString()}</strong>
                    </div>
                    <div className="h-1.5 w-full bg-gh-card rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gh-blue rounded-full transition-all duration-500"
                        style={{ width: `${(repo.stargazers_count / maxStars) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Downloads Bar */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="flex items-center gap-1 text-gh-muted">
                        <Download size={12} className="text-gh-green" /> Downloads
                      </span>
                      <strong className="text-gh-green">{totalDownloads.toLocaleString()}</strong>
                    </div>
                    <div className="h-1.5 w-full bg-gh-card rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gh-green rounded-full transition-all duration-500"
                        style={{ width: `${(totalDownloads / maxDownloads) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Forks Bar */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="flex items-center gap-1 text-gh-muted">
                        <GitFork size={12} className="text-gh-pink" /> Forks
                      </span>
                      <strong className="text-gh-text">{repo.forks_count.toLocaleString()}</strong>
                    </div>
                    <div className="h-1.5 w-full bg-gh-card rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gh-pink rounded-full transition-all duration-500"
                        style={{ width: `${(repo.forks_count / maxForks) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Annual Commits Bar */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="flex items-center gap-1 text-gh-muted">
                        <GitCommit size={12} className="text-gh-purple" /> Commits (Year)
                      </span>
                      <strong className="text-gh-text">{totalCommitsLastYear.toLocaleString()}</strong>
                    </div>
                    <div className="h-1.5 w-full bg-gh-card rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gh-purple rounded-full transition-all duration-500"
                        style={{ width: `${(totalCommitsLastYear / maxCommits) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Stats */}
              <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-gh-border/40 text-center text-xs">
                <div className="p-1.5 rounded-lg bg-gh-card/50">
                  <span className="text-gh-muted text-[10px] block">Open PRs</span>
                  <strong className="text-gh-purple font-semibold">{openPullRequestsCount}</strong>
                </div>
                <div className="p-1.5 rounded-lg bg-gh-card/50">
                  <span className="text-gh-muted text-[10px] block">Issues</span>
                  <strong className="text-gh-orange font-semibold">{openIssuesCount}</strong>
                </div>
                <div className="p-1.5 rounded-lg bg-gh-card/50">
                  <span className="text-gh-muted text-[10px] block">Discussions</span>
                  <strong className="text-gh-cyan font-semibold">{discussionsCount}</strong>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
