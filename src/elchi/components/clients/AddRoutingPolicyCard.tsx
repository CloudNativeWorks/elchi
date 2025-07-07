import React, { useState } from 'react';
import { Button, Form, Input, Typography, Row, Col, Select, Divider, Switch, Card } from 'antd';
import { CheckOutlined, CloseOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';

const { Title } = Typography;

interface AddRoutingPolicyCardProps {
    routingTables: { name: string; table: number; }[];
    onCancel: () => void;
    onSave: (values: any) => void; //eslint-disable-line
}

interface PolicyForm {
    from: string;
    to: string;
    table: string;
}

const AddRoutingPolicyCard: React.FC<AddRoutingPolicyCardProps> = ({ routingTables, onCancel, onSave }) => {
    const [isMultipleMode, setIsMultipleMode] = useState(false);
    const [policies, setPolicies] = useState<PolicyForm[]>([
        { from: '', to: '', table: '' }
    ]);

    const handleAddPolicy = () => {
        setPolicies([...policies, { from: '', to: '', table: '' }]);
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
            setPolicies([policies[0] || { from: '', to: '', table: '' }]);
        }
    };

    const filteredTableOptions = routingTables.filter(t => t.name !== 'main' && t.name !== 'default').map(table => ({
        label: `${table.table} (${table.name})`,
        value: table.table.toString()
    }));

    const handleFinish = () => {
        const enrichWithInterface = (policy: PolicyForm) => {
            const tableNum = Number(policy.table);
            const found = routingTables.find(t => t.table === tableNum);
            if (!found || found.name === 'main' || found.name === 'default') return null;
            return { ...policy, interface: found.name };
        };
        if (isMultipleMode) {
            const enriched = policies.map(enrichWithInterface).filter(Boolean);
            onSave({ policies: enriched });
        } else {
            const enriched = enrichWithInterface(policies[0]);
            onSave({ policies: enriched ? [enriched] : [] });
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                <Title level={5} style={{ margin: 0 }}>Add Routing Policy</Title>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 14, color: '#666' }}>Single</span>
                    <Switch 
                        checked={isMultipleMode}
                        onChange={handleModeChange}
                        size="small"
                    />
                    <span style={{ fontSize: 14, color: '#666' }}>Multiple</span>
                </div>
            </div>
            <Divider style={{ marginBottom: 20, marginTop: -12 }} />
            
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {policies.map((policy, index) => (
                    <Card
                        key={index}
                        size="small"
                        style={{ 
                            marginBottom: isMultipleMode ? 16 : 0,
                            border: isMultipleMode ? '1px solid #e6f7ff' : 'none',
                            boxShadow: isMultipleMode ? '0 1px 4px rgba(24,144,255,0.1)' : 'none'
                        }}
                        title={isMultipleMode ? `Policy ${index + 1}` : undefined}
                        extra={isMultipleMode && policies.length > 1 ? (
                            <Button 
                                type="text" 
                                size="small"
                                icon={<MinusOutlined />}
                                onClick={() => handleRemovePolicy(index)}
                                danger
                            />
                        ) : null}
                    >
                        <Row gutter={16}>
                            <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                                <Form.Item
                                    label="From (Optional)"
                                    style={{ marginBottom: 16 }}
                                    help="IP address must be in CIDR format (e.g., 192.168.1.0/24 or 23.232.1.2/32). Leave empty for 'any'."
                                >
                                    <Input
                                        placeholder="192.168.1.0/24 (optional)"
                                        value={policy.from}
                                        onChange={(e) => handlePolicyChange(index, 'from', e.target.value)}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                                <Form.Item
                                    label="To (Optional)"
                                    style={{ marginBottom: 16 }}
                                    help="IP address must be in CIDR format (e.g., 10.0.0.0/8 or 10.1.1.1/32). Leave empty for 'any'."
                                >
                                    <Input
                                        placeholder="10.0.0.0/8 (optional)"
                                        value={policy.to}
                                        onChange={(e) => handlePolicyChange(index, 'to', e.target.value)}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                                <Form.Item
                                    label="Table"
                                    required
                                    style={{ marginBottom: 16 }}
                                    help="Table must be selected and must be different from main and default tables."
                                >
                                    <Select
                                        placeholder="Select table"
                                        value={policy.table}
                                        onChange={(value) => handlePolicyChange(index, 'table', value)}
                                        options={filteredTableOptions}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>
                ))}
                
                {isMultipleMode && (
                    <Button
                        type="dashed"
                        onClick={handleAddPolicy}
                        icon={<PlusOutlined />}
                        style={{ 
                            width: '100%', 
                            marginBottom: 16,
                            borderStyle: 'dashed',
                            borderColor: '#1890ff',
                            color: '#1890ff'
                        }}
                    >
                        Add Another Policy
                    </Button>
                )}
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 24, justifyContent: 'flex-start' }}>
                <Button
                    type="primary"
                    icon={<CheckOutlined />}
                    onClick={handleFinish}
                    disabled={!policies.some(p => p.from && p.table)}
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
                    {isMultipleMode ? `Add ${policies.length} Policies` : 'Add Policy'}
                </Button>
                <Button onClick={onCancel} icon={<CloseOutlined />}>Cancel</Button>
            </div>
        </div>
    );
};

export default AddRoutingPolicyCard; 