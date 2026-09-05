import React, { useState } from 'react';
import {
  X,
  Star,
  Download,
  GitFork,
  GitPullRequest,
  AlertCircle,
  MessageSquare,
  ExternalLink,
  Code2,
  Users,
  Eye,
  Calendar,
  Layers,
  Sparkles,
  CheckCircle2,
  Clock,
  Tag,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  ThumbsUp,
  Filter,
  RefreshCw,
} from 'lucide-react';
import { RepoDetailedStats } from '../../types/stats';
import { ThreadComment } from '../../types/github';
import { Badge } from '../common/Badge';
import { ReleasesTable } from './ReleasesTable';
import { LanguageDistributionChart } from '../charts/LanguageDistributionChart';
import { TrafficViewsChart } from '../charts/TrafficViewsChart';
import { RepoReleaseDownloadsChart } from '../charts/RepoReleaseDownloadsChart';
import { RepoCommitChart } from '../charts/RepoCommitChart';
import { RepoPrIssueFlowChart } from '../charts/RepoPrIssueFlowChart';
import { parseEmoji } from '../common/emojiParser';
import { GitHubApiService } from '../../services/githubApi';
import clsx from 'clsx';

interface RepoDetailModalProps {
  stats: RepoDetailedStats;
  onClose: () => void;
  onRefreshRepo?: (repoId: number) => void;
  isRefreshing?: boolean;
}

type DetailTab = 'overview' | 'releases' | 'pulls' | 'issues' | 'discussions' | 'contributors';
type PRFilterType = 'all' | 'open' | 'merged';
type IssueFilterType = 'all' | 'open' | 'closed';

export const RepoDetailModal: React.FC<RepoDetailModalProps> = ({
  stats,
  onClose,
  onRefreshRepo,
  isRefreshing = false,
}) => {
  const [activeTab, setActiveTab] = useState<DetailTab>('overview');
  const [prFilter, setPrFilter] = useState<PRFilterType>('all');
  const [issueFilter, setIssueFilter] = useState<IssueFilterType>('all');

  // Accordion expansion states
  const [expandedPrIds, setExpandedPrIds] = useState<Set<number>>(new Set());
  const [expandedIssueIds, setExpandedIssueIds] = useState<Set<number>>(new Set());
  const [expandedDiscIds, setExpandedDiscIds] = useState<Set<string>>(new Set());

  // Dynamic comment cache
  const [prComments, setPrComments] = useState<Record<number, ThreadComment[]>>({});
  const [issueComments, setIssueComments] = useState<Record<number, ThreadComment[]>>({});
  const [loadingComments, setLoadingComments] = useState<Record<string, boolean>>({});

  const { repo } = stats;

  const tabs: { id: DetailTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'overview', label: 'Overview', icon: <Layers size={14} /> },
    { id: 'releases', label: 'Releases & Downloads', icon: <Download size={14} />, badge: stats.releases.length },
    { id: 'pulls', label: 'Pull Requests', icon: <GitPullRequest size={14} />, badge: stats.openPullRequestsCount },
    { id: 'issues', label: 'Issues', icon: <AlertCircle size={14} />, badge: stats.openIssuesCount },
    { id: 'discussions', label: 'Discussions', icon: <MessageSquare size={14} />, badge: stats.discussionsCount },
    { id: 'contributors', label: 'Contributors', icon: <Users size={14} />, badge: stats.contributors.length },
  ];

  // Toggle PR Accordion & Fetch Comments
  const togglePrExpand = async (prId: number, prNumber: number) => {
    const next = new Set(expandedPrIds);
    if (next.has(prId)) {
      next.delete(prId);
    } else {
      next.add(prId);
      if (!prComments[prId]) {
        const existing = stats.pullRequests.find(p => p.id === prId);
        if (existing?.commentsList && existing.commentsList.length > 0) {
          setPrComments(prev => ({ ...prev, [prId]: existing.commentsList! }));
        } else {
          setLoadingComments(prev => ({ ...prev, [`pr_${prId}`]: true }));
          try {
            const comments = await GitHubApiService.getPRComments(repo.owner.login, repo.name, prNumber);
            setPrComments(prev => ({ ...prev, [prId]: comments }));
          } finally {
            setLoadingComments(prev => ({ ...prev, [`pr_${prId}`]: false }));
          }
        }
      }
    }
    setExpandedPrIds(next);
  };

  // Toggle Issue Accordion & Fetch Comments
  const toggleIssueExpand = async (issueId: number, issueNumber: number) => {
    const next = new Set(expandedIssueIds);
    if (next.has(issueId)) {
      next.delete(issueId);
    } else {
      next.add(issueId);
      if (!issueComments[issueId]) {
        const existing = stats.issues.find(i => i.id === issueId);
        if (existing?.commentsList && existing.commentsList.length > 0) {
          setIssueComments(prev => ({ ...prev, [issueId]: existing.commentsList! }));
        } else {
          setLoadingComments(prev => ({ ...prev, [`issue_${issueId}`]: true }));
          try {
            const comments = await GitHubApiService.getIssueComments(repo.owner.login, repo.name, issueNumber);
            setIssueComments(prev => ({ ...prev, [issueId]: comments }));
          } finally {
            setLoadingComments(prev => ({ ...prev, [`issue_${issueId}`]: false }));
          }
        }
      }
    }
    setExpandedIssueIds(next);
  };

  // Toggle Discussion Accordion
  const toggleDiscExpand = (discId: string) => {
    const next = new Set(expandedDiscIds);
    if (next.has(discId)) {
      next.delete(discId);
    } else {
      next.add(discId);
    }
    setExpandedDiscIds(next);
  };

  // Filtered PRs
  const filteredPRs = stats.pullRequests.filter(pr => {
    if (prFilter === 'open') return pr.state === 'open';
    if (prFilter === 'merged') return Boolean(pr.merged_at || pr.state === 'closed');
    return true;
  });

  // Filtered Issues
  const filteredIssues = stats.issues.filter(issue => {
    if (issueFilter === 'open') return issue.state === 'open';
    if (issueFilter === 'closed') return issue.state === 'closed';
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md overflow-hidden animate-fade-in">
      <div className="w-full max-w-4xl h-[92vh] bg-gh-surface border border-gh-border rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-slide-up">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-gh-border bg-gh-card/50 flex-shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 min-w-0">
              <img
                src={repo.owner.avatar_url}
                alt={repo.owner.login}
                className="w-12 h-12 rounded-2xl border border-gh-border shadow-sm flex-shrink-0"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg sm:text-xl font-bold text-gh-text truncate">
                    {repo.name}
                  </h2>
                  <Badge variant={repo.private ? 'red' : 'gray'} size="sm">
                    {repo.private ? 'Private' : 'Public'}
                  </Badge>
                  {repo.license && (
                    <Badge variant="blue" size="sm">
                      {repo.license.spdx_id || repo.license.name}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-gh-muted mt-1 line-clamp-2 leading-relaxed">
                  {repo.description || 'No description provided.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {onRefreshRepo && (
                <button
                  onClick={() => onRefreshRepo(repo.id)}
                  disabled={isRefreshing}
                  className="px-3 py-1.5 bg-gh-surface hover:bg-gh-card border border-gh-border text-gh-text rounded-xl transition-all active:scale-95 text-xs font-semibold flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                  title="Refresh statistics for this repository"
                >
                  <RefreshCw size={12} className={clsx(isRefreshing && 'animate-spin text-gh-green')} />
                  <span className="hidden sm:inline">{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
                </button>
              )}
              <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-gh-blue/15 hover:bg-gh-blue text-gh-blue hover:text-white rounded-xl transition-colors text-xs font-semibold flex items-center gap-1.5 shadow-sm"
              >
                GitHub <ExternalLink size={12} />
              </a>
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl text-gh-muted hover:text-gh-text hover:bg-gh-card transition-colors"
                title="Close"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* KPI Snapshot Pills */}
          <div className="flex items-center gap-2 sm:gap-4 mt-4 overflow-x-auto pb-1 text-xs no-scrollbar">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gh-surface border border-gh-border/60">
              <Star size={13} className="text-gh-blue" />
              <span className="font-bold text-gh-text">{repo.stargazers_count.toLocaleString()}</span>
              <span className="text-gh-muted">Stars</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gh-surface border border-gh-border/60">
              <Download size={13} className="text-gh-green" />
              <span className="font-bold text-gh-text">{stats.totalDownloads.toLocaleString()}</span>
              <span className="text-gh-muted">Downloads</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gh-surface border border-gh-border/60">
              <GitFork size={13} className="text-gh-pink" />
              <span className="font-bold text-gh-text">{repo.forks_count.toLocaleString()}</span>
              <span className="text-gh-muted">Forks</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gh-surface border border-gh-border/60">
              <Eye size={13} className="text-gh-purple" />
              <span className="font-bold text-gh-text">{(repo.subscribers_count ?? repo.watchers_count).toLocaleString()}</span>
              <span className="text-gh-muted">Watchers</span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 mt-4 overflow-x-auto border-t border-gh-border/50 pt-3 no-scrollbar">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={clsx(
                  'px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all',
                  activeTab === tab.id
                    ? 'bg-gh-blue text-white shadow-md'
                    : 'text-gh-muted hover:text-gh-text hover:bg-gh-card'
                )}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {typeof tab.badge === 'number' && tab.badge > 0 && (
                  <span
                    className={clsx(
                      'px-1.5 py-0.2 rounded-full text-[10px] font-bold',
                      activeTab === tab.id ? 'bg-white/25 text-white' : 'bg-gh-border text-gh-muted'
                    )}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* 1. OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Release Downloads Plot (Downloads per release tag) */}
              <RepoReleaseDownloadsChart releases={stats.releases} />

              {/* Commit Activity Plot & PR/Issue Flow Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <RepoCommitChart
                  commitActivity={stats.commitActivity}
                  totalCommitsLastYear={stats.totalCommitsLastYear}
                />
                <RepoPrIssueFlowChart
                  openPRs={stats.openPullRequestsCount}
                  mergedPRs={stats.mergedPullRequestsCount + stats.closedPullRequestsCount}
                  openIssues={stats.openIssuesCount}
                  closedIssues={stats.closedIssuesCount}
                />
              </div>

              {/* Language Distribution */}
              {Object.keys(stats.languages).length > 0 && (
                <LanguageDistributionChart languages={stats.languages} />
              )}

              {/* Traffic Views (if available) */}
              {stats.trafficViews && (
                <TrafficViewsChart data={stats.trafficViews} repoName={repo.name} />
              )}

              {/* Repository Metadata Card */}
              <div className="bg-gh-card/50 border border-gh-border rounded-2xl p-4 sm:p-5 text-xs space-y-3">
                <h4 className="font-semibold text-gh-text uppercase tracking-wider text-[11px] text-gh-muted">
                  Repository Specifications
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <span className="text-gh-muted">Default Branch:</span>
                    <p className="font-mono font-semibold text-gh-text mt-0.5">{repo.default_branch}</p>
                  </div>
                  <div>
                    <span className="text-gh-muted">Created:</span>
                    <p className="font-semibold text-gh-text mt-0.5">
                      {new Date(repo.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-gh-muted">Last Pushed:</span>
                    <p className="font-semibold text-gh-text mt-0.5">
                      {new Date(repo.pushed_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-gh-muted">Annual Commits:</span>
                    <p className="font-semibold text-gh-green mt-0.5">
                      {stats.totalCommitsLastYear.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. RELEASES TAB */}
          {activeTab === 'releases' && (
            <div className="space-y-6">
              <RepoReleaseDownloadsChart releases={stats.releases} />
              <ReleasesTable releases={stats.releases} />
            </div>
          )}

          {/* 3. PULL REQUESTS TAB WITH FILTER & ACCORDION UNFOLD */}
          {activeTab === 'pulls' && (
            <div className="space-y-4">
              {/* Filter Bar */}
              <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-gh-border/60">
                <div className="flex items-center gap-1.5">
                  <Filter size={13} className="text-gh-muted" />
                  <span className="text-xs text-gh-muted font-medium">Filter:</span>
                  {(['all', 'open', 'merged'] as const).map(type => (
                    <button
                      key={type}
                      onClick={() => setPrFilter(type)}
                      className={clsx(
                        'px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-colors',
                        prFilter === type
                          ? 'bg-gh-purple text-white shadow-sm'
                          : 'bg-gh-card text-gh-muted hover:text-gh-text border border-gh-border'
                      )}
                    >
                      {type === 'merged' ? 'Merged / Closed' : type}
                      {type === 'all' && ` (${stats.pullRequests.length})`}
                      {type === 'open' && ` (${stats.openPullRequestsCount})`}
                      {type === 'merged' && ` (${stats.mergedPullRequestsCount + stats.closedPullRequestsCount})`}
                    </button>
                  ))}
                </div>
                <span className="text-xs text-gh-muted">
                  Showing {filteredPRs.length} PRs · Click to unfold details & comments
                </span>
              </div>

              {filteredPRs.length === 0 ? (
                <div className="py-8 text-center text-gh-muted text-sm bg-gh-card/30 rounded-xl border border-gh-border/50">
                  No pull requests matching "{prFilter}" filter
                </div>
              ) : (
                <div className="space-y-2.5">
                  {filteredPRs.map(pr => {
                    const isExpanded = expandedPrIds.has(pr.id);
                    const isMerged = Boolean(pr.merged_at || pr.state === 'closed');
                    const commentsList = prComments[pr.id] || pr.commentsList || [];
                    const isLoading = loadingComments[`pr_${pr.id}`];

                    return (
                      <div
                        key={pr.id}
                        className="bg-gh-surface border border-gh-border hover:border-gh-border/90 rounded-2xl overflow-hidden transition-all shadow-sm"
                      >
                        {/* Summary Header (Click to Unfold) */}
                        <div
                          onClick={() => togglePrExpand(pr.id, pr.number)}
                          className="p-3.5 flex items-center justify-between gap-3 cursor-pointer hover:bg-gh-card/40 transition-colors select-none"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <GitPullRequest
                              size={16}
                              className={isMerged ? 'text-gh-purple flex-shrink-0' : 'text-gh-green flex-shrink-0'}
                            />
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-semibold text-gh-text text-sm truncate">{pr.title}</span>
                                <span className="text-gh-muted font-mono text-xs">#{pr.number}</span>
                                <span
                                  className={clsx(
                                    'px-2 py-0.2 rounded-full text-[10px] font-bold border',
                                    isMerged
                                      ? 'bg-gh-purple/15 text-gh-purple border-gh-purple/30'
                                      : 'bg-gh-green/15 text-gh-green border-gh-green/30'
                                  )}
                                >
                                  {isMerged ? 'Merged' : 'Open'}
                                </span>
                              </div>
                              <p className="text-[11px] text-gh-muted mt-0.5">
                                by <strong className="text-gh-text">{pr.user.login}</strong> on{' '}
                                {new Date(pr.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0 text-gh-muted">
                            <span className="text-xs flex items-center gap-1 font-medium">
                              <MessageCircle size={12} /> {pr.commentsCount || commentsList.length || 0}
                            </span>
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </div>
                        </div>

                        {/* Unfolded Details & Thread Comments */}
                        {isExpanded && (
                          <div className="px-4 pb-4 pt-2 border-t border-gh-border/50 bg-gh-card/30 space-y-3 animate-fade-in text-xs">
                            {/* PR Body */}
                            {pr.body && (
                              <div className="p-3 rounded-xl bg-gh-surface border border-gh-border/60 text-gh-text/90 leading-relaxed">
                                <p className="font-semibold text-[11px] text-gh-muted uppercase tracking-wider mb-1">
                                  Description
                                </p>
                                <div className="whitespace-pre-line font-sans">{pr.body}</div>
                              </div>
                            )}

                            {/* Comments Section */}
                            <div>
                              <h5 className="text-[11px] font-semibold text-gh-muted uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                <MessageCircle size={12} className="text-gh-purple" />
                                Discussion & Review Comments ({commentsList.length})
                              </h5>

                              {isLoading ? (
                                <div className="py-4 text-center text-gh-muted text-xs flex items-center justify-center gap-2">
                                  <div className="w-3.5 h-3.5 border-2 border-gh-purple border-t-transparent rounded-full animate-spin" />
                                  Loading comments...
                                </div>
                              ) : commentsList.length === 0 ? (
                                <p className="text-gh-muted italic py-1 text-[11px]">No comments on this pull request yet.</p>
                              ) : (
                                <div className="space-y-2">
                                  {commentsList.map((c, i) => (
                                    <div
                                      key={c.id || i}
                                      className="p-3 rounded-xl bg-gh-surface border border-gh-border/60 space-y-1"
                                    >
                                      <div className="flex items-center justify-between text-[11px] text-gh-muted">
                                        <div className="flex items-center gap-1.5 font-medium text-gh-text">
                                          <img src={c.user.avatar_url} alt="" className="w-4 h-4 rounded-full" />
                                          <span>{c.user.login}</span>
                                        </div>
                                        <span>{new Date(c.created_at).toLocaleDateString()}</span>
                                      </div>
                                      <p className="text-gh-text/90 leading-relaxed whitespace-pre-line text-xs pl-5">
                                        {c.body}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* 4. ISSUES TAB WITH FILTER & ACCORDION UNFOLD */}
          {activeTab === 'issues' && (
            <div className="space-y-4">
              {/* Filter Bar */}
              <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-gh-border/60">
                <div className="flex items-center gap-1.5">
                  <Filter size={13} className="text-gh-muted" />
                  <span className="text-xs text-gh-muted font-medium">Filter:</span>
                  {(['all', 'open', 'closed'] as const).map(type => (
                    <button
                      key={type}
                      onClick={() => setIssueFilter(type)}
                      className={clsx(
                        'px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-colors',
                        issueFilter === type
                          ? 'bg-gh-orange text-white shadow-sm'
                          : 'bg-gh-card text-gh-muted hover:text-gh-text border border-gh-border'
                      )}
                    >
                      {type}
                      {type === 'all' && ` (${stats.issues.length})`}
                      {type === 'open' && ` (${stats.openIssuesCount})`}
                      {type === 'closed' && ` (${stats.closedIssuesCount})`}
                    </button>
                  ))}
                </div>
                <span className="text-xs text-gh-muted">
                  Showing {filteredIssues.length} issues · Click to unfold details & comments
                </span>
              </div>

              {filteredIssues.length === 0 ? (
                <div className="py-8 text-center text-gh-muted text-sm bg-gh-card/30 rounded-xl border border-gh-border/50">
                  No issues matching "{issueFilter}" filter
                </div>
              ) : (
                <div className="space-y-2.5">
                  {filteredIssues.map(issue => {
                    const isExpanded = expandedIssueIds.has(issue.id);
                    const isOpen = issue.state === 'open';
                    const commentsList = issueComments[issue.id] || issue.commentsList || [];
                    const isLoading = loadingComments[`issue_${issue.id}`];

                    return (
                      <div
                        key={issue.id}
                        className="bg-gh-surface border border-gh-border hover:border-gh-border/90 rounded-2xl overflow-hidden transition-all shadow-sm"
                      >
                        {/* Summary Header (Click to Unfold) */}
                        <div
                          onClick={() => toggleIssueExpand(issue.id, issue.number)}
                          className="p-3.5 flex items-center justify-between gap-3 cursor-pointer hover:bg-gh-card/40 transition-colors select-none"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <AlertCircle
                              size={16}
                              className={isOpen ? 'text-gh-orange flex-shrink-0' : 'text-gh-purple flex-shrink-0'}
                            />
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-semibold text-gh-text text-sm truncate">{issue.title}</span>
                                <span className="text-gh-muted font-mono text-xs">#{issue.number}</span>
                                <span
                                  className={clsx(
                                    'px-2 py-0.2 rounded-full text-[10px] font-bold border',
                                    isOpen
                                      ? 'bg-gh-orange/15 text-gh-orange border-gh-orange/30'
                                      : 'bg-gh-purple/15 text-gh-purple border-gh-purple/30'
                                  )}
                                >
                                  {isOpen ? 'Open' : 'Closed'}
                                </span>
                              </div>
                              <p className="text-[11px] text-gh-muted mt-0.5">
                                opened by <strong className="text-gh-text">{issue.user.login}</strong> on{' '}
                                {new Date(issue.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0 text-gh-muted">
                            <span className="text-xs flex items-center gap-1 font-medium">
                              <MessageCircle size={12} /> {issue.comments || commentsList.length || 0}
                            </span>
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </div>
                        </div>

                        {/* Unfolded Details & Thread Comments */}
                        {isExpanded && (
                          <div className="px-4 pb-4 pt-2 border-t border-gh-border/50 bg-gh-card/30 space-y-3 animate-fade-in text-xs">
                            {/* Issue Body */}
                            {issue.body && (
                              <div className="p-3 rounded-xl bg-gh-surface border border-gh-border/60 text-gh-text/90 leading-relaxed">
                                <p className="font-semibold text-[11px] text-gh-muted uppercase tracking-wider mb-1">
                                  Issue Description
                                </p>
                                <div className="whitespace-pre-line font-sans">{issue.body}</div>
                              </div>
                            )}

                            {/* Comments Section */}
                            <div>
                              <h5 className="text-[11px] font-semibold text-gh-muted uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                <MessageCircle size={12} className="text-gh-orange" />
                                Replies & Discussion ({commentsList.length})
                              </h5>

                              {isLoading ? (
                                <div className="py-4 text-center text-gh-muted text-xs flex items-center justify-center gap-2">
                                  <div className="w-3.5 h-3.5 border-2 border-gh-orange border-t-transparent rounded-full animate-spin" />
                                  Loading comments...
                                </div>
                              ) : commentsList.length === 0 ? (
                                <p className="text-gh-muted italic py-1 text-[11px]">No replies on this issue yet.</p>
                              ) : (
                                <div className="space-y-2">
                                  {commentsList.map((c, i) => (
                                    <div
                                      key={c.id || i}
                                      className="p-3 rounded-xl bg-gh-surface border border-gh-border/60 space-y-1"
                                    >
                                      <div className="flex items-center justify-between text-[11px] text-gh-muted">
                                        <div className="flex items-center gap-1.5 font-medium text-gh-text">
                                          <img src={c.user.avatar_url} alt="" className="w-4 h-4 rounded-full" />
                                          <span>{c.user.login}</span>
                                        </div>
                                        <span>{new Date(c.created_at).toLocaleDateString()}</span>
                                      </div>
                                      <p className="text-gh-text/90 leading-relaxed whitespace-pre-line text-xs pl-5">
                                        {c.body}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* 5. DISCUSSIONS TAB WITH PARSED EMOJI & ACCORDION UNFOLD */}
          {activeTab === 'discussions' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-gh-muted mb-2">
                <span>{stats.discussionsCount} Discussion Threads · {stats.discussionCommentsCount} Community Comments</span>
                <span className="text-[11px]">Click discussion to unfold conversation</span>
              </div>
              {stats.discussions.length === 0 ? (
                <div className="py-8 text-center text-gh-muted text-sm bg-gh-card/30 rounded-xl border border-gh-border/50">
                  No discussions found or discussions are not enabled on this repository
                </div>
              ) : (
                stats.discussions.map(disc => {
                  const isExpanded = expandedDiscIds.has(disc.id);
                  const renderedEmoji = parseEmoji(disc.category.emoji);
                  const commentsList = disc.commentsList || [];

                  return (
                    <div
                      key={disc.id}
                      className="bg-gh-surface border border-gh-border hover:border-gh-border/90 rounded-2xl overflow-hidden transition-all shadow-sm"
                    >
                      {/* Summary Header (Click to Unfold) */}
                      <div
                        onClick={() => toggleDiscExpand(disc.id)}
                        className="p-4 flex items-start justify-between gap-3 cursor-pointer hover:bg-gh-card/40 transition-colors select-none text-xs"
                      >
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-2 py-0.5 rounded-md bg-gh-card border border-gh-border text-gh-text font-medium flex items-center gap-1 text-xs">
                              <span>{renderedEmoji}</span>
                              <span>{disc.category.name}</span>
                            </span>
                            <h4 className="font-semibold text-gh-text text-sm truncate">{disc.title}</h4>
                          </div>
                          <p className="text-gh-muted text-[11px]">
                            Started by <strong className="text-gh-text">{disc.author.login}</strong> on{' '}
                            {new Date(disc.createdAt).toLocaleDateString()}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Badge variant="blue" size="sm" icon={<MessageSquare size={11} />}>
                            {disc.commentsCount} comments
                          </Badge>
                          {disc.upvoteCount > 0 && (
                            <Badge variant="orange" size="sm" icon={<ThumbsUp size={11} />}>
                              {disc.upvoteCount}
                            </Badge>
                          )}
                          <div className="text-gh-muted ml-1">
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </div>
                        </div>
                      </div>

                      {/* Unfolded Discussion Body & Thread */}
                      {isExpanded && (
                        <div className="px-4 pb-4 pt-2 border-t border-gh-border/50 bg-gh-card/30 space-y-3 animate-fade-in text-xs">
                          {/* Discussion Body */}
                          {disc.body && (
                            <div className="p-3 rounded-xl bg-gh-surface border border-gh-border/60 text-gh-text/90 leading-relaxed">
                              <p className="font-semibold text-[11px] text-gh-muted uppercase tracking-wider mb-1">
                                Topic Overview
                              </p>
                              <div className="whitespace-pre-line font-sans">{disc.body}</div>
                            </div>
                          )}

                          {/* Comments / Replies Thread */}
                          <div>
                            <h5 className="text-[11px] font-semibold text-gh-muted uppercase tracking-wider mb-2 flex items-center gap-1.5">
                              <MessageSquare size={12} className="text-gh-cyan" />
                              Replies & Feedback ({commentsList.length})
                            </h5>

                            {commentsList.length === 0 ? (
                              <p className="text-gh-muted italic py-1 text-[11px]">No community replies in this thread yet.</p>
                            ) : (
                              <div className="space-y-2">
                                {commentsList.map((c, i) => (
                                  <div
                                    key={c.id || i}
                                    className="p-3 rounded-xl bg-gh-surface border border-gh-border/60 space-y-1"
                                  >
                                    <div className="flex items-center justify-between text-[11px] text-gh-muted">
                                      <div className="flex items-center gap-1.5 font-medium text-gh-text">
                                        <img src={c.user.avatar_url} alt="" className="w-4 h-4 rounded-full" />
                                        <span>{c.user.login}</span>
                                      </div>
                                      <span>{new Date(c.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-gh-text/90 leading-relaxed whitespace-pre-line text-xs pl-5">
                                      {c.body}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* 6. CONTRIBUTORS TAB */}
          {activeTab === 'contributors' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {stats.contributors.map(c => (
                <div
                  key={c.id}
                  className="p-3 bg-gh-surface border border-gh-border rounded-2xl flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={c.avatar_url}
                      alt={c.login}
                      className="w-10 h-10 rounded-xl border border-gh-border"
                    />
                    <div>
                      <h4 className="text-sm font-semibold text-gh-text">{c.login}</h4>
                      <p className="text-xs text-gh-green font-medium">
                        {c.contributions.toLocaleString()} contributions
                      </p>
                    </div>
                  </div>
                  {c.html_url && (
                    <a
                      href={c.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg text-gh-muted hover:text-gh-blue"
                    >
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
