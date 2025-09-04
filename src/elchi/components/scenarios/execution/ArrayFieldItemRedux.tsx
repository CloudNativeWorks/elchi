import React from 'react';
import { useSelector } from 'react-redux';
import { Input, InputNumber, Select, Switch, Button, Tag, Typography } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { getFieldPlaceholder } from '../utils/displayUtils';
import { isSimpleStringArray, getArrayPlaceholder, getArrayDefaultValue } from '../utils/arrayDetection';
import {
    selectComponentInstances,
    selectComponentNames,
    selectFieldValues
} from '@/redux/selectors/scenarioSelectors';

const { Text } = Typography;
const { Option } = Select;

interface ArrayFieldItemReduxProps {
    itemSchema: Record<string, any>;
    value: Record<string, any>;
    onChange: (value: Record<string, any>) => void;
    onRemove: () => void;
    index: number;
}

const ArrayFieldItemRedux: React.FC<ArrayFieldItemReduxProps> = ({
    itemSchema,
    value,
    onChange,
    onRemove,
    index
}) => {
    const allComponents = useSelector(selectComponentInstances);
    const componentNames = useSelector(selectComponentNames);
    const runtimeValues = useSelector(selectFieldValues);

    const updateField = (fieldName: string, fieldValue: any) => {
        onChange({ ...value, [fieldName]: fieldValue });
    };

    // Helper function to render individual fields in array items
    const renderArrayItemField = (fieldName: string, fieldDef: any, fieldValue: any) => {
        const commonStyle = { borderRadius: '4px' };
        
        switch (fieldDef.type) {
            case 'string':
                // Check if this field uses component name in array items
                if (fieldDef.use_component_name) {
                    return (
                        <Input
                            placeholder="Syncs with component name automatically"
                            value={fieldValue}
                            onChange={(e) => updateField(fieldName, e.target.value)}
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
                            size="small"
                        />
                    );
                }

                return (
                    <Input
                        placeholder={getFieldPlaceholder(fieldDef.label, fieldDef.default_value, fieldDef.type)}
                        value={fieldValue}
                        onChange={(e) => updateField(fieldName, e.target.value)}
                        style={commonStyle}
                        size="small"
                    />
                );

            case 'int':
                return (
                    <InputNumber
                        placeholder={getFieldPlaceholder(fieldDef.label, fieldDef.default_value, fieldDef.type)}
                        value={fieldValue}
                        onChange={(val) => updateField(fieldName, val)}
                        style={{ ...commonStyle, width: '100%' }}
                        size="small"
                    />
                );

            case 'bool':
                return (
                    <Switch
                        checked={fieldValue}
                        onChange={(checked) => updateField(fieldName, checked)}
                        size="small"
                    />
                );

            case 'select':
                if (fieldDef.connected) {
                    // Connected select - get options from connected components
                    const connectedComponents = allComponents.filter(comp => 
                        fieldDef.connected.component_types.includes(comp.type)
                    );

                    return (
                        <Select
                            placeholder={`Select ${fieldDef.label}`}
                            value={fieldValue}
                            onChange={(val) => updateField(fieldName, val)}
                            style={{ ...commonStyle, width: '100%' }}
                            size="small"
                            allowClear
                            showSearch={true}
                        >
                            {connectedComponents.map(comp => {
                                const updatedComponentName = componentNames[comp.name] || comp.name;
                                
                                // Use field value if available, otherwise component name
                                let displayValue;
                                const fieldKey = `${comp.name}.${fieldDef.connected.field_name}`;
                                const runtimeFieldValue = runtimeValues[fieldKey];
                                
                                if (runtimeFieldValue !== undefined && runtimeFieldValue !== null) {
                                    displayValue = runtimeFieldValue;
                                } else {
                                    const connectedField = comp.selected_fields.find(f => 
                                        f.field_name === fieldDef.connected.field_name
                                    );
                                    if (connectedField?.value !== undefined && connectedField.value !== null) {
                                        displayValue = connectedField.value;
                                    } else {
                                        displayValue = updatedComponentName;
                                    }
                                }
                                
                                return (
                                    <Option key={comp.name} value={displayValue} label={displayValue}>
                                        <div style={{ 
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            {displayValue}
                                        </div>
                                    </Option>
                                );
                            })}
                        </Select>
                    );
                }

                // Regular select
                return (
                    <Select
                        placeholder={getFieldPlaceholder(fieldDef.label, fieldDef.default_value, fieldDef.type)}
                        value={fieldValue}
                        onChange={(val) => updateField(fieldName, val)}
                        style={{ ...commonStyle, width: '100%' }}
                        size="small"
                        allowClear
                        showSearch={true}
                    >
                        {fieldDef.options?.map((option: any) => (
                            <Option key={option.value} value={option.value}>
                                {option.label}
                            </Option>
                        ))}
                    </Select>
                );

            case 'array':
                // Handle complex nested arrays (like routes within virtual hosts)
                if (fieldDef.properties && typeof fieldDef.properties === 'object') {
                    const arrayValue = Array.isArray(fieldValue) ? fieldValue : [];
                    
                    const addArrayItem = () => {
                        const newItem: Record<string, any> = {};
                        // Initialize with defaults from properties
                        Object.entries(fieldDef.properties).forEach(([propName, propDef]: [string, any]) => {
                            if (propDef.default_value !== undefined) {
                                newItem[propName] = propDef.default_value;
                            } else if (propDef.type === 'bool') {
                                newItem[propName] = false;
                            } else if (propDef.type === 'int') {
                                newItem[propName] = 0;
                            } else if (propDef.type === 'array') {
                                newItem[propName] = propDef.default_value || [];
                            } else if (propDef.type === 'object') {
                                // Initialize nested object with its defaults
                                const nestedObject: Record<string, any> = {};
                                if (propDef.properties) {
                                    Object.entries(propDef.properties).forEach(([nestedPropName, nestedPropDef]: [string, any]) => {
                                        if (nestedPropDef.default_value !== undefined) {
                                            nestedObject[nestedPropName] = nestedPropDef.default_value;
                                        } else if (nestedPropDef.type === 'bool') {
                                            nestedObject[nestedPropName] = false;
                                        } else if (nestedPropDef.type === 'int') {
                                            nestedObject[nestedPropName] = 0;
                                        } else if (nestedPropDef.type === 'array') {
                                            nestedObject[nestedPropName] = nestedPropDef.default_value || [];
                                        } else {
                                            nestedObject[nestedPropName] = '';
                                        }
                                    });
                                }
                                newItem[propName] = nestedObject;
                            } else {
                                newItem[propName] = '';
                            }
                        });
                        updateField(fieldName, [...arrayValue, newItem]);
                    };
                    
                    const updateArrayItem = (itemIndex: number, newItemValue: Record<string, any>) => {
                        const newArray = [...arrayValue];
                        newArray[itemIndex] = newItemValue;
                        updateField(fieldName, newArray);
                    };
                    
                    const removeArrayItem = (itemIndex: number) => {
                        const newArray = arrayValue.filter((_: any, i: number) => i !== itemIndex);
                        updateField(fieldName, newArray);
                    };
                    
                    return (
                        <div style={{ border: '1px dashed #d9d9d9', padding: '8px', borderRadius: '4px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <Text style={{ fontSize: '10px', fontWeight: 600, color: '#666' }}>
                                    {fieldDef.label} ({arrayValue.length} items)
                                </Text>
                                <Button
                                    type="dashed"
                                    size="small"
                                    onClick={addArrayItem}
                                    style={{ fontSize: '10px', height: '20px', padding: '0 6px' }}
                                >
                                    Add
                                </Button>
                            </div>
                            
                            {arrayValue.length === 0 ? (
                                <Text type="secondary" style={{ fontSize: '10px', fontStyle: 'italic' }}>
                                    No {fieldDef.label.toLowerCase()} added yet
                                </Text>
                            ) : (
                                arrayValue.map((item: Record<string, any>, itemIndex: number) => (
                                    <div key={itemIndex} style={{ 
                                        marginBottom: itemIndex < arrayValue.length - 1 ? '8px' : '0',
                                        padding: '6px',
                                        border: '1px solid #f0f0f0',
                                        borderRadius: '3px',
                                        backgroundColor: '#ffffff'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                            <Text style={{ fontSize: '9px', fontWeight: 500, color: '#888' }}>
                                                Item #{itemIndex + 1}
                                            </Text>
                                            <Button
                                                type="text"
                                                danger
                                                size="small"
                                                onClick={() => removeArrayItem(itemIndex)}
                                                style={{ fontSize: '8px', height: '16px', padding: '0 4px' }}
                                            >
                                                ×
                                            </Button>
                                        </div>
                                        
                                        <div style={{ 
                                            display: 'grid', 
                                            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                                            gap: '8px',
                                            maxWidth: '100%'
                                        }}>
                                            {Object.entries(fieldDef.properties)
                                                // Sort by required fields first, then by name
                                                .sort(([, aDef]: [string, any], [, bDef]: [string, any]) => {
                                                    if (aDef.required && !bDef.required) return -1;
                                                    if (!aDef.required && bDef.required) return 1;
                                                    return 0;
                                                })
                                                .map(([propName, propDef]: [string, any]) => {
                                                const propValue = item[propName];
                                                
                                                // Create a scoped update function for this nested item
                                                const updateNestedField = (nestedFieldName: string, nestedFieldValue: any) => {
                                                    const updatedItem = { ...item, [nestedFieldName]: nestedFieldValue };
                                                    updateArrayItem(itemIndex, updatedItem);
                                                };
                                                
                                                return (
                                                    <div key={propName}>
                                                        <Text style={{ fontSize: '9px', fontWeight: 500, display: 'block', marginBottom: '2px' }}>
                                                            {propDef.label || propName}
                                                        </Text>
                                                        <NestedArrayItemRenderer
                                                            fieldName={propName}
                                                            fieldDef={propDef}
                                                            fieldValue={propValue}
                                                            onUpdate={updateNestedField}
                                                        />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    );
                }
                
                // Handle simple arrays (tags mode or JSON) using helper
                if (isSimpleStringArray(fieldDef)) {
                    return (
                        <Select
                            mode="tags"
                            placeholder={getArrayPlaceholder(fieldDef)}
                            value={Array.isArray(fieldValue) ? fieldValue : getArrayDefaultValue(fieldDef)}
                            onChange={(val) => updateField(fieldName, val)}
                            style={{ ...commonStyle, width: '100%' }}
                            size="small"
                        />
                    );
                }
                return (
                    <Input
                        placeholder="JSON array"
                        value={typeof fieldValue === 'string' ? fieldValue : JSON.stringify(fieldValue || [])}
                        onChange={(e) => {
                            try {
                                const parsed = JSON.parse(e.target.value);
                                updateField(fieldName, parsed);
                            } catch {
                                updateField(fieldName, e.target.value);
                            }
                        }}
                        style={commonStyle}
                        size="small"
                    />
                );

            case 'conditional':
                // Handle conditional fields with different options
                const selectedOption = fieldValue;
                const availableOptions = fieldDef.options || [];
                const selectedOptionConfig = availableOptions.find((opt: any) => opt.value === selectedOption);
                
                return (
                    <div>
                        <Select
                            placeholder={`Select ${fieldDef.label}`}
                            value={selectedOption}
                            onChange={(val) => {
                                // Update the main field value
                                updateField(fieldName, val);
                                
                                // Clear any existing nested properties when changing type
                                const newValue = { ...value };
                                if (fieldDef.properties) {
                                    Object.keys(fieldDef.properties).forEach(propKey => {
                                        delete newValue[propKey];
                                    });
                                }
                                onChange(newValue);
                            }}
                            style={{ ...commonStyle, width: '100%', marginBottom: '8px' }}
                            size="small"
                            allowClear
                        >
                            {availableOptions.map((option: any) => (
                                <Option key={option.value} value={option.value}>
                                    {option.label}
                                </Option>
                            ))}
                        </Select>
                        
                        {/* Render conditional sub-fields based on selected option */}
                        {selectedOption && selectedOptionConfig && fieldDef.properties && fieldDef.properties[selectedOption] && (
                            <div style={{ marginTop: '8px', paddingLeft: '8px', borderLeft: '2px solid #e8e8e8' }}>
                                <Text style={{ fontSize: '10px', color: '#666', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                                    {selectedOptionConfig.label} Options:
                                </Text>
                                {Object.entries(fieldDef.properties[selectedOption].properties || {}).map(([subFieldName, subFieldDef]: [string, any]) => {
                                    const subFieldValue = value[subFieldName];
                                    
                                    return (
                                        <div key={subFieldName} style={{ marginBottom: '6px' }}>
                                            <Text style={{ fontSize: '9px', fontWeight: 500, display: 'block', marginBottom: '2px' }}>
                                                {subFieldDef.label || subFieldName}
                                                {subFieldDef.required && (
                                                    <Tag color="red" style={{ fontSize: '8px', marginLeft: '4px', padding: '0 2px' }}>*</Tag>
                                                )}
                                            </Text>
                                            <NestedArrayItemRenderer
                                                fieldName={subFieldName}
                                                fieldDef={subFieldDef}
                                                fieldValue={subFieldValue}
                                                onUpdate={(name, val) => updateField(name, val)}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                );

            default:
                return (
                    <Input
                        placeholder={getFieldPlaceholder(fieldDef.label, fieldDef.default_value, fieldDef.type)}
                        value={fieldValue}
                        onChange={(e) => updateField(fieldName, e.target.value)}
                        style={commonStyle}
                        size="small"
                    />
                );
        }
    };

    return (
        <div 
            style={{ 
                border: '1px solid #e8e8e8', 
                borderRadius: '4px', 
                padding: '12px',
                backgroundColor: '#fafafa'
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <Text strong style={{ fontSize: '12px', color: '#666' }}>
                    Item #{index + 1}
                </Text>
                <Button
                    type="text"
                    danger
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={onRemove}
                    style={{ padding: '0 4px' }}
                />
            </div>
            
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', 
                gap: '8px 12px',
                maxWidth: '100%'
            }}>
                {Object.entries(itemSchema)
                    // Sort by required fields first, then by name
                    .sort(([, aDef]: [string, any], [, bDef]: [string, any]) => {
                        if (aDef.required && !bDef.required) return -1;
                        if (!aDef.required && bDef.required) return 1;
                        return 0;
                    })
                    .map(([fieldName, fieldDef]: [string, any]) => {
                    const fieldValue = value[fieldName];
                    const isRequired = fieldDef.required;
                    
                    // Array type fields should span full width (entire row)
                    const isArrayField = fieldDef.type === 'array';
                    
                    return (
                        <div key={fieldName} style={{ 
                            gridColumn: isArrayField ? '1 / -1' : 'auto' // Full width for arrays
                        }}>
                            <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '4px', 
                                marginBottom: '4px',
                                minHeight: '28px' // Ensure consistent height for labels with/without tags
                            }}>
                                <Text style={{ fontSize: '11px', fontWeight: 500 }}>
                                    {fieldDef.label || fieldName}
                                </Text>
                                {isRequired && (
                                    <Tag color="red" className="text-xs" style={{ fontSize: '9px', padding: '0 4px' }}>
                                        Required
                                    </Tag>
                                )}
                                {fieldDef.connected && (
                                    <Tag color="green" style={{ fontSize: '9px', padding: '0 4px' }}>
                                        Connected
                                    </Tag>
                                )}
                            </div>
                            {renderArrayItemField(fieldName, fieldDef, fieldValue)}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// Helper component for rendering nested array item fields
interface NestedArrayItemRendererProps {
    fieldName: string;
    fieldDef: any;
    fieldValue: any;
    onUpdate: (fieldName: string, fieldValue: any) => void;
}

const NestedArrayItemRenderer: React.FC<NestedArrayItemRendererProps> = ({
    fieldName,
    fieldDef,
    fieldValue,
    onUpdate
}) => {
    const allComponents = useSelector(selectComponentInstances);
    const componentNames = useSelector(selectComponentNames);
    const runtimeValues = useSelector(selectFieldValues);
    
    const commonStyle = { borderRadius: '4px' };
    
    switch (fieldDef.type) {
        case 'string':
            return (
                <Input
                    placeholder={getFieldPlaceholder(fieldDef.label, fieldDef.default_value, fieldDef.type)}
                    value={fieldValue}
                    onChange={(e) => onUpdate(fieldName, e.target.value)}
                    style={commonStyle}
                    size="small"
                />
            );
            
        case 'int':
            return (
                <InputNumber
                    placeholder={getFieldPlaceholder(fieldDef.label, fieldDef.default_value, fieldDef.type)}
                    value={fieldValue}
                    onChange={(val) => onUpdate(fieldName, val)}
                    style={{ ...commonStyle, width: '100%' }}
                    size="small"
                />
            );
            
        case 'bool':
            return (
                <Switch
                    checked={fieldValue}
                    onChange={(checked) => onUpdate(fieldName, checked)}
                    size="small"
                />
            );

        case 'object':
            // Handle nested object fields (like match, route in routes array)
            if (fieldDef.properties && typeof fieldDef.properties === 'object') {
                const objectValue = typeof fieldValue === 'object' && fieldValue !== null ? fieldValue : {};
                
                return (
                    <div style={{ 
                        border: '1px solid #e8e8e8', 
                        borderRadius: '4px', 
                        padding: '8px',
                        backgroundColor: '#fafafa'
                    }}>
                        <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                            gap: '8px',
                            maxWidth: '100%'
                        }}>
                            {Object.entries(fieldDef.properties)
                                // Sort by required fields first, then by name
                                .sort(([, aDef]: [string, any], [, bDef]: [string, any]) => {
                                    if (aDef.required && !bDef.required) return -1;
                                    if (!aDef.required && bDef.required) return 1;
                                    return 0;
                                })
                                .map(([propName, propDef]: [string, any]) => {
                                const propValue = objectValue[propName];
                                
                                const updateObjectField = (propFieldName: string, propFieldValue: any) => {
                                    const updatedObject = { ...objectValue, [propFieldName]: propFieldValue };
                                    onUpdate(fieldName, updatedObject);
                                };
                                
                                return (
                                    <div key={propName} className="object-field-item">
                                        <Text style={{ fontSize: '10px', fontWeight: 500, display: 'block', marginBottom: '2px', color: '#666' }}>
                                            {propDef.label || propName}
                                            {propDef.required && <span style={{ color: '#ff4d4f' }}> *</span>}
                                        </Text>
                                        <NestedArrayItemRenderer
                                            fieldName={propName}
                                            fieldDef={propDef}
                                            fieldValue={propValue}
                                            onUpdate={updateObjectField}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            }
            
            // Fallback for objects without properties - JSON input
            return (
                <Input
                    placeholder="JSON object"
                    value={typeof fieldValue === 'string' ? fieldValue : JSON.stringify(fieldValue || {}, null, 2)}
                    onChange={(e) => {
                        try {
                            const parsed = JSON.parse(e.target.value || '{}');
                            onUpdate(fieldName, parsed);
                        } catch {
                            onUpdate(fieldName, e.target.value);
                        }
                    }}
                    style={commonStyle}
                    size="small"
                />
            );
            
        case 'select':
            if (fieldDef.connected) {
                // Connected select - get options from connected components
                const connectedComponents = allComponents.filter(comp => 
                    fieldDef.connected.component_types.includes(comp.type)
                );

                return (
                    <Select
                        placeholder={`Select ${fieldDef.label}`}
                        value={fieldValue}
                        onChange={(val) => onUpdate(fieldName, val)}
                        style={{ ...commonStyle, width: '100%' }}
                        size="small"
                        allowClear
                        showSearch={true}
                    >
                        {connectedComponents.map(comp => {
                            const updatedComponentName = componentNames[comp.name] || comp.name;
                            
                            // Use field value if available, otherwise component name
                            let displayValue;
                            const fieldKey = `${comp.name}.${fieldDef.connected.field_name}`;
                            const runtimeFieldValue = runtimeValues[fieldKey];
                            
                            if (runtimeFieldValue !== undefined && runtimeFieldValue !== null) {
                                displayValue = runtimeFieldValue;
                            } else {
                                const connectedField = comp.selected_fields.find(f => 
                                    f.field_name === fieldDef.connected.field_name
                                );
                                if (connectedField?.value !== undefined && connectedField.value !== null) {
                                    displayValue = connectedField.value;
                                } else {
                                    displayValue = updatedComponentName;
                                }
                            }
                            
                            return (
                                <Option key={comp.name} value={displayValue} label={displayValue}>
                                    <div style={{ 
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        {displayValue}
                                    </div>
                                </Option>
                            );
                        })}
                    </Select>
                );
            }

            // Regular select
            return (
                <Select
                    placeholder={getFieldPlaceholder(fieldDef.label, fieldDef.default_value, fieldDef.type)}
                    value={fieldValue}
                    onChange={(val) => onUpdate(fieldName, val)}
                    style={{ ...commonStyle, width: '100%' }}
                    size="small"
                    allowClear
                    showSearch={true}
                >
                    {fieldDef.options?.map((option: any) => (
                        <Option key={option.value} value={option.value}>
                            {option.label}
                        </Option>
                    ))}
                </Select>
            );
            
        case 'array':
            // Simple arrays in nested context using helper
            if (isSimpleStringArray(fieldDef)) {
                return (
                    <Select
                        mode="tags"
                        placeholder={getArrayPlaceholder(fieldDef)}
                        value={Array.isArray(fieldValue) ? fieldValue : getArrayDefaultValue(fieldDef)}
                        onChange={(val) => onUpdate(fieldName, val)}
                        style={{ ...commonStyle, width: '100%' }}
                        size="small"
                    />
                );
            }
            return (
                <Input
                    placeholder="JSON array"
                    value={typeof fieldValue === 'string' ? fieldValue : JSON.stringify(fieldValue || [])}
                    onChange={(e) => {
                        try {
                            const parsed = JSON.parse(e.target.value);
                            onUpdate(fieldName, parsed);
                        } catch {
                            onUpdate(fieldName, e.target.value);
                        }
                    }}
                    style={commonStyle}
                    size="small"
                />
            );
            
        case 'conditional':
            // Handle conditional fields in nested context
            const selectedOption = fieldValue;
            const availableOptions = fieldDef.options || [];
            
            return (
                <Select
                    placeholder={`Select ${fieldDef.label}`}
                    value={selectedOption}
                    onChange={(val) => onUpdate(fieldName, val)}
                    style={{ ...commonStyle, width: '100%' }}
                    size="small"
                    allowClear
                >
                    {availableOptions.map((option: any) => (
                        <Option key={option.value} value={option.value}>
                            {option.label}
                        </Option>
                    ))}
                </Select>
            );
            
        default:
            return (
                <Input
                    placeholder={getFieldPlaceholder(fieldDef.label, fieldDef.default_value, fieldDef.type)}
                    value={fieldValue}
                    onChange={(e) => onUpdate(fieldName, e.target.value)}
                    style={commonStyle}
                    size="small"
                />
            );
    }
};

export default ArrayFieldItemRedux;