/**
 * Snippets Hook - Using React Query for data fetching
 */

import { useQuery } from '@tanstack/react-query';
import { snippetApi } from '../api/snippetApi';
import { SnippetFilter } from '../core/types';
import { useProjectVariable } from '@/hooks/useProjectVariable';

interface UseSnippetsOptions extends Omit<SnippetFilter, 'project'> {
  enabled?: boolean;
}

/**
 * Hook to fetch snippets with filters
 */
export const useSnippets = (options?: UseSnippetsOptions) => {
  const { project } = useProjectVariable();
  
  const filter: SnippetFilter = {
    project,
    ...options,
  };

  const queryKey = ['snippets', filter];
  
  return useQuery({
    queryKey,
    queryFn: async () => {
      try {
        const result = await snippetApi.getSnippets(filter);
        console.log('useSnippets result:', result);
        // Ensure we always return an array
        return Array.isArray(result) ? result : [];
      } catch (error) {
        console.error('useSnippets error:', error);
        return [];
      }
    },
    enabled: options?.enabled !== false && !!project,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

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
        console.log('useComponentSnippets result:', result);
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

/**
 * Hook to fetch single snippet
 */
export const useSnippet = (id: string, enabled = true) => {
  const { project } = useProjectVariable();
  
  return useQuery({
    queryKey: ['snippet', id],
    queryFn: () => snippetApi.getSnippet(id, project),
    enabled: enabled && !!id,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

/**
 * Hook to search snippets
 */
export const useSearchSnippets = (searchTerm: string, enabled = true) => {
  const { project } = useProjectVariable();
  
  const filter: SnippetFilter = {
    project,
    search: searchTerm,
  };

  const queryKey = ['snippets', 'search', filter];
  
  return useQuery({
    queryKey,
    queryFn: async () => {
      try {
        const result = await snippetApi.getSnippets(filter);
        console.log('useSearchSnippets result:', result);
        // Ensure we always return an array
        return Array.isArray(result) ? result : [];
      } catch (error) {
        console.error('useSearchSnippets error:', error);
        return [];
      }
    },
    enabled: enabled && !!project && !!searchTerm && searchTerm.length > 2,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};