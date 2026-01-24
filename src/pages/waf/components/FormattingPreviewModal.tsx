/**
 * Formatting Preview Modal Component
 * Shows before/after preview when auto-formatting directives
 */

import React from 'react';
import { Modal, Typography, Space, Alert } from 'antd'
import { WarningOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { FormatResult } from '../utils/directiveFormatter';

const { Text } = Typography;

export interface FormattingPreviewModalProps {
    visible: boolean;
    formatResult: FormatResult | null;
    onConfirm: () => void;
    onCancel: () => void;
}

const FormattingPreviewModal: React.FC<FormattingPreviewModalProps> = ({
    visible,
    formatResult,
    onConfirm,
    onCancel
}) => {
    if (!formatResult) return null;

    const hasChanges = formatResult.changes.length > 0;

    return (
        <Modal
            title={
                <Space>
                    <WarningOutlined style={{ color: 'var(--color-warning)' }} />
                    <span>Directive Auto-Formatting</span>
                </Space>
            }
            open={visible}
            onOk={onConfirm}
            onCancel={onCancel}
            okText="Apply & Add"
            cancelText="Cancel"
            width={800}
        >
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
                {hasChanges ? (
                    <>
                        <Alert
                            message="Your directive will be auto-formatted for JSON compatibility"
                            type="warning"
                            showIcon
                        />

                        <div>
                            <Text strong style={{ fontSize: 14 }}>Changes Applied:</Text>
                            <ul style={{ marginTop: 8, marginBottom: 0 }}>
                                {formatResult.changes.map((change, idx) => (
                                    <li key={idx}>
                                        <Text>{change}</Text>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <Text strong style={{ fontSize: 14, color: 'var(--color-danger)' }}>Before:</Text>
                            <pre style={{
                                background: 'var(--color-danger-bg)',
                                border: '1px solid var(--color-danger-border)',
                                padding: 12,
                                borderRadius: 4,
                                marginTop: 8,
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-word',
                                fontFamily: 'monospace',
                                fontSize: 12,
                                color: 'var(--text-primary)'
                            }}>
                                {formatResult.original}
                            </pre>
                        </div>

                        <div>
                            <Text strong style={{ fontSize: 14, color: 'var(--color-success)' }}>After:</Text>
                            <pre style={{
                                background: 'var(--color-success-light)',
                                border: '1px solid var(--color-success-border)',
                                padding: 12,
                                borderRadius: 4,
                                marginTop: 8,
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-word',
                                fontFamily: 'monospace',
                                fontSize: 12,
                                color: 'var(--text-primary)'
                            }}>
                                {formatResult.formatted}
                            </pre>
                        </div>
                    </>
                ) : (
                    <Alert
                        message="No formatting needed"
                        description="Your directive is already properly formatted"
                        type="success"
                        showIcon
                        icon={<CheckCircleOutlined />}
                    />
                )}
            </Space>
        </Modal>
    );
};

export default FormattingPreviewModal;
