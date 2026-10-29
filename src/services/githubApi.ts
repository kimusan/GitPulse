import { GitHubUser, GitHubRepository, GitHubRelease, PullRequestSummary, IssueSummary, DiscussionSummary, ThreadComment, CommitActivityWeek, TrafficViewsData, TrafficClonesData, LanguageBytes, Contributor, RateLimitStatus } from '../types/github';
import { RepoDetailedStats, StarHistoryPoint } from '../types/stats';
import { StorageService } from './storageService';
import { MOCK_USER, MOCK_REPOSITORIES, MOCK_DETAILED_STATS } from './mockDataService';
import { GitHubGraphQLService } from './githubGraphQL';
import { getRestBaseUrl } from '../utils/githubEndpoints';

export class GitHubApiService {
  private static getBaseUrl(): string {
    return getRestBaseUrl(StorageService.getInstanceUrl());
  }

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

  static async verifyToken(token: string, instanceUrl?: string): Promise<{ valid: boolean; user?: GitHubUser; error?: string }> {
    const baseUrl = getRestBaseUrl(instanceUrl || StorageService.getInstanceUrl());
    try {
      const res = await fetch(`${baseUrl}/user`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'Authorization': `Bearer ${token.trim()}`
        }
      });
      this.parseRateLimit(res);

      if (res.status === 401) {
        return { valid: false, error: 'Invalid Personal Access Token. Please check token permissions.' };
      }
      if (res.status === 403) {
        return { valid: false, error: 'API rate limit exceeded or access forbidden.' };
      }
      if (!res.ok) {
        return { valid: false, error: `GitHub Server error (${res.status}): ${res.statusText}` };
      }

      const user: GitHubUser = await res.json();
      return { valid: true, user };
    } catch (err: unknown) {
      return { valid: false, error: err instanceof Error ? err.message : 'Network error connecting to GitHub Server' };
    }
  }

  static async getUserProfile(): Promise<GitHubUser> {
    if (StorageService.isDemoMode()) {
      return MOCK_USER;
    }

    const res = await fetch(`${this.getBaseUrl()}/user`, {
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
      const res = await fetch(`${this.getBaseUrl()}/user/repos?per_page=100&page=${page}&sort=updated&affiliation=owner,collaborator,organization_member`, {
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
      const res = await fetch(`${this.getBaseUrl()}/repos/${owner}/${repo}/releases?per_page=50`, {
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
      const res = await fetch(`${this.getBaseUrl()}/repos/${owner}/${repo}/stats/commit_activity`, {
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
        fetch(`${this.getBaseUrl()}/repos/${owner}/${repo}/pulls?state=open&per_page=30`, { headers: this.getHeaders() }),
        fetch(`${this.getBaseUrl()}/repos/${owner}/${repo}/pulls?state=closed&per_page=30`, { headers: this.getHeaders() })
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
      const res = await fetch(`${this.getBaseUrl()}/repos/${owner}/${repo}/issues?state=all&per_page=30`, {
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
      const res = await fetch(`${this.getBaseUrl()}/repos/${owner}/${repo}/issues/${issueNumber}/comments?per_page=20`, {
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
      const res = await fetch(`${this.getBaseUrl()}/repos/${owner}/${repo}/issues/${prNumber}/comments?per_page=20`, {
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
        fetch(`${this.getBaseUrl()}/repos/${owner}/${repo}/traffic/views`, { headers: this.getHeaders() }),
        fetch(`${this.getBaseUrl()}/repos/${owner}/${repo}/traffic/clones`, { headers: this.getHeaders() })
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
      const res = await fetch(`${this.getBaseUrl()}/repos/${owner}/${repo}/languages`, {
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
      const res = await fetch(`${this.getBaseUrl()}/repos/${owner}/${repo}/contributors?per_page=10`, {
        headers: this.getHeaders()
      });
      if (!res.ok) return [];
      const list = await res.json();
      return Array.isArray(list) ? list : [];
    } catch {
      return [];
    }
  }

  static async getRepoDetails(owner: string, repo: string): Promise<Partial<GitHubRepository> | null> {
    try {
      const res = await fetch(`${this.getBaseUrl()}/repos/${owner}/${repo}`, {
        headers: this.getHeaders()
      });
      this.parseRateLimit(res);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  private static parseLastPageFromLinkHeader(linkHeader: string | null): number {
    if (!linkHeader) return 1;
    const match = linkHeader.match(/page=(\d+)>;\s*rel="last"/);
    return match ? parseInt(match[1], 10) : 1;
  }

  private static generateFallbackStarHistory(createdAt: string, totalStars: number): StarHistoryPoint[] {
    const points: StarHistoryPoint[] = [];
    points.push({ date: createdAt, stars: 0 });

    if (totalStars > 0) {
      const start = new Date(createdAt).getTime();
      const now = Date.now();
      const diff = now - start;
      const steps = Math.min(12, totalStars);
      for (let i = 1; i <= steps; i++) {
        const factor = Math.pow(i / steps, 1.4);
        const count = Math.min(totalStars, Math.max(1, Math.round(totalStars * factor)));
        points.push({
          date: new Date(start + diff * (i / steps)).toISOString(),
          stars: count
        });
      }
      if (points[points.length - 1].stars !== totalStars) {
        points.push({ date: new Date().toISOString(), stars: totalStars });
      }
    }

    return points;
  }

  static async getRepoStarHistory(
    owner: string,
    repo: string,
    totalStars: number,
    createdAt: string
  ): Promise<StarHistoryPoint[]> {
    if (totalStars <= 0) {
      return [{ date: createdAt, stars: 0 }];
    }

    try {
      const starHeaders = {
        ...this.getHeaders(),
        'Accept': 'application/vnd.github.star+json',
      };

      // 1. Fetch First Page (up to 100 stars)
      const firstRes = await fetch(`${this.getBaseUrl()}/repos/${owner}/${repo}/stargazers?per_page=100&page=1`, {
        headers: starHeaders
      });
      this.parseRateLimit(firstRes);

      if (!firstRes.ok) {
        return this.generateFallbackStarHistory(createdAt, totalStars);
      }

      const firstPageData = await firstRes.json();
      if (!Array.isArray(firstPageData) || firstPageData.length === 0) {
        return this.generateFallbackStarHistory(createdAt, totalStars);
      }

      const linkHeader = firstRes.headers.get('Link');
      const lastPage = this.parseLastPageFromLinkHeader(linkHeader);

      // If everything fits on page 1 (<= 100 stars)
      if (lastPage <= 1) {
        const points: StarHistoryPoint[] = [{ date: createdAt, stars: 0 }];
        firstPageData.forEach((item: any, idx: number) => {
          if (item?.starred_at) {
            points.push({
              date: item.starred_at,
              stars: idx + 1,
              user: item.user ? { login: item.user.login, avatar_url: item.user.avatar_url } : undefined
            });
          }
        });
        if (points.length > 0 && points[points.length - 1].stars < totalStars) {
          points.push({ date: new Date().toISOString(), stars: totalStars });
        }
        return points;
      }

      // If between 2 and 4 pages (101 to 400 stars)
      if (lastPage <= 4) {
        const remainingPages = Array.from({ length: lastPage - 1 }, (_, i) => i + 2);
        const pageResponses = await Promise.all(
          remainingPages.map(async p => {
            try {
              const res = await fetch(`${this.getBaseUrl()}/repos/${owner}/${repo}/stargazers?per_page=100&page=${p}`, {
                headers: starHeaders
              });
              this.parseRateLimit(res);
              if (res.ok) {
                const list = await res.json();
                return Array.isArray(list) ? list : [];
              }
            } catch {}
            return [];
          })
        );

        const allItems = [...firstPageData];
        pageResponses.forEach(list => allItems.push(...list));

        const points: StarHistoryPoint[] = [{ date: createdAt, stars: 0 }];
        allItems.forEach((item: any, idx: number) => {
          if (item?.starred_at) {
            points.push({
              date: item.starred_at,
              stars: idx + 1,
              user: item.user ? { login: item.user.login, avatar_url: item.user.avatar_url } : undefined
            });
          }
        });
        if (points[points.length - 1].stars < totalStars) {
          points.push({ date: new Date().toISOString(), stars: totalStars });
        }
        return points;
      }

      // If > 4 pages: sample up to 10-12 pages evenly to conserve rate limits
      const samplePageCount = Math.min(12, lastPage);
      const pageIndices = new Set<number>();
      pageIndices.add(lastPage);
      for (let i = 2; i < samplePageCount; i++) {
        const p = Math.max(2, Math.min(lastPage - 1, Math.round((i / (samplePageCount - 1)) * lastPage)));
        pageIndices.add(p);
      }
      const sortedPages = Array.from(pageIndices).sort((a, b) => a - b);

      const sampledResponses = await Promise.all(
        sortedPages.map(async p => {
          try {
            const res = await fetch(`${this.getBaseUrl()}/repos/${owner}/${repo}/stargazers?per_page=100&page=${p}`, {
              headers: starHeaders
            });
            this.parseRateLimit(res);
            if (res.ok) {
              const list = await res.json();
              return { page: p, list: Array.isArray(list) ? list : [] };
            }
          } catch {}
          return { page: p, list: [] };
        })
      );

      const points: StarHistoryPoint[] = [{ date: createdAt, stars: 0 }];

      // Take sample from first page
      const stepFirst = Math.max(1, Math.floor(firstPageData.length / 5));
      for (let i = 0; i < firstPageData.length; i += stepFirst) {
        const item = firstPageData[i];
        if (item?.starred_at) {
          points.push({
            date: item.starred_at,
            stars: i + 1,
            user: item.user ? { login: item.user.login, avatar_url: item.user.avatar_url } : undefined
          });
        }
      }

      // Add sampled pages
      sampledResponses.forEach(({ page, list }) => {
        if (list.length > 0) {
          const step = Math.max(1, Math.floor(list.length / 3));
          for (let i = 0; i < list.length; i += step) {
            const item = list[i];
            if (item?.starred_at) {
              const starCount = Math.min(totalStars, (page - 1) * 100 + i + 1);
              points.push({
                date: item.starred_at,
                stars: starCount,
                user: item.user ? { login: item.user.login, avatar_url: item.user.avatar_url } : undefined
              });
            }
          }
          const lastItem = list[list.length - 1];
          if (lastItem?.starred_at) {
            const starCount = Math.min(totalStars, (page - 1) * 100 + list.length);
            points.push({
              date: lastItem.starred_at,
              stars: starCount,
              user: lastItem.user ? { login: lastItem.user.login, avatar_url: lastItem.user.avatar_url } : undefined
            });
          }
        }
      });

      // Always terminate with totalStars at current time
      points.push({ date: new Date().toISOString(), stars: totalStars });

      // Sort points chronologically
      points.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      // Deduplicate points with identical timestamps
      const uniquePoints: StarHistoryPoint[] = [];
      const seenDates = new Set<string>();
      points.forEach(p => {
        const key = p.date.split('T')[0] + '-' + p.stars;
        if (!seenDates.has(key)) {
          seenDates.add(key);
          uniquePoints.push(p);
        }
      });

      return uniquePoints.length > 1 ? uniquePoints : this.generateFallbackStarHistory(createdAt, totalStars);
    } catch (err) {
      console.warn(`Failed to fetch star history for ${owner}/${repo}:`, err);
      return this.generateFallbackStarHistory(createdAt, totalStars);
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
        starHistory: [],
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
      repoDetails,
      releasesData,
      commitData,
      prData,
      issueData,
      trafficData,
      languagesData,
      contributorsData,
      discussionsData,
      starHistoryData
    ] = await Promise.all([
      this.getRepoDetails(owner, name),
      this.getRepoReleases(owner, name),
      this.getRepoCommitActivity(owner, name),
      this.getRepoPullRequests(owner, name),
      this.getRepoIssues(owner, name),
      this.getRepoTraffic(owner, name),
      this.getRepoLanguages(owner, name),
      this.getRepoContributors(owner, name),
      GitHubGraphQLService.fetchDiscussions(owner, name),
      this.getRepoStarHistory(owner, name, repository.stargazers_count, repository.created_at)
    ]);

    const updatedRepo: GitHubRepository = repoDetails
      ? { ...repository, ...repoDetails }
      : repository;

    const detailed: RepoDetailedStats = {
      repo: updatedRepo,
      releases: releasesData.releases,
      totalDownloads: releasesData.totalDownloads,
      openPullRequestsCount: prData.openCount,
      closedPullRequestsCount: prData.closedCount,
      mergedPullRequestsCount: prData.mergedCount,
      pullRequests: prData.list,
      openIssuesCount: issueData.openCount || updatedRepo.open_issues_count,
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
      starHistory: starHistoryData,
      lastFetched: Date.now()
    };

    StorageService.saveCachedRepoStats(repository.id, detailed);
    return detailed;
  }
}
