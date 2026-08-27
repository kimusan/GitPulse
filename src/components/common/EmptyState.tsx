import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionText,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-gh-surface/40 border border-gh-border/60 rounded-2xl backdrop-blur-sm">
      <div className="w-14 h-14 rounded-2xl bg-gh-card border border-gh-border flex items-center justify-center text-gh-blue mb-4 shadow-glow-blue">
        <Icon size={28} />
      </div>
      <h3 className="text-lg font-semibold text-gh-text mb-1">{title}</h3>
      <p className="text-sm text-gh-muted max-w-sm mb-5 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 bg-gh-blue text-white font-medium rounded-xl hover:bg-gh-blue/90 active:scale-95 transition-all text-sm shadow-md"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
