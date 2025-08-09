import React, { useEffect, useState } from 'react';
import { Card, Button, Input, List, Modal, Typography, Space, message, Divider, Statistic, Row, Col, Progress } from 'antd';
import { PlusOutlined, DeleteOutlined, RobotOutlined, SaveOutlined, EditOutlined, ApiOutlined, ThunderboltOutlined, EyeOutlined, EyeInvisibleOutlined, BarChartOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useCustomGetQuery } from '@/common/api';
import { useCustomApiMutation } from '@/common/custom-api';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import { useClaudeToken } from '@/hooks/useClaudeToken';
import { useDiscoveryToken } from '@/hooks/useDiscoveryToken';
import { useAIUsageStatus, useAIUsageStats } from '@/hooks/useAIUsage';

const { Title, Text } = Typography;

const Tokens: React.FC = () => {
    const [tokens, setTokens] = useState<any[]>([]);
    const [creating, setCreating] = useState(false);
    const [newTokenName, setNewTokenName] = useState('');
    const [createdToken, setCreatedToken] = useState<string | null>(null);
    const [showTokenModal, setShowTokenModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState<{ visible: boolean; tokenName: string; tokenId: string | null }>({ visible: false, tokenName: '', tokenId: null });
    const { project } = useProjectVariable();
    const [messageApi, contextHolder] = message.useMessage();
    const mutate = useCustomApiMutation();
    
    // AI Usage hooks
    const { data: aiUsageStatus } = useAIUsageStatus();
    const { data: aiUsageStats } = useAIUsageStats();
    
    const {
        maskedToken,
        hasToken,
        isLoading: isClaudeTokenLoading,
        error: claudeTokenError,
        setToken,
        updateToken,
        deleteToken: deleteClaudeToken
    } = useClaudeToken();
    
    const {
        token: discoveryToken,
        hasToken: hasDiscoveryToken,
        isLoading: isDiscoveryTokenLoading,
        error: discoveryTokenError,
        deleteToken: deleteDiscoveryTokenFn,
        generateToken: generateDiscoveryToken
    } = useDiscoveryToken();
    
    const [newClaudeToken, setNewClaudeToken] = useState('');
    const [isEditingClaudeToken, setIsEditingClaudeToken] = useState(false);
    const [showGeneratedToken, setShowGeneratedToken] = useState<string | null>(null);
    const [showDiscoveryToken, setShowDiscoveryToken] = useState(false);

    const { isLoading, data: dataResource, refetch } = useCustomGetQuery({
        queryKey: `tokens_${project}`,
        enabled: true,
        path: `api/v3/setting/tokens?project=${project}`,
        directApi: true
    });

    useEffect(() => {
        if (dataResource && dataResource.length > 0) {
            setTokens(dataResource[0]?.tokens || []);
        } else {
            setTokens([]);
        }
    }, [dataResource]);

    const handleCreateToken = async () => {
        if (!newTokenName.trim()) {
            messageApi.warning('Please enter a name!');
            return;
        }
        setCreating(true);

        try {
            await mutate.mutateAsync({
                data: null,
                method: 'post',
                path: `api/v3/setting/tokens?project=${project}&name=${newTokenName}`
            }, {
                onSuccess: (response: any) => {
                    setCreatedToken(response.token.token);
                    setShowTokenModal(true);
                    setNewTokenName('');
                    refetch();
                    messageApi.success('Token created successfully!');
                },
                onError: (error: any) => {
                    console.log(error);
                    messageApi.error(error.response?.data?.message || 'Token not created!');
                }
            });
        } catch (error: any) {
            console.log(error);
            messageApi.error(error.response?.data?.message || 'Token not created!');
        }

        setCreating(false);
    };

    const handleDeleteToken = (tokenName: string, tokenId: string) => {
        setDeleteModal({ visible: true, tokenName, tokenId });
    };

    const confirmDelete = async () => {
        if (!deleteModal.tokenId) return;
        
        try {
            await mutate.mutateAsync({
                data: null,
                method: 'delete',
                path: `api/v3/setting/tokens/${deleteModal.tokenId}?project=${project}`
            }, {
                onSuccess: () => {
                    messageApi.success(`Token "${deleteModal.tokenName}" deleted successfully!`);
                    refetch();
                    setDeleteModal({ visible: false, tokenName: '', tokenId: null });
                },
                onError: (error: any) => {
                    console.log(error);
                    messageApi.error(error.response?.data?.message || 'Failed to delete token!');
                }
            });
        } catch (error: any) {
            console.log(error);
            messageApi.error(error.response?.data?.message || 'Failed to delete token!');
        }
    };

    const hideDeleteModal = () => {
        setDeleteModal({ visible: false, tokenName: '', tokenId: null });
    };

    const handleSaveClaudeToken = async () => {
        if (!newClaudeToken.trim()) {
            messageApi.warning('Please enter Claude API token!');
            return;
        }
        
        if (!newClaudeToken.startsWith('sk-ant-')) {
            messageApi.warning('Claude API token must start with "sk-ant-"');
            return;
        }

        try {
            if (hasToken) {
                await updateToken(newClaudeToken);
                messageApi.success('Claude API token updated successfully!');
            } else {
                await setToken(newClaudeToken);
                messageApi.success('Claude API token saved successfully!');
            }
            setNewClaudeToken('');
            setIsEditingClaudeToken(false);
        } catch (error: any) {
            messageApi.error(error?.message || 'Failed to save Claude API token!');
        }
    };

    const handleEditClaudeToken = () => {
        setIsEditingClaudeToken(true);
        setNewClaudeToken('');
    };

    const handleDeleteClaudeToken = async () => {
        try {
            await deleteClaudeToken();
            messageApi.success('Claude API token deleted successfully!');
            setIsEditingClaudeToken(false);
            setNewClaudeToken('');
        } catch (error: any) {
            messageApi.error(error?.message || 'Failed to delete Claude API token!');
        }
    };

    const handleCancelEdit = () => {
        setIsEditingClaudeToken(false);
        setNewClaudeToken('');
    };

    // Discovery Token handlers
    const handleDeleteDiscoveryToken = async () => {
        try {
            await deleteDiscoveryTokenFn();
            messageApi.success('Discovery token deleted successfully!');
        } catch (error: any) {
            messageApi.error(error?.message || 'Failed to delete discovery token!');
        }
    };

    const handleGenerateDiscoveryToken = async () => {
        try {
            const generatedToken = await generateDiscoveryToken();
            setShowGeneratedToken(generatedToken);
            messageApi.success('Discovery token generated successfully!');
        } catch (error: any) {
            messageApi.error(error?.message || 'Failed to generate discovery token!');
        }
    };

    // Create masked version of discovery token
    const getMaskedDiscoveryToken = (token: string | null) => {
        if (!token) return '';
        if (token.length <= 8) return token;
        return token.substring(0, 8) + '*'.repeat(Math.min(token.length - 8, 20));
    };

    return (
        <>
            {contextHolder}
            <Card variant="borderless" style={{ boxShadow: 'none', background: 'transparent' }}>
                <Title level={5} style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <RobotOutlined style={{ color: '#722ed1' }} />
                    Claude AI Token
                </Title>
                <Space direction="vertical" style={{ width: '100%', marginBottom: 24 }} size={12}>
                    <Text type="secondary" style={{ fontSize: 13 }}>
                        Enter your Claude API token here. Required for AI configuration analysis. Token is stored securely in database.
                    </Text>
                    
                    {isClaudeTokenLoading ? (
                        <div style={{ padding: 16, textAlign: 'center' }}>Loading token...</div>
                    ) : (
                        <>
                            {hasToken && !isEditingClaudeToken ? (
                                <div style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: 12, 
                                    padding: '12px 16px', 
                                    background: '#f6ffed', 
                                    border: '1px solid #b7eb8f', 
                                    borderRadius: 6 
                                }}>
                                    <Text 
                                        style={{ 
                                            fontFamily: 'monospace', 
                                            fontSize: 13, 
                                            color: '#52c41a',
                                            flex: 1
                                        }}
                                    >
                                        {maskedToken}
                                    </Text>
                                    <Button
                                        type="text"
                                        size="small"
                                        icon={<EditOutlined />}
                                        onClick={handleEditClaudeToken}
                                        style={{ color: '#722ed1' }}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        type="text"
                                        size="small"
                                        icon={<DeleteOutlined />}
                                        onClick={handleDeleteClaudeToken}
                                        style={{ color: '#ff4d4f' }}
                                        danger
                                    >
                                        Delete
                                    </Button>
                                </div>
                            ) : (
                                <Space.Compact style={{ width: '100%' }}>
                                    <Input.Password
                                        style={{ flex: 1, maxWidth: 400 }}
                                        placeholder="sk-ant-api03-..."
                                        value={newClaudeToken}
                                        onChange={(e) => setNewClaudeToken(e.target.value)}
                                        disabled={isClaudeTokenLoading}
                                    />
                                    <Button
                                        type="primary"
                                        icon={<SaveOutlined />}
                                        loading={isClaudeTokenLoading}
                                        onClick={handleSaveClaudeToken}
                                        style={{ background: '#722ed1', borderColor: '#722ed1' }}
                                    >
                                        {hasToken ? 'Update' : 'Save'}
                                    </Button>
                                    {isEditingClaudeToken && (
                                        <Button
                                            onClick={handleCancelEdit}
                                            disabled={isClaudeTokenLoading}
                                        >
                                            Cancel
                                        </Button>
                                    )}
                                </Space.Compact>
                            )}
                            
                            {claudeTokenError && (
                                <Text type="danger" style={{ fontSize: 12 }}>
                                    {claudeTokenError}
                                </Text>
                            )}

                            {/* AI Usage Statistics */}
                            {hasToken && (
                                <Card 
                                    size="small" 
                                    style={{ marginTop: 16 }}
                                    title={
                                        <Space>
                                            <BarChartOutlined style={{ color: '#fff' }} />
                                            <Text strong style={{ color: '#fff' }}>AI Usage Statistics</Text>
                                        </Space>
                                    }
                                >
                                    {aiUsageStatus?.usage_summary ? (
                                        <Row gutter={16}>
                                            <Col span={6}>
                                                <Statistic
                                                    title="Total Requests"
                                                    value={aiUsageStatus.usage_summary.total_requests}
                                                    prefix={<BarChartOutlined />}
                                                />
                                            </Col>
                                            <Col span={6}>
                                                <Statistic
                                                    title="Success Rate"
                                                    value={aiUsageStatus.usage_summary.success_rate}
                                                    precision={1}
                                                    suffix="%"
                                                    prefix={<CheckCircleOutlined />}
                                                />
                                            </Col>
                                            <Col span={6}>
                                                <Statistic
                                                    title="Tokens Today"
                                                    value={aiUsageStatus.usage_summary.tokens_used_today}
                                                    prefix={<RobotOutlined />}
                                                />
                                            </Col>
                                            <Col span={6}>
                                                <Statistic
                                                    title="Tokens This Month"
                                                    value={aiUsageStatus.usage_summary.tokens_used_month}
                                                    prefix={<RobotOutlined />}
                                                />
                                            </Col>
                                        </Row>
                                    ) : (
                                        <Space style={{ width: '100%', justifyContent: 'center', padding: '16px 0' }}>
                                            <ExclamationCircleOutlined style={{ color: '#faad14' }} />
                                            <Text type="secondary">No usage data available yet</Text>
                                        </Space>
                                    )}

                                    {aiUsageStats && (
                                        <div style={{ marginTop: 16 }}>
                                            <Row gutter={16}>
                                                <Col span={12}>
                                                    <div style={{ marginBottom: 8 }}>
                                                        <Text type="secondary" style={{ fontSize: 12 }}>Average Response Time</Text>
                                                    </div>
                                                    <Progress
                                                        percent={Math.min((aiUsageStats.average_response_time_ms / 10000) * 100, 100)}
                                                        format={() => `${aiUsageStats.average_response_time_ms.toFixed(0)}ms`}
                                                        strokeColor="#722ed1"
                                                    />
                                                </Col>
                                                <Col span={12}>
                                                    <div style={{ marginBottom: 8 }}>
                                                        <Text type="secondary" style={{ fontSize: 12 }}>Request Types</Text>
                                                    </div>
                                                    <Space wrap>
                                                        <Text style={{ fontSize: 12 }}>
                                                            Analysis: {aiUsageStats.analyze_requests}
                                                        </Text>
                                                        <Text style={{ fontSize: 12 }}>
                                                            Log Analysis: {aiUsageStats.log_analyze_requests}
                                                        </Text>
                                                    </Space>
                                                </Col>
                                            </Row>
                                            {aiUsageStats.last_used && (
                                                <div style={{ marginTop: 12, fontSize: 12, color: '#8c8c8c' }}>
                                                    Last used: {new Date(aiUsageStats.last_used).toLocaleString()}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </Card>
                            )}

                            {/* Service Status */}
                            {hasToken && (
                                <div style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: 8, 
                                    marginTop: 12,
                                    padding: '8px 12px',
                                    background: aiUsageStatus?.status?.service_available ? '#f6ffed' : '#fff2e8',
                                    border: `1px solid ${aiUsageStatus?.status?.service_available ? '#b7eb8f' : '#ffbb96'}`,
                                    borderRadius: 6
                                }}>
                                    {aiUsageStatus?.status?.service_available ? (
                                        <CheckCircleOutlined style={{ color: '#52c41a' }} />
                                    ) : (
                                        <ExclamationCircleOutlined style={{ color: '#fa8c16' }} />
                                    )}
                                    <Text style={{ fontSize: 12 }}>
                                        AI Service: {aiUsageStatus?.status?.service_available ? 'Available' : 'Unavailable'}
                                    </Text>
                                    {aiUsageStatus?.status?.supported_models && (
                                        <Text type="secondary" style={{ fontSize: 11 }}>
                                            • {aiUsageStatus.status.supported_models.join(', ')}
                                        </Text>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </Space>
                
                <Divider style={{ margin: '24px 0' }} />
                
                <Title level={5} style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <ApiOutlined style={{ color: '#13c2c2' }} />
                    Discovery Token
                </Title>
                <Space direction="vertical" style={{ width: '100%', marginBottom: 24 }} size={12}>
                    <Text type="secondary" style={{ fontSize: 13 }}>
                        Used by Kubernetes discovery agents to authenticate with Elchi and update endpoint configurations automatically.
                    </Text>
                    
                    {isDiscoveryTokenLoading ? (
                        <div style={{ padding: 16, textAlign: 'center' }}>Loading token...</div>
                    ) : (
                        <>
                            {hasDiscoveryToken ? (
                                <div style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: 12, 
                                    padding: '12px 16px', 
                                    background: '#e6fffb', 
                                    border: '1px solid #87e8de', 
                                    borderRadius: 6 
                                }}>
                                    <Text 
                                        copyable={showDiscoveryToken ? { text: discoveryToken } : false}
                                        style={{ 
                                            fontFamily: 'monospace', 
                                            fontSize: 12, 
                                            color: '#13c2c2',
                                            flex: 1,
                                            wordBreak: 'break-all'
                                        }}
                                    >
                                        {showDiscoveryToken ? discoveryToken : getMaskedDiscoveryToken(discoveryToken)}
                                    </Text>
                                    <Button
                                        type="text"
                                        size="small"
                                        icon={showDiscoveryToken ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                                        onClick={() => setShowDiscoveryToken(!showDiscoveryToken)}
                                        style={{ color: '#13c2c2' }}
                                        title={showDiscoveryToken ? 'Hide token' : 'Show token'}
                                    >
                                        {showDiscoveryToken ? 'Hide' : 'Show'}
                                    </Button>
                                    <Button
                                        type="text"
                                        size="small"
                                        icon={<DeleteOutlined />}
                                        onClick={handleDeleteDiscoveryToken}
                                        style={{ color: '#ff4d4f' }}
                                        danger
                                    >
                                        Delete
                                    </Button>
                                </div>
                            ) : (
                                <div style={{ 
                                    padding: '16px', 
                                    background: '#fafafa', 
                                    border: '1px solid #f0f0f0', 
                                    borderRadius: 6,
                                    textAlign: 'center'
                                }}>
                                    <Text type="secondary" style={{ fontSize: 13, marginBottom: 12, display: 'block' }}>
                                        No discovery token found. Generate one to enable Kubernetes discovery.
                                    </Text>
                                    <Button
                                        type="primary"
                                        icon={<ThunderboltOutlined />}
                                        onClick={handleGenerateDiscoveryToken}
                                        loading={isDiscoveryTokenLoading}
                                        style={{ background: '#13c2c2', borderColor: '#13c2c2' }}
                                    >
                                        Generate Discovery Token
                                    </Button>
                                </div>
                            )}
                            
                            {discoveryTokenError && (
                                <Text type="danger" style={{ fontSize: 12 }}>
                                    {discoveryTokenError}
                                </Text>
                            )}
                        </>
                    )}
                </Space>
                
                <Divider style={{ margin: '24px 0' }} />
                
                <Title level={5} style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <ThunderboltOutlined style={{ color: '#1890ff' }} />
                    Client Tokens
                </Title>
                <Space direction="vertical" style={{ width: '100%', marginBottom: 24 }} size={12}>
                    <Text type="secondary" style={{ fontSize: 13 }}>
                        Create API tokens for client applications to authenticate with Elchi services.
                    </Text>
                    <Space.Compact style={{ width: '100%' }}>
                        <Input
                            style={{ flex: 1, maxWidth: 400 }}
                            placeholder="Enter token name..."
                            value={newTokenName}
                            onChange={e => setNewTokenName(e.target.value)}
                            maxLength={32}
                            disabled={creating}
                        />
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            loading={creating}
                            onClick={handleCreateToken}
                        >
                            Create Token
                        </Button>
                    </Space.Compact>
                    
                    {isLoading ? (
                        <div style={{ padding: 16, textAlign: 'center' }}>Loading tokens...</div>
                    ) : tokens.length === 0 ? (
                        <div style={{ 
                            padding: '16px', 
                            background: '#fafafa', 
                            border: '1px solid #f0f0f0', 
                            borderRadius: 6,
                            textAlign: 'center'
                        }}>
                            <Text type="secondary" style={{ fontSize: 13, marginBottom: 12, display: 'block' }}>
                                No client tokens found. Create your first token to get started.
                            </Text>
                        </div>
                    ) : (
                        <Space direction="vertical" style={{ width: '100%' }} size={12}>
                            {tokens.map((item, index) => (
                                <div
                                    key={index}
                                    style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: 12, 
                                        padding: '12px 16px', 
                                        background: '#f0f8ff', 
                                        border: '1px solid #91d5ff', 
                                        borderRadius: 6 
                                    }}
                                >
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                            <Text strong style={{ fontSize: 14, color: '#1890ff' }}>{item.name}</Text>
                                            <div style={{
                                                background: '#1890ff',
                                                color: 'white',
                                                fontSize: 10,
                                                padding: '2px 6px',
                                                borderRadius: 3,
                                                fontWeight: 500,
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px'
                                            }}>
                                                CLIENT
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <Text 
                                                copyable={{ text: item.token }}
                                                style={{ 
                                                    fontFamily: 'monospace', 
                                                    fontSize: 12, 
                                                    color: '#1890ff',
                                                    wordBreak: 'break-all'
                                                }}
                                            >
                                                {item.token}
                                            </Text>
                                            {item.created_at && (
                                                <Text type="secondary" style={{ fontSize: 11 }}>
                                                    Created: {new Date(item.created_at).toLocaleDateString()}
                                                </Text>
                                            )}
                                        </div>
                                    </div>
                                    <Button
                                        type="text"
                                        size="small"
                                        icon={<DeleteOutlined />}
                                        onClick={() => handleDeleteToken(item.name, item._id || item.id)}
                                        style={{ color: '#ff4d4f' }}
                                        danger
                                    >
                                        Delete
                                    </Button>
                                </div>
                            ))}
                        </Space>
                    )}
                </Space>
                
                <Modal
                    open={showTokenModal}
                    onCancel={() => setShowTokenModal(false)}
                    footer={null}
                    title="Token Information"
                >
                    <Text copyable style={{ fontSize: 16, wordBreak: 'break-all' }}>{createdToken}</Text>
                    <div style={{ marginTop: 12, color: '#faad14' }}>
                        <b>Note:</b> You cannot view the token again, please copy it!
                    </div>
                </Modal>
                
                <Modal
                    title="Delete Token"
                    open={deleteModal.visible}
                    onOk={confirmDelete}
                    onCancel={hideDeleteModal}
                    okText="Delete"
                    cancelText="Cancel"
                    okButtonProps={{ danger: true }}
                >
                    <p>Are you sure you want to delete the token <strong>"{deleteModal.tokenName}"</strong>?</p>
                    <p style={{ color: '#ff4d4f', fontSize: 12 }}>
                        <strong>Warning:</strong> This action cannot be undone. Any client using this token will lose access.
                    </p>
                </Modal>
                
                <Modal
                    title={
                        <Space>
                            <ThunderboltOutlined style={{ color: '#13c2c2' }} />
                            Generated Discovery Token
                        </Space>
                    }
                    open={!!showGeneratedToken}
                    onCancel={() => setShowGeneratedToken(null)}
                    footer={[
                        <Button key="close" onClick={() => setShowGeneratedToken(null)}>
                            Close
                        </Button>
                    ]}
                    width={600}
                >
                    <Space direction="vertical" style={{ width: '100%' }} size={12}>
                        <Text type="secondary" style={{ fontSize: 13 }}>
                            Your new discovery token has been generated. You can copy it now:
                        </Text>
                        <Input.TextArea
                            value={showGeneratedToken || ''}
                            readOnly
                            autoSize={{ minRows: 2, maxRows: 4 }}
                            style={{ 
                                fontFamily: 'monospace', 
                                fontSize: 12,
                                background: '#f6ffed',
                                border: '1px solid #b7eb8f'
                            }}
                        />
                        <div style={{ 
                            padding: 12, 
                            background: '#e6fffb', 
                            border: '1px solid #87e8de', 
                            borderRadius: 6 
                        }}>
                            <Text style={{ fontSize: 12, color: '#13c2c2' }}>
                                <strong>Note:</strong> This token will be used by Kubernetes discovery agents to authenticate 
                                and update endpoint configurations. The token format includes your project identifier for security.
                            </Text>
                        </div>
                    </Space>
                </Modal>
            </Card>
        </>
    );
};

export default Tokens; 