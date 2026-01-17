/**
 * GSLB Probe Configuration Component
 * Collapsible health check configuration
 */

import React, { useState, useEffect } from 'react';
import { Collapse, Form, Radio, InputNumber, Input, Switch, Space, Typography, Select } from 'antd';
import { GSLBProbe } from '../types';
import { PROBE_TYPES, PROBE_INTERVALS, DEFAULT_PROBE_VALUES } from '../constants';

const { Text } = Typography;

export interface ProbeConfigProps {
    probe?: GSLBProbe | null;
}

const ProbeConfig: React.FC<ProbeConfigProps> = ({ probe }) => {
    const form = Form.useFormInstance();
    const [probeEnabled, setProbeEnabled] = useState(!!probe);
    const [probeType, setProbeType] = useState<'http' | 'https' | 'tcp'>(probe?.type || 'https');
    const [activeKey, setActiveKey] = useState<string | string[]>(probe ? ['1'] : []);

    useEffect(() => {
        setProbeEnabled(!!probe);
        setProbeType(probe?.type || 'https');
        setActiveKey(probe ? ['1'] : []);
    }, [probe]);

    const handleProbeToggle = (checked: boolean) => {
        setProbeEnabled(checked);
        if (checked) {
            setActiveKey(['1']);
            // Set default values
            form.setFieldsValue({
                probe_type: DEFAULT_PROBE_VALUES.type,
                probe_port: DEFAULT_PROBE_VALUES.port,
                probe_path: DEFAULT_PROBE_VALUES.path,
                probe_interval: DEFAULT_PROBE_VALUES.interval,
                probe_timeout: DEFAULT_PROBE_VALUES.timeout,
                probe_warning_threshold: DEFAULT_PROBE_VALUES.warning_threshold,
                probe_critical_threshold: DEFAULT_PROBE_VALUES.critical_threshold,
                probe_passing_threshold: DEFAULT_PROBE_VALUES.passing_threshold,
            });
        } else {
            // Clear probe values
            form.setFieldsValue({
                probe_type: undefined,
                probe_port: undefined,
                probe_path: undefined,
                probe_host_header: undefined,
                probe_interval: undefined,
                probe_timeout: undefined,
                probe_enabled: undefined,
                probe_warning_threshold: undefined,
                probe_critical_threshold: undefined,
                probe_passing_threshold: undefined,
                probe_expected_status_codes: undefined,
                probe_follow_redirects: undefined,
                probe_skip_ssl_verify: undefined,
            });
        }
    };

    const handleTypeChange = (e: any) => {
        const type = e.target.value;
        setProbeType(type);

        // Update port default based on type
        if (type === 'https') {
            form.setFieldsValue({ probe_port: 443 });
        } else if (type === 'http') {
            form.setFieldsValue({ probe_port: 80 });
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
            <Space direction="vertical" style={{ width: '100%' }} size="large">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Space>
                        <Text style={{ fontSize: 16, fontWeight: 600 }}>Health Check Configuration</Text>
                        <Text type="secondary">(Optional)</Text>
                    </Space>
                    <Space size="middle">
                        <Switch
                            checked={probeEnabled}
                            onChange={handleProbeToggle}
                            checkedChildren="Enabled"
                            unCheckedChildren="Disabled"
                        />
                        {probeEnabled && (
                            <Form.Item shouldUpdate={(prevValues, currentValues) => prevValues.probe_enabled !== currentValues.probe_enabled} noStyle>
                                {({ getFieldValue }) => {
                                    const isProbeActive = getFieldValue('probe_enabled') !== false;
                                    return (
                                        <Form.Item
                                            name="probe_enabled"
                                            valuePropName="checked"
                                            initialValue={true}
                                            style={{ margin: 0 }}
                                            tooltip="Pause probe execution temporarily while keeping configuration"
                                        >
                                            <Switch
                                                checkedChildren="Active"
                                                unCheckedChildren="Paused"
                                                style={{
                                                    backgroundColor: !isProbeActive ? '#ff4d4f' : undefined
                                                }}
                                            />
                                        </Form.Item>
                                    );
                                }}
                            </Form.Item>
                        )}
                    </Space>
                </div>

                {probeEnabled && (
                    <Collapse
                        activeKey={activeKey}
                        onChange={setActiveKey}
                        bordered={false}
                        expandIconPosition="end"
                        style={{ background: '#fafafa' }}
                        items={[
                            {
                                key: '1',
                                label: 'Health Check Settings',
                                children: (
                                    <div>
                                        {/* Row 1: Type and Port */}
                                        <div style={{ display: 'flex', gap: 16 }}>
                                            <Form.Item
                                                name="probe_type"
                                                label="Probe Type"
                                                rules={[{ required: probeEnabled, message: 'Probe type is required' }]}
                                                style={{ flex: 1 }}
                                            >
                                                <Radio.Group
                                                    options={PROBE_TYPES}
                                                    optionType="button"
                                                    buttonStyle="solid"
                                                    onChange={handleTypeChange}
                                                />
                                            </Form.Item>

                                            <Form.Item
                                                name="probe_port"
                                                label="Port"
                                                rules={[
                                                    { required: probeEnabled, message: 'Port is required' },
                                                    { type: 'number', min: 1, max: 65535, message: 'Port must be between 1 and 65535' }
                                                ]}
                                                style={{ flex: 1 }}
                                            >
                                                <InputNumber
                                                    min={1}
                                                    max={65535}
                                                    style={{ width: '100%' }}
                                                    placeholder={probeType === 'https' ? '443' : probeType === 'http' ? '80' : '8080'}
                                                />
                                            </Form.Item>
                                        </div>

                                        {/* Row 2: Path and Host Header (for HTTP/HTTPS) */}
                                        {(probeType === 'http' || probeType === 'https') && (
                                            <>
                                                <div style={{ display: 'flex', gap: 16 }}>
                                                    <Form.Item
                                                        name="probe_path"
                                                        label="Path"
                                                        rules={[
                                                            { required: probeEnabled && (probeType === 'http' || probeType === 'https'), message: 'Path is required for HTTP/HTTPS probes' },
                                                            { pattern: /^\//, message: 'Path must start with /' }
                                                        ]}
                                                        style={{ flex: 1 }}
                                                    >
                                                        <Input placeholder="/health" />
                                                    </Form.Item>

                                                    <Form.Item
                                                        name="probe_host_header"
                                                        label="Host Header (Optional)"
                                                        style={{ flex: 1 }}
                                                    >
                                                        <Input placeholder="api.example.com" />
                                                    </Form.Item>
                                                </div>

                                                {/* Expected Status Codes */}
                                                <Form.Item
                                                    name="probe_expected_status_codes"
                                                    label="Expected Status Codes"
                                                    extra="Expected HTTP status codes for healthy response. Supports ranges (e.g., 200-299) and exact codes (e.g., 200, 301). Defaults to 200-399 if empty."
                                                    rules={[
                                                        {
                                                            validator: (_, value) => {
                                                                if (!value || value.length === 0) {
                                                                    return Promise.resolve();
                                                                }

                                                                for (const code of value) {
                                                                    // Check if it's a range (e.g., "200-299")
                                                                    if (code.includes('-')) {
                                                                        const parts = code.split('-');
                                                                        if (parts.length !== 2) {
                                                                            return Promise.reject(new Error(`Invalid format: ${code} (expected format: '200-299')`));
                                                                        }

                                                                        const start = parseInt(parts[0], 10);
                                                                        const end = parseInt(parts[1], 10);

                                                                        if (isNaN(start) || isNaN(end)) {
                                                                            return Promise.reject(new Error(`Invalid numbers in range: ${code}`));
                                                                        }

                                                                        if (start < 0 || start > 599) {
                                                                            return Promise.reject(new Error(`Start code must be between 0-599 (got ${start})`));
                                                                        }

                                                                        if (end < 0 || end > 599) {
                                                                            return Promise.reject(new Error(`End code must be between 0-599 (got ${end})`));
                                                                        }

                                                                        if (start >= end) {
                                                                            return Promise.reject(new Error(`Invalid range ${code}: start (${start}) must be less than end (${end})`));
                                                                        }
                                                                    } else {
                                                                        // Single code (e.g., "200")
                                                                        const num = parseInt(code, 10);
                                                                        if (isNaN(num)) {
                                                                            return Promise.reject(new Error(`Invalid status code: ${code}`));
                                                                        }

                                                                        if (num < 0 || num > 599) {
                                                                            return Promise.reject(new Error(`Status code must be between 0-599 (got ${num})`));
                                                                        }
                                                                    }
                                                                }

                                                                return Promise.resolve();
                                                            }
                                                        }
                                                    ]}
                                                >
                                                    <Select
                                                        mode="tags"
                                                        placeholder="e.g., 200-299, 301, 302"
                                                        style={{ width: '100%' }}
                                                        options={[
                                                            { label: '200-299 (Success)', value: '200-299' },
                                                            { label: '200-399 (Success + Redirect)', value: '200-399' },
                                                            { label: '300-399 (Redirect)', value: '300-399' },
                                                            { label: '400-599 (Errors)', value: '400-599' },
                                                            { label: '200 (OK)', value: '200' },
                                                            { label: '201 (Created)', value: '201' },
                                                            { label: '204 (No Content)', value: '204' },
                                                            { label: '301 (Moved Permanently)', value: '301' },
                                                            { label: '302 (Found)', value: '302' },
                                                        ]}
                                                    />
                                                </Form.Item>

                                                {/* Follow Redirects and Skip SSL Verify */}
                                                <div style={{ display: 'flex', gap: 16 }}>
                                                    <Form.Item
                                                        name="probe_follow_redirects"
                                                        label="Follow Redirects"
                                                        valuePropName="checked"
                                                        extra="Follow HTTP redirects (3xx status codes) during health checks"
                                                        initialValue={true}
                                                        style={{ flex: 1 }}
                                                    >
                                                        <Switch
                                                            checkedChildren="Yes"
                                                            unCheckedChildren="No"
                                                        />
                                                    </Form.Item>

                                                    {probeType === 'https' && (
                                                        <Form.Item
                                                            name="probe_skip_ssl_verify"
                                                            label="Skip SSL Verification"
                                                            valuePropName="checked"
                                                            extra="Skip SSL certificate verification (useful for self-signed certificates)"
                                                            initialValue={false}
                                                            style={{ flex: 1 }}
                                                        >
                                                            <Switch
                                                                checkedChildren="Yes"
                                                                unCheckedChildren="No"
                                                            />
                                                        </Form.Item>
                                                    )}
                                                </div>
                                            </>
                                        )}

                                        {/* Row 3: Interval and Timeout */}
                                        <div style={{ display: 'flex', gap: 16 }}>
                                            <Form.Item
                                                name="probe_interval"
                                                label="Interval (seconds)"
                                                rules={[{ required: probeEnabled, message: 'Interval is required' }]}
                                                style={{ flex: 1 }}
                                            >
                                                <Select
                                                    options={PROBE_INTERVALS}
                                                    placeholder="Select interval"
                                                />
                                            </Form.Item>

                                            <Form.Item
                                                name="probe_timeout"
                                                label="Timeout (seconds)"
                                                rules={[
                                                    { required: probeEnabled, message: 'Timeout is required' },
                                                    { type: 'number', min: 0.1, max: 3, message: 'Timeout must be between 0.1 and 3.0 seconds' },
                                                    {
                                                        validator: (_, value) => {
                                                            const interval = form.getFieldValue('probe_interval');
                                                            if (value && interval && value >= interval) {
                                                                return Promise.reject(new Error('Timeout must be less than interval'));
                                                            }
                                                            return Promise.resolve();
                                                        }
                                                    }
                                                ]}
                                                style={{ flex: 1 }}
                                            >
                                                <InputNumber
                                                    min={0.1}
                                                    max={3}
                                                    step={0.1}
                                                    precision={1}
                                                    style={{ width: '100%' }}
                                                    placeholder="0.5"
                                                    addonAfter="seconds"
                                                />
                                            </Form.Item>
                                        </div>

                                        {/* Row 4: Warning, Critical, and Passing Thresholds */}
                                        <div style={{ display: 'flex', gap: 16 }}>
                                            <Form.Item
                                                name="probe_passing_threshold"
                                                label="Passing Threshold"
                                                rules={[
                                                    { type: 'number', min: 1, max: 10, message: 'Threshold must be between 1 and 10' }
                                                ]}
                                                extra="Consecutive successes to recover (>1 enables anti-flapping)"
                                                style={{ flex: 1 }}
                                            >
                                                <InputNumber
                                                    min={1}
                                                    max={10}
                                                    style={{ width: '100%' }}
                                                    placeholder="1"
                                                />
                                            </Form.Item>

                                            <Form.Item
                                                name="probe_warning_threshold"
                                                label="Warning Threshold"
                                                rules={[
                                                    { required: probeEnabled, message: 'Warning threshold is required' },
                                                    { type: 'number', min: 1, max: 5, message: 'Threshold must be between 1 and 5' }
                                                ]}
                                                extra="Consecutive failures to enter warning state"
                                                style={{ flex: 1 }}
                                            >
                                                <InputNumber
                                                    min={1}
                                                    max={5}
                                                    style={{ width: '100%' }}
                                                    placeholder="1"
                                                />
                                            </Form.Item>

                                            <Form.Item
                                                name="probe_critical_threshold"
                                                label="Critical Threshold"
                                                rules={[
                                                    { required: probeEnabled, message: 'Critical threshold is required' },
                                                    { type: 'number', min: 1, max: 5, message: 'Threshold must be between 1 and 5' },
                                                    {
                                                        validator: (_, value) => {
                                                            const warningThreshold = form.getFieldValue('probe_warning_threshold');
                                                            if (value && warningThreshold && value <= warningThreshold) {
                                                                return Promise.reject(new Error('Critical threshold must be greater than warning threshold'));
                                                            }
                                                            return Promise.resolve();
                                                        }
                                                    }
                                                ]}
                                                extra="Consecutive failures to enter critical state"
                                                style={{ flex: 1 }}
                                            >
                                                <InputNumber
                                                    min={1}
                                                    max={5}
                                                    style={{ width: '100%' }}
                                                    placeholder="3"
                                                />
                                            </Form.Item>
                                        </div>
                                    </div>
                                )
                            }
                        ]}
                    />
                )}
            </Space>
        </div>
    );
};

export default ProbeConfig;
