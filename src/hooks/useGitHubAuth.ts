import { useState, useEffect, useCallback } from 'react';
import { GitHubUser, RateLimitStatus } from '../types/github';
import { StorageService } from '../services/storageService';
import { GitHubApiService } from '../services/githubApi';
import { MOCK_USER } from '../services/mockDataService';

export interface GitHubAuthState {
  isAuthenticated: boolean;
  isDemoMode: boolean;
  user: GitHubUser | null;
  instanceUrl: string;
  isLoading: boolean;
  error: string | null;
  rateLimit: RateLimitStatus | null;
}

export function useGitHubAuth() {
  const [state, setState] = useState<GitHubAuthState>(() => {
    const isDemo = StorageService.isDemoMode();
    const token = StorageService.getAuthToken();
    const cachedUser = StorageService.getUserProfile();
    const rateLimit = StorageService.getRateLimit();
    const instanceUrl = StorageService.getInstanceUrl();

    return {
      isAuthenticated: Boolean(token) || isDemo,
      isDemoMode: isDemo,
      user: isDemo ? MOCK_USER : cachedUser,
      instanceUrl,
      isLoading: false,
      error: null,
      rateLimit
    };
  });

  const checkAuth = useCallback(async () => {
    const isDemo = StorageService.isDemoMode();
    const instanceUrl = StorageService.getInstanceUrl();

    if (isDemo) {
      setState(prev => ({
        ...prev,
        isAuthenticated: true,
        isDemoMode: true,
        user: MOCK_USER,
        instanceUrl,
        isLoading: false,
        error: null,
        rateLimit: { limit: 5000, remaining: 4980, reset: Math.floor(Date.now() / 1000) + 3600, used: 20 }
      }));
      return;
    }

    const token = StorageService.getAuthToken();
    if (!token) {
      setState(prev => ({
        ...prev,
        isAuthenticated: false,
        isDemoMode: false,
        user: null,
        instanceUrl,
        isLoading: false,
      }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const user = await GitHubApiService.getUserProfile();
      const rateLimit = StorageService.getRateLimit();
      setState({
        isAuthenticated: true,
        isDemoMode: false,
        user,
        instanceUrl,
        isLoading: false,
        error: null,
        rateLimit
      });
    } catch (err: unknown) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to authenticate'
      }));
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const loginWithToken = async (token: string, instanceUrl?: string): Promise<{ success: boolean; error?: string }> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    const targetUrl = instanceUrl || state.instanceUrl || 'https://github.com';
    const result = await GitHubApiService.verifyToken(token, targetUrl);

    if (result.valid && result.user) {
      StorageService.setInstanceUrl(targetUrl);
      StorageService.setAuthToken(token);
      StorageService.setDemoMode(false);
      StorageService.setUserProfile(result.user);
      const rateLimit = StorageService.getRateLimit();

      setState({
        isAuthenticated: true,
        isDemoMode: false,
        user: result.user,
        instanceUrl: StorageService.getInstanceUrl(),
        isLoading: false,
        error: null,
        rateLimit
      });
      return { success: true };
    } else {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: result.error || 'Authentication failed'
      }));
      return { success: false, error: result.error };
    }
  };

  const updateInstanceUrl = (newUrl: string) => {
    StorageService.setInstanceUrl(newUrl);
    setState(prev => ({ ...prev, instanceUrl: StorageService.getInstanceUrl() }));
  };

  const enableDemoMode = () => {
    StorageService.removeAuthToken();
    StorageService.setDemoMode(true);
    StorageService.setUserProfile(MOCK_USER);
    StorageService.saveConfig({
      trackedRepoIds: [101, 102, 103, 104, 105],
      onboardingCompleted: true
    });

    setState({
      isAuthenticated: true,
      isDemoMode: true,
      user: MOCK_USER,
      instanceUrl: 'https://github.com',
      isLoading: false,
      error: null,
      rateLimit: { limit: 5000, remaining: 4980, reset: Math.floor(Date.now() / 1000) + 3600, used: 20 }
    });
  };

  const logout = () => {
    StorageService.clearAll();
    setState({
      isAuthenticated: false,
      isDemoMode: false,
      user: null,
      instanceUrl: 'https://github.com',
      isLoading: false,
      error: null,
      rateLimit: null
    });
  };

  return {
    ...state,
    loginWithToken,
    updateInstanceUrl,
    enableDemoMode,
    logout,
    refreshUser: checkAuth
  };
}
