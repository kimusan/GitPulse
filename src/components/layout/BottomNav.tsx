import React from 'react';
import {
  LayoutDashboard,
  FolderGit2,
  TrendingUp,
  Layers,
  Sliders,
} from 'lucide-react';
import { ActiveTab } from '../../types/config';
import clsx from 'clsx';

interface BottomNavProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabs: Array<{ id: ActiveTab; label: string; icon: React.ReactNode }> = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={19} /> },
    { id: 'repositories', label: 'Repos', icon: <FolderGit2 size={19} /> },
    { id: 'trends', label: 'Trends', icon: <TrendingUp size={19} /> },
    { id: 'compare', label: 'Compare', icon: <Layers size={19} /> },
    { id: 'config', label: 'Config', icon: <Sliders size={19} /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-gh-surface/90 backdrop-blur-lg border-t border-gh-border/80 px-2 py-1.5 flex items-center justify-around sm:hidden shadow-lg safe-bottom">
      {tabs.map(tab => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={clsx(
              'flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 min-w-[56px]',
              isActive
                ? 'text-gh-blue font-semibold scale-105'
                : 'text-gh-muted hover:text-gh-text'
            )}
          >
            <div className={clsx(isActive && 'animate-pulse-subtle')}>{tab.icon}</div>
            <span className="text-[10px] mt-0.5 tracking-tight">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
