import React, { useState } from 'react';
import { Modal, Select, Space, Typography, Checkbox, Alert, message, Tag } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import ElchiButton from './ElchiButton';
import { useCustomApiMutation } from '@/common/custom-api';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { confirm } = Modal;

interface ListenerUpgradeModalProps {
    visible: boolean;
    onClose: () => void;
    selectedListeners: string[];
    project: string;
    currentVersion: string;
    onSuccess?: () => void;
}

interface UpgradeOptions {
    auto_create_missing: boolean;
    validate_clients: boolean;
    update_bootstrap: boolean;
    dry_run: boolean;
}

interface UpgradePayload {
    resource_type: string;
    resource_names: string[];
    project: string;
    from_version: string;
    to_version: string;
    options: UpgradeOptions;
}

const ListenerUpgradeModal: React.FC<ListenerUpgradeModalProps> = ({
    visible,
    onClose,
    selectedListeners,
    project,
    currentVersion,
    onSuccess
}) => {
    const [targetVersion, setTargetVersion] = useState<string>('');
    const [options, setOptions] = useState<UpgradeOptions>({
        auto_create_missing: true,
        validate_clients: true, // Always true, not shown in UI
        update_bootstrap: true, // Always true, not shown in UI
        dry_run: false
    });

    const availableVersions = window.APP_CONFIG?.AVAILABLE_VERSIONS || [];

    // Filter versions higher than current
    const compareVersions = (v1: string, v2: string): number => {
        const parts1 = v1.split('.').map(Number);
        const parts2 = v2.split('.').map(Number);
        for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
            const num1 = parts1[i] || 0;
            const num2 = parts2[i] || 0;
            if (num1 > num2) return 1;
            if (num1 < num2) return -1;
        }
        return 0;
    };

    const higherVersions = availableVersions.filter(v => compareVersions(v, currentVersion) > 0);

    const upgradeMutation = useCustomApiMutation();
    const navigate = useNavigate();

    const handleClose = () => {
        setTargetVersion('');
        setOptions({
            auto_create_missing: true,
            validate_clients: true, // Always true
            update_bootstrap: true, // Always true
            dry_run: false
        });
        onClose();
    };

    const handleUpgrade = () => {
        if (!targetVersion) {
            message.warning('Please select a target version');
            return;
        }

        confirm({
            title: 'Confirm Listener Upgrade',
            icon: <ExclamationCircleFilled />,
            content: (
                <div>
                    <p style={{ marginBottom: 8, fontSize: 13 }}>
                        <strong>Upgrading {selectedListeners.length} listener(s)</strong> from <Tag className='auto-width-tag' color="blue" style={{ margin: '0 4px' }}>{currentVersion}</Tag> to <Tag className='auto-width-tag' color="green" style={{ margin: '0 4px' }}>{targetVersion}</Tag>
                    </p>
                    <div style={{
                        maxHeight: 150,
                        overflow: 'auto',
                        background: '#fafafa',
                        border: '1px solid #f0f0f0',
                        borderRadius: 6,
                        padding: 8,
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 4,
                        marginBottom: 12
                    }}>
                        {selectedListeners.map(name => (
                            <Tag className='auto-width-tag' key={name} style={{ margin: 0, fontSize: 11 }}>
                                {name}
                            </Tag>
                        ))}
                    </div>
                    {!options.dry_run && (
                        <Alert
                            message="Downtime Warning"
                            description="The above managed listeners will experience momentary downtime during version change. Are you sure you want to proceed?"
                            type="error"
                            showIcon
                            style={{ fontSize: 12, padding: '8px 12px', marginBottom: 8 }}
                        />
                    )}
                </div>
            ),
            okText: 'Yes, Upgrade',
            okType: 'danger',
            cancelText: 'Cancel',
            width: 480,
            onOk() {
                const payload: UpgradePayload = {
                    resource_type: 'listener',
                    resource_names: selectedListeners,
                    project: project,
                    from_version: currentVersion,
                    to_version: targetVersion,
                    options: options
                };

                upgradeMutation.mutate(
                    {
                        method: 'post',
                        path: 'api/v3/resource/upgrade',
                        data: payload
                    },
                    {
                        onSuccess: (data: any) => {
                            // Navigate to job detail page if job_object_id is returned
                            if (data?.job_object_id) {
                                navigate(`/jobs/${data.job_object_id}`);
                            }
                            
                            handleClose();
                            if (onSuccess) {
                                onSuccess();
                            }
                        }
                    }
                );
            }
        });
    };

    return (
        <Modal
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Title level={4} style={{ margin: 0 }}>
                        Upgrade Listeners
                    </Title>
                </div>
            }
            open={visible}
            onCancel={handleClose}
            width={500}
            footer={
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                    <ElchiButton key="cancel" onlyText onClick={handleClose}>
                        Cancel
                    </ElchiButton>
                    <ElchiButton
                        key="upgrade"
                        onlyText
                        onClick={handleUpgrade}
                        disabled={!targetVersion || upgradeMutation.isPending}
                    >
                        {upgradeMutation.isPending ? 'Upgrading...' : 'Upgrade'}
                    </ElchiButton>
                </div>
            }
        >
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
                {/* Selected Listeners Info */}
                <div>
                    <Text strong style={{ fontSize: 12, display: 'block', marginBottom: 6 }}>
                        Selected Listeners ({selectedListeners.length})
                    </Text>
                    <div style={{
                        background: '#fafafa',
                        border: '1px solid #f0f0f0',
                        borderRadius: 6,
                        padding: 8,
                        maxHeight: 120,
                        overflow: 'auto',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 4
                    }}>
                        {selectedListeners.map((name, idx) => (
                            <Tag className='auto-width-tag' key={idx} style={{ margin: 0, fontSize: 11 }}>
                                {name}
                            </Tag>
                        ))}
                    </div>
                </div>

                {/* Version Selection */}
                <div>
                    <Text strong style={{ fontSize: 12, display: 'block', marginBottom: 6 }}>
                        Target Version *
                    </Text>
                    <Select
                        placeholder="Select target version"
                        value={targetVersion || undefined}
                        onChange={setTargetVersion}
                        style={{ width: '100%' }}
                        size="middle"
                        options={higherVersions.map(v => ({
                            value: v,
                            label: `${v} ${v === higherVersions[higherVersions.length - 1] ? '(Latest)' : ''}`
                        }))}
                    />
                    {higherVersions.length === 0 && (
                        <Alert
                            message="No higher versions available"
                            description={`Current version ${currentVersion} is already the latest.`}
                            type="info"
                            showIcon
                            style={{ marginTop: 6, fontSize: 12 }}
                        />
                    )}
                </div>

                {/* Upgrade Options */}
                <div>
                    <Text strong style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>
                        Upgrade Options
                    </Text>
                    <Space direction="vertical" size={4} style={{ width: '100%' }}>
                        <Checkbox
                            checked={options.auto_create_missing}
                            onChange={(e) => setOptions({ ...options, auto_create_missing: e.target.checked })}
                        >
                            <Text style={{ fontSize: 12 }}>Auto-create missing resources</Text>
                        </Checkbox>
                        <Checkbox
                            checked={options.dry_run}
                            onChange={(e) => setOptions({ ...options, dry_run: e.target.checked })}
                        >
                            <Text style={{ fontSize: 12 }}>Dry run (preview changes only)</Text>
                        </Checkbox>
                    </Space>
                </div>

                {/* Info Alert */}
                <Alert
                    message={<span style={{ fontSize: 12 }}>Upgrade Information</span>}
                    description={
                        <ul style={{ margin: 0, paddingLeft: 16, fontSize: 11 }}>
                            <li>Current version: <strong>{currentVersion}</strong></li>
                            <li>Selected listeners will be upgraded to the target version</li>
                            <li>Dependencies and related resources will be updated automatically</li>
                            {options.dry_run && <li><strong>Dry run mode:</strong> No changes will be applied</li>}
                        </ul>
                    }
                    type="info"
                    showIcon
                    style={{ padding: '8px 12px' }}
                />
            </Space>
        </Modal>
    );
};

export default ListenerUpgradeModal;
