import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/redux/store';
import { 
    Card, 
    Button, 
    Space, 
    Typography, 
    Tag,
    Spin,
    Alert,
    Divider,
    Steps,
    Progress,
    App
} from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    ArrowLeftOutlined, 
    PlayCircleOutlined, 
    ArrowRightOutlined,
    SettingOutlined,
    GlobalOutlined,
    ShareAltOutlined,
    CloudOutlined,
    ClusterOutlined,
    AimOutlined,
    FilterOutlined
} from '@ant-design/icons';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import SelectVersion from './SelectVersion';
import CurrentComponentCardRedux from './execution/CurrentComponentCardRedux';
import { isValidComponentName } from './execution/validationUtils';
import { capitalizeWords } from '@/utils/tools';

// Redux imports  
import {
    loadComponentCatalog,
    loadScenario,
    executeScenario,
    initializeExecution,
    updateComponentName,
    setCurrentStep,
    clearExecution
} from '@/redux/slices/scenarioSlice';
import {
    selectCurrentScenario,
    selectScenarioLoading,
    selectScenarioError,
    selectComponentCatalog,
    selectSortedComponents,
    selectCurrentComponent,
    selectCurrentComponentDefinition,
    selectCurrentStep,
    selectSelectedVersion,
    selectManaged,
    selectProject,
    selectExecutionResult,
    selectExecutionLoading,
    selectIsCurrentStepValid,
    selectCurrentComponentName,
    selectComponentNames,
    selectFieldValues
} from '@/redux/selectors/scenarioSelectors';

const { Title, Text, Paragraph } = Typography;

// Component type to icon mapping (using layout menu icons)
const componentTypeIconMap: Record<string, React.ReactNode> = {
    'cluster': <ClusterOutlined />,
    'listener': <GlobalOutlined />,
    'http_connection_manager': <FilterOutlined />,
    'route': <ShareAltOutlined />,
    'virtual_host': <CloudOutlined />,
    'endpoint': <AimOutlined />,
    'tcp_proxy': <FilterOutlined />,
    'router_filter': <FilterOutlined />,
    // Fallback icon for unknown types
    'default': <SettingOutlined />
};

const getComponentIcon = (componentType: string): React.ReactNode => {
    return componentTypeIconMap[componentType] || componentTypeIconMap['default'];
};

const DynamicScenarioExecutionRedux: React.FC = () => {
    const { scenarioId } = useParams<{ scenarioId: string }>();
    const navigate = useNavigate();
    const { project } = useProjectVariable();
    const dispatch = useDispatch<AppDispatch>();
    const { message } = App.useApp();

    // Redux state
    const scenario = useSelector((state: RootState) => selectCurrentScenario(state));
    const scenarioLoading = useSelector((state: RootState) => selectScenarioLoading(state));
    const scenarioError = useSelector((state: RootState) => selectScenarioError(state));
    const componentCatalog = useSelector((state: RootState) => selectComponentCatalog(state));
    const sortedComponents = useSelector((state: RootState) => selectSortedComponents(state));
    const currentComponent = useSelector((state: RootState) => selectCurrentComponent(state));
    const currentComponentDef = useSelector((state: RootState) => selectCurrentComponentDefinition(state));
    const currentStep = useSelector((state: RootState) => selectCurrentStep(state));
    const selectedVersion = useSelector((state: RootState) => selectSelectedVersion(state));
    const managed = useSelector((state: RootState) => selectManaged(state));
    const executionProject = useSelector((state: RootState) => selectProject(state));
    const executionResult = useSelector((state: RootState) => selectExecutionResult(state));
    const executionLoading = useSelector((state: RootState) => selectExecutionLoading(state));
    const isCurrentStepValid = useSelector((state: RootState) => selectIsCurrentStepValid(state));
    const currentComponentName = useSelector((state: RootState) => selectCurrentComponentName(state));
    const componentNames = useSelector((state: RootState) => selectComponentNames(state));
    const fieldValues = useSelector((state: RootState) => selectFieldValues(state));

    // Local state for version modal
    const [showVersionModal, setShowVersionModal] = React.useState(true);

    // Load component catalog on mount
    useEffect(() => {
        if (!componentCatalog) {
            dispatch(loadComponentCatalog());
        }
    }, [dispatch, componentCatalog]);

    // Load scenario on mount or when scenarioId changes
    useEffect(() => {
        if (scenarioId) {
            dispatch(loadScenario(scenarioId));
        }
        return () => {
            dispatch(clearExecution());
        };
    }, [dispatch, scenarioId]);

    // Initialize execution when scenario and catalog are loaded
    useEffect(() => {
        if (scenario && componentCatalog && selectedVersion && project && !executionProject) {
            dispatch(initializeExecution({
                scenario,
                version: selectedVersion,
                project,
                managed: false
            }));
        }
    }, [dispatch, scenario, componentCatalog, selectedVersion, project, executionProject]);

    const handleVersionSelect = (version: string, managedMode: boolean) => {
        setShowVersionModal(false);
        if (scenario) {
            dispatch(initializeExecution({
                scenario,
                version,
                project,
                managed: managedMode
            }));
        }
        const modeText = managedMode ? 'Managed by Elchi' : 'Control-Plane Only';
        message.success(`Selected proxy version: ${version} (${modeText})`);
    };

    const handleComponentNameChange = (originalName: string, newName: string) => {
        if (newName && typeof newName === 'string' && isValidComponentName(newName) && newName.trim() !== '') {
            dispatch(updateComponentName({ originalName, newName }));
        }
    };

    const handleNext = () => {
        if (currentStep < sortedComponents.length - 1) {
            dispatch(setCurrentStep(currentStep + 1));
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            dispatch(setCurrentStep(currentStep - 1));
        }
    };

    // Recursive function to process nested choice fields at any depth
    const processNestedChoiceField = (
        fieldValue: any,
        fieldDef: any,
        componentName: string,
        fieldPath: string = ''
    ): any => {
        if (!fieldDef || fieldDef.type !== 'nested_choice' || 
            !fieldValue || typeof fieldValue !== 'object' || !fieldValue.nested_selection) {
            return fieldValue;
        }

        const nestedSelection = fieldValue.nested_selection;
        if (!nestedSelection.selected_choice || !fieldDef.nested_config?.choices) {
            return fieldValue;
        }

        // Find the selected choice configuration
        const choiceConfig = fieldDef.nested_config.choices.find(c => c.value === nestedSelection.selected_choice);
        if (!choiceConfig?.sub_fields) {
            return fieldValue;
        }

        const nestedFieldValues: any[] = [];

        choiceConfig.sub_fields.forEach(subField => {
            // Try multiple key patterns to find the field value
            const possibleKeys = [
                // Pattern 1: Standard nested field
                fieldPath ? 
                    `${fieldPath}.nested_${fieldDef.name}_${nestedSelection.selected_choice}.${subField.name}` : 
                    `nested_${fieldDef.name}_${nestedSelection.selected_choice}.${subField.name}`,
                // Pattern 2: Direct nested (for double nested)
                `nested_${subField.name}_${nestedSelection.selected_choice}.${subField.name}`,
                // Pattern 3: Without parent path (for array fields in nested choices)
                `nested_${fieldDef.name}_${nestedSelection.selected_choice}.${subField.name}`,
                // Pattern 4: For virtual_host_config special case
                `nested_virtual_host_config_inline_virtual_hosts.${subField.name}`,
            ];
            
            let nestedFieldKey = possibleKeys[0]; // Default key
            let nestedFieldValue;
            
            // Try each possible key pattern
            for (const key of possibleKeys) {
                if (fieldValues[key] !== undefined && fieldValues[key] !== null) {
                    nestedFieldKey = key;
                    nestedFieldValue = fieldValues[key];
                    break;
                }
            }
            
            if (!nestedFieldValue) {
                nestedFieldValue = fieldValues[nestedFieldKey];
            }

            // If no runtime value, check existing sub_fields
            if (nestedFieldValue === undefined || nestedFieldValue === null) {
                const existingSubField = nestedSelection.sub_fields?.find(sf => sf.field_name === subField.name);
                if (existingSubField && existingSubField.value !== undefined && existingSubField.value !== null) {
                    nestedFieldValue = existingSubField.value;
                }
            }

            if (nestedFieldValue !== undefined && nestedFieldValue !== null) {
                // Build current path for recursive calls
                const currentPath = fieldPath ? 
                    `${fieldPath}.nested_${fieldDef.name}_${nestedSelection.selected_choice}` : 
                    `nested_${fieldDef.name}_${nestedSelection.selected_choice}`;
                
                // Recursively process if this sub-field is also a nested choice
                const processedValue = processNestedChoiceField(
                    nestedFieldValue, 
                    subField, 
                    componentName, 
                    currentPath
                );

                // For nested choice sub-fields, use nested_selection directly
                if (subField.type === 'nested_choice' && processedValue && 
                    typeof processedValue === 'object' && processedValue.nested_selection) {
                    nestedFieldValues.push({
                        field_name: subField.name,
                        required: subField.required_for_execution || false,
                        nested_selection: processedValue.nested_selection
                    });
                } else {
                    nestedFieldValues.push({
                        field_name: subField.name,
                        required: subField.required_for_execution || false,
                        value: processedValue
                    });
                }
            }
        });

        // Return the processed nested_selection structure
        return {
            ...fieldValue,
            nested_selection: {
                ...nestedSelection,
                sub_fields: nestedFieldValues
            }
        };
    };

    const handleExecute = async () => {
        if (!scenario || !project) {
            message.error('Scenario or project not found');
            return;
        }

        if (!selectedVersion) {
            message.error('Please select an Envoy version first');
            setShowVersionModal(true);
            return;
        }

        try {
            // Build components with runtime field values
            const componentsWithValues = sortedComponents.map(component => {
                const updatedComponent = { ...component };
                
                // Update component name to current name
                const currentComponentName = componentNames[component.name] || component.name;
                updatedComponent.name = currentComponentName;
                
                // Update selected fields with runtime values
                updatedComponent.selected_fields = component.selected_fields.map(selectedField => {
                    const fieldKey = `${component.name}.${selectedField.field_name}`;
                    const runtimeValue = fieldValues[fieldKey];
                    
                    // Get field definition to check for use_component_name and default values
                    const componentDef = componentCatalog?.find(c => c.name === component.type);
                    const fieldDef = componentDef?.available_fields.find(f => f.name === selectedField.field_name);
                    
                    let finalValue = selectedField.value; // Start with existing value
                    
                    // For nested choice fields, we need to build the structure from Redux values
                    if (fieldDef?.type === 'nested_choice') {
                        // Check if there's a runtime value for the nested choice selection
                        const nestedChoiceKey = `${component.name}.${selectedField.field_name}`;
                        const nestedChoiceValue = fieldValues[nestedChoiceKey];
                                                
                        // Build nested_selection structure from Redux values
                        if (nestedChoiceValue && typeof nestedChoiceValue === 'object' && nestedChoiceValue.nested_selection) {
                            finalValue = nestedChoiceValue;
                        } else if (!finalValue || typeof finalValue !== 'object' || !finalValue.nested_selection) {
                            // If no nested_selection structure exists, create one
                            // Look for the selected choice in Redux
                            const choiceKeys = Object.keys(fieldValues).filter(k => 
                                k.startsWith(`nested_${selectedField.field_name}_`)
                            );
                                                        
                            if (choiceKeys.length > 0 && fieldDef.nested_config?.choices) {
                                // Extract the selected choice from the first key
                                const firstKey = choiceKeys[0];
                                const match = firstKey.match(new RegExp(`nested_${selectedField.field_name}_([^.]+)`));
                                const selectedChoice = match ? match[1] : fieldDef.nested_config.default_choice;
                                                                
                                finalValue = {
                                    field_name: selectedField.field_name,
                                    required: selectedField.required || false,
                                    nested_selection: {
                                        selected_choice: selectedChoice,
                                        sub_fields: []
                                    }
                                };
                            }
                        }
                        
                        // Now process the nested choice field recursively
                        if (finalValue && typeof finalValue === 'object' && finalValue.nested_selection) {
                            finalValue = processNestedChoiceField(
                                finalValue, 
                                fieldDef, 
                                component.name,
                                '' // Empty path for top-level nested fields
                            );
                        }
                    }
                    // Priority order for value resolution for non-nested fields:
                    // 1. Runtime value from Redux (user input)
                    else if (runtimeValue !== undefined && runtimeValue !== null) {
                        finalValue = runtimeValue;
                    }
                    // 2. use_component_name fields should use current component name
                    else if (fieldDef?.use_component_name) {
                        finalValue = currentComponentName;
                    }
                    // 3. Keep existing value or fall back to field default
                    else if (finalValue === undefined && fieldDef?.default_value !== undefined) {
                        finalValue = fieldDef.default_value;
                    }
                    
                    // 4. Check for :componentname: placeholder pattern
                    if (typeof finalValue === 'string' && finalValue === ':componentname:') {
                        finalValue = currentComponentName;
                    }
                    
                    // Final value transformation for execution - ensure component names are updated
                    let executionValue = finalValue;
                    
                    // For connected fields, make sure we're using the latest component names
                    if (fieldDef?.connected && typeof finalValue === 'string') {
                        // Check if this value matches any old component name
                        const originalComponentName = Object.keys(componentNames).find(
                            origName => finalValue === origName && componentNames[origName] !== origName
                        );
                        if (originalComponentName) {
                            executionValue = componentNames[originalComponentName];
                        }
                    } else if (fieldDef?.connected && Array.isArray(finalValue)) {
                        // For array connected fields, update all component name references
                        executionValue = finalValue.map(item => {
                            if (typeof item === 'string') {
                                const originalComponentName = Object.keys(componentNames).find(
                                    origName => item === origName && componentNames[origName] !== origName
                                );
                                return originalComponentName ? componentNames[originalComponentName] : item;
                            }
                            return item;
                        });
                    }
                    
                    // For nested choice fields, don't wrap in value - use nested_selection directly
                    if (fieldDef?.type === 'nested_choice' && executionValue && 
                        typeof executionValue === 'object' && executionValue.nested_selection) {
                        return {
                            ...selectedField,
                            nested_selection: executionValue.nested_selection
                        };
                    }
                    
                    return {
                        ...selectedField,
                        value: executionValue
                    };
                });
                
                return updatedComponent;
            });
                        
            const result = await dispatch(executeScenario({
                scenarioId: scenario.scenario_id,
                components: componentsWithValues,
                project,
                version: selectedVersion,
                managed
            })).unwrap();
            
            if (result.success) {
                message.success(`Scenario executed successfully! Generated ${result.resources?.length || 0} resources.`);
            }
            // Error handling is now done via executionResult state and Alert component below
        } catch (error: any) {
            const responseData = error.response?.data;
            
            if (responseData?.message && responseData.message.includes('Validation failed')) {
                message.error(responseData.message);
            } else {
                message.error(`Failed to execute scenario: ${responseData?.message || error.message}`);
            }
        }
    };

    if (scenarioLoading) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" />
                <div style={{ marginTop: '16px' }}>Loading scenario...</div>
            </div>
        );
    }

    if (scenarioError || !scenario) {
        return (
            <div style={{ padding: '24px' }}>
                <Alert
                    message="Scenario Not Found"
                    description="The requested scenario could not be loaded."
                    type="error"
                    showIcon
                    action={
                        <Button onClick={() => navigate('/scenarios')}>
                            Back to Scenarios
                        </Button>
                    }
                />
            </div>
        );
    }

    return (
        <div style={{ padding: '24px' }}>
            {/* Version Selection Modal */}
            <SelectVersion
                open={showVersionModal}
                onVersionSelect={handleVersionSelect}
                onCancel={() => navigate('/scenarios')}
            />

            {/* Header Section */}
            <div style={{ 
                marginBottom: '32px',
                padding: '24px',
                background: 'linear-gradient(135deg, #00c6fb 0%, #056ccd 100%)',
                borderRadius: '12px',
                color: 'white'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                    <Button 
                        icon={<ArrowLeftOutlined />} 
                        onClick={() => navigate('/scenarios')}
                        style={{ 
                            background: 'rgba(255, 255, 255, 0.15)',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            color: 'white',
                            borderRadius: '8px'
                        }}
                        ghost
                    >
                        Back to Scenarios
                    </Button>
                    
                    <Space wrap>
                        {selectedVersion && (
                            <Tag 
                                style={{ 
                                    background: 'rgba(82, 196, 26, 0.2)',
                                    border: '1px solid rgba(82, 196, 26, 0.5)',
                                    color: '#52c41a',
                                    borderRadius: '6px',
                                    fontWeight: 600,
                                    cursor: 'pointer'
                                }}
                                onClick={() => setShowVersionModal(true)}
                            >
                                Version: {selectedVersion} (click to change)
                            </Tag>
                        )}
                        {!selectedVersion && (
                            <Button
                                size="small"
                                onClick={() => setShowVersionModal(true)}
                                style={{ 
                                    background: 'rgba(255, 193, 7, 0.2)',
                                    border: '1px solid rgba(255, 193, 7, 0.5)',
                                    color: '#faad14'
                                }}
                            >
                                Select Version
                            </Button>
                        )}
                        <Tag style={{ 
                            background: 'rgba(255, 255, 255, 0.15)',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            color: 'white',
                            borderRadius: '6px'
                        }}>
                            ID: {scenario.scenario_id}
                        </Tag>
                        <Tag style={{ 
                            background: 'rgba(255, 255, 255, 0.15)',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            color: 'white',
                            borderRadius: '6px'
                        }}>
                            {scenario.components.length} Components
                        </Tag>
                    </Space>
                </div>
                
                <div>
                    <Title level={1} style={{ color: 'white', margin: 0, marginBottom: '8px', fontSize: '28px' }}>
                        {scenario.name}
                    </Title>
                    <Paragraph style={{ color: 'rgba(255, 255, 255, 0.85)', margin: 0, fontSize: '16px', lineHeight: '1.5' }}>
                        {scenario.description}
                    </Paragraph>
                </div>
            </div>

            {/* Managed Mode Info */}
            {managed && (
                <Alert
                    message="Managed Mode Active"
                    description="Elchi will handle full deployment: deploys to managed clients, and automatically manages IP addresses and networking."
                    type="info"
                    showIcon
                    style={{ marginBottom: '24px' }}
                />
            )}

            {executionResult && (
                <Alert
                    message={executionResult.success ? "Execution Completed" : "Configuration Validation Failed"}
                    description={
                        executionResult.success ? (
                            <div>
                                <p style={{ marginBottom: '8px', color: '#52c41a' }}>
                                    Scenario executed successfully!
                                </p>
                                {executionResult.resources && (
                                    <p style={{ margin: 0, color: '#595959' }}>
                                        Generated {executionResult.resources.length} resources and saved to database.
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div>
                                {(() => {
                                    const errorMessage = executionResult.message || 'Unknown error';
                                    
                                    // Always show modern error display for any error
                                    const cleanMessage = errorMessage
                                        .replace(/failed to save component .+ to database: failed to save resource via XDS SetResource: Validation error: /, '')
                                        .replace(/Validation error: /, '')
                                        .trim();
                                    
                                    // Split by newlines and filter out empty lines
                                    const validationErrors = cleanMessage
                                        .split(/\n/)
                                        .map(line => line.trim())
                                        .filter(line => line.length > 0)
                                        .map(line => line.startsWith(':') ? line.substring(1).trim() : line);
                                    
                                    // Always show modern card-based display
                                    return (
                                        <div style={{ marginTop: '12px' }}>
                                            <p style={{ marginBottom: '16px', color: '#ff4d4f', fontWeight: 500 }}>
                                                Please fix the following configuration issue{validationErrors.length > 1 ? 's' : ''}:
                                            </p>
                                            <ul style={{ 
                                                margin: 0, 
                                                paddingLeft: '0',
                                                listStyle: 'none'
                                            }}>
                                                {validationErrors.map((error, index) => (
                                                    <li key={index} style={{
                                                        marginBottom: '12px',
                                                        padding: '12px 16px',
                                                        backgroundColor: '#fff2f0',
                                                        border: '1px solid #ffccc7',
                                                        borderRadius: '6px',
                                                        borderLeft: '4px solid #ff4d4f'
                                                    }}>
                                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                                                            <span style={{
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                width: '20px',
                                                                height: '20px',
                                                                backgroundColor: '#ff4d4f',
                                                                color: 'white',
                                                                borderRadius: '50%',
                                                                fontSize: '12px',
                                                                fontWeight: 'bold',
                                                                flexShrink: 0
                                                            }}>
                                                                {index + 1}
                                                            </span>
                                                            <span style={{ 
                                                                color: '#595959',
                                                                lineHeight: '1.5',
                                                                fontSize: '14px'
                                                            }}>
                                                                {error}
                                                            </span>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    );
                                })()}
                            </div>
                        )
                    }
                    type={executionResult.success ? "success" : "error"}
                    showIcon
                    style={{ marginBottom: '24px' }}
                />
            )}

            {/* Configuration Wizard */}
            <Card 
                title={<span>Configuration - Step by Step</span>}
            >
                {/* Progress */}
                <div style={{ marginBottom: '24px' }}>
                    <Progress 
                        percent={sortedComponents.length ? Math.round(((currentStep + 1) / sortedComponents.length) * 100) : 0}
                        format={() => `${currentStep + 1} / ${sortedComponents.length}`}
                        style={{ marginBottom: '16px' }}
                    />
                    
                    <Text type="secondary">
                        Configure resources step by step in priority order. Fill required fields to proceed.
                    </Text>
                </div>

                {/* Steps */}
                <Steps 
                    current={currentStep} 
                    style={{ marginBottom: '32px' }}
                    size="small"
                    onChange={(newStep) => {
                        // Only allow navigation if current step is valid or going backwards
                        if (newStep < currentStep || isCurrentStepValid) {
                            dispatch(setCurrentStep(newStep));
                        } else {
                            message.warning('Please complete the current step before moving forward');
                        }
                    }}
                >
                    {sortedComponents.map((component, index) => (
                        <Steps.Step
                            key={index}
                            title={index === currentStep ? currentComponentName : (componentNames[component.name] || component.name)}
                            description={capitalizeWords(component.type.replace(/_/g, ' '))}
                            icon={getComponentIcon(component.type)}
                            style={{ cursor: 'pointer' }}
                        />
                    ))}
                </Steps>

                {/* Current Component Configuration */}
                {currentComponent && currentComponentDef && (
                    <CurrentComponentCardRedux
                        currentComponent={currentComponent}
                        componentDef={currentComponentDef}
                        onComponentNameChange={handleComponentNameChange}
                    />
                )}

                <Divider />

                {/* Navigation */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button 
                        icon={<ArrowLeftOutlined />}
                        onClick={handlePrev}
                        disabled={currentStep === 0}
                    >
                        Previous
                    </Button>
                    
                    <Space>
                        <Text type="secondary">
                            Step {currentStep + 1} of {sortedComponents.length}
                        </Text>
                        {!isCurrentStepValid && (
                            <Tag color="red">
                                {(() => {
                                    if (!isValidComponentName(currentComponentName) || currentComponentName.trim() === '') {
                                        return 'Invalid component name';
                                    }
                                    return 'Please fill required fields';
                                })()}
                            </Tag>
                        )}
                    </Space>
                    
                    {currentStep < sortedComponents.length - 1 ? (
                        <Button 
                            type="primary"
                            icon={<ArrowRightOutlined />}
                            onClick={handleNext}
                            disabled={!isCurrentStepValid}
                        >
                            Next
                        </Button>
                    ) : (
                        <Button
                            type="primary"
                            icon={<PlayCircleOutlined />}
                            onClick={handleExecute}
                            loading={executionLoading}
                            disabled={!isCurrentStepValid}
                            size="large"
                        >
                            Execute Scenario
                        </Button>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default DynamicScenarioExecutionRedux;