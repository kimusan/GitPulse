import React from 'react';
import clsx from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'gray' | 'pink' | 'cyan';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'blue',
  size = 'sm',
  icon,
  className = ''
}) => {
  const variantStyles = {
    blue: 'bg-gh-blue/15 text-gh-blue border-gh-blue/30',
    green: 'bg-gh-green/15 text-gh-green border-gh-green/30',
    purple: 'bg-gh-purple/15 text-gh-purple border-gh-purple/30',
    orange: 'bg-gh-orange/15 text-gh-orange border-gh-orange/30',
    red: 'bg-gh-red/15 text-gh-red border-gh-red/30',
    gray: 'bg-gray-500/15 text-gray-300 border-gray-500/30',
    pink: 'bg-gh-pink/15 text-gh-pink border-gh-pink/30',
    cyan: 'bg-gh-cyan/15 text-gh-cyan border-gh-cyan/30',
  };

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5 rounded-full font-medium',
    md: 'text-sm px-2.5 py-1 rounded-full font-medium',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 border transition-colors',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
