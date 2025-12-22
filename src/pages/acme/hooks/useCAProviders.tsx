import { useQuery } from '@tanstack/react-query';
import { letsencryptApi } from '../letsencryptApi';
import type { CAProvider } from '../types';

export const useCAProviders = () => {
  const query = useQuery({
    queryKey: ['ca-providers'],
    queryFn: () => letsencryptApi.getCAProviders(),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  const getProviderInfo = (provider: CAProvider) => {
    return query.data?.find((p) => p.provider === provider);
  };

  const requiresEAB = (provider: CAProvider) => {
    return getProviderInfo(provider)?.requires_eab || false;
  };

  const isSupported = (provider: CAProvider) => {
    return getProviderInfo(provider)?.supported || false;
  };

  return {
    ...query,
    caProviders: query.data || [],
    getProviderInfo,
    requiresEAB,
    isSupported,
  };
};
