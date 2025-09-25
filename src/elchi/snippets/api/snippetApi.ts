/**
 * Snippet API Client - Using project's existing API structure
 */

import { api } from '@/common/api';
import { ResourceSnippet, SnippetFilter } from '../core/types';
import { handleApiResponse } from '@/common/notificationHandler';

const SNIPPET_BASE_PATH = '/api/v3/snippets';

class SnippetApiClient {
  /**
   * Get snippets with filters
   */
  async getSnippets(filter?: SnippetFilter): Promise<ResourceSnippet[]> {
    const params = new URLSearchParams();
    
    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }

    const queryString = params.toString();
    const path = `${SNIPPET_BASE_PATH}${queryString ? `?${queryString}` : ''}`;
    
    const response = await api.get(path);
    // Extract snippets array from the API response structure
    return response.data?.snippets || [];
  }

  /**
   * Get single snippet by ID
   */
  async getSnippet(id: string, project?: string, version?: string): Promise<ResourceSnippet> {
    // Add project and version as query parameters if provided
    let url = `${SNIPPET_BASE_PATH}/${id}`;
    if (project || version) {
      const params = new URLSearchParams();
      if (project) params.append('project', project);
      if (version) params.append('version', version);
      url += `?${params.toString()}`;
    }
    
    const response = await api.get(url);
    return response.data;
  }

  /**
   * Create new snippet
   */
  async createSnippet(
    snippet: Omit<ResourceSnippet, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'data_hash'>
  ): Promise<ResourceSnippet> {
    // Add project and version as query parameters
    const params = new URLSearchParams();
    params.append('project', snippet.project);
    params.append('version', snippet.version);
    
    const url = `${SNIPPET_BASE_PATH}?${params.toString()}`;
    const response = await api.post(url, snippet);
    
    handleApiResponse(response.data, undefined, undefined, {
      showAutoSuccess: true,
      customSuccessMessage: `Snippet "${snippet.name}" saved successfully`,
      successTitle: 'Snippet Saved'
    });
    
    return response.data;
  }

  /**
   * Update existing snippet
   */
  async updateSnippet(
    id: string,
    snippet: Partial<ResourceSnippet>,
    project?: string,
    version?: string
  ): Promise<ResourceSnippet> {
    // Add project and version as query parameters if provided
    let url = `${SNIPPET_BASE_PATH}/${id}`;
    if (project || version) {
      const params = new URLSearchParams();
      if (project) params.append('project', project);
      if (version) params.append('version', version);
      url += `?${params.toString()}`;
    }
    
    const response = await api.put(url, snippet);
    
    handleApiResponse(response.data, undefined, undefined, {
      showAutoSuccess: true,
      customSuccessMessage: 'Snippet updated successfully',
      successTitle: 'Snippet Updated'
    });
    
    return response.data;
  }

  /**
   * Delete snippet
   */
  async deleteSnippet(id: string, project?: string, version?: string): Promise<void> {
    // Add project and version as query parameters if provided
    let url = `${SNIPPET_BASE_PATH}/${id}`;
    if (project || version) {
      const params = new URLSearchParams();
      if (project) params.append('project', project);
      if (version) params.append('version', version);
      url += `?${params.toString()}`;
    }
    
    const response = await api.delete(url);
    
    handleApiResponse(response.data, undefined, undefined, {
      showAutoSuccess: true,
      customSuccessMessage: 'Snippet deleted successfully',
      successTitle: 'Snippet Deleted'
    });
  }

  /**
   * Batch operations if needed
   */
  async createBatch(
    snippets: Array<Omit<ResourceSnippet, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'data_hash'>>
  ): Promise<ResourceSnippet[]> {
    const response = await api.post(`${SNIPPET_BASE_PATH}/batch`, snippets);
    
    handleApiResponse(response.data, undefined, undefined, {
      showAutoSuccess: true,
      customSuccessMessage: `${snippets.length} snippets created successfully`,
      successTitle: 'Snippets Created'
    });
    
    return response.data;
  }

  async deleteBatch(ids: string[]): Promise<void> {
    const response = await api.delete(`${SNIPPET_BASE_PATH}/batch`, {
      data: { ids }
    });
    
    handleApiResponse(response.data, undefined, undefined, {
      showAutoSuccess: true,
      customSuccessMessage: `${ids.length} snippets deleted successfully`,
      successTitle: 'Snippets Deleted'
    });
  }
}

// Export singleton instance
export const snippetApi = new SnippetApiClient();