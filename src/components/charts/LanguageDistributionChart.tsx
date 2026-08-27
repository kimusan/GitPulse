import React from 'react';
import { LanguageBytes } from '../../types/github';

interface LanguageDistributionChartProps {
  languages: LanguageBytes;
  title?: string;
}

export const LanguageDistributionChart: React.FC<LanguageDistributionChartProps> = ({
  languages,
  title = 'Languages Composition'
}) => {
  const entries = Object.entries(languages);
  const totalBytes = entries.reduce((sum, [, bytes]) => sum + bytes, 0);

  if (totalBytes === 0) {
    return null;
  }

  const LANG_COLORS: Record<string, string> = {
    Rust: '#dea584',
    TypeScript: '#3178c6',
    JavaScript: '#f1e05a',
    Kotlin: '#a97bff',
    Java: '#b07219',
    Go: '#00add8',
    Python: '#3572a5',
    HTML: '#e34c26',
    CSS: '#563d7c',
    GLSL: '#5686a5',
    C: '#555555',
    'C++': '#f34b7d',
    Shell: '#89e051',
  };

  const calculated = entries
    .map(([lang, bytes]) => ({
      name: lang,
      bytes,
      percentage: ((bytes / totalBytes) * 100).toFixed(1),
      color: LANG_COLORS[lang] || '#58a6ff',
    }))
    .sort((a, b) => b.bytes - a.bytes);

  return (
    <div className="w-full bg-gh-surface/80 border border-gh-border/80 rounded-2xl p-4 sm:p-5 backdrop-blur-sm">
      <h3 className="text-sm font-semibold text-gh-text mb-3 flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-gh-purple inline-block" />
        {title}
      </h3>

      {/* Progress Multi-Bar */}
      <div className="h-3 w-full rounded-full overflow-hidden flex bg-gh-card">
        {calculated.map(item => (
          <div
            key={item.name}
            style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
            className="h-full transition-all duration-500 first:rounded-l-full last:rounded-r-full"
            title={`${item.name}: ${item.percentage}%`}
          />
        ))}
      </div>

      {/* Badges Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 text-xs">
        {calculated.map(item => (
          <div key={item.name} className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <span className="font-medium text-gh-text">{item.name}</span>
            <span className="text-gh-muted">{item.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};
