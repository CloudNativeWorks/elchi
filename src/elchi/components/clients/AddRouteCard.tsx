import React, { useState } from 'react';
import { Button, Form, Input, Typography, Row, Col, Select, Divider, Switch, Card, Space } from 'antd';
import { CheckOutlined, CloseOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title } = Typography;

interface AddRouteCardProps {
    interfaces: any[];
    routingTables: { name: string; table: number; }[];
    onCancel: () => void;
    onSave: (values: any) => void; //eslint-disable-line
}

const AddRouteCard: React.FC<AddRouteCardProps> = ({ interfaces, routingTables, onCancel, onSave }) => {
    const [form] = Form.useForm();
    const [multipleMode, setMultipleMode] = useState(false);
    const [routes, setRoutes] = useState([{ id: 1 }]);

    const handleFinish = (values: any) => {
        if (multipleMode) {
            const routeList = routes.map((_, index) => ({
                to: values[`to_${index}`],
                via: values[`via_${index}`],
                interface: values[`interface_${index}`],
                table: values[`table_${index}`],
                metric: values[`metric_${index}`],
            })).filter(route => route.to && route.via && route.interface);
            
            onSave({ routes: routeList });
        } else {
            onSave(values);
        }
        form.resetFields();
    };

    const interfaceOptions = interfaces.map(iface => ({
        label: iface.ifname,
        value: iface.ifname
    }));

    const tableOptions = routingTables.map(table => ({
        label: `${table.table} (${table.name})`,
        value: table.table
    }));

    const addRoute = () => {
        setRoutes([...routes, { id: Date.now() }]);
    };

    const removeRoute = (index: number) => {
        if (routes.length > 1) {
            setRoutes(routes.filter((_, i) => i !== index));
        }
    };

    const renderRouteForm = (index: number) => (
        <Card 
            key={routes[index].id}
            size="small" 
            style={{ marginBottom: 16 }}
            title={multipleMode ? `Route ${index + 1}` : undefined}
            extra={multipleMode && routes.length > 1 ? (
                <Button 
                    type="text" 
                    danger 
                    icon={<DeleteOutlined />} 
                    onClick={() => removeRoute(index)}
                />
            ) : null}
        >
            <Row gutter={24}>
                <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                    <Form.Item
                        name={multipleMode ? `to_${index}` : 'to'}
                        label="Destination"
                        rules={[{ required: true, message: 'Destination is required' }]}
                        extra="Example: 192.168.1.0/24 or default"
                    >
                        <Input placeholder="192.168.1.0/24" />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                    <Form.Item
                        name={multipleMode ? `via_${index}` : 'via'}
                        label="Gateway"
                        rules={[{ required: true, message: 'Gateway is required' }]}
                        extra="Example: 192.168.1.1"
                    >
                        <Input placeholder="192.168.1.1" />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                    <Form.Item
                        name={multipleMode ? `interface_${index}` : 'interface'}
                        label="Interface"
                        rules={[{ required: true, message: 'Interface is required' }]}
                    >
                        <Select
                            placeholder="Select interface"
                            options={interfaceOptions}
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                    <Form.Item
                        name={multipleMode ? `table_${index}` : 'table'}
                        label="Table"
                        extra="Select routing table"
                    >
                        <Select
                            placeholder="Select table"
                            options={tableOptions}
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                    <Form.Item
                        name={multipleMode ? `metric_${index}` : 'metric'}
                        label="Metric (Optional)"
                        extra="Route priority"
                    >
                        <Input type="number" placeholder="100" min={0} max={4294967295} />
                    </Form.Item>
                </Col>
            </Row>
        </Card>
    );

    return (
        <div style={{ width: '100%', background: '#fff', borderRadius: 14, padding: '2px 2px 2px 2px', marginTop: 0, marginLeft: 0, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                <Title level={5} style={{ margin: 0 }}>Add New Route(s)</Title>
                <Space>
                    <span style={{ fontSize: 14, color: '#666' }}>Multiple Routes:</span>
                    <Switch 
                        checked={multipleMode}
                        onChange={setMultipleMode}
                        size="small"
                    />
                </Space>
            </div>
            <Divider style={{ marginBottom: 12, marginTop: -12 }} />
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
            >
                {routes.map((_, index) => renderRouteForm(index))}
                
                {multipleMode && (
                    <Button
                        type="dashed"
                        icon={<PlusOutlined />}
                        onClick={addRoute}
                        style={{ 
                            width: '100%', 
                            marginBottom: 24,
                            borderRadius: 8
                        }}
                    >
                        Add Another Route
                    </Button>
                )}

                <div style={{ display: 'flex', gap: 10, marginTop: 24, justifyContent: 'flex-start' }}>
                    <Button
                        htmlType="submit"
                        type="primary"
                        icon={<CheckOutlined />}
                        style={{
                            background: 'linear-gradient(90deg, #056ccd 0%, #00c6fb 100%)',
                            color: '#fff',
                            border: 'none',
                            fontWeight: 500,
                            boxShadow: '0 2px 8px rgba(0,198,251,0.10)',
                            transition: 'all 0.2s',
                        }}
                        className="modern-add-btn"
                    >
                        {multipleMode ? 'Add Routes' : 'Add Route'}
                    </Button>
                    <Button onClick={onCancel} icon={<CloseOutlined />}>Cancel</Button>
                </div>
            </Form>
        </div>
    );
};

export default AddRouteCard; 