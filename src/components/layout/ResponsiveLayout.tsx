import React from 'react';
import { useResponsive } from '../../hooks/useResponsive';
import { ActiveTab } from '../../types/config';
import { RepoDetailedStats } from '../../types/stats';
import { GitHubUser, RateLimitStatus } from '../../types/github';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { NavRail } from './NavRail';
import { Sidebar } from './Sidebar';

interface ResponsiveLayoutProps {
  user: GitHubUser | null;
  rateLimit: RateLimitStatus | null;
  isDemoMode: boolean;
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  trackedStats: Record<number, RepoDetailedStats>;
  selectedRepoId: number | null;
  onSelectRepo: (id: number) => void;
  onOpenRepoSelector: () => void;
  onOpenConfig: () => void;
  onRefresh: () => void;
  isLoading: boolean;
  children: React.ReactNode;
}

export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  user,
  rateLimit,
  isDemoMode,
  activeTab,
  onTabChange,
  trackedStats,
  selectedRepoId,
  onSelectRepo,
  onOpenRepoSelector,
  onOpenConfig,
  onRefresh,
  isLoading,
  children,
}) => {
  const { isCompact, isMedium, isExpanded } = useResponsive();
  const trackedCount = Object.keys(trackedStats).length;

  return (
    <div className="min-h-screen bg-gh-bg text-gh-text flex flex-col md:flex-row transition-colors">
      {/* 1. Medium Navigation Rail (600px - 840px, e.g. Flip Phone Unfolded / Foldable / Small Tablet) */}
      {isMedium && (
        <NavRail activeTab={activeTab} onTabChange={onTabChange} />
      )}

      {/* 2. Expanded Sidebar (>840px, Tablet Landscape / Desktop) */}
      {isExpanded && (
        <Sidebar
          activeTab={activeTab}
          onTabChange={onTabChange}
          trackedStats={trackedStats}
          selectedRepoId={selectedRepoId}
          onSelectRepo={onSelectRepo}
          onOpenRepoSelector={onOpenRepoSelector}
        />
      )}

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 sm:pb-0">
        <Header
          user={user}
          rateLimit={rateLimit}
          isDemoMode={isDemoMode}
          activeTab={activeTab}
          trackedCount={trackedCount}
          isLoading={isLoading}
          onRefresh={onRefresh}
          onOpenRepoSelector={onOpenRepoSelector}
          onOpenConfig={onOpenConfig}
        />

        <main className="flex-1 p-3 sm:p-6 max-w-7xl w-full mx-auto animate-fade-in">
          {children}
        </main>
      </div>

      {/* 3. Compact Bottom Nav (<600px, Standard Phone Portrait) */}
      {isCompact && (
        <BottomNav activeTab={activeTab} onTabChange={onTabChange} />
      )}
    </div>
  );
};
