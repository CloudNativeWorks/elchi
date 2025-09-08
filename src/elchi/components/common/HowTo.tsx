import React from 'react';
import { Card, Button, Typography, Space, Divider, Drawer } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import { copyToClipboard } from '@/utils/clipboard';

const { Title, Paragraph, Text } = Typography;

interface CodeBlockProps {
    code: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code }) => {
    const handleCopy = () => {
        copyToClipboard(code.trim(), 'Copied to clipboard');
    };

    return (
        <div style={{ position: 'relative' }}>
            <Button
                icon={<CopyOutlined />}
                size="small"
                type="text"
                onClick={handleCopy}
                style={{
                    position: 'absolute',
                    right: 10,
                    top: 10,
                    background: 'rgba(255, 255, 255, 0.8)',
                }}
            />
            <pre style={{ background: '#f5f5f5', padding: '12px', borderRadius: '8px', overflowX: 'auto' }}>
                {code}
            </pre>
        </div>
    );
};

interface HowToStartProps {
    open: boolean;
    onClose: () => void;
}

const HowToStart: React.FC<HowToStartProps> = ({ open, onClose }) => {
    return (
        <Drawer
            title="How to Start"
            placement="right"
            width={800}
            onClose={onClose}
            open={open}
        >
            <>
                <Paragraph>
                    To configure <Text strong>Envoy</Text>, you first need to download a <Text strong>bootstrap file</Text>.
                    You can easily download this file using the actions button
                </Paragraph>
                <Divider />
                <Title level={3}>RUN Methods</Title>
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    <Card title="Method 1: Managed Service" variant={'borderless'}>
                        <Paragraph>
                            If your listener is managed, you can deploy it directly through the <Text strong>Services</Text> menu.
                        </Paragraph>
                        <Paragraph>
                            <Text strong>Step 1:</Text> Navigate to the <Text code>Services</Text> section from the main menu.
                        </Paragraph>
                        <Paragraph>
                            <Text strong>Step 2:</Text> Locate the desired service from the service list.
                        </Paragraph>
                        <Paragraph>
                            <Text strong>Step 3:</Text> Click the <Text strong>Manage Service</Text> button to select a client and deploy the configuration.
                        </Paragraph>
                        <Paragraph>
                            This method automatically generates network interfaces and systemd service files, providing a complete deployment solution.
                        </Paragraph>
                    </Card>

                    <Card title="Method 2: Running with func-e" variant={'borderless'}>
                        <Paragraph>
                            You can use the <Text code>func-e</Text> tool to run Envoy.
                            First, run the following command to install <Text code>func-e</Text>:
                        </Paragraph>
                        <CodeBlock code="curl https://func-e.io/install.sh | bash -s -- -b /usr/local/bin" />
                        <Paragraph>
                            After installation is complete, run this command to start Envoy with your downloaded bootstrap file:
                        </Paragraph>
                        <CodeBlock code="func-e run -c bootstrap.yaml" />
                    </Card>

                    <Card title="Method 3: Running with Envoy Binary" variant={'borderless'}>
                        <Paragraph>
                            Alternatively, you can download and directly use the pre-built binary files from the <Text code>releases</Text> section of Envoy's official GitHub repository. This method doesn't require any additional tool installation.
                        </Paragraph>
                        <Paragraph>
                            To access the relevant page:
                        </Paragraph>
                        <CodeBlock code="https://github.com/envoyproxy/envoy/releases" />
                        <Paragraph>
                            After the download is complete, you can run Envoy with the following command:
                        </Paragraph>
                        <CodeBlock code="envoy -c bootstrap.yaml" />
                    </Card>

                    <Card title="Method 4: Running as an Envoy Pod on Kubernetes" variant={'borderless'}>
                        <Paragraph>
                            To run Envoy on Kubernetes, you can use the following <Text code>Deployment</Text> manifest. This configuration provides the bootstrap file as a <Text code>ConfigMap</Text> and mounts it to the Envoy pod.
                        </Paragraph>
                        <Paragraph><Text strong>Step 1: Create ConfigMap</Text></Paragraph>
                        <CodeBlock code="kubectl create configmap envoy-bootstrap --from-file=bootstrap.yaml" />

                        <Paragraph><Text strong>Step 2: Apply Deployment Manifest</Text></Paragraph>
                        <CodeBlock code={`apiVersion: apps/v1
kind: Deployment
metadata:
  name: envoy-deployment
spec:
  replicas: 1
  selector:
    matchLabels:
      app: envoy
  template:
    metadata:
      labels:
        app: envoy
    spec:
      containers:
        - name: envoy
          image: envoyproxy/envoy:v1.33.5 # Update version as needed
          args:
            - "-c"
            - "/etc/envoy/bootstrap.yaml"
          volumeMounts:
            - name: config-volume
              mountPath: /etc/envoy
      volumes:
        - name: config-volume
          configMap:
            name: envoy-bootstrap`} />

                        <Paragraph><Text strong>Step 3: Check Pod Status</Text></Paragraph>
                        <CodeBlock code="kubectl get pods -l app=envoy" />
                        <Paragraph>
                            After the pod is running, you can check Envoy services by viewing the logs:
                        </Paragraph>
                        <CodeBlock code="kubectl logs -l app=envoy" />
                    </Card>
                </Space>
            </>
        </Drawer>
    );
};

export default HowToStart;