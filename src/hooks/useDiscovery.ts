import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../common/api';
import { useProjectVariable } from './useProjectVariable';
import { ClusterDiscovery } from '../types/discovery';

export interface ClusterUsageEndpoint {
  endpoint_name: string;
  resource_id: string;
  version: string;
  project: string;
  updated_at: string;
  ip_count: number;
  ips: string[];
}

export interface ClusterUsageResponse {
  cluster_id: string;
  project: string;
  usage_count: number;
  endpoints: ClusterUsageEndpoint[];
}

export const useDiscovery = () => {
  const { project } = useProjectVariable();

  return useQuery({
    queryKey: ['discovery-clusters', project],
    queryFn: async (): Promise<ClusterDiscovery[]> => {
      const response = await api.get<ClusterDiscovery[]>(
        `/api/discovery/clusters?project=${project}`
      );
      // API returns array directly, not wrapped in clusters property
      return Array.isArray(response.data) ? response.data : [];
    },
    enabled: !!project,
    refetchInterval: 30000, // Refresh every 30 seconds
    refetchOnWindowFocus: true,
  });
};

export const useDeleteCluster = () => {
  const { project } = useProjectVariable();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (clusterId: string) => {
      const response = await api.delete(
        `/api/discovery/clusters/${clusterId}?project=${project}`
      );
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch discovery clusters
      queryClient.invalidateQueries({ queryKey: ['discovery-clusters', project] });
    },
  });
};

export const useClusterUsage = (clusterId: string, enabled: boolean = true) => {
  const { project } = useProjectVariable();

  return useQuery({
    queryKey: ['cluster-usage', clusterId, project],
    queryFn: async (): Promise<ClusterUsageResponse> => {
      const response = await api.get<ClusterUsageResponse>(
        `/api/discovery/clusters/${clusterId}/usage?project=${project}`
      );
      return response.data;
    },
    enabled: !!project && !!clusterId && enabled,
  });
};