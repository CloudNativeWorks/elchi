import React, { useEffect, useState } from 'react';
import { Card, Button, Input, Typography, Space, message, Divider, Statistic, Row, Col, Progress, Alert, Drawer, Tag, Collapse, Spin } from 'antd';
import { RobotOutlined, SaveOutlined, EditOutlined, DeleteOutlined, BarChartOutlined, CheckCircleOutlined, ExclamationCircleOutlined, ApiOutlined, DollarOutlined, SearchOutlined } from '@ant-design/icons';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import { useAIUsageStatus, useAIUsageStats } from '@/hooks/useAIUsage';
import { useCustomGetQuery } from '@/common/api';
import { useCustomApiMutation } from '@/common/custom-api';

const { Title, Text } = Typography;

// Model tier configuration for dynamic categorization
const MODEL_TIERS = {
    free: {
        color: 'var(--color-success)',
        label: 'Free',
        description: 'Free models - great for experimentation'
    },
    budget: {
        color: 'var(--color-primary)',
        label: 'Budget',
        description: 'Good balance of cost and performance'
    },
    premium: {
        color: 'var(--color-purple)',
        label: 'Premium',
        description: 'Best performance for critical tasks'
    }
};

const AI: React.FC = () => {
    const { project } = useProjectVariable();
    const [messageApi, contextHolder] = message.useMessage();
    const mutate = useCustomApiMutation();
    
    // OpenRouter API Key state
    const [apiKey, setApiKey] = useState('');
    const [newApiKey, setNewApiKey] = useState('');
    const [isEditingApiKey, setIsEditingApiKey] = useState(false);
    const [isLoadingApiKey, setIsLoadingApiKey] = useState(false);
    
    // Model selection state
    const [selectedModel, setSelectedModel] = useState<string>("mistralai/mistral-7b-instruct:free");
    
    // Available models from API
    const [availableModels, setAvailableModels] = useState<any[]>([]);
    
    // Model selection modal state
    const [isModelModalOpen, setIsModelModalOpen] = useState(false);
    const [tempSelectedModel, setTempSelectedModel] = useState<string>('');
    const [modelSearchText, setModelSearchText] = useState<string>('');
    
    // AI Usage hooks
    const { data: aiUsageStatus } = useAIUsageStatus();
    const { data: aiUsageStats } = useAIUsageStats();
    
    // Get OpenRouter token from settings
    const { data: openRouterToken, isLoading: isTokenLoading, refetch: refetchToken } = useCustomGetQuery({
        queryKey: `openrouter_token_${project}`,
        enabled: Boolean(project),
        path: `api/v3/setting/openrouter-token?project=${project}`,
        directApi: true
    });
    
    useEffect(() => {
        if (openRouterToken?.openrouter_token) {
            setApiKey(openRouterToken.openrouter_token);
        }
        if (openRouterToken?.ai_default_model) {
            setSelectedModel(openRouterToken.ai_default_model);
        }
    }, [openRouterToken]);
    
    const hasApiKey = Boolean(apiKey);
    
    // Get all available models from backend
    const { data: allModels, isLoading: isModelsLoading } = useCustomGetQuery({
        queryKey: `ai_models_all`,
        enabled: Boolean(project && hasApiKey),
        path: `api/v3/ai/models?project=${project}`,
        directApi: true
    });
    
    useEffect(() => {
        if (allModels?.models && Array.isArray(allModels.models)) {
            setAvailableModels(allModels.models);
        }
    }, [allModels]);
    const maskedApiKey = apiKey || '';
    
    const handleSaveApiKey = async () => {
        if (!newApiKey.trim()) {
            messageApi.warning('Please enter OpenRouter API key!');
            return;
        }
        
        if (!newApiKey.startsWith('sk-or-')) {
            messageApi.warning('OpenRouter API key must start with "sk-or-"');
            return;
        }

        setIsLoadingApiKey(true);
        try {
            const method = hasApiKey ? 'put' : 'post';
            await mutate.mutateAsync({
                data: { 
                    openrouter_token: newApiKey,
                    ai_default_model: selectedModel 
                },
                method: method,
                path: `api/v3/setting/openrouter-token?project=${project}`
            });
            
            setApiKey(newApiKey);
            setNewApiKey('');
            setIsEditingApiKey(false);
            refetchToken();
            messageApi.success('OpenRouter API key saved successfully!');
        } catch (error: any) {
            messageApi.error(error?.response?.data?.message || error?.message || 'Failed to save OpenRouter API key!');
        } finally {
            setIsLoadingApiKey(false);
        }
    };

    const handleEditApiKey = () => {
        setIsEditingApiKey(true);
        setNewApiKey('');
    };

    const handleDeleteApiKey = async () => {
        setIsLoadingApiKey(true);
        try {
            await mutate.mutateAsync({
                data: null,
                method: 'delete',
                path: `api/v3/setting/openrouter-token?project=${project}`
            });
            
            setApiKey('');
            setIsEditingApiKey(false);
            setNewApiKey('');
            refetchToken();
            messageApi.success('OpenRouter API key deleted successfully!');
        } catch (error: any) {
            messageApi.error(error?.response?.data?.message || 'Failed to delete OpenRouter API key!');
        } finally {
            setIsLoadingApiKey(false);
        }
    };

    const handleCancelEdit = () => {
        setIsEditingApiKey(false);
        setNewApiKey('');
    };

    const getModelsByTier = (tier: string) => {
        return availableModels.filter(model => {
            // First filter by tier based on dynamic model data
            let matchesTier = false;
            if (tier === 'free') {
                matchesTier = model.is_free || (model.prompt_price === "0" && model.completion_price === "0");
            } else if (tier === 'budget') {
                const promptPrice = parseFloat(model.prompt_price || "0");
                matchesTier = !model.is_free && promptPrice > 0 && promptPrice < 0.000001;
            } else if (tier === 'premium') {
                const promptPrice = parseFloat(model.prompt_price || "0");
                matchesTier = !model.is_free && promptPrice >= 0.000001;
            }
            
            if (!matchesTier) return false;
            
            // Then filter by search text if provided
            if (modelSearchText.trim()) {
                const searchLower = modelSearchText.toLowerCase();
                const nameMatch = model.name?.toLowerCase().includes(searchLower);
                const idMatch = model.id?.toLowerCase().includes(searchLower);
                return nameMatch || idMatch;
            }
            
            return true;
        });
    };

    const getModelInfo = (modelId: string) => {
        return availableModels.find(model => model.id === modelId);
    };

    const formatPrice = (price: string) => {
        if (price === "0") return "Free";
        const priceNum = parseFloat(price);
        if (priceNum < 0.000001) return `$${(priceNum * 1000000).toFixed(2)}/1M tokens`;
        return `$${priceNum.toFixed(6)}/token`;
    };

    const handleOpenModelModal = () => {
        setTempSelectedModel(selectedModel);
        setIsModelModalOpen(true);
    };

    const handleModelSelect = async () => {
        if (tempSelectedModel && tempSelectedModel !== selectedModel) {
            setIsLoadingApiKey(true);
            try {
                // Only send the model, not the token (to avoid overwriting token)
                await mutate.mutateAsync({
                    data: { 
                        ai_default_model: tempSelectedModel 
                    },
                    method: 'put',
                    path: `api/v3/setting/openrouter-token?project=${project}`
                });
                
                setSelectedModel(tempSelectedModel);
                refetchToken();
                messageApi.success('AI model updated successfully!');
            } catch (error: any) {
                messageApi.error(error?.response?.data?.message || error?.message || 'Failed to update AI model!');
            } finally {
                setIsLoadingApiKey(false);
            }
        }
        setIsModelModalOpen(false);
        setTempSelectedModel('');
        setModelSearchText('');
    };

    const handleModelCancel = () => {
        setIsModelModalOpen(false);
        setTempSelectedModel('');
        setModelSearchText('');
    };

    return (
        <>
            {contextHolder}
            <Card variant="borderless" style={{ boxShadow: 'none', background: 'transparent' }}>
                {/* Header Alert */}
                <Alert
                    message="AI Configuration"
                    description="Configure OpenRouter API access and model preferences for AI-powered features including configuration analysis and log analysis."
                    type="info"
                    showIcon
                    style={{ marginBottom: 24, borderRadius: 8 }}
                />

                {/* OpenRouter API Key Section */}
                <Title level={5} style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <ApiOutlined style={{ color: 'var(--color-primary)' }} />
                    OpenRouter API Key
                </Title>
                <Space direction="vertical" style={{ width: '100%', marginBottom: 24 }} size={12}>
                    <Text type="secondary" style={{ fontSize: 13 }}>
                        Enter your OpenRouter API key to access multiple AI models including Claude, GPT, Gemini, and Llama. 
                        Get your API key from <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer">OpenRouter.ai</a>
                    </Text>
                    
                    {isTokenLoading ? (
                        <div style={{ padding: 16, textAlign: 'center' }}>Loading token...</div>
                    ) : hasApiKey && !isEditingApiKey ? (
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 12, 
                            padding: '12px 16px',
                            background: 'var(--color-success-bg)',
                            border: '1px solid var(--color-success-border)',
                            borderRadius: 6 
                        }}>
                            <Text
                                style={{
                                    fontFamily: 'monospace',
                                    fontSize: 13,
                                    color: 'var(--color-success)',
                                    flex: 1
                                }}
                            >
                                {maskedApiKey}
                            </Text>
                            <Button
                                type="text"
                                size="small"
                                icon={<EditOutlined />}
                                onClick={handleEditApiKey}
                                style={{ color: 'var(--color-purple)' }}
                            >
                                Edit
                            </Button>
                            <Button
                                type="text"
                                size="small"
                                icon={<DeleteOutlined />}
                                onClick={handleDeleteApiKey}
                                style={{ color: 'var(--color-danger)' }}
                                danger
                            >
                                Delete
                            </Button>
                        </div>
                    ) : (
                        <Space.Compact style={{ width: '100%' }}>
                            <Input.Password
                                style={{ flex: 1, maxWidth: 400 }}
                                placeholder="sk-or-..."
                                value={newApiKey}
                                onChange={(e) => setNewApiKey(e.target.value)}
                            />
                            <Button
                                type="primary"
                                icon={<SaveOutlined />}
                                loading={isLoadingApiKey}
                                onClick={handleSaveApiKey}
                                style={{ background: 'var(--color-primary)', borderColor: 'var(--color-primary)' }}
                            >
                                {hasApiKey ? 'Update' : 'Save'}
                            </Button>
                            {isEditingApiKey && (
                                <Button 
                                    onClick={handleCancelEdit}
                                    disabled={isLoadingApiKey}
                                >
                                    Cancel
                                </Button>
                            )}
                        </Space.Compact>
                    )}
                </Space>

                {/* Model Selection Section */}
                {hasApiKey && (
                    <>
                        <Divider style={{ margin: '24px 0' }} />
                        
                        <Title level={5} style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <RobotOutlined style={{ color: 'var(--color-purple)' }} />
                            AI Model Selection
                        </Title>
                        
                        <Space direction="vertical" style={{ width: '100%', marginBottom: 24 }} size={16}>
                            <Text type="secondary" style={{ fontSize: 13 }}>
                                Select the AI model to use for all AI-powered features including configuration analysis and log analysis.
                            </Text>

                            {/* Current Selected Model */}
                            <Card size="small">
                                <Space direction="vertical" style={{ width: '100%' }} size={12}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Text strong style={{ fontSize: 14 }}>Current AI Model</Text>
                                        <Button 
                                            type="primary" 
                                            size="small"
                                            onClick={handleOpenModelModal}
                                            disabled={!hasApiKey || isModelsLoading}
                                            loading={isLoadingApiKey || isModelsLoading}
                                        >
                                            Change Model
                                        </Button>
                                    </div>
                                    
                                    {selectedModel && getModelInfo(selectedModel) ? (
                                        <div style={{ 
                                            padding: '12px 16px', 
                                            background: '#f6ffed', 
                                            border: '1px solid #b7eb8f', 
                                            borderRadius: 6 
                                        }}>
                                            <div style={{ fontWeight: 500, fontSize: 15, marginBottom: 4 }}>
                                                {getModelInfo(selectedModel)?.name}
                                            </div>
                                            <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 8 }}>
                                                {selectedModel}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <div style={{ fontSize: 11 }}>
                                                    <Text type="secondary">Context: </Text>
                                                    <Text>{getModelInfo(selectedModel)?.context_length?.toLocaleString()} tokens</Text>
                                                </div>
                                                <Tag color={getModelInfo(selectedModel)?.is_free ? 'green' : 'blue'}>
                                                    {getModelInfo(selectedModel)?.is_free ? 'Free' : 'Paid'}
                                                </Tag>
                                            </div>
                                            {!getModelInfo(selectedModel)?.is_free && (
                                                <div style={{ fontSize: 10, color: 'var(--text-tertiary)', marginTop: 4 }}>
                                                    Prompt: {formatPrice(getModelInfo(selectedModel)?.prompt_price || '0')} • 
                                                    Completion: {formatPrice(getModelInfo(selectedModel)?.completion_price || '0')}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div style={{
                                            padding: '12px 16px',
                                            background: 'var(--color-warning-bg)',
                                            border: '1px solid var(--color-warning-border)',
                                            borderRadius: 6,
                                            textAlign: 'center'
                                        }}>
                                            <Text type="secondary">No model selected</Text>
                                        </div>
                                    )}
                                </Space>
                            </Card>
                        </Space>
                    </>
                )}

                {/* AI Usage Statistics */}
                {hasApiKey && (
                    <>
                        <Divider style={{ margin: '24px 0' }} />
                        
                        <Title level={5} style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <BarChartOutlined style={{ color: 'var(--color-success)' }} />
                            AI Usage Statistics
                        </Title>
                        
                        <Card size="small">
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
                                            title="Cost This Month"
                                            value={aiUsageStats?.cost_this_month_usd || 0}
                                            precision={4}
                                            prefix={<DollarOutlined />}
                                            suffix="USD"
                                        />
                                    </Col>
                                </Row>
                            ) : (
                                <Space style={{ width: '100%', justifyContent: 'center', padding: '16px 0' }}>
                                    <ExclamationCircleOutlined style={{ color: 'var(--color-warning)' }} />
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
                                                strokeColor="var(--color-purple)"
                                            />
                                        </Col>
                                        <Col span={12}>
                                            <div style={{ marginBottom: 8 }}>
                                                <Text type="secondary" style={{ fontSize: 12 }}>Request Types</Text>
                                            </div>
                                            <Space wrap>
                                                <Text style={{ fontSize: 12 }}>
                                                    Config Analysis: {aiUsageStats.analyze_requests}
                                                </Text>
                                                <Text style={{ fontSize: 12 }}>
                                                    Log Analysis: {aiUsageStats.log_analyze_requests}
                                                </Text>
                                            </Space>
                                        </Col>
                                    </Row>
                                    {aiUsageStats.last_used && (
                                        <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-tertiary)' }}>
                                            Last used: {new Date(aiUsageStats.last_used).toLocaleString()}
                                        </div>
                                    )}
                                </div>
                            )}
                        </Card>

                    </>
                )}
            </Card>

            {/* Model Selection Drawer */}
            <Drawer
                title={
                    <Space>
                        <RobotOutlined style={{ color: 'var(--color-primary)' }} />
                        Select AI Model
                    </Space>
                }
                open={isModelModalOpen}
                onClose={handleModelCancel}
                width={600}
                placement="right"
                extra={
                    <Space>
                        <Button onClick={handleModelCancel}>Cancel</Button>
                        <Button 
                            type="primary" 
                            onClick={handleModelSelect}
                            disabled={!tempSelectedModel}
                        >
                            Select Model
                        </Button>
                    </Space>
                }
            >
                <Space direction="vertical" style={{ width: '100%' }} size={16}>
                    <Text type="secondary">
                        Choose from all available AI models. Click on a tier to expand and see models.
                    </Text>

                    {/* Search Input */}
                    <Input
                        placeholder="Search models by name or ID..."
                        prefix={<SearchOutlined style={{ color: 'var(--text-secondary)' }} />}
                        value={modelSearchText}
                        onChange={(e) => setModelSearchText(e.target.value)}
                        allowClear
                        style={{ marginBottom: 8 }}
                        disabled={isModelsLoading}
                    />

                    {isModelsLoading ? (
                        <div style={{ textAlign: 'center', padding: '40px 0' }}>
                            <Spin size="large" />
                            <div style={{ marginTop: 16, color: 'var(--text-tertiary)' }}>Loading available models...</div>
                        </div>
                    ) : availableModels.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-tertiary)' }}>
                            <Text type="secondary">No models available. Please check your OpenRouter API key.</Text>
                        </div>
                    ) : (
                        <Collapse
                        size="small"
                        ghost
                        items={Object.entries(MODEL_TIERS).map(([tier, tierInfo]) => {
                            const modelsInTier = getModelsByTier(tier);
                            if (modelsInTier.length === 0) return null;

                            return {
                                key: tier,
                                label: (
                                    <Space>
                                        <Tag color={tierInfo.color}>
                                            {tierInfo.label}
                                        </Tag>
                                        <Text type="secondary" style={{ fontSize: 12 }}>
                                            {tierInfo.description} ({modelsInTier.length} models)
                                        </Text>
                                    </Space>
                                ),
                                children: (
                                    <Row gutter={[8, 8]}>
                                        {modelsInTier.map(model => (
                                            <Col span={24} key={model.id}>
                                                <Card
                                                    size="small"
                                                    style={{
                                                        cursor: 'pointer',
                                                        border: tempSelectedModel === model.id ? `2px solid ${tierInfo.color}` : '1px solid var(--border-default)',
                                                        background: tempSelectedModel === model.id ? tierInfo.color + '15' : 'var(--bg-surface)'
                                                    }}
                                                    onClick={() => setTempSelectedModel(model.id)}
                                                    hoverable
                                                >
                                                    <Space direction="vertical" size={4} style={{ width: '100%' }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                            <Text strong style={{ fontSize: 13 }}>{model.name}</Text>
                                                            {model.is_free && (
                                                                <Tag color="green">FREE</Tag>
                                                            )}
                                                        </div>
                                                        
                                                        <Text type="secondary" style={{ fontSize: 11 }}>
                                                            {model.id}
                                                        </Text>
                                                        
                                                        <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
                                                            <div>Context: {model.context_length?.toLocaleString()} tokens</div>
                                                            {!model.is_free && (
                                                                <div>
                                                                    Prompt: {formatPrice(model.prompt_price)} • 
                                                                    Completion: {formatPrice(model.completion_price)}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </Space>
                                                </Card>
                                            </Col>
                                        ))}
                                    </Row>
                                )
                            };
                        }).filter(Boolean)}
                        />
                    )}
                </Space>
            </Drawer>
        </>
    );
};

export default AI;