/**
 * Directive Set Card Component
 * Card showing single directive set with quick add and custom input
 */

import React, { useState } from 'react';
import { Typography, Badge, Tag, Button, Space, Input, Drawer } from 'antd';
import { CloseCircleOutlined, ThunderboltOutlined, PlusOutlined, ToolOutlined } from '@ant-design/icons';
import { COMMON_DIRECTIVES } from '../constants/commonDirectives';
import DirectiveList from './DirectiveList';
import TemplateBuilderDrawer from './TemplateBuilderDrawer';

const { Text } = Typography;
const { TextArea } = Input;

export interface DirectiveSetCardProps {
    setName: string;
    directives: string[];
    isDefault: boolean;
    newDirective: string;
    onNewDirectiveChange: (value: string) => void;
    onAddDirective: () => void;
    onQuickAdd: (directive: string) => void;
    onRemoveSet: () => void;
    editingDirective: { setName: string; index: number } | null;
    editValue: string;
    onEditValueChange: (value: string) => void;
    onMoveUp: (setName: string, index: number) => void;
    onMoveDown: (setName: string, index: number) => void;
    onStartEdit: (setName: string, index: number, value: string) => void;
    onSaveEdit: () => void;
    onCancelEdit: () => void;
    onDelete: (setName: string, index: number) => void;
}

const DirectiveSetCard: React.FC<DirectiveSetCardProps> = ({
    setName,
    directives,
    isDefault,
    newDirective,
    onNewDirectiveChange,
    onAddDirective,
    onQuickAdd,
    onRemoveSet,
    editingDirective,
    editValue,
    onEditValueChange,
    onMoveUp,
    onMoveDown,
    onStartEdit,
    onSaveEdit,
    onCancelEdit,
    onDelete
}) => {
    const [templateModalVisible, setTemplateModalVisible] = useState(false);
    const [quickAddDrawerVisible, setQuickAddDrawerVisible] = useState(false);

    const handleTemplateAdd = (directive: string) => {
        onQuickAdd(directive);
        setTemplateModalVisible(false);
    };

    return (
        <>
            <TemplateBuilderDrawer
                visible={templateModalVisible}
                onClose={() => setTemplateModalVisible(false)}
                onAddDirective={handleTemplateAdd}
            />
            <Drawer
                title={
                    <Space>
                        <ThunderboltOutlined style={{ color: '#1890ff', fontSize: 20 }} />
                        <span style={{ fontSize: 18, fontWeight: 600 }}>Quick Add Common Directives</span>
                    </Space>
                }
                placement="right"
                width={600}
                open={quickAddDrawerVisible}
                onClose={() => setQuickAddDrawerVisible(false)}
            >
                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                    {COMMON_DIRECTIVES.map(dir => (
                        <div key={dir.key} style={{
                            padding: 16,
                            background: '#fafafa',
                            borderRadius: 8,
                            border: '1px solid #e8e8e8'
                        }}>
                            <Text strong style={{ fontSize: 14, display: 'block', marginBottom: 4 }}>
                                {dir.label}
                            </Text>
                            <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 12 }}>
                                {dir.description}
                            </Text>
                            <Space wrap size="small">
                                {dir.options.map((opt, idx) => (
                                    <Button
                                        key={idx}
                                        size="small"
                                        onClick={() => {
                                            onQuickAdd(opt.value);
                                            setQuickAddDrawerVisible(false);
                                        }}
                                    >
                                        {opt.label}
                                    </Button>
                                ))}
                            </Space>
                        </div>
                    ))}
                </Space>
            </Drawer>
        <div
            style={{
                background: 'white',
                borderRadius: 12,
                border: '1px solid #e5e7eb',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                overflow: 'hidden',
                marginBottom: 16
            }}
        >
            {/* Header */}
            <div style={{
                background: '#f9fafb',
                borderBottom: '1px solid #e5e7eb',
                padding: '12px 16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Text strong style={{ fontSize: 16, color: '#111827' }}>{setName}</Text>
                    <Badge count={directives.length} style={{ backgroundColor: '#1890ff' }} />
                    {isDefault && (
                        <Tag color="green" style={{ fontSize: 12 }}>Default</Tag>
                    )}
                </div>
                <Button
                    type="text"
                    icon={<CloseCircleOutlined style={{ fontSize: 18, color: '#6b7280' }} />}
                    onClick={onRemoveSet}
                    style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        padding: 4
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#ff4d4f';
                        const icon = e.currentTarget.querySelector('.anticon') as HTMLElement;
                        if (icon) icon.style.color = '#ffffff';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        const icon = e.currentTarget.querySelector('.anticon') as HTMLElement;
                        if (icon) icon.style.color = '#6b7280';
                    }}
                />
            </div>

            {/* Body */}
            <div style={{ padding: '16px 20px' }}>
                {/* Custom Directive Input */}
                <div style={{ marginBottom: 16 }}>
                    <Text strong style={{ fontSize: 13, display: 'block', marginBottom: 8 }}>Add Custom Directive</Text>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                        <TextArea
                            placeholder="Add custom directive (e.g., SecRuleEngine On)"
                            value={newDirective}
                            onChange={(e) => onNewDirectiveChange(e.target.value)}
                            onPressEnter={(e) => {
                                // Only add on Ctrl+Enter or Cmd+Enter
                                if (e.ctrlKey || e.metaKey) {
                                    e.preventDefault();
                                    onAddDirective();
                                }
                                // Otherwise allow normal Enter for new line
                            }}
                            autoSize={{ minRows: 2, maxRows: 10 }}
                            style={{ flex: 1 }}
                        />
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={onAddDirective}
                            disabled={!newDirective?.trim()}
                        >
                            Add
                        </Button>
                        <Button
                            icon={<ToolOutlined />}
                            onClick={() => setTemplateModalVisible(true)}
                            title="Use Template Builder"
                        >
                            Template
                        </Button>
                        <Button
                            icon={<ThunderboltOutlined />}
                            onClick={() => setQuickAddDrawerVisible(true)}
                            title="Quick Add Common Directives"
                        >
                            Quick Add
                        </Button>
                    </div>
                </div>

                {/* Directive List */}
                <DirectiveList
                    directives={directives}
                    setName={setName}
                    editingDirective={editingDirective}
                    editValue={editValue}
                    onEditValueChange={onEditValueChange}
                    onMoveUp={onMoveUp}
                    onMoveDown={onMoveDown}
                    onStartEdit={onStartEdit}
                    onSaveEdit={onSaveEdit}
                    onCancelEdit={onCancelEdit}
                    onDelete={onDelete}
                />
            </div>
        </div>
        </>
    );
};

export default DirectiveSetCard;
