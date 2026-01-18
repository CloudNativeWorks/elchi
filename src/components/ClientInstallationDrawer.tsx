import React from 'react';
import { Drawer, Typography, Space, Divider, Alert, Button } from 'antd';
import { DownloadOutlined, CodeOutlined, SettingOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { copyToClipboard as copyToClipboardUtil } from '@/utils/clipboard';

const { Title, Text, Paragraph } = Typography;

interface ClientInstallationDrawerProps {
    open: boolean;
    onClose: () => void;
}

const ClientInstallationDrawer: React.FC<ClientInstallationDrawerProps> = ({ open, onClose }) => {
    const copyToClipboard = (text: string) => {
        copyToClipboardUtil(text, 'Copied to clipboard');
    };

    // Auto-detect server configuration from current URL
    const getServerConfig = () => {
        const hostname = window.location.hostname;
        const protocol = window.location.protocol;
        const port = window.location.port;

        // Determine if TLS is used
        const useTLS = protocol === 'https:';

        // Determine the port - use default ports if not specified
        let serverPort = port;
        if (!serverPort) {
            serverPort = useTLS ? '443' : '80';
        }

        return {
            host: hostname,
            port: serverPort,
            tls: useTLS
        };
    };

    const serverConfig = getServerConfig();

    const CodeBlock = ({ children, onCopy }: { children: string; onCopy?: () => void }) => (
        <div style={{
            background: 'var(--code-bg)',
            border: '1px solid var(--border-default)',
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
        <>
            <Drawer
                title={
                    <Space>
                        <DownloadOutlined style={{ color: 'var(--color-primary)' }} />
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
                            <DownloadOutlined style={{ color: 'var(--color-success)', marginRight: 8 }} />
                            Download and Install
                        </Title>

                        <Title level={5} style={{ marginTop: 24, marginBottom: 12 }}>
                            Bootstrap Installation
                        </Title>

                        <Text>One-command install (recommended):</Text>
                        <CodeBlock
                            onCopy={() => copyToClipboard(`curl -sSL https://github.com/CloudNativeWorks/elchi-client/releases/download/v1.0.0/elchi-install.sh | sudo bash -s -- \\
  --name=<YOUR-CLIENT-NAME> \\
  --host=${serverConfig.host} \\
  --port=${serverConfig.port} \\
  --tls=${serverConfig.tls} \\
  --token=<YOUR-AUTH-TOKEN> \\
  --cloud=<YOUR-CLOUD-NAME>`)}
                        >
                            {`curl -sSL https://github.com/CloudNativeWorks/elchi-client/releases/download/v1.0.0/elchi-install.sh | sudo bash -s -- \\
  --name=<YOUR-CLIENT-NAME> \\
  --host=${serverConfig.host} \\
  --port=${serverConfig.port} \\
  --tls=${serverConfig.tls} \\
  --token=<YOUR-AUTH-TOKEN> \\
  --cloud=<YOUR-CLOUD-NAME>`}
                        </CodeBlock>

                        <Text>Or download first, then install:</Text>
                        <CodeBlock
                            onCopy={() => copyToClipboard('wget https://github.com/CloudNativeWorks/elchi-client/releases/download/v1.0.0/elchi-install.sh')}
                        >
                            wget https://github.com/CloudNativeWorks/elchi-client/releases/download/v1.0.0/elchi-install.sh
                        </CodeBlock>

                        <Title level={5} style={{ marginTop: 24, marginBottom: 12 }}>
                            Production Setup
                        </Title>

                        <Alert
                            type="success"
                            showIcon
                            message="Auto-detected Server Settings"
                            description={
                                <div>
                                    <div>Host: <Text code>{serverConfig.host}</Text></div>
                                    <div>Port: <Text code>{serverConfig.port}</Text></div>
                                    <div>TLS: <Text code>{serverConfig.tls.toString()}</Text></div>
                                    <div style={{ marginTop: 8 }}>
                                        <Text type="warning">Replace <Text code>&lt;YOUR-CLIENT-NAME&gt;</Text>, <Text code>&lt;YOUR-AUTH-TOKEN&gt;</Text>, and <Text code>&lt;YOUR-CLOUD-NAME&gt;</Text> with your values</Text>
                                    </div>
                                </div>
                            }
                            style={{ marginBottom: 16 }}
                        />

                        <Text>Production configuration with auto-detected server settings:</Text>
                        <CodeBlock
                            onCopy={() => copyToClipboard(`sudo bash elchi-install.sh \\
  --name=<YOUR-CLIENT-NAME> \\
  --host=${serverConfig.host} \\
  --port=${serverConfig.port} \\
  --tls=${serverConfig.tls} \\
  --token=<YOUR-AUTH-TOKEN> \\
  --cloud=<YOUR-CLOUD-NAME>`)}
                        >
                            {`sudo bash elchi-install.sh \\
  --name=<YOUR-CLIENT-NAME> \\
  --host=${serverConfig.host} \\
  --port=${serverConfig.port} \\
  --tls=${serverConfig.tls} \\
  --token=<YOUR-AUTH-TOKEN> \\
  --cloud=<YOUR-CLOUD-NAME>`}
                        </CodeBlock>

                        <Text>With BGP routing enabled:</Text>
                        <CodeBlock
                            onCopy={() => copyToClipboard(`sudo bash elchi-install.sh \\
  --enable-bgp \\
  --name=<YOUR-CLIENT-NAME> \\
  --host=${serverConfig.host} \\
  --port=${serverConfig.port} \\
  --tls=${serverConfig.tls} \\
  --token=<YOUR-AUTH-TOKEN> \\
  --cloud=<YOUR-CLOUD-NAME>`)}
                        >
                            {`sudo bash elchi-install.sh \\
  --enable-bgp \\
  --name=<YOUR-CLIENT-NAME> \\
  --host=${serverConfig.host} \\
  --port=${serverConfig.port} \\
  --tls=${serverConfig.tls} \\
  --token=<YOUR-AUTH-TOKEN> \\
  --cloud=<YOUR-CLOUD-NAME>`}
                        </CodeBlock>
                        <Title level={5} style={{ marginTop: 24, marginBottom: 12 }}>
                            Configuration Options
                        </Title>

                        <div style={{ marginBottom: 16 }}>
                            <Text strong>Required Parameters:</Text>
                            <ul style={{ marginTop: 8, marginBottom: 8, paddingLeft: 20 }}>
                                <li><Text code>--name=NAME</Text>: Client name</li>
                                <li><Text code>--host=HOST</Text>: Server address</li>
                                <li><Text code>--port=PORT</Text>: Server port (1-65535)</li>
                                <li><Text code>--tls=true|false</Text>: Enable TLS</li>
                                <li><Text code>--token=TOKEN</Text>: Authentication token (min 8 chars)</li>
                            </ul>
                        </div>

                        <div style={{ marginBottom: 16 }}>
                            <Text strong>Optional Parameters:</Text>
                            <ul style={{ marginTop: 8, marginBottom: 8, paddingLeft: 20 }}>
                                <li><Text code>--enable-bgp</Text>: Install FRR routing</li>
                                <li><Text code>--cloud=CLOUD_NAME</Text>: OpenStack cloud configuration name. If using OpenStack, define it in Settings → Clouds and specify here</li>
                            </ul>
                        </div>
                    </div>

                    <Divider />

                    {/* Service Management */}
                    <div style={{ marginBottom: 32 }}>
                        <Title level={4}>
                            <SettingOutlined style={{ color: 'var(--color-warning)', marginRight: 8 }} />
                            Service Management
                        </Title>

                        <Paragraph>
                            After installation, the Elchi client runs as a system service.
                        </Paragraph>

                        <div style={{ marginBottom: 16 }}>
                            <Text strong>Service Commands:</Text>
                            <div style={{ marginTop: 8 }}>
                                <Text>Check service status:</Text>
                                <CodeBlock
                                    onCopy={() => copyToClipboard('systemctl status elchi-client.service')}
                                >
                                    systemctl status elchi-client.service
                                </CodeBlock>

                                <Text>Restart service:</Text>
                                <CodeBlock
                                    onCopy={() => copyToClipboard('systemctl restart elchi-client.service')}
                                >
                                    systemctl restart elchi-client.service
                                </CodeBlock>

                                <Text>View service logs:</Text>
                                <CodeBlock
                                    onCopy={() => copyToClipboard('journalctl -u elchi-client.service -f')}
                                >
                                    journalctl -u elchi-client.service -f
                                </CodeBlock>
                            </div>
                        </div>
                    </div>

                    <Divider />

                    {/* Important Notes */}
                    <div style={{ marginBottom: 32 }}>
                        <Title level={4}>
                            <CheckCircleOutlined style={{ color: 'var(--color-primary)', marginRight: 8 }} />
                            Important Notes
                        </Title>

                        <Alert
                            type="info"
                            showIcon
                            message="Installation Requirements"
                            description={
                                <ul style={{ marginBottom: 0, paddingLeft: 16 }}>
                                    <li>All parameters (--name, --host, --port, --tls, --token) are required during installation</li>
                                    <li>Make sure the server address is reachable from your client machine</li>
                                    <li>Use --tls=true if your server uses HTTPS (port 443)</li>
                                    <li>Get your authentication token from Elchi UI Settings page</li>
                                    <li>Use --enable-bgp flag if you need FRR routing capabilities</li>
                                </ul>
                            }
                            style={{ marginBottom: 16 }}
                        />
                    </div>

                    <Divider />

                    {/* Supported Operating Systems */}
                    <div style={{ marginBottom: 24 }}>
                        <Title level={4}>
                            <CheckCircleOutlined style={{ color: 'var(--color-success)', marginRight: 8 }} />
                            System Requirements
                        </Title>

                        <div style={{ marginTop: 16 }}>
                            <Text strong>Operating System:</Text>
                            <div style={{ marginTop: 8 }}>
                                <Text>• Ubuntu 24.04 LTS (recommended)</Text><br />
                            </div>
                        </div>

                        <div style={{ marginTop: 16 }}>
                            <Text strong>Architecture:</Text>
                            <div style={{ marginTop: 8 }}>
                                <Text>• AMD64 / x86_64</Text><br />
                            </div>
                        </div>

                        <div style={{ marginTop: 16 }}>
                            <Text strong>Minimum Resources:</Text>
                            <div style={{ marginTop: 8 }}>
                                <Text>• RAM: 4GB (8GB+ recommended for production)</Text><br />
                                <Text>• Disk: 50GB free space</Text><br />
                                <Text>• Network: Stable internet connection</Text>
                            </div>
                        </div>
                    </div>
                </div>
            </Drawer>
        </>
    );
};

export default ClientInstallationDrawer;