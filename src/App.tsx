import React, { useState } from 'react';
import {
  Sparkles,
  Layers,
  Plus,
  FolderGit2,
  TrendingUp,
  Sliders,
  ExternalLink,
  AlertTriangle,
} from 'lucide-react';
import { GithubIcon } from './components/common/GithubIcon';
import { useGitHubAuth } from './hooks/useGitHubAuth';
import { useConfig } from './hooks/useConfig';
import { useRepoStats } from './hooks/useRepoStats';
import { ResponsiveLayout } from './components/layout/ResponsiveLayout';
import { WelcomeAuthModal } from './components/onboarding/WelcomeAuthModal';
import { RepoMultiSelector } from './components/onboarding/RepoMultiSelector';
import { MetricsGrid } from './components/dashboard/MetricsGrid';
import { RepoListCard } from './components/dashboard/RepoListCard';
import { ComparisonView } from './components/dashboard/ComparisonView';
import { CommitActivityChart } from './components/charts/CommitActivityChart';
import { StarForkComparisonChart } from './components/charts/StarForkComparisonChart';
import { DownloadsBreakdownChart } from './components/charts/DownloadsBreakdownChart';
import { IssuesPrRatioChart } from './components/charts/IssuesPrRatioChart';
import { RepoDetailModal } from './components/repository/RepoDetailModal';
import { ConfigModal } from './components/config/ConfigModal';
import { EmptyState } from './components/common/EmptyState';
import { ActiveTab } from './types/config';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isRepoSelectorOpen, setIsRepoSelectorOpen] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [selectedDetailRepoId, setSelectedDetailRepoId] = useState<number | null>(null);

  // Auth Hook
  const {
    isAuthenticated,
    isDemoMode,
    user,
    isLoading: isAuthLoading,
    error: authError,
    rateLimit,
    loginWithToken,
    enableDemoMode,
    logout,
  } = useGitHubAuth();

  // Configuration Hook
  const {
    config,
    setTheme,
    setTrackedRepoIds,
    toggleTrackedRepo,
    toggleMetricVisibility,
    setAutoRefresh,
    toggleCompactCardView,
    setOnboardingCompleted,
  } = useConfig();

  // Repository Statistics Hook
  const {
    allRepos,
    trackedStats,
    aggregateStats,
    starDistribution,
    commitTrendData,
    isLoadingStats,
    error: statsError,
    refreshStats,
  } = useRepoStats(
    isAuthenticated,
    isDemoMode,
    config.trackedRepoIds,
    config.autoRefresh
  );

  // If user is not authenticated, show Welcome & Login Onboarding Modal
  if (!isAuthenticated) {
    return (
      <WelcomeAuthModal
        onLogin={loginWithToken}
        onDemoMode={enableDemoMode}
        isLoading={isAuthLoading}
        error={authError}
      />
    );
  }

  const detailedRepoList = Object.values(trackedStats);
  const activeDetailStats = selectedDetailRepoId ? trackedStats[selectedDetailRepoId] : null;

  return (
    <ResponsiveLayout
      user={user}
      rateLimit={rateLimit}
      isDemoMode={isDemoMode}
      activeTab={activeTab}
      onTabChange={tab => {
        if (tab === 'config') {
          setIsConfigOpen(true);
        } else {
          setActiveTab(tab);
        }
      }}
      trackedStats={trackedStats}
      selectedRepoId={selectedDetailRepoId}
      onSelectRepo={id => setSelectedDetailRepoId(id)}
      onOpenRepoSelector={() => setIsRepoSelectorOpen(true)}
      onOpenConfig={() => setIsConfigOpen(true)}
      onRefresh={refreshStats}
      isLoading={isLoadingStats}
    >
      {/* Error Alert if any */}
      {statsError && (
        <div className="mb-4 p-4 rounded-2xl bg-gh-red/15 border border-gh-red/30 text-gh-red text-xs flex items-center gap-2">
          <AlertTriangle size={16} className="flex-shrink-0" />
          <span>{statsError}</span>
        </div>
      )}

      {/* Main Tab Views */}
      {detailedRepoList.length === 0 ? (
        <EmptyState
          icon={FolderGit2}
          title="No Tracked Repositories Selected"
          description="Choose which repositories you want to monitor in your dashboard metrics, downloads, and commit trends."
          actionText="Select Repositories"
          onAction={() => setIsRepoSelectorOpen(true)}
        />
      ) : (
        <>
          {/* 1. DASHBOARD OVERVIEW TAB */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Dynamic KPI Metrics Grid */}
              <MetricsGrid
                stats={aggregateStats}
                visibleMetrics={config.visibleMetrics}
                compact={config.compactCardView}
              />

              {/* Primary Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <CommitActivityChart data={commitTrendData} />
                <StarForkComparisonChart data={starDistribution} />
              </div>

              {/* Secondary Breakdown Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <DownloadsBreakdownChart statsMap={trackedStats} />
                <IssuesPrRatioChart stats={aggregateStats} />
              </div>

              {/* Quick Repositories Section */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-gh-text uppercase tracking-wider text-gh-muted">
                    Tracked Repositories ({detailedRepoList.length})
                  </h2>
                  <button
                    onClick={() => setActiveTab('repositories')}
                    className="text-xs text-gh-blue hover:underline font-semibold"
                  >
                    View All
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  {detailedRepoList.map(st => (
                    <RepoListCard
                      key={st.repo.id}
                      stats={st}
                      onSelect={() => setSelectedDetailRepoId(st.repo.id)}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 2. REPOSITORIES TAB */}
          {activeTab === 'repositories' && (
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gh-text flex items-center gap-2">
                    <FolderGit2 size={20} className="text-gh-blue" />
                    Tracked Repositories
                  </h2>
                  <p className="text-xs text-gh-muted mt-0.5">
                    Click any repository to inspect binary releases, download tables, and community discussions
                  </p>
                </div>
                <button
                  onClick={() => setIsRepoSelectorOpen(true)}
                  className="px-4 py-2 bg-gh-blue text-white font-semibold rounded-xl hover:bg-gh-blue/90 active:scale-95 transition-all text-xs flex items-center gap-1.5 shadow-md"
                >
                  <Plus size={14} /> Add / Remove Repos
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {detailedRepoList.map(st => (
                  <RepoListCard
                    key={st.repo.id}
                    stats={st}
                    onSelect={() => setSelectedDetailRepoId(st.repo.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* 3. TRENDS & ANALYTICS TAB */}
          {activeTab === 'trends' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gh-text flex items-center gap-2">
                  <TrendingUp size={20} className="text-gh-green" />
                  Analytics & Velocity Trends
                </h2>
                <p className="text-xs text-gh-muted mt-0.5">
                  Deep-dive visualizations for commit activity, release downloads, and issue resolutions
                </p>
              </div>

              <div className="space-y-6">
                <CommitActivityChart data={commitTrendData} />
                <StarForkComparisonChart data={starDistribution} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <DownloadsBreakdownChart statsMap={trackedStats} />
                  <IssuesPrRatioChart stats={aggregateStats} />
                </div>
              </div>
            </div>
          )}

          {/* 4. COMPARE TAB */}
          {activeTab === 'compare' && (
            <ComparisonView
              statsMap={trackedStats}
              onSelectRepo={id => setSelectedDetailRepoId(id)}
            />
          )}
        </>
      )}

      {/* MODALS */}
      {/* 1. Repository Multi-Select Selector Modal */}
      {isRepoSelectorOpen && (
        <RepoMultiSelector
          allRepos={allRepos}
          selectedIds={config.trackedRepoIds}
          onToggleRepo={toggleTrackedRepo}
          onSelectMultiple={setTrackedRepoIds}
          onClose={() => {
            setIsRepoSelectorOpen(false);
            setOnboardingCompleted(true);
          }}
          onConfirm={() => {
            setIsRepoSelectorOpen(false);
            setOnboardingCompleted(true);
          }}
        />
      )}

      {/* 2. Repository Deep-Dive Modal */}
      {activeDetailStats && (
        <RepoDetailModal
          stats={activeDetailStats}
          onClose={() => setSelectedDetailRepoId(null)}
        />
      )}

      {/* 3. Settings & Metric Visibility Modal */}
      {isConfigOpen && (
        <ConfigModal
          config={config}
          user={user}
          rateLimit={rateLimit}
          isDemoMode={isDemoMode}
          onToggleMetric={toggleMetricVisibility}
          onSetAutoRefresh={setAutoRefresh}
          onToggleCompact={toggleCompactCardView}
          onSetTheme={setTheme}
          onClearCache={() => {
            refreshStats();
          }}
          onLogout={() => {
            setIsConfigOpen(false);
            logout();
          }}
          onClose={() => setIsConfigOpen(false)}
        />
      )}
    </ResponsiveLayout>
  );
}
export default App;
