import React, { useState } from 'react';
import { Row, Col, Spin, Card, Button, Descriptions } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import EditInterfaceCard from './EditInterfaceCard';
import { EthernetIcon } from '@/assets/svg/icons';

const InterfaceCard: React.FC<{ entry: any; onEdit: () => void }> = ({ entry, onEdit }) => {
    const state = entry.interface.state?.toLowerCase();
    const stateColor = state === 'up' ? '#52c41a' : state === 'down' ? '#ff4d4f' : '#bfbfbf';

    return (
        <Card
            size="small"
            style={{
                borderRadius: 12,
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
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
                    boxShadow: state === 'up' ? '0 0 6px #52c41a' : 'none',
                    animation: state === 'up' ? 'pulse 1.2s infinite' : 'none'
                }} />
                <Button
                    type="text"
                    icon={<EditOutlined style={{ color: '#1677ff', fontSize: 16 }} />}
                    onClick={onEdit}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 4,
                        border: '1px solid #e6e6e6',
                        borderRadius: 6
                    }}
                />
            </div>

            <div style={{ marginBottom: 16 }}>
                <div style={{ 
                    fontSize: 16, 
                    fontWeight: 600, 
                    color: '#1f1f1f', 
                    marginBottom: 4,
                    display: 'flex',
                    alignItems: 'center'
                }}>
                    <span style={{ marginRight: 4, display: 'flex', alignItems: 'center' }}>
                        <EthernetIcon />
                    </span>
                    {entry.ifname}
                </div>
                <div style={{ fontSize: 14, color: '#595959' }}>
                    {entry.interface.addresses?.[0] || '-'}
                </div>
            </div>

            <Descriptions size="small" column={1} style={{ fontSize: 13 }}>
                <Descriptions.Item label="DHCP">
                    {entry.interface.dhcp4 ? 'Enabled' : 'Disabled'}
                </Descriptions.Item>
                {entry.interface.addresses?.length > 1 && (
                    <Descriptions.Item label="Additional IPs">
                        {entry.interface.addresses.slice(1).join(', ')}
                    </Descriptions.Item>
                )}
                <Descriptions.Item label="MTU">
                    {entry.interface.mtu || '-'}
                </Descriptions.Item>
                <Descriptions.Item label="Table">
                    {entry.table || '-'}
                </Descriptions.Item>
            </Descriptions>
        </Card>
    );
};

interface InterfaceContentProps {
    interfaces: any[];
    loading: boolean;
    error: any;
    clientId: string;
    routingTables: { name: string; table: number; }[];
}

const InterfaceContent: React.FC<InterfaceContentProps> = ({
    interfaces,
    loading,
    error,
    clientId,
    routingTables
}) => {
    const [editIndex, setEditIndex] = useState<number | null>(null);

    const handleEdit = (idx: number) => setEditIndex(idx);
    const handleCancel = () => setEditIndex(null);

    if (editIndex !== null) {
        return <EditInterfaceCard
            entry={interfaces[editIndex]}
            onCancel={handleCancel}
            setEditIndex={setEditIndex}
            clientId={clientId}
            routingTables={routingTables}
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