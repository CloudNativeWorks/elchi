import React, { useState } from 'react';
import {
    Select,
    Space,
    Typography,
    Radio,
    Modal,
    Alert,
    Descriptions,
    Tag,
    Divider
} from 'antd';
import {
    DeleteOutlined,
    ExclamationCircleOutlined,
    WarningOutlined
} from '@ant-design/icons';
import { api } from '@/common/api';
import { useMutation } from '@tanstack/react-query';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import ElchiButton from '@/elchi/components/common/ElchiButton';

const { Text, Title } = Typography;
const { confirm } = Modal;

type CleanupMode = 'all' | 'default-only' | 'non-default-only';

interface CleanupResponse {
    success: boolean;
    message: string;
    version: string;
    mode: CleanupMode;
    deleted_counts: {
        bootstrap?: number;
        clusters?: number;
        endpoints?: number;
        extensions?: number;
        filters?: number;
        routes?: number;
        secrets?: number;
        tls?: number;
        virtual_hosts?: number;
    };
    total_deleted: number;
    skipped_reason?: string;
}

const Cleanup: React.FC = () => {
    const { project } = useProjectVariable();
    const [selectedVersion, setSelectedVersion] = useState<string>('');
    const [cleanupMode, setCleanupMode] = useState<CleanupMode>('all');

    // Cleanup mutation
    const cleanupMutation = useMutation({
        mutationFn: async ({ version, mode }: { version: string; mode: CleanupMode }) => {
            const response = await api.delete(
                `/api/v3/setting/maintenance/cleanup/versions/${version}?project=${project}&mode=${mode}`
            );
            return response.data as CleanupResponse;
        },
        onSuccess: (data) => {
            if (data.success) {
                // Show detailed success message
                Modal.success({
                    title: 'Cleanup Successful',
                    width: 600,
                    content: (
                        <div>
                            <Alert
                                message={data.message}
                                type="success"
                                showIcon
                                style={{ marginBottom: 16 }}
                            />
                            <Descriptions column={1} bordered size="small">
                                <Descriptions.Item label="Version">{data.version}</Descriptions.Item>
                                <Descriptions.Item label="Mode">
                                    <Tag color="blue">{data.mode}</Tag>
                                </Descriptions.Item>
                                <Descriptions.Item label="Total Deleted">
                                    <Text strong style={{ color: 'var(--color-success)' }}>{data.total_deleted}</Text>
                                </Descriptions.Item>
                            </Descriptions>
                            {data.total_deleted > 0 && (
                                <>
                                    <Divider style={{ margin: '12px 0' }} />
                                    <Text type="secondary" style={{ fontSize: 12 }}>Deleted Resources:</Text>
                                    <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
                                        {Object.entries(data.deleted_counts).map(([key, value]) => (
                                            value > 0 && (
                                                <div key={key} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <Text style={{ fontSize: 12 }}>{key}:</Text>
                                                    <Tag color="default" style={{ fontSize: 11, margin: 0 }}>{value}</Tag>
                                                </div>
                                            )
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    ),
                });
            }
            setSelectedVersion('');
        }
    });

    const handleCleanup = () => {
        if (!selectedVersion) {
            return;
        }

        const modeDescriptions = {
            'all': 'all resources (including default)',
            'default-only': 'only default (system) resources',
            'non-default-only': 'only user-created resources (excluding default)'
        };

        confirm({
            title: 'Confirm Resource Cleanup',
            icon: <ExclamationCircleOutlined style={{ color: 'var(--color-danger)' }} />,
            width: 500,
            content: (
                <div>
                    <Alert
                        message="Warning: This action cannot be undone!"
                        description={
                            <>
                                <p>You are about to delete <Text strong>{modeDescriptions[cleanupMode]}</Text> from version <Tag color="blue">{selectedVersion}</Tag>.</p>
                                <ul style={{ paddingLeft: 20, marginTop: 8, marginBottom: 0 }}>
                                    <li>Resources with active listeners will be protected</li>
                                    <li>Deleted resources cannot be recovered</li>
                                    <li>This operation requires owner or admin role</li>
                                </ul>
                            </>
                        }
                        type="warning"
                        showIcon
                        style={{ marginTop: 16 }}
                    />
                </div>
            ),
            okText: 'Yes, Delete Resources',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: () => {
                cleanupMutation.mutate({ version: selectedVersion, mode: cleanupMode });
            }
        });
    };

    // Get available versions from app config
    const availableVersions = window.APP_CONFIG?.AVAILABLE_VERSIONS || [];
    const versionOptions = availableVersions.map(version => ({
        label: version,
        value: version
    }));

    return (
        <div style={{ width: '100%', padding: '12px' }}>
                <div style={{ marginBottom: '24px' }}>
                    <Title level={3} style={{ margin: '0 0 8px 0', color: 'var(--text-primary)' }}>
                        Resource Cleanup
                    </Title>
                    <Text type="secondary">
                        Clean up resources by version to remove unused configurations.
                    </Text>
                </div>

                <Alert
                    message="Important Information"
                    description={
                        <ul style={{ paddingLeft: 20, marginBottom: 0 }}>
                            <li>Versions with active listeners cannot be cleaned up</li>
                            <li>Delete listeners first before cleaning up their version</li>
                            <li>Deleted resources cannot be recovered</li>
                        </ul>
                    }
                    type="info"
                    showIcon
                    icon={<WarningOutlined />}
                    style={{ marginBottom: 24 }}
                />

                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    {/* Version Selection */}
                    <div>
                        <Text strong style={{ display: 'block', marginBottom: 8 }}>
                            Select Version
                        </Text>
                        <Select
                            placeholder="Select a version to clean up"
                            style={{ width: 300 }}
                            value={selectedVersion || undefined}
                            onChange={setSelectedVersion}
                            options={versionOptions}
                            allowClear
                        />
                    </div>

                    {/* Cleanup Mode */}
                    <div>
                        <Text strong style={{ display: 'block', marginBottom: 8 }}>
                            Cleanup Mode
                        </Text>
                        <Radio.Group
                            value={cleanupMode}
                            onChange={(e) => setCleanupMode(e.target.value)}
                        >
                            <Space direction="vertical">
                                <Radio value="all">
                                    <Space>
                                        <Text strong>All Resources</Text>
                                        <Text type="secondary" style={{ fontSize: 12 }}>
                                            (Delete all resources including default/system resources)
                                        </Text>
                                    </Space>
                                </Radio>
                                <Radio value="default-only">
                                    <Space>
                                        <Text strong>Default Resources Only</Text>
                                        <Text type="secondary" style={{ fontSize: 12 }}>
                                            (Delete only default/system resources)
                                        </Text>
                                    </Space>
                                </Radio>
                                <Radio value="non-default-only">
                                    <Space>
                                        <Text strong>User Resources Only</Text>
                                        <Text type="secondary" style={{ fontSize: 12 }}>
                                            (Delete only user-created resources, keep defaults)
                                        </Text>
                                    </Space>
                                </Radio>
                            </Space>
                        </Radio.Group>
                    </div>

                    {/* Action Button */}
                    <div>
                        <ElchiButton
                            type="primary"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={handleCleanup}
                            disabled={!selectedVersion}
                            loading={cleanupMutation.isPending}
                        >
                            Clean Up Resources
                        </ElchiButton>
                    </div>
                </Space>
        </div>
    );
};

export default Cleanup;
