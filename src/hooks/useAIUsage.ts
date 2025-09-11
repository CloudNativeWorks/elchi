import { useQuery } from '@tanstack/react-query';
import { api } from '../common/api';
import Config from '../conf';
import { useProjectVariable } from './useProjectVariable';
import { AIUsageStats, AIUsageStatus, AIUsageRecord, AIUsageStatsResponse, AIRecentUsageResponse } from '../types/ai';

export const useAIUsageStatus = () => {
  const { project } = useProjectVariable();

  return useQuery({
    queryKey: ['ai-usage-status', project],
    queryFn: async (): Promise<AIUsageStatus | null> => {
      try {
        const response = await api.get<AIUsageStatus>(
          `${Config.baseApi}ai/usage/status?project=${project}`
        );
        return response.data;
      } catch (error: any) {
        // If 400 or 404, return null instead of throwing
        if (error.response?.status === 400 || error.response?.status === 404) {
          return null;
        }
        throw error;
      }
    },
    enabled: !!project,
    refetchInterval: 60000, // Refresh every minute
    staleTime: 30000, // Consider data stale after 30 seconds
    retry: false, // Don't retry on error
  });
};

export const useAIUsageStats = () => {
  const { project } = useProjectVariable();

  return useQuery({
    queryKey: ['ai-usage-stats', project],
    queryFn: async (): Promise<AIUsageStats | null> => {
      try {
        const response = await api.get<AIUsageStatsResponse>(
          `${Config.baseApi}ai/usage/stats?project=${project}`
        );
        return response.data.stats;
      } catch (error: any) {
        // If 400 or 404, return null instead of throwing
        if (error.response?.status === 400 || error.response?.status === 404) {
          return null;
        }
        throw error;
      }
    },
    enabled: !!project,
    refetchInterval: 300000, // Refresh every 5 minutes
    retry: false, // Don't retry on error
  });
};

export const useAIRecentUsage = (limit: number = 50) => {
  const { project } = useProjectVariable();

  return useQuery({
    queryKey: ['ai-recent-usage', project, limit],
    queryFn: async (): Promise<AIUsageRecord[]> => {
      const response = await api.get<AIRecentUsageResponse>(
        `${Config.baseApi}ai/usage/recent?project=${project}&limit=${limit}`
      );
      return response.data.usage || [];
    },
    enabled: !!project,
    refetchInterval: 120000, // Refresh every 2 minutes
  });
};