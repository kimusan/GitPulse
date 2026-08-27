import React from 'react';
import {
  RefreshCw,
  SlidersHorizontal,
  Layers,
  Sparkles,
  Info,
} from 'lucide-react';
import { GithubIcon } from '../common/GithubIcon';
import { GitHubUser, RateLimitStatus } from '../../types/github';
import { ActiveTab } from '../../types/config';
import { APP_VERSION } from '../../constants/version';

interface HeaderProps {
  user: GitHubUser | null;
  rateLimit: RateLimitStatus | null;
  isDemoMode: boolean;
  activeTab: ActiveTab;
  trackedCount: number;
  isLoading: boolean;
  onRefresh: () => void;
  onOpenRepoSelector: () => void;
  onOpenConfig: () => void;
  onOpenAbout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  rateLimit,
  isDemoMode,
  activeTab,
  trackedCount,
  isLoading,
  onRefresh,
  onOpenRepoSelector,
  onOpenConfig,
  onOpenAbout,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-gh-surface/80 backdrop-blur-md border-b border-gh-border/80 px-4 sm:px-6 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Brand & Mode Tag */}
        <div className="flex items-center gap-3 min-w-0">
          <div
            onClick={onOpenAbout}
            className="w-9 h-9 rounded-xl bg-gradient-to-tr from-gh-card to-gh-surface border border-gh-border flex items-center justify-center text-gh-blue shadow-glow-blue flex-shrink-0 cursor-pointer hover:scale-105 transition-transform"
            title="About GitPulse"
          >
            <GithubIcon size={20} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-extrabold text-gh-text tracking-tight flex items-center gap-1.5 truncate">
                GitPulse
              </h1>
              <span className="px-1.5 py-0.2 rounded-md bg-gh-card border border-gh-border text-gh-muted text-[10px] font-mono font-bold">
                v{APP_VERSION}
              </span>
              {isDemoMode ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gh-yellow/15 text-gh-yellow border border-gh-yellow/30 flex items-center gap-1">
                  <Sparkles size={10} /> Demo
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gh-green/15 text-gh-green border border-gh-green/30">
                  Live
                </span>
              )}
            </div>
            {user && (
              <p className="text-[11px] text-gh-muted truncate">
                {user.name || user.login}
              </p>
            )}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Tracked Repos Multi-Select Quick Button */}
          <button
            onClick={onOpenRepoSelector}
            className="px-3 py-1.5 bg-gh-card hover:bg-gh-card/80 border border-gh-border text-gh-text rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
            title="Manage Tracked Repositories"
          >
            <Layers size={14} className="text-gh-blue" />
            <span className="hidden sm:inline">Tracked:</span>
            <span className="px-1.5 py-0.2 rounded-md bg-gh-blue/20 text-gh-blue font-bold">
              {trackedCount}
            </span>
          </button>

          {/* Sync / Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2 bg-gh-card hover:bg-gh-card/80 border border-gh-border text-gh-muted hover:text-gh-text rounded-xl transition-all active:scale-95 disabled:opacity-50"
            title="Refresh All Statistics"
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin text-gh-green' : ''} />
          </button>

          {/* About Button */}
          {onOpenAbout && (
            <button
              onClick={onOpenAbout}
              className="p-2 bg-gh-card hover:bg-gh-card/80 border border-gh-border text-gh-muted hover:text-gh-text rounded-xl transition-all active:scale-95"
              title="About GitPulse & Creator"
            >
              <Info size={16} />
            </button>
          )}

          {/* Settings Button */}
          <button
            onClick={onOpenConfig}
            className="p-2 bg-gh-card hover:bg-gh-card/80 border border-gh-border text-gh-muted hover:text-gh-text rounded-xl transition-all active:scale-95"
            title="App Settings & Visibility"
          >
            <SlidersHorizontal size={16} />
          </button>

          {/* User Avatar */}
          {user && (
            <img
              src={user.avatar_url}
              alt={user.login}
              onClick={onOpenConfig}
              className="w-8 h-8 rounded-xl border border-gh-border cursor-pointer hover:border-gh-blue transition-colors flex-shrink-0"
              title={`Logged in as ${user.login}`}
            />
          )}
        </div>
      </div>
    </header>
  );
};
