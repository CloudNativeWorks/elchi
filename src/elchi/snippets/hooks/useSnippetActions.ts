/**
 * Snippet Actions Hook - CRUD operations with React Query mutations
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { snippetApi } from '../api/snippetApi';
import { ResourceSnippet, SaveSnippetOptions, ApplySnippetOptions } from '../core/types';
import { discoverPath, generateDataHash } from '../core/pathDiscovery';
import { useProjectVariable } from '@/hooks/useProjectVariable';

/**
 * Hook for snippet CRUD operations
 */
export const useSnippetActions = () => {
  const queryClient = useQueryClient();
  const { project } = useProjectVariable();

  // Save snippet mutation
  const saveSnippetMutation = useMutation({
    mutationFn: (snippet: Omit<ResourceSnippet, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'data_hash'>) =>
      snippetApi.createSnippet(snippet),
    onSuccess: () => {
      // Invalidate all snippet queries to refresh lists
      queryClient.invalidateQueries({ queryKey: ['snippets'] });
    },
  });

  // Update snippet mutation
  const updateSnippetMutation = useMutation({
    mutationFn: ({ id, data, version }: { id: string; data: Partial<ResourceSnippet>; version?: string }) =>
      snippetApi.updateSnippet(id, data, project, version),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['snippets'] });
      queryClient.invalidateQueries({ queryKey: ['snippet'] });
    },
  });

  // Delete snippet mutation
  const deleteSnippetMutation = useMutation({
    mutationFn: ({ id, version }: { id: string; version?: string }) => snippetApi.deleteSnippet(id, project, version),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['snippets'] });
    },
  });

  /**
   * Save current component state as snippet
   */
  const saveAsSnippet = async (options: {
    name: string;
    ctype: string;
    keys?: string;
    title?: string;
    reduxStore: any;
    toJSON: (data: any) => any;
    version: string;
    gtype?: string;
  }) => {
    const { name, ctype, keys, title, reduxStore, toJSON, version, gtype } = options;

    // Discover path metadata
    const pathData = discoverPath({
      ctype,
      keys,
      title,
      reduxStore,
      gtype,
    });

    // Convert redux data to JSON
    let snippetData: any;
    if (Array.isArray(reduxStore)) {
      snippetData = reduxStore.map(item => typeof toJSON === 'function' ? toJSON(item) : item);
    } else if (reduxStore !== undefined) {
      snippetData = typeof toJSON === 'function' ? toJSON(reduxStore) : reduxStore;
    } else {
      throw new Error('No data to save as snippet');
    }

    // Create snippet object
    const snippet: Omit<ResourceSnippet, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'data_hash'> = {
      name,
      component_type: ctype,
      gtype: pathData.gtype,
      field_path: pathData.field_path,
      is_array: pathData.is_array,
      version,
      project,
      snippet_data: snippetData,
    };

    return saveSnippetMutation.mutateAsync(snippet);
  };

  /**
   * Apply snippet to current component
   */
  const applySnippet = (
    snippet: ResourceSnippet,
    onApply: (keys: string, data: any, options?: ApplySnippetOptions) => void,
    options?: ApplySnippetOptions
  ) => {
    try {
      // Use field_path as keys parameter for Paste function
      const keys = snippet.field_path || snippet.component_type;
      onApply(keys, snippet.snippet_data, options);
    } catch (error) {
      console.error('Failed to apply snippet:', error);
      throw error;
    }
  };

  /**
   * Update existing snippet
   */
  const updateSnippet = async (id: string, updates: Partial<ResourceSnippet>, version?: string) => {
    return updateSnippetMutation.mutateAsync({ id, data: updates, version });
  };

  /**
   * Delete snippet
   */
  const deleteSnippet = async (id: string, version?: string) => {
    return deleteSnippetMutation.mutateAsync({ id, version });
  };

  return {
    saveAsSnippet,
    applySnippet,
    updateSnippet,
    deleteSnippet,
    
    // Mutation states
    isSaving: saveSnippetMutation.isPending,
    isUpdating: updateSnippetMutation.isPending,
    isDeleting: deleteSnippetMutation.isPending,
    
    // Errors
    saveError: saveSnippetMutation.error,
    updateError: updateSnippetMutation.error,
    deleteError: deleteSnippetMutation.error,
  };
};