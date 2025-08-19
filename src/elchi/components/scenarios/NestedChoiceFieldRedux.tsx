import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Card, Radio, Space, Typography, Tag, Alert } from 'antd';
import type {
    AvailableField,
    ConditionalChoice,
    NestedFieldSelection,
    SelectedField
} from './hooks/useScenarioAPI';
import { api } from '@/common/api';
import FieldInputRedux from './execution/FieldInputRedux';
import {
    selectSelectedVersion,
    selectProject
} from '@/redux/selectors/scenarioSelectors';

const { Text } = Typography;

interface NestedChoiceFieldReduxProps {
    field: AvailableField;
    value?: SelectedField;
    onChange: (value: SelectedField) => void;
}

const NestedChoiceFieldRedux: React.FC<NestedChoiceFieldReduxProps> = React.memo(({
    field,
    value,
    onChange
}) => {
    // Redux state
    const selectedVersion = useSelector(selectSelectedVersion);
    const project = useSelector(selectProject);
    
    const [selectedChoice, setSelectedChoice] = useState<string>(() => {
        const initialChoice = value?.nested_selection?.selected_choice || field.nested_config?.default_choice || '';
        console.log('🎯 Initial selectedChoice state:', {
            valueFromParent: value?.nested_selection?.selected_choice,
            defaultFromField: field.nested_config?.default_choice,
            finalChoice: initialChoice,
            fieldName: field.name
        });
        return initialChoice;
    });
    const [loadingApi, setLoadingApi] = useState<Set<string>>(new Set());

    // Find the selected choice configuration
    const selectedChoiceConfig = useMemo(() => 
        field.nested_config?.choices?.find(choice => choice.value === selectedChoice),
        [field.nested_config?.choices, selectedChoice]
    );

    // Load API data for choices that have api_endpoint
    const loadApiData = useCallback(async (choice: ConditionalChoice) => {
        if (!choice.api_endpoint) return;
        
        // Check if already loading using functional state update
        let shouldLoad = false;
        setLoadingApi(prev => {
            if (prev.has(choice.value)) {
                return prev; // Already loading
            }
            shouldLoad = true;
            return new Set([...prev, choice.value]);
        });
        
        if (!shouldLoad) return;
        
        try {
            const url = new URL(choice.api_endpoint, window.location.origin);
            if (selectedVersion) {
                url.searchParams.set('version', selectedVersion);
            }
            if (project) {
                url.searchParams.set('project', project);
            }
            
            await api.get(url.pathname + url.search);
        } catch (error) {
            console.error(`Failed to load API data for choice ${choice.value}:`, error);
        } finally {
            // Always clear loading state
            setLoadingApi(prev => {
                const newSet = new Set(prev);
                newSet.delete(choice.value);
                return newSet;
            });
        }
    }, [selectedVersion, project]);

    // Load API data when choice changes
    useEffect(() => {
        if (selectedChoiceConfig?.api_endpoint) {
            loadApiData(selectedChoiceConfig);
        }
    }, [selectedChoiceConfig, loadApiData]);

    // Initialize default choice on mount
    useEffect(() => {
        // If no value exists but there's a selected choice (from default), send to parent
        if (selectedChoice && (!value || !value.nested_selection)) {
            const newSelection: NestedFieldSelection = {
                selected_choice: selectedChoice,
                sub_fields: []
            };
            
            const newValue: SelectedField = {
                field_name: field.name,
                required: value?.required || false,
                nested_selection: newSelection
            };
            
            console.log('🔄 Initializing default choice, sending to parent:', {
                fieldName: field.name,
                selectedChoice,
                newValue
            });
            
            onChange(newValue);
        }
    }, [selectedChoice, value, field.name, onChange]); // Run when these change

    // Handle choice selection
    const handleChoiceChange = (choiceValue: string) => {
        console.log('🔄 handleChoiceChange called with:', choiceValue);
        console.log('🔄 Current selectedChoice state:', selectedChoice);
        
        setSelectedChoice(choiceValue);
        
        // Clear sub-field values when switching choices
        const newSelection: NestedFieldSelection = {
            selected_choice: choiceValue,
            sub_fields: []
        };
        
        const newValue: SelectedField = {
            field_name: field.name,
            required: value?.required || false,
            nested_selection: newSelection
        };
        
        console.log('🔄 Choice changed, sending value to parent:', {
            fieldName: field.name,
            choiceValue,
            newValue,
            currentState: selectedChoice
        });
        
        onChange(newValue);
        
        // Load API data for new choice if needed
        const newChoiceConfig = field.nested_config?.choices?.find(c => c.value === choiceValue);
        if (newChoiceConfig?.api_endpoint) {
            loadApiData(newChoiceConfig);
        }
    };


    // Memoize temp component name
    const tempComponentName = useMemo(() => `nested_${field.name}_${selectedChoice}`, [field.name, selectedChoice]);

    // Render sub-fields - memoized to prevent recreation
    const renderedSubFields = useMemo(() => {
        if (!selectedChoiceConfig?.sub_fields) return null;
        
        return selectedChoiceConfig.sub_fields.map(subField => (
            <div key={subField.name}>
                <FieldInputRedux
                    field={subField}
                    componentName={tempComponentName}
                    required={subField.required_for_execution || false}
                    selectedVersion={selectedVersion}
                    project={project}
                />
            </div>
        ));
    }, [selectedChoiceConfig?.sub_fields, tempComponentName, selectedVersion, project]);

    if (!field.nested_config) {
        return (
            <Alert
                message="Configuration Error"
                description="This nested choice field is missing configuration data."
                type="error"
                showIcon
            />
        );
    }

    return (
        <Card 
            size="small"
            title={<span>{field.label}</span>}
            style={{ marginBottom: '16px' }}
        >
            {field.description && (
                <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '16px' }}>
                    {field.description}
                </Text>
            )}
            
            {/* Choice Selection */}
            <div style={{ marginBottom: '16px' }}>
                <Text strong style={{ fontSize: '13px', display: 'block', marginBottom: '8px' }}>
                    Configuration Method:
                </Text>
                <Radio.Group
                    value={selectedChoice}
                    onChange={(e) => {
                        console.log('📻 Radio.Group onChange triggered:', e.target.value);
                        handleChoiceChange(e.target.value);
                    }}
                    style={{ width: '100%' }}
                >
                    <Space direction="vertical" style={{ width: '100%' }}>
                        {field.nested_config.choices.map(choice => (
                            <div key={choice.value} style={{ width: '100%' }}>
                                <Radio 
                                    value={choice.value}
                                    style={{ 
                                        width: '100%',
                                        padding: '8px',
                                        borderRadius: '4px',
                                        border: selectedChoice === choice.value ? '1px solid #1890ff' : '1px solid transparent',
                                        backgroundColor: selectedChoice === choice.value ? '#f6ffed' : 'transparent'
                                    }}
                                >
                                    <div>
                                        <Text strong style={{ fontSize: '13px' }}>
                                            {choice.label}
                                        </Text>
                                        {choice.api_endpoint && (
                                            <Tag className='auto-width-tag' color="cyan" style={{ fontSize: '9px', marginLeft: '8px' }}>
                                                Resource List
                                            </Tag>
                                        )}
                                        {loadingApi.has(choice.value) && (
                                            <Tag color="blue" style={{ fontSize: '9px', marginLeft: '4px' }}>
                                                Loading...
                                            </Tag>
                                        )}
                                    </div>
                                </Radio>
                            </div>
                        ))}
                    </Space>
                </Radio.Group>
            </div>

            {/* Sub-fields for selected choice */}
            {selectedChoiceConfig && selectedChoiceConfig.sub_fields && selectedChoiceConfig.sub_fields.length > 0 && (
                <Card 
                    size="small" 
                    type="inner"
                    title={<span>{selectedChoiceConfig.label} Configuration</span>}
                    style={{ backgroundColor: '#fafafa' }}
                >
                    <Space direction="vertical" style={{ width: '100%' }} size="middle">
                        {renderedSubFields}
                    </Space>
                </Card>
            )}

            {/* Show message when no choice is selected */}
            {!selectedChoice && (
                <Alert
                    message="Select Configuration Method"
                    description="Please select how you want to configure this component."
                    type="info"
                    showIcon
                    style={{ marginTop: '16px' }}
                />
            )}
        </Card>
    );
});

NestedChoiceFieldRedux.displayName = 'NestedChoiceFieldRedux';

export default NestedChoiceFieldRedux;