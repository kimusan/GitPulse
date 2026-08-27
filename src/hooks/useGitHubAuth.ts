import { useState, useEffect, useCallback } from 'react';
import { GitHubUser, RateLimitStatus } from '../types/github';
import { StorageService } from '../services/storageService';
import { GitHubApiService } from '../services/githubApi';
import { MOCK_USER } from '../services/mockDataService';

export interface GitHubAuthState {
  isAuthenticated: boolean;
  isDemoMode: boolean;
  user: GitHubUser | null;
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

    return {
      isAuthenticated: Boolean(token) || isDemo,
      isDemoMode: isDemo,
      user: isDemo ? MOCK_USER : cachedUser,
      isLoading: false,
      error: null,
      rateLimit
    };
  });

  const checkAuth = useCallback(async () => {
    const isDemo = StorageService.isDemoMode();
    if (isDemo) {
      setState(prev => ({
        ...prev,
        isAuthenticated: true,
        isDemoMode: true,
        user: MOCK_USER,
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

  const loginWithToken = async (token: string): Promise<{ success: boolean; error?: string }> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    const result = await GitHubApiService.verifyToken(token);

    if (result.valid && result.user) {
      StorageService.setAuthToken(token);
      StorageService.setDemoMode(false);
      StorageService.setUserProfile(result.user);
      const rateLimit = StorageService.getRateLimit();

      setState({
        isAuthenticated: true,
        isDemoMode: false,
        user: result.user,
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
      isLoading: false,
      error: null,
      rateLimit: null
    });
  };

  return {
    ...state,
    loginWithToken,
    enableDemoMode,
    logout,
    refreshUser: checkAuth
  };
}
