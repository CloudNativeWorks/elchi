import React from 'react';
import { useSelector } from 'react-redux';
import { Card, Space, Tag, Typography } from 'antd';
import ComponentNameInput from './ComponentNameInput';
import FieldInputRedux from './FieldInputRedux';
import { ComponentInstance, BackendComponentDefinition } from '../hooks/useScenarioAPI';
import { isValidComponentName } from './validationUtils';
import {
    selectCurrentComponentName,
    selectSelectedVersion,
    selectProject,
    selectManaged
} from '@/redux/selectors/scenarioSelectors';

const { Text } = Typography;

interface CurrentComponentCardReduxProps {
    currentComponent: ComponentInstance;
    componentDef: BackendComponentDefinition;
    onComponentNameChange: (originalName: string, newName: string) => void;
}

const CurrentComponentCardRedux: React.FC<CurrentComponentCardReduxProps> = ({
    currentComponent,
    componentDef,
    onComponentNameChange
}) => {
    const currentComponentName = useSelector(selectCurrentComponentName);
    const selectedVersion = useSelector(selectSelectedVersion);
    const project = useSelector(selectProject);
    const managed = useSelector(selectManaged);

    return (
        <Card
            style={{
                border: '1px solid var(--border-default)',
                boxShadow: '0 2px 8px var(--shadow-sm)'
            }}
            title={
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%'
                }}>
                    <ComponentNameInput
                        originalName={currentComponent.name}
                        currentName={currentComponentName}
                        onChange={onComponentNameChange}
                        isValid={isValidComponentName}
                    />
                    <Space>
                        <Tag color="blue">{componentDef.label}</Tag>
                        <Tag color="purple">Priority {currentComponent.priority}</Tag>
                    </Space>
                </div>
            }
        >
            <Space direction="vertical" style={{ width: '100%' }} size="large">
                <div>
                    <Text type="secondary" style={{ fontSize: '14px' }}>
                        {componentDef.description}
                    </Text>
                </div>

                <div style={{ display: 'grid', gap: '16px' }}>
                    {currentComponent.selected_fields.map((selectedField, index) => {
                        const fieldDef = componentDef.available_fields.find(f => f.name === selectedField.field_name);
                        if (!fieldDef) return null;

                        return (
                            <FieldInputRedux
                                key={`${currentComponent.name}.${selectedField.field_name}.${index}`}
                                field={fieldDef}
                                componentName={currentComponent.name}
                                required={selectedField.required}
                                selectedVersion={selectedVersion}
                                project={project}
                                managed={managed}
                                componentType={currentComponent.type}
                            />
                        );
                    })}
                </div>
            </Space>
        </Card>
    );
};

export default CurrentComponentCardRedux;