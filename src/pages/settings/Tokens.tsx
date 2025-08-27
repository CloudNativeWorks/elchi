import React, { useEffect, useState } from 'react';
import { Card, Button, Input, Modal, Typography, Space, message, Divider } from 'antd';
import { PlusOutlined, DeleteOutlined, ApiOutlined, ThunderboltOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { useCustomGetQuery } from '@/common/api';
import { useCustomApiMutation } from '@/common/custom-api';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import { useDiscoveryToken } from '@/hooks/useDiscoveryToken';

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
    
    const {
        token: discoveryToken,
        hasToken: hasDiscoveryToken,
        isLoading: isDiscoveryTokenLoading,
        error: discoveryTokenError,
        deleteToken: deleteDiscoveryTokenFn,
        generateToken: generateDiscoveryToken
    } = useDiscoveryToken();
    
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
                    messageApi.error(error.response?.data?.message || 'Token not created!');
                }
            });
        } catch (error: any) {
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
                    messageApi.error(error.response?.data?.message || 'Failed to delete token!');
                }
            });
        } catch (error: any) {
            messageApi.error(error.response?.data?.message || 'Failed to delete token!');
        }
    };

    const hideDeleteModal = () => {
        setDeleteModal({ visible: false, tokenName: '', tokenId: null });
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
                            value={showGeneratedToken}
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