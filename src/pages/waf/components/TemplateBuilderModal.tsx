/**
 * Template Builder Modal Component
 * UI for building directives using templates
 */

import React, { useState } from 'react';
import { Modal, Tabs, Form, Input, Select, Button, Space, Typography } from 'antd';
import { ThunderboltOutlined } from '@ant-design/icons';
import {
    DIRECTIVE_TEMPLATES,
    DirectiveType,
    getTemplateByType,
    validateTemplateValues
} from '../utils/directiveTemplates';

const { Text } = Typography;

export interface TemplateBuilderModalProps {
    visible: boolean;
    onClose: () => void;
    onAddDirective: (_directive: string) => void;
}

const TemplateBuilderModal: React.FC<TemplateBuilderModalProps> = ({
    visible,
    onClose,
    onAddDirective
}) => {
    const [selectedType, setSelectedType] = useState<DirectiveType>('Include');
    const [form] = Form.useForm();

    const currentTemplate = getTemplateByType(selectedType);

    const handleTypeChange = (type: string) => {
        setSelectedType(type as DirectiveType);
        form.resetFields();
    };

    const handleBuild = async () => {
        try {
            const values = await form.validateFields();

            if (!currentTemplate) return;

            const validation = validateTemplateValues(currentTemplate, values);
            if (!validation.valid) {
                return;
            }

            const directive = currentTemplate.buildDirective(values);
            onAddDirective(directive);
            form.resetFields();
            onClose();
        } catch (_error) {
            // Form validation failed
        }
    };

    const renderTemplateForm = () => {
        if (!currentTemplate) return null;

        return (
            <Form
                form={form}
                layout="vertical"
                style={{ marginTop: 16 }}
            >
                {currentTemplate.fields.map(field => {
                    if (field.type === 'select') {
                        return (
                            <Form.Item
                                key={field.name}
                                label={field.label}
                                name={field.name}
                                rules={[{ required: field.required, message: `${field.label} is required` }]}
                                help={field.description}
                            >
                                <Select
                                    placeholder={field.placeholder}
                                    options={field.options}
                                />
                            </Form.Item>
                        );
                    }

                    if (field.type === 'multiselect') {
                        return (
                            <Form.Item
                                key={field.name}
                                label={field.label}
                                name={field.name}
                                rules={[{ required: field.required, message: `${field.label} is required` }]}
                                help={field.description}
                            >
                                <Select
                                    mode="multiple"
                                    placeholder={field.placeholder}
                                    options={field.options}
                                />
                            </Form.Item>
                        );
                    }

                    if (field.type === 'number') {
                        return (
                            <Form.Item
                                key={field.name}
                                label={field.label}
                                name={field.name}
                                rules={[{ required: field.required, message: `${field.label} is required` }]}
                                help={field.description}
                            >
                                <Input
                                    type="number"
                                    placeholder={field.placeholder}
                                />
                            </Form.Item>
                        );
                    }

                    if (field.type === 'textarea') {
                        return (
                            <Form.Item
                                key={field.name}
                                label={field.label}
                                name={field.name}
                                rules={[{ required: field.required, message: `${field.label} is required` }]}
                                help={field.description}
                            >
                                <Input.TextArea
                                    placeholder={field.placeholder}
                                    autoSize={{ minRows: 2, maxRows: 4 }}
                                />
                            </Form.Item>
                        );
                    }

                    return (
                        <Form.Item
                            key={field.name}
                            label={field.label}
                            name={field.name}
                            rules={[{ required: field.required, message: `${field.label} is required` }]}
                            help={field.description}
                        >
                            <Input placeholder={field.placeholder} />
                        </Form.Item>
                    );
                })}
            </Form>
        );
    };

    return (
        <Modal
            title={
                <Space>
                    <ThunderboltOutlined style={{ color: '#1890ff' }} />
                    <span>Directive Template Builder</span>
                </Space>
            }
            open={visible}
            onCancel={onClose}
            width={700}
            footer={[
                <Button key="cancel" onClick={onClose}>
                    Cancel
                </Button>,
                <Button key="build" type="primary" onClick={handleBuild}>
                    Build & Add Directive
                </Button>
            ]}
        >
            <Tabs
                activeKey={selectedType}
                onChange={handleTypeChange}
                items={DIRECTIVE_TEMPLATES.map(template => ({
                    key: template.type,
                    label: template.label,
                    children: (
                        <div>
                            <Text type="secondary">{template.description}</Text>
                            {renderTemplateForm()}
                        </div>
                    )
                }))}
            />
        </Modal>
    );
};

export default TemplateBuilderModal;
