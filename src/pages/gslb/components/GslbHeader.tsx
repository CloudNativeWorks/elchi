/**
 * GSLB Detail Header Component
 * Displays title and action buttons (Save, Delete)
 */

import React from 'react';
import { Space, Button, Alert } from 'antd';
import { SaveOutlined, DeleteOutlined, GlobalOutlined, ReloadOutlined } from '@ant-design/icons';
import ElchiButton from '@/elchi/components/common/ElchiButton';

export interface GslbHeaderProps {
    title: string;
    isCreateMode: boolean;
    isSaving: boolean;
    isAutoCreated: boolean;
    onSave: () => void;
    onDelete?: () => void;
    onRefresh?: () => void;
    isRefreshing?: boolean;
}

const GslbHeader: React.FC<GslbHeaderProps> = ({
    title,
    isCreateMode,
    isSaving,
    isAutoCreated,
    onSave,
    onDelete,
    onRefresh,
    isRefreshing
}) => {
    return (
        <>
            <div
                style={{
                    marginBottom: 24,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <Space size="middle">
                    <GlobalOutlined style={{ fontSize: 24, color: 'var(--color-primary)' }} />
                    <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: 'var(--text-primary)' }}>{title}</h2>
                </Space>

                <Space>
                    {!isCreateMode && onRefresh && (
                        <Button
                            icon={<ReloadOutlined />}
                            onClick={onRefresh}
                            loading={isRefreshing}
                            style={{
                                borderRadius: 8,
                            }}
                        >
                            Refresh
                        </Button>
                    )}
                    {!isCreateMode && onDelete && !isAutoCreated && (
                        <Button
                            danger
                            icon={<DeleteOutlined />}
                            onClick={onDelete}
                            style={{
                                borderRadius: 8,
                            }}
                        >
                            Delete
                        </Button>
                    )}
                    <ElchiButton
                        type="primary"
                        icon={<SaveOutlined />}
                        onClick={onSave}
                        loading={isSaving}
                    >
                        {isSaving ? (isCreateMode ? 'Creating...' : 'Saving...') : (isCreateMode ? 'Create GSLB Record' : 'Save Changes')}
                    </ElchiButton>
                </Space>
            </div>

            {isAutoCreated && (
                <Alert
                    message="Auto-Created Record"
                    description="This GSLB record was automatically created by the system and is linked to a service. You can modify TTL, Failover Zone, Enabled status, Probe settings, and add/remove manual IPs. However, you cannot delete the record or remove auto-generated IPs. To delete this record, delete the associated service."
                    type="info"
                    showIcon
                    style={{ marginBottom: 16 }}
                />
            )}
        </>
    );
};

export default GslbHeader;
