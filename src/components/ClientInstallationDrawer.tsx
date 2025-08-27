import React from 'react';
import { Drawer, Typography, Space, Divider, Alert, Button } from 'antd';
import { DownloadOutlined, CodeOutlined, SettingOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

interface ClientInstallationDrawerProps {
    open: boolean;
    onClose: () => void;
}

const ClientInstallationDrawer: React.FC<ClientInstallationDrawerProps> = ({ open, onClose }) => {
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    const CodeBlock = ({ children, onCopy }: { children: string; onCopy?: () => void }) => (
        <div style={{
            background: '#f6f8fa',
            border: '1px solid #d0d7de',
            borderRadius: 6,
            padding: '12px',
            fontFamily: 'monospace',
            fontSize: '13px',
            position: 'relative',
            marginBottom: 12
        }}>
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                {children}
            </pre>
            {onCopy && (
                <Button
                    type="text"
                    size="small"
                    onClick={onCopy}
                    style={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        padding: '2px 8px',
                        height: 24
                    }}
                >
                    Copy
                </Button>
            )}
        </div>
    );

    return (
        <Drawer
            title={
                <Space>
                    <DownloadOutlined style={{ color: '#1890ff' }} />
                    <span>Elchi Client Installation</span>
                </Space>
            }
            open={open}
            onClose={onClose}
            width={800}
            placement="right"
        >
            <div style={{ maxWidth: '100%', padding: '0 8px' }}>
                <div style={{ marginBottom: 24 }}>
                    <Paragraph>
                        You can download and run the client to start managing your Envoy Proxy configurations with ease.
                    </Paragraph>
                </div>

                {/* Download and Install Section */}
                <div style={{ marginBottom: 32 }}>
                    <Title level={4}>
                        <DownloadOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                        Download and Install
                    </Title>
                    
                    <Title level={5} style={{ marginTop: 24, marginBottom: 12 }}>
                        Bootstrap Installation
                    </Title>
                    
                    <Text>Install using bootstrap script:</Text>
                    <CodeBlock
                        onCopy={() => copyToClipboard('curl -sSL https://github.com/CloudNativeWorks/elchi-client/releases/download/v1.0.0/elchi-install.sh | sudo bash')}
                    >
                        curl -sSL https://github.com/CloudNativeWorks/elchi-client/releases/download/v1.0.0/elchi-install.sh | sudo bash
                    </CodeBlock>
                    
                    <Text>With BGP enabled:</Text>
                    <CodeBlock
                        onCopy={() => copyToClipboard('curl -sSL https://github.com/CloudNativeWorks/elchi-client/releases/download/v1.0.0/elchi-install.sh | sudo bash -s -- --enable-bgp')}
                    >
                        curl -sSL https://github.com/CloudNativeWorks/elchi-client/releases/download/v1.0.0/elchi-install.sh | sudo bash -s -- --enable-bgp
                    </CodeBlock>
                </div>

                <Divider />

                {/* Configuration Section */}
                <div style={{ marginBottom: 32 }}>
                    <Title level={4}>
                        <SettingOutlined style={{ color: '#faad14', marginRight: 8 }} />
                        Configuration
                    </Title>
                    
                    <Title level={5} style={{ marginTop: 24, marginBottom: 12 }}>
                        Post-Installation Setup
                    </Title>
                    
                    <Paragraph>
                        After installation, you need to configure the client to connect to your Elchi server.
                    </Paragraph>

                    <div style={{ marginBottom: 16 }}>
                        <Text strong>1. Edit Configuration File</Text>
                        <Paragraph style={{ marginTop: 8, marginBottom: 8 }}>
                            Open the configuration file located at:
                        </Paragraph>
                        <CodeBlock
                            onCopy={() => copyToClipboard('/etc/elchi/config.yaml')}
                        >
                            /etc/elchi/config.yaml
                        </CodeBlock>
                    </div>

                    <div style={{ marginBottom: 16 }}>
                        <Text strong>2. Update Server & Client Configuration</Text>
                        <Paragraph style={{ marginTop: 8, marginBottom: 8 }}>
                            Fill in the following server details:
                        </Paragraph>
                        <CodeBlock
                            onCopy={() => copyToClipboard(`server:
  host: "" # Main server address
  port: 80 # Main server port
  tls: false # Set to true if you are using TLS on main server
  token: "xxxx-xxxx-xxxx-xxxx" # Get from Elchi
client:
  name: "" # Set to the name of the machine`)}
                        >
{`server:
  host: "" # Main server address
  port: 80 # Main server port
  tls: false # Set to true if you are using TLS on main server
  token: "xxxx-xxxx-xxxx-xxxx" # Get from Elchi
client:
  name: "" # Set to the name of the machine`}
                        </CodeBlock>
                    </div>

                    <div style={{ marginBottom: 16 }}>
                        <Text strong>3. Restart the Service</Text>
                        <Paragraph style={{ marginTop: 8, marginBottom: 8 }}>
                            After updating the configuration, restart the client service:
                        </Paragraph>
                        <CodeBlock
                            onCopy={() => copyToClipboard('systemctl restart elchi-client.service')}
                        >
                            systemctl restart elchi-client.service
                        </CodeBlock>
                    </div>
                </div>

                <Divider />

                {/* Configuration Tips */}
                <div style={{ marginBottom: 32 }}>
                    <Title level={4}>
                        <CheckCircleOutlined style={{ color: '#1890ff', marginRight: 8 }} />
                        Configuration Tips
                    </Title>
                    
                    <Alert
                        type="info"
                        showIcon
                        message="Important Notes"
                        description={
                            <ul style={{ marginBottom: 0, paddingLeft: 16 }}>
                                <li>Make sure the server address is reachable from your client machine</li>
                                <li>Enable TLS if your server uses HTTPS</li>
                                <li>Get Token from Elchi UI Settings page</li>
                            </ul>
                        }
                        style={{ marginBottom: 16 }}
                    />
                </div>

                <Divider />

                {/* Supported Operating Systems */}
                <div style={{ marginBottom: 24 }}>
                    <Title level={4}>
                        <CodeOutlined style={{ color: '#722ed1', marginRight: 8 }} />
                        Supported Operating Systems
                    </Title>
                    
                    <div style={{ marginTop: 16 }}>
                        <Text strong>Linux</Text>
                        <div style={{ marginTop: 8 }}>
                            <Text>Ubuntu 24.04 (minimum required)</Text>
                        </div>
                    </div>
                </div>
            </div>
        </Drawer>
    );
};

export default ClientInstallationDrawer;