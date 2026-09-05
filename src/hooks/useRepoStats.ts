import { useState, useEffect, useCallback, useMemo } from 'react';
import { GitHubRepository } from '../types/github';
import { RepoDetailedStats, AggregateStats, CommitTrendPoint, StarDistributionPoint } from '../types/stats';
import { GitHubApiService } from '../services/githubApi';
import { StorageService } from '../services/storageService';
import { computeMockAggregateStats, MOCK_REPOSITORIES, MOCK_DETAILED_STATS } from '../services/mockDataService';

export function useRepoStats(
  isAuthenticated: boolean,
  isDemoMode: boolean,
  trackedRepoIds: number[],
  autoRefreshInterval: string = '1h'
) {
  const [allRepos, setAllRepos] = useState<GitHubRepository[]>([]);
  const [detailedStatsMap, setDetailedStatsMap] = useState<Record<number, RepoDetailedStats>>({});
  const [isLoadingRepos, setIsLoadingRepos] = useState(false);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [currentLoadingRepoName, setCurrentLoadingRepoName] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState<{ current: number; total: number }>({ current: 0, total: 0 });
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [selectedRepoId, setSelectedRepoId] = useState<number | null>(null);

  // 1. Fetch available repositories for the user
  const fetchUserRepos = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoadingRepos(true);
    setError(null);

    try {
      if (isDemoMode) {
        setAllRepos(MOCK_REPOSITORIES);
      } else {
        const repos = await GitHubApiService.getUserRepositories();
        setAllRepos(repos);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch repositories');
    } finally {
      setIsLoadingRepos(false);
    }
  }, [isAuthenticated, isDemoMode]);

  // 2. Fetch stats for all tracked repositories
  const fetchTrackedStats = useCallback(async (forceRefresh = false) => {
    if (!isAuthenticated || trackedRepoIds.length === 0) {
      if (trackedRepoIds.length === 0) {
        setDetailedStatsMap({});
      }
      return;
    }

    setIsLoadingStats(true);
    setError(null);

    try {
      if (isDemoMode) {
        setLoadingProgress({ current: 0, total: trackedRepoIds.length });
        const stats: Record<number, RepoDetailedStats> = {};
        for (let i = 0; i < trackedRepoIds.length; i++) {
          const id = trackedRepoIds[i];
          if (MOCK_DETAILED_STATS[id]) {
            setCurrentLoadingRepoName(MOCK_DETAILED_STATS[id].repo.name);
            setLoadingProgress({ current: i + 1, total: trackedRepoIds.length });
            stats[id] = MOCK_DETAILED_STATS[id];
          }
        }
        setDetailedStatsMap(stats);
        setCurrentLoadingRepoName(null);
        setLastUpdated(new Date());
      } else {
        const targetRepos = allRepos.filter(r => trackedRepoIds.includes(r.id));
        if (targetRepos.length === 0) {
          setIsLoadingStats(false);
          return;
        }

        setLoadingProgress({ current: 0, total: targetRepos.length });
        const newMap: Record<number, RepoDetailedStats> = {};

        for (let i = 0; i < targetRepos.length; i++) {
          const repo = targetRepos[i];
          setCurrentLoadingRepoName(repo.name);
          setLoadingProgress({ current: i + 1, total: targetRepos.length });
          try {
            const detailed = await GitHubApiService.fetchCompleteRepoStats(repo, forceRefresh);
            newMap[repo.id] = detailed;
          } catch (e) {
            console.error(`Error fetching stats for ${repo.name}:`, e);
          }
        }

        setDetailedStatsMap(newMap);
        setCurrentLoadingRepoName(null);
        setLastUpdated(new Date());
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch repository statistics');
    } finally {
      setIsLoadingStats(false);
      setCurrentLoadingRepoName(null);
    }
  }, [isAuthenticated, isDemoMode, trackedRepoIds, allRepos]);

  const [refreshingRepoId, setRefreshingRepoId] = useState<number | null>(null);

  // 3. Refresh statistics for a single repository
  const refreshSingleRepo = useCallback(async (repoId: number) => {
    if (!isAuthenticated) return;
    setRefreshingRepoId(repoId);

    try {
      if (isDemoMode) {
        // Quick subtle delay for visual tactile feedback
        await new Promise(r => setTimeout(r, 450));
        if (MOCK_DETAILED_STATS[repoId]) {
          setDetailedStatsMap(prev => ({
            ...prev,
            [repoId]: { ...MOCK_DETAILED_STATS[repoId] }
          }));
        }
      } else {
        const targetRepo = allRepos.find(r => r.id === repoId) || detailedStatsMap[repoId]?.repo;
        if (!targetRepo) return;

        const detailed = await GitHubApiService.fetchCompleteRepoStats(targetRepo, true);
        setDetailedStatsMap(prev => ({
          ...prev,
          [repoId]: detailed
        }));
        setAllRepos(prev => prev.map(r => r.id === repoId ? detailed.repo : r));
      }
      setLastUpdated(new Date());
    } catch (err: unknown) {
      console.error(`Failed to refresh repository ${repoId}:`, err);
    } finally {
      setRefreshingRepoId(null);
    }
  }, [isAuthenticated, isDemoMode, allRepos, detailedStatsMap]);

  useEffect(() => {
    fetchUserRepos();
  }, [fetchUserRepos]);

  useEffect(() => {
    if (allRepos.length > 0) {
      fetchTrackedStats();
    }
  }, [allRepos, trackedRepoIds, fetchTrackedStats]);

  // Auto-refresh timer
  useEffect(() => {
    if (autoRefreshInterval === 'off' || !isAuthenticated) return;

    let intervalMs = 60 * 60 * 1000; // 1h default
    if (autoRefreshInterval === '15m') intervalMs = 15 * 60 * 1000;
    if (autoRefreshInterval === '6h') intervalMs = 6 * 60 * 60 * 1000;
    if (autoRefreshInterval === '24h') intervalMs = 24 * 60 * 60 * 1000;

    const timer = setInterval(() => {
      fetchTrackedStats(true);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [autoRefreshInterval, isAuthenticated, fetchTrackedStats]);

  // 3. Compute Aggregate Stats
  const aggregateStats: AggregateStats = useMemo(() => {
    if (isDemoMode) {
      return computeMockAggregateStats(trackedRepoIds);
    }

    const detailedList = Object.values(detailedStatsMap);
    if (detailedList.length === 0) {
      return {
        totalReposTracked: 0,
        totalStars: 0,
        totalForks: 0,
        totalDownloads: 0,
        totalOpenIssues: 0,
        totalClosedIssues: 0,
        totalOpenPRs: 0,
        totalMergedPRs: 0,
        totalClosedPRs: 0,
        totalDiscussions: 0,
        totalDiscussionComments: 0,
        totalCommitsYear: 0,
        totalWatchers: 0,
        totalUniqueContributors: 0,
        topLanguage: 'None',
        mostStarredRepo: null,
        mostDownloadedRepo: null
      };
    }

    let totalStars = 0;
    let totalForks = 0;
    let totalDownloads = 0;
    let totalOpenIssues = 0;
    let totalClosedIssues = 0;
    let totalOpenPRs = 0;
    let totalMergedPRs = 0;
    let totalClosedPRs = 0;
    let totalDiscussions = 0;
    let totalDiscussionComments = 0;
    let totalCommitsYear = 0;
    let totalWatchers = 0;
    const contributorLogins = new Set<string>();
    const languageBytes: Record<string, number> = {};

    let mostStarredRepo: GitHubRepository | null = null;
    let mostDownloadedRepo: { repo: GitHubRepository; downloads: number } | null = null;

    detailedList.forEach(st => {
      totalStars += st.repo.stargazers_count || 0;
      totalForks += st.repo.forks_count || 0;
      totalDownloads += st.totalDownloads || 0;
      totalOpenIssues += st.openIssuesCount || 0;
      totalClosedIssues += st.closedIssuesCount || 0;
      totalOpenPRs += st.openPullRequestsCount || 0;
      totalMergedPRs += st.mergedPullRequestsCount || 0;
      totalClosedPRs += st.closedPullRequestsCount || 0;
      totalDiscussions += st.discussionsCount || 0;
      totalDiscussionComments += st.discussionCommentsCount || 0;
      totalCommitsYear += st.totalCommitsLastYear || 0;
      totalWatchers += st.repo.subscribers_count ?? st.repo.watchers_count ?? 0;

      if (Array.isArray(st.contributors)) {
        st.contributors.forEach(c => contributorLogins.add(c.login));
      }

      if (st.languages) {
        Object.entries(st.languages).forEach(([lang, bytes]) => {
          languageBytes[lang] = (languageBytes[lang] || 0) + bytes;
        });
      }

      if (!mostStarredRepo || st.repo.stargazers_count > mostStarredRepo.stargazers_count) {
        mostStarredRepo = st.repo;
      }

      if (!mostDownloadedRepo || st.totalDownloads > mostDownloadedRepo.downloads) {
        mostDownloadedRepo = { repo: st.repo, downloads: st.totalDownloads };
      }
    });

    const sortedLanguages = Object.entries(languageBytes).sort((a, b) => b[1] - a[1]);
    const topLanguage = sortedLanguages.length > 0 ? sortedLanguages[0][0] : 'N/A';

    return {
      totalReposTracked: detailedList.length,
      totalStars,
      totalForks,
      totalDownloads,
      totalOpenIssues,
      totalClosedIssues,
      totalOpenPRs,
      totalMergedPRs,
      totalClosedPRs,
      totalDiscussions,
      totalDiscussionComments,
      totalCommitsYear,
      totalWatchers,
      totalUniqueContributors: contributorLogins.size,
      topLanguage,
      mostStarredRepo,
      mostDownloadedRepo
    };
  }, [isDemoMode, trackedRepoIds, detailedStatsMap]);

  // 4. Compute Star & Distribution Points for Charts
  const starDistribution: StarDistributionPoint[] = useMemo(() => {
    const palette = ['#58a6ff', '#3fb950', '#bc8cff', '#d29922', '#f85149', '#39c5cf', '#f778ba'];
    return Object.values(detailedStatsMap).map((st, index) => ({
      name: st.repo.name,
      fullName: st.repo.full_name,
      stars: st.repo.stargazers_count,
      forks: st.repo.forks_count,
      downloads: st.totalDownloads,
      issues: st.openIssuesCount,
      prs: st.openPullRequestsCount,
      color: palette[index % palette.length]
    }));
  }, [detailedStatsMap]);

  // 5. Compute Aggregate Weekly Commit Activity Trend
  const commitTrendData: CommitTrendPoint[] = useMemo(() => {
    const detailedList = Object.values(detailedStatsMap);
    if (detailedList.length === 0) return [];

    const weekCount = 12; // Last 12 weeks
    const points: CommitTrendPoint[] = [];

    for (let w = weekCount - 1; w >= 0; w--) {
      const now = new Date();
      now.setDate(now.getDate() - (w * 7));
      const dateLabel = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      let totalCommitsForWeek = 0;
      const point: CommitTrendPoint = { date: dateLabel, commits: 0 };

      detailedList.forEach(st => {
        if (st.commitActivity && st.commitActivity.length > 0) {
          const actIndex = st.commitActivity.length - 1 - w;
          const commits = (actIndex >= 0 && actIndex < st.commitActivity.length) ? (st.commitActivity[actIndex].total || 0) : 0;
          totalCommitsForWeek += commits;
          point[st.repo.name] = commits;
        }
      });

      point.commits = totalCommitsForWeek;
      points.push(point);
    }

    return points;
  }, [detailedStatsMap]);

  return {
    allRepos,
    trackedStats: detailedStatsMap,
    aggregateStats,
    starDistribution,
    commitTrendData,
    isLoadingRepos,
    isLoadingStats,
    currentLoadingRepoName,
    loadingProgress,
    refreshingRepoId,
    error,
    lastUpdated,
    selectedRepoId,
    setSelectedRepoId,
    refreshRepos: fetchUserRepos,
    refreshStats: () => fetchTrackedStats(true),
    refreshSingleRepo,
  };
}
