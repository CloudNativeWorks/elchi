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
                    <WarningOutlined style={{ color: '#faad14' }} />
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
                            <Text strong style={{ fontSize: 14, color: '#ff4d4f' }}>Before:</Text>
                            <pre style={{
                                background: '#fff1f0',
                                border: '1px solid #ffccc7',
                                padding: 12,
                                borderRadius: 4,
                                marginTop: 8,
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-word',
                                fontFamily: 'monospace',
                                fontSize: 12
                            }}>
                                {formatResult.original}
                            </pre>
                        </div>

                        <div>
                            <Text strong style={{ fontSize: 14, color: '#52c41a' }}>After:</Text>
                            <pre style={{
                                background: '#f6ffed',
                                border: '1px solid #b7eb8f',
                                padding: 12,
                                borderRadius: 4,
                                marginTop: 8,
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-word',
                                fontFamily: 'monospace',
                                fontSize: 12
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
