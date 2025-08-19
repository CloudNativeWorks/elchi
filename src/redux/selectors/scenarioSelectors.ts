import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { isValidComponentName } from '@/elchi/components/scenarios/execution/validationUtils';

// Basic selectors
export const selectScenarioState = (state: RootState) => state.scenario;

export const selectComponentCatalog = (state: RootState) => state.scenario.componentCatalog;
export const selectCatalogLoading = (state: RootState) => state.scenario.catalogLoading;
export const selectCatalogError = (state: RootState) => state.scenario.catalogError;

export const selectCurrentScenario = (state: RootState) => state.scenario.currentScenario;
export const selectScenarioLoading = (state: RootState) => state.scenario.scenarioLoading;
export const selectScenarioError = (state: RootState) => state.scenario.scenarioError;

export const selectExecution = (state: RootState) => state.scenario.execution;
export const selectExecutionResult = (state: RootState) => state.scenario.executionResult;
export const selectExecutionLoading = (state: RootState) => state.scenario.executionLoading;

// Execution selectors
export const selectComponentInstances = (state: RootState) => state.scenario.execution.componentInstances;
export const selectComponentNames = (state: RootState) => state.scenario.execution.componentNames;
export const selectFieldValues = (state: RootState) => state.scenario.execution.fieldValues;
export const selectConnectedFields = (state: RootState) => state.scenario.execution.connectedFields;
export const selectCurrentStep = (state: RootState) => state.scenario.execution.currentStep;
export const selectSelectedVersion = (state: RootState) => state.scenario.execution.selectedVersion;
export const selectManaged = (state: RootState) => state.scenario.execution.managed;
export const selectProject = (state: RootState) => state.scenario.execution.project;

// Computed selectors
export const selectSortedComponents = createSelector(
    [selectComponentInstances],
    (componentInstances) => {
        return [...componentInstances].sort((a, b) => (a.priority || 0) - (b.priority || 0));
    }
);

export const selectCurrentComponent = createSelector(
    [selectSortedComponents, selectCurrentStep],
    (sortedComponents, currentStep) => {
        return sortedComponents[currentStep] || null;
    }
);

// Get component definition by type
export const selectComponentDefinition = createSelector(
    [selectComponentCatalog, (_state: RootState, componentType: string) => componentType],
    (catalog, componentType) => {
        return catalog?.find(c => c.name === componentType) || null;
    }
);

// Get current component definition
export const selectCurrentComponentDefinition = createSelector(
    [selectCurrentComponent, selectComponentCatalog],
    (currentComponent, catalog) => {
        if (!currentComponent || !catalog) return null;
        return catalog.find(c => c.name === currentComponent.type) || null;
    }
);

// Get field value by component and field name
export const selectFieldValue = (state: RootState, componentName: string, fieldName: string) => {
    const fieldKey = `${componentName}.${fieldName}`;
    return state.scenario.execution.fieldValues[fieldKey];
};

// Get current component name (may be different from original)
export const selectCurrentComponentName = createSelector(
    [selectCurrentComponent, selectComponentNames],
    (currentComponent, componentNames) => {
        if (!currentComponent) return '';
        return componentNames[currentComponent.name] || currentComponent.name;
    }
);

// Get connected field options for a specific field - memoized by field connected config
export const selectConnectedFieldOptions = createSelector([
    selectComponentInstances,
    selectComponentNames,  
    selectFieldValues,
    selectComponentCatalog,
    (_state: RootState, fieldDef: any) => fieldDef?.connected
], (componentInstances, componentNames, fieldValues, catalog, connectedConfig) => {
    if (!connectedConfig || !catalog) return [];
    
    // ConnectedConfig now only uses component_types (array format)
    const componentTypes = connectedConfig.component_types || [];
    
    if (componentTypes.length === 0) return [];
    
    const connectedComponents = componentInstances.filter(comp => 
        componentTypes.includes(comp.type)
    );
    
    return connectedComponents.map(comp => {
        const updatedComponentName = componentNames[comp.name] || comp.name;
        
        // Get field value using same logic as ArrayFieldItem
        let displayValue: string;
        const fieldKey = `${comp.name}.${connectedConfig.field_name}`;
        const runtimeFieldValue = fieldValues[fieldKey];
        
        if (runtimeFieldValue !== undefined && runtimeFieldValue !== null) {
            displayValue = String(runtimeFieldValue);
        } else {
            const connectedField = comp.selected_fields.find(f => 
                f.field_name === connectedConfig.field_name
            );
            if (connectedField?.value !== undefined && connectedField.value !== null) {
                displayValue = String(connectedField.value);
            } else {
                displayValue = updatedComponentName;
            }
        }
        
        return {
            value: displayValue,
            label: `${updatedComponentName} (Connected Field)`
        };
    });
});

// Helper function to validate nested choice field
const validateNestedChoiceField = (
    fieldValue: any,
    fieldDef: any,
    componentName: string,
    fieldValues: Record<string, any>
): boolean => {
    // If field is not nested choice, skip nested validation
    if (fieldDef.type !== 'nested_choice' || !fieldDef.nested_config) {
        return true;
    }

    // If field value has nested_selection, validate based on that
    if (fieldValue && typeof fieldValue === 'object' && fieldValue.nested_selection) {
        const selectedChoice = fieldValue.nested_selection.selected_choice;
        console.log(`🔍 Validating nested choice field: ${fieldDef.name}`, {
            selectedChoice,
            fieldValue,
            choices: fieldDef.nested_config?.choices?.map(c => c.value)
        });
        
        if (!selectedChoice) {
            console.log(`❌ No selected choice for nested field: ${fieldDef.name}`);
            return false;
        }

        // Find the selected choice config
        const choiceConfig = fieldDef.nested_config.choices?.find(c => c.value === selectedChoice);
        if (!choiceConfig || !choiceConfig.sub_fields) {
            console.log(`✅ No sub-fields to validate for choice: ${selectedChoice}`);
            return true;
        }

        console.log(`🔍 Validating ${choiceConfig.sub_fields.length} sub-fields for choice: ${selectedChoice}`);

        // Validate only the sub-fields of the selected choice
        for (const subField of choiceConfig.sub_fields) {
            if (subField.required_for_execution) {
                // Get sub-field value from Redux fieldValues using nested field key format
                const subFieldKey = `nested_${fieldDef.name}_${selectedChoice}.${subField.name}`;
                const subFieldValue = fieldValues[subFieldKey];
                
                console.log(`   🔍 Sub-field ${subField.name}: ${subFieldKey} =`, subFieldValue);
                
                // Handle array fields - check if array exists and has items
                if (subField.type === 'array') {
                    if (!subFieldValue || !Array.isArray(subFieldValue) || subFieldValue.length === 0) {
                        console.log(`   ❌ Required array sub-field missing or empty: ${subField.name}`);
                        return false;
                    }
                    
                    // Validate array items if they have required properties
                    if (subField.array_schema?.properties) {
                        for (let i = 0; i < subFieldValue.length; i++) {
                            const arrayItem = subFieldValue[i];
                            for (const [propName, propDef] of Object.entries(subField.array_schema.properties)) {
                                if ((propDef as any).required) {
                                    const propValue = arrayItem?.[propName];
                                    if (propValue === undefined || propValue === null || propValue === '') {
                                        console.log(`   ❌ Array item property validation failed: ${subField.name}[${i}].${propName}`, {
                                            arrayIndex: i,
                                            propName,
                                            propValue,
                                            required: true
                                        });
                                        return false;
                                    }
                                }
                            }
                        }
                    }
                } else {
                    // Handle non-array fields
                    if (subFieldValue === undefined || subFieldValue === null || subFieldValue === '') {
                        console.log(`   ❌ Required sub-field missing: ${subField.name}`);
                        return false;
                    }

                    // Recursively validate nested choice sub-fields
                    if (subField.type === 'nested_choice') {
                        if (!validateNestedChoiceField(subFieldValue, subField, componentName, fieldValues)) {
                            console.log(`   ❌ Nested validation failed for: ${subField.name}`);
                            return false;
                        }
                    }
                }
            }
        }
        
        console.log(`✅ All sub-fields validated for choice: ${selectedChoice}`);
    } else {
        // If no nested_selection but field is required, it's invalid
        const isRequired = fieldDef.required_for_execution;
        console.log(`🔍 No nested_selection found for field: ${fieldDef.name}`, {
            isRequired,
            fieldValue
        });
        
        if (isRequired) {
            console.log(`❌ Required nested choice field has no selection: ${fieldDef.name}`);
            return false;
        }
    }

    return true;
};

// Validation selectors
export const selectIsCurrentStepValid = createSelector(
    [selectCurrentComponent, selectCurrentComponentDefinition, selectComponentNames, selectFieldValues],
    (currentComponent, componentDef, componentNames, fieldValues) => {
        if (!currentComponent || !componentDef) return true;
        
        // Check if component name is valid
        const currentComponentName = componentNames[currentComponent.name] || currentComponent.name;
        if (!currentComponentName.trim() || !isValidComponentName(currentComponentName)) {
            return false;
        }
        
        // Check required fields
        for (const selectedField of currentComponent.selected_fields) {
            const fieldDef = componentDef.available_fields.find(f => f.name === selectedField.field_name);
            if (!fieldDef) continue;
            
            const fieldKey = `${currentComponent.name}.${selectedField.field_name}`;
            const fieldValue = fieldValues[fieldKey];
            
            // Check if field is required for execution
            const isRequired = selectedField.required || fieldDef.required_for_execution;
            
            if (fieldDef.type === 'nested_choice') {
                // Special validation for nested choice fields
                if (isRequired && !validateNestedChoiceField(fieldValue, fieldDef, currentComponent.name, fieldValues)) {
                    console.log(`❌ Nested choice field validation failed: ${fieldDef.name}`, {
                        fieldKey,
                        fieldValue,
                        isRequired,
                        fieldDef: fieldDef.name
                    });
                    return false;
                }
                
                // Additional validation is already done in validateNestedChoiceField
                // No need for duplicate validation here
            } else if (fieldDef.type === 'object' && fieldDef.array_schema?.properties) {
                // Validate object type fields with properties
                if (isRequired || fieldValue) { // Check if object is required or has value
                    const objectValue = fieldValue || {};
                    
                    // Check each property in the object
                    for (const [propName, propDef] of Object.entries(fieldDef.array_schema.properties)) {
                        const propValue = objectValue[propName];
                        
                        // Check if property is required
                        if ((propDef as any).required) {
                            // Handle conditional fields within object
                            if ((propDef as any).type === 'conditional') {
                                const conditionalValue = propValue;
                                if (!conditionalValue || !conditionalValue.selected_choice) {
                                    console.log(`❌ Object conditional field validation failed: ${fieldDef.name}.${propName}`, {
                                        propName,
                                        propValue: conditionalValue,
                                        required: true
                                    });
                                    return false;
                                }
                                
                                // Check sub-fields of selected option
                                const selectedChoice = conditionalValue.selected_choice;
                                const selectedOptionDef = (propDef as any).properties?.[selectedChoice];
                                if (selectedOptionDef?.properties) {
                                    const selectedOptionValue = conditionalValue[selectedChoice] || {};
                                    for (const [subName, subDef] of Object.entries(selectedOptionDef.properties)) {
                                        if ((subDef as any).required) {
                                            const subValue = selectedOptionValue[subName];
                                            if (subValue === undefined || subValue === null || subValue === '') {
                                                console.log(`❌ Object conditional sub-field validation failed: ${fieldDef.name}.${propName}.${selectedChoice}.${subName}`, {
                                                    subName,
                                                    subValue,
                                                    required: true
                                                });
                                                return false;
                                            }
                                        }
                                    }
                                }
                            } else {
                                // Regular property validation
                                if (propValue === undefined || propValue === null || propValue === '') {
                                    console.log(`❌ Object field validation failed: ${fieldDef.name}.${propName}`, {
                                        propName,
                                        propValue,
                                        required: true
                                    });
                                    return false;
                                }
                            }
                        }
                    }
                }
            } else {
                // Regular field validation
                if (isRequired) {
                    // Handle array fields specifically
                    if (fieldDef.type === 'array') {
                        if (!fieldValue || !Array.isArray(fieldValue) || fieldValue.length === 0) {
                            console.log(`❌ Required array field validation failed: ${fieldDef.name}`, {
                                fieldKey,
                                fieldValue,
                                isArray: Array.isArray(fieldValue),
                                length: Array.isArray(fieldValue) ? fieldValue.length : 'N/A',
                                isRequired,
                                fieldDef: fieldDef.name
                            });
                            return false;
                        }
                        
                        // Validate array items if they have required properties
                        if (fieldDef.array_schema?.properties) {
                            for (let i = 0; i < fieldValue.length; i++) {
                                const arrayItem = fieldValue[i];
                                for (const [propName, propDef] of Object.entries(fieldDef.array_schema.properties)) {
                                    if ((propDef as any).required) {
                                        const propValue = arrayItem?.[propName];
                                        if (propValue === undefined || propValue === null || propValue === '') {
                                            console.log(`❌ Array item property validation failed: ${fieldDef.name}[${i}].${propName}`, {
                                                arrayIndex: i,
                                                propName,
                                                propValue,
                                                required: true,
                                                fieldDef: fieldDef.name
                                            });
                                            return false;
                                        }
                                    }
                                }
                            }
                        }
                    } else {
                        // Regular non-array field validation
                        if (fieldValue === undefined || fieldValue === null || fieldValue === '') {
                            console.log(`❌ Regular field validation failed: ${fieldDef.name}`, {
                                fieldKey,
                                fieldValue,
                                isRequired,
                                fieldDef: fieldDef.name
                            });
                            return false;
                        }
                    }
                }
            }
        }
        
        return true;
    }
);

// Get all components of a specific type
export const selectComponentsByType = createSelector(
    [selectComponentInstances, (_state: RootState, componentType: string) => componentType],
    (componentInstances, componentType) => {
        return componentInstances.filter(comp => comp.type === componentType);
    }
);