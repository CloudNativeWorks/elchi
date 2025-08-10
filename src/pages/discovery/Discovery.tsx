import React, { useState } from 'react';
import { Card, Table, Tag, Space, Typography, Button, Drawer, Descriptions, Badge, List, Tooltip, message, Modal } from 'antd';
import { 
  CloudServerOutlined, 
  EyeOutlined, 
  ReloadOutlined, 
  ClusterOutlined,
  NodeIndexOutlined,
  ClockCircleOutlined,
  CodeOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { useDiscovery } from '../../hooks/useDiscovery';
import { ClusterDiscovery, NodeInfo } from '../../types/discovery';
import { formatDistanceToNow } from 'date-fns';

const { Title, Text } = Typography;

const Discovery: React.FC = () => {
  const [selectedCluster, setSelectedCluster] = useState<ClusterDiscovery | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [setupModalVisible, setSetupModalVisible] = useState(false);
  const { data: clusters, isLoading, error, refetch } = useDiscovery();
  
  // Ensure clusters is always an array
  const clustersData = Array.isArray(clusters) ? clusters : [];

  const handleViewCluster = (cluster: ClusterDiscovery) => {
    setSelectedCluster(cluster);
    setDrawerVisible(true);
  };

  const handleRefresh = () => {
    refetch();
    message.success('Cluster data refreshed');
  };

  // Calculate status based on last_seen time
  const getClusterStatus = (lastSeen: string) => {
    const lastSeenTime = new Date(lastSeen).getTime();
    const currentTime = new Date().getTime();
    const timeDifference = currentTime - lastSeenTime;
    const tenMinutesInMs = 10 * 60 * 1000; // 10 minutes in milliseconds
    
    return timeDifference > tenMinutesInMs ? 'inactive' : 'active';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'green';
      case 'inactive': return 'red';
      case 'unknown': return 'default';
      default: return 'default';
    }
  };

  const getNodeStatusColor = (status: string) => {
    switch (status) {
      case 'Ready': return 'green';
      case 'NotReady': return 'red';
      case 'Unknown': return 'orange';
      default: return 'default';
    }
  };

  const setupInstructions = `# Add Elchi Helm repository
helm repo add elchi https://charts.elchi.io
helm repo update

# Install Elchi Discovery Agent
helm install elchi-discovery elchi/discovery-agent \\
  --set config.elchiEndpoint="https://your-elchi-instance.com" \\
  --set config.project="your-project-id" \\
  --set config.token="your-discovery-token" \\
  --set config.clusterName="my-k8s-cluster" \\
  --namespace elchi-system \\
  --create-namespace

# Verify installation
kubectl get pods -n elchi-system`;

  const handleShowSetup = () => {
    setSetupModalVisible(true);
  };

  const handleCopySetup = () => {
    navigator.clipboard.writeText(setupInstructions);
    message.success('Setup instructions copied to clipboard!');
  };

  const columns = [
    {
      title: 'Cluster Name',
      dataIndex: 'cluster_name',
      key: 'cluster_name',
      render: (text: string) => (
        <Space>
          <ClusterOutlined style={{ color: '#1890ff' }} />
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'last_seen',
      key: 'status',
      render: (lastSeen: string) => {
        const status = getClusterStatus(lastSeen);
        return <Tag color={getStatusColor(status)}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Version',
      dataIndex: 'cluster_version',
      key: 'cluster_version',
      render: (version: string) => <Text code>{version}</Text>,
    },
    {
      title: 'Nodes',
      dataIndex: 'node_count',
      key: 'node_count',
      render: (count: number) => (
        <Space>
          <NodeIndexOutlined />
          <Text>{count}</Text>
        </Space>
      ),
    },
    {
      title: 'Last Seen',
      dataIndex: 'last_seen',
      key: 'last_seen',
      render: (lastSeen: string) => (
        <Tooltip title={new Date(lastSeen).toLocaleString()}>
          <Text type="secondary">
            {formatDistanceToNow(new Date(lastSeen), { addSuffix: true })}
          </Text>
        </Tooltip>
      ),
    },
    {
      title: 'Discovery Duration',
      dataIndex: 'discovery_duration',
      key: 'discovery_duration',
      render: (duration: string) => <Text type="secondary">{duration}</Text>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record: ClusterDiscovery) => (
        <Button
          type="primary"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => handleViewCluster(record)}
        >
          View Details
        </Button>
      ),
    },
  ];

  if (error) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <Text type="danger">Failed to load clusters</Text>
        </div>
      </Card>
    );
  }

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Space>
            <CloudServerOutlined style={{ fontSize: 24, color: '#1890ff' }} />
            <Title level={4} style={{ margin: 0 }}>Kubernetes Discovery</Title>
          </Space>
          <Space>
            <Button 
              icon={<ReloadOutlined />} 
              onClick={handleRefresh}
              loading={isLoading}
            >
              Refresh
            </Button>
            {clustersData.length > 0 && (
              <Button 
                icon={<CodeOutlined />} 
                onClick={handleShowSetup}
                type="dashed"
              >
                Setup Instructions
              </Button>
            )}
          </Space>
        </div>
        
        <Text type="secondary">
          Kubernetes clusters discovered and registered by discovery agents.
        </Text>
      </div>

      {clustersData.length === 0 && !isLoading && !error ? (
        <Card>
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <CloudServerOutlined style={{ fontSize: 64, color: '#d9d9d9', marginBottom: 16 }} />
            <Title level={3} style={{ color: '#595959', marginBottom: 16 }}>No Clusters Discovered</Title>
            <Text type="secondary" style={{ fontSize: 16, display: 'block', marginBottom: 24 }}>
              Deploy the Elchi Discovery Agent to your Kubernetes clusters to start monitoring and managing your infrastructure.
            </Text>
            
            <div style={{ 
              background: '#f6ffed', 
              border: '1px solid #b7eb8f', 
              borderRadius: 8, 
              padding: '20px',
              marginBottom: 24,
              textAlign: 'left'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                <InfoCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                <Text strong style={{ color: '#52c41a' }}>Quick Setup</Text>
              </div>
              <pre style={{ 
                background: '#f5f5f5', 
                padding: 16, 
                borderRadius: 6, 
                margin: 0,
                fontSize: 13,
                lineHeight: 1.5,
                overflow: 'auto'
              }}>
                {setupInstructions}
              </pre>
            </div>

            <Space>
              <Button 
                type="primary"
                icon={<CodeOutlined />}
                onClick={handleCopySetup}
                size="large"
              >
                Copy Setup Commands
              </Button>
              <Button 
                icon={<InfoCircleOutlined />}
                onClick={handleShowSetup}
                size="large"
              >
                View Detailed Instructions
              </Button>
            </Space>
          </div>
        </Card>
      ) : (
        <Card>
          <Table
            columns={columns}
            dataSource={clustersData}
            loading={isLoading}
            rowKey="cluster_name"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} clusters`,
            }}
          />
        </Card>
      )}

      <Drawer
        title={
          <Space>
            <ClusterOutlined style={{ color: '#1890ff' }} />
            <span>Cluster Details: {selectedCluster?.cluster_name}</span>
          </Space>
        }
        placement="right"
        width={800}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
      >
        {selectedCluster && (
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Card title="Cluster Information" size="small">
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Cluster Name">
                  <Text strong>{selectedCluster.cluster_name}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Status">
                  {(() => {
                    const status = getClusterStatus(selectedCluster.last_seen);
                    return (
                      <Badge 
                        status={getStatusColor(status) as any} 
                        text={status.toUpperCase()} 
                      />
                    );
                  })()}
                </Descriptions.Item>
                <Descriptions.Item label="Version">
                  <Text code>{selectedCluster.cluster_version}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Node Count">
                  {selectedCluster.node_count}
                </Descriptions.Item>
                <Descriptions.Item label="Discovery Duration">
                  {selectedCluster.discovery_duration}
                </Descriptions.Item>
                <Descriptions.Item label="Created At">
                  {new Date(selectedCluster.created_at).toLocaleString()}
                </Descriptions.Item>
                <Descriptions.Item label="Last Seen">
                  <Space>
                    <ClockCircleOutlined />
                    <Text>
                      {formatDistanceToNow(new Date(selectedCluster.last_seen), { addSuffix: true })}
                    </Text>
                    <Text type="secondary">
                      ({new Date(selectedCluster.last_seen).toLocaleString()})
                    </Text>
                  </Space>
                </Descriptions.Item>
              </Descriptions>
            </Card>

            <Card title="Nodes" size="small">
              <List
                itemLayout="horizontal"
                dataSource={selectedCluster.nodes}
                renderItem={(node: NodeInfo) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<NodeIndexOutlined style={{ fontSize: 18, color: '#1890ff' }} />}
                      title={
                        <Space>
                          <Text strong>{node.name}</Text>
                          <Tag color={getNodeStatusColor(node.status)}>
                            {node.status}
                          </Tag>
                        </Space>
                      }
                      description={
                        <Space direction="vertical" size="small">
                          <Text type="secondary">Version: {node.version}</Text>
                          <Space wrap>
                            {Object.entries(node.addresses).map(([type, address]) => (
                              <Tag key={type} color="blue">
                                {type}: {address}
                              </Tag>
                            ))}
                          </Space>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Space>
        )}
      </Drawer>

      <Modal
        title={
          <Space>
            <CodeOutlined style={{ color: '#1890ff' }} />
            <span>Deploy Discovery Agent</span>
          </Space>
        }
        open={setupModalVisible}
        onCancel={() => setSetupModalVisible(false)}
        footer={[
          <Button key="copy" type="primary" icon={<CodeOutlined />} onClick={handleCopySetup}>
            Copy Commands
          </Button>,
          <Button key="close" onClick={() => setSetupModalVisible(false)}>
            Close
          </Button>
        ]}
        width={800}
      >
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <div>
            <Title level={5}>Prerequisites</Title>
            <List
              size="small"
              dataSource={[
                'Kubernetes cluster with RBAC enabled',
                'Helm 3.x installed on your local machine',
                'kubectl configured to access your cluster',
                'Discovery token from Settings → Tokens page'
              ]}
              renderItem={item => (
                <List.Item>
                  <Space>
                    <Badge status="default" />
                    <Text>{item}</Text>
                  </Space>
                </List.Item>
              )}
            />
          </div>

          <div>
            <Title level={5}>Installation Commands</Title>
            <div style={{
              background: '#f5f5f5',
              border: '1px solid #d9d9d9',
              borderRadius: 6,
              padding: 16
            }}>
              <pre style={{ 
                margin: 0, 
                fontSize: 13, 
                lineHeight: 1.6,
                whiteSpace: 'pre-wrap'
              }}>
                {setupInstructions}
              </pre>
            </div>
          </div>

          <div>
            <Title level={5}>Configuration Parameters</Title>
            <List
              size="small"
              dataSource={[
                { key: 'config.elchiEndpoint', desc: 'Your Elchi instance URL' },
                { key: 'config.project', desc: 'Project ID from Elchi dashboard' },
                { key: 'config.token', desc: 'Discovery token from Settings page' },
                { key: 'config.clusterName', desc: 'Unique name for your cluster' }
              ]}
              renderItem={item => (
                <List.Item>
                  <Space direction="vertical" size={2}>
                    <Text code>{item.key}</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>{item.desc}</Text>
                  </Space>
                </List.Item>
              )}
            />
          </div>

          <div style={{
            background: '#e6f7ff',
            border: '1px solid #91d5ff',
            borderRadius: 6,
            padding: 12
          }}>
            <Space>
              <InfoCircleOutlined style={{ color: '#1890ff' }} />
              <Text style={{ fontSize: 13 }}>
                <strong>Note:</strong> After installation, it may take a few moments for your cluster to appear in the discovery list. 
                The agent will automatically register your cluster and start reporting node information.
              </Text>
            </Space>
          </div>
        </Space>
      </Modal>
    </>
  );
};

export default Discovery;