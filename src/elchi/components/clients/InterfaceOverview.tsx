import React, { useState } from 'react';
import { Row, Col, Spin, Card, Button, Descriptions } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import UnifiedNetplanEditor from './UnifiedNetplanEditor';
import { EthernetIcon } from '@/assets/svg/icons';
import { InterfaceState } from '@/hooks/useNetworkOperations';

const InterfaceCard: React.FC<{ entry: InterfaceState }> = ({ entry }) => {
    const state = entry.state?.toLowerCase();
    const hasCarrier = entry.has_carrier;
    const stateColor = (state === 'up' && hasCarrier) ? '#52c41a' : 
                       (state === 'up' && !hasCarrier) ? '#faad14' : 
                       '#ff4d4f';

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
                    {entry.name}
                </div>
                <div style={{ fontSize: 14, color: '#595959' }}>
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

    return (
        <div>
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: 16 
            }}>
                <div>
                    <h3 style={{ margin: 0 }}>Network Interfaces</h3>
                    <p style={{ margin: 0, color: '#666', fontSize: 14 }}>
                        {interfaces.length} interface{interfaces.length !== 1 ? 's' : ''}
                    </p>
                </div>
                <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => setShowEditor(true)}
                    style={{
                        background: 'linear-gradient(90deg, #1677ff, #00c6fb)',
                        borderColor: '#1677ff'
                    }}
                >
                    Edit Network Configuration
                </Button>
            </div>


            <Row gutter={[16, 16]}>
                {interfaces.map((entry: InterfaceState, idx: number) => (
                    <Col key={idx} xs={24} sm={12} lg={8}>
                        <InterfaceCard entry={entry} />
                    </Col>
                ))}
            </Row>

            {interfaces.length === 0 && (
                <div style={{
                    textAlign: 'center',
                    padding: 40,
                    color: '#999'
                }}>
                    <p>No network interfaces found</p>
                </div>
            )}
        </div>
    );
};

export default InterfaceOverview;