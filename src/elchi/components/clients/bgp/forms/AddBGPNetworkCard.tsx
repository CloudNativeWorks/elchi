import React from 'react';
import { Button, Form, Input, Typography, Row, Col, Switch, Divider, Select } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { BGPNetwork } from '@/hooks/useBGPOperations';

const { Title } = Typography;

interface AddBGPNetworkCardProps {
    onCancel: () => void;
    onSubmit: (values: BGPNetwork) => void; //eslint-disable-line
}

const AddBGPNetworkCard: React.FC<AddBGPNetworkCardProps> = ({ onCancel, onSubmit }) => {
    const [form] = Form.useForm();

    const handleFinish = (values: any) => {
        const networkData: BGPNetwork = {
            network: values.network,
            route_map: values.route_map,
            backdoor: values.backdoor || false
        };
        
        onSubmit(networkData);
        form.resetFields();
    };

    return (
        <div style={{
            width: '100%',
            background: 'var(--card-bg)',
            borderRadius: 14,
            padding: '20px',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--border-default)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 18 }}>
                <Title level={5} style={{ margin: 0 }}>Add BGP Network</Title>
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
                            name="network"
                            label="Network (CIDR)"
                            rules={[
                                { required: true, message: 'Network is required' },
                                { 
                                    pattern: /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}\/[0-9]{1,2}$/, 
                                    message: 'Invalid CIDR format (e.g., 192.168.1.0/24)' 
                                }
                            ]}
                        >
                            <Input placeholder="192.168.1.0/24" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Form.Item name="route_map" label="Route Map (Optional)">
                            <Select
                                placeholder="Select route map"
                                allowClear
                                options={[
                                    { label: 'EXPORT_MAP', value: 'EXPORT_MAP' },
                                    { label: 'IMPORT_MAP', value: 'IMPORT_MAP' },
                                    { label: 'LOCAL_MAP', value: 'LOCAL_MAP' },
                                ]}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Form.Item 
                            name="backdoor" 
                            valuePropName="checked" 
                            label="Backdoor"
                            style={{ marginTop: 30 }}
                        >
                            <Switch />
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
                        Add Network
                    </Button>
                    <Button onClick={onCancel} icon={<CloseOutlined />}>
                        Cancel
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default AddBGPNetworkCard; 