import React from 'react';
import {
  X,
  Sliders,
  Eye,
  RefreshCw,
  Trash2,
  Check,
  Shield,
  Layers,
  LayoutGrid,
  SunMoon,
  Clock,
} from 'lucide-react';
import { UserAppConfig, VisibleMetricsConfig, AutoRefreshInterval, ThemeMode } from '../../types/config';
import { RateLimitStatus, GitHubUser } from '../../types/github';
import clsx from 'clsx';

interface ConfigModalProps {
  config: UserAppConfig;
  user: GitHubUser | null;
  rateLimit: RateLimitStatus | null;
  isDemoMode: boolean;
  onToggleMetric: (metric: keyof VisibleMetricsConfig) => void;
  onSetAutoRefresh: (val: AutoRefreshInterval) => void;
  onToggleCompact: () => void;
  onSetTheme: (theme: ThemeMode) => void;
  onClearCache: () => void;
  onLogout: () => void;
  onClose: () => void;
}

export const ConfigModal: React.FC<ConfigModalProps> = ({
  config,
  user,
  rateLimit,
  isDemoMode,
  onToggleMetric,
  onSetAutoRefresh,
  onToggleCompact,
  onSetTheme,
  onClearCache,
  onLogout,
  onClose,
}) => {
  const metricOptions: Array<{ id: keyof VisibleMetricsConfig; label: string; desc: string }> = [
    { id: 'stars', label: 'Total Stars', desc: 'Aggregate stargazers across all tracked repositories' },
    { id: 'downloads', label: 'Release Downloads', desc: 'Total download counts across all release assets' },
    { id: 'pullRequests', label: 'Pull Requests', desc: 'Open, closed, and merged PR counts and merge rate' },
    { id: 'issues', label: 'Issues Velocity', desc: 'Open and resolved issues ratio and speed' },
    { id: 'discussions', label: 'Discussions & Comments', desc: 'GitHub discussion threads and community comments' },
    { id: 'forks', label: 'Forks & Watchers', desc: 'Repository forks and subscriber counts' },
    { id: 'commitVelocity', label: 'Annual Commit Activity', desc: 'Pushes and commit velocity over the year' },
    { id: 'topContributors', label: 'Contributors & Languages', desc: 'Unique contributors and primary language breakdown' },
  ];

  const refreshOptions: Array<{ value: AutoRefreshInterval; label: string }> = [
    { value: 'off', label: 'Manual' },
    { value: '15m', label: '15 Mins' },
    { value: '1h', label: '1 Hour' },
    { value: '6h', label: '6 Hours' },
    { value: '24h', label: '24 Hours' },
  ];

  const themeOptions: Array<{ value: ThemeMode; label: string; previewClass: string; textColor: string }> = [
    { value: 'github-dark', label: 'GitHub Dark', previewClass: 'bg-[#0d1117] border-[#30363d]', textColor: 'text-[#f0f6fc]' },
    { value: 'oled-black', label: 'OLED Black', previewClass: 'bg-[#000000] border-[#242424]', textColor: 'text-[#ffffff]' },
    { value: 'dracula', label: 'Dracula', previewClass: 'bg-[#282a36] border-[#6272a4]', textColor: 'text-[#50fa7b]' },
    { value: 'retro-crt', label: 'Retro CRT', previewClass: 'bg-[#050d08] border-[#1b4d25]', textColor: 'text-[#33ff57]' },
    { value: 'nord-blue', label: 'Nord Blue', previewClass: 'bg-[#181c24] border-[#3e4659]', textColor: 'text-[#eceff4]' },
    { value: 'light', label: 'Light Mode', previewClass: 'bg-[#ffffff] border-[#d0d7de]', textColor: 'text-[#1f2328]' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-hidden animate-fade-in">
      <div className="w-full max-w-2xl max-h-[90vh] bg-gh-surface border border-gh-border rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gh-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gh-card border border-gh-border flex items-center justify-center text-gh-blue">
              <Sliders size={18} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gh-text">Settings & Configuration</h2>
              <p className="text-xs text-gh-muted">Customize dashboard metrics, layout & cache</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-gh-muted hover:text-gh-text hover:bg-gh-card transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Theme Mode */}
          <div>
            <h3 className="text-xs font-semibold text-gh-text uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <SunMoon size={14} className="text-gh-yellow" />
              Theme & Appearance
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {themeOptions.map(th => (
                <button
                  key={th.value}
                  onClick={() => onSetTheme(th.value)}
                  className={clsx(
                    'p-3 rounded-2xl border text-left flex flex-col justify-between h-20 transition-all active:scale-95 cursor-pointer',
                    th.previewClass,
                    config.theme === th.value
                      ? 'ring-2 ring-gh-blue shadow-glow-blue'
                      : 'hover:opacity-90'
                  )}
                >
                  <span className={clsx('text-xs font-semibold', th.textColor)}>{th.label}</span>
                  {config.theme === th.value && (
                    <span className="self-end px-1.5 py-0.5 rounded bg-gh-blue text-white text-[10px] font-bold">
                      Active
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Metric Visibility Customization */}
          <div>
            <h3 className="text-xs font-semibold text-gh-text uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Eye size={14} className="text-gh-blue" />
              Visible Dashboard Metric Cards
            </h3>
            <div className="space-y-2">
              {metricOptions.map(opt => {
                const isEnabled = config.visibleMetrics[opt.id];
                return (
                  <div
                    key={opt.id}
                    onClick={() => onToggleMetric(opt.id)}
                    className={clsx(
                      'flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer select-none',
                      isEnabled
                        ? 'bg-gh-surface border-gh-border hover:border-gh-blue/50'
                        : 'bg-gh-card/30 border-gh-border/40 opacity-60'
                    )}
                  >
                    <div>
                      <h4 className="text-sm font-semibold text-gh-text">{opt.label}</h4>
                      <p className="text-xs text-gh-muted">{opt.desc}</p>
                    </div>
                    <div
                      className={clsx(
                        'w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5',
                        isEnabled ? 'bg-gh-blue' : 'bg-gh-border'
                      )}
                    >
                      <div
                        className={clsx(
                          'w-5 h-5 rounded-full bg-white transition-transform transform shadow-md',
                          isEnabled ? 'translate-x-5' : 'translate-x-0'
                        )}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Auto Refresh Interval */}
          <div>
            <h3 className="text-xs font-semibold text-gh-text uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Clock size={14} className="text-gh-green" />
              Auto Refresh Frequency
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              {refreshOptions.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => onSetAutoRefresh(opt.value)}
                  className={clsx(
                    'px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all',
                    config.autoRefresh === opt.value
                      ? 'bg-gh-green text-white border-gh-green shadow-sm'
                      : 'bg-gh-card border-gh-border text-gh-muted hover:text-gh-text'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Rate Limit & Connection Status */}
          <div className="bg-gh-card/50 border border-gh-border rounded-2xl p-4 text-xs space-y-2">
            <h3 className="font-semibold text-gh-text uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Shield size={13} className="text-gh-blue" />
              API Quota & Account Status
            </h3>
            <div className="flex items-center justify-between text-gh-muted">
              <span>Account Mode:</span>
              <strong className="text-gh-text">{isDemoMode ? 'Demo Mode (Mock API)' : user?.login || 'Connected'}</strong>
            </div>
            {rateLimit && (
              <div className="flex items-center justify-between text-gh-muted">
                <span>GitHub API Rate Limit:</span>
                <strong className="text-gh-green">
                  {rateLimit.remaining.toLocaleString()} / {rateLimit.limit.toLocaleString()} remaining
                </strong>
              </div>
            )}
          </div>

          {/* Danger / Action Zone */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => {
                onClearCache();
                alert('Stats cache cleared!');
              }}
              className="flex-1 py-2.5 px-4 bg-gh-card hover:bg-gh-border text-gh-text border border-gh-border rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
            >
              <RefreshCw size={13} /> Clear Cache
            </button>
            <button
              onClick={onLogout}
              className="py-2.5 px-4 bg-gh-red/15 hover:bg-gh-red text-gh-red hover:text-white border border-gh-red/30 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
            >
              <Trash2 size={13} /> Disconnect Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
