/**
 * Snippets Hook - Using React Query for data fetching
 */

import { useQuery } from '@tanstack/react-query';
import { snippetApi } from '../api/snippetApi';
import { SnippetFilter } from '../core/types';
import { useProjectVariable } from '@/hooks/useProjectVariable';

/**
 * Hook to fetch snippets for specific component
 */
export const useComponentSnippets = (
  componentType: string,
  gtype?: string,
  version?: string,
  options?: { enabled?: boolean }
) => {
  const { project } = useProjectVariable();

  const filter: SnippetFilter = {
    project,
    component_type: componentType,
    gtype,
    version,
  };

  const queryKey = ['snippets', 'component', filter];

  return useQuery({
    queryKey,
    queryFn: async () => {
      try {
        const result = await snippetApi.getSnippets(filter);
        // Ensure we always return an array
        return Array.isArray(result) ? result : [];
      } catch (error) {
        console.error('useComponentSnippets error:', error);
        return [];
      }
    },
    enabled: options?.enabled !== false && !!project && !!componentType && !!version,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};
