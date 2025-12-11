import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../common/api';
import Config from '../conf';
import { useProjectVariable } from './useProjectVariable';

export interface ClaudeTokenResponse {
  claude_token: string;
  project: string;
  message?: string;
}

export interface ClaudeTokenRequest {
  claude_token: string;
}

export interface ClaudeTokenHookReturn {
  token: string | null;
  maskedToken: string | null;
  isLoading: boolean;
  error: string | null;
  hasToken: boolean;
  setToken: (token: string) => Promise<void>;
  updateToken: (token: string) => Promise<void>;
  deleteToken: () => Promise<void>;
  refetchToken: () => void;
}

export const useClaudeToken = (): ClaudeTokenHookReturn => {
  const { project } = useProjectVariable();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  // Query to get Claude token
  const { 
    data: tokenData, 
    isLoading, 
    refetch: refetchToken 
  } = useQuery({
    queryKey: ['claude-token', project],
    queryFn: async (): Promise<ClaudeTokenResponse> => {
      const response = await api.get<ClaudeTokenResponse>(
        `${Config.baseApi}setting/claude-token?project=${project}`
      );
      return response.data;
    },
    enabled: !!project,
    refetchOnWindowFocus: false,
  });

  // Mutation to set new token
  const setTokenMutation = useMutation({
    mutationFn: async (token: string): Promise<ClaudeTokenResponse> => {
      const response = await api.post<ClaudeTokenResponse>(
        `${Config.baseApi}setting/claude-token?project=${project}`,
        { claude_token: token }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['claude-token', project] });
      setError(null);
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to set Claude token');
    }
  });

  // Mutation to update token
  const updateTokenMutation = useMutation({
    mutationFn: async (token: string): Promise<ClaudeTokenResponse> => {
      const response = await api.put<ClaudeTokenResponse>(
        `${Config.baseApi}setting/claude-token?project=${project}`,
        { claude_token: token }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['claude-token', project] });
      setError(null);
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to update Claude token');
    }
  });

  // Mutation to delete token
  const deleteTokenMutation = useMutation({
    mutationFn: async (): Promise<ClaudeTokenResponse> => {
      const response = await api.delete<ClaudeTokenResponse>(
        `${Config.baseApi}setting/claude-token?project=${project}`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['claude-token', project] });
      setError(null);
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to delete Claude token');
    }
  });

  // Helper functions
  const setToken = async (token: string): Promise<void> => {
    await setTokenMutation.mutateAsync(token);
  };

  const updateToken = async (token: string): Promise<void> => {
    await updateTokenMutation.mutateAsync(token);
  };

  const deleteToken = async (): Promise<void> => {
    await deleteTokenMutation.mutateAsync();
  };

  // Clear localStorage claude token on mount (migration)
  useEffect(() => {
    const oldToken = localStorage.getItem('elchi_ai_token');
    if (oldToken && tokenData?.claude_token) {
      localStorage.removeItem('elchi_ai_token');
    }
  }, [tokenData]);

  // Check for mutations loading state
  const isMutationLoading = setTokenMutation.isPending || 
                           updateTokenMutation.isPending || 
                           deleteTokenMutation.isPending;

  // Create masked token for display
  const maskedToken = tokenData?.claude_token 
    ? tokenData.claude_token.length > 8 
      ? tokenData.claude_token.substring(0, 8) + '*'.repeat(tokenData.claude_token.length - 8)
      : tokenData.claude_token
    : null;

  return {
    token: tokenData?.claude_token || null,
    maskedToken,
    isLoading: isLoading || isMutationLoading,
    error: error || setTokenMutation.error?.message || updateTokenMutation.error?.message || deleteTokenMutation.error?.message || null,
    hasToken: !!(tokenData?.claude_token && tokenData.claude_token !== ''),
    setToken,
    updateToken, 
    deleteToken,
    refetchToken
  };
};