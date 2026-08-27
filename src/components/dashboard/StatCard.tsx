import React from 'react';
import { LucideIcon } from 'lucide-react';
import clsx from 'clsx';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'pink' | 'cyan';
  trend?: {
    value: string;
    positive?: boolean;
  };
  onClick?: () => void;
  compact?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'blue',
  trend,
  onClick,
  compact = false,
}) => {
  const colorMap = {
    blue: {
      border: 'hover:border-gh-blue/50 group-hover:shadow-glow-blue',
      iconBg: 'bg-gh-blue/15 text-gh-blue',
      badge: 'bg-gh-blue/10 text-gh-blue',
    },
    green: {
      border: 'hover:border-gh-green/50 group-hover:shadow-glow-green',
      iconBg: 'bg-gh-green/15 text-gh-green',
      badge: 'bg-gh-green/10 text-gh-green',
    },
    purple: {
      border: 'hover:border-gh-purple/50 group-hover:shadow-glow-purple',
      iconBg: 'bg-gh-purple/15 text-gh-purple',
      badge: 'bg-gh-purple/10 text-gh-purple',
    },
    orange: {
      border: 'hover:border-gh-orange/50',
      iconBg: 'bg-gh-orange/15 text-gh-orange',
      badge: 'bg-gh-orange/10 text-gh-orange',
    },
    red: {
      border: 'hover:border-gh-red/50',
      iconBg: 'bg-gh-red/15 text-gh-red',
      badge: 'bg-gh-red/10 text-gh-red',
    },
    pink: {
      border: 'hover:border-gh-pink/50',
      iconBg: 'bg-gh-pink/15 text-gh-pink',
      badge: 'bg-gh-pink/10 text-gh-pink',
    },
    cyan: {
      border: 'hover:border-gh-cyan/50',
      iconBg: 'bg-gh-cyan/15 text-gh-cyan',
      badge: 'bg-gh-cyan/10 text-gh-cyan',
    },
  };

  const currentTheme = colorMap[color];
  const formattedValue = typeof value === 'number' ? value.toLocaleString() : value;

  return (
    <div
      onClick={onClick}
      className={clsx(
        'group relative overflow-hidden rounded-2xl bg-gh-surface/80 border border-gh-border/80 p-4 transition-all duration-200 backdrop-blur-md',
        currentTheme.border,
        onClick && 'cursor-pointer active:scale-[0.98]',
        compact ? 'p-3' : 'p-4 sm:p-5'
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0 pr-2">
          <p className="text-xs font-medium text-gh-muted uppercase tracking-wider truncate mb-1">
            {title}
          </p>
          <h4
            className={clsx(
              'font-bold text-gh-text tracking-tight',
              compact ? 'text-xl' : 'text-2xl sm:text-3xl'
            )}
          >
            {formattedValue}
          </h4>
          {subtitle && (
            <p className="text-xs text-gh-muted mt-1 truncate font-mono">
              {subtitle}
            </p>
          )}
        </div>
        <div
          className={clsx(
            'flex-shrink-0 flex items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110',
            currentTheme.iconBg,
            compact ? 'w-9 h-9' : 'w-11 h-11'
          )}
        >
          <Icon size={compact ? 18 : 22} />
        </div>
      </div>

      {trend && (
        <div className="mt-3 pt-3 border-t border-gh-border/40 flex items-center gap-1.5 text-xs">
          <span
            className={clsx(
              'font-medium px-1.5 py-0.5 rounded',
              trend.positive !== false
                ? 'bg-gh-green/15 text-gh-green'
                : 'bg-gh-red/15 text-gh-red'
            )}
          >
            {trend.value}
          </span>
          <span className="text-gh-muted text-[11px]">vs previous cycle</span>
        </div>
      )}
    </div>
  );
};
