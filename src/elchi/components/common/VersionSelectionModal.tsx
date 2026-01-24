import React from 'react';
import { Modal, List, Tag } from 'antd';
import { getVersionAntdColor } from '@/utils/versionColors';

interface VersionOption {
    version: string;
    id: string;
    created_at: string;
    updated_at: string;
}

interface VersionSelectionModalProps {
    visible: boolean;
    onClose: () => void;
    onSelect: (version: string, resourceId: string) => void;
    resourceName: string;
    versions: VersionOption[];
    title?: string;
    action?: 'open' | 'delete' | 'dependency' | 'routemap' | 'duplicate' | 'upgrade';
}

const VersionSelectionModal: React.FC<VersionSelectionModalProps> = ({
    visible,
    onClose,
    onSelect,
    resourceName,
    versions,
    title = 'Select Version',
    action = 'open'
}) => {
    return (
        <Modal
            title={<span style={{ color: 'var(--text-primary)' }}>{title}</span>}
            open={visible}
            onCancel={onClose}
            footer={null}
            width={500}
            styles={{
                header: {
                    background: 'transparent',
                    borderBottom: '1px solid var(--border-default)',
                    paddingBottom: 12
                },
                body: {
                    background: 'var(--card-bg)'
                },
                content: {
                    background: 'var(--card-bg)'
                }
            }}
        >
            <div style={{ marginBottom: 16 }}>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 16 }}>
                    Resource <b>{resourceName}</b> has multiple versions. Please select one:
                </p>
            </div>
            <List
                size="small"
                bordered
                dataSource={versions}
                renderItem={(item) => (
                    <List.Item
                        key={item.id}
                        style={{
                            cursor: 'pointer',
                            transition: 'background 0.2s',
                            background: 'var(--bg-surface)'
                        }}
                        onClick={() => onSelect(item.version, item.id)}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'var(--bg-hover)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'var(--bg-surface)';
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                            <Tag color={getVersionAntdColor(item.version)} style={{ fontSize: 13, padding: '4px 12px' }}>
                                {item.version}
                            </Tag>
                            {action !== 'upgrade' && (
                                <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
                                    Updated: {new Date(item.updated_at).toLocaleDateString()}
                                </div>
                            )}
                        </div>
                    </List.Item>
                )}
            />
        </Modal>
    );
};

export default VersionSelectionModal;
