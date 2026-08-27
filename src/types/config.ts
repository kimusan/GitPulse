export type ThemeMode = 'github-dark' | 'oled-black' | 'light' | 'nord-blue' | 'dracula' | 'retro-crt';

export type ActiveTab = 'dashboard' | 'repositories' | 'trends' | 'compare' | 'config';

export interface VisibleMetricsConfig {
  stars: boolean;
  downloads: boolean;
  forks: boolean;
  pullRequests: boolean;
  issues: boolean;
  discussions: boolean;
  commitVelocity: boolean;
  trafficViews: boolean;
  trafficClones: boolean;
  languages: boolean;
  topContributors: boolean;
  watchers: boolean;
}

export interface MetricCardOrder {
  id: keyof VisibleMetricsConfig;
  title: string;
  category: 'core' | 'community' | 'activity' | 'traffic';
}

export type AutoRefreshInterval = 'off' | '15m' | '1h' | '6h' | '24h';

export interface UserAppConfig {
  theme: ThemeMode;
  trackedRepoIds: number[];
  visibleMetrics: VisibleMetricsConfig;
  autoRefresh: AutoRefreshInterval;
  enableAnimations: boolean;
  compactCardView: boolean;
  lastSelectedRepoId: number | null;
  onboardingCompleted: boolean;
}
