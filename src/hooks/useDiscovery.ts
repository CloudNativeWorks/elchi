import { useQuery } from '@tanstack/react-query';
import { api } from '../common/api';
import { useProjectVariable } from './useProjectVariable';
import { ClusterDiscovery, DiscoveryResponse } from '../types/discovery';

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