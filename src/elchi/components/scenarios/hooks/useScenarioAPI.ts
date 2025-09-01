import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import { api } from '@/common/api';

// Backend field definition types - Updated for nested field system
export type FieldType = 'string' | 'int' | 'bool' | 'select' | 'array' | 'object' | 'nested_choice' | 'conditional';

export interface FieldOption {
    value: string;
    label: string;
}

export interface ConnectedField {
    component_types: string[]; // e.g., ["router_filter", "cors_filter", "rbac_filter"]
    field_name: string;        // e.g., "name" or ":componentname:"
}

export interface ArraySchema {
    item_type: string;
    properties?: Record<string, FieldDef>;
}

export interface ConditionalChoice {
    value: string;
    label: string;
    api_endpoint?: string;
    sub_fields: AvailableField[];
}

export interface NestedFieldConfig {
    mutually_exclusive: boolean;
    default_choice: string;
    choices: ConditionalChoice[];
}

export interface NestedFieldSelection {
    selected_choice: string;
    sub_fields: SelectedField[];
}

export interface FieldDef {
    type: FieldType;
    label: string;
    description?: string;
    required: boolean;
    default_value?: any;
    use_component_name?: boolean;
    options?: FieldOption[];
    properties?: Record<string, FieldDef>;
    connected?: ConnectedField;
}

export interface AvailableField {
    name: string;
    label: string;
    description: string;
    type: FieldType;
    required_for_creation?: boolean; // Must be selected when creating scenario
    required_for_execution?: boolean; // Must have value when executing scenario (if selected)
    default_value?: any;
    use_component_name?: boolean; // If true, field value syncs with component name automatically
    options?: FieldOption[];
    connected?: ConnectedField;
    validation_rules?: string[];
    array_schema?: ArraySchema;
    api_endpoint?: string; // For system resource fields
    nested_config?: NestedFieldConfig; // For nested choice fields
    has_metadata?: boolean; // If true, preserve full object metadata when selecting from API
    has_discovery?: boolean; // If true, field contains discovery data from clusters/nodes
    use_api_and_scenario?: boolean; // If true, UI should allow selection from both API and scenario resources
}

export interface ComponentRule {
    required_with?: string[];
    conflicts_with?: string[];
    min_count?: number;
    max_count?: number;
}

export interface BackendComponentDefinition {
    name: string;
    label: string;
    description: string;
    category: string;
    collection: string;
    canonical_name: string;
    gtype: string; // Component's GType for metadata lookup
    priority: number; // Priority for UI ordering (lower = shown first)
    available_fields: AvailableField[];
    rules?: ComponentRule;
}

// Selected field by user
export interface SelectedField {
    field_name: string;
    required: boolean;
    value?: any;
    nested_selection?: NestedFieldSelection;
}

// Component instance in scenario
export interface ComponentInstance {
    type: string;
    name: string;
    priority?: number;
    gtype?: string; // Component gtype for metadata lookup
    selected_fields: SelectedField[];
}

export interface ComponentCatalogResponse {
    components: BackendComponentDefinition[];
}

export interface Scenario {
    id: string;
    name: string;
    description: string;
    scenario_id: string;
    components: ComponentInstance[];
    is_default: boolean;
    created_by: string;
    project?: string; // null for global scenarios
    permissions: {
        users: string[];
        groups: string[];
    };
    created_at: string;
    updated_at: string;
}

export interface CreateScenarioRequest {
    name: string;
    description: string;
    scenario_id: string;
    components: ComponentInstance[];
    project?: string; // Optional - if null/empty, scenario is available to all projects
}

export interface UpdateScenarioRequest {
    name?: string;
    description?: string;
    components?: ComponentInstance[];
}

export interface ExecuteScenarioRequest {
    scenario_id: string;
    components: ComponentInstance[];
    managed: boolean;
    project: string;
    version: string;
}

export interface ScenarioListResponse {
    scenarios: Scenario[];
    total: number;
}

export interface ExecuteScenarioResponse {
    resources: any[];
    success: boolean;
    message?: string;
    applied_count?: number;
}

export interface ValidateScenarioRequest {
    components: ComponentInstance[];
}

export interface ValidateScenarioResponse {
    valid: boolean;
    errors: string[];
    error_count?: number;
    grouped_errors?: Record<string, string[]>;
}

export interface ExportScenarioRequest {
    scenario_ids: string[]; // List of scenario IDs to export
}

export interface ExportScenarioResponse {
    scenarios: Scenario[];
    exported_by: string;
    exported_at: string;
    version: string;
    count: number;
}

export interface ScenarioConflict {
    scenario_id: string;
    existing_name: string;
    import_name: string;
    action: 'skipped' | 'overwritten' | 'renamed';
    new_name?: string; // For renamed scenarios
}

export interface ImportScenarioRequest {
    scenarios: Scenario[];
    project?: string; // Target project for imported scenarios (optional)
    conflict_action?: 'skip' | 'overwrite' | 'rename'; // Conflict resolution (optional)
    version?: string; // Version for compatibility check (optional)
}

export interface ImportScenarioResponse {
    success: boolean;
    message?: string;
    imported: number; // Number of successfully imported scenarios
    skipped: number; // Number of skipped scenarios
    conflicts: ScenarioConflict[]; // List of conflicts and resolutions
    imported_by: string;
    imported_at: string;
}

export const useScenarioAPI = () => {
    const { project } = useProjectVariable();
    const queryClient = useQueryClient();

    // Get all scenarios (project-specific + global)
    const useGetScenarios = (allScenarios = false) => {
        return useQuery({
            queryKey: ['scenarios', project, allScenarios],
            queryFn: async (): Promise<ScenarioListResponse> => {
                const params = new URLSearchParams();
                if (project && !allScenarios) {
                    params.append('project', project);
                }
                if (allScenarios) {
                    params.append('allscenarios', 'true');
                }
                const response = await api.get(`/api/v3/scenario/scenarios?${params.toString()}`);
                return response.data;
            },
            enabled: !!project || allScenarios,
        });
    };

    // Get single scenario
    const useGetScenario = (scenarioId: string) => {
        return useQuery({
            queryKey: ['scenario', scenarioId],
            queryFn: async (): Promise<Scenario> => {
                const response = await api.get(`/api/v3/scenario/scenarios/${scenarioId}`);
                return response.data;
            },
            enabled: !!scenarioId,
        });
    };

    // Create scenario mutation
    const useCreateScenario = () => {
        return useMutation({
            mutationFn: async (data: CreateScenarioRequest): Promise<Scenario> => {
                const url = `/api/v3/scenario/scenarios?project=${project}`;
                const response = await api.post(url, data);
                return response.data;
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['scenarios'] });
            },
        });
    };

    // Update scenario mutation
    const useUpdateScenario = () => {
        return useMutation({
            mutationFn: async ({ 
                scenarioId, 
                data 
            }: { 
                scenarioId: string; 
                data: UpdateScenarioRequest 
            }): Promise<Scenario> => {
                const response = await api.put(`/api/v3/scenario/scenarios/${scenarioId}?project=${project}`, data);
                return response.data;
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['scenarios'] });
            },
        });
    };

    // Delete scenario mutation
    const useDeleteScenario = () => {
        return useMutation({
            mutationFn: async (scenarioId: string): Promise<void> => {
                await api.delete(`/api/v3/scenario/scenarios/${scenarioId}?project=${project}`);
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['scenarios'] });
            },
        });
    };


    // Get component catalog
    const useGetComponentCatalog = () => {
        return useQuery({
            queryKey: ['component-catalog'],
            queryFn: async (): Promise<ComponentCatalogResponse> => {
                const response = await api.get('/api/v3/scenario/components');
                return response.data;
            },
            staleTime: 300000, // 5 minutes - catalog doesn't change often
        });
    };

    // Validate scenario components
    const useValidateScenario = (projectParam?: string) => {
        return useMutation({
            mutationFn: async (components: ComponentInstance[]): Promise<ValidateScenarioResponse> => {
                const targetProject = projectParam || project;
                const url = `/api/v3/scenario/validate${targetProject ? `?project=${targetProject}` : ''}`;
                const response = await api.post(url, components);
                return response.data;
            },
        });
    };

    // Export scenarios
    const useExportScenarios = () => {
        return useMutation({
            mutationFn: async (data: ExportScenarioRequest): Promise<ExportScenarioResponse> => {
                const response = await api.post('/api/v3/scenario/export', data);
                return response.data;
            },
        });
    };

    // Import scenarios
    const useImportScenarios = () => {
        return useMutation({
            mutationFn: async (data: ImportScenarioRequest): Promise<ImportScenarioResponse> => {
                // Project'i hem body'de hem de query param'da gönder
                const params = new URLSearchParams();
                if (data.project) {
                    params.append('project', data.project);
                }
                
                const url = `/api/v3/scenario/import${params.toString() ? `?${params.toString()}` : ''}`;
                const response = await api.post(url, data);
                // Backend response format: { data: { success, message, imported, skipped, conflicts, ... }, message }
                return response.data.data || response.data;
            },
            onSuccess: () => {
                // Invalidate scenarios cache after successful import
                queryClient.invalidateQueries({ queryKey: ['scenarios'] });
            },
        });
    };

    return {
        useGetScenarios,
        useGetScenario,
        useCreateScenario,
        useUpdateScenario,
        useDeleteScenario,
        useGetComponentCatalog,
        useValidateScenario,
        useExportScenarios,
        useImportScenarios,
    };
};

// Utility functions
export const generateScenarioId = (name: string): string => {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/(^_|_$)/g, '')
        .substring(0, 20) + '_' + Date.now().toString().slice(-4);
};

export const validateScenarioId = (id: string): boolean => {
    return /^[a-z0-9_]+$/.test(id) && id.length >= 3 && id.length <= 50;
};