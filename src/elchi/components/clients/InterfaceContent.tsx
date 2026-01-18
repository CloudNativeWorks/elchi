import React, { useState } from 'react';
import { Row, Col, Spin, Card, Button, Descriptions } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import NetplanInterfaceEditor from './NetplanInterfaceEditor';
import { EthernetIcon } from '@/assets/svg/icons';

const InterfaceCard: React.FC<{ entry: any; onEdit: () => void }> = ({ entry, onEdit }) => {
    // New network state structure - interface data is directly in entry
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
                overflow: 'visible',
                background: 'var(--card-bg)',
                border: '1px solid var(--border-default)'
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
                <Button
                    type="text"
                    icon={<EditOutlined style={{ color: 'var(--color-primary)', fontSize: 16 }} />}
                    onClick={onEdit}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 4,
                        border: '1px solid var(--border-default)',
                        borderRadius: 6,
                        background: 'var(--bg-surface)'
                    }}
                />
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
                <Descriptions.Item label="DHCP">
                    {entry.dhcp4 ? 'Enabled' : 'Disabled'}
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

interface InterfaceContentProps {
    interfaces: any[];
    loading: boolean;
    error: any;
    clientId: string;
    routingTables: { id: number; name: string; }[];
    onRefresh?: () => void;
}

const InterfaceContent: React.FC<InterfaceContentProps> = ({
    interfaces,
    loading,
    error,
    clientId,
    routingTables,
    onRefresh
}) => {
    const [editIndex, setEditIndex] = useState<number | null>(null);

    const handleEdit = (idx: number) => setEditIndex(idx);
    const handleCancel = () => setEditIndex(null);

    if (editIndex !== null) {
        return <NetplanInterfaceEditor
            interface={interfaces[editIndex]}
            allInterfaces={interfaces}
            routingTables={routingTables}
            onCancel={handleCancel}
            onSuccess={() => {
                setEditIndex(null);
                if (onRefresh) {
                    onRefresh();
                }
            }}
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

    return (
        <Row gutter={[16, 16]}>
            {interfaces.map((entry: any, idx: number) => (
                <Col key={idx} xs={24} sm={12} lg={8}>
                    <InterfaceCard
                        entry={entry}
                        onEdit={() => handleEdit(idx)}
                    />
                </Col>
            ))}
        </Row>
    );
};

export default InterfaceContent; 