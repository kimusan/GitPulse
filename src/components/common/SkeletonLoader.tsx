import React from 'react';
import clsx from 'clsx';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rect' | 'circle';
}

export const SkeletonLoader: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rect'
}) => {
  return (
    <div
      className={clsx(
        'animate-pulse bg-gh-border/50',
        variant === 'circle' && 'rounded-full',
        variant === 'text' && 'h-4 rounded',
        variant === 'rect' && 'rounded-xl',
        className
      )}
    />
  );
};
