import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../common/api';
import Config from '../conf';
import { useProjectVariable } from './useProjectVariable';

export interface OpenRouterTokenResponse {
  openrouter_token: string;
  ai_default_model: string;
  project: string;
  message?: string;
}

export interface OpenRouterTokenRequest {
  openrouter_token: string;
  ai_default_model?: string;
}

export interface OpenRouterTokenHookReturn {
  token: string | null;
  model: string | null;
  maskedToken: string | null;
  isLoading: boolean;
  error: string | null;
  hasToken: boolean;
  setToken: (token: string, model?: string) => Promise<void>;
  updateToken: (token: string, model?: string) => Promise<void>;
  deleteToken: () => Promise<void>;
  refetchToken: () => void;
}

export const useOpenRouterToken = (): OpenRouterTokenHookReturn => {
  const { project } = useProjectVariable();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  // Query to get OpenRouter token
  const { 
    data: tokenData, 
    isLoading, 
    refetch: refetchToken 
  } = useQuery({
    queryKey: ['openrouter-token', project],
    queryFn: async (): Promise<OpenRouterTokenResponse> => {
      const response = await api.get<OpenRouterTokenResponse>(
        `${Config.baseApi}setting/openrouter-token?project=${project}`
      );
      return response.data;
    },
    enabled: !!project,
    refetchOnWindowFocus: false,
  });

  // Mutation to set new token
  const setTokenMutation = useMutation({
    mutationFn: async ({ token, model }: { token: string; model?: string }): Promise<OpenRouterTokenResponse> => {
      const requestData: OpenRouterTokenRequest = { openrouter_token: token };
      if (model) {
        requestData.ai_default_model = model;
      }
      
      const response = await api.post<OpenRouterTokenResponse>(
        `${Config.baseApi}setting/openrouter-token?project=${project}`,
        requestData
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['openrouter-token', project] });
      setError(null);
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to set OpenRouter token');
    }
  });

  // Mutation to update token
  const updateTokenMutation = useMutation({
    mutationFn: async ({ token, model }: { token: string; model?: string }): Promise<OpenRouterTokenResponse> => {
      const requestData: OpenRouterTokenRequest = { openrouter_token: token };
      if (model) {
        requestData.ai_default_model = model;
      }
      
      const response = await api.put<OpenRouterTokenResponse>(
        `${Config.baseApi}setting/openrouter-token?project=${project}`,
        requestData
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['openrouter-token', project] });
      setError(null);
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to update OpenRouter token');
    }
  });

  // Mutation to delete token
  const deleteTokenMutation = useMutation({
    mutationFn: async (): Promise<OpenRouterTokenResponse> => {
      const response = await api.delete<OpenRouterTokenResponse>(
        `${Config.baseApi}setting/openrouter-token?project=${project}`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['openrouter-token', project] });
      setError(null);
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to delete OpenRouter token');
    }
  });

  // Helper functions
  const setToken = async (token: string, model?: string): Promise<void> => {
    await setTokenMutation.mutateAsync({ token, model });
  };

  const updateToken = async (token: string, model?: string): Promise<void> => {
    await updateTokenMutation.mutateAsync({ token, model });
  };

  const deleteToken = async (): Promise<void> => {
    await deleteTokenMutation.mutateAsync();
  };

  // Clear localStorage claude token on mount (migration)
  useEffect(() => {
    const oldToken = localStorage.getItem('elchi_ai_token');
    if (oldToken && tokenData?.openrouter_token) {
      localStorage.removeItem('elchi_ai_token');
    }
  }, [tokenData]);

  // Check for mutations loading state
  const isMutationLoading = setTokenMutation.isPending || 
                           updateTokenMutation.isPending || 
                           deleteTokenMutation.isPending;

  // Create masked token for display
  const maskedToken = tokenData?.openrouter_token 
    ? tokenData.openrouter_token.length > 8 
      ? tokenData.openrouter_token.substring(0, 8) + '*'.repeat(tokenData.openrouter_token.length - 8)
      : tokenData.openrouter_token
    : null;

  return {
    token: tokenData?.openrouter_token || null,
    model: tokenData?.ai_default_model || null,
    maskedToken,
    isLoading: isLoading || isMutationLoading,
    error: error || setTokenMutation.error?.message || updateTokenMutation.error?.message || deleteTokenMutation.error?.message || null,
    hasToken: !!(tokenData?.openrouter_token && tokenData.openrouter_token !== ''),
    setToken,
    updateToken, 
    deleteToken,
    refetchToken
  };
};