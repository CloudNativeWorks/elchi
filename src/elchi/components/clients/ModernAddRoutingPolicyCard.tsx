import React, { useState } from 'react';
import { 
    Button, Input, Select, Card, Space, message, 
    Typography, Divider, Switch, InputNumber
} from 'antd';
import { CheckOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface ModernAddRoutingPolicyCardProps {
    interfaces: any[];
    routingTables: { id: number; name: string; }[];
    onCancel: () => void;
    onSave: (values: any) => void;
}

interface PolicyForm {
    from: string;
    to: string;
    table: string;
    priority: string;
    interface: string;
}

const ModernAddRoutingPolicyCard: React.FC<ModernAddRoutingPolicyCardProps> = ({ 
    interfaces,
    routingTables, 
    onCancel, 
    onSave 
}) => {
    const [isMultipleMode, setIsMultipleMode] = useState(false);
    const [policies, setPolicies] = useState<PolicyForm[]>([
        { from: '', to: '', table: '', priority: '100', interface: '' }
    ]);

    const handleAddPolicy = () => {
        setPolicies([...policies, { 
            from: '', to: '', table: '', priority: '100', interface: '' 
        }]);
    };

    const handleRemovePolicy = (index: number) => {
        if (policies.length > 1) {
            setPolicies(policies.filter((_, i) => i !== index));
        }
    };

    const handlePolicyChange = (index: number, field: keyof PolicyForm, value: string) => {
        const newPolicies = [...policies];
        newPolicies[index] = { ...newPolicies[index], [field]: value };
        setPolicies(newPolicies);
    };

    const handleModeChange = (checked: boolean) => {
        setIsMultipleMode(checked);
        if (!checked) {
            setPolicies([policies[0] || { 
                from: '', to: '', table: '', priority: '100', interface: '' 
            }]);
        }
    };

    const filteredTableOptions = routingTables
        .filter(t => t.id !== undefined)
        .map(table => ({
            label: `${table.name} (${table.id})`,
            value: table.id.toString()
        }));

    const interfaceOptions = interfaces.map(iface => ({
        label: iface.name,
        value: iface.name
    }));

    const handleFinish = () => {
        // Validate required fields
        for (const [index, policy] of policies.entries()) {
            if (!policy.table) {
                message.error('Routing table must be selected for all policies');
                return;
            }
            if (!policy.interface) {
                message.error(`Policy ${index + 1}: Interface must be selected`);
                return;
            }
        }

        const enrichedPolicies = policies.map(policy => ({
            ...policy,
            table: Number(policy.table),
            priority: policy.priority ? Number(policy.priority) : 32766
        }));

        onSave({ policies: enrichedPolicies });
    };

    const renderPolicyForm = (policy: PolicyForm, index: number) => (
        <Card 
            key={index}
            size="small"
            style={{ 
                marginBottom: isMultipleMode ? 16 : 0,
                border: '1px solid #f0f0f0',
                borderRadius: 8
            }}
            title={isMultipleMode ? (
                <Space>
                    <span>Policy {index + 1}</span>
                    {policies.length > 1 && (
                        <Button 
                            type="text" 
                            size="small"
                            danger
                            onClick={() => handleRemovePolicy(index)}
                        >
                            Remove
                        </Button>
                    )}
                </Space>
            ) : undefined}
        >
            {/* Routing Policy Configuration */}
            <div style={{ marginBottom: 16 }}>
                <Text strong style={{ fontSize: 13, color: '#666' }}>Routing Policy Configuration</Text>
            </div>
            
            {/* First row: 3 columns */}
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr 1fr', 
                gap: 16,
                marginBottom: 16
            }}>
                <div>
                    <div style={{ marginBottom: 8 }}>
                        <Text strong style={{ fontSize: 13, color: '#262626' }}>From (Optional)</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: 11 }}>Source network in CIDR format</Text>
                    </div>
                    <Input
                        placeholder="192.168.1.0/24 (optional)"
                        value={policy.from}
                        onChange={(e) => handlePolicyChange(index, 'from', e.target.value)}
                        style={{ borderRadius: 6 }}
                    />
                </div>

                <div>
                    <div style={{ marginBottom: 8 }}>
                        <Text strong style={{ fontSize: 13, color: '#262626' }}>To (Optional)</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: 11 }}>Destination network in CIDR format</Text>
                    </div>
                    <Input
                        placeholder="10.0.0.0/8 (optional)"
                        value={policy.to}
                        onChange={(e) => handlePolicyChange(index, 'to', e.target.value)}
                        style={{ borderRadius: 6 }}
                    />
                </div>

                <div>
                    <div style={{ marginBottom: 8 }}>
                        <Text strong style={{ fontSize: 13, color: '#262626' }}>
                            Table <span style={{ color: '#ff4d4f' }}>*</span>
                        </Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: 11 }}>Routing table for this policy</Text>
                    </div>
                    <Select
                        placeholder="Select table"
                        value={policy.table}
                        onChange={(value) => handlePolicyChange(index, 'table', value)}
                        options={filteredTableOptions}
                        style={{ width: '100%', borderRadius: 6 }}
                    />
                </div>
            </div>

            {/* Second row: Interface + Priority */}
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr 1fr', 
                gap: 16,
                marginBottom: 20
            }}>
                <div>
                    <div style={{ marginBottom: 8 }}>
                        <Text strong style={{ fontSize: 13, color: '#262626' }}>
                            Interface <span style={{ color: '#ff4d4f' }}>*</span>
                        </Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: 11 }}>Network interface for this policy</Text>
                    </div>
                    <Select
                        placeholder="Select interface"
                        value={policy.interface || undefined}
                        onChange={(value) => handlePolicyChange(index, 'interface', value || '')}
                        options={interfaceOptions}
                        style={{ width: '100%', borderRadius: 6 }}
                    />
                </div>

                <div>
                    <div style={{ marginBottom: 8 }}>
                        <Text strong style={{ fontSize: 13, color: '#262626' }}>Priority</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: 11 }}>Lower number = higher priority</Text>
                    </div>
                    <InputNumber
                        placeholder="100"
                        min={1}
                        max={32767}
                        value={policy.priority ? Number(policy.priority) : undefined}
                        onChange={(value) => handlePolicyChange(index, 'priority', value?.toString() || '')}
                        style={{ width: '100%', borderRadius: 6 }}
                    />
                </div>

                {/* Empty column for spacing */}
                <div></div>
            </div>
        </Card>
    );

    return (
        <Card
            style={{ 
                width: '100%', 
                borderRadius: 12,
                boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                border: 'none'
            }}
            styles={{ body: { padding: '24px' } }}
        >
            {/* Header */}
            <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                marginBottom: 20 
            }}>
                <div>
                    <Title level={4} style={{ margin: 0 }}>Add Routing Policy</Title>
                    <Text type="secondary" style={{ fontSize: 13 }}>
                        Configure policy-based routing rules
                    </Text>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Text style={{ fontSize: 13, color: '#666' }}>Multiple policies</Text>
                    <Switch 
                        checked={isMultipleMode}
                        onChange={handleModeChange}
                        size="small"
                    />
                </div>
            </div>

            <Divider style={{ margin: '0 0 24px 0' }} />

            {/* Policy Forms */}
            <div style={{ marginBottom: 24 }}>
                {policies.map((policy, index) => renderPolicyForm(policy, index))}
                
                {isMultipleMode && (
                    <Button
                        type="dashed"
                        icon={<PlusOutlined />}
                        onClick={handleAddPolicy}
                        style={{ 
                            width: '100%', 
                            height: 40,
                            borderRadius: 8,
                            borderColor: '#1677ff',
                            color: '#1677ff'
                        }}
                    >
                        Add Another Policy
                    </Button>
                )}
            </div>

            {/* Footer */}
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                borderTop: '1px solid #f0f0f0',
                paddingTop: 20
            }}>
                <div>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        💡 Policies route traffic to different tables based on source/destination
                    </Text>
                </div>
                <Space>
                    <Button 
                        onClick={onCancel}
                        icon={<CloseOutlined />}
                        style={{ borderRadius: 6 }}
                    >
                        Cancel
                    </Button>
                    <Button 
                        type="primary"
                        onClick={handleFinish}
                        icon={<CheckOutlined />}
                        style={{ 
                            borderRadius: 6,
                            background: 'linear-gradient(90deg, #1677ff, #00c6fb)'
                        }}
                    >
                        Add {policies.length > 1 ? `${policies.length} Policies` : 'Policy'}
                    </Button>
                </Space>
            </div>
        </Card>
    );
};

export default ModernAddRoutingPolicyCard;