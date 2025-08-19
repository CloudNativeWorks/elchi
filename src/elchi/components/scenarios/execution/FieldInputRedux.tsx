import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
    Input, 
    InputNumber, 
    Select, 
    Switch, 
    Tag, 
    Button, 
    Radio,
    Typography
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { 
    AvailableField
} from '../hooks/useScenarioAPI';
import { getFieldPlaceholder, formatDefaultValue } from '../utils/displayUtils';
import NestedChoiceFieldRedux from '../NestedChoiceFieldRedux';
import ArrayFieldItemRedux from './ArrayFieldItemRedux';
import { api } from '@/common/api';
import { GTypes, getFieldsByGType } from '@/common/statics/gtypes';
import { isSimpleStringArray, getArrayPlaceholder, getArrayDefaultValue } from '../utils/arrayDetection';

// Redux imports
import { updateFieldValue } from '@/redux/slices/scenarioSlice';
import { RootState } from '@/redux/store';
import {
    selectFieldValue,
    selectComponentInstances,
    selectComponentNames,
    selectFieldValues,
    selectComponentCatalog
} from '@/redux/selectors/scenarioSelectors';

const { Option } = Select;
const { TextArea } = Input;
const { Text } = Typography;

interface FieldInputReduxProps {
    field: AvailableField;
    componentName: string;
    required: boolean;
    selectedVersion?: string;
    project?: string;
    managed?: boolean;
    componentType?: string;
}

interface SystemResource {
    name: string;
    canonical_name?: string;
    gtype?: string;
    type?: string;
    category?: string;
    collection?: string;
    [key: string]: any;
}

interface ConnectedOption {
    value: string;
    label: string;
    componentName: string;
    componentType: string;
}

const FieldInputRedux: React.FC<FieldInputReduxProps> = ({
    field,
    componentName,
    required,
    selectedVersion,
    project,
    managed,
    componentType
}) => {
    const dispatch = useDispatch();
    
    // Redux state
    const value = useSelector((state: RootState) => selectFieldValue(state, componentName, field.name));
    const allComponents = useSelector((state: RootState) => selectComponentInstances(state));
    const componentNames = useSelector((state: RootState) => selectComponentNames(state));
    const runtimeValues = useSelector((state: RootState) => selectFieldValues(state));
    const componentCatalog = useSelector((state: RootState) => selectComponentCatalog(state));

    
    // Check if this field should be disabled in managed mode
    const isDisabledInManagedMode = managed && componentType === 'listener' && field.name === 'address';
    
    // Local state for API endpoint fields
    const [systemResources, setSystemResources] = useState<SystemResource[]>([]);
    const [loadingSystemResources, setLoadingSystemResources] = useState(false);
    const [selectedSource, setSelectedSource] = useState<'scenario' | 'system'>('scenario');
    
    // Load system resources if field has API endpoint
    const loadSystemResources = useCallback(async () => {
        if (!field.api_endpoint || !selectedVersion || !project) return;
        
        setLoadingSystemResources(true);
        try {
            const url = new URL(field.api_endpoint, window.location.origin);
            url.searchParams.set('version', selectedVersion);
            url.searchParams.set('project', project);
            
            const response = await api.get(url.pathname + url.search);
            const resources = response.data?.resources || response.data || [];
            setSystemResources(Array.isArray(resources) ? resources : []);
        } catch (error) {
            console.error('Failed to load system resources:', error);
            setSystemResources([]);
        } finally {
            setLoadingSystemResources(false);
        }
    }, [field.api_endpoint, selectedVersion, project]);

    useEffect(() => {
        if (field.api_endpoint) {
            loadSystemResources();
        }
    }, [loadSystemResources]);


    // Use useMemo for connected options calculation to avoid selector instability
    const connectedOptions: ConnectedOption[] = useMemo(() => {
        if (!field.connected || !field.connected.component_types) return [];
        
        const connectedComponents = allComponents.filter(comp => 
            field.connected!.component_types.includes(comp.type)
        );
        
        
        return connectedComponents.map(comp => {
            const updatedComponentName = componentNames[comp.name] || comp.name;
            
            // Check for special :componentname: pattern
            if (field.connected!.field_name === ':componentname:') {
                return {
                    value: updatedComponentName,
                    label: updatedComponentName,
                    componentName: updatedComponentName,
                    componentType: comp.type
                };
            }
            
            // Use field value if available, otherwise component name
            let displayValue: string;
            const fieldKey = `${comp.name}.${field.connected!.field_name}`;
            const fieldValue = runtimeValues[fieldKey];
            
            if (fieldValue !== undefined && fieldValue !== null && fieldValue !== '') {
                displayValue = String(fieldValue);
            } else {
                const connectedField = comp.selected_fields.find(f => 
                    f.field_name === field.connected!.field_name
                );
                if (connectedField?.value !== undefined && connectedField.value !== null) {
                    displayValue = String(connectedField.value);
                } else {
                    displayValue = updatedComponentName;
                }
            }
            
            return {
                value: displayValue,
                label: displayValue,
                componentName: updatedComponentName,
                componentType: comp.type
            };
        });
    }, [
        field.connected, 
        allComponents, 
        componentNames, 
        runtimeValues
    ]);

    // Initialize default values on mount
    useEffect(() => {
        // Only set default if no value exists yet
        if (value === undefined || value === null) {
            let defaultValue = undefined;
            
            // Handle use_component_name fields
            if (field.use_component_name) {
                const currentComponentName = componentNames[componentName] || componentName;
                defaultValue = currentComponentName;
            }
            // Handle fields with default_value
            else if (field.default_value !== undefined) {
                switch (field.type) {
                    case 'nested_choice':
                        if (field.nested_config?.default_choice) {
                            defaultValue = {
                                field_name: field.name,
                                required: required || false,
                                nested_selection: {
                                    selected_choice: field.nested_config.default_choice,
                                    sub_fields: []
                                }
                            };
                        }
                        break;
                    case 'array':
                        defaultValue = Array.isArray(field.default_value) ? field.default_value : [];
                        break;
                    case 'object':
                        defaultValue = typeof field.default_value === 'object' ? field.default_value : {};
                        break;
                    case 'bool':
                        defaultValue = Boolean(field.default_value);
                        break;
                    case 'int':
                        defaultValue = typeof field.default_value === 'number' ? field.default_value : parseInt(String(field.default_value)) || 0;
                        break;
                    default:
                        defaultValue = field.default_value;
                        break;
                }
            }
            
            // Set default value if we have one
            if (defaultValue !== undefined) {
                console.log('🎯 Setting default value:', {
                    componentName,
                    fieldName: field.name,
                    fieldType: field.type,
                    defaultValue
                });
                
                dispatch(updateFieldValue({
                    componentName,
                    fieldName: field.name,
                    value: defaultValue
                }));
            }
        }
    }, [field, componentName, componentNames, required, dispatch, value]);

    const onChange = (newValue: any) => {
        console.log('📤 FieldInputRedux onChange:', {
            componentName,
            fieldName: field.name,
            newValue,
            fieldType: field.type
        });
        
        dispatch(updateFieldValue({
            componentName,
            fieldName: field.name,
            value: newValue
        }));
    };

    // Render connected field (API + Connected combination)
    const renderConnectedField = () => {
        const hasConnected = field.connected && connectedOptions.length > 0;
        const hasApiEndpoint = field.api_endpoint && systemResources.length > 0;
        
        // Check if connected component types exist in scenario
        const hasConnectedComponentsInScenario = field.connected && field.connected.component_types && 
            field.connected.component_types.some(type => 
                allComponents.some(comp => comp.type === type)
            );
        
        // Determine display strategy based on use_api_and_scenario flag
        if (field.use_api_and_scenario) {
            // Show both API and scenario options always (new behavior)
            if (hasConnected || hasApiEndpoint) {
                return (
                    <div>
                        <div style={{ marginBottom: '12px' }}>
                            <Radio.Group
                                value={selectedSource}
                                onChange={(e) => {
                                    setSelectedSource(e.target.value);
                                    // Don't clear value when switching sources - let user maintain their selection
                                }}
                                style={{ display: 'flex', gap: '16px' }}
                            >
                                <Radio value="scenario" disabled={connectedOptions.length === 0}>
                                    From Scenario ({connectedOptions.length})
                                </Radio>
                                <Radio value="system">
                                    Resource List ({systemResources.length})
                                </Radio>
                            </Radio.Group>
                        </div>
                        
                        {selectedSource === 'scenario' ? (
                            <Select
                                placeholder={`Select from scenario ${field.connected!.component_types?.join('/') || 'component'}s`}
                                value={field.has_metadata && typeof value === 'object' ? value?.name : value}
                                onChange={(selectedValue) => {
                                    if (field.has_metadata) {
                                        // Find the connected component and create metadata object using component catalog
                                        const selectedOption = connectedOptions.find(opt => opt.value === selectedValue);
                                        if (selectedOption) {
                                            // [Same metadata logic as below]
                                            const componentInstance = allComponents.find(comp => 
                                                comp.name === selectedOption.componentName || 
                                                (componentNames[comp.name] || comp.name) === selectedOption.componentName
                                            );
                                            
                                            if (componentInstance && componentInstance.gtype) {
                                                try {
                                                    const gtypeEnumKey = Object.keys(GTypes).find(key => 
                                                        GTypes[key as keyof typeof GTypes] === componentInstance.gtype
                                                    ) as keyof typeof GTypes;
                                                    
                                                    if (gtypeEnumKey) {
                                                        const gtypeData = getFieldsByGType(GTypes[gtypeEnumKey]);
                                                        const metadataObject = {
                                                            name: selectedOption.value,
                                                            canonical_name: gtypeData.canonicalName,
                                                            gtype: componentInstance.gtype,
                                                            type: gtypeData.type,
                                                            category: gtypeData.canonicalName.split('.').slice(0, -1).join('.'),
                                                            collection: gtypeData.collection
                                                        };
                                                        
                                                        console.log('✅ Using GType metadata for connected component (use_api_and_scenario):', {
                                                            selectedValue,
                                                            componentInstance: componentInstance.name,
                                                            gtype: componentInstance.gtype,
                                                            gtypeData,
                                                            metadataObject
                                                        });
                                                        
                                                        onChange(metadataObject);
                                                    } else {
                                                        console.error('❌ GType not found in enum:', componentInstance.gtype);
                                                        onChange(selectedValue);
                                                    }
                                                } catch (error) {
                                                    console.error('❌ Error processing GType:', componentInstance.gtype, error);
                                                    onChange(selectedValue);
                                                }
                                            } else {
                                                console.error('❌ Component instance or gtype not found:', {
                                                    componentName: selectedOption.componentName,
                                                    componentInstance,
                                                    gtype: componentInstance?.gtype
                                                });
                                                onChange(selectedValue);
                                            }
                                        } else {
                                            onChange(selectedValue);
                                        }
                                    } else {
                                        onChange(selectedValue);
                                    }
                                }}
                                style={commonStyle}
                                showSearch
                                allowClear
                                optionLabelProp="label"
                            >
                                {connectedOptions.map(option => (
                                    <Option key={option.value} value={option.value} label={option.label}>
                                        <div style={{ 
                                            display: 'flex', 
                                            justifyContent: 'space-between', 
                                            alignItems: 'flex-start',
                                            maxWidth: '100%',
                                            overflow: 'hidden'
                                        }}>
                                            <div style={{ flex: 1, minWidth: 0, marginRight: '8px' }}>
                                                <div style={{ 
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                    maxWidth: '100%'
                                                }}>
                                                    {option.label}
                                                </div>
                                                {field.connected!.field_name !== ':componentname:' && (
                                                    <div style={{ 
                                                        fontSize: '12px', 
                                                        color: '#8c8c8c',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap'
                                                    }}>
                                                        from {option.componentName} ({option.componentType})
                                                    </div>
                                                )}
                                            </div>
                                            <Tag className='auto-width-tag' color="blue" style={{ fontSize: '10px', flexShrink: 0 }}>Scenario</Tag>
                                        </div>
                                    </Option>
                                ))}
                            </Select>
                        ) : (
                            <Select
                                placeholder="Select from resource list"
                                value={field.has_metadata && typeof value === 'object' ? value?.name : value}
                                onChange={(selectedValue) => {
                                    if (field.has_metadata) {
                                        const selectedResource = systemResources.find(r => r.name === selectedValue);
                                        onChange(selectedResource || selectedValue);
                                    } else {
                                        onChange(selectedValue);
                                    }
                                }}
                                style={commonStyle}
                                showSearch
                                allowClear
                                loading={loadingSystemResources}
                                optionLabelProp="label"
                            >
                                {systemResources.map(resource => (
                                    <Option key={resource.name} value={resource.name} label={resource.name}>
                                        <div style={{ 
                                            display: 'flex', 
                                            justifyContent: 'space-between', 
                                            alignItems: 'flex-start',
                                            maxWidth: '100%',
                                            overflow: 'hidden'
                                        }}>
                                            <div style={{ flex: 1, minWidth: 0, marginRight: '8px' }}>
                                                <div style={{ 
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                    maxWidth: '100%'
                                                }}>
                                                    {resource.name}
                                                </div>
                                                {resource.canonical_name && (
                                                    <div style={{ 
                                                        fontSize: '12px', 
                                                        color: '#8c8c8c',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap'
                                                    }}>
                                                        {resource.canonical_name}
                                                    </div>
                                                )}
                                            </div>
                                            <Tag className='auto-width-tag' color="green" style={{ fontSize: '10px', flexShrink: 0 }}>Resource</Tag>
                                        </div>
                                    </Option>
                                ))}
                            </Select>
                        )}
                    </div>
                );
            } else if (hasConnected) {
                // Only scenario components available
                return (
                    <Select
                        placeholder={`Select from scenario ${field.connected!.component_types?.join('/') || 'component'}s`}
                        value={field.has_metadata && typeof value === 'object' ? value?.name : value}
                        onChange={(selectedValue) => {
                            // [Same onChange logic as original scenario-only selection]
                            if (field.has_metadata) {
                                const selectedOption = connectedOptions.find(opt => opt.value === selectedValue);
                                if (selectedOption) {
                                    const componentInstance = allComponents.find(comp => 
                                        comp.name === selectedOption.componentName || 
                                        (componentNames[comp.name] || comp.name) === selectedOption.componentName
                                    );
                                    
                                    if (componentInstance && componentInstance.gtype) {
                                        try {
                                            const gtypeEnumKey = Object.keys(GTypes).find(key => 
                                                GTypes[key as keyof typeof GTypes] === componentInstance.gtype
                                            ) as keyof typeof GTypes;
                                            
                                            if (gtypeEnumKey) {
                                                const gtypeData = getFieldsByGType(GTypes[gtypeEnumKey]);
                                                const metadataObject = {
                                                    name: selectedOption.value,
                                                    canonical_name: gtypeData.canonicalName,
                                                    gtype: componentInstance.gtype,
                                                    type: gtypeData.type,
                                                    category: gtypeData.canonicalName.split('.').slice(0, -1).join('.'),
                                                    collection: gtypeData.collection
                                                };
                                                onChange(metadataObject);
                                            } else {
                                                console.error('❌ GType not found in enum:', componentInstance.gtype);
                                                onChange(selectedValue);
                                            }
                                        } catch (error) {
                                            console.error('❌ Error processing GType:', componentInstance.gtype, error);
                                            onChange(selectedValue);
                                        }
                                    } else {
                                        console.error('❌ Component instance or gtype not found');
                                        onChange(selectedValue);
                                    }
                                } else {
                                    onChange(selectedValue);
                                }
                            } else {
                                onChange(selectedValue);
                            }
                        }}
                        style={commonStyle}
                        showSearch
                        allowClear
                        optionLabelProp="label"
                    >
                        {connectedOptions.map(option => (
                            <Option key={option.value} value={option.value} label={option.label}>
                                <div style={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'flex-start',
                                    maxWidth: '100%',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{ flex: 1, minWidth: 0, marginRight: '8px' }}>
                                        <div style={{ 
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            maxWidth: '100%'
                                        }}>
                                            {option.label}
                                        </div>
                                        {field.connected!.field_name !== ':componentname:' && (
                                            <div style={{ 
                                                fontSize: '12px', 
                                                color: '#8c8c8c',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}>
                                                from {option.componentName} ({option.componentType})
                                            </div>
                                        )}
                                    </div>
                                    <Tag className='auto-width-tag' color="blue" style={{ fontSize: '10px', flexShrink: 0 }}>Scenario</Tag>
                                </div>
                            </Option>
                        ))}
                    </Select>
                );
            } else if (hasApiEndpoint) {
                // Only API resources available
                return (
                    <Select
                        placeholder="Select from resource list"
                        value={field.has_metadata && typeof value === 'object' ? value?.name : value}
                        onChange={(selectedValue) => {
                            if (field.has_metadata) {
                                const selectedResource = systemResources.find(r => r.name === selectedValue);
                                onChange(selectedResource || selectedValue);
                            } else {
                                onChange(selectedValue);
                            }
                        }}
                        style={commonStyle}
                        showSearch
                        allowClear
                        loading={loadingSystemResources}
                        optionLabelProp="label"
                    >
                        {systemResources.map(resource => (
                            <Option key={resource.name} value={resource.name} label={resource.name}>
                                <div style={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'flex-start',
                                    maxWidth: '100%',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{ flex: 1, minWidth: 0, marginRight: '8px' }}>
                                        <div style={{ 
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            maxWidth: '100%'
                                        }}>
                                            {resource.name}
                                        </div>
                                        {resource.canonical_name && (
                                            <div style={{ 
                                                fontSize: '12px', 
                                                color: '#8c8c8c',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}>
                                                {resource.canonical_name}
                                            </div>
                                        )}
                                    </div>
                                    <Tag className='auto-width-tag' color="green" style={{ fontSize: '10px', flexShrink: 0 }}>Resource</Tag>
                                </div>
                            </Option>
                        ))}
                    </Select>
                );
            }
        } else {
            // Original behavior: priority logic (scenario first if available)
            // If connected components exist in scenario, ONLY show connected options (no API)
            if (hasConnected && hasConnectedComponentsInScenario) {
                return (
                <Select
                    placeholder={`Select from scenario ${field.connected!.component_types?.join('/') || 'component'}s`}
                    value={field.has_metadata && typeof value === 'object' ? value?.name : value}
                    onChange={(selectedValue) => {
                        if (field.has_metadata) {
                            // Find the connected component and create metadata object using component catalog
                            const selectedOption = connectedOptions.find(opt => opt.value === selectedValue);
                            if (selectedOption) {
                                // Find the component instance
                                const componentInstance = allComponents.find(comp => 
                                    comp.name === selectedOption.componentName || 
                                    (componentNames[comp.name] || comp.name) === selectedOption.componentName
                                );
                                
                                if (componentInstance && componentInstance.gtype) {
                                    try {
                                        // Find GTypes enum value that matches the gtype string
                                        const gtypeEnumKey = Object.keys(GTypes).find(key => 
                                            GTypes[key as keyof typeof GTypes] === componentInstance.gtype
                                        ) as keyof typeof GTypes;
                                        
                                        if (gtypeEnumKey) {
                                            // Use gtypes data for accurate metadata
                                            const gtypeData = getFieldsByGType(GTypes[gtypeEnumKey]);
                                            const metadataObject = {
                                                name: selectedOption.value,
                                                canonical_name: gtypeData.canonicalName,
                                                gtype: componentInstance.gtype,
                                                type: gtypeData.type,
                                                category: gtypeData.canonicalName.split('.').slice(0, -1).join('.'), // Extract category from canonical name
                                                collection: gtypeData.collection
                                            };
                                            
                                            console.log('✅ Using GType metadata for connected component:', {
                                                selectedValue,
                                                componentInstance: componentInstance.name,
                                                gtype: componentInstance.gtype,
                                                gtypeData,
                                                metadataObject
                                            });
                                            
                                            onChange(metadataObject);
                                        } else {
                                            console.error('❌ GType not found in enum:', componentInstance.gtype);
                                            onChange(selectedValue);
                                        }
                                    } catch (error) {
                                        console.error('❌ Error processing GType:', componentInstance.gtype, error);
                                        onChange(selectedValue);
                                    }
                                } else {
                                    console.error('❌ Component instance or gtype not found:', {
                                        componentName: selectedOption.componentName,
                                        componentInstance,
                                        gtype: componentInstance?.gtype
                                    });
                                    onChange(selectedValue);
                                }
                            } else {
                                onChange(selectedValue);
                            }
                        } else {
                            onChange(selectedValue);
                        }
                    }}
                    style={commonStyle}
                    showSearch
                    allowClear
                    optionLabelProp="label"
                >
                    {connectedOptions.map(option => (
                        <Option key={option.value} value={option.value} label={option.label}>
                            <div style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'flex-start',
                                maxWidth: '100%',
                                overflow: 'hidden'
                            }}>
                                <div style={{ flex: 1, minWidth: 0, marginRight: '8px' }}>
                                    <div style={{ 
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        maxWidth: '100%'
                                    }}>
                                        {option.label}
                                    </div>
                                    {field.connected!.field_name !== ':componentname:' && (
                                        <div style={{ 
                                            fontSize: '12px', 
                                            color: '#8c8c8c',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            from {option.componentName} ({option.componentType})
                                        </div>
                                    )}
                                </div>
                                <Tag className='auto-width-tag' color="blue" style={{ fontSize: '10px', flexShrink: 0 }}>Scenario</Tag>
                            </div>
                        </Option>
                    ))}
                </Select>
            );
            }
        
        // If no connected components in scenario, show API options (if available)
        if (hasApiEndpoint && !hasConnectedComponentsInScenario) {
            return (
                <Select
                    placeholder="Select from resource list"
                    value={field.has_metadata && typeof value === 'object' ? value?.name : value}
                    onChange={(selectedValue) => {
                        if (field.has_metadata) {
                            // Find the full object and pass it
                            const selectedResource = systemResources.find(r => r.name === selectedValue);
                            onChange(selectedResource || selectedValue);
                        } else {
                            // Just pass the name
                            onChange(selectedValue);
                        }
                    }}
                    style={commonStyle}
                    showSearch
                    allowClear
                    loading={loadingSystemResources}
                    optionLabelProp="label"
                >
                    {systemResources.map(resource => (
                        <Option key={resource.name} value={resource.name} label={resource.name}>
                            <div style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'flex-start',
                                maxWidth: '100%',
                                overflow: 'hidden'
                            }}>
                                <div style={{ flex: 1, minWidth: 0, marginRight: '8px' }}>
                                    <div style={{ 
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        maxWidth: '100%'
                                    }}>
                                        {resource.name}
                                    </div>
                                    {resource.canonical_name && (
                                        <div style={{ 
                                            fontSize: '12px', 
                                            color: '#8c8c8c',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            {resource.canonical_name}
                                        </div>
                                    )}
                                </div>
                                <Tag className='auto-width-tag' color="green" style={{ fontSize: '10px', flexShrink: 0 }}>Resource</Tag>
                            </div>
                        </Option>
                    ))}
                </Select>
            );
        }
        
        // Fallback: if both connected and API options exist but no connected components in scenario
        if (hasConnected && hasApiEndpoint) {
            // Both scenario and system resources available
            return (
                <div>
                    <div style={{ marginBottom: '12px' }}>
                        <Radio.Group
                            value={selectedSource}
                            onChange={(e) => {
                                setSelectedSource(e.target.value);
                                // Don't clear value when switching sources - let user maintain their selection
                            }}
                            style={{ display: 'flex', gap: '16px' }}
                        >
                            <Radio value="scenario" disabled={connectedOptions.length === 0}>
                                From Scenario ({connectedOptions.length})
                            </Radio>
                            <Radio value="system">
                                Resource List ({systemResources.length})
                            </Radio>
                        </Radio.Group>
                    </div>
                    
                    {selectedSource === 'scenario' ? (
                        <Select
                            placeholder={`Select from scenario ${field.connected!.component_types?.join('/') || 'component'}s`}
                            value={field.has_metadata && typeof value === 'object' ? value?.name : value}
                            onChange={(selectedValue) => {
                                if (field.has_metadata) {
                                    // Find the connected component and create metadata object using gtypes
                                    const selectedOption = connectedOptions.find(opt => opt.value === selectedValue);
                                    if (selectedOption) {
                                        // Find the component instance to get gtype
                                        const componentInstance = allComponents.find(comp => 
                                            comp.name === selectedOption.componentName || 
                                            (componentNames[comp.name] || comp.name) === selectedOption.componentName
                                        );
                                        
                                        if (componentInstance?.gtype) {
                                            try {
                                                // Find GTypes enum value that matches the gtype string
                                                const gtypeEnumKey = Object.keys(GTypes).find(key => 
                                                    GTypes[key as keyof typeof GTypes] === componentInstance.gtype
                                                ) as keyof typeof GTypes;
                                                
                                                if (gtypeEnumKey) {
                                                    // Use gtypes data for accurate metadata
                                                    const gtypeData = getFieldsByGType(GTypes[gtypeEnumKey]);
                                                    const metadataObject = {
                                                        name: selectedOption.value,
                                                        canonical_name: gtypeData.canonicalName,
                                                        gtype: componentInstance.gtype,
                                                        type: gtypeData.type,
                                                        category: gtypeData.category,
                                                        collection: gtypeData.collection
                                                    };
                                                    onChange(metadataObject);
                                                } else {
                                                    // Fallback if gtype not found in enum
                                                    throw new Error('GType not found in enum');
                                                }
                                            } catch {
                                                console.warn('Could not find gtype in enum, using fallback:', componentInstance.gtype);
                                                // Fallback to manual construction
                                                const metadataObject = {
                                                    name: selectedOption.value,
                                                    canonical_name: `envoy.filters.${field.connected!.component_types?.join('/') || 'component'}.${selectedOption.value}`,
                                                    gtype: componentInstance.gtype,
                                                    type: field.connected!.component_types?.join('/') || 'component',
                                                    category: `envoy.filters.${field.connected!.component_types?.join('/') || 'component'}`,
                                                    collection: "filters"
                                                };
                                                onChange(metadataObject);
                                            }
                                        } else {
                                            // Fallback to manual construction if gtype not found
                                            const metadataObject = {
                                                name: selectedOption.value,
                                                canonical_name: `envoy.filters.${field.connected!.component_types?.join('/') || 'component'}.${selectedOption.value}`,
                                                gtype: `envoy.extensions.filters.${field.connected!.component_types?.join('/') || 'component'}.${selectedOption.value}.v3.${selectedOption.componentName}`,
                                                type: field.connected!.component_types?.join('/') || 'component',
                                                category: `envoy.filters.${field.connected!.component_types?.join('/') || 'component'}`,
                                                collection: "filters"
                                            };
                                            onChange(metadataObject);
                                        }
                                    } else {
                                        onChange(selectedValue);
                                    }
                                } else {
                                    onChange(selectedValue);
                                }
                            }}
                            style={commonStyle}
                            showSearch
                            allowClear
                            disabled={connectedOptions.length === 0}
                            optionLabelProp="label"
                        >
                            {connectedOptions.map(option => (
                                <Option key={option.value} value={option.value} label={option.label}>
                                    <div style={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between', 
                                        alignItems: 'flex-start',
                                        maxWidth: '100%',
                                        overflow: 'hidden'
                                    }}>
                                        <div style={{ flex: 1, minWidth: 0, marginRight: '8px' }}>
                                            <div style={{ 
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                maxWidth: '100%'
                                            }}>
                                                {option.label}
                                            </div>
                                            {field.connected!.field_name !== ':componentname:' && (
                                                <div style={{ 
                                                    fontSize: '12px', 
                                                    color: '#8c8c8c',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}>
                                                    from {option.componentName} ({option.componentType})
                                                </div>
                                            )}
                                        </div>
                                        <Tag className='auto-width-tag' color="blue" style={{ fontSize: '10px', flexShrink: 0 }}>Scenario</Tag>
                                    </div>
                                </Option>
                            ))}
                        </Select>
                    ) : (
                        <Select
                            placeholder="Select from resource list"
                            value={field.has_metadata && typeof value === 'object' ? value?.name : value}
                            onChange={(selectedValue) => {
                                if (field.has_metadata) {
                                    // Find the full object and pass it
                                    const selectedResource = systemResources.find(r => r.name === selectedValue);
                                    onChange(selectedResource || selectedValue);
                                } else {
                                    // Just pass the name
                                    onChange(selectedValue);
                                }
                            }}
                            style={commonStyle}
                            showSearch
                            allowClear
                            loading={loadingSystemResources}
                            optionLabelProp="label"
                        >
                            {systemResources.map(resource => (
                                <Option key={resource.name} value={resource.name} label={resource.name}>
                                    <div style={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between', 
                                        alignItems: 'flex-start',
                                        maxWidth: '100%',
                                        overflow: 'hidden'
                                    }}>
                                        <div style={{ flex: 1, minWidth: 0, marginRight: '8px' }}>
                                            <div style={{ 
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                maxWidth: '100%'
                                            }}>
                                                {resource.name}
                                            </div>
                                            {resource.canonical_name && (
                                                <div style={{ 
                                                    fontSize: '12px', 
                                                    color: '#8c8c8c',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}>
                                                    {resource.canonical_name}
                                                </div>
                                            )}
                                        </div>
                                        <Tag className='auto-width-tag' color="green" style={{ fontSize: '10px', flexShrink: 0 }}>Resource</Tag>
                                    </div>
                                </Option>
                            ))}
                        </Select>
                    )}
                </div>
            );
        } else if (hasConnected) {
            // Only connected (scenario) resources
            return (
                <Select
                    placeholder={`Select ${field.label.toLowerCase()} from ${field.connected!.component_types?.join('/') || 'component'}`}
                    value={field.has_metadata && typeof value === 'object' ? value?.name : value}
                    onChange={(selectedValue) => {
                        if (field.has_metadata) {
                            // Find the connected component and create metadata object using component catalog
                            const selectedOption = connectedOptions.find(opt => opt.value === selectedValue);
                            if (selectedOption) {
                                // Find the component instance
                                const componentInstance = allComponents.find(comp => 
                                    comp.name === selectedOption.componentName || 
                                    (componentNames[comp.name] || comp.name) === selectedOption.componentName
                                );
                                
                                if (componentInstance && componentInstance.gtype) {
                                    try {
                                        // Find GTypes enum value that matches the gtype string
                                        const gtypeEnumKey = Object.keys(GTypes).find(key => 
                                            GTypes[key as keyof typeof GTypes] === componentInstance.gtype
                                        ) as keyof typeof GTypes;
                                        
                                        if (gtypeEnumKey) {
                                            // Use gtypes data for accurate metadata
                                            const gtypeData = getFieldsByGType(GTypes[gtypeEnumKey]);
                                            const metadataObject = {
                                                name: selectedOption.value,
                                                canonical_name: gtypeData.canonicalName,
                                                gtype: componentInstance.gtype,
                                                type: gtypeData.type,
                                                category: gtypeData.canonicalName.split('.').slice(0, -1).join('.'), // Extract category from canonical name
                                                collection: gtypeData.collection
                                            };
                                            
                                            console.log('✅ Using GType metadata for connected component:', {
                                                selectedValue,
                                                componentInstance: componentInstance.name,
                                                gtype: componentInstance.gtype,
                                                gtypeData,
                                                metadataObject
                                            });
                                            
                                            onChange(metadataObject);
                                        } else {
                                            console.error('❌ GType not found in enum:', componentInstance.gtype);
                                            onChange(selectedValue);
                                        }
                                    } catch (error) {
                                        console.error('❌ Error processing GType:', componentInstance.gtype, error);
                                        onChange(selectedValue);
                                    }
                                } else {
                                    console.error('❌ Component instance or gtype not found:', {
                                        componentName: selectedOption.componentName,
                                        componentInstance,
                                        gtype: componentInstance?.gtype
                                    });
                                    onChange(selectedValue);
                                }
                            } else {
                                onChange(selectedValue);
                            }
                        } else {
                            onChange(selectedValue);
                        }
                    }}
                    style={commonStyle}
                    showSearch
                    allowClear
                    optionLabelProp="label"
                >
                    {connectedOptions.map(option => (
                        <Option key={option.value} value={option.value} label={option.label}>
                            <div style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'flex-start',
                                maxWidth: '100%',
                                overflow: 'hidden'
                            }}>
                                <div style={{ flex: 1, minWidth: 0, marginRight: '8px' }}>
                                    <div style={{ 
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        maxWidth: '100%'
                                    }}>
                                        {option.label}
                                    </div>
                                    {field.connected!.field_name !== ':componentname:' && (
                                        <div style={{ 
                                            fontSize: '12px', 
                                            color: '#8c8c8c',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            from {option.componentName} ({option.componentType})
                                        </div>
                                    )}
                                </div>
                                <Tag className='auto-width-tag' color="blue" style={{ fontSize: '10px', flexShrink: 0 }}>{option.componentType}</Tag>
                            </div>
                        </Option>
                    ))}
                </Select>
            );
        } else if (hasApiEndpoint || field.api_endpoint) {
            // Only system resources (or loading)
            return (
                <Select
                    placeholder="Select from resource list"
                    value={field.has_metadata && typeof value === 'object' ? value?.name : value}
                    onChange={(selectedValue) => {
                        if (field.has_metadata) {
                            // Find the full object and pass it
                            const selectedResource = systemResources.find(r => r.name === selectedValue);
                            onChange(selectedResource || selectedValue);
                        } else {
                            // Just pass the name
                            onChange(selectedValue);
                        }
                    }}
                    style={commonStyle}
                    showSearch
                    allowClear
                    loading={loadingSystemResources}
                    optionLabelProp="label"
                >
                    {systemResources.map(resource => (
                        <Option key={resource.name} value={resource.name} label={resource.name}>
                            <div style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'flex-start',
                                maxWidth: '100%',
                                overflow: 'hidden'
                            }}>
                                <div style={{ flex: 1, minWidth: 0, marginRight: '8px' }}>
                                    <div style={{ 
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        maxWidth: '100%'
                                    }}>
                                        {resource.name}
                                    </div>
                                    {resource.canonical_name && (
                                        <div style={{ 
                                            fontSize: '12px', 
                                            color: '#8c8c8c',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            {resource.canonical_name}
                                        </div>
                                    )}
                                </div>
                                <Tag className='auto-width-tag' color="green" style={{ fontSize: '10px', flexShrink: 0 }}>System</Tag>
                            </div>
                        </Option>
                    ))}
                </Select>
            );
        }
        }
        
        return null;
    };

    const commonStyle = { 
        borderRadius: '6px',
        width: '100%'
    };

    const fieldDisplayName = field.label || field.name;
    const isConnected = !!field.connected;
    const hasApiEndpoint = !!field.api_endpoint;

    // Render field based on type
    const renderField = () => {
        switch (field.type) {
            case 'string':
                if (field.use_component_name) {
                    return (
                        <Input
                            placeholder="Syncs with component name automatically"
                            value={value}
                            style={{ 
                                ...commonStyle,
                                fontStyle: 'italic',
                                backgroundColor: '#f5f5f5',
                                borderColor: '#1890ff'
                            }}
                            disabled={true}
                            addonBefore={
                                <span style={{ color: '#1890ff', fontSize: '12px' }}>🔗</span>
                            }
                            suffix={
                                <Text type="secondary" style={{ fontSize: '10px' }}>
                                    Auto-sync
                                </Text>
                            }
                        />
                    );
                }

                if (isConnected || hasApiEndpoint) {
                    return renderConnectedField();
                }

                return (
                    <Input
                        placeholder={isDisabledInManagedMode ? "Automatically managed by Elchi" : getFieldPlaceholder(field.label, field.default_value, field.type)}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        style={commonStyle}
                        disabled={isDisabledInManagedMode}
                    />
                );

            case 'int':
                return (
                    <InputNumber
                        placeholder={getFieldPlaceholder(field.label, field.default_value, field.type)}
                        value={value}
                        onChange={onChange}
                        style={commonStyle}
                    />
                );

            case 'bool':
                return (
                    <Switch
                        checked={value}
                        onChange={onChange}
                        checkedChildren="Enabled"
                        unCheckedChildren="Disabled"
                    />
                );

            case 'select':
                if (isConnected || hasApiEndpoint) {
                    return renderConnectedField();
                }

                return (
                    <Select
                        placeholder={getFieldPlaceholder(field.label, field.default_value, field.type)}
                        value={value}
                        onChange={onChange}
                        style={commonStyle}
                        allowClear
                    >
                        {field.options?.map(option => (
                            <Option key={option.value} value={option.value}>
                                {option.label}
                            </Option>
                        ))}
                    </Select>
                );

            case 'array':
                // Check if this is a connected array field (like network_filters)
                if (field.connected && field.connected.component_types) {
                    // Handle connected array - multiple selection from connected components
                    const connectedComponents = allComponents.filter(comp => 
                        field.connected!.component_types.includes(comp.type)
                    );
                    
                    // Check if connected component types exist in scenario (same logic as single select)
                    const hasConnectedComponentsInScenario = field.connected && field.connected.component_types && 
                        field.connected.component_types.some(type => 
                            allComponents.some(comp => comp.type === type)
                        );
                    
                    // Handle both connected and API endpoint sources based on use_api_and_scenario flag
                    const hasConnected = connectedComponents.length > 0;
                    const hasApiEndpoint = field.api_endpoint && systemResources.length > 0;
                    
                    // Determine display strategy for array fields
                    let showRadioSelector = false;
                    let showScenario = false;
                    let showAPI = false;
                    
                    if (field.use_api_and_scenario) {
                        // New behavior: show both if either is available
                        showRadioSelector = hasConnected && hasApiEndpoint;
                        showScenario = hasConnected;
                        showAPI = hasApiEndpoint;
                    } else {
                        // Original behavior: priority logic
                        if (hasConnectedComponentsInScenario && hasConnected) {
                            showScenario = true;
                            showAPI = false;
                        } else if (hasApiEndpoint && !hasConnectedComponentsInScenario) {
                            showScenario = false;
                            showAPI = true;
                        }
                    }
                    
                    // Map current values to updated names
                    const originalValues = Array.isArray(value) ? value : [];
                    const updatedCurrentValues = originalValues.map(val => {
                        // Check if value has metadata (from API)
                        if (field.has_metadata && typeof val === 'object' && val?.name) {
                            return val.name;
                        }
                        
                        // Find component that matches this value by checking both old and new names
                        const matchingComp = connectedComponents.find(comp => {
                            const updatedComponentName = componentNames[comp.name] || comp.name;
                            const fieldKey = `${comp.name}.${field.connected!.field_name}`;
                            const fieldValue = runtimeValues[fieldKey];
                            
                            // Check if this value matches any form of the component's value
                            if (fieldValue !== undefined && fieldValue !== null && fieldValue !== '') {
                                return val === fieldValue;
                            } else {
                                const connectedField = comp.selected_fields.find(f => 
                                    f.field_name === field.connected!.field_name
                                );
                                if (connectedField?.value !== undefined && connectedField.value !== null) {
                                    return val === connectedField.value;
                                } else {
                                    // Check both original and updated names
                                    return val === updatedComponentName || val === comp.name;
                                }
                            }
                        });
                        
                        if (matchingComp) {
                            const updatedComponentName = componentNames[matchingComp.name] || matchingComp.name;
                            const fieldKey = `${matchingComp.name}.${field.connected!.field_name}`;
                            const fieldValue = runtimeValues[fieldKey];
                            
                            if (fieldValue !== undefined && fieldValue !== null && fieldValue !== '') {
                                return fieldValue;
                            } else {
                                const connectedField = matchingComp.selected_fields.find(f => 
                                    f.field_name === field.connected!.field_name
                                );
                                if (connectedField?.value !== undefined && connectedField.value !== null) {
                                    return connectedField.value;
                                } else {
                                    return updatedComponentName;
                                }
                            }
                        }
                        return val; // Keep original if no match found
                    });
                    
                    return (
                        <div>
                            <div style={{ marginBottom: '12px' }}>
                                <Text strong style={{ fontSize: '14px' }}>
                                    Select {field.label.toLowerCase()} 
                                </Text>
                                {showRadioSelector && (
                                    <div style={{ marginTop: '8px' }}>
                                        <Radio.Group
                                            value={selectedSource}
                                            onChange={(e) => {
                                                setSelectedSource(e.target.value);
                                                // Don't clear array values when switching sources - let user maintain their selection
                                            }}
                                            style={{ display: 'flex', gap: '16px' }}
                                        >
                                            <Radio value="scenario" disabled={!showScenario}>
                                                From Scenario ({connectedComponents.length})
                                            </Radio>
                                            <Radio value="system" disabled={!showAPI}>
                                                Resource List ({systemResources.length})
                                            </Radio>
                                        </Radio.Group>
                                    </div>
                                )}
                                {!showRadioSelector && showScenario && (
                                    <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginTop: '4px' }}>
                                        from scenario components ({connectedComponents.length} available)
                                    </Text>
                                )}
                                {!showRadioSelector && showAPI && (
                                    <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginTop: '4px' }}>
                                        from resource list ({systemResources.length} available)
                                    </Text>
                                )}
                            </div>
                            <Select
                                mode="multiple"
                                placeholder={`Select ${field.label.toLowerCase()}`}
                                value={updatedCurrentValues}
                                onChange={(selectedValues) => {
                                    if (field.has_metadata) {
                                        // Map selected values to their full objects
                                        const selectedItems = selectedValues.map(selectedValue => {
                                            // First check if it's from system resources
                                            const systemResource = systemResources.find(r => r.name === selectedValue);
                                            if (systemResource) {
                                                return systemResource;
                                            }
                                            
                                            // Then check connected components
                                            const connectedComp = connectedComponents.find(comp => {
                                                const updatedComponentName = componentNames[comp.name] || comp.name;
                                                if (field.connected!.field_name === ':componentname:') {
                                                    return updatedComponentName === selectedValue;
                                                } else {
                                                    const fieldKey = `${comp.name}.${field.connected!.field_name}`;
                                                    const fieldValue = runtimeValues[fieldKey];
                                                    
                                                    if (fieldValue !== undefined && fieldValue !== null && fieldValue !== '') {
                                                        return fieldValue === selectedValue;
                                                    } else {
                                                        const connectedField = comp.selected_fields.find(f => 
                                                            f.field_name === field.connected!.field_name
                                                        );
                                                        if (connectedField?.value !== undefined && connectedField.value !== null) {
                                                            return connectedField.value === selectedValue;
                                                        } else {
                                                            return updatedComponentName === selectedValue;
                                                        }
                                                    }
                                                }
                                            });
                                            
                                            console.log('🔍 Array field - Finding connected component:', {
                                                selectedValue,
                                                field_name: field.name,
                                                connected_field_name: field.connected!.field_name,
                                                connectedComp,
                                                gtype: connectedComp?.gtype,
                                                allConnectedComponents: connectedComponents.map(c => ({
                                                    name: c.name,
                                                    type: c.type,
                                                    gtype: c.gtype,
                                                    selected_fields: c.selected_fields
                                                }))
                                            });
                                            
                                            // If component doesn't have gtype, try to get it from component catalog
                                            if (!connectedComp?.gtype && componentCatalog && connectedComp) {
                                                const componentDef = componentCatalog.find(def => def.name === connectedComp.type);
                                                if (componentDef?.gtype) {
                                                    connectedComp.gtype = componentDef.gtype;
                                                    console.log('📝 Added gtype from catalog to component:', {
                                                        componentName: connectedComp.name,
                                                        type: connectedComp.type,
                                                        gtype: componentDef.gtype
                                                    });
                                                }
                                            }
                                            
                                            if (connectedComp?.gtype) {
                                                try {
                                                    // Find GTypes enum value that matches the gtype string
                                                    const gtypeEnumKey = Object.keys(GTypes).find(key => 
                                                        GTypes[key as keyof typeof GTypes] === connectedComp.gtype
                                                    ) as keyof typeof GTypes;
                                                    
                                                    if (gtypeEnumKey) {
                                                        const gtypeData = getFieldsByGType(GTypes[gtypeEnumKey]);
                                                        const metadataObject = {
                                                            name: selectedValue,
                                                            canonical_name: gtypeData.canonicalName,
                                                            gtype: connectedComp.gtype,
                                                            type: gtypeData.type,
                                                            category: gtypeData.canonicalName.split('.').slice(0, -1).join('.'), // Extract category from canonical name
                                                            collection: gtypeData.collection
                                                        };
                                                        
                                                        console.log('✅ Array field - Using GType metadata:', {
                                                            selectedValue,
                                                            gtype: connectedComp.gtype,
                                                            gtypeData,
                                                            metadataObject
                                                        });
                                                        
                                                        return metadataObject;
                                                    } else {
                                                        console.warn('❌ Array field - GType not found in enum:', connectedComp.gtype);
                                                    }
                                                } catch (error) {
                                                    console.error('❌ Array field - Error processing GType:', connectedComp.gtype, error);
                                                    // Don't include this item - it's invalid
                                                    return null;
                                                }
                                            } else {
                                                console.error('❌ Array field - Component found but no gtype:', {
                                                    selectedValue,
                                                    connectedComp,
                                                    field_connected_types: field.connected!.component_types
                                                });
                                                // Don't include this item - it's invalid without gtype
                                                return null;
                                            }
                                            
                                            // No fallback - if we can't find the component or process its gtype, it's invalid
                                            console.error('❌ Array field - Component not found:', {
                                                selectedValue,
                                                field_connected_types: field.connected!.component_types
                                            });
                                            return null;
                                        }).filter(item => item !== null); // Filter out invalid items
                                        
                                        if (selectedItems.length === 0) {
                                            console.error('❌ No valid items with proper gtype found!');
                                        }
                                        
                                        onChange(selectedItems);
                                    } else {
                                        onChange(selectedValues);
                                    }
                                }}
                                style={commonStyle}
                                showSearch
                                optionLabelProp="label"
                                loading={loadingSystemResources}
                            >
                                {/* Connected components options - show based on use_api_and_scenario logic */}
                                {((showRadioSelector && selectedSource === 'scenario') || (!showRadioSelector && showScenario)) && connectedComponents.map(comp => {
                                    const updatedComponentName = componentNames[comp.name] || comp.name;
                                    
                                    // Check for special :componentname: pattern
                                    let displayValue;
                                    if (field.connected!.field_name === ':componentname:') {
                                        displayValue = updatedComponentName;
                                    } else {
                                        // Use field value if available, otherwise component name
                                        const fieldKey = `${comp.name}.${field.connected!.field_name}`;
                                        const fieldValue = runtimeValues[fieldKey];
                                        
                                        if (fieldValue !== undefined && fieldValue !== null && fieldValue !== '') {
                                            displayValue = fieldValue;
                                        } else {
                                            const connectedField = comp.selected_fields.find(f => 
                                                f.field_name === field.connected!.field_name
                                            );
                                            if (connectedField?.value !== undefined && connectedField.value !== null) {
                                                displayValue = connectedField.value;
                                            } else {
                                                displayValue = updatedComponentName;
                                            }
                                        }
                                    }
                                    
                                    return (
                                        <Option key={`scenario-${comp.name}`} value={displayValue} label={displayValue}>
                                            <div style={{ 
                                                display: 'flex', 
                                                justifyContent: 'space-between', 
                                                alignItems: 'flex-start',
                                                maxWidth: '100%',
                                                overflow: 'hidden'
                                            }}>
                                                <div style={{ flex: 1, minWidth: 0, marginRight: '8px' }}>
                                                    <div style={{ 
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                        maxWidth: '100%'
                                                    }}>
                                                        {displayValue}
                                                    </div>
                                                    <div style={{ 
                                                        fontSize: '12px', 
                                                        color: '#8c8c8c',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap'
                                                    }}>
                                                        from {updatedComponentName} ({comp.type})
                                                    </div>
                                                </div>
                                                <Tag className='auto-width-tag' color="blue" style={{ fontSize: '10px', flexShrink: 0 }}>Scenario</Tag>
                                            </div>
                                        </Option>
                                    );
                                })}
                                
                                {/* System resources options - show based on use_api_and_scenario logic */}
                                {((showRadioSelector && selectedSource === 'system') || (!showRadioSelector && showAPI)) && systemResources.map(resource => (
                                    <Option key={`system-${resource.name}`} value={resource.name} label={resource.name}>
                                        <div style={{ 
                                            display: 'flex', 
                                            justifyContent: 'space-between', 
                                            alignItems: 'flex-start',
                                            maxWidth: '100%',
                                            overflow: 'hidden'
                                        }}>
                                            <div style={{ flex: 1, minWidth: 0, marginRight: '8px' }}>
                                                <div style={{ 
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                    maxWidth: '100%'
                                                }}>
                                                    {resource.name}
                                                </div>
                                                {resource.canonical_name && (
                                                    <div style={{ 
                                                        fontSize: '12px', 
                                                        color: '#8c8c8c',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap'
                                                    }}>
                                                        {resource.canonical_name}
                                                    </div>
                                                )}
                                            </div>
                                            <Tag className='auto-width-tag' color="green" style={{ fontSize: '10px', flexShrink: 0 }}>Resource</Tag>
                                        </div>
                                    </Option>
                                ))}
                            </Select>
                        </div>
                    );
                }
                
                if (field.array_schema?.properties) {
                    // Complex array with object items
                    const arrayValue = Array.isArray(value) ? value : [];
                    
                    const addItem = () => {
                        const newItem: any = {};
                        // Initialize with defaults
                        if (field.array_schema?.properties) {
                            Object.entries(field.array_schema.properties).forEach(([key, fieldDef]: [string, any]) => {
                                if (fieldDef.default_value !== undefined) {
                                    newItem[key] = fieldDef.default_value;
                                }
                            });
                        }
                        onChange([...arrayValue, newItem]);
                    };

                    const updateItem = (index: number, newItem: any) => {
                        const newArray = [...arrayValue];
                        newArray[index] = newItem;
                        onChange(newArray);
                    };

                    const removeItem = (index: number) => {
                        const newArray = arrayValue.filter((_, i) => i !== index);
                        onChange(newArray);
                    };

                    return (
                        <div style={{ border: '1px solid #d9d9d9', borderRadius: '6px', padding: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                <Text strong>{fieldDisplayName}</Text>
                                <Button
                                    type="dashed"
                                    size="small"
                                    icon={<PlusOutlined />}
                                    onClick={addItem}
                                >
                                    Add Item
                                </Button>
                            </div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {arrayValue.map((item, index) => (
                                    <ArrayFieldItemRedux
                                        key={index}
                                        itemSchema={field.array_schema!.properties!}
                                        value={item}
                                        onChange={(newItem) => updateItem(index, newItem)}
                                        onRemove={() => removeItem(index)}
                                        index={index}
                                    />
                                ))}
                                
                                {arrayValue.length === 0 && (
                                    <Text type="secondary" style={{ textAlign: 'center', padding: '20px' }}>
                                        No items added yet. Click "Add Item" to create the first entry.
                                    </Text>
                                )}
                            </div>
                        </div>
                    );
                }
                
                // Check if it's a simple string array using helper
                if (isSimpleStringArray(field)) {
                    return (
                        <Select
                            mode="tags"
                            placeholder={getArrayPlaceholder(field)}
                            value={Array.isArray(value) ? value : getArrayDefaultValue(field)}
                            onChange={(val) => onChange(val)}
                            style={commonStyle}
                            tokenSeparators={[',']}
                        />
                    );
                }
                
                // Complex array - fallback to JSON textarea
                return (
                    <TextArea
                        rows={4}
                        placeholder={getArrayPlaceholder(field)}
                        value={typeof value === 'string' ? value : JSON.stringify(value || [], null, 2)}
                        onChange={(e) => {
                            try {
                                const parsed = JSON.parse(e.target.value || '[]');
                                onChange(parsed);
                            } catch {
                                onChange(e.target.value);
                            }
                        }}
                        style={commonStyle}
                    />
                );

            case 'nested_choice':
                return (
                    <NestedChoiceFieldRedux
                        field={field}
                        value={value}
                        onChange={onChange}
                    />
                );

            case 'object':
                // Handle object type fields (like health_check)
                if (field.array_schema?.properties) {
                    // Object with defined properties - initialize with defaults
                    const initializeObjectValue = () => {
                        const initialized = value || {};
                        
                        // Add default values for missing properties
                        Object.entries(field.array_schema.properties).forEach(([key, fieldDef]: [string, any]) => {
                            if (initialized[key] === undefined && fieldDef.default_value !== undefined) {
                                initialized[key] = fieldDef.default_value;
                            }
                            
                            // For conditional fields, initialize in nested_choice format
                            if (fieldDef.type === 'conditional') {
                                if (!initialized[key] || typeof initialized[key] !== 'object' || !initialized[key].selected_choice) {
                                    const defaultChoice = fieldDef.default_value;
                                    const defaultSubFields = {};
                                    
                                    // Set default values for the default choice
                                    if (defaultChoice && fieldDef.properties && fieldDef.properties[defaultChoice]?.properties) {
                                        Object.entries(fieldDef.properties[defaultChoice].properties).forEach(([subKey, subFieldDef]: [string, any]) => {
                                            if (subFieldDef.default_value !== undefined) {
                                                defaultSubFields[subKey] = subFieldDef.default_value;
                                            }
                                        });
                                    }
                                    
                                    initialized[key] = {
                                        selected_choice: defaultChoice,
                                        [defaultChoice]: defaultSubFields
                                    };
                                }
                            }
                        });
                        
                        return initialized;
                    };
                    
                    const objectValue = initializeObjectValue();
                    
                    // Update Redux state if initialization added new values
                    useEffect(() => {
                        if (JSON.stringify(objectValue) !== JSON.stringify(value || {})) {
                            onChange(objectValue);
                        }
                    }, []); // Only run once on mount
                    
                    const updateObjectField = (fieldName: string, fieldValue: any) => {
                        onChange({ ...objectValue, [fieldName]: fieldValue });
                    };
                    
                    return (
                        <div style={{ backgroundColor: '#f8f9fa', borderRadius: '4px', padding: '8px', border: '1px solid #e8e8e8' }}>
                            <div style={{ 
                                display: 'grid', 
                                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                                gap: '12px 16px' 
                            }}>
                                {Object.entries(field.array_schema.properties).map(([propName, propDef]: [string, any]) => {
                                    const propValue = objectValue[propName];
                                    
                                    // For conditional type fields within object - handle as nested_choice format
                                    if (propDef.type === 'conditional') {
                                        // Get the current nested_choice value structure
                                        const currentNestedValue = propValue || {
                                            selected_choice: propDef.default_value,
                                            [propDef.default_value]: {}
                                        };
                                        
                                        const selectedChoice = currentNestedValue.selected_choice || propDef.default_value;
                                        const availableOptions = propDef.options || [];
                                        
                                        return (
                                            <div key={propName} style={{ gridColumn: 'span 2' }}>
                                                <div style={{ marginBottom: '4px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        <Text style={{ fontSize: '12px', fontWeight: 500 }}>
                                                            {propDef.label || propName}
                                                        </Text>
                                                        {propDef.required && (
                                                            <Tag className='auto-width-tag' color="red" style={{ fontSize: '9px', padding: '0 4px', height: '16px', lineHeight: '16px' }}>Required</Tag>
                                                        )}
                                                    </div>
                                                    {propDef.description && (
                                                        <Text type="secondary" style={{ fontSize: '11px', display: 'block', marginTop: '2px' }}>
                                                            {propDef.description}
                                                        </Text>
                                                    )}
                                                </div>
                                                
                                                <Select
                                                    placeholder={`Select ${propDef.label}`}
                                                    value={selectedChoice}
                                                    onChange={(val) => {
                                                        // Build nested_choice structure for conditional field
                                                        const newNestedValue = {
                                                            selected_choice: val,
                                                            [val]: {}
                                                        };
                                                        
                                                        // Set default values for the selected option
                                                        if (val && propDef.properties && propDef.properties[val]?.properties) {
                                                            Object.entries(propDef.properties[val].properties).forEach(([subKey, subFieldDef]: [string, any]) => {
                                                                if (subFieldDef.default_value !== undefined) {
                                                                    newNestedValue[val][subKey] = subFieldDef.default_value;
                                                                }
                                                            });
                                                        }
                                                        
                                                        const updatedValue = { ...objectValue, [propName]: newNestedValue };
                                                        onChange(updatedValue);
                                                    }}
                                                    style={commonStyle}
                                                    size="small"
                                                    allowClear
                                                >
                                                    {availableOptions.map((option: any) => (
                                                        <Option key={option.value} value={option.value}>
                                                            {option.label}
                                                        </Option>
                                                    ))}
                                                </Select>
                                                
                                                {/* Show sub-fields for selected option */}
                                                {selectedChoice && propDef.properties && propDef.properties[selectedChoice] && (
                                                    <div style={{ marginTop: '6px', paddingLeft: '8px', borderLeft: '2px solid #1890ff' }}>
                                                        {Object.entries(propDef.properties[selectedChoice].properties || {}).map(([subName, subDef]: [string, any]) => {
                                                            const subValue = currentNestedValue[selectedChoice] ? currentNestedValue[selectedChoice][subName] : undefined;
                                                            
                                                            return (
                                                                <div key={subName} style={{ marginBottom: '4px' }}>
                                                                    <div style={{ marginBottom: '2px' }}>
                                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                                            <Text style={{ fontSize: '11px', fontWeight: 500 }}>
                                                                                {subDef.label || subName}
                                                                            </Text>
                                                                            {subDef.required && (
                                                                                <Tag className='auto-width-tag' color="red" style={{ fontSize: '8px', padding: '0 3px', height: '14px', lineHeight: '14px' }}>Required</Tag>
                                                                            )}
                                                                        </div>
                                                                        {subDef.description && (
                                                                            <Text type="secondary" style={{ fontSize: '10px', display: 'block', marginTop: '1px' }}>
                                                                                {subDef.description}
                                                                            </Text>
                                                                        )}
                                                                    </div>
                                                                    {subDef.type === 'string' && (
                                                                        <Input
                                                                            placeholder={getFieldPlaceholder(subDef.label, subDef.default_value, 'string')}
                                                                            value={subValue !== undefined ? subValue : (subDef.default_value || '')}
                                                                            onChange={(e) => {
                                                                                const updatedNestedValue = {
                                                                                    ...currentNestedValue,
                                                                                    [selectedChoice]: {
                                                                                        ...currentNestedValue[selectedChoice],
                                                                                        [subName]: e.target.value
                                                                                    }
                                                                                };
                                                                                const updatedValue = { ...objectValue, [propName]: updatedNestedValue };
                                                                                onChange(updatedValue);
                                                                            }}
                                                                            style={commonStyle}
                                                                            size="small"
                                                                        />
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    }
                                    // Handle other field types within object  
                                    return (
                                        <div key={propName}>
                                            <div style={{ marginBottom: '4px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <Text style={{ fontSize: '12px', fontWeight: 500 }}>
                                                        {propDef.label || propName}
                                                    </Text>
                                                    {propDef.required && (
                                                        <Tag className='auto-width-tag' color="red" style={{ fontSize: '9px', padding: '0 4px', height: '16px', lineHeight: '16px' }}>Required</Tag>
                                                    )}
                                                </div>
                                                {propDef.description && (
                                                    <Text type="secondary" style={{ fontSize: '11px', display: 'block', marginTop: '2px' }}>
                                                        {propDef.description}
                                                    </Text>
                                                )}
                                            </div>
                                            
                                            {propDef.type === 'string' && (
                                                <Input
                                                    placeholder={getFieldPlaceholder(propDef.label, propDef.default_value, 'string')}
                                                    value={propValue !== undefined ? propValue : propDef.default_value}
                                                    onChange={(e) => updateObjectField(propName, e.target.value)}
                                                    style={commonStyle}
                                                    size="small"
                                                />
                                            )}
                                            
                                            {propDef.type === 'int' && (
                                                <InputNumber
                                                    placeholder={getFieldPlaceholder(propDef.label, propDef.default_value, 'int')}
                                                    value={propValue !== undefined ? propValue : propDef.default_value}
                                                    onChange={(val) => updateObjectField(propName, val)}
                                                    style={{ ...commonStyle, width: '100%' }}
                                                    size="small"
                                                />
                                            )}
                                            
                                            {propDef.type === 'bool' && (
                                                <Switch
                                                    checked={propValue !== undefined ? propValue : propDef.default_value}
                                                    onChange={(checked) => updateObjectField(propName, checked)}
                                                    size="small"
                                                />
                                            )}
                                            
                                            {propDef.type === 'select' && (
                                                <Select
                                                    placeholder={getFieldPlaceholder(propDef.label, propDef.default_value, 'select')}
                                                    value={propValue !== undefined ? propValue : propDef.default_value}
                                                    onChange={(val) => updateObjectField(propName, val)}
                                                    style={commonStyle}
                                                    size="small"
                                                    allowClear
                                                >
                                                    {propDef.options?.map((option: any) => (
                                                        <Option key={option.value} value={option.value}>
                                                            {option.label}
                                                        </Option>
                                                    ))}
                                                </Select>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                }
                
                // Simple object without schema - fallback to JSON
                return (
                    <TextArea
                        rows={4}
                        placeholder={getFieldPlaceholder(`${field.label} as JSON object`, field.default_value, field.type)}
                        value={typeof value === 'string' ? value : JSON.stringify(value || {}, null, 2)}
                        onChange={(e) => {
                            try {
                                const parsed = JSON.parse(e.target.value || '{}');
                                onChange(parsed);
                            } catch {
                                onChange(e.target.value);
                            }
                        }}
                        style={commonStyle}
                    />
                );

            default:
                return (
                    <Input
                        placeholder={getFieldPlaceholder(field.label, field.default_value, field.type)}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        style={commonStyle}
                    />
                );
        }
    };

    // Don't show outer header for nested_choice to avoid duplicate titles
    const shouldShowOuterHeader = field.type !== 'nested_choice';

    return (
        <div style={{ marginBottom: '16px' }}>
            {shouldShowOuterHeader && (
                <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Text strong style={{ fontSize: '14px' }}>
                                {fieldDisplayName}
                            </Text>
                            {required && (
                                <Tag className='auto-width-tag' color="red" style={{ fontSize: '10px' }}>
                                    Required
                                </Tag>
                            )}
                            {field.use_component_name && (
                                <Tag className='auto-width-tag' color="blue" style={{ fontSize: '10px' }}>
                                    Auto-sync
                                </Tag>
                            )}
                            {isConnected && (
                                <Tag className='auto-width-tag' color="green" style={{ fontSize: '10px' }}>
                                    Connected
                                </Tag>
                            )}
                        </div>
                        
                        {field.default_value && (
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                                Default: {formatDefaultValue(field.default_value)}
                            </Text>
                        )}
                    </div>
                    
                    {field.description && (
                        <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '8px' }}>
                            {field.description}
                        </Text>
                    )}
                </>
            )}
            
            {renderField()}
            
            {isConnected && connectedOptions.length === 0 && (
                <Text type="secondary" style={{ fontSize: '11px', marginTop: '4px', display: 'block' }}>
                    No connected {field.connected?.component_types?.join('/') || 'component'} components available
                </Text>
            )}
        </div>
    );
};

export default FieldInputRedux;