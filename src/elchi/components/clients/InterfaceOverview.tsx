import React, { useState, useMemo } from 'react';
import { Row, Col, Spin, Card, Button, Descriptions, Table, Tag } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import UnifiedNetplanEditor from './UnifiedNetplanEditor';
import { EthernetIcon } from '@/assets/svg/icons';
import { InterfaceState } from '@/hooks/useNetworkOperations';

const InterfaceCard: React.FC<{ entry: InterfaceState }> = ({ entry }) => {
    const state = entry.state?.toLowerCase();
    const hasCarrier = entry.has_carrier;
    const stateColor = (state === 'up' && hasCarrier) ? 'var(--color-success)' :
        (state === 'up' && !hasCarrier) ? 'var(--color-warning)' :
            'var(--color-danger)';

    return (
        <Card
            size="small"
            style={{
                borderRadius: 12,
                boxShadow: 'var(--shadow-sm)',
                height: '100%',
                position: 'relative',
                overflow: 'visible'
            }}
            styles={{ body: { padding: '16px' } }}
        >
            <div style={{
                position: 'absolute',
                top: 12,
                right: 12,
                display: 'flex',
                gap: 8,
                alignItems: 'center'
            }}>
                <div style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: stateColor,
                    boxShadow: state === 'up' ? '0 0 6px var(--color-success)' : 'none',
                    animation: state === 'up' ? 'pulse 1.2s infinite' : 'none'
                }} />
            </div>

            <div style={{ marginBottom: 16 }}>
                <div style={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    marginBottom: 4,
                    display: 'flex',
                    alignItems: 'center'
                }}>
                    <span style={{ marginRight: 4, display: 'flex', alignItems: 'center' }}>
                        <EthernetIcon />
                    </span>
                    {entry.name}
                </div>
                <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
                    {entry.addresses?.[0] || '-'}
                </div>
            </div>

            <Descriptions size="small" column={1} style={{ fontSize: 13 }}>
                <Descriptions.Item label="State">
                    <span style={{ color: stateColor, fontWeight: 500 }}>
                        {state || 'unknown'} {hasCarrier === false && state === 'up' ? '(No Carrier)' : ''}
                    </span>
                </Descriptions.Item>
                {entry.addresses?.length > 1 && (
                    <Descriptions.Item label="Additional IPs">
                        {entry.addresses.slice(1).join(', ')}
                    </Descriptions.Item>
                )}
                <Descriptions.Item label="MTU">
                    {entry.mtu || '-'}
                </Descriptions.Item>
                {entry.mac_address && (
                    <Descriptions.Item label="MAC Address">
                        <span style={{ fontFamily: 'monospace', fontSize: 12 }}>
                            {entry.mac_address}
                        </span>
                    </Descriptions.Item>
                )}
            </Descriptions>
        </Card>
    );
};

interface InterfaceOverviewProps {
    interfaces: InterfaceState[];
    loading: boolean;
    error: any;
    clientId: string;
    currentNetplanYaml?: string;
    onRefresh?: () => void;
}

const InterfaceOverview: React.FC<InterfaceOverviewProps> = ({
    interfaces,
    loading,
    error,
    clientId,
    currentNetplanYaml,
    onRefresh
}) => {
    const [showEditor, setShowEditor] = useState(false);

    const { regularInterfaces, serviceInterfaces } = useMemo(() => {
        const regular: InterfaceState[] = [];
        const service: InterfaceState[] = [];

        interfaces.forEach(iface => {
            if (iface.name === 'lo') {
                // Skip loopback interface
                return;
            } else if (iface.name.startsWith('elchi-if-')) {
                service.push(iface);
            } else {
                regular.push(iface);
            }
        });

        return { regularInterfaces: regular, serviceInterfaces: service };
    }, [interfaces]);

    const handleCancel = () => setShowEditor(false);
    const handleSuccess = () => {
        setShowEditor(false);
        if (onRefresh) {
            onRefresh();
        }
    };

    if (showEditor) {
        return <UnifiedNetplanEditor
            currentYaml={currentNetplanYaml}
            interfaces={interfaces}
            onCancel={handleCancel}
            onSuccess={handleSuccess}
            clientId={clientId}
        />;
    }

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: 200
            }}>
                <Spin size="large" />
            </div>
        );
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    const serviceInterfaceColumns = [
        {
            title: 'Interface Name',
            dataIndex: 'name',
            key: 'name',
            render: (name: string) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <EthernetIcon />
                    <span style={{ fontFamily: 'monospace', fontWeight: 500 }}>{name}</span>
                </div>
            ),
        },
        {
            title: 'State',
            dataIndex: 'state',
            key: 'state',
            render: (state: string, record: InterfaceState) => {
                const stateColor = (state?.toLowerCase() === 'up' && record.has_carrier) ? 'green' :
                    (state?.toLowerCase() === 'up' && !record.has_carrier) ? 'orange' :
                        'red';
                return (
                    <Tag color={stateColor}>
                        {state?.toUpperCase() || 'UNKNOWN'}
                        {state?.toLowerCase() === 'up' && !record.has_carrier && ' (No Carrier)'}
                    </Tag>
                );
            },
        },
        {
            title: 'IP Addresses',
            dataIndex: 'addresses',
            key: 'addresses',
            render: (addresses: string[]) => (
                <div>
                    {addresses?.map((addr, idx) => (
                        <Tag key={idx} style={{ marginBottom: 4, fontFamily: 'monospace', fontSize: 11 }}>
                            {addr}
                        </Tag>
                    ))}
                </div>
            ),
        },
        {
            title: 'MTU',
            dataIndex: 'mtu',
            key: 'mtu',
            render: (mtu: number) => mtu || '-',
        },
        {
            title: 'MAC Address',
            dataIndex: 'mac_address',
            key: 'mac_address',
            render: (mac: string) => (
                <span style={{ fontFamily: 'monospace', fontSize: 11 }}>
                    {mac || '-'}
                </span>
            ),
        },
    ];

    return (
        <div>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 16
            }}>
                <div>
                    <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>Network Interfaces</h3>
                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 14 }}>
                        {regularInterfaces.length} regular interface{regularInterfaces.length !== 1 ? 's' : ''}
                        {serviceInterfaces.length > 0 && `, ${serviceInterfaces.length} service interface${serviceInterfaces.length !== 1 ? 's' : ''}`}
                    </p>
                </div>
                <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => setShowEditor(true)}
                    style={{
                        background: 'var(--gradient-primary)',
                        borderColor: 'var(--color-primary)'
                    }}
                >
                    Edit Network Configuration
                </Button>
            </div>

            {/* Regular Interfaces */}
            <Row gutter={[16, 16]}>
                {regularInterfaces.map((entry: InterfaceState, idx: number) => (
                    <Col key={idx} xs={24} sm={12} lg={8}>
                        <InterfaceCard entry={entry} />
                    </Col>
                ))}
            </Row>

            {regularInterfaces.length === 0 && serviceInterfaces.length === 0 && (
                <div style={{
                    textAlign: 'center',
                    padding: 40,
                    color: 'var(--text-tertiary)'
                }}>
                    <p>No network interfaces found</p>
                </div>
            )}

            {/* Service Interfaces Table */}
            {serviceInterfaces.length > 0 && (
                <div style={{ marginTop: 32 }}>
                    <div style={{ marginBottom: 16 }}>
                        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-primary)' }}>
                            Service Interfaces
                            <Tag color="blue">{serviceInterfaces.length}</Tag>
                        </h3>
                        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 14 }}>
                            Elchi-managed service interfaces
                        </p>
                    </div>
                    <Table
                        columns={serviceInterfaceColumns}
                        dataSource={serviceInterfaces}
                        rowKey="name"
                        pagination={false}
                        size="middle"
                        style={{
                            background: 'var(--card-bg)',
                            borderRadius: 12,
                            boxShadow: 'var(--shadow-sm)',
                            border: '1px solid var(--border-default)'
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default InterfaceOverview;