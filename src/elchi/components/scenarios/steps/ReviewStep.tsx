import React from 'react';
import { Card, Button, Space, Typography, Descriptions, List, Tag, Collapse } from 'antd';
import { 
    ComponentInstance, 
    useScenarioAPI 
} from '../hooks/useScenarioAPI';

const { Text } = Typography;
const { Panel } = Collapse;

interface BasicInfo {
    name: string;
    description: string;
    scenario_id: string;
}

interface ReviewStepProps {
    basicInfo: BasicInfo;
    components: ComponentInstance[];
    onPrevious: () => void;
    onCreate: () => void;
    loading: boolean;
    isEditMode?: boolean;
}

const ReviewStep: React.FC<ReviewStepProps> = ({
    basicInfo,
    components,
    onPrevious,
    onCreate,
    loading,
    isEditMode = false
}) => {
    const { useGetComponentCatalog } = useScenarioAPI();
    const { data: componentCatalogData } = useGetComponentCatalog();

    const getComponentDefinition = (componentType: string) => {
        return componentCatalogData?.components.find(c => c.name === componentType);
    };

    const getFieldDefinition = (componentType: string, fieldName: string) => {
        const componentDef = getComponentDefinition(componentType);
        return componentDef?.available_fields.find(f => f.name === fieldName);
    };

    const totalFields = components.reduce((sum, component) => sum + component.selected_fields.length, 0);
    const requiredFields = components.reduce((sum, component) => 
        sum + component.selected_fields.filter(field => field.required).length, 0
    );

    return (
        <Card title={<span>{isEditMode ? "Review & Update Scenario" : "Review & Create Scenario"}</span>}>
            <div style={{ marginBottom: '24px' }}>
                <Text type="secondary">
                    {isEditMode 
                        ? "Please review your changes before updating the scenario."
                        : "Please review your dynamic scenario configuration before creating it."
                    }
                </Text>
            </div>

            {/* Basic Information Review */}
            <Card size="small" title="Basic Information" style={{ marginBottom: '16px' }}>
                <Descriptions column={1} size="small">
                    <Descriptions.Item label="Scenario Name">
                        <strong>{basicInfo.name}</strong>
                    </Descriptions.Item>
                    <Descriptions.Item label="Description">
                        {basicInfo.description}
                    </Descriptions.Item>
                    <Descriptions.Item label="Scenario ID">
                        <Text code>{basicInfo.scenario_id}</Text>
                    </Descriptions.Item>
                </Descriptions>
            </Card>

            {/* Components Summary */}
            <Card 
                size="small" 
                title={<span>Components Overview ({components.length})</span>}
                style={{ marginBottom: '16px' }}
            >
                <Space wrap>
                    <Tag color="blue" className="auto-width-tag">Total Components: {components.length}</Tag>
                    <Tag color="green" className="auto-width-tag">Total Fields: {totalFields}</Tag>
                    <Tag color="orange" className="auto-width-tag">Required Fields: {requiredFields}</Tag>
                </Space>
            </Card>

            {/* Detailed Components Review */}
            <Card size="small" title="Component Details" style={{ marginBottom: '24px' }}>
                <Collapse accordion>
                    {components.map((component, index) => {
                        const componentDef = getComponentDefinition(component.type);
                        return (
                            <Panel 
                                header={
                                    <Space>
                                        <strong>{component.name}</strong>
                                        <Tag className="auto-width-tag">{component.type}</Tag>
                                        <Tag color="blue" className="auto-width-tag">
                                            {component.selected_fields.length} fields
                                        </Tag>
                                        <Tag color="orange" className="auto-width-tag">
                                            {component.selected_fields.filter(f => f.required).length} required
                                        </Tag>
                                    </Space>
                                }
                                key={index}
                            >
                                <div>
                                    <div style={{ marginBottom: '12px' }}>
                                        <Text strong>Component Type: </Text>
                                        <Text>{componentDef?.label || component.type}</Text>
                                    </div>
                                    <div style={{ marginBottom: '12px' }}>
                                        <Text strong>Category: </Text>
                                        <Text code>{componentDef?.category}</Text>
                                    </div>
                                    <div style={{ marginBottom: '12px' }}>
                                        <Text strong>Collection: </Text>
                                        <Text code>{componentDef?.collection}</Text>
                                    </div>
                                    
                                    <div>
                                        <Text strong>Selected Fields:</Text>
                                        <List
                                            size="small"
                                            style={{ marginTop: '8px' }}
                                            dataSource={component.selected_fields}
                                            renderItem={(field) => {
                                                const fieldDef = getFieldDefinition(component.type, field.field_name);
                                                return (
                                                    <List.Item>
                                                        <div style={{ width: '100%' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                                                                <Text strong>{fieldDef?.label || field.field_name}</Text>
                                                                <Space style={{ marginLeft: 'auto' }}>
                                                                    <Tag color="blue" className="auto-width-tag">{fieldDef?.type}</Tag>
                                                                    {field.required && (
                                                                        <Tag color="red" className="auto-width-tag">Required</Tag>
                                                                    )}
                                                                    {fieldDef?.required_for_execution && (
                                                                        <Tag color="orange" className="auto-width-tag">Default Required</Tag>
                                                                    )}
                                                                </Space>
                                                            </div>
                                                            {fieldDef?.description && (
                                                                <div style={{ marginTop: '4px' }}>
                                                                    <Text type="secondary" style={{ fontSize: '12px' }}>
                                                                        {fieldDef.description}
                                                                    </Text>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </List.Item>
                                                );
                                            }}
                                        />
                                    </div>
                                </div>
                            </Panel>
                        );
                    })}
                </Collapse>
            </Card>

            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button size="large" onClick={onPrevious} disabled={loading}>
                    Previous: Configure Resources
                </Button>
                <Button 
                    type="primary" 
                    size="large"
                    onClick={onCreate}
                    loading={loading}
                >
                    {isEditMode ? 'Update Scenario' : 'Create Scenario'}
                </Button>
            </div>
        </Card>
    );
};

export default ReviewStep;