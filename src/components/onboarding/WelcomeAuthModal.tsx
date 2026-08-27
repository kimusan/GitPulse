import React, { useState } from 'react';
import {
  KeyRound,
  Sparkles,
  ShieldCheck,
  ExternalLink,
  Zap,
  ArrowRight,
  TrendingUp,
  BarChart3,
  Layers,
  Server,
  Globe,
  Building2,
} from 'lucide-react';
import { GithubIcon } from '../common/GithubIcon';
import { normalizeInstanceUrl, isStandardGitHub } from '../../utils/githubEndpoints';

interface WelcomeAuthModalProps {
  onLogin: (token: string, instanceUrl?: string) => Promise<{ success: boolean; error?: string }>;
  onDemoMode: () => void;
  isLoading: boolean;
  error?: string | null;
}

export const WelcomeAuthModal: React.FC<WelcomeAuthModalProps> = ({
  onLogin,
  onDemoMode,
  isLoading,
  error: initialError,
}) => {
  const [token, setToken] = useState('');
  const [instanceUrl, setInstanceUrl] = useState('https://github.com');
  const [isEnterprise, setIsEnterprise] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) {
      setLocalError('Please paste your GitHub Personal Access Token');
      return;
    }
    setLocalError(null);
    const targetUrl = isEnterprise ? normalizeInstanceUrl(instanceUrl) : 'https://github.com';
    const res = await onLogin(token.trim(), targetUrl);
    if (!res.success) {
      setLocalError(res.error || 'Failed to authenticate with GitHub instance');
    }
  };

  const activeHost = isEnterprise ? normalizeInstanceUrl(instanceUrl) : 'https://github.com';
  const tokenUrl = `${activeHost}/settings/tokens/new?scopes=repo,read:user,read:org&description=GitPulse%20Stats%20App`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-gh-surface border border-gh-border rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden animate-fade-in my-auto">
        {/* Glow Accent Circles */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-gh-blue/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-gh-green/20 rounded-full blur-3xl pointer-events-none" />

        {/* Logo & Header */}
        <div className="text-center mb-6 relative">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-gh-card to-gh-surface border border-gh-border shadow-glow-blue mb-4">
            <GithubIcon size={36} className="text-gh-blue" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gh-text tracking-tight">
            Welcome to <span className="text-gh-blue">GitPulse</span>
          </h1>
          <p className="text-xs sm:text-sm text-gh-muted mt-2 max-w-sm mx-auto leading-relaxed">
            Real-time GitHub statistics, community traction, release download tracking, and velocity trends.
          </p>
        </div>

        {/* Feature Pills */}
        <div className="grid grid-cols-3 gap-2 mb-6 text-center text-xs">
          <div className="p-2.5 rounded-xl bg-gh-card/60 border border-gh-border/50 flex flex-col items-center gap-1">
            <BarChart3 size={16} className="text-gh-blue" />
            <span className="text-gh-text font-medium text-[11px]">Downloads & Stars</span>
          </div>
          <div className="p-2.5 rounded-xl bg-gh-card/60 border border-gh-border/50 flex flex-col items-center gap-1">
            <TrendingUp size={16} className="text-gh-green" />
            <span className="text-gh-text font-medium text-[11px]">Commit Velocity</span>
          </div>
          <div className="p-2.5 rounded-xl bg-gh-card/60 border border-gh-border/50 flex flex-col items-center gap-1">
            <Layers size={16} className="text-gh-purple" />
            <span className="text-gh-text font-medium text-[11px]">Multi-Repo Select</span>
          </div>
        </div>

        {/* Server Target Selector */}
        <div className="mb-4 bg-gh-card/40 border border-gh-border/70 rounded-2xl p-3 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-gh-text flex items-center gap-1.5">
              <Server size={13} className="text-gh-cyan" />
              GitHub Instance
            </label>
            <button
              type="button"
              onClick={() => setIsEnterprise(!isEnterprise)}
              className="text-[11px] text-gh-blue hover:underline font-semibold flex items-center gap-1"
            >
              {isEnterprise ? 'Use GitHub.com' : 'GitHub Enterprise?'}
            </button>
          </div>

          {isEnterprise ? (
            <div className="space-y-1.5 pt-1 animate-fade-in">
              <div className="relative">
                <input
                  type="text"
                  value={instanceUrl}
                  onChange={e => setInstanceUrl(e.target.value)}
                  placeholder="https://github.company.com"
                  className="w-full pl-8 pr-3 py-2 bg-gh-surface border border-gh-border rounded-xl text-gh-text placeholder-gh-muted focus:outline-none focus:border-gh-blue text-xs font-mono"
                />
                <Globe size={13} className="absolute left-2.5 top-2.5 text-gh-muted" />
              </div>
              <p className="text-[10px] text-gh-muted leading-tight">
                Enter your company’s GitHub Enterprise Server (GHES) or custom domain.
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-gh-muted bg-gh-surface/70 px-3 py-2 rounded-xl border border-gh-border/50">
              <Globe size={13} className="text-gh-green" />
              <span className="font-mono text-gh-text text-[11px]">https://github.com (Default)</span>
            </div>
          )}
        </div>

        {/* Token Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gh-text uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <KeyRound size={14} className="text-gh-blue" />
                Personal Access Token (PAT)
              </span>
              <a
                href={tokenUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gh-blue hover:underline text-xs flex items-center gap-1 font-normal lowercase tracking-normal"
              >
                Generate Token <ExternalLink size={11} />
              </a>
            </label>
            <input
              type="password"
              value={token}
              onChange={e => setToken(e.target.value)}
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              className="w-full px-4 py-3 bg-gh-card border border-gh-border rounded-xl text-gh-text placeholder-gh-muted focus:outline-none focus:border-gh-blue focus:ring-1 focus:ring-gh-blue text-sm font-mono transition-all"
            />
            <p className="text-[11px] text-gh-muted mt-1.5 flex items-center gap-1">
              <ShieldCheck size={12} className="text-gh-green" />
              Requires <code className="text-gh-blue">repo</code>, <code className="text-gh-blue">read:user</code> scopes. Token is securely saved on your device.
            </p>
          </div>

          {(localError || initialError) && (
            <div className="p-3 bg-gh-red/15 border border-gh-red/30 rounded-xl text-gh-red text-xs">
              {localError || initialError}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-gh-blue text-white font-semibold rounded-xl hover:bg-gh-blue/90 active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-sm shadow-md disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Connect GitHub Account <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Demo Mode Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gh-border/60" />
          </div>
          <span className="relative px-3 bg-gh-surface text-gh-muted text-xs uppercase tracking-wider font-semibold">
            Or
          </span>
        </div>

        {/* Quick Demo Button */}
        <button
          type="button"
          onClick={onDemoMode}
          className="w-full py-3 px-4 bg-gh-card hover:bg-gh-card/80 border border-gh-border text-gh-text font-medium rounded-xl active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-sm group"
        >
          <Sparkles size={16} className="text-gh-yellow group-hover:scale-110 transition-transform" />
          Explore Instant Demo Mode (Zero Credentials)
        </button>
      </div>
    </div>
  );
};
