/**
 * GSLB Basic Info Form
 * Form fields: FQDN, TTL, Enabled
 */

import React from 'react';
import { Form, Input, Switch, InputNumber, Alert, Select, Tooltip, message } from 'antd';
import { CopyOutlined } from '@ant-design/icons';

export interface BasicInfoFormProps {
    isEditMode: boolean;
    zone?: string;
    disabled?: boolean;
    failoverZones?: string[]; // Available failover zones from settings
}

const BasicInfoForm: React.FC<BasicInfoFormProps> = ({ isEditMode, zone, disabled, failoverZones = [] }) => {
    const form = Form.useFormInstance();

    const handleCopyFQDN = () => {
        const fqdn = form.getFieldValue('fqdn');
        if (fqdn) {
            navigator.clipboard.writeText(fqdn).then(() => {
                message.success('CNAME copied to clipboard');
            }).catch(() => {
                message.error('Failed to copy CNAME');
            });
        }
    };

    return (
        <div
            style={{
                background: 'white',
                borderRadius: 12,
                border: '1px solid #e5e7eb',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                padding: '24px',
                marginBottom: 16,
            }}
        >
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 24 }}>DNS Information</div>
            <div>
                {/* FQDN */}
                <Form.Item
                    name="fqdn"
                    label="Fully Qualified Domain Name (FQDN) (CNAME Record)"
                    rules={[
                        { required: true, message: 'FQDN is required' }
                    ]}
                    extra={
                        isEditMode ? (
                            <Alert
                                message="FQDN cannot be changed after creation"
                                type="info"
                                showIcon
                                style={{ marginTop: 8 }}
                            />
                        ) : (
                            zone ? `e.g., api.${zone} or subdomain.${zone} (any format accepted)` : 'e.g., api.global.example.com or abc'
                        )
                    }
                >
                    <Input
                        placeholder={zone ? `api.${zone}` : 'api.global.example.com or abc'}
                        disabled={isEditMode || disabled}
                        suffix={
                            isEditMode && (
                                <Tooltip title="Copy CNAME">
                                    <CopyOutlined
                                        onClick={handleCopyFQDN}
                                        style={{ cursor: 'pointer', color: '#1890ff' }}
                                    />
                                </Tooltip>
                            )
                        }
                    />
                </Form.Item>

                {/* TTL, Failover Zone, and Enabled in same row */}
                <div style={{ display: 'flex', gap: 16 }}>
                    {/* TTL - Always editable */}
                    <Form.Item
                        name="ttl"
                        label="Time-to-Live (TTL)"
                        rules={[
                            { required: true, message: 'TTL is required' },
                            { type: 'number', min: 1, max: 86400, message: 'TTL must be between 1 and 86400 seconds' }
                        ]}
                        extra="DNS TTL in seconds (recommended: 30-300 for fast failover)"
                        style={{ flex: 1 }}
                    >
                        <InputNumber
                            min={1}
                            max={86400}
                            style={{ width: '100%' }}
                            placeholder="60"
                            addonAfter="seconds"
                        />
                    </Form.Item>

                    {/* Failover Zone - Always editable */}
                    {failoverZones.length > 0 && (
                        <Form.Item
                            name="failover_zone"
                            label="Failover Zone (Optional)"
                            extra={
                                <>
                                    Backup zone when all IPs are unhealthy.
                                </>
                            }
                            style={{ flex: 1 }}
                        >
                            <Select
                                placeholder="Select failover zone (optional)"
                                style={{ width: '100%' }}
                                allowClear
                                options={failoverZones.map((zone, index) => ({
                                    label: index === 0 ? `${zone} (Default)` : zone,
                                    value: zone
                                }))}
                            />
                        </Form.Item>
                    )}

                    {/* Enabled - Always editable */}
                    <Form.Item
                        name="enabled"
                        label="Enabled"
                        valuePropName="checked"
                        extra="Enable or disable this GSLB record"
                        style={{ flex: failoverZones.length > 0 ? 1 : 2 }}
                    >
                        <Switch />
                    </Form.Item>
                </div>
            </div>
        </div>
    );
};

export default BasicInfoForm;
