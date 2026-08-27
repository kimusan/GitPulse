import { useState, useEffect, useCallback } from 'react';
import { UserAppConfig, ThemeMode, VisibleMetricsConfig, AutoRefreshInterval } from '../types/config';
import { StorageService } from '../services/storageService';

export function useConfig() {
  const [config, setConfig] = useState<UserAppConfig>(() => StorageService.getConfig());

  // Apply theme class to <html> element
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-github-dark', 'theme-oled-black', 'theme-light', 'theme-nord-blue', 'theme-dracula', 'theme-retro-crt', 'dark', 'light');

    if (config.theme === 'light') {
      root.classList.add('light', 'theme-light');
    } else {
      root.classList.add('dark');
      if (config.theme === 'oled-black') {
        root.classList.add('theme-oled-black');
      } else if (config.theme === 'nord-blue') {
        root.classList.add('theme-nord-blue');
      } else if (config.theme === 'dracula') {
        root.classList.add('theme-dracula');
      } else if (config.theme === 'retro-crt') {
        root.classList.add('theme-retro-crt');
      } else {
        root.classList.add('theme-github-dark');
      }
    }
  }, [config.theme]);

  const updateConfig = useCallback((partial: Partial<UserAppConfig>) => {
    const updated = StorageService.saveConfig(partial);
    setConfig(updated);
  }, []);

  const setTheme = useCallback((theme: ThemeMode) => {
    updateConfig({ theme });
  }, [updateConfig]);

  const setTrackedRepoIds = useCallback((trackedRepoIds: number[]) => {
    updateConfig({ trackedRepoIds });
  }, [updateConfig]);

  const toggleTrackedRepo = useCallback((repoId: number) => {
    const current = config.trackedRepoIds;
    const next = current.includes(repoId)
      ? current.filter(id => id !== repoId)
      : [...current, repoId];
    updateConfig({ trackedRepoIds: next });
  }, [config.trackedRepoIds, updateConfig]);

  const toggleMetricVisibility = useCallback((metricKey: keyof VisibleMetricsConfig) => {
    const updatedMetrics = {
      ...config.visibleMetrics,
      [metricKey]: !config.visibleMetrics[metricKey]
    };
    updateConfig({ visibleMetrics: updatedMetrics });
  }, [config.visibleMetrics, updateConfig]);

  const setAutoRefresh = useCallback((autoRefresh: AutoRefreshInterval) => {
    updateConfig({ autoRefresh });
  }, [updateConfig]);

  const toggleCompactCardView = useCallback(() => {
    updateConfig({ compactCardView: !config.compactCardView });
  }, [config.compactCardView, updateConfig]);

  const setOnboardingCompleted = useCallback((completed: boolean) => {
    updateConfig({ onboardingCompleted: completed });
  }, [updateConfig]);

  return {
    config,
    updateConfig,
    setTheme,
    setTrackedRepoIds,
    toggleTrackedRepo,
    toggleMetricVisibility,
    setAutoRefresh,
    toggleCompactCardView,
    setOnboardingCompleted
  };
}
