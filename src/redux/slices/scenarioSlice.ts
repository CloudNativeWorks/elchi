import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '@/common/api';
import { initialScenarioState } from '../types/scenario';
import { ComponentInstance, Scenario } from '@/elchi/components/scenarios/hooks/useScenarioAPI';

// Async thunks for API calls
export const loadComponentCatalog = createAsyncThunk(
    'scenario/loadComponentCatalog',
    async () => {
        const response = await api.get('/api/v3/scenario/components');
        return response.data.components;
    }
);

export const loadScenario = createAsyncThunk(
    'scenario/loadScenario',
    async (scenarioId: string) => {
        const response = await api.get(`/api/v3/scenario/scenarios/${scenarioId}`);
        return response.data;
    }
);

export const executeScenario = createAsyncThunk(
    'scenario/executeScenario',
    async (params: {
        scenarioId: string;
        components: ComponentInstance[];
        project: string;
        version: string;
        managed: boolean;
    }) => {
        // Transform to backend format
        const requestData = {
            scenario_id: params.scenarioId,
            components: params.components,
            project: params.project,
            version: params.version,
            managed: params.managed
        };
        
        try {
            const response = await api.post(`/api/v3/scenario/execute?project=${params.project}`, requestData);
            
            // Backend returns { data: { success, message, resources }, message: "OK" }
            // We want the inner data object
            return response.data.data || response.data;
        } catch (error: any) {
            // Handle validation errors and other 400-level errors
            if (error.response?.status === 400 && error.response?.data) {
                // Extract the error message from the response
                const errorData = error.response.data;
                const errorMessage = errorData.message || 'Validation failed';
                                
                // Return a failed response with proper error message
                return {
                    success: false,
                    message: errorMessage,
                    resources: []
                };
            }
            
            // Re-throw other errors to be handled by rejected case
            throw error;
        }
    }
);

const scenarioSlice = createSlice({
    name: 'scenario',
    initialState: initialScenarioState,
    reducers: {
        // Initialize execution from scenario
        initializeExecution: (state, action: PayloadAction<{
            scenario: Scenario;
            version: string;
            project: string;
            managed: boolean;
        }>) => {
            const { scenario, version, project, managed } = action.payload;
            
            // Set basic execution settings
            state.execution.selectedVersion = version;
            state.execution.project = project;
            state.execution.managed = managed;
            state.execution.currentStep = 0;
            
            // Initialize component instances from scenario with gtype from catalog
            state.execution.componentInstances = scenario.components.map(comp => {
                // Find component definition in catalog to get gtype
                const componentDef = state.componentCatalog?.find(c => c.name === comp.type);
                return {
                    ...comp,
                    gtype: comp.gtype || componentDef?.gtype // Use existing gtype or get from catalog
                };
            });
            
            // Initialize component names
            const componentNames: Record<string, string> = {};
            scenario.components.forEach(comp => {
                componentNames[comp.name] = comp.name;
            });
            state.execution.componentNames = componentNames;
            
            // Initialize field values with defaults and use_component_name fields
            const fieldValues: Record<string, any> = {};
            const connectedFields: Record<string, string> = {};
            
            scenario.components.forEach(comp => {
                const componentDef = state.componentCatalog?.find(c => c.name === comp.type);
                
                comp.selected_fields.forEach(selectedField => {
                    const fieldDef = componentDef?.available_fields.find(f => f.name === selectedField.field_name);
                    const fieldKey = `${comp.name}.${selectedField.field_name}`;
                    
                    // Set initial field value with enhanced default handling
                    if (selectedField.value !== undefined && selectedField.value !== null) {
                        fieldValues[fieldKey] = selectedField.value;
                    } else if (fieldDef?.use_component_name) {
                        fieldValues[fieldKey] = comp.name;
                    } else if (fieldDef?.default_value !== undefined) {
                        // Handle different field types for default values
                        switch (fieldDef.type) {
                            case 'nested_choice':
                                if (fieldDef.nested_config?.default_choice) {
                                    fieldValues[fieldKey] = {
                                        field_name: selectedField.field_name,
                                        required: selectedField.required || false,
                                        nested_selection: {
                                            selected_choice: fieldDef.nested_config.default_choice,
                                            sub_fields: []
                                        }
                                    };
                                }
                                break;
                            case 'array':
                                fieldValues[fieldKey] = Array.isArray(fieldDef.default_value) ? fieldDef.default_value : [];
                                break;
                            case 'object':
                                fieldValues[fieldKey] = typeof fieldDef.default_value === 'object' ? fieldDef.default_value : {};
                                break;
                            case 'bool':
                                fieldValues[fieldKey] = Boolean(fieldDef.default_value);
                                break;
                            case 'int':
                                fieldValues[fieldKey] = typeof fieldDef.default_value === 'number' ? fieldDef.default_value : parseInt(String(fieldDef.default_value)) || 0;
                                break;
                            default:
                                fieldValues[fieldKey] = fieldDef.default_value;
                                break;
                        }
                    }
                    
                    // Map connected fields
                    if (fieldDef?.connected) {
                        // Since connected field can target multiple component types, use the first one
                        const targetComponentType = fieldDef.connected.component_types[0];
                        const targetKey = `${targetComponentType}.${fieldDef.connected.field_name}`;
                        connectedFields[fieldKey] = targetKey;
                    }
                });
            });
            
            state.execution.fieldValues = fieldValues;
            state.execution.connectedFields = connectedFields;
        },
        
        // Update component name
        updateComponentName: (state, action: PayloadAction<{
            originalName: string;
            newName: string;
        }>) => {
            const { originalName, newName } = action.payload;
            
            
            // Update component names map
            state.execution.componentNames[originalName] = newName;
            
            // Update use_component_name fields for this component
            const component = state.execution.componentInstances.find(c => c.name === originalName);
            if (component) {
                const componentDef = state.componentCatalog?.find(c => c.name === component.type);
                
                component.selected_fields.forEach(selectedField => {
                    const fieldDef = componentDef?.available_fields.find(f => f.name === selectedField.field_name);
                    if (fieldDef?.use_component_name) {
                        const fieldKey = `${originalName}.${selectedField.field_name}`;
                        state.execution.fieldValues[fieldKey] = newName;
                    }
                });
            }
            
            // Update all fields that contain references to this component name
            Object.entries(state.execution.fieldValues).forEach(([fieldKey, fieldValue]) => {
                // Check if field value references the old component name
                if (fieldValue === originalName) {
                    // Direct reference - update to new name
                    state.execution.fieldValues[fieldKey] = newName;
                } else if (Array.isArray(fieldValue)) {
                    // Array field - update any matching values in the array
                    const updatedArray = fieldValue.map(item => 
                        item === originalName ? newName : item
                    );
                    if (JSON.stringify(updatedArray) !== JSON.stringify(fieldValue)) {
                        state.execution.fieldValues[fieldKey] = updatedArray;
                    }
                }
            });
            
            // Also update connected fields mapping if needed
            Object.entries(state.execution.connectedFields).forEach(([sourceFieldKey, targetPattern]) => {
                const [targetCompType, targetFieldName] = targetPattern.split('.');
                
                // Find components of target type that match the renamed component
                const targetComponents = state.execution.componentInstances.filter(c => 
                    c.type === targetCompType && c.name === originalName
                );
                
                if (targetComponents.length > 0) {
                    // If there's already a runtime value, update it; otherwise it will be handled by connectedOptions
                    const currentValue = state.execution.fieldValues[sourceFieldKey];
                    if (currentValue === originalName) {
                        state.execution.fieldValues[sourceFieldKey] = newName;
                    } else if (Array.isArray(currentValue)) {
                        const updatedArray = currentValue.map(item => 
                            item === originalName ? newName : item
                        );
                        if (JSON.stringify(updatedArray) !== JSON.stringify(currentValue)) {
                            state.execution.fieldValues[sourceFieldKey] = updatedArray;
                        }
                    }
                }
            });
        },
        
        // Update field value
        updateFieldValue: (state, action: PayloadAction<{
            componentName: string;
            fieldName: string;
            value: any;
        }>) => {
            const { componentName, fieldName, value } = action.payload;
            const fieldKey = `${componentName}.${fieldName}`;
            
            state.execution.fieldValues[fieldKey] = value;
        },
        
        // Set current step
        setCurrentStep: (state, action: PayloadAction<number>) => {
            state.execution.currentStep = action.payload;
        },
        
        // Clear execution state
        clearExecution: (state) => {
            state.execution = {
                componentInstances: [],
                componentNames: {},
                fieldValues: {},
                connectedFields: {},
                currentStep: 0,
                selectedVersion: '',
                managed: false,
                project: ''
            };
            state.executionResult = null;
        }
    },
    extraReducers: (builder) => {
        // Component catalog loading
        builder
            .addCase(loadComponentCatalog.pending, (state) => {
                state.catalogLoading = true;
                state.catalogError = null;
            })
            .addCase(loadComponentCatalog.fulfilled, (state, action) => {
                state.catalogLoading = false;
                state.componentCatalog = action.payload;
            })
            .addCase(loadComponentCatalog.rejected, (state, action) => {
                state.catalogLoading = false;
                state.catalogError = action.error.message || 'Failed to load component catalog';
            });
            
        // Scenario loading
        builder
            .addCase(loadScenario.pending, (state) => {
                state.scenarioLoading = true;
                state.scenarioError = null;
            })
            .addCase(loadScenario.fulfilled, (state, action) => {
                state.scenarioLoading = false;
                state.currentScenario = action.payload;
            })
            .addCase(loadScenario.rejected, (state, action) => {
                state.scenarioLoading = false;
                state.scenarioError = action.error.message || 'Failed to load scenario';
            });
            
        // Scenario execution
        builder
            .addCase(executeScenario.pending, (state) => {
                state.executionLoading = true;
            })
            .addCase(executeScenario.fulfilled, (state, action) => {
                state.executionLoading = false;
                // Use response data directly - backend returns success/message/resources
                state.executionResult = {
                    success: action.payload.success || false,
                    message: action.payload.message || 'Scenario executed',
                    resources: action.payload.resources
                };
            })
            .addCase(executeScenario.rejected, (state, action) => {
                state.executionLoading = false;
                state.executionResult = {
                    success: false,
                    message: action.error.message || 'Scenario execution failed'
                };
            });
    },
});

export const {
    initializeExecution,
    updateComponentName,
    updateFieldValue,
    setCurrentStep,
    clearExecution
} = scenarioSlice.actions;

export default scenarioSlice.reducer;