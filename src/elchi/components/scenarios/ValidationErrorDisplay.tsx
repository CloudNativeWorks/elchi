import React from 'react';
import { Alert, Collapse, Typography, Space, Tag } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import type { ValidateScenarioResponse } from './hooks/useScenarioAPI';
import { parseFormattedValidationMessage, isFormattedValidationMessage } from './utils/parseValidationMessage';

const { Panel } = Collapse;
const { Text } = Typography;

interface ValidationErrorDisplayProps {
    validationResult?: ValidateScenarioResponse;
    errorMessage?: string; // For formatted messages from backend
    style?: React.CSSProperties;
}

const ValidationErrorDisplay: React.FC<ValidationErrorDisplayProps> = ({
    validationResult,
    errorMessage,
    style
}) => {
    // If we have a formatted error message, parse it first
    let parsedValidation: ValidateScenarioResponse | undefined = validationResult;

    if (errorMessage && isFormattedValidationMessage(errorMessage)) {
        const parsed = parseFormattedValidationMessage(errorMessage);
        if (parsed) {
            parsedValidation = parsed;
        }
    }

    if (!parsedValidation) {
        return null;
    }

    const { valid, errors, error_count, grouped_errors } = parsedValidation;

    if (valid || errors.length === 0) {
        return null;
    }

    // If we have grouped errors, use the enhanced display
    if (grouped_errors && Object.keys(grouped_errors).length > 0) {
        return (
            <Alert
                type="error"
                showIcon
                icon={<ExclamationCircleOutlined />}
                style={style}
                message={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Text strong style={{ fontSize: '14px' }}>
                            Validation Failed
                        </Text>
                        <Tag color="red" style={{ fontSize: '10px' }} className="auto-width-tag">
                            {error_count || errors.length} {(error_count || errors.length) === 1 ? 'Error' : 'Errors'}
                        </Tag>
                    </div>
                }
                description={
                    <div style={{ marginTop: '12px' }}>
                        <Collapse
                            ghost
                            size="small"
                            defaultActiveKey={Object.keys(grouped_errors)}
                            style={{
                                background: 'transparent',
                                border: 'none'
                            }}
                        >
                            {Object.entries(grouped_errors).map(([component, componentErrors]) => (
                                <Panel
                                    key={component}
                                    header={
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Text strong style={{ color: '#ff4d4f', fontSize: '13px' }}>
                                                {component === 'General' ? 'General Issues' : component}
                                            </Text>
                                            <Tag
                                                color="red"
                                                style={{ fontSize: '10px', minWidth: 'auto' }}
                                                className="auto-width-tag"
                                            >
                                                {componentErrors.length}
                                            </Tag>
                                        </div>
                                    }
                                    style={{
                                        background: 'rgba(255, 77, 79, 0.04)',
                                        border: '1px solid rgba(255, 77, 79, 0.15)',
                                        borderRadius: '6px',
                                        marginBottom: '8px'
                                    }}
                                >
                                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                                        {componentErrors.map((error, index) => (
                                            <div
                                                key={index}
                                                style={{
                                                    padding: '8px 12px',
                                                    background: 'rgba(255, 77, 79, 0.06)',
                                                    border: '1px solid rgba(255, 77, 79, 0.1)',
                                                    borderRadius: '4px',
                                                    fontSize: '12px',
                                                    lineHeight: '1.5'
                                                }}
                                            >
                                                <Text style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>
                                                    {index + 1}.
                                                </Text>{' '}
                                                <Text style={{ fontSize: '12px', color: 'var(--text-primary)' }}>
                                                    {error}
                                                </Text>
                                            </div>
                                        ))}
                                    </Space>
                                </Panel>
                            ))}
                        </Collapse>
                    </div>
                }
            />
        );
    }

    // Fallback to simple flat list display for backward compatibility
    return (
        <Alert
            type="error"
            showIcon
            icon={<ExclamationCircleOutlined />}
            style={style}
            message={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Text strong style={{ fontSize: '14px' }}>
                        Validation Failed
                    </Text>
                    <Tag color="red" style={{ fontSize: '10px' }} className="auto-width-tag">
                        {errors.length} {errors.length === 1 ? 'Error' : 'Errors'}
                    </Tag>
                </div>
            }
            description={
                <div style={{ marginTop: '8px' }}>
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                        {errors.map((error, index) => (
                            <div
                                key={index}
                                style={{
                                    padding: '8px 12px',
                                    background: 'rgba(255, 77, 79, 0.06)',
                                    border: '1px solid rgba(255, 77, 79, 0.1)',
                                    borderRadius: '4px',
                                    fontSize: '12px',
                                    lineHeight: '1.5'
                                }}
                            >
                                <Text style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>
                                    {index + 1}.
                                </Text>{' '}
                                <Text style={{ fontSize: '12px', color: 'var(--text-primary)' }}>
                                    {error}
                                </Text>
                            </div>
                        ))}
                    </Space>
                </div>
            }
        />
    );
};

export default ValidationErrorDisplay;