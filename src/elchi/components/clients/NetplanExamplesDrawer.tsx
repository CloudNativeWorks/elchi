import React, { useState } from 'react';
import { 
    Drawer, Card, Row, Col, Typography, Badge, Button, Space, Divider, Tag, message
} from 'antd';
import { CopyOutlined, BookOutlined } from '@ant-design/icons';
import MonacoEditor from '@monaco-editor/react';
import { NETPLAN_EXAMPLES, NetplanExample } from './netplanExamples';

const { Text, Title } = Typography;

interface NetplanExamplesDrawerProps {
    open: boolean;
    onClose: () => void;
    onSelectExample?: (yaml: string) => void;
}

const NetplanExamplesDrawer: React.FC<NetplanExamplesDrawerProps> = ({
    open,
    onClose,
    onSelectExample
}) => {
    const [selectedExample, setSelectedExample] = useState<NetplanExample | null>(null);

    const handleExampleSelect = (example: NetplanExample) => {
        setSelectedExample(example);
    };

    const handleUseExample = () => {
        if (selectedExample && onSelectExample) {
            onSelectExample(selectedExample.yaml);
            onClose();
        }
    };

    const getCategoryColor = (category: NetplanExample['category']) => {
        const colors = {
            'Basic': 'blue',
            'Advanced': 'purple',
            'Bonding': 'green',
            'VLAN': 'orange',
            'Bridge': 'cyan'
        };
        return colors[category] || 'default';
    };

    const getCategoryIcon = (category: NetplanExample['category']) => {
        const icons = {
            'Basic': '🔧',
            'Advanced': '⚙️',
            'Bonding': '🔗',
            'VLAN': '🏷️',
            'Bridge': '🌉'
        };
        return icons[category] || '📋';
    };

    return (
        <Drawer
            title={
                <Space>
                    <BookOutlined />
                    <span>Netplan Configuration Examples</span>
                </Space>
            }
            placement="right"
            size="large"
            open={open}
            onClose={onClose}
            styles={{
                body: { padding: '16px' }
            }}
        >
            <div>
                {/* Examples List */}
                <div style={{ marginBottom: 16 }}>
                    <Title level={5}>Choose an Example Configuration</Title>
                    <Text type="secondary">
                        Select from common netplan configurations below
                    </Text>
                </div>

                <Row gutter={[12, 12]}>
                    {NETPLAN_EXAMPLES.map((example) => (
                        <Col xs={24} sm={12} md={8} lg={6} key={example.id}>
                            <Card
                                size="small"
                                hoverable
                                onClick={() => handleExampleSelect(example)}
                                style={{
                                    cursor: 'pointer',
                                    border: selectedExample?.id === example.id 
                                        ? '2px solid #1677ff' 
                                        : '1px solid #d9d9d9',
                                    borderRadius: 8,
                                    transition: 'all 0.3s ease',
                                    height: 120
                                }}
                                styles={{
                                    body: { padding: '12px' }
                                }}
                            >
                                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                                        <div style={{ fontSize: 16 }}>
                                            {getCategoryIcon(example.category)}
                                        </div>
                                        <Tag 
                                            color={getCategoryColor(example.category)}
                                            style={{ fontSize: 10, padding: '0 4px', margin: 0 }}
                                        >
                                            {example.category}
                                        </Tag>
                                    </div>
                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                        <Text strong style={{ fontSize: 12, marginBottom: 4, lineHeight: 1.2 }}>
                                            {example.title}
                                        </Text>
                                        <Text 
                                            type="secondary" 
                                            style={{ 
                                                fontSize: 10,
                                                lineHeight: 1.3,
                                                display: '-webkit-box',
                                                WebkitLineClamp: 3,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden'
                                            }}
                                        >
                                            {example.description}
                                        </Text>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>

                {/* YAML Preview - Below Examples */}
                {selectedExample && (
                    <div style={{ marginTop: 24 }}>
                        <Divider />
                        <div style={{ marginBottom: 16 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                <div>
                                    <Title level={5} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <span>{getCategoryIcon(selectedExample.category)}</span>
                                        {selectedExample.title}
                                        <Badge 
                                            color={getCategoryColor(selectedExample.category)} 
                                            text={selectedExample.category}
                                            style={{ fontSize: 12 }}
                                        />
                                    </Title>
                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                        {selectedExample.description}
                                    </Text>
                                </div>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <Button 
                                        icon={<CopyOutlined />}
                                        onClick={() => {
                                            navigator.clipboard.writeText(selectedExample.yaml);
                                            message.success('YAML copied to clipboard');
                                        }}
                                    >
                                        Copy
                                    </Button>
                                    <Button 
                                        type="primary" 
                                        onClick={handleUseExample}
                                        style={{
                                            background: 'linear-gradient(90deg, #1677ff, #00c6fb)',
                                            borderColor: '#1677ff'
                                        }}
                                    >
                                        Use This Configuration
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div style={{ 
                            border: '1px solid #d9d9d9', 
                            borderRadius: 6,
                            overflow: 'hidden'
                        }}>
                            <MonacoEditor
                                height="350px"
                                language="yaml"
                                theme="light"
                                value={selectedExample.yaml}
                                options={{
                                    readOnly: true,
                                    minimap: { enabled: false },
                                    fontSize: 13,
                                    lineNumbers: 'on',
                                    scrollBeyondLastLine: false,
                                    automaticLayout: true,
                                    tabSize: 2,
                                    wordWrap: 'on',
                                    folding: true
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>

            {!selectedExample && (
                <div style={{ 
                    marginTop: 24, 
                    padding: 16, 
                    backgroundColor: '#f0f9ff', 
                    borderRadius: 8,
                    border: '1px solid #b3e5fc'
                }}>
                    <Text style={{ fontSize: 12, color: '#1976d2' }}>
                        💡 <strong>Tip:</strong> Click on any example card to preview its YAML configuration. 
                        You can then copy it to your clipboard or use it directly in your netplan editor.
                    </Text>
                </div>
            )}
        </Drawer>
    );
};

export default NetplanExamplesDrawer;