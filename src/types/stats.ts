import { GitHubRepository, GitHubRelease, CommitActivityWeek, TrafficViewsData, TrafficClonesData, PullRequestSummary, IssueSummary, DiscussionSummary, Contributor, LanguageBytes } from './github';

export interface StarHistoryPoint {
  date: string;
  stars: number;
  user?: {
    login: string;
    avatar_url: string;
  };
}

export interface RepoDetailedStats {
  repo: GitHubRepository;
  releases: GitHubRelease[];
  totalDownloads: number;
  openPullRequestsCount: number;
  closedPullRequestsCount: number;
  mergedPullRequestsCount: number;
  pullRequests: PullRequestSummary[];
  openIssuesCount: number;
  closedIssuesCount: number;
  issues: IssueSummary[];
  discussionsCount: number;
  discussionCommentsCount: number;
  discussions: DiscussionSummary[];
  commitActivity: CommitActivityWeek[];
  totalCommitsLastYear: number;
  trafficViews?: TrafficViewsData | null;
  trafficClones?: TrafficClonesData | null;
  languages: LanguageBytes;
  contributors: Contributor[];
  starHistory?: StarHistoryPoint[];
  lastFetched: number;
}

export interface AggregateStats {
  totalReposTracked: number;
  totalStars: number;
  totalForks: number;
  totalDownloads: number;
  totalOpenIssues: number;
  totalClosedIssues: number;
  totalOpenPRs: number;
  totalMergedPRs: number;
  totalClosedPRs: number;
  totalDiscussions: number;
  totalDiscussionComments: number;
  totalCommitsYear: number;
  totalWatchers: number;
  totalUniqueContributors: number;
  topLanguage: string;
  mostStarredRepo: GitHubRepository | null;
  mostDownloadedRepo: { repo: GitHubRepository; downloads: number } | null;
}

export interface CommitTrendPoint {
  date: string;
  commits: number;
  [repoName: string]: number | string;
}

export interface StarDistributionPoint {
  name: string;
  fullName: string;
  stars: number;
  forks: number;
  downloads: number;
  issues: number;
  prs: number;
  color: string;
}
