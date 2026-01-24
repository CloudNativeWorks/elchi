import React, { useEffect } from 'react';
import { Button, Form, Input, Select, Typography, Row, Col, Divider, InputNumber } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';

const { Title } = Typography;

interface AddBGPCommunityListCardProps {
    onCancel: () => void;
    onSave: (values: any) => void; //eslint-disable-line
    initialValues?: any;
    isEditing?: boolean;
}

const AddBGPCommunityListCard: React.FC<AddBGPCommunityListCardProps> = ({
    onCancel,
    onSave,
    initialValues,
    isEditing = false
}) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (initialValues && isEditing) {
            const formValues = {
                ...initialValues,
            };
            form.setFieldsValue(formValues);
        }
    }, [initialValues, isEditing, form]);

    const handleFinish = (values: any) => {
        const communityData = {
            ...values,
            community_values: values.community_values || '',
        };

        onSave(communityData);
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
                    {isEditing ? 'Edit Community List' : 'Add Community List'}
                </Title>
            </div>
            <Divider style={{ marginBottom: 20, marginTop: -12 }} />

            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
            >
                <Row gutter={16}>
                    <Col xs={24} sm={12} md={6}>
                        <Form.Item
                            name="name"
                            label="Community List Name"
                            rules={[
                                { required: true, message: 'Community list name is required' },
                                { pattern: /^[A-Z0-9_-]+$/, message: 'Use uppercase letters, numbers, underscore, hyphen only' }
                            ]}
                        >
                            <Input placeholder="COMM_LIST_1" disabled={isEditing} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
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
                    <Col xs={24} sm={12} md={6}>
                        <Form.Item
                            name="type"
                            label="Type"
                            rules={[{ required: true, message: 'Type is required' }]}
                        >
                            <Select placeholder="Select type">
                                <Select.Option value="standard">Standard</Select.Option>
                                <Select.Option value="expanded">Expanded</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
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
                            name="community_values"
                            label="Community Values"
                            rules={[{ required: true, message: 'At least one community is required' }]}
                            extra="Enter community_values separated by commas. Examples: 65001:100, 65001:200"
                        >
                            <Input.TextArea
                                placeholder="65001:100, 65001:200, 65001:300"
                                rows={3}
                            />
                        </Form.Item>
                    </Col>
                </Row>

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
                        {isEditing ? 'Update Community List' : 'Add Community List'}
                    </Button>
                    <Button onClick={onCancel} icon={<CloseOutlined />}>
                        Cancel
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default AddBGPCommunityListCard; 