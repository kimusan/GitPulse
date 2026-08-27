import { GitHubUser, GitHubRepository, GitHubRelease, PullRequestSummary, IssueSummary, DiscussionSummary, ThreadComment, CommitActivityWeek, TrafficViewsData, TrafficClonesData, LanguageBytes, Contributor, RateLimitStatus } from '../types/github';
import { RepoDetailedStats } from '../types/stats';
import { StorageService } from './storageService';
import { MOCK_USER, MOCK_REPOSITORIES, MOCK_DETAILED_STATS } from './mockDataService';
import { GitHubGraphQLService } from './githubGraphQL';

const BASE_URL = 'https://api.github.com';

export class GitHubApiService {
  private static getHeaders(): HeadersInit {
    const token = StorageService.getAuthToken();
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  private static parseRateLimit(response: Response): void {
    const limit = response.headers.get('x-ratelimit-limit');
    const remaining = response.headers.get('x-ratelimit-remaining');
    const reset = response.headers.get('x-ratelimit-reset');
    const used = response.headers.get('x-ratelimit-used');

    if (limit && remaining && reset) {
      const status: RateLimitStatus = {
        limit: parseInt(limit, 10),
        remaining: parseInt(remaining, 10),
        reset: parseInt(reset, 10),
        used: used ? parseInt(used, 10) : parseInt(limit, 10) - parseInt(remaining, 10)
      };
      StorageService.setRateLimit(status);
    }
  }

  static async verifyToken(token: string): Promise<{ valid: boolean; user?: GitHubUser; error?: string }> {
    try {
      const res = await fetch(`${BASE_URL}/user`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'Authorization': `Bearer ${token.trim()}`
        }
      });
      this.parseRateLimit(res);

      if (res.status === 401) {
        return { valid: false, error: 'Invalid GitHub Personal Access Token. Please check token permissions.' };
      }
      if (res.status === 403) {
        return { valid: false, error: 'GitHub API rate limit exceeded or access forbidden.' };
      }
      if (!res.ok) {
        return { valid: false, error: `GitHub API error: ${res.statusText}` };
      }

      const user: GitHubUser = await res.json();
      return { valid: true, user };
    } catch (err: unknown) {
      return { valid: false, error: err instanceof Error ? err.message : 'Network error connecting to GitHub API' };
    }
  }

  static async getUserProfile(): Promise<GitHubUser> {
    if (StorageService.isDemoMode()) {
      return MOCK_USER;
    }

    const res = await fetch(`${BASE_URL}/user`, {
      headers: this.getHeaders()
    });
    this.parseRateLimit(res);

    if (!res.ok) {
      throw new Error(`Failed to fetch user profile: ${res.statusText}`);
    }
    const user: GitHubUser = await res.json();
    StorageService.setUserProfile(user);
    return user;
  }

  static async getUserRepositories(): Promise<GitHubRepository[]> {
    if (StorageService.isDemoMode()) {
      return MOCK_REPOSITORIES;
    }

    let page = 1;
    const allRepos: GitHubRepository[] = [];
    const maxPages = 3; // Up to 300 repositories

    while (page <= maxPages) {
      const res = await fetch(`${BASE_URL}/user/repos?per_page=100&page=${page}&sort=updated&affiliation=owner,collaborator,organization_member`, {
        headers: this.getHeaders()
      });
      this.parseRateLimit(res);

      if (!res.ok) {
        if (allRepos.length > 0) break;
        throw new Error(`Failed to fetch repositories: ${res.statusText}`);
      }

      const repos: GitHubRepository[] = await res.json();
      if (!Array.isArray(repos) || repos.length === 0) break;
      allRepos.push(...repos);
      if (repos.length < 100) break;
      page++;
    }

    return allRepos;
  }

  static async getRepoReleases(owner: string, repo: string): Promise<{ releases: GitHubRelease[]; totalDownloads: number }> {
    try {
      const res = await fetch(`${BASE_URL}/repos/${owner}/${repo}/releases?per_page=50`, {
        headers: this.getHeaders()
      });
      this.parseRateLimit(res);

      if (!res.ok) return { releases: [], totalDownloads: 0 };
      const releases: GitHubRelease[] = await res.json();
      if (!Array.isArray(releases)) return { releases: [], totalDownloads: 0 };

      let totalDownloads = 0;
      releases.forEach(rel => {
        let relDownloads = 0;
        if (Array.isArray(rel.assets)) {
          rel.assets.forEach(asset => {
            relDownloads += asset.download_count || 0;
          });
        }
        rel.total_download_count = relDownloads;
        totalDownloads += relDownloads;
      });

      return { releases, totalDownloads };
    } catch {
      return { releases: [], totalDownloads: 0 };
    }
  }

  static async getRepoCommitActivity(owner: string, repo: string): Promise<{ commitActivity: CommitActivityWeek[]; totalCommitsLastYear: number }> {
    try {
      const res = await fetch(`${BASE_URL}/repos/${owner}/${repo}/stats/commit_activity`, {
        headers: this.getHeaders()
      });
      this.parseRateLimit(res);

      if (res.status === 202) {
        // GitHub computes stats asynchronously in 202 status
        return { commitActivity: [], totalCommitsLastYear: 0 };
      }
      if (!res.ok) return { commitActivity: [], totalCommitsLastYear: 0 };

      const data = await res.json();
      if (!Array.isArray(data)) return { commitActivity: [], totalCommitsLastYear: 0 };

      const totalCommitsLastYear = data.reduce((acc: number, curr: CommitActivityWeek) => acc + (curr.total || 0), 0);
      return { commitActivity: data, totalCommitsLastYear };
    } catch {
      return { commitActivity: [], totalCommitsLastYear: 0 };
    }
  }

  static async getRepoPullRequests(owner: string, repo: string): Promise<{ openCount: number; closedCount: number; mergedCount: number; list: PullRequestSummary[] }> {
    try {
      const [openRes, closedRes] = await Promise.all([
        fetch(`${BASE_URL}/repos/${owner}/${repo}/pulls?state=open&per_page=30`, { headers: this.getHeaders() }),
        fetch(`${BASE_URL}/repos/${owner}/${repo}/pulls?state=closed&per_page=30`, { headers: this.getHeaders() })
      ]);

      const openList: PullRequestSummary[] = openRes.ok ? await openRes.json() : [];
      const closedList: PullRequestSummary[] = closedRes.ok ? await closedRes.json() : [];

      let mergedCount = 0;
      let pureClosedCount = 0;

      if (Array.isArray(closedList)) {
        closedList.forEach(pr => {
          if (pr.merged_at) {
            mergedCount++;
          } else {
            pureClosedCount++;
          }
        });
      }

      return {
        openCount: Array.isArray(openList) ? openList.length : 0,
        closedCount: pureClosedCount,
        mergedCount,
        list: [...(Array.isArray(openList) ? openList : []), ...(Array.isArray(closedList) ? closedList.slice(0, 15) : [])]
      };
    } catch {
      return { openCount: 0, closedCount: 0, mergedCount: 0, list: [] };
    }
  }

  static async getRepoIssues(owner: string, repo: string): Promise<{ openCount: number; closedCount: number; list: IssueSummary[] }> {
    try {
      const res = await fetch(`${BASE_URL}/repos/${owner}/${repo}/issues?state=all&per_page=30`, {
        headers: this.getHeaders()
      });
      this.parseRateLimit(res);

      if (!res.ok) return { openCount: 0, closedCount: 0, list: [] };
      const raw: any[] = await res.json();
      if (!Array.isArray(raw)) return { openCount: 0, closedCount: 0, list: [] };

      // Filter out Pull Requests which GitHub returns in the issues endpoint
      const pureIssues = raw.filter(item => !item.pull_request);
      const openCount = pureIssues.filter(i => i.state === 'open').length;
      const closedCount = pureIssues.filter(i => i.state === 'closed').length;

      return {
        openCount,
        closedCount,
        list: pureIssues.slice(0, 30)
      };
    } catch {
      return { openCount: 0, closedCount: 0, list: [] };
    }
  }

  static async getIssueComments(owner: string, repo: string, issueNumber: number): Promise<ThreadComment[]> {
    try {
      const res = await fetch(`${BASE_URL}/repos/${owner}/${repo}/issues/${issueNumber}/comments?per_page=20`, {
        headers: this.getHeaders()
      });
      if (!res.ok) return [];
      const list = await res.json();
      if (!Array.isArray(list)) return [];
      return list.map((c: any) => ({
        id: c.id,
        body: c.body || '',
        created_at: c.created_at,
        user: {
          login: c.user?.login || 'ghost',
          avatar_url: c.user?.avatar_url || 'https://avatars.githubusercontent.com/u/10137?v=4'
        }
      }));
    } catch {
      return [];
    }
  }

  static async getPRComments(owner: string, repo: string, prNumber: number): Promise<ThreadComment[]> {
    try {
      const res = await fetch(`${BASE_URL}/repos/${owner}/${repo}/issues/${prNumber}/comments?per_page=20`, {
        headers: this.getHeaders()
      });
      if (!res.ok) return [];
      const list = await res.json();
      if (!Array.isArray(list)) return [];
      return list.map((c: any) => ({
        id: c.id,
        body: c.body || '',
        created_at: c.created_at,
        user: {
          login: c.user?.login || 'ghost',
          avatar_url: c.user?.avatar_url || 'https://avatars.githubusercontent.com/u/10137?v=4'
        }
      }));
    } catch {
      return [];
    }
  }

  static async getRepoTraffic(owner: string, repo: string): Promise<{ views: TrafficViewsData | null; clones: TrafficClonesData | null }> {
    try {
      const [viewsRes, clonesRes] = await Promise.all([
        fetch(`${BASE_URL}/repos/${owner}/${repo}/traffic/views`, { headers: this.getHeaders() }),
        fetch(`${BASE_URL}/repos/${owner}/${repo}/traffic/clones`, { headers: this.getHeaders() })
      ]);

      const views = viewsRes.ok ? await viewsRes.json() : null;
      const clones = clonesRes.ok ? await clonesRes.json() : null;
      return { views, clones };
    } catch {
      return { views: null, clones: null };
    }
  }

  static async getRepoLanguages(owner: string, repo: string): Promise<LanguageBytes> {
    try {
      const res = await fetch(`${BASE_URL}/repos/${owner}/${repo}/languages`, {
        headers: this.getHeaders()
      });
      if (!res.ok) return {};
      return await res.json();
    } catch {
      return {};
    }
  }

  static async getRepoContributors(owner: string, repo: string): Promise<Contributor[]> {
    try {
      const res = await fetch(`${BASE_URL}/repos/${owner}/${repo}/contributors?per_page=10`, {
        headers: this.getHeaders()
      });
      if (!res.ok) return [];
      const list = await res.json();
      return Array.isArray(list) ? list : [];
    } catch {
      return [];
    }
  }

  static async fetchCompleteRepoStats(repository: GitHubRepository, forceRefresh = false): Promise<RepoDetailedStats> {
    if (StorageService.isDemoMode()) {
      return MOCK_DETAILED_STATS[repository.id] || {
        repo: repository,
        releases: [],
        totalDownloads: 0,
        openPullRequestsCount: 0,
        closedPullRequestsCount: 0,
        mergedPullRequestsCount: 0,
        pullRequests: [],
        openIssuesCount: repository.open_issues_count || 0,
        closedIssuesCount: 0,
        issues: [],
        discussionsCount: 0,
        discussionCommentsCount: 0,
        discussions: [],
        commitActivity: [],
        totalCommitsLastYear: 0,
        languages: repository.language ? { [repository.language]: 10000 } : {},
        contributors: [],
        lastFetched: Date.now()
      };
    }

    if (!forceRefresh) {
      const cached = StorageService.getCachedRepoStats(repository.id);
      if (cached) return cached;
    }

    const owner = repository.owner.login;
    const name = repository.name;

    const [
      releasesData,
      commitData,
      prData,
      issueData,
      trafficData,
      languagesData,
      contributorsData,
      discussionsData
    ] = await Promise.all([
      this.getRepoReleases(owner, name),
      this.getRepoCommitActivity(owner, name),
      this.getRepoPullRequests(owner, name),
      this.getRepoIssues(owner, name),
      this.getRepoTraffic(owner, name),
      this.getRepoLanguages(owner, name),
      this.getRepoContributors(owner, name),
      GitHubGraphQLService.fetchDiscussions(owner, name)
    ]);

    const detailed: RepoDetailedStats = {
      repo: repository,
      releases: releasesData.releases,
      totalDownloads: releasesData.totalDownloads,
      openPullRequestsCount: prData.openCount,
      closedPullRequestsCount: prData.closedCount,
      mergedPullRequestsCount: prData.mergedCount,
      pullRequests: prData.list,
      openIssuesCount: issueData.openCount || repository.open_issues_count,
      closedIssuesCount: issueData.closedCount,
      issues: issueData.list,
      discussionsCount: discussionsData.discussionsCount,
      discussionCommentsCount: discussionsData.discussionCommentsCount,
      discussions: discussionsData.discussions,
      commitActivity: commitData.commitActivity,
      totalCommitsLastYear: commitData.totalCommitsLastYear,
      trafficViews: trafficData.views,
      trafficClones: trafficData.clones,
      languages: languagesData,
      contributors: contributorsData,
      lastFetched: Date.now()
    };

    StorageService.saveCachedRepoStats(repository.id, detailed);
    return detailed;
  }
}
