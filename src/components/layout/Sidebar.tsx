import React from 'react';
import {
  LayoutDashboard,
  FolderGit2,
  TrendingUp,
  Layers,
  Sliders,
  Star,
  Download,
  Plus,
} from 'lucide-react';
import { GithubIcon } from '../common/GithubIcon';
import { ActiveTab } from '../../types/config';
import { RepoDetailedStats } from '../../types/stats';
import clsx from 'clsx';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  trackedStats: Record<number, RepoDetailedStats>;
  selectedRepoId: number | null;
  onSelectRepo: (id: number) => void;
  onOpenRepoSelector: () => void;
  onOpenAbout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  trackedStats,
  selectedRepoId,
  onSelectRepo,
  onOpenRepoSelector,
  onOpenAbout,
}) => {
  const navItems: Array<{ id: ActiveTab; label: string; icon: React.ReactNode }> = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: <LayoutDashboard size={18} /> },
    { id: 'repositories', label: 'All Repositories', icon: <FolderGit2 size={18} /> },
    { id: 'trends', label: 'Analytics & Trends', icon: <TrendingUp size={18} /> },
    { id: 'compare', label: 'Side-by-Side Compare', icon: <Layers size={18} /> },
    { id: 'config', label: 'Settings & Metrics', icon: <Sliders size={18} /> },
  ];

  const repoList = Object.values(trackedStats);

  return (
    <aside className="w-64 bg-gh-surface border-r border-gh-border flex flex-col flex-shrink-0 h-screen sticky top-0 overflow-y-auto">
      {/* Navigation Section */}
      <div className="p-4 space-y-1.5 border-b border-gh-border/60">
        <span className="text-[10px] font-bold text-gh-muted uppercase tracking-wider px-3 mb-1 block">
          Navigation
        </span>
        {navItems.map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={clsx(
                'w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150',
                isActive
                  ? 'bg-gh-blue/15 text-gh-blue border border-gh-blue/30 shadow-sm'
                  : 'text-gh-muted hover:text-gh-text hover:bg-gh-card'
              )}
            >
              <div className={clsx(isActive ? 'text-gh-blue' : 'text-gh-muted')}>
                {item.icon}
              </div>
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tracked Repositories Quick Switcher */}
      <div className="p-4 flex-1 overflow-y-auto space-y-2">
        <div className="flex items-center justify-between px-1 mb-1">
          <span className="text-[10px] font-bold text-gh-muted uppercase tracking-wider">
            Tracked Repos ({repoList.length})
          </span>
          <button
            onClick={onOpenRepoSelector}
            className="p-1 rounded-lg text-gh-blue hover:bg-gh-card transition-colors text-xs flex items-center gap-0.5"
            title="Add or Edit Repositories"
          >
            <Plus size={14} />
          </button>
        </div>

        {repoList.length === 0 ? (
          <div className="py-6 text-center text-gh-muted text-xs">
            No tracked repos yet.
          </div>
        ) : (
          <div className="space-y-1">
            {repoList.map(st => {
              const isSelected = selectedRepoId === st.repo.id;
              return (
                <div
                  key={st.repo.id}
                  onClick={() => onSelectRepo(st.repo.id)}
                  className={clsx(
                    'p-2.5 rounded-xl border transition-all cursor-pointer group',
                    isSelected
                      ? 'bg-gh-card border-gh-blue/40 shadow-sm'
                      : 'bg-gh-surface hover:bg-gh-card/50 border-gh-border/40'
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-gh-text group-hover:text-gh-blue transition-colors truncate">
                      {st.repo.name}
                    </span>
                    <span className="text-[11px] text-gh-muted font-mono flex-shrink-0 flex items-center gap-1">
                      <Star size={10} className="text-gh-blue" />
                      {st.repo.stargazers_count}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-gh-muted mt-1">
                    <span className="text-gh-green font-medium">
                      {st.totalDownloads.toLocaleString()} dl
                    </span>
                    <span>{st.openIssuesCount} issues</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Branding & About link */}
      <div
        onClick={onOpenAbout}
        className="p-4 border-t border-gh-border/60 text-xs text-gh-muted flex items-center justify-between cursor-pointer hover:bg-gh-card/50 transition-colors"
        title="About GitPulse"
      >
        <div className="flex items-center gap-1.5">
          <GithubIcon size={14} />
          <span className="font-semibold text-gh-text text-[11px]">GitPulse v1.0.0</span>
        </div>
        <span className="text-[10px] text-gh-blue font-medium hover:underline">About</span>
      </div>
    </aside>
  );
};
