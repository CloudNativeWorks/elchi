// Redux types for scenario management
import { ComponentInstance, BackendComponentDefinition, Scenario } from '@/elchi/components/scenarios/hooks/useScenarioAPI';

export interface ScenarioExecutionState {
    // Component instances being executed
    componentInstances: ComponentInstance[];
    
    // Current component names (originalName -> currentName)
    componentNames: Record<string, string>;
    
    // Field values (componentName.fieldName -> value)  
    fieldValues: Record<string, any>;
    
    // Connected field mappings (sourceFieldKey -> targetFieldKey)
    connectedFields: Record<string, string>;
    
    // Current step in execution wizard
    currentStep: number;
    
    // Execution settings
    selectedVersion: string;
    managed: boolean;
    project: string;
}

export interface ScenarioState {
    // Component catalog from backend
    componentCatalog: BackendComponentDefinition[] | null;
    catalogLoading: boolean;
    catalogError: string | null;
    
    // Current scenario being executed
    currentScenario: Scenario | null;
    scenarioLoading: boolean;
    scenarioError: string | null;
    
    // Execution state
    execution: ScenarioExecutionState;
    
    // Execution results
    executionResult: {
        success: boolean;
        message: string;
        resources?: any[];
    } | null;
    executionLoading: boolean;
}

export const initialScenarioState: ScenarioState = {
    componentCatalog: null,
    catalogLoading: false,
    catalogError: null,
    
    currentScenario: null,
    scenarioLoading: false,
    scenarioError: null,
    
    execution: {
        componentInstances: [],
        componentNames: {},
        fieldValues: {},
        connectedFields: {},
        currentStep: 0,
        selectedVersion: '',
        managed: false,
        project: ''
    },
    
    executionResult: null,
    executionLoading: false
};