/**
 * Template Builder Drawer Component (Enhanced)
 * Modern drawer-based UI for building directives with live preview
 */

import React, { useState } from 'react';
import { Drawer, Form, Input, Select, Button, Space, Typography, Divider, Alert } from 'antd';
import { ThunderboltOutlined, EyeOutlined } from '@ant-design/icons';
import {
    DIRECTIVE_TEMPLATES,
    DirectiveType,
    getTemplateByType,
    validateTemplateValues
} from '../utils/directiveTemplates';
import { renderHighlightedDirective } from '../utils/directiveSyntaxHighlight';

const { Text } = Typography;

export interface TemplateBuilderDrawerProps {
    visible: boolean;
    onClose: () => void;
    onAddDirective: (directive: string) => void;
}

const TemplateBuilderDrawer: React.FC<TemplateBuilderDrawerProps> = ({
    visible,
    onClose,
    onAddDirective
}) => {
    const [selectedType, setSelectedType] = useState<DirectiveType>('SecRule');
    const [form] = Form.useForm();
    const [previewDirective, setPreviewDirective] = useState<string>('');

    const currentTemplate = getTemplateByType(selectedType);

    const handleTypeChange = (type: DirectiveType) => {
        setSelectedType(type);
        form.resetFields();
        // Keep directiveType to prevent losing selection
        form.setFieldsValue({ directiveType: type });
        setPreviewDirective('');
    };

    const handleValuesChange = (changedValues: any) => {
        // Ignore directiveType changes to prevent circular updates
        if ('directiveType' in changedValues) {
            return;
        }

        const values = form.getFieldsValue();
        if (currentTemplate) {
            try {
                const directive = currentTemplate.buildDirective(values);
                setPreviewDirective(directive);
            } catch (error) {
                setPreviewDirective('');
            }
        }
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
            setPreviewDirective('');
        } catch (_error) {
            // Form validation failed
        }
    };

    const renderField = (field: any) => {
        // Check dependency
        if (field.dependsOn) {
            const dependencyValue = form.getFieldValue(field.dependsOn.field);
            if (dependencyValue !== field.dependsOn.value) {
                return null;
            }
        }

        const commonProps = {
            label: field.label,
            name: field.name,
            rules: [{ required: field.required, message: `${field.label} is required` }],
            help: field.description
        };

        switch (field.type) {
            case 'select':
                return (
                    <Form.Item key={field.name} {...commonProps}>
                        <Select
                            placeholder={field.placeholder}
                            options={field.options}
                            showSearch
                            optionFilterProp="label"
                        />
                    </Form.Item>
                );

            case 'multiselect':
                return (
                    <Form.Item key={field.name} {...commonProps}>
                        <Select
                            mode="multiple"
                            placeholder={field.placeholder || `Select ${field.label}`}
                            options={field.options}
                            showSearch
                            optionFilterProp="label"
                            maxTagCount="responsive"
                        />
                    </Form.Item>
                );

            case 'number':
                return (
                    <Form.Item key={field.name} {...commonProps}>
                        <Input
                            type="number"
                            placeholder={field.placeholder}
                        />
                    </Form.Item>
                );

            case 'textarea':
                return (
                    <Form.Item key={field.name} {...commonProps}>
                        <Input.TextArea
                            placeholder={field.placeholder}
                            autoSize={{ minRows: 2, maxRows: 4 }}
                        />
                    </Form.Item>
                );

            case 'tags':
                return (
                    <Form.Item key={field.name} {...commonProps}>
                        <Input
                            placeholder={field.placeholder}
                            suffix={<Text type="secondary" style={{ fontSize: 11 }}>space-separated</Text>}
                        />
                    </Form.Item>
                );

            default:
                return (
                    <Form.Item key={field.name} {...commonProps}>
                        <Input placeholder={field.placeholder} />
                    </Form.Item>
                );
        }
    };

    return (
        <Drawer
            title={
                <Space>
                    <ThunderboltOutlined style={{ color: '#1890ff', fontSize: 20 }} />
                    <span style={{ fontSize: 18, fontWeight: 600 }}>Directive Template Builder</span>
                </Space>
            }
            placement="right"
            width={720}
            open={visible}
            onClose={onClose}
            footer={
                <div style={{ textAlign: 'right' }}>
                    <Space>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button type="primary" onClick={handleBuild} size="large">
                            Build & Add Directive
                        </Button>
                    </Space>
                </div>
            }
        >
            <Form
                form={form}
                layout="vertical"
                onValuesChange={handleValuesChange}
                initialValues={{ directiveType: 'SecRule' }}
            >
                {/* Directive Type Selector */}
                <Form.Item
                    label={<Text strong style={{ fontSize: 14 }}>Directive Type</Text>}
                    name="directiveType"
                    required
                >
                    <Select
                        value={selectedType}
                        onChange={handleTypeChange}
                        size="large"
                        options={DIRECTIVE_TEMPLATES.map(template => ({
                            label: `${template.icon} ${template.label}`,
                            value: template.type
                        }))}
                    />
                </Form.Item>

                {/* Template Description */}
                {currentTemplate && (
                    <Alert
                        message={currentTemplate.description}
                        type="info"
                        showIcon
                        style={{ marginBottom: 24 }}
                    />
                )}

                <Divider style={{ margin: '16px 0' }} />

                {/* Dynamic Fields Based on Selected Type */}
                {currentTemplate?.fields.map(field => renderField(field))}
            </Form>

            {/* Live Preview */}
            {previewDirective && (
                <>
                    <Divider />
                    <div style={{ marginTop: 16 }}>
                        <Space style={{ marginBottom: 8 }}>
                            <EyeOutlined style={{ color: '#52c41a' }} />
                            <Text strong style={{ fontSize: 14 }}>Live Preview:</Text>
                        </Space>
                        <div style={{
                            background: '#f6ffed',
                            border: '1px solid #b7eb8f',
                            borderRadius: 6,
                            padding: 12,
                            fontFamily: 'monospace',
                            fontSize: 12,
                            wordBreak: 'break-word',
                            lineHeight: 1.6
                        }}>
                            {renderHighlightedDirective(previewDirective)}
                        </div>
                    </div>
                </>
            )}
        </Drawer>
    );
};

export default TemplateBuilderDrawer;
