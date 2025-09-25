import React, { useState, useEffect } from 'react';
import { isSimpleStringArray, getArrayPlaceholder } from './utils/arrayDetection';
import {
    Card,
    Button,
    List,
    Typography,
    Space,
    Drawer,
    Form,
    Input,
    Checkbox,
    Empty,
    Tag,
    Select,
    InputNumber,
    Alert,
    Tooltip,
    Progress,
    Modal
} from 'antd';
import {
    PlusOutlined,
    DeleteOutlined,
    EditOutlined,
    DragOutlined,
    SettingOutlined,
    CheckOutlined,
    ExclamationCircleOutlined,
    CheckCircleOutlined,
    LinkOutlined,
    BranchesOutlined
} from '@ant-design/icons';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
    ComponentInstance,
    SelectedField,
    useScenarioAPI,
    BackendComponentDefinition,
    AvailableField
} from './hooks/useScenarioAPI';
import { showErrorNotification, showSuccessNotification, showWarningNotification } from '@/common/notificationHandler';
import { getFieldPlaceholder } from './utils/displayUtils';

const { Text } = Typography;

interface DynamicComponentBuilderProps {
    initialComponents: ComponentInstance[];
    onSubmit: (components: ComponentInstance[]) => void;
    onPrevious: () => void;
}

interface SortableComponentProps {
    component: ComponentInstance;
    index: number;
    onEdit: (index: number, newName?: string) => void;
    onDelete: (index: number) => void;
    onConfigureFields: (index: number) => void;
    componentDefinition?: BackendComponentDefinition;
    getRelationships?: (component: ComponentInstance) => { dependencies: string[], dependents: string[] };
}

const SortableComponent: React.FC<SortableComponentProps> = ({
    component,
    index,
    onEdit,
    onDelete,
    onConfigureFields,
    componentDefinition,
    getRelationships
}) => {
    const [isEditingName, setIsEditingName] = useState(false);
    const [tempName, setTempName] = useState(component.name);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: `${component.type}-${component.name}` });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const selectedFieldsCount = component.selected_fields.length;
    const availableFieldsCount = componentDefinition?.available_fields.length || 0;
    const requiredFieldsCount = componentDefinition?.available_fields.filter(field => field.required_for_creation).length || 0;
    const completionPercent = availableFieldsCount > 0 ? Math.round((selectedFieldsCount / availableFieldsCount) * 100) : 0;
    
    // Component is valid if it has no required fields OR has configured fields
    const isComponentValid = requiredFieldsCount === 0 || selectedFieldsCount > 0;
    const relationships = getRelationships ? getRelationships(component) : { dependencies: [], dependents: [] };

    const handleNameSave = () => {
        if (tempName && tempName !== component.name) {
            onEdit(index, tempName);
        }
        setIsEditingName(false);
    };

    const handleNameCancel = () => {
        setTempName(component.name);
        setIsEditingName(false);
    };

    return (
        <div ref={setNodeRef} style={style}>
            <Card
                size="small"
                style={{
                    marginBottom: '12px',
                    borderRadius: '12px',
                    boxShadow: isDragging ? '0 8px 24px rgba(0,0,0,0.15)' : '0 2px 8px rgba(0,0,0,0.06)',
                    border: '1px solid #f0f0f0',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease'
                }}
                styles={{ body: { padding: 0 } }}
            >
                <div style={{
                    display: 'flex',
                    alignItems: 'stretch',
                    minHeight: '120px'
                }}>
                    {/* Drag Handle */}
                    <div
                        style={{
                            width: '40px',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'move',
                            position: 'relative'
                        }}
                        {...attributes}
                        {...listeners}
                    >
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <DragOutlined style={{ color: 'white', fontSize: '18px' }} />
                        </div>
                    </div>

                    {/* Main Content */}
                    <div style={{ flex: 1, padding: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ flex: 1 }}>
                                {/* Header */}
                                <div style={{ marginBottom: '12px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                                        {isEditingName ? (
                                            <Input
                                                value={tempName}
                                                onChange={(e) => setTempName(e.target.value)}
                                                onPressEnter={handleNameSave}
                                                onBlur={handleNameSave}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Escape') {
                                                        handleNameCancel();
                                                    }
                                                }}
                                                autoFocus
                                                style={{
                                                    width: '200px',
                                                    fontWeight: 500,
                                                    fontSize: '16px'
                                                }}
                                                placeholder="Enter component name"
                                            />
                                        ) : (
                                            <Typography.Title
                                                level={5}
                                                style={{
                                                    margin: 0,
                                                    cursor: 'text',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '4px'
                                                }}
                                                onClick={() => {
                                                    setIsEditingName(true);
                                                    setTempName(component.name);
                                                }}
                                            >
                                                {component.name}
                                                <EditOutlined style={{ fontSize: '14px', color: '#999' }} />
                                            </Typography.Title>
                                        )}
                                        <Tag color="purple" className="auto-width-tag" style={{ fontSize: '11px' }}>
                                            {componentDefinition?.label || component.type}
                                        </Tag>
                                    </div>
                                    <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
                                        {componentDefinition?.description}
                                    </Typography.Text>
                                </div>

                                {/* Progress Bar */}
                                <div style={{ marginBottom: '12px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                        <Typography.Text style={{ fontSize: '12px', color: '#666' }}>
                                            Field Configuration
                                        </Typography.Text>
                                        <Typography.Text style={{ fontSize: '12px', fontWeight: 'bold', color: isComponentValid ? '#52c41a' : (requiredFieldsCount === 0 ? '#52c41a' : '#1890ff') }}>
                                            {requiredFieldsCount === 0 ? 
                                                `${selectedFieldsCount}/${availableFieldsCount} fields (no required)` : 
                                                `${selectedFieldsCount}/${availableFieldsCount} fields`
                                            }
                                        </Typography.Text>
                                    </div>
                                    <Progress
                                        percent={requiredFieldsCount === 0 ? 100 : completionPercent}
                                        size="small"
                                        strokeColor={isComponentValid ? '#52c41a' : '#ff4d4f'}
                                        showInfo={false}
                                    />
                                </div>

                                {/* Relationships */}
                                {(relationships.dependencies.length > 0 || relationships.dependents.length > 0) && (
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                        {relationships.dependencies.length > 0 && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <LinkOutlined style={{ fontSize: '12px', color: '#fa8c16' }} />
                                                <Typography.Text style={{ fontSize: '11px', color: '#666' }}>
                                                    Requires:
                                                </Typography.Text>
                                                {relationships.dependencies.map(dep => (
                                                    <Tag key={dep} color="orange" className="auto-width-tag" style={{ fontSize: '10px' }}>
                                                        {dep}
                                                    </Tag>
                                                ))}
                                            </div>
                                        )}
                                        {relationships.dependents.length > 0 && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <BranchesOutlined style={{ fontSize: '12px', color: '#1890ff' }} />
                                                <Typography.Text style={{ fontSize: '11px', color: '#666' }}>
                                                    Used by:
                                                </Typography.Text>
                                                {relationships.dependents.map(dep => (
                                                    <Tag key={dep} color="blue" className="auto-width-tag" style={{ fontSize: '10px' }}>
                                                        {dep}
                                                    </Tag>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div style={{ display: 'flex', gap: '4px' }}>
                                <Tooltip title="Configure Fields">
                                    <Button
                                        type="primary"
                                        size="small"
                                        icon={<SettingOutlined />}
                                        onClick={() => onConfigureFields(index)}
                                        style={{
                                            background: isComponentValid ? '#52c41a' : '#ff4d4f',
                                            borderColor: isComponentValid ? '#52c41a' : '#ff4d4f'
                                        }}
                                    />
                                </Tooltip>
                                <Tooltip title="Delete Component">
                                    <Button
                                        size="small"
                                        danger
                                        icon={<DeleteOutlined />}
                                        onClick={() => onDelete(index)}
                                    />
                                </Tooltip>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

const DynamicComponentBuilder: React.FC<DynamicComponentBuilderProps> = ({
    initialComponents,
    onSubmit,
    onPrevious
}) => {
    const [components, setComponents] = useState<ComponentInstance[]>(initialComponents);
    const [isAddDrawerVisible, setIsAddDrawerVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isFieldConfigDrawerVisible, setIsFieldConfigDrawerVisible] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number>(-1);
    const [configuringIndex, setConfiguringIndex] = useState<number>(-1);
    const [selectedComponentTypes, setSelectedComponentTypes] = useState<string[]>([]);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    const [addForm] = Form.useForm();
    const [editForm] = Form.useForm();
    const [fieldConfigForm] = Form.useForm();

    // Update components when initialComponents prop changes (for edit mode)
    useEffect(() => {
        setComponents(initialComponents);
    }, [initialComponents]);

    const { useGetComponentCatalog } = useScenarioAPI();
    const { data: componentCatalogData } = useGetComponentCatalog();

    // Validation function based on backend component rules
    const validateComponents = (componentsToValidate: ComponentInstance[]) => {
        const errors: string[] = [];
        const componentCounts = new Map<string, number>();
        const componentNames = new Map<string, string[]>();

        // Count components and collect names
        componentsToValidate.forEach(comp => {
            const count = componentCounts.get(comp.type) || 0;
            componentCounts.set(comp.type, count + 1);

            const names = componentNames.get(comp.type) || [];
            names.push(comp.name);
            componentNames.set(comp.type, names);
        });

        // Check each component definition's rules
        componentCatalogData?.components.forEach(compDef => {
            const count = componentCounts.get(compDef.name) || 0;

            // Check min/max counts
            if (compDef.rules?.min_count && count < compDef.rules.min_count) {
                errors.push(`${compDef.label} requires at least ${compDef.rules.min_count} instance(s), got ${count}`);
            }
            if (compDef.rules?.max_count && count > compDef.rules.max_count) {
                errors.push(`${compDef.label} allows maximum ${compDef.rules.max_count} instance(s), got ${count}`);
            }

            if (count > 0) {
                // Check required dependencies - at least ONE must exist
                if (compDef.rules?.required_with && compDef.rules.required_with.length > 0) {
                    const hasAtLeastOne = compDef.rules.required_with.some(requiredType =>
                        componentCounts.has(requiredType) && (componentCounts.get(requiredType) || 0) > 0
                    );

                    if (!hasAtLeastOne) {
                        const requiredLabels = compDef.rules.required_with.map(type => {
                            const def = componentCatalogData?.components.find(c => c.name === type);
                            return def?.label || type;
                        });
                        errors.push(`${compDef.label} requires at least one of: ${requiredLabels.join(' or ')}`);
                    }
                }

                // Check conflicts
                compDef.rules?.conflicts_with?.forEach(conflictType => {
                    if (componentCounts.has(conflictType) && (componentCounts.get(conflictType) || 0) > 0) {
                        const conflictCompDef = componentCatalogData?.components.find(c => c.name === conflictType);
                        errors.push(`${compDef.label} conflicts with ${conflictCompDef?.label || conflictType} - cannot be used together`);
                    }
                });
            }
        });

        return errors;
    };

    // Validate components whenever they change
    useEffect(() => {
        if (componentCatalogData && components.length > 0) {
            const errors = validateComponents(components);
            setValidationErrors(errors);
        } else {
            setValidationErrors([]);
        }
    }, [components, componentCatalogData]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: any) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setComponents((items) => {
                const oldIndex = items.findIndex(item => `${item.type}-${item.name}` === active.id);
                const newIndex = items.findIndex(item => `${item.type}-${item.name}` === over.id);

                const reorderedItems = arrayMove(items, oldIndex, newIndex);

                // Update priorities based on new order
                return reorderedItems.map((item, index) => ({
                    ...item,
                    priority: index + 1
                }));
            });
        }
    };

    const handleAddComponent = (values: any) => {
        // Support multiple component types
        const typesToAdd = Array.isArray(values.types) ? values.types : [values.type];
        const newComponents: ComponentInstance[] = [];

        typesToAdd.forEach((type: string) => {
            const componentDef = componentCatalogData?.components.find(c => c.name === type);
            const baseName = componentDef?.label || type;
            let componentName = baseName;

            // If component name already exists, find a unique name
            const existingNames = [...components.map(c => c.name), ...newComponents.map(c => c.name)];
            let counter = 1;
            while (existingNames.includes(componentName)) {
                counter++;
                componentName = `${baseName}${counter}`;
            }

            // Get default required fields
            const defaultSelectedFields: SelectedField[] = [];
            if (componentDef) {
                componentDef.available_fields.forEach(field => {
                    if (field.required_for_creation) {
                        defaultSelectedFields.push({
                            field_name: field.name,
                            required: true,
                            // Include default value only for simple types and non-connected fields
                            value: (!['object', 'nested_choice', 'conditional'].includes(field.type) && !field.connected && !field.has_metadata && (field.type !== 'array' || isSimpleStringArray(field))) ? field.default_value : undefined
                        });
                    }
                });
            }

            const newComponent: ComponentInstance = {
                type: type,
                name: componentName,
                priority: componentDef?.priority || 999, // Use backend priority or fallback to high number
                selected_fields: defaultSelectedFields // Include default required fields
            };

            newComponents.push(newComponent);
        });

        if (newComponents.length > 0) {
            // Reset all priorities from backend definitions and add new components
            const allComponents = [...components, ...newComponents];
            const updatedComponents = allComponents.map(component => {
                // Find backend definition to get original priority
                const componentDef = componentCatalogData?.components.find(c => c.name === component.type);
                return {
                    ...component,
                    priority: componentDef?.priority || 999 // Reset to backend priority
                };
            }).sort((a, b) => {
                const aPriority = a.priority || 999;
                const bPriority = b.priority || 999;
                return aPriority - bPriority;
            });
            
            setComponents(updatedComponents);
            setIsAddDrawerVisible(false);
            setSelectedComponentTypes([]);
            addForm.resetFields();
            showSuccessNotification(`${newComponents.length} component(s) added successfully`);
        }
    };

    const handleEditComponent = (values: any) => {
        const updatedComponents = [...components];
        updatedComponents[editingIndex] = {
            ...updatedComponents[editingIndex],
            name: values.name
        };
        setComponents(updatedComponents);
        setIsEditModalVisible(false);
        editForm.resetFields();
        showSuccessNotification('Component updated successfully');
    };

    const handleDeleteComponent = (index: number) => {
        const newComponents = components.filter((_, i) => i !== index);
        setComponents(newComponents);
        showSuccessNotification('Component removed');
    };

    const handleEditClick = (index: number, newName?: string) => {
        if (newName) {
            // Inline editing - directly update the component name
            if (components.some((c, i) => i !== index && c.name === newName)) {
                showWarningNotification('Component name already exists');
                return;
            }

            const updatedComponents = [...components];
            updatedComponents[index] = {
                ...updatedComponents[index],
                name: newName
            };
            setComponents(updatedComponents);
            showSuccessNotification('Component name updated');
        } else {
            // Modal editing (fallback)
            setEditingIndex(index);
            const component = components[index];
            editForm.setFieldsValue({
                name: component.name
            });
            setIsEditModalVisible(true);
        }
    };

    const handleConfigureFieldsClick = (index: number) => {
        setConfiguringIndex(index);
        const component = components[index];
        const componentDef = componentCatalogData?.components.find(c => c.name === component.type);

        // Set initial form values based on selected fields
        const initialValues: any = {};

        // If no fields are selected yet, set default required fields
        if (component.selected_fields.length === 0 && componentDef) {
            componentDef.available_fields.forEach(field => {
                if (field.required_for_creation) {
                    initialValues[field.name] = true;
                    initialValues[`${field.name}_required`] = true;
                    // Set default value only for simple types and non-connected fields
                    if (!['object', 'nested_choice', 'conditional'].includes(field.type) && !field.connected && !field.has_metadata && (field.type !== 'array' || isSimpleStringArray(field))) {
                        initialValues[`${field.name}_value`] = field.default_value;
                    }
                }
            });
        } else {
            // Set existing selected fields
            component.selected_fields.forEach(field => {
                initialValues[field.field_name] = true;
                initialValues[`${field.field_name}_required`] = field.required;
                initialValues[`${field.field_name}_value`] = field.value; // Load existing value
            });
            // Also ensure default required fields are checked
            if (componentDef) {
                componentDef.available_fields.forEach(field => {
                    if (field.required_for_creation && !initialValues[field.name]) {
                        initialValues[field.name] = true;
                        initialValues[`${field.name}_required`] = true;
                        // Set default value only for simple types and non-connected fields
                        if (!['object', 'nested_choice', 'conditional'].includes(field.type) && !field.connected && !field.has_metadata && (field.type !== 'array' || isSimpleStringArray(field))) {
                            initialValues[`${field.name}_value`] = field.default_value;
                        }
                    }
                });
            }
        }

        fieldConfigForm.setFieldsValue(initialValues);
        setIsFieldConfigDrawerVisible(true);
    };

    const handleFieldConfigSubmit = (values: any) => {
        if (configuringIndex >= 0) {
            const component = components[configuringIndex];
            const componentDef = componentCatalogData?.components.find(c => c.name === component.type);

            if (!componentDef) {
                showErrorNotification('Component definition not found');
                return;
            }

            // Build selected fields array from form values
            const selectedFields: SelectedField[] = [];
            componentDef.available_fields.forEach(field => {
                if (values[field.name]) { // Field is selected
                    selectedFields.push({
                        field_name: field.name,
                        required: values[`${field.name}_required`] || false,
                        value: values[`${field.name}_value`] // Include user-set value
                    });
                }
            });

            const updatedComponents = [...components];
            updatedComponents[configuringIndex] = {
                ...updatedComponents[configuringIndex],
                selected_fields: selectedFields
            };

            setComponents(updatedComponents);
            setIsFieldConfigDrawerVisible(false);
            setConfiguringIndex(-1);
            fieldConfigForm.resetFields();
            showSuccessNotification('Field configuration saved');
        }
    };

    const handleSubmit = () => {
        if (components.length === 0) {
            showWarningNotification('Please add at least one component');
            return;
        }

        // Validate that components with required fields have at least one field selected
        const componentsWithoutFields = components.filter(c => {
            if (c.selected_fields.length > 0) return false; // Has fields configured
            
            // Check if this component has any required fields
            const componentDef = getComponentDefinition(c.type);
            if (!componentDef) return false; // No definition found, skip validation
            
            const hasRequiredFields = componentDef.available_fields.some(field => field.required_for_creation);
            return hasRequiredFields; // Only flag components that have required fields but no configured fields
        });
        
        if (componentsWithoutFields.length > 0) {
            showWarningNotification(`Please configure required fields for: ${componentsWithoutFields.map(c => c.name).join(', ')}`);
            return;
        }

        onSubmit(components);
    };

    const getComponentDefinition = (componentType: string) => {
        return componentCatalogData?.components.find(c => c.name === componentType);
    };

    // Get available options for connected fields
    const getConnectedFieldOptions = (field: AvailableField) => {
        if (!field.connected) return [];

        const targetComponents = components.filter(comp => field.connected!.component_types.includes(comp.type));
        const options: Array<{ value: string, label: string }> = [];

        targetComponents.forEach(comp => {
            const targetComponentDef = getComponentDefinition(comp.type);
            if (targetComponentDef) {
                const targetField = targetComponentDef.available_fields.find(f => f.name === field.connected!.field_name);
                if (targetField) {
                    // Check if the target component has this field selected
                    const selectedField = comp.selected_fields.find(sf => sf.field_name === field.connected!.field_name);
                    
                    // Resolve the field value - same logic as ArrayFieldItem.tsx
                    let fieldValue;
                    if (selectedField?.value !== undefined && selectedField.value !== null) {
                        fieldValue = selectedField.value;
                    } else {
                        // For use_component_name fields or when no value is set, use component name
                        fieldValue = comp.name;
                    }
                    
                    // Show option if field is selected OR if it's a use_component_name field
                    if (selectedField || targetField.use_component_name) {
                        options.push({
                            value: fieldValue,
                            label: `${comp.name} (${targetField.label})`
                        });
                    }
                }
            }
        });

        return options;
    };

    // Get component relationships
    const getComponentRelationships = (component: ComponentInstance) => {
        const componentDef = getComponentDefinition(component.type);
        if (!componentDef) return { dependencies: [], dependents: [] };

        const dependencies: string[] = [];
        const dependents: string[] = [];

        // Check connected fields (this component depends on others)
        component.selected_fields.forEach(selectedField => {
            const fieldDef = componentDef.available_fields.find(f => f.name === selectedField.field_name);
            if (fieldDef?.connected) {
                const targetComponents = components.filter(c => fieldDef.connected!.component_types.includes(c.type));
                targetComponents.forEach(target => {
                    if (!dependencies.includes(target.name)) {
                        dependencies.push(target.name);
                    }
                });
            }
        });

        // Check if other components depend on this one
        components.forEach(otherComponent => {
            if (otherComponent.name === component.name) return;

            const otherComponentDef = getComponentDefinition(otherComponent.type);
            if (!otherComponentDef) return;

            otherComponent.selected_fields.forEach(selectedField => {
                const fieldDef = otherComponentDef.available_fields.find(f => f.name === selectedField.field_name);
                if (fieldDef?.connected?.component_types.includes(component.type)) {
                    if (!dependents.includes(otherComponent.name)) {
                        dependents.push(otherComponent.name);
                    }
                }
            });
        });

        return { dependencies, dependents };
    };

    return (
        <Card title="Configure Resources">
            <div style={{ marginBottom: '16px' }}>
                <Text type="secondary">
                    Add resource and select their fields. Each resource is fully customizable based on your needs. Priority is important, drag and drop to reorder.
                </Text>
            </div>

            {/* Validation Alerts */}
            {validationErrors.length > 0 && (
                <Alert
                    message="Resource Validation Issues"
                    type="warning"
                    showIcon
                    style={{ marginBottom: '16px' }}
                    description={
                        <List
                            size="small"
                            dataSource={validationErrors}
                            renderItem={(error) => (
                                <List.Item style={{ border: 'none', padding: '4px 0' }}>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>
                                        <ExclamationCircleOutlined style={{ color: '#faad14', marginRight: '8px', marginTop: '2px', flexShrink: 0 }} />
                                        <Text>{error}</Text>
                                    </div>
                                </List.Item>
                            )}
                        />
                    }
                />
            )}


            {/* Add Component Button */}
            <Button
                type="dashed"
                icon={<PlusOutlined />}
                onClick={() => setIsAddDrawerVisible(true)}
                block
                style={{ marginBottom: '16px' }}
            >
                Add Resource
            </Button>

            {/* Resources List */}
            {components.length === 0 ? (
                <Empty
                    description="No resources added yet"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
            ) : (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={components.map(c => `${c.type}-${c.name}`)}
                        strategy={verticalListSortingStrategy}
                    >
                        {components.map((component, index) => (
                            <SortableComponent
                                key={`${component.type}-${component.name}`}
                                component={component}
                                index={index}
                                onEdit={handleEditClick}
                                onDelete={handleDeleteComponent}
                                onConfigureFields={handleConfigureFieldsClick}
                                componentDefinition={getComponentDefinition(component.type)}
                                getRelationships={getComponentRelationships}
                            />
                        ))}
                    </SortableContext>
                </DndContext>
            )}

            {/* Navigation Buttons */}
            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between' }}>
                <Button onClick={onPrevious}>
                    Previous: Basic Info
                </Button>
                <Button
                    type="primary"
                    onClick={handleSubmit}
                    disabled={components.length === 0}
                >
                    Next: Review & Create
                </Button>
            </div>

            {/* Add Resource Drawer */}
            <Drawer
                title="Add Resources"
                open={isAddDrawerVisible}
                onClose={() => {
                    setIsAddDrawerVisible(false);
                    setSelectedComponentTypes([]);
                    addForm.resetFields();
                }}
                width={700}
                placement="right"
            >
                <Form form={addForm} layout="vertical" onFinish={handleAddComponent}>
                    {selectedComponentTypes.length > 0 && (
                        <Alert
                            message={`${selectedComponentTypes.length} resource(s) selected`}
                            type="info"
                            style={{ marginBottom: '16px' }}
                            closable
                            onClose={() => setSelectedComponentTypes([])}
                        />
                    )}

                    <Form.Item
                        name="types"
                        label="Select Resource Types (Multiple Selection Allowed)"
                        rules={[{
                            validator: () => {
                                if (selectedComponentTypes.length === 0) {
                                    return Promise.reject('Please select at least one resource type');
                                }
                                return Promise.resolve();
                            }
                        }]}
                    >
                        <div style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                            {(() => {
                                if (!componentCatalogData?.components) return null;
                                
                                // Group components by collection
                                const groupedComponents = componentCatalogData.components.reduce((acc, componentDef) => {
                                    let collectionKey = componentDef.collection || 'other';
                                    
                                    // Main Resources: listeners, clusters, routes, secrets, endpoints, virtual_hosts
                                    const mainResourceCollections = ['listeners', 'clusters', 'routes', 'secrets', 'endpoints', 'virtual_hosts'];
                                    if (mainResourceCollections.includes(collectionKey)) {
                                        collectionKey = 'main_resources';
                                    }
                                    
                                    // Handle filters collection special cases
                                    if (collectionKey === 'filters') {
                                        if (componentDef.canonical_name?.startsWith('envoy.filters.http')) {
                                            collectionKey = 'http_filters';
                                        } else if (componentDef.canonical_name?.startsWith('envoy.filters.network')) {
                                            collectionKey = 'network_filters';
                                        }
                                    }
                                    
                                    if (!acc[collectionKey]) {
                                        acc[collectionKey] = [];
                                    }
                                    acc[collectionKey].push(componentDef);
                                    return acc;
                                }, {} as Record<string, any[]>);
                                
                                // Define collection display names and order
                                const collectionOrder = ['main_resources', 'http_filters', 'network_filters', 'extensions', 'other'];
                                const collectionNames = {
                                    main_resources: 'Main Resources',
                                    http_filters: 'HTTP Filters',
                                    network_filters: 'Network Filters',
                                    extensions: 'Extensions',
                                    other: 'Other'
                                };
                                
                                // Sort collections by defined order
                                const orderedCollections = collectionOrder.filter(collection => groupedComponents[collection]);
                                const remainingCollections = Object.keys(groupedComponents).filter(collection => !collectionOrder.includes(collection));
                                const finalCollectionOrder = [...orderedCollections, ...remainingCollections];
                                
                                return finalCollectionOrder.map(collection => {
                                    const components = groupedComponents[collection].sort((a, b) => (a.priority || 999) - (b.priority || 999));
                                    const collectionTitle = collectionNames[collection as keyof typeof collectionNames] || collection;
                                    
                                    return (
                                        <div key={collection} style={{ marginBottom: '16px' }}>
                                            <Typography.Text 
                                                strong 
                                                style={{ 
                                                    fontSize: '14px', 
                                                    color: '#1890ff',
                                                    display: 'block',
                                                    marginBottom: '8px',
                                                    borderBottom: '1px solid #f0f0f0',
                                                    paddingBottom: '4px'
                                                }}
                                            >
                                                {collectionTitle} ({components.length})
                                            </Typography.Text>
                                            {components.map((componentDef) => {
                                                const isSelected = selectedComponentTypes.includes(componentDef.name);
                                                const isAlreadyAdded = components.some(c => c.type === componentDef.name);
                                                const isDisabled = isAlreadyAdded;
                                                
                                                return (
                                                    <Card
                                                        key={componentDef.name}
                                                        size="small"
                                                        style={{
                                                            marginBottom: '6px',
                                                            cursor: isDisabled ? 'not-allowed' : 'pointer',
                                                            border: isSelected ? '1px solid #1890ff' : '1px solid #f0f0f0',
                                                            backgroundColor: isDisabled ? '#f5f5f5' : (isSelected ? '#f0f8ff' : 'white'),
                                                            opacity: isDisabled ? 0.6 : 1,
                                                            transition: 'all 0.2s ease'
                                                        }}
                                                        onClick={() => {
                                                            if (isDisabled) return;
                                                            
                                                            if (isSelected) {
                                                                setSelectedComponentTypes(selectedComponentTypes.filter(t => t !== componentDef.name));
                                                            } else {
                                                                setSelectedComponentTypes([...selectedComponentTypes, componentDef.name]);
                                                            }
                                                            addForm.setFieldsValue({
                                                                types: isSelected
                                                                    ? selectedComponentTypes.filter(t => t !== componentDef.name)
                                                                    : [...selectedComponentTypes, componentDef.name]
                                                            });
                                                        }}
                                                    >
                                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                            <div style={{ flex: 1 }}>
                                                                <Space size="small">
                                                                    <Checkbox 
                                                                        checked={isSelected} 
                                                                        disabled={isDisabled}
                                                                    />
                                                                    <Typography.Text 
                                                                        strong
                                                                        style={{ 
                                                                            color: isDisabled ? '#999' : 'inherit',
                                                                            fontSize: '13px'
                                                                        }}
                                                                    >
                                                                        {componentDef.label}
                                                                    </Typography.Text>
                                                                    {isAlreadyAdded && (
                                                                        <Tag color="orange" className="auto-width-tag">
                                                                            Already Added
                                                                        </Tag>
                                                                    )}
                                                                </Space>
                                                                <Tooltip title={componentDef.description}>
                                                                    <Typography.Text 
                                                                        type="secondary" 
                                                                        style={{ 
                                                                            display: 'block', 
                                                                            fontSize: '11px', 
                                                                            marginTop: '2px',
                                                                            color: isDisabled ? '#999' : 'inherit',
                                                                            overflow: 'hidden',
                                                                            textOverflow: 'ellipsis',
                                                                            whiteSpace: 'nowrap'
                                                                        }}
                                                                    >
                                                                        {componentDef.description}
                                                                    </Typography.Text>
                                                                </Tooltip>
                                                            </div>
                                                            {isSelected && !isDisabled && (
                                                                <CheckOutlined style={{ color: '#1890ff', fontSize: '16px' }} />
                                                            )}
                                                        </div>
                                                    </Card>
                                                );
                                            })}
                                        </div>
                                    );
                                });
                            })()}
                        </div>
                    </Form.Item>


                    <Form.Item style={{ marginTop: '24px' }}>
                        <Space>
                            <Button onClick={() => {
                                setIsAddDrawerVisible(false);
                                setSelectedComponentTypes([]);
                                addForm.resetFields();
                            }}>
                                Cancel
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                disabled={selectedComponentTypes.length === 0}
                            >
                                Add {selectedComponentTypes.length > 0 ? `${selectedComponentTypes.length} ` : ''}Resource{selectedComponentTypes.length > 1 ? 's' : ''}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Drawer>

            {/* Field Configuration Drawer */}
            <Drawer
                title={<span>Configure Fields: {configuringIndex >= 0 ? components[configuringIndex]?.name : ''}</span>}
                open={isFieldConfigDrawerVisible}
                onClose={() => {
                    setIsFieldConfigDrawerVisible(false);
                    setConfiguringIndex(-1);
                    fieldConfigForm.resetFields();
                }}
                width={800}
                placement="right"
            >
                {configuringIndex >= 0 && (
                    <div style={{ padding: '24px 0' }}>
                        <div style={{
                            background: 'linear-gradient(135deg, #056ccd 0%, #00c6fb 100%)',
                            borderRadius: '12px',
                            padding: '20px',
                            marginBottom: '24px',
                            color: 'white'
                        }}>
                            <Typography.Title level={4} style={{ color: 'white', margin: '0 0 8px 0' }}>
                                Field Configuration
                            </Typography.Title>
                            <Text style={{ color: 'rgba(255,255,255,0.9)' }}>
                                Select the fields you want to include in this component and configure their properties.
                            </Text>
                        </div>

                        {(() => {
                            const component = components[configuringIndex];
                            const componentDef = getComponentDefinition(component.type);

                            if (!componentDef) {
                                return (
                                    <Alert
                                        type="error"
                                        message="Component definition not found"
                                        description="Unable to load field configuration for this component."
                                    />
                                );
                            }

                            return (
                                <Form
                                    form={fieldConfigForm}
                                    layout="vertical"
                                    onFinish={handleFieldConfigSubmit}
                                >
                                    <div style={{ marginBottom: '32px' }}>
                                        {componentDef.available_fields.map((field) => (
                                            <Card
                                                key={field.name}
                                                size="small"
                                                style={{
                                                    border: '1px solid #f0f0f0',
                                                    borderRadius: '12px',
                                                    transition: 'all 0.3s ease',
                                                    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                                                    marginBottom: '12px'
                                                }}
                                                styles={{ body: { padding: '16px' } }}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                                    {/* Field Selection Checkbox */}
                                                    <Form.Item
                                                        name={field.name}
                                                        valuePropName="checked"
                                                        style={{ marginBottom: 0 }}
                                                        initialValue={field.required_for_creation}
                                                    >
                                                        <Checkbox disabled={field.required_for_creation} />
                                                    </Form.Item>

                                                    {/* Field Info */}
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                                            <Typography.Text strong style={{ fontSize: '15px', color: '#1f2937' }}>
                                                                {field.label}
                                                            </Typography.Text>
                                                            <Tag color="blue" className="auto-width-tag">
                                                                {field.type}
                                                            </Tag>
                                                            {field.required_for_creation && (
                                                                <Tag color="red" className="auto-width-tag">
                                                                    Required
                                                                </Tag>
                                                            )}
                                                            {field.connected && (
                                                                <Tooltip title={`Connected to ${field.connected.component_types.join('/')}.${field.connected.field_name}`}>
                                                                    <Tag color="cyan" className="auto-width-tag" icon={<LinkOutlined />}>
                                                                        Connected
                                                                    </Tag>
                                                                </Tooltip>
                                                            )}
                                                        </div>

                                                        {/* Field Description */}
                                                        {field.description && (
                                                            <Typography.Text type="secondary" style={{ fontSize: '13px', display: 'block', marginBottom: '4px' }}>
                                                                {field.description}
                                                            </Typography.Text>
                                                        )}

                                                        {/* Default Value */}
                                                        {field.default_value !== undefined && !['object', 'nested_choice', 'conditional'].includes(field.type) && !field.connected && !field.has_metadata && (field.type !== 'array' || isSimpleStringArray(field)) && (
                                                            <Typography.Text style={{ fontSize: '12px', color: '#6b7280' }}>
                                                                Default: <Typography.Text code style={{ fontSize: '11px' }}>{String(field.default_value)}</Typography.Text>
                                                            </Typography.Text>
                                                        )}
                                                    </div>

                                                    {/* Actions and Value Column */}
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end', minWidth: '160px' }}>
                                                        {/* Required Toggle */}
                                                        <Form.Item
                                                            name={`${field.name}_required`}
                                                            valuePropName="checked"
                                                            style={{ marginBottom: 0 }}
                                                        >
                                                            <Checkbox disabled={field.required_for_creation} style={{ fontSize: '12px' }}>
                                                                Required
                                                            </Checkbox>
                                                        </Form.Item>

                                                        {/* Value Input - Only show when field is selected */}
                                                        <Form.Item
                                                            noStyle
                                                            shouldUpdate={(prevValues, curValues) => prevValues[field.name] !== curValues[field.name]}
                                                        >
                                                            {({ getFieldValue }) => {
                                                                const isFieldSelected = getFieldValue(field.name);
                                                                if (!isFieldSelected) return null;
                                                                
                                                                // Don't show value input for complex field types or connected fields
                                                                // Exception: simple arrays (like domains) should show tags input
                                                                const allowSimpleArray = isSimpleStringArray(field);
                                                                if ((['object', 'nested_choice', 'conditional'].includes(field.type) || (field.type === 'array' && !allowSimpleArray) || field.connected || field.has_metadata) && !allowSimpleArray) {
                                                                    return null;
                                                                }

                                                                return (
                                                                    <Form.Item
                                                                        name={`${field.name}_value`}
                                                                        style={{ marginBottom: 0 }}
                                                                        initialValue={(!['object', 'nested_choice', 'conditional'].includes(field.type) && !(field.type === 'array' && !allowSimpleArray) && !field.has_metadata) ? field.default_value : undefined}
                                                                    >
                                                                        {field.connected ? (
                                                                            <Select
                                                                                placeholder="Select connected value"
                                                                                size="small"
                                                                                style={{ width: '160px' }}
                                                                                allowClear
                                                                            >
                                                                                {getConnectedFieldOptions(field).map(option => (
                                                                                    <Select.Option key={option.value} value={option.value}>
                                                                                        {option.label}
                                                                                    </Select.Option>
                                                                                ))}
                                                                            </Select>
                                                                        ) : field.type === 'select' && field.options ? (
                                                                            <Select
                                                                                placeholder={getFieldPlaceholder(field.label, field.default_value, field.type)}
                                                                                size="small"
                                                                                style={{ width: '160px' }}
                                                                                allowClear
                                                                            >
                                                                                {field.options.map(option => (
                                                                                    <Select.Option key={option.value} value={option.value}>
                                                                                        {option.label}
                                                                                    </Select.Option>
                                                                                ))}
                                                                            </Select>
                                                                        ) : field.type === 'bool' ? (
                                                                            <Select
                                                                                placeholder={getFieldPlaceholder(field.label, field.default_value, field.type)}
                                                                                size="small"
                                                                                style={{ width: '160px' }}
                                                                                allowClear
                                                                            >
                                                                                <Select.Option value={true}>True</Select.Option>
                                                                                <Select.Option value={false}>False</Select.Option>
                                                                            </Select>
                                                                        ) : field.type === 'int' ? (
                                                                            <InputNumber
                                                                                placeholder={getFieldPlaceholder(field.label, field.default_value, field.type)}
                                                                                size="small"
                                                                                style={{ width: '160px' }}
                                                                            />
                                                                        ) : allowSimpleArray ? (
                                                                            <Select
                                                                                mode="tags"
                                                                                placeholder={getArrayPlaceholder(field)}
                                                                                size="small"
                                                                                style={{ width: '160px' }}
                                                                                options={[]}
                                                                            />
                                                                        ) : (
                                                                            <Input
                                                                                placeholder={getFieldPlaceholder(field.label, field.default_value, field.type)}
                                                                                size="small"
                                                                                style={{ width: '160px' }}
                                                                            />
                                                                        )}
                                                                    </Form.Item>
                                                                );
                                                            }}
                                                        </Form.Item>

                                                        {/* Connected field status */}
                                                        {field.connected && (
                                                            <div style={{ fontSize: '11px', color: '#6b7280', textAlign: 'right' }}>
                                                                {getConnectedFieldOptions(field).length > 0 ? (
                                                                    <span style={{ color: '#10b981' }}>
                                                                        <CheckCircleOutlined /> {getConnectedFieldOptions(field).length} available
                                                                    </span>
                                                                ) : (
                                                                    <span style={{ color: '#f59e0b' }}>
                                                                        Needs {field.connected.component_types.join('/')}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>

                                    <Form.Item style={{ marginTop: '24px' }}>
                                        <Space>
                                            <Button onClick={() => {
                                                setIsFieldConfigDrawerVisible(false);
                                                setConfiguringIndex(-1);
                                                fieldConfigForm.resetFields();
                                            }}>
                                                Cancel
                                            </Button>
                                            <Button type="primary" htmlType="submit">
                                                Save Field Configuration
                                            </Button>
                                        </Space>
                                    </Form.Item>
                                </Form>
                            );
                        })()}
                    </div>
                )}
            </Drawer>

            {/* Edit Component Modal */}
            <Modal
                title="Edit Resource Name"
                open={isEditModalVisible}
                onCancel={() => {
                    setIsEditModalVisible(false);
                    setEditingIndex(-1);
                    editForm.resetFields();
                }}
                footer={null}
                width={400}
            >
                <Form form={editForm} layout="vertical" onFinish={handleEditComponent}>
                    <Form.Item
                        name="name"
                        label="Resource Name"
                        rules={[
                            { required: true, message: 'Please enter a resource name' },
                            { min: 3, message: 'Name must be at least 3 characters' },
                            { max: 50, message: 'Name must be less than 50 characters' },
                            {
                                validator: (_, value) => {
                                    if (value && components.some((c, i) => i !== editingIndex && c.name === value)) {
                                        return Promise.reject('Resource name must be unique');
                                    }
                                    return Promise.resolve();
                                }
                            }
                        ]}
                    >
                        <Input placeholder="Enter resource name" />
                    </Form.Item>
                    <Form.Item style={{ marginBottom: 0 }}>
                        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                            <Button onClick={() => {
                                setIsEditModalVisible(false);
                                setEditingIndex(-1);
                                editForm.resetFields();
                            }}>
                                Cancel
                            </Button>
                            <Button type="primary" htmlType="submit">
                                Save
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
};

export default DynamicComponentBuilder;