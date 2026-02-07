import React, { useEffect } from 'react';
import { Button, Form, Input, InputNumber, Select, Typography, Row, Col, Divider } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';

const { Title } = Typography;

interface AddBGPPrefixListCardProps {
    onCancel: () => void;
    onSave: (values: any) => void; //eslint-disable-line
    initialValues?: any;
    isEditing?: boolean;
}

const AddBGPPrefixListCard: React.FC<AddBGPPrefixListCardProps> = ({ 
    onCancel, 
    onSave, 
    initialValues, 
    isEditing = false 
}) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (initialValues && isEditing) {
            form.setFieldsValue(initialValues);
        }
    }, [initialValues, isEditing, form]);

    const handleFinish = (values: any) => {
        onSave(values);
        if (!isEditing) {
            form.resetFields();
        }
    };

    return (
        <div style={{
            width: '100%',
            background: 'var(--card-bg)',
            borderRadius: 14,
            padding: '20px',
            border: '1px solid var(--border-default)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 18 }}>
                <Title level={5} style={{ margin: 0 }}>
                    {isEditing ? 'Edit Prefix List' : 'Add Prefix List'}
                </Title>
            </div>
            <Divider style={{ marginBottom: 20, marginTop: -12 }} />
            
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
            >
                <Row gutter={16}>
                    <Col xs={24} sm={12} md={8}>
                        <Form.Item
                            name="name"
                            label="Prefix List Name"
                            rules={[
                                { required: true, message: 'Prefix list name is required' },
                                { pattern: /^[A-Z0-9_-]+$/, message: 'Use uppercase letters, numbers, underscore, hyphen only' }
                            ]}
                        >
                            <Input placeholder="PREFIX_LIST_1" disabled={isEditing} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Form.Item
                            name="sequence"
                            label="Sequence Number"
                            rules={[
                                { required: true, message: 'Sequence number is required' },
                                { type: 'number', min: 1, max: 65535, message: 'Must be between 1 and 65535' }
                            ]}
                        >
                            <InputNumber
                                style={{ width: '100%' }}
                                placeholder="10"
                                min={1}
                                max={65535}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Form.Item
                            name="action"
                            label="Action"
                            rules={[{ required: true, message: 'Action is required' }]}
                        >
                            <Select placeholder="Select action">
                                <Select.Option value="permit">Permit</Select.Option>
                                <Select.Option value="deny">Deny</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col xs={24}>
                        <Form.Item
                            name="prefix"
                            label="Network Prefix"
                            rules={[
                                { required: true, message: 'Network prefix is required' },
                                { pattern: /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}\/[0-9]{1,2}$/, message: 'Invalid CIDR format (e.g., 192.168.0.0/16)' }
                            ]}
                        >
                            <Input placeholder="192.168.0.0/16" />
                        </Form.Item>
                    </Col>
                </Row>

                <Divider orientation="left">Length Range (Optional)</Divider>
                
                <Row gutter={16}>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            name="ge"
                            label="Greater than or Equal (ge)"
                            extra="Minimum prefix length"
                        >
                            <InputNumber
                                style={{ width: '100%' }}
                                placeholder="24"
                                min={0}
                                max={32}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            name="le"
                            label="Less than or Equal (le)"
                            extra="Maximum prefix length"
                        >
                            <InputNumber
                                style={{ width: '100%' }}
                                placeholder="32"
                                min={0}
                                max={32}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <div style={{
                    background: 'var(--color-info-light)',
                    padding: '12px 16px',
                    borderRadius: 8,
                    marginBottom: 16,
                    border: '1px solid var(--color-info-border)'
                }}>
                    <div style={{ fontSize: 13, color: 'var(--color-info)', marginBottom: 4, fontWeight: 500 }}>
                        Examples:
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                        • <code>192.168.0.0/16</code> - Exact match<br/>
                        • <code>192.168.0.0/16 ge 24</code> - /16 network with /24 or longer prefixes<br/>
                        • <code>192.168.0.0/16 le 24</code> - /16 network with /24 or shorter prefixes<br/>
                        • <code>192.168.0.0/16 ge 20 le 28</code> - /16 network with /20 to /28 prefixes
                    </div>
                </div>

                <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        icon={<CheckOutlined />}
                        style={{
                            background: 'var(--gradient-primary)',
                            border: 'none',
                            fontWeight: 500,
                            boxShadow: 'var(--shadow-primary)',
                        }}
                    >
                        {isEditing ? 'Update Prefix List' : 'Add Prefix List'}
                    </Button>
                    <Button onClick={onCancel} icon={<CloseOutlined />}>
                        Cancel
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default AddBGPPrefixListCard; 