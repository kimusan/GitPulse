import React, { useState, useMemo } from 'react';
import {
  Search,
  Check,
  Star,
  GitFork,
  Lock,
  Globe,
  SlidersHorizontal,
  X,
  Sparkles,
  CheckSquare,
  Square,
} from 'lucide-react';
import { GitHubRepository } from '../../types/github';
import { Badge } from '../common/Badge';
import clsx from 'clsx';

interface RepoMultiSelectorProps {
  allRepos: GitHubRepository[];
  selectedIds: number[];
  onToggleRepo: (id: number) => void;
  onSelectMultiple: (ids: number[]) => void;
  onClose?: () => void;
  onConfirm?: () => void;
  isModal?: boolean;
}

export const RepoMultiSelector: React.FC<RepoMultiSelectorProps> = ({
  allRepos,
  selectedIds,
  onToggleRepo,
  onSelectMultiple,
  onClose,
  onConfirm,
  isModal = true,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'public' | 'private' | 'source' | 'fork'>('all');

  const filteredRepos = useMemo(() => {
    return allRepos.filter(repo => {
      const matchesSearch =
        repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (repo.description && repo.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (repo.language && repo.language.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      if (filterType === 'public') return !repo.private;
      if (filterType === 'private') return repo.private;
      if (filterType === 'source') return !repo.fork;
      if (filterType === 'fork') return repo.fork;

      return true;
    });
  }, [allRepos, searchQuery, filterType]);

  const selectTop5 = () => {
    const sorted = [...allRepos].sort((a, b) => b.stargazers_count - a.stargazers_count);
    const top5Ids = sorted.slice(0, 5).map(r => r.id);
    onSelectMultiple(top5Ids);
  };

  const selectAll = () => {
    const allIds = filteredRepos.map(r => r.id);
    const combined = Array.from(new Set([...selectedIds, ...allIds]));
    onSelectMultiple(combined);
  };

  const deselectAll = () => {
    onSelectMultiple([]);
  };

  const content = (
    <div className="flex flex-col h-full max-h-[85vh]">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-gh-border flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gh-text flex items-center gap-2">
            <SlidersHorizontal size={20} className="text-gh-blue" />
            Select Tracked Repositories
          </h2>
          <p className="text-xs text-gh-muted mt-0.5">
            Choose repositories to aggregate in your dashboard metrics and trends
          </p>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gh-muted hover:text-gh-text hover:bg-gh-card transition-colors"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Controls: Search & Filters */}
      <div className="p-4 sm:p-6 pb-2 space-y-3">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gh-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by repository name, language, topic..."
            className="w-full pl-10 pr-4 py-2.5 bg-gh-card border border-gh-border rounded-xl text-gh-text placeholder-gh-muted text-sm focus:outline-none focus:border-gh-blue"
          />
        </div>

        {/* Filter Pills & Quick Actions */}
        <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            {(['all', 'public', 'private', 'source', 'fork'] as const).map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={clsx(
                  'px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-colors',
                  filterType === type
                    ? 'bg-gh-blue text-white'
                    : 'bg-gh-card text-gh-muted hover:text-gh-text hover:bg-gh-card/80 border border-gh-border'
                )}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={selectTop5}
              className="flex items-center gap-1 text-gh-yellow hover:underline"
            >
              <Sparkles size={13} /> Top 5 Stars
            </button>
            <span className="text-gh-border">|</span>
            <button
              onClick={selectAll}
              className="text-gh-blue hover:underline"
            >
              Select All ({filteredRepos.length})
            </button>
            <span className="text-gh-border">|</span>
            <button
              onClick={deselectAll}
              className="text-gh-red hover:underline"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Selected Count Banner */}
      <div className="px-4 sm:px-6 py-2 bg-gh-card/50 border-y border-gh-border/50 flex items-center justify-between text-xs">
        <span className="text-gh-muted">
          <strong className="text-gh-blue font-semibold">{selectedIds.length}</strong> of{' '}
          {allRepos.length} repositories selected
        </span>
        <span className="text-gh-muted">
          Showing {filteredRepos.length} matches
        </span>
      </div>

      {/* Repository List */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-2 divide-y divide-gh-border/20">
        {filteredRepos.length === 0 ? (
          <div className="py-12 text-center text-gh-muted text-sm">
            No repositories found matching "{searchQuery}"
          </div>
        ) : (
          filteredRepos.map(repo => {
            const isSelected = selectedIds.includes(repo.id);

            return (
              <div
                key={repo.id}
                onClick={() => onToggleRepo(repo.id)}
                className={clsx(
                  'flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer group',
                  isSelected
                    ? 'bg-gh-blue/10 border-gh-blue/40 shadow-sm'
                    : 'bg-gh-surface/50 hover:bg-gh-surface border-gh-border/60'
                )}
              >
                <div className="flex items-start gap-3 min-w-0 pr-2">
                  <div
                    className={clsx(
                      'mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center transition-colors flex-shrink-0',
                      isSelected
                        ? 'bg-gh-blue border-gh-blue text-white'
                        : 'border-gh-border bg-gh-card text-transparent group-hover:border-gh-blue/50'
                    )}
                  >
                    <Check size={13} strokeWidth={3} />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-gh-text text-sm group-hover:text-gh-blue transition-colors truncate">
                        {repo.name}
                      </span>
                      {repo.private ? (
                        <Badge variant="red" size="sm" icon={<Lock size={9} />}>
                          Private
                        </Badge>
                      ) : (
                        <Badge variant="gray" size="sm">
                          Public
                        </Badge>
                      )}
                      {repo.language && (
                        <Badge variant="blue" size="sm">
                          {repo.language}
                        </Badge>
                      )}
                    </div>
                    {repo.description && (
                      <p className="text-xs text-gh-muted truncate mt-0.5">
                        {repo.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0 text-xs text-gh-muted">
                  <div className="flex items-center gap-1">
                    <Star size={12} className="text-gh-blue" />
                    <span>{repo.stargazers_count.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1 hidden xs:flex">
                    <GitFork size={12} className="text-gh-pink" />
                    <span>{repo.forks_count.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="p-4 sm:p-6 border-t border-gh-border flex items-center justify-between gap-3 bg-gh-surface">
        <span className="text-xs text-gh-muted">
          {selectedIds.length === 0 ? 'Select at least 1 repository' : `${selectedIds.length} chosen`}
        </span>
        <button
          onClick={onConfirm || onClose}
          disabled={selectedIds.length === 0}
          className="px-6 py-2.5 bg-gh-blue text-white font-semibold rounded-xl hover:bg-gh-blue/90 active:scale-95 transition-all text-sm disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
        >
          Save Selection ({selectedIds.length})
        </button>
      </div>
    </div>
  );

  if (!isModal) {
    return <div className="bg-gh-surface border border-gh-border rounded-2xl">{content}</div>;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl bg-gh-surface border border-gh-border rounded-3xl shadow-2xl overflow-hidden animate-slide-up">
        {content}
      </div>
    </div>
  );
};
