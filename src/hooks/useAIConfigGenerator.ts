import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { useProjectVariable } from './useProjectVariable';
import { api } from '@/common/api';

// AI Configuration Request Types
export interface ConfigRequest {
    project: string;
    requirements: string;
    language?: 'tr' | 'en';
    proxy_type?: 'envoy' | 'nginx';
    resource_types?: string[];
    complexity?: 'basic' | 'intermediate' | 'advanced';
    include_security?: boolean;
    include_observability?: boolean;
}

export interface ResourceConfig {
    type: string;
    name: string;
    config: any;
    dependencies?: string[];
    description?: string;
}

export interface ConfigResponse {
    request_id: string;
    resources: ResourceConfig[];
    explanation: string;
    warnings?: string[];
    usage?: {
        tokens_used: number;
        estimated_cost: number;
    };
}

export interface AIStatus {
    available: boolean;
    provider: string;
    model: string;
    rate_limit?: {
        requests_per_minute: number;
        current_usage: number;
    };
}

export interface ApplyConfigsRequest {
    project: string;
    request_id: string;
    selected_resources: string[];
    overwrite_existing?: boolean;
}

export interface AnalyzeRequest {
    project: string;
    resource_type: string;
    resource_name?: string;
    analysis_type: 'security' | 'performance' | 'best_practices' | 'optimization';
    language?: 'tr' | 'en';
}

export interface AnalyzeLogsRequest {
    project: string;
    log_content: string;
    resource_context?: {
        resource_type: string;
        resource_name: string;
    };
    analysis_focus?: string;
    language?: 'tr' | 'en';
}

export const useAIConfigGenerator = () => {
    const { project } = useProjectVariable();
    const queryClient = useQueryClient();

    // Get AI system status
    const useAIStatus = () => {
        return useQuery<AIStatus>({
            queryKey: ['ai-status'],
            queryFn: async () => {
                const response = await api.get('/api/v3/ai/status');
                return response.data;
            },
            staleTime: 30000, // 30 seconds
            refetchInterval: 60000, // 1 minute
        });
    };

    // Get configuration request template
    const useConfigTemplate = () => {
        return useQuery<ConfigRequest>({
            queryKey: ['ai-config-template'],
            queryFn: async () => {
                const response = await api.get('/api/v3/ai/template');
                return response.data;
            },
            staleTime: 300000, // 5 minutes
        });
    };

    // Generate configuration using AI
    const useGenerateConfig = () => {
        return useMutation<ConfigResponse, Error, ConfigRequest>({
            mutationFn: async (request: ConfigRequest) => {
                const response = await api.post('/api/v3/ai/generate-config', {
                    ...request,
                    project: project || request.project
                });
                return response.data;
            },
            onSuccess: (data) => {
                message.success(`Configuration generated successfully! ${data.resources.length} resources created.`);
                if (data.usage) {
                    message.info(`Tokens used: ${data.usage.tokens_used} (Cost: $${data.usage.estimated_cost.toFixed(4)})`);
                }
            },
            onError: (error: any) => {
                console.error('AI Config Generation Error:', error);
                const errorMessage = error.response?.data?.message || error.message || 'Failed to generate configuration';
                message.error(`AI Configuration Error: ${errorMessage}`);
            },
        });
    };

    // Apply generated configurations
    const useApplyConfigs = () => {
        return useMutation<any, Error, ApplyConfigsRequest>({
            mutationFn: async (request: ApplyConfigsRequest) => {
                const response = await api.post('/api/v3/ai/apply-configs', {
                    ...request,
                    project: project || request.project
                });
                return response.data;
            },
            onSuccess: (data, variables) => {
                message.success(`${variables.selected_resources.length} resources applied successfully!`);
                // Invalidate relevant queries to refresh the UI
                queryClient.invalidateQueries({ queryKey: ['resources'] });
                queryClient.invalidateQueries({ queryKey: ['listeners'] });
                queryClient.invalidateQueries({ queryKey: ['clusters'] });
                queryClient.invalidateQueries({ queryKey: ['routes'] });
            },
            onError: (error: any) => {
                console.error('Apply Configs Error:', error);
                const errorMessage = error.response?.data?.message || error.message || 'Failed to apply configurations';
                message.error(`Apply Error: ${errorMessage}`);
            },
        });
    };

    // Analyze existing resources
    const useAnalyzeResource = () => {
        return useMutation<any, Error, AnalyzeRequest>({
            mutationFn: async (request: AnalyzeRequest) => {
                const response = await api.post('/api/v3/ai/analyze', {
                    ...request,
                    project: project || request.project
                });
                return response.data;
            },
            onSuccess: () => {
                message.success('Resource analysis completed successfully!');
            },
            onError: (error: any) => {
                console.error('Analyze Resource Error:', error);
                const errorMessage = error.response?.data?.message || error.message || 'Failed to analyze resource';
                message.error(`Analysis Error: ${errorMessage}`);
            },
        });
    };

    // Analyze logs with configuration context
    const useAnalyzeLogs = () => {
        return useMutation<any, Error, AnalyzeLogsRequest>({
            mutationFn: async (request: AnalyzeLogsRequest) => {
                const response = await api.post('/api/v3/ai/analyze-logs', {
                    ...request,
                    project: project || request.project
                });
                return response.data;
            },
            onSuccess: () => {
                message.success('Log analysis completed successfully!');
            },
            onError: (error: any) => {
                console.error('Analyze Logs Error:', error);
                const errorMessage = error.response?.data?.message || error.message || 'Failed to analyze logs';
                message.error(`Log Analysis Error: ${errorMessage}`);
            },
        });
    };

    return {
        useAIStatus,
        useConfigTemplate,
        useGenerateConfig,
        useApplyConfigs,
        useAnalyzeResource,
        useAnalyzeLogs
    };
};

export default useAIConfigGenerator;