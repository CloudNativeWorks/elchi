import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from '../../common/api';
import Config from '../../conf';
import { useProjectVariable } from '../../hooks/useProjectVariable';
import { useOpenRouterToken } from '../../hooks/useOpenRouterToken';
import type { 
  ConfigAnalyzerRequest, 
  ConfigAnalysisResult, 
  LogAnalyzerRequest,
  LogAnalysisResult,
  AIStatus, 
  SupportedFeatures,
  ResourceOption
} from '../../types/aiConfig';
import { RESOURCE_COLLECTIONS, COMPONENT_TYPES } from '../../types/aiConfig';

// Analyze Listener Configuration Hook
export const useAnalyzeConfigMutation = () => {
  const { project } = useProjectVariable();
  const { hasToken } = useOpenRouterToken();
  
  const mutationFn = async (request: ConfigAnalyzerRequest): Promise<ConfigAnalysisResult> => {
    if (!hasToken) {
      throw new Error('OpenRouter API token not configured. Please set it in Settings > AI.');
    }

    // Add project information to request
    const requestWithProject = {
      ...request,
      project: project || 'default'
    };

    const response = await api.post<any>(
      `${Config.baseApi}ai/analyze?project=${project}`, 
      requestWithProject
    );
    
    // Store the full response including token_usage
    const result = response.data.analysis_result;
    if (response.data.token_usage) {
      result.token_usage = response.data.token_usage;
    }
    
    return result;
  };

  return useMutation({
    mutationFn,
  });
};

// Get AI Status Hook
export const useAIStatus = (enabled = true) => {
  const { hasToken } = useOpenRouterToken();
  const { project } = useProjectVariable();
  
  return useQuery({
    queryKey: ['ai-status', hasToken, project],
    queryFn: async (): Promise<AIStatus> => {
      const response = await api.get<AIStatus>(
        `${Config.baseApi}ai/status?project=${project}`
      );
      
      return response.data;
    },
    enabled: enabled && hasToken && !!project,
    refetchOnWindowFocus: false,
  });
};

// Get Supported Features Hook
export const useAIFeatures = (enabled = true) => {
  return useQuery({
    queryKey: ['ai-features'],
    queryFn: async (): Promise<SupportedFeatures> => {
      const response = await api.get<SupportedFeatures>(
        `${Config.baseApi}ai/features`
      );
      
      return response.data;
    },
    enabled,
    refetchOnWindowFocus: false,
  });
};

// Get Available Resources by Resource Type Hook  
export const useAvailableResources = (resourceTypeKey: string, enabled = true) => {
  const { project } = useProjectVariable();
  
  return useQuery({
    queryKey: ['available-resources', resourceTypeKey, project],
    queryFn: async (): Promise<ResourceOption[]> => {
      if (!resourceTypeKey) return [];
      
      // Check if it's a component type (gtype) or collection
      const componentType = COMPONENT_TYPES.find(ct => ct.gtype === resourceTypeKey);
      
      if (componentType) {
        // It's a specific component type - use the backendPath from gtypes directly
        const { backendPath } = componentType;
        
        try {
          const response = await api.get<any[]>(
            `${Config.baseApi}${backendPath}?project=${project}`
          );
          
          return response.data.map((resource: any) => ({
            name: resource.name || resource.general?.name,
            project: resource.project || resource.general?.project || project,
            version: resource.version || resource.general?.version || '1.33.5',
            gtype: resource.gtype || resource.general?.gtype,
            created_at: resource.created_at || resource.general?.created_at || new Date().toISOString()
          }));
        } catch (error) {
          console.warn(`Failed to fetch ${backendPath}:`, error);
          return [];
        }
      } else {
        // It's a standard collection - use XDS endpoint
        const collectionConfig = RESOURCE_COLLECTIONS.find(c => c.name === resourceTypeKey);
        if (!collectionConfig) return [];
        
        try {
          const response = await api.get<any[]>(
            `${Config.baseApi}${collectionConfig.endpoint}?project=${project}`
          );
          
          return response.data.map((resource: any) => ({
            name: resource.name || resource.general?.name,
            project: resource.project || resource.general?.project || project,
            version: resource.version || resource.general?.version || '1.33.5',
            gtype: resource.gtype || resource.general?.gtype,
            created_at: resource.created_at || resource.general?.created_at || new Date().toISOString()
          }));
        } catch (error) {
          console.warn(`Failed to fetch ${resourceTypeKey}:`, error);
          return [];
        }
      }
    },
    enabled: enabled && !!project && !!resourceTypeKey,
    refetchOnWindowFocus: false,
  });
};

// Get Available Listeners Hook (backward compatibility)
export const useAvailableListeners = (enabled = true) => {
  return useAvailableResources('listeners', enabled);
};

// Analyze Service Logs Hook
export const useAnalyzeLogsMutation = () => {
  const { project } = useProjectVariable();
  const { hasToken } = useOpenRouterToken();
  
  const mutationFn = async (request: LogAnalyzerRequest): Promise<LogAnalysisResult> => {
    if (!hasToken) {
      throw new Error('OpenRouter API token not configured. Please set it in Settings > AI.');
    }

    // Convert our LogAnalyzerRequest to backend expected format
    // Backend expects resource-based analysis, so we'll use 'services' as collection
    // and format logs as a single string
    const logsString = request.logs.map(log => 
      `[${log.timestamp}] [${log.level}] [${log.component || 'unknown'}] ${log.message}`
    ).join('\n');

    const backendRequest = {
      resource_name: request.service_name,
      collection: "listeners", // Default to listeners for service log analysis
      project: request.project,
      version: "v1.33.5", // Default version
      question: request.question || `Analyze the logs for service ${request.service_name} from client ${request.client_name}. Look for errors, warnings, and connection issues. Provide recommendations for troubleshooting.`,
      logs: logsString,
      include_dependencies: true,
      depth: 3
    };

    const response = await api.post<any>(
      `${Config.baseApi}ai/analyze-logs?project=${project}`, 
      backendRequest
    );
    
    // Convert backend response to our expected format
    const backendResult = response.data.analysis_result;
    const result: LogAnalysisResult = {
      service_name: request.service_name,
      client_name: request.client_name,
      log_count: request.logs.length,
      analysis: backendResult.analysis || 'No analysis available',
      suggestions: backendResult.suggestions || [],
      issues_found: backendResult.errors_detected || [],
      processed_at: backendResult.processed_at || new Date().toISOString(),
      token_usage: response.data.token_usage // Add token usage from backend
    };
    
    return result;
  };

  return useMutation({
    mutationFn,
  });
};

// Get All Resource Collections Hook
export const useResourceCollections = () => {
  return {
    data: RESOURCE_COLLECTIONS,
    isLoading: false,
    error: null
  };
};