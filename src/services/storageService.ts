import { UserAppConfig } from '../types/config';
import { GitHubUser, RateLimitStatus } from '../types/github';
import { RepoDetailedStats } from '../types/stats';
import { normalizeInstanceUrl } from '../utils/githubEndpoints';

const KEYS = {
  AUTH_TOKEN: 'gitpulse_auth_token',
  AUTH_INSTANCE_URL: 'gitpulse_auth_instance_url',
  USER_PROFILE: 'gitpulse_user_profile',
  APP_CONFIG: 'gitpulse_app_config',
  CACHED_STATS_PREFIX: 'gitpulse_stats_',
  CACHED_REPOS: 'gitpulse_cached_repos',
  RATE_LIMIT: 'gitpulse_rate_limit',
  IS_DEMO_MODE: 'gitpulse_is_demo_mode'
};

export const DEFAULT_CONFIG: UserAppConfig = {
  theme: 'github-dark',
  instanceUrl: 'https://github.com',
  trackedRepoIds: [],
  visibleMetrics: {
    stars: true,
    downloads: true,
    forks: true,
    pullRequests: true,
    issues: true,
    discussions: true,
    commitVelocity: true,
    trafficViews: true,
    trafficClones: true,
    languages: true,
    topContributors: true,
    watchers: true,
  },
  autoRefresh: '1h',
  enableAnimations: true,
  compactCardView: false,
  lastSelectedRepoId: null,
  onboardingCompleted: false,
};

export class StorageService {
  static getAuthToken(): string | null {
    return localStorage.getItem(KEYS.AUTH_TOKEN);
  }

  static setAuthToken(token: string): void {
    localStorage.setItem(KEYS.AUTH_TOKEN, token.trim());
  }

  static removeAuthToken(): void {
    localStorage.removeItem(KEYS.AUTH_TOKEN);
  }

  static getInstanceUrl(): string {
    const stored = localStorage.getItem(KEYS.AUTH_INSTANCE_URL);
    return normalizeInstanceUrl(stored || 'https://github.com');
  }

  static setInstanceUrl(url: string): void {
    localStorage.setItem(KEYS.AUTH_INSTANCE_URL, normalizeInstanceUrl(url));
  }

  static removeInstanceUrl(): void {
    localStorage.removeItem(KEYS.AUTH_INSTANCE_URL);
  }

  static isDemoMode(): boolean {
    return localStorage.getItem(KEYS.IS_DEMO_MODE) === 'true';
  }

  static setDemoMode(isDemo: boolean): void {
    localStorage.setItem(KEYS.IS_DEMO_MODE, isDemo ? 'true' : 'false');
  }

  static getUserProfile(): GitHubUser | null {
    const raw = localStorage.getItem(KEYS.USER_PROFILE);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  static setUserProfile(user: GitHubUser): void {
    localStorage.setItem(KEYS.USER_PROFILE, JSON.stringify(user));
  }

  static getConfig(): UserAppConfig {
    const raw = localStorage.getItem(KEYS.APP_CONFIG);
    if (!raw) return DEFAULT_CONFIG;
    try {
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_CONFIG,
        ...parsed,
        visibleMetrics: {
          ...DEFAULT_CONFIG.visibleMetrics,
          ...(parsed.visibleMetrics || {})
        }
      };
    } catch {
      return DEFAULT_CONFIG;
    }
  }

  static saveConfig(config: Partial<UserAppConfig>): UserAppConfig {
    const current = this.getConfig();
    const updated = { ...current, ...config };
    localStorage.setItem(KEYS.APP_CONFIG, JSON.stringify(updated));
    return updated;
  }

  static getCachedRepoStats(repoId: number): RepoDetailedStats | null {
    const raw = localStorage.getItem(`${KEYS.CACHED_STATS_PREFIX}${repoId}`);
    if (!raw) return null;
    try {
      const parsed: RepoDetailedStats = JSON.parse(raw);
      // Cache valid for 30 minutes
      const maxAge = 30 * 60 * 1000;
      if (Date.now() - parsed.lastFetched > maxAge) {
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  }

  static saveCachedRepoStats(repoId: number, stats: RepoDetailedStats): void {
    try {
      localStorage.setItem(`${KEYS.CACHED_STATS_PREFIX}${repoId}`, JSON.stringify(stats));
    } catch {
      // In case quota exceeded, purge old caches
      this.clearAllStatsCache();
      try {
        localStorage.setItem(`${KEYS.CACHED_STATS_PREFIX}${repoId}`, JSON.stringify(stats));
      } catch {
        // Ignore if still fails
      }
    }
  }

  static clearAllStatsCache(): void {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(KEYS.CACHED_STATS_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
  }

  static getRateLimit(): RateLimitStatus | null {
    const raw = localStorage.getItem(KEYS.RATE_LIMIT);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  static setRateLimit(limit: RateLimitStatus): void {
    localStorage.setItem(KEYS.RATE_LIMIT, JSON.stringify(limit));
  }

  static clearAll(): void {
    localStorage.clear();
  }
}
