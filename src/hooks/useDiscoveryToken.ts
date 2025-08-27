import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../common/api';
import Config from '../conf';
import { useProjectVariable } from './useProjectVariable';

export interface DiscoveryTokenResponse {
  discovery_token: string;
  project: string;
  message?: string;
}

export interface DiscoveryTokenRequest {
  discovery_token: string;
}

export interface DiscoveryTokenHookReturn {
  token: string | null;
  isLoading: boolean;
  error: string | null;
  hasToken: boolean;
  deleteToken: () => Promise<void>;
  generateToken: () => Promise<string>;
  refetchToken: () => void;
}

export const useDiscoveryToken = (): DiscoveryTokenHookReturn => {
  const { project } = useProjectVariable();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  // Query to get Discovery token
  const { 
    data: tokenData, 
    isLoading, 
    refetch: refetchToken 
  } = useQuery({
    queryKey: ['discovery-token', project],
    queryFn: async (): Promise<DiscoveryTokenResponse> => {
      const response = await api.get<DiscoveryTokenResponse>(
        `${Config.baseApi}setting/discovery-token?project=${project}`
      );
      return response.data;
    },
    enabled: !!project,
    refetchOnWindowFocus: false,
  });


  // Mutation to delete token
  const deleteTokenMutation = useMutation({
    mutationFn: async (): Promise<DiscoveryTokenResponse> => {
      const response = await api.delete<DiscoveryTokenResponse>(
        `${Config.baseApi}setting/discovery-token?project=${project}`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discovery-token', project] });
      setError(null);
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to delete discovery token');
    }
  });

  // Mutation to generate new token
  const generateTokenMutation = useMutation({
    mutationFn: async (): Promise<DiscoveryTokenResponse> => {
      const response = await api.post<DiscoveryTokenResponse>(
        `${Config.baseApi}setting/discovery-token/generate?project=${project}`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discovery-token', project] });
      setError(null);
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to generate discovery token');
    }
  });

  // Helper functions
  const deleteToken = async (): Promise<void> => {
    await deleteTokenMutation.mutateAsync();
  };

  const generateToken = async (): Promise<string> => {
    const result = await generateTokenMutation.mutateAsync();
    return result.discovery_token;
  };

  // Check for mutations loading state
  const isMutationLoading = deleteTokenMutation.isPending ||
                           generateTokenMutation.isPending;

  return {
    token: tokenData?.discovery_token || null,
    isLoading: isLoading || isMutationLoading,
    error: error || deleteTokenMutation.error?.message || generateTokenMutation.error?.message || null,
    hasToken: !!(tokenData?.discovery_token && tokenData.discovery_token !== ''),
    deleteToken,
    generateToken,
    refetchToken
  };
};