import React, { useState, useEffect } from 'react';
import {
    Card,
    Steps,
    Button,
    Form,
    Input,
    Select,
    Checkbox,
    Typography,
    Space,
    Alert,
    Spin,
    Badge,
    Row,
    Col,
    Collapse,
    message
} from 'antd';
import {
    RobotOutlined,
    ThunderboltOutlined,
    SettingOutlined,
    CheckCircleOutlined,
    InfoCircleOutlined,
    ExclamationCircleOutlined,
    ArrowLeftOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import useAIConfigGenerator, { ConfigRequest, ConfigResponse } from '@/hooks/useAIConfigGenerator';
import { useProjectVariable } from '@/hooks/useProjectVariable';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { Panel } = Collapse;

interface FormData extends ConfigRequest {
    selected_resources?: string[];
}

const AIConfigGenerator: React.FC = () => {
    const navigate = useNavigate();
    const { project } = useProjectVariable();
    const {
        useAIStatus,
        useConfigTemplate,
        useGenerateConfig,
        useApplyConfigs
    } = useAIConfigGenerator();

    const [form] = Form.useForm();
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState<FormData>({
        project: project || '',
        requirements: '',
        language: 'tr',
        proxy_type: 'envoy',
        resource_types: [],
        complexity: 'basic',
        include_security: false,
        include_observability: false
    });
    const [generatedConfig, setGeneratedConfig] = useState<ConfigResponse | null>(null);

    // API hooks
    const { data: aiStatus, isLoading: statusLoading } = useAIStatus();
    const generateConfigMutation = useGenerateConfig();
    const applyConfigsMutation = useApplyConfigs();

    const steps = [
        {
            title: 'Requirements',
            description: 'Describe your needs',
            icon: <RobotOutlined />
        },
        {
            title: 'Configuration',
            description: 'Set preferences',
            icon: <SettingOutlined />
        },
        {
            title: 'Generation',
            description: 'AI generates config',
            icon: <ThunderboltOutlined />
        },
        {
            title: 'Review & Apply',
            description: 'Select and apply',
            icon: <CheckCircleOutlined />
        }
    ];

    const resourceTypes = [
        { label: 'Listeners', value: 'listener' },
        { label: 'Clusters', value: 'cluster' },
        { label: 'Routes', value: 'route' },
        { label: 'Virtual Hosts', value: 'virtual_host' },
        { label: 'Endpoints', value: 'endpoint' },
        { label: 'HTTP Filters', value: 'http_filter' },
        { label: 'Network Filters', value: 'network_filter' },
        { label: 'TLS Contexts', value: 'tls_context' },
        { label: 'Secrets', value: 'secret' }
    ];

    useEffect(() => {
        if (project) {
            setFormData(prev => ({ ...prev, project }));
            form.setFieldValue('project', project);
        }
    }, [project, form]);

    const handleRequirementsSubmit = (values: any) => {
        const updatedData = {
            ...formData,
            requirements: values.requirements,
            language: values.language || 'tr'
        };
        setFormData(updatedData);
        setCurrentStep(1);
    };

    const handleConfigurationSubmit = (values: any) => {
        const updatedData = {
            ...formData,
            proxy_type: values.proxy_type || 'envoy',
            resource_types: values.resource_types || [],
            complexity: values.complexity || 'basic',
            include_security: values.include_security || false,
            include_observability: values.include_observability || false
        };
        setFormData(updatedData);
        setCurrentStep(2);
        
        // Auto-start generation
        handleGenerate(updatedData);
    };

    const handleGenerate = async (data: ConfigRequest) => {
        try {
            const result = await generateConfigMutation.mutateAsync(data);
            setGeneratedConfig(result);
            setCurrentStep(3);
        } catch (error) {
            console.error('Generation failed:', error);
        }
    };

    const handleApplyConfigs = async () => {
        if (!generatedConfig || !formData.selected_resources?.length) {
            message.warning('Please select at least one resource to apply');
            return;
        }

        try {
            await applyConfigsMutation.mutateAsync({
                project: formData.project,
                request_id: generatedConfig.request_id,
                selected_resources: formData.selected_resources,
                overwrite_existing: true
            });
            
            message.success('Configurations applied successfully!');
            navigate('/');
        } catch (error) {
            console.error('Apply failed:', error);
        }
    };

    const handleResourceSelection = (resourceNames: string[]) => {
        setFormData(prev => ({
            ...prev,
            selected_resources: resourceNames
        }));
    };

    if (statusLoading) {
        return (
            <div style={{ padding: '50px', textAlign: 'center' }}>
                <Spin size="large" />
                <div style={{ marginTop: '20px' }}>
                    <Text>Loading AI Configuration Generator...</Text>
                </div>
            </div>
        );
    }

    if (!aiStatus?.available) {
        return (
            <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
                <Alert
                    message="AI Configuration Generator Unavailable"
                    description="The AI service is currently unavailable. Please check your configuration or try again later."
                    type="warning"
                    showIcon
                    action={
                        <Button onClick={() => navigate('/')}>
                            Return to Dashboard
                        </Button>
                    }
                />
            </div>
        );
    }

    const renderRequirementsStep = () => (
        <Card title="Describe Your Requirements">
            <Form
                form={form}
                layout="vertical"
                onFinish={handleRequirementsSubmit}
                initialValues={{
                    language: formData.language,
                    requirements: formData.requirements
                }}
            >
                <Alert
                    message="AI-Powered Configuration Generation"
                    description="Describe what you want to achieve in natural language. The AI will generate appropriate Envoy proxy configurations based on your requirements."
                    type="info"
                    showIcon
                    style={{ marginBottom: '24px' }}
                />

                <Form.Item
                    name="requirements"
                    label="Requirements Description"
                    rules={[
                        { required: true, message: 'Please describe your requirements' },
                        { min: 20, message: 'Please provide more detailed requirements (minimum 20 characters)' }
                    ]}
                    extra="Describe your proxy requirements, traffic patterns, security needs, and any specific features you need."
                >
                    <TextArea
                        rows={8}
                        placeholder="Example: I need an HTTP proxy that routes traffic to 3 different backend services based on URL paths. Service A handles /api/users, Service B handles /api/orders, and Service C handles everything else. I need basic authentication and want to add rate limiting to prevent abuse."
                        showCount
                        maxLength={2000}
                    />
                </Form.Item>

                <Form.Item
                    name="language"
                    label="Response Language"
                >
                    <Select>
                        <Option value="tr">Turkish</Option>
                        <Option value="en">English</Option>
                    </Select>
                </Form.Item>

                <Form.Item>
                    <Space>
                        <Button onClick={() => navigate('/')}>
                            <ArrowLeftOutlined /> Back to Dashboard
                        </Button>
                        <Button type="primary" htmlType="submit">
                            Next: Configuration Options
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Card>
    );

    const renderConfigurationStep = () => (
        <Card title="Configuration Preferences">
            <Form
                form={form}
                layout="vertical"
                onFinish={handleConfigurationSubmit}
                initialValues={{
                    proxy_type: formData.proxy_type,
                    resource_types: formData.resource_types,
                    complexity: formData.complexity,
                    include_security: formData.include_security,
                    include_observability: formData.include_observability
                }}
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="proxy_type"
                            label="Proxy Type"
                        >
                            <Select>
                                <Option value="envoy">Envoy Proxy</Option>
                                <Option value="nginx" disabled>NGINX (Coming Soon)</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="complexity"
                            label="Configuration Complexity"
                        >
                            <Select>
                                <Option value="basic">Basic - Simple setup</Option>
                                <Option value="intermediate">Intermediate - Balanced features</Option>
                                <Option value="advanced">Advanced - Full features</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    name="resource_types"
                    label="Resource Types to Generate"
                    extra="Leave empty to let AI decide based on requirements"
                >
                    <Checkbox.Group>
                        <Row gutter={[16, 8]}>
                            {resourceTypes.map(type => (
                                <Col span={8} key={type.value}>
                                    <Checkbox value={type.value}>
                                        {type.label}
                                    </Checkbox>
                                </Col>
                            ))}
                        </Row>
                    </Checkbox.Group>
                </Form.Item>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="include_security" valuePropName="checked">
                            <Checkbox>
                                Include Security Features
                            </Checkbox>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="include_observability" valuePropName="checked">
                            <Checkbox>
                                Include Observability Features
                            </Checkbox>
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item>
                    <Space>
                        <Button onClick={() => setCurrentStep(0)}>
                            Previous: Requirements
                        </Button>
                        <Button type="primary" htmlType="submit">
                            Generate Configuration
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Card>
    );

    const renderGenerationStep = () => (
        <Card title="AI Configuration Generation">
            <div style={{ textAlign: 'center', padding: '40px' }}>
                {generateConfigMutation.isPending ? (
                    <>
                        <Spin size="large" />
                        <div style={{ marginTop: '20px' }}>
                            <Title level={4}>Generating Configuration...</Title>
                            <Text type="secondary">
                                AI is analyzing your requirements and generating optimized Envoy configurations.
                                This may take a few moments.
                            </Text>
                        </div>
                    </>
                ) : generateConfigMutation.isError ? (
                    <>
                        <ExclamationCircleOutlined style={{ fontSize: '48px', color: '#ff4d4f', marginBottom: '16px' }} />
                        <Title level={4}>Generation Failed</Title>
                        <Text type="secondary">
                            Failed to generate configuration. Please check your requirements and try again.
                        </Text>
                        <div style={{ marginTop: '20px' }}>
                            <Space>
                                <Button onClick={() => setCurrentStep(1)}>
                                    Back to Configuration
                                </Button>
                                <Button type="primary" onClick={() => handleGenerate(formData)}>
                                    Retry Generation
                                </Button>
                            </Space>
                        </div>
                    </>
                ) : generatedConfig ? (
                    <>
                        <CheckCircleOutlined style={{ fontSize: '48px', color: '#52c41a', marginBottom: '16px' }} />
                        <Title level={4}>Configuration Generated Successfully!</Title>
                        <Text type="secondary">
                            {generatedConfig.resources.length} resources have been generated.
                        </Text>
                        <div style={{ marginTop: '20px' }}>
                            <Button type="primary" onClick={() => setCurrentStep(3)}>
                                Review Configuration
                            </Button>
                        </div>
                    </>
                ) : null}
            </div>
        </Card>
    );

    const renderReviewStep = () => (
        <div>
            <Card title="Generated Configuration" style={{ marginBottom: '16px' }}>
                {generatedConfig && (
                    <div>
                        <Alert
                            message="Configuration Summary"
                            description={generatedConfig.explanation}
                            type="success"
                            showIcon
                            style={{ marginBottom: '16px' }}
                        />

                        {generatedConfig.warnings && generatedConfig.warnings.length > 0 && (
                            <Alert
                                message="Warnings"
                                description={
                                    <ul style={{ marginBottom: 0 }}>
                                        {generatedConfig.warnings.map((warning, index) => (
                                            <li key={index}>{warning}</li>
                                        ))}
                                    </ul>
                                }
                                type="warning"
                                showIcon
                                style={{ marginBottom: '16px' }}
                            />
                        )}

                        <Collapse defaultActiveKey={['0']}>
                            {generatedConfig.resources.map((resource, index) => (
                                <Panel
                                    header={
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <Checkbox
                                                checked={formData.selected_resources?.includes(resource.name) || false}
                                                onChange={(e) => {
                                                    const selected = formData.selected_resources || [];
                                                    if (e.target.checked) {
                                                        handleResourceSelection([...selected, resource.name]);
                                                    } else {
                                                        handleResourceSelection(selected.filter(name => name !== resource.name));
                                                    }
                                                }}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                            <Badge status="processing" />
                                            <span style={{ fontWeight: 'bold' }}>{resource.name}</span>
                                            <span style={{ color: '#666' }}>({resource.type})</span>
                                            {resource.description && (
                                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                                    - {resource.description}
                                                </Text>
                                            )}
                                        </div>
                                    }
                                    key={index}
                                >
                                    <div style={{ border: '1px solid #d9d9d9', borderRadius: '6px' }}>
                                        <Editor
                                            height="300px"
                                            language="json"
                                            theme="vs-light"
                                            value={JSON.stringify(resource.config, null, 2)}
                                            options={{
                                                readOnly: true,
                                                minimap: { enabled: false },
                                                scrollBeyondLastLine: false,
                                                fontSize: 13
                                            }}
                                        />
                                    </div>
                                    {resource.dependencies && resource.dependencies.length > 0 && (
                                        <div style={{ marginTop: '12px' }}>
                                            <Text strong>Dependencies: </Text>
                                            {resource.dependencies.map((dep, i) => (
                                                <span key={i}>
                                                    <Text code>{dep}</Text>
                                                    {i < resource.dependencies!.length - 1 && ', '}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </Panel>
                            ))}
                        </Collapse>

                        {generatedConfig.usage && (
                            <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '6px' }}>
                                <Text type="secondary">
                                    <InfoCircleOutlined style={{ marginRight: '8px' }} />
                                    AI Usage: {generatedConfig.usage.tokens_used} tokens 
                                    (Estimated cost: ${generatedConfig.usage.estimated_cost.toFixed(4)})
                                </Text>
                            </div>
                        )}

                        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Button onClick={() => setCurrentStep(1)}>
                                Back to Configuration
                            </Button>
                            
                            <Space>
                                <Button
                                    onClick={() => {
                                        const allResourceNames = generatedConfig.resources.map(r => r.name);
                                        handleResourceSelection(allResourceNames);
                                    }}
                                >
                                    Select All
                                </Button>
                                <Button
                                    onClick={() => handleResourceSelection([])}
                                >
                                    Deselect All
                                </Button>
                                <Button
                                    type="primary"
                                    loading={applyConfigsMutation.isPending}
                                    onClick={handleApplyConfigs}
                                    disabled={!formData.selected_resources?.length}
                                >
                                    Apply Selected ({formData.selected_resources?.length || 0})
                                </Button>
                            </Space>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );

    return (
        <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ marginBottom: '32px' }}>
                <Title level={2}>
                    <RobotOutlined style={{ marginRight: '12px' }} />
                    AI Configuration Generator
                </Title>
                <Paragraph type="secondary">
                    Generate production-ready Envoy proxy configurations using AI. 
                    Describe your requirements in natural language and let AI create optimized configurations.
                </Paragraph>
                
                {aiStatus && (
                    <Alert
                        message={
                            <span>
                                AI Service Status: <Badge status="processing" text={`${aiStatus.provider} - ${aiStatus.model}`} />
                            </span>
                        }
                        type="info"
                        showIcon
                        style={{ marginTop: '16px' }}
                    />
                )}
            </div>

            {/* Steps */}
            <Card style={{ marginBottom: '24px' }}>
                <Steps
                    current={currentStep}
                    items={steps}
                    style={{ maxWidth: '800px', margin: '0 auto' }}
                />
            </Card>

            {/* Step Content */}
            {currentStep === 0 && renderRequirementsStep()}
            {currentStep === 1 && renderConfigurationStep()}
            {currentStep === 2 && renderGenerationStep()}
            {currentStep === 3 && renderReviewStep()}
        </div>
    );
};

export default AIConfigGenerator;