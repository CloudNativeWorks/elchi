import React, { useState } from 'react';
import { Button, Form, Input, Typography, Row, Col, Divider, Checkbox, message } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { useNetworkOperations } from '@/hooks/useNetworkOperations';

const { Title } = Typography;

interface EditInterfaceCardProps {
    entry: any;
    onCancel: () => void;
    setEditIndex: (index: number | null) => void;//eslint-disable-line
    clientId: string;
    routingTables: { id: number; name: string; }[];
}

const EditInterfaceCard: React.FC<EditInterfaceCardProps> = ({ 
    entry, 
    onCancel, 
    setEditIndex, 
    clientId, 
    routingTables 
}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { setInterfaceConfig } = useNetworkOperations();

    const calculateNetworkFromIP = (ipWithCidr: string) => {
        const [ip, cidr] = ipWithCidr.split('/');
        if (!ip || !cidr) return null;
        
        const cidrNum = parseInt(cidr);
        const ipParts = ip.split('.').map(Number);
        const mask = (0xffffffff << (32 - cidrNum)) >>> 0;
        
        const networkParts = ipParts.map((part, i) => {
            const shift = (3 - i) * 8;
            const maskPart = (mask >>> shift) & 0xff;
            return part & maskPart;
        });
        
        return `${networkParts.join('.')}/${cidr}`;
    };

    const getInterfaceTable = (ifname: string) => {
        const found = routingTables.find(t => t.name === ifname);
        return found ? found.table : 254; // default main table
    };

    const initialAddress = Array.isArray(entry.addresses)
        ? entry.addresses[0] || ''
        : (typeof entry.addresses === 'string' ? entry.addresses.split(',')[0]?.trim() || '' : '');

    const analyzeRoutes = () => {
        const routes = entry.routes || [];
        const interfaceTable = getInterfaceTable(entry.name);
        
        const interfaceDefaultRoute = routes.find((route: any) => 
            route.to === "0.0.0.0/0" && route.table === interfaceTable
        );
        
        // Gateway'i interface route'undan al
        const gateway = interfaceDefaultRoute?.via || '';
        
        // Main table (254)'te aynı gateway ile 0.0.0.0/0 route'unu bul
        const mainTableDefaultRoute = routes.find((route: any) => 
            route.to === "0.0.0.0/0" && 
            route.table === 254 && 
            route.via === gateway
        );
        
        return {
            gateway: gateway,
            isDefault: !!mainTableDefaultRoute && !!gateway
        };
    };

    const { gateway: initialGateway, isDefault: initialIsDefault } = analyzeRoutes();
    const [isDefaultGateway, setIsDefaultGateway] = useState(initialIsDefault);

    const handleFinish = async (values: any) => {
        if (!values.address) {
            message.error('IP address is required');
            return;
        }

        setLoading(true);
        try {
            const addresses = [values.address];
            const firstIP = values.address;
            const gateway = values.gateway;
            const interfaceTable = getInterfaceTable(entry.name);
            
            const networkSubnet = calculateNetworkFromIP(firstIP);
            if (!networkSubnet) {
                message.error('Invalid IP address format');
                return;
            }

            const routes = [];
            
            routes.push({
                to: networkSubnet,
                scope: "link",
                metric: 100
            });

            if (gateway) {
                routes.push({
                    to: "0.0.0.0/0",
                    via: gateway,
                    table: interfaceTable,
                    metric: 100
                });

                if (isDefaultGateway) {
                    routes.push({
                        to: "0.0.0.0/0",
                        via: gateway,
                        metric: 100,
                        table: 254
                    });
                }
            }

            const routingPolicies = [];
            if (interfaceTable !== 254) {
                const hostIP = firstIP;
                routingPolicies.push(
                    {
                        from: hostIP.replace(/\/\d+$/, '/32'),
                        table: interfaceTable
                    }
                );
            }

            const interfaceData = {
                ifname: entry.name,
                table: interfaceTable,
                interface: {
                    dhcp4: false,
                    addresses: addresses,
                    ...(values.mtu && { mtu: parseInt(values.mtu) })
                },
                ...(routes.length > 0 && { routes }),
                ...(routingPolicies.length > 0 && { routing_policies: routingPolicies })
            };

            await setInterfaceConfig(clientId, [interfaceData]);
            message.success('Interface configuration saved successfully');
            setEditIndex(null);
        } catch (error: any) {
            message.error('Failed to save interface configuration: ' + (error?.message || error));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ 
            width: '100%', 
            background: '#fff', 
            borderRadius: 14, 
            padding: '20px', 
            marginTop: 0, 
            marginLeft: 0, 
            minWidth: 0,
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 18 }}>
                <Title level={5} style={{ margin: 0 }}>Edit Interface: {entry.name}</Title>
            </div>
            <Divider style={{ marginBottom: 20, marginTop: -12 }} />
            
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    address: initialAddress,
                    mtu: entry.mtu || 1500,
                    gateway: initialGateway,
                    dhcp4: entry.dhcp4 || false
                }}
                onFinish={handleFinish}
            >
                <Row gutter={24}>
                    <Col xs={24} sm={24} md={14} lg={14} xl={14}>
                        <Form.Item
                            name="address"
                            label="IP Address with Subnet"
                            rules={[
                                { required: true, message: 'IP address is required' },
                                { pattern: /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}\/[0-9]{1,2}$/, message: 'Please enter valid IP/CIDR format (e.g., 192.168.1.2/24)' }
                            ]}
                            extra="IP address with subnet. Example: 192.168.1.2/24"
                        >
                            <Input
                                placeholder="192.168.1.2/24"
                                style={{ width: '100%' }}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={14} lg={14} xl={14}>
                        <Form.Item 
                            name="gateway" 
                            label="Gateway" 
                            extra="Gateway IP address. Example: 192.168.1.1"
                        >
                            <Input 
                                type="text" 
                                placeholder="192.168.1.1" 
                                style={{ width: '100%' }}
                                addonAfter={
                                    <Checkbox 
                                        checked={isDefaultGateway}
                                        onChange={(e) => setIsDefaultGateway(e.target.checked)}
                                    >
                                        Default
                                    </Checkbox>
                                }
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={14} lg={14} xl={14}>
                        <Form.Item 
                            name="mtu" 
                            label="MTU (Optional)" 
                            extra="Maximum Transmission Unit. Example: 1500" 
                            rules={[
                                {
                                    validator: (_, value) => {
                                        if (!value || (Number(value) >= 68 && Number(value) <= 9000)) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error("Value must be between 68 and 9000!"));
                                    }
                                }
                            ]}
                        >
                            <Input type="number" placeholder="1500" min={68} max={9000} />
                        </Form.Item>
                    </Col>
                </Row>
                
                <div style={{ display: 'flex', gap: 10, marginTop: 24, justifyContent: 'flex-start' }}>
                    <Button
                        htmlType="submit"
                        type="primary"
                        icon={<CheckOutlined />}
                        loading={loading}
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
                        Save Configuration
                    </Button>
                    <Button onClick={onCancel} icon={<CloseOutlined />} disabled={loading}>
                        Cancel
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default EditInterfaceCard; 