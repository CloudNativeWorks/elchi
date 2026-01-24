/**
 * WAF Detail Header Component
 * Displays title and action buttons (Save, Delete)
 */

import React from 'react';
import { Card, Typography, Space, Button } from 'antd';
import { SaveOutlined, DeleteOutlined, FireOutlined } from '@ant-design/icons';
import ElchiButton from '@/elchi/components/common/ElchiButton';

const { Title } = Typography;

export interface WafHeaderProps {
    title: string;
    isCreateMode: boolean;
    isSaving: boolean;
    onSave: () => void;
    onDelete?: () => void;
}

const WafHeader: React.FC<WafHeaderProps> = ({
    title,
    isCreateMode,
    isSaving,
    onSave,
    onDelete
}) => {
    return (
        <Card
            style={{
                marginBottom: 16,
                borderRadius: 12,
                boxShadow: 'var(--shadow-sm)',
                background: 'var(--card-bg)'
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Space size="middle">
                    <FireOutlined style={{ color: 'var(--color-danger)', fontSize: 28 }} />
                    <Title level={3} style={{ margin: 0 }}>
                        {title}
                    </Title>
                </Space>
                <Space>
                    <ElchiButton
                        type="primary"
                        icon={<SaveOutlined />}
                        onClick={onSave}
                        loading={isSaving}
                        size="large"
                    >
                        {isCreateMode ? 'Create' : 'Save'}
                    </ElchiButton>
                    {!isCreateMode && onDelete && (
                        <Button
                            danger
                            type="primary"
                            icon={<DeleteOutlined />}
                            onClick={onDelete}
                            style={{ height: 32 }}
                        >
                            Delete
                        </Button>
                    )}
                </Space>
            </div>
        </Card>
    );
};

export default WafHeader;
