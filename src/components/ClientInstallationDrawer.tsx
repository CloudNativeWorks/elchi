import React from 'react';
import { Drawer, Typography, Space, Divider, Alert, Button, message } from 'antd';
import { DownloadOutlined, CodeOutlined, SettingOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

interface ClientInstallationDrawerProps {
    open: boolean;
    onClose: () => void;
}

const ClientInstallationDrawer: React.FC<ClientInstallationDrawerProps> = ({ open, onClose }) => {
    const [messageApi, contextHolder] = message.useMessage();

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        messageApi.success('Copied to clipboard');
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
        <>
            {contextHolder}
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
                            <SettingOutlined style={{ color: '#faad14', marginRight: 8 }} />
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
                            <CheckCircleOutlined style={{ color: '#1890ff', marginRight: 8 }} />
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

                    {/* What the Script Does */}
                    <div style={{ marginBottom: 32 }}>
                        <Title level={4}>
                            <CodeOutlined style={{ color: '#722ed1', marginRight: 8 }} />
                            What Does the Installation Script Do?
                        </Title>

                        <Paragraph>
                            The elchi-install.sh script performs a complete system setup optimized for high-performance load balancing:
                        </Paragraph>

                        <div style={{ marginTop: 16 }}>
                            <Text strong>Kernel Parameter Optimizations:</Text>
                            <ul style={{ marginTop: 8, marginBottom: 16, paddingLeft: 20 }}>
                                <li><Text code>net.netfilter.nf_conntrack_max = 2097152</Text> - Handles 2M+ concurrent connections</li>
                                <li><Text code>net.ipv4.tcp_tw_reuse = 1</Text> - Reuses TIME_WAIT sockets for new connections</li>
                                <li><Text code>net.ipv4.tcp_fin_timeout = 30</Text> - Reduces FIN-WAIT-2 timeout from 60s to 30s</li>
                                <li><Text code>fs.file-max = 4097152</Text> - System-wide file descriptor limit (4M)</li>
                                <li><Text code>fs.nr_open = 2048576</Text> - Per-process file descriptor hard limit (2M)</li>
                                <li><Text code>net.core.somaxconn = 32768</Text> - Max queued connections (32K)</li>
                                <li><Text code>net.ipv4.tcp_max_syn_backlog = 32768</Text> - SYN queue size for DDoS protection</li>
                                <li><Text code>net.core.rmem_max = 16777216</Text> - Max receive buffer (16MB)</li>
                                <li><Text code>net.core.wmem_max = 16777216</Text> - Max send buffer (16MB)</li>
                                <li><Text code>net.ipv4.ip_forward = 1</Text> - Enables packet forwarding between interfaces</li>
                                <li><Text code>net.ipv4.tcp_keepalive_time = 120</Text> - TCP keepalive probe after 2 min idle</li>
                                <li><Text code>net.ipv4.ip_local_port_range = 1024 65535</Text> - Ephemeral port range</li>
                                <li><Text code>fs.inotify.max_user_watches = 262144</Text> - File watch limit for config monitoring</li>
                            </ul>
                        </div>

                        <div style={{ marginTop: 16 }}>
                            <Text strong>System Limits Configuration:</Text>
                            <ul style={{ marginTop: 8, marginBottom: 16, paddingLeft: 20 }}>
                                <li><Text code>* soft nofile 655360</Text> - Soft limit for open files per process</li>
                                <li><Text code>* hard nofile 655360</Text> - Hard limit for open files per process</li>
                                <li><Text code>* soft nproc 32768</Text> - Max processes/threads (soft limit)</li>
                                <li><Text code>* hard nproc 32768</Text> - Max processes/threads (hard limit)</li>
                                <li><Text code>* soft memlock unlimited</Text> - Memory lock limit for high-performance I/O</li>
                                <li><Text code>* hard memlock unlimited</Text> - Allows unlimited memory locking</li>
                            </ul>
                        </div>

                        <div style={{ marginTop: 16 }}>
                            <Text strong>User & Permission Setup:</Text>
                            <ul style={{ marginTop: 8, marginBottom: 16, paddingLeft: 20 }}>
                                <li>Creates system users: <Text code>elchi</Text> and <Text code>envoyuser</Text></li>
                                <li>Configures sudoers rules for systemd, netplan, and FRR management</li>
                                <li>Sets up <Text code>/etc/elchi</Text> and <Text code>/var/lib/elchi</Text> directory hierarchy</li>
                                <li>Applies SELinux/AppArmor compatible permissions</li>
                            </ul>
                        </div>

                        <div style={{ marginTop: 16 }}>
                            <Text strong>Elchi Client Installation:</Text>
                            <ul style={{ marginTop: 8, marginBottom: 16, paddingLeft: 20 }}>
                                <li>Downloads latest elchi-client binary from GitHub releases</li>
                                <li>Verifies binary integrity with SHA256 checksum</li>
                                <li>Creates configuration file with your server settings</li>
                                <li>Installs and enables systemd service for auto-start</li>
                            </ul>
                        </div>

                        <div style={{ marginTop: 16 }}>
                            <Text strong>Network & Connection Tracking:</Text>
                            <ul style={{ marginTop: 8, marginBottom: 16, paddingLeft: 20 }}>
                                <li><Text code>nf_conntrack hashsize=524288</Text> - Connection tracking hash table size</li>
                                <li><Text code>nf_conntrack expect_hashsize=524288</Text> - Expected connections hash table</li>
                                <li><Text code>net.netfilter.nf_conntrack_tcp_timeout_established = 7200</Text> - 2 hour timeout for established connections</li>
                                <li><Text code>net.netfilter.nf_conntrack_tcp_timeout_time_wait = 120</Text> - 2 min TIME_WAIT timeout</li>
                                <li>Converts Ubuntu netplan to <Text code>99-elchi-interfaces.yaml</Text> format</li>
                                <li>Sets up routing table management via <Text code>/var/lib/elchi/rt_tables.conf</Text></li>
                                <li>Creates symlink to <Text code>/etc/iproute2/rt_tables.d/elchi.conf</Text></li>
                            </ul>
                        </div>

                        {/* BGP/FRR Section */}
                        <div style={{ marginTop: 16 }}>
                            <Text strong>Optional: BGP Routing (--enable-bgp):</Text>
                            <ul style={{ marginTop: 8, marginBottom: 16, paddingLeft: 20 }}>
                                <li>Installs FRR 10.4.0 from official repository</li>
                                <li>Enables zebra and bgpd daemons only</li>
                                <li>Configures auto-save for routing configurations</li>
                                <li>Sets up gRPC for programmatic route management</li>
                            </ul>
                        </div>

                        <Alert
                            type="success"
                            showIcon
                            message="Production-Ready Setup"
                            description={
                                <div>
                                    <div>• <strong>High Performance:</strong> Optimized for 2M+ concurrent connections</div>
                                    <div>• <strong>Auto-Recovery:</strong> Service auto-restarts on failure</div>
                                    <div>• <strong>Security:</strong> Proper user isolation and permission management</div>
                                    <div>• <strong>Monitoring:</strong> Full systemd integration with journald logging</div>
                                    <div>• <strong>Network Control:</strong> Complete netplan and routing table management</div>
                                </div>
                            }
                            style={{ marginTop: 16 }}
                        />
                    </div>

                    <Divider />

                    {/* Supported Operating Systems */}
                    <div style={{ marginBottom: 24 }}>
                        <Title level={4}>
                            <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
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
                                <Text>• ARM64 / aarch64</Text>
                            </div>
                        </div>

                        <div style={{ marginTop: 16 }}>
                            <Text strong>Minimum Resources:</Text>
                            <div style={{ marginTop: 8 }}>
                                <Text>• RAM: 2GB (4GB+ recommended for production)</Text><br />
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