import React, { useState } from 'react';
import {
    Space,
    Typography,
    Modal,
    Alert,
    Descriptions,
    Tag,
    Divider,
    Upload,
    Switch,
    Input
} from 'antd';
import {
    DownloadOutlined,
    UploadOutlined,
    ExclamationCircleOutlined,
    WarningOutlined,
    CheckCircleOutlined
} from '@ant-design/icons';
import { api } from '@/common/api';
import { useMutation } from '@tanstack/react-query';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import ElchiButton from '@/elchi/components/common/ElchiButton';
import type { UploadFile } from 'antd';

const { Text, Title } = Typography;
const { confirm } = Modal;
const { TextArea } = Input;

interface ImportResult {
    success: boolean;
    dry_run: boolean;
    summary: {
        total_resources: number;
        created: number;
        updated: number;
        skipped: number;
        failed: number;
    };
    details: Record<string, {
        total: number;
        created: number;
        updated: number;
        skipped: number;
        failed: number;
        warnings?: string[];
    }>;
    errors: string[];
    imported_by?: string;
    imported_at?: string;
}

const Backup: React.FC = () => {
    const { project } = useProjectVariable();
    const [includeDefaults, setIncludeDefaults] = useState(false);
    const [description, setDescription] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [importPreview, setImportPreview] = useState<ImportResult | null>(null);

    // Export mutation
    const exportMutation = useMutation({
        mutationFn: async () => {
            const payload: any = {
                backup_type: 'project',
                project_id: project,
                include_defaults: includeDefaults,
                description: description || undefined
            };

            const response = await api.post('/api/v3/setting/maintenance/backup/export', payload);
            return response.data;
        },
        onSuccess: (data) => {
            // Download backup as JSON file
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            const filename = `backup-project-${data.metadata.backup_id}.json`;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            // Show success modal
            Modal.success({
                title: 'Backup Created Successfully',
                width: 600,
                content: (
                    <div>
                        <Alert
                            message={`Backup file downloaded: ${filename}`}
                            type="success"
                            showIcon
                            style={{ marginBottom: 16 }}
                        />
                        <Descriptions column={1} bordered size="small">
                            <Descriptions.Item label="Backup ID">{data.metadata.backup_id}</Descriptions.Item>
                            <Descriptions.Item label="Type">
                                <Tag color="blue">{data.metadata.backup_type}</Tag>
                            </Descriptions.Item>
                            {data.metadata.project_name && (
                                <Descriptions.Item label="Project">{data.metadata.project_name}</Descriptions.Item>
                            )}
                            <Descriptions.Item label="Total Resources">
                                <Text strong>{data.metadata.statistics.total_resources}</Text>
                            </Descriptions.Item>
                            <Descriptions.Item label="Size">
                                {(data.metadata.statistics.total_size_bytes / 1024 / 1024).toFixed(2)} MB
                            </Descriptions.Item>
                        </Descriptions>
                    </div>
                ),
            });

            // Reset form
            setDescription('');
        }
    });

    // Import dry-run mutation
    const importDryRunMutation = useMutation({
        mutationFn: async (backupData: any) => {
            const response = await api.post('/api/v3/setting/maintenance/backup/import', {
                backup_data: backupData,
                target_project: project,
                dry_run: true
            });
            return response.data as ImportResult;
        },
        onSuccess: (data) => {
            setImportPreview(data);

            Modal.info({
                title: 'Import Preview (Dry Run)',
                width: 700,
                content: (
                    <div>
                        <Alert
                            message="This is a preview. No changes will be made."
                            type="info"
                            showIcon
                            style={{ marginBottom: 16 }}
                        />
                        <Descriptions column={2} bordered size="small">
                            <Descriptions.Item label="Total Resources" span={2}>
                                <Text strong>{data.summary.total_resources}</Text>
                            </Descriptions.Item>
                            <Descriptions.Item label="Will Create">
                                <Tag color="success">{data.summary.created}</Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Will Update">
                                <Tag color="processing">{data.summary.updated}</Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Will Skip">
                                <Tag color="default">{data.summary.skipped}</Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Will Fail">
                                <Tag color={data.summary.failed > 0 ? 'error' : 'default'}>{data.summary.failed}</Tag>
                            </Descriptions.Item>
                        </Descriptions>

                        {data.summary.failed === 0 && (
                            <Alert
                                message="No conflicts detected. Ready to import."
                                type="success"
                                showIcon
                                icon={<CheckCircleOutlined />}
                                style={{ marginTop: 16 }}
                            />
                        )}

                        {data.errors.length > 0 && (
                            <>
                                <Divider style={{ margin: '12px 0' }} />
                                <Text type="secondary" style={{ fontSize: 12 }}>Errors:</Text>
                                <div style={{ marginTop: 8 }}>
                                    {data.errors.map((error, idx) => (
                                        <Alert
                                            key={idx}
                                            message={error}
                                            type="error"
                                            showIcon
                                            style={{ marginBottom: 8 }}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                ),
            });
        }
    });

    // Import execute mutation
    const importExecuteMutation = useMutation({
        mutationFn: async (backupData: any) => {
            const response = await api.post('/api/v3/setting/maintenance/backup/import', {
                backup_data: backupData,
                target_project: project,
                dry_run: false
            });
            return response.data as ImportResult;
        },
        onSuccess: (data) => {
            Modal.success({
                title: data.success ? 'Import Completed Successfully' : 'Import Completed with Errors',
                width: 800,
                content: (
                    <div>
                        <Alert
                            message={data.success ? 'All resources imported successfully' : 'Some resources failed to import'}
                            type={data.success ? 'success' : 'warning'}
                            showIcon
                            style={{ marginBottom: 16 }}
                        />

                        <Descriptions column={2} bordered size="small" style={{ marginBottom: 16 }}>
                            <Descriptions.Item label="Total Resources" span={2}>
                                <Text strong style={{ fontSize: 16 }}>{data.summary.total_resources}</Text>
                            </Descriptions.Item>
                            <Descriptions.Item label="Created">
                                <Tag color="success">{data.summary.created}</Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Updated">
                                <Tag color="processing">{data.summary.updated}</Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Skipped">
                                <Tag color="default">{data.summary.skipped}</Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Failed">
                                <Tag color={data.summary.failed > 0 ? 'error' : 'default'}>{data.summary.failed}</Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Imported By" span={2}>
                                <Text>{data.imported_by}</Text>
                            </Descriptions.Item>
                        </Descriptions>

                        <Divider style={{ margin: '12px 0' }} />
                        <Text strong style={{ fontSize: 13 }}>Resource Details:</Text>
                        <div style={{ marginTop: 12, maxHeight: 300, overflow: 'auto' }}>
                            <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid var(--border-default)' }}>
                                        <th style={{ textAlign: 'left', padding: '8px', fontWeight: 600 }}>Resource Type</th>
                                        <th style={{ textAlign: 'center', padding: '8px', fontWeight: 600 }}>Total</th>
                                        <th style={{ textAlign: 'center', padding: '8px', fontWeight: 600 }}>Created</th>
                                        <th style={{ textAlign: 'center', padding: '8px', fontWeight: 600 }}>Updated</th>
                                        <th style={{ textAlign: 'center', padding: '8px', fontWeight: 600 }}>Skipped</th>
                                        <th style={{ textAlign: 'center', padding: '8px', fontWeight: 600 }}>Failed</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(data.details).map(([resourceType, stats]: [string, any]) => (
                                        stats.total > 0 && (
                                            <tr key={resourceType} style={{ borderBottom: '1px solid var(--border-light)' }}>
                                                <td style={{ padding: '6px 8px' }}>
                                                    <Text style={{ fontSize: 12, textTransform: 'capitalize' }}>
                                                        {resourceType.replace(/_/g, ' ')}
                                                    </Text>
                                                </td>
                                                <td style={{ textAlign: 'center', padding: '6px 8px' }}>
                                                    <Text style={{ fontSize: 12, fontWeight: 500 }}>{stats.total}</Text>
                                                </td>
                                                <td style={{ textAlign: 'center', padding: '6px 8px' }}>
                                                    <Tag color={stats.created > 0 ? 'success' : 'default'} style={{ fontSize: 11, margin: 0 }}>
                                                        {stats.created}
                                                    </Tag>
                                                </td>
                                                <td style={{ textAlign: 'center', padding: '6px 8px' }}>
                                                    <Tag color={stats.updated > 0 ? 'processing' : 'default'} style={{ fontSize: 11, margin: 0 }}>
                                                        {stats.updated}
                                                    </Tag>
                                                </td>
                                                <td style={{ textAlign: 'center', padding: '6px 8px' }}>
                                                    <Tag color="default" style={{ fontSize: 11, margin: 0 }}>
                                                        {stats.skipped}
                                                    </Tag>
                                                </td>
                                                <td style={{ textAlign: 'center', padding: '6px 8px' }}>
                                                    <Tag color={stats.failed > 0 ? 'error' : 'default'} style={{ fontSize: 11, margin: 0 }}>
                                                        {stats.failed}
                                                    </Tag>
                                                </td>
                                            </tr>
                                        )
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {data.errors && data.errors.length > 0 && (
                            <>
                                <Divider style={{ margin: '12px 0' }} />
                                <Text type="secondary" style={{ fontSize: 12 }}>Errors:</Text>
                                <div style={{ marginTop: 8, maxHeight: 150, overflow: 'auto' }}>
                                    {data.errors.map((error, idx) => (
                                        <div key={idx} style={{ marginBottom: 4 }}>
                                            <Text type="danger" style={{ fontSize: 12 }}>• {error}</Text>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                ),
            });

            // Reset form
            setFileList([]);
            setImportPreview(null);
        }
    });

    const handleExport = () => {
        confirm({
            title: 'Confirm Backup Export',
            icon: <ExclamationCircleOutlined style={{ color: 'var(--color-primary)' }} />,
            width: 500,
            content: (
                <div>
                    <p>You are about to create a backup of <Text strong>project "{project}"</Text>.</p>
                    <ul style={{ paddingLeft: 20, marginTop: 8, marginBottom: 0 }}>
                        <li>Backup will include all selected resources</li>
                        <li>Backup contains sensitive data - store securely</li>
                    </ul>
                </div>
            ),
            okText: 'Create Backup',
            cancelText: 'Cancel',
            onOk: () => {
                exportMutation.mutate();
            }
        });
    };

    const handleFileUpload = async (file: File) => {
        try {
            const text = await file.text();
            const backupData = JSON.parse(text);

            // Validate basic structure
            if (!backupData.metadata || !backupData.metadata.backup_id) {
                Modal.error({
                    title: 'Invalid Backup File',
                    content: 'The selected file is not a valid backup file.',
                });
                return false;
            }

            // Auto-run dry-run preview
            importDryRunMutation.mutate(backupData);

            return false; // Prevent upload
        } catch (error) {
            Modal.error({
                title: 'File Read Error',
                content: 'Failed to read backup file. Please ensure it is a valid JSON file.',
            });
            return false;
        }
    };

    const handleImportExecute = async () => {
        if (fileList.length === 0) return;

        const file = fileList[0].originFileObj;
        if (!file) return;

        confirm({
            title: 'Confirm Import',
            icon: <ExclamationCircleOutlined style={{ color: 'var(--color-danger)' }} />,
            width: 500,
            content: (
                <div>
                    <Alert
                        message="Warning: This action will overwrite existing data!"
                        type="warning"
                        showIcon
                        style={{ marginTop: 16 }}
                    />
                </div>
            ),
            okText: 'Yes, Import Now',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: async () => {
                const text = await file.text();
                const backupData = JSON.parse(text);
                importExecuteMutation.mutate(backupData);
            }
        });
    };

    return (
        <div style={{ width: '100%', padding: '12px' }}>
            <div style={{ marginBottom: '32px' }}>
                <Title level={3} style={{ margin: '0 0 8px 0', color: 'var(--text-primary)' }}>
                    Backup & Restore
                </Title>
                <Text type="secondary">
                    Project base Export and import MongoDB collections for disaster recovery, migration, and backup purposes.
                </Text>
            </div>

            {/* Export Section */}
            <div style={{ marginBottom: 48 }}>
                <Title level={4} style={{ margin: '0 0 16px 0', fontSize: 16 }}>
                    <DownloadOutlined style={{ marginRight: 8 }} />
                    Export Backup
                </Title>

                <Alert
                    message="Security Notice"
                    description="Backup files contain sensitive data including API tokens, cloud credentials, and LDAP passwords. Store backup files securely using encrypted storage."
                    type="warning"
                    showIcon
                    icon={<WarningOutlined />}
                    style={{ marginBottom: 24 }}
                />

                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    {/* Include Defaults */}
                    <div>
                        <Space>
                            <Switch
                                checked={includeDefaults}
                                onChange={setIncludeDefaults}
                            />
                            <div>
                                <Text strong>Include Default Resources</Text>
                                <div>
                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                        Include system/default resources in the backup
                                    </Text>
                                </div>
                            </div>
                        </Space>
                    </div>

                    {/* Description */}
                    <div>
                        <Text strong style={{ display: 'block', marginBottom: 8 }}>
                            Description (Optional)
                        </Text>
                        <TextArea
                            placeholder="e.g., Pre-upgrade backup - November 2025"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={2}
                            maxLength={200}
                            showCount
                            style={{ width: '100%', maxWidth: 500 }}
                        />
                    </div>

                    {/* Export Button */}
                    <div>
                        <ElchiButton
                            type="primary"
                            icon={<DownloadOutlined />}
                            onClick={handleExport}
                            loading={exportMutation.isPending}
                        >
                            Create & Download Backup
                        </ElchiButton>
                    </div>
                </Space>
            </div>

            <Divider />

            {/* Import Section */}
            <div>
                <Title level={4} style={{ margin: '0 0 16px 0', fontSize: 16 }}>
                    <UploadOutlined style={{ marginRight: 8 }} />
                    Import Backup
                </Title>

                <Alert
                    message="Important Information"
                    description={
                        <ul style={{ paddingLeft: 20, marginBottom: 0 }}>
                            <li>Import always overwrites existing data with matching IDs</li>
                            <li>Backup file will be validated and previewed before import</li>
                            <li>Resources cannot be recovered after import</li>
                            <li>Only owner and admin roles can perform imports</li>
                        </ul>
                    }
                    type="info"
                    showIcon
                    style={{ marginBottom: 24 }}
                />

                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    {/* File Upload */}
                    <div>
                        <Text strong style={{ display: 'block', marginBottom: 8 }}>
                            Select Backup File
                        </Text>
                        <Upload
                            fileList={fileList}
                            onChange={({ fileList }) => setFileList(fileList)}
                            beforeUpload={handleFileUpload}
                            accept=".json"
                            maxCount={1}
                        >
                            <ElchiButton icon={<UploadOutlined />}>
                                Select Backup File
                            </ElchiButton>
                        </Upload>
                        {fileList.length > 0 && (
                            <Text type="secondary" style={{ display: 'block', marginTop: 8, fontSize: 12 }}>
                                File will be validated automatically when selected
                            </Text>
                        )}
                    </div>

                    {/* Import Button */}
                    {importPreview && importPreview.summary.failed === 0 && (
                        <div>
                            <ElchiButton
                                type="primary"
                                danger
                                icon={<UploadOutlined />}
                                onClick={handleImportExecute}
                                disabled={fileList.length === 0}
                                loading={importExecuteMutation.isPending}
                            >
                                Import Backup
                            </ElchiButton>
                        </div>
                    )}
                </Space>
            </div>
        </div>
    );
};

export default Backup;
