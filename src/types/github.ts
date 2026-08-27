export interface GitHubUser {
  id: number;
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
  bio: string | null;
  public_repos: number;
  total_private_repos?: number;
  followers: number;
  following: number;
  created_at: string;
}

export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
    avatar_url: string;
    type: string;
  };
  private: boolean;
  html_url: string;
  description: string | null;
  fork: boolean;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string | null;
  topics: string[];
  default_branch: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  size: number;
  license: {
    key: string;
    name: string;
    spdx_id: string;
  } | null;
  permissions?: {
    admin: boolean;
    push: boolean;
    pull: boolean;
  };
}

export interface ReleaseAsset {
  id: number;
  name: string;
  size: number;
  download_count: number;
  created_at: string;
  updated_at: string;
  browser_download_url: string;
  content_type: string;
}

export interface GitHubRelease {
  id: number;
  tag_name: string;
  name: string | null;
  body: string | null;
  draft: boolean;
  prerelease: boolean;
  created_at: string;
  published_at: string;
  html_url: string;
  assets: ReleaseAsset[];
  total_download_count?: number;
}

export interface ThreadComment {
  id: number | string;
  body: string;
  created_at: string;
  user: {
    login: string;
    avatar_url: string;
  };
}

export interface PullRequestSummary {
  id: number;
  number: number;
  title: string;
  body?: string | null;
  state: 'open' | 'closed';
  merged_at: string | null;
  created_at: string;
  closed_at: string | null;
  user: {
    login: string;
    avatar_url: string;
  };
  draft?: boolean;
  commentsCount?: number;
  commentsList?: ThreadComment[];
}

export interface IssueSummary {
  id: number;
  number: number;
  title: string;
  body?: string | null;
  state: 'open' | 'closed';
  comments: number;
  created_at: string;
  closed_at: string | null;
  user: {
    login: string;
    avatar_url: string;
  };
  labels: Array<{
    id: number;
    name: string;
    color: string;
  }>;
  commentsList?: ThreadComment[];
}

export interface DiscussionSummary {
  id: string;
  title: string;
  body?: string | null;
  number: number;
  createdAt: string;
  commentsCount: number;
  category: {
    name: string;
    emoji: string;
  };
  author: {
    login: string;
    avatarUrl: string;
  };
  upvoteCount: number;
  commentsList?: ThreadComment[];
}

export interface CommitActivityWeek {
  days: number[]; // 7 days (Sunday to Saturday)
  total: number;
  week: number; // Unix timestamp
}

export interface TrafficViewDay {
  timestamp: string;
  count: number;
  uniques: number;
}

export interface TrafficViewsData {
  count: number;
  uniques: number;
  views: TrafficViewDay[];
}

export interface TrafficCloneDay {
  timestamp: string;
  count: number;
  uniques: number;
}

export interface TrafficClonesData {
  count: number;
  uniques: number;
  clones: TrafficCloneDay[];
}

export interface LanguageBytes {
  [language: string]: number;
}

export interface Contributor {
  id: number;
  login: string;
  avatar_url: string;
  contributions: number;
  html_url: string;
}

export interface RateLimitStatus {
  limit: number;
  remaining: number;
  reset: number;
  used: number;
}
