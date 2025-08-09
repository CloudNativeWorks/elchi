import { useQuery } from '@tanstack/react-query';
import { api } from '../common/api';
import Config from '../conf';
import { useProjectVariable } from './useProjectVariable';
import { ClusterDiscovery, DiscoveryResponse } from '../types/discovery';

export const useDiscovery = () => {
  const { project } = useProjectVariable();

  return useQuery({
    queryKey: ['discovery-clusters', project],
    queryFn: async (): Promise<ClusterDiscovery[]> => {
      const response = await api.get<DiscoveryResponse>(
        `/api/discovery/clusters?project=${project}`
      );
      return response.data.clusters || [];
    },
    enabled: !!project,
    refetchInterval: 30000, // Refresh every 30 seconds
    refetchOnWindowFocus: true,
  });
};