import React, { useEffect, useState } from 'react';
import { Card, Button, Input, List, Modal, Typography, Space, message } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useCustomGetQuery } from '@/common/api';
import { useCustomApiMutation } from '@/common/custom-api';
import { useProjectVariable } from '@/hooks/useProjectVariable';

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

    // Tokenları çek
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

    // Token oluştur
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

    // Token sil
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

    return (
        <>
            {contextHolder}
            <Card variant="borderless" style={{ boxShadow: 'none', background: 'transparent' }}>
                <Title level={5} style={{ marginBottom: 16 }}>Client Tokens</Title>
                <Space direction="vertical" style={{ width: '100%' }} size={16}>
                    <Space.Compact>
                        <Input
                            style={{ width: 240 }}
                            placeholder="New token name"
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
                            Create
                        </Button>
                    </Space.Compact>
                    <div style={{ marginTop: 16 }}>
                        {isLoading ? (
                            <div style={{ textAlign: 'center', padding: '40px 0' }}>
                                <div style={{ color: '#8c8c8c' }}>Loading tokens...</div>
                            </div>
                        ) : tokens.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px 0', background: '#fafafa', borderRadius: 8, border: '1px dashed #d9d9d9' }}>
                                <div style={{ color: '#8c8c8c', fontSize: 14 }}>No tokens yet.</div>
                                <div style={{ color: '#bfbfbf', fontSize: 12, marginTop: 4 }}>Create your first token to get started</div>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {tokens.map((item, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            background: '#fafafa',
                                            border: '1px solid #f0f0f0',
                                            borderRadius: 8,
                                            padding: '16px 20px',
                                            transition: 'all 0.2s ease',
                                            cursor: 'default'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = '#f5f5f5';
                                            e.currentTarget.style.borderColor = '#d9d9d9';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = '#fafafa';
                                            e.currentTarget.style.borderColor = '#f0f0f0';
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                                                    <Text strong style={{ fontSize: 15, color: '#2c3e50' }}>{item.name}</Text>
                                                    <div style={{
                                                        background: '#056ccd',
                                                        color: 'white',
                                                        fontSize: 10,
                                                        padding: '2px 6px',
                                                        borderRadius: 4,
                                                        fontWeight: 500,
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '0.5px'
                                                    }}>
                                                        API KEY
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                                    <Text 
                                                        type="secondary" 
                                                        style={{ 
                                                            fontFamily: 'monospace', 
                                                            fontSize: 13, 
                                                            background: '#fff',
                                                            padding: '4px 8px',
                                                            borderRadius: 4,
                                                            border: '1px solid #e8e8e8',
                                                            minWidth: 280
                                                        }}
                                                    >
                                                        {item.token}
                                                    </Text>
                                                    {item.created_at && (
                                                        <Text type="secondary" style={{ fontSize: 12, color: '#8c8c8c' }}>
                                                            Created: {new Date(item.created_at).toLocaleDateString()}
                                                        </Text>
                                                    )}
                                                </div>
                                            </div>
                                            <div style={{ marginLeft: 16 }}>
                                                <Button
                                                    type="text"
                                                    icon={<DeleteOutlined />}
                                                    size="small"
                                                    danger
                                                    onClick={() => handleDeleteToken(item.name, item._id || item.id)}
                                                    style={{
                                                        color: '#ff4d4f',
                                                        borderColor: 'transparent',
                                                        background: 'transparent'
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
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
            </Card>
        </>
    );
};

export default Tokens; 