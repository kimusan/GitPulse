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

interface NavRailProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export const NavRail: React.FC<NavRailProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabs: Array<{ id: ActiveTab; label: string; icon: React.ReactNode }> = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'repositories', label: 'Repos', icon: <FolderGit2 size={20} /> },
    { id: 'trends', label: 'Trends', icon: <TrendingUp size={20} /> },
    { id: 'compare', label: 'Compare', icon: <Layers size={20} /> },
    { id: 'config', label: 'Config', icon: <Sliders size={20} /> },
  ];

  return (
    <aside className="w-20 bg-gh-surface border-r border-gh-border flex flex-col items-center py-4 flex-shrink-0 h-screen sticky top-0">
      <div className="space-y-3 w-full px-2">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={clsx(
                'w-full flex flex-col items-center justify-center p-2.5 rounded-2xl transition-all duration-200 group',
                isActive
                  ? 'bg-gh-blue/15 text-gh-blue font-semibold border border-gh-blue/30 shadow-sm'
                  : 'text-gh-muted hover:text-gh-text hover:bg-gh-card'
              )}
              title={tab.label}
            >
              <div className={clsx(isActive ? 'text-gh-blue' : 'text-gh-muted group-hover:text-gh-text')}>
                {tab.icon}
              </div>
              <span className="text-[10px] mt-1 tracking-tight truncate w-full text-center">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
};
