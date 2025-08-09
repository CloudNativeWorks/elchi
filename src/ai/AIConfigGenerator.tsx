import React, { useState, useEffect } from 'react';
import {
  Card,
  Select,
  Input,
  Button,
  message,
  Spin,
  Space,
  Typography,
  Alert,
  Switch,
  List,
  Tag,
  Collapse,
  Statistic,
  Row,
  Col
} from 'antd';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import {
  RobotOutlined,
  InfoCircleOutlined,
  BulbOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  CheckOutlined,
} from '@ant-design/icons';

import { useAnalyzeConfigMutation, useAvailableResources, useResourceCollections, useAIStatus } from './hooks/useAIMutations';
import { COMPONENT_TYPES } from '../types/aiConfig';
import type { ConfigAnalyzerRequest, ConfigAnalysisResult } from '../types/aiConfig';

// Simple AI Analysis Renderer Component
export const AIAnalysisRenderer: React.FC<{ analysis: string }> = ({ analysis }) => {
  
  // Parse the analysis text to extract sections
  const parseAnalysisSection = (text: string) => {
    const sections = [];
    const lines = text.split('\n');
    let currentSection: { title: string; content: string; type: string } | null = null;
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Check for section headers - enhanced for log analysis
      if (trimmedLine.startsWith('**LOG SUMMARY:**')) {
        if (currentSection) sections.push(currentSection);
        currentSection = { title: 'Log Summary', content: '', type: 'summary' };
      } else if (trimmedLine.startsWith('**DETECTED ERRORS:**')) {
        if (currentSection) sections.push(currentSection);
        currentSection = { title: 'Detected Errors', content: '', type: 'errors' };
      } else if (trimmedLine.startsWith('**ANALYSIS:**') || trimmedLine.startsWith('**ANALİZ:**')) {
        if (currentSection) sections.push(currentSection);
        currentSection = { title: 'Analysis', content: '', type: 'analysis' };
      } else if (trimmedLine.startsWith('**ROOT CAUSE ANALYSIS:**')) {
        if (currentSection) sections.push(currentSection);
        currentSection = { title: 'Root Cause Analysis', content: '', type: 'root_cause' };
      } else if (trimmedLine.startsWith('**SOLUTION RECOMMENDATIONS (UI):**') || trimmedLine.startsWith('**SOLUTION RECOMMENDATIONS:**')) {
        if (currentSection) sections.push(currentSection);
        currentSection = { title: 'Solution Recommendations', content: '', type: 'solutions' };
      } else if (trimmedLine.startsWith('**YAML CONFIGURATION:**') || trimmedLine.startsWith('**YAML KONFİGÜRASYON:**')) {
        if (currentSection) sections.push(currentSection);
        currentSection = { title: 'YAML Configuration', content: '', type: 'yaml' };
      } else if (trimmedLine.startsWith('**MONITORING RECOMMENDATIONS:**')) {
        if (currentSection) sections.push(currentSection);
        currentSection = { title: 'Monitoring Recommendations', content: '', type: 'monitoring' };
      } else if (trimmedLine.startsWith('**NEXT STEPS:**')) {
        if (currentSection) sections.push(currentSection);
        currentSection = { title: 'Next Steps', content: '', type: 'next_steps' };
      } else if (trimmedLine.startsWith('**KULLANICI SORUSUNA YANIT:**') || trimmedLine.startsWith('**ANSWER TO USER QUESTION:**')) {
        if (currentSection) sections.push(currentSection);
        currentSection = { title: 'Step-by-Step Instructions', content: '', type: 'answer' };
      } else if (trimmedLine.startsWith('**ÖNERİLER:**') || trimmedLine.startsWith('**SUGGESTIONS:**')) {
        if (currentSection) sections.push(currentSection);
        currentSection = { title: 'Suggestions', content: '', type: 'suggestions' };
      } else if (trimmedLine.startsWith('**DİKKAT EDİLMESİ GEREKENLER:**') || trimmedLine.startsWith('**IMPORTANT CONSIDERATIONS:**')) {
        if (currentSection) sections.push(currentSection);
        currentSection = { title: 'Important Considerations', content: '', type: 'warnings' };
      } else if (currentSection) {
        // Add the line to current section, preserving newlines
        currentSection.content += line + '\n';
      }
    }
    
    if (currentSection) sections.push(currentSection);
    return sections;
  };

  const sections = parseAnalysisSection(analysis);

  const getSectionIcon = (type: string) => {
    switch (type) {
      case 'summary': return <InfoCircleOutlined style={{ color: '#1890ff' }} />;
      case 'errors': return <WarningOutlined style={{ color: '#ff4d4f' }} />;
      case 'analysis': return <BulbOutlined style={{ color: '#1890ff' }} />;
      case 'root_cause': return <InfoCircleOutlined style={{ color: '#fa541c' }} />;
      case 'solutions': return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'monitoring': return <InfoCircleOutlined style={{ color: '#13c2c2' }} />;
      case 'next_steps': return <CheckOutlined style={{ color: '#722ed1' }} />;
      case 'answer': return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'yaml': return <InfoCircleOutlined style={{ color: '#13c2c2' }} />;
      case 'suggestions': return <BulbOutlined style={{ color: '#722ed1' }} />;
      case 'warnings': return <WarningOutlined style={{ color: '#fa8c16' }} />;
      default: return <InfoCircleOutlined style={{ color: '#8c8c8c' }} />;
    }
  };

  const getSectionStyle = (type: string) => {
    const baseStyle = {
      borderRadius: 12,
      marginBottom: 16,
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
      border: '1px solid #f0f0f0',
      position: 'relative' as const,
      background: '#ffffff'
    };

    const borderColors = {
      summary: '#1890ff',
      errors: '#ff4d4f',
      analysis: '#1890ff',
      root_cause: '#fa541c',
      solutions: '#52c41a',
      monitoring: '#13c2c2',
      next_steps: '#722ed1',
      answer: '#52c41a',
      yaml: '#13c2c2', 
      suggestions: '#722ed1',
      warnings: '#fa8c16'
    };

    const borderColor = borderColors[type] || '#d9d9d9';

    return { 
      ...baseStyle,
      borderLeft: `4px solid ${borderColor}`
    };
  };

  if (sections.length === 0) {
    // Fallback for unstructured text
    return (
      <Card
        style={{
          background: '#ffffff',
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
          border: '1px solid #f0f0f0',
          borderLeft: '4px solid #1890ff'
        }}
        styles={{ body: { padding: 20 } }}
      >
        <Space style={{ marginBottom: 16 }}>
          <BulbOutlined style={{ color: '#1890ff' }} />
          <Typography.Title level={4} style={{ margin: 0, color: '#262626' }}>
            AI Analysis
          </Typography.Title>
        </Space>
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]} 
          rehypePlugins={[rehypeRaw]}
          components={{
            code: ({ children, className }) => {
              const isInline = !className;
              const language = className ? className.replace('language-', '') : '';

              if (isInline) {
                return (
                  <Typography.Text
                    code
                    style={{
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                      color: '#d63384',
                      padding: '2px 6px',
                      borderRadius: 4,
                      fontSize: 13
                    }}
                  >
                    {children}
                  </Typography.Text>
                );
              }

              return (
                <div style={{ position: 'relative', marginBottom: 16 }}>
                  {language && (
                    <div style={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      background: 'rgba(0, 0, 0, 0.7)',
                      color: '#fff',
                      padding: '2px 8px',
                      borderRadius: 4,
                      fontSize: 12,
                      zIndex: 1
                    }}>
                      {language.toUpperCase()}
                    </div>
                  )}
                  <pre style={{
                    backgroundColor: '#f6f8fa',
                    padding: 16,
                    borderRadius: 8,
                    overflow: 'auto',
                    border: '1px solid #e1e4e8',
                    fontSize: 13,
                    margin: 0,
                    fontFamily: 'SFMono-Regular, Monaco, Consolas, monospace',
                    lineHeight: '1.45'
                  }}>
                    <code>{children}</code>
                  </pre>
                </div>
              );
            }
          }}
        >
          {analysis}
        </ReactMarkdown>
      </Card>
    );
  }

  return (
    <Space direction="vertical" style={{ width: '100%' }} size={16}>
      {sections.map((section, index) => (
        <Card
          key={index}
          style={getSectionStyle(section.type)}
          styles={{ body: { padding: 20 } }}
        >
          <Space style={{ marginBottom: 16 }}>
            {getSectionIcon(section.type)}
            <Typography.Title level={4} style={{ 
              margin: 0, 
              color: '#262626'
            }}>
              {section.title}
            </Typography.Title>
          </Space>
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]} 
            rehypePlugins={[rehypeRaw]}
            components={{
              code: ({ children, className }) => {
                const isInline = !className;
                const language = className ? className.replace('language-', '') : '';

                if (isInline) {
                  return (
                    <Typography.Text
                      code
                      style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        color: '#d63384',
                        padding: '2px 6px',
                        borderRadius: 4,
                        fontSize: 13
                      }}
                    >
                      {children}
                    </Typography.Text>
                  );
                }

                return (
                  <div style={{ position: 'relative', marginBottom: 16 }}>
                    {language && (
                      <div style={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        background: 'rgba(0, 0, 0, 0.7)',
                        color: '#fff',
                        padding: '2px 8px',
                        borderRadius: 4,
                        fontSize: 12,
                        zIndex: 1
                      }}>
                        {language.toUpperCase()}
                      </div>
                    )}
                    <pre style={{
                      backgroundColor: '#f6f8fa',
                      padding: 16,
                      borderRadius: 8,
                      overflow: 'auto',
                      border: '1px solid #e1e4e8',
                      fontSize: 13,
                      margin: 0,
                      fontFamily: 'SFMono-Regular, Monaco, Consolas, monospace',
                      lineHeight: '1.45'
                    }}>
                      <code>{children}</code>
                    </pre>
                  </div>
                );
              }
            }}
          >
            {section.content.trim()}
          </ReactMarkdown>
        </Card>
      ))}
    </Space>
  );
};

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { Panel } = Collapse;

// Tip güvenliği için birleşik kaynak türü seçeneği
interface ResourceTypeOption {
  key: string;
  displayName: string;
  description: string;
  collection: string;
  isComponent: boolean;
  gtype?: string;
  filterType?: string;
}

const AIConfigAnalyzer: React.FC = () => {
  const [selectedResourceType, setSelectedResourceType] = useState<string>('');
  const [selectedResource, setSelectedResource] = useState<string>('');
  const [question, setQuestion] = useState('');
  const [includeDependencies, setIncludeDependencies] = useState(true);
  const [analysisResult, setAnalysisResult] = useState<ConfigAnalysisResult | null>(null);

  // API hooks
  const analyzeConfigMutation = useAnalyzeConfigMutation();
  const { data: availableResources, isLoading: resourcesLoading } = useAvailableResources(
    selectedResourceType,
    !!selectedResourceType
  );
  const { data: aiStatus } = useAIStatus();

  // Combine standard collections with component types
  const allResourceTypes: ResourceTypeOption[] = [
    ...(useResourceCollections().data || []).map(col => ({
      key: col.name,
      displayName: col.displayName,
      description: col.description,
      collection: col.name,
      isComponent: false
    })),
    ...COMPONENT_TYPES.map(comp => ({
      key: comp.gtype,
      displayName: `${comp.displayName}`,
      description: comp.description,
      collection: comp.collection,
      isComponent: true,
      gtype: comp.gtype,
      filterType: comp.category
    }))
  ];

  const loading = analyzeConfigMutation.isPending;
  const error = analyzeConfigMutation.error?.message;

  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (analysisResult) {
      message.success('Configuration analysis completed successfully!');
    }
  }, [analysisResult]);

  const handleAnalyze = async () => {
    if (!selectedResourceType) {
      message.warning('Please select a resource type');
      return;
    }

    if (!selectedResource) {
      message.warning('Please select a resource to analyze');
      return;
    }

    if (!question.trim()) {
      message.warning('Please enter your question about the configuration');
      return;
    }

    const selectedResourceData = availableResources?.find(r => r.name === selectedResource);
    if (!selectedResourceData) {
      message.error('Selected resource not found');
      return;
    }

    const resourceTypeInfo = allResourceTypes.find(rt => rt.key === selectedResourceType);
    if (!resourceTypeInfo) {
      message.error('Resource type information not found');
      return;
    }

    const request: ConfigAnalyzerRequest = {
      resource_name: selectedResource,
      collection: resourceTypeInfo.collection,
      project: selectedResourceData.project,
      version: selectedResourceData.version,
      question: question.trim(),
      include_dependencies: includeDependencies,
      depth: 3
    };

    try {
      const result = await analyzeConfigMutation.mutateAsync(request);
      setAnalysisResult(result);
    } catch (err: any) {
      message.error(`Analysis failed: ${err.message}`);
    }
  };

  const handleReset = () => {
    setSelectedResourceType('');
    setSelectedResource('');
    setQuestion('');
    setAnalysisResult(null);
    setIncludeDependencies(true);
  };

  // Reset selected resource when resource type changes
  const handleResourceTypeChange = (resourceType: string) => {
    setSelectedResourceType(resourceType);
    setSelectedResource(''); // Clear selected resource
  };

  // Show AI status warning if not available
  if (aiStatus && !aiStatus.available) {
    return (
      <Card>
        <Alert
          message="AI Service Not Available"
          description={aiStatus.message || 'Please configure Claude API token in Settings > Tokens'}
          type="warning"
          showIcon
          icon={<RobotOutlined />}
        />
      </Card>
    );
  }

  return (
    <div style={{ width: '100%', margin: '3px auto', padding: 0 }}>
      <Card style={{ borderRadius: 14, boxShadow: '0 2px 8px rgba(24,144,255,0.10)', background: '#ffffff' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
            <span style={{ display: 'flex', alignItems: 'center' }}>
              <RobotOutlined style={{ color: '#056ccd', fontSize: 28, marginRight: 6 }} />
            </span>
            <Typography.Title level={4} style={{ margin: 0 }}>AI Configuration Analyzer</Typography.Title>
          </div>
          {analysisResult && (
            <Button onClick={handleReset}>
              New Analysis
            </Button>
          )}
        </div>
        {!analysisResult ? (
          // Analysis Form
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Alert
              message="Analyze Your Envoy Configurations with AI"
              description="Select a resource from your project and ask questions about its configuration, dependencies, and potential improvements."
              type="info"
              showIcon
              icon={<InfoCircleOutlined />}
            />

            <div>
              <Title level={5}>Select Resource Type</Title>
              <Select
                style={{ width: '100%' }}
                placeholder="Choose resource or component type to analyze"
                value={selectedResourceType}
                onChange={handleResourceTypeChange}
                showSearch
                optionFilterProp="label"
              >
                {allResourceTypes?.map((resourceType) => (
                  <Option
                    key={resourceType.key}
                    value={resourceType.key}
                    label={resourceType.displayName}
                    title={resourceType.description}
                  >
                    <Space>
                      <Text strong>{resourceType.displayName}</Text>
                      {resourceType.isComponent && (
                        <Text type="secondary" style={{ fontSize: 11 }}>
                          ({resourceType.filterType})
                        </Text>
                      )}
                    </Space>
                  </Option>
                ))}
              </Select>
            </div>

            <div>
              <Title level={5}>Select Resource to Analyze</Title>
              <Select
                style={{ width: '100%' }}
                placeholder={selectedResourceType ? `Choose a resource from your project` : "Select resource type first"}
                value={selectedResource}
                onChange={setSelectedResource}
                loading={resourcesLoading}
                disabled={!selectedResourceType}
                showSearch
                optionFilterProp="label"
              >
                {availableResources?.map((resource) => (
                  <Option key={`${resource.name}-${resource.version}`} value={resource.name} label={resource.name}>
                    <Space>
                      <Text strong>{resource.name}</Text>
                      <Tag color="blue">{resource.version}</Tag>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {new Date(resource.created_at).toLocaleDateString()}
                      </Text>
                    </Space>
                  </Option>
                ))}
              </Select>
            </div>

            <div>
              <Title level={5}>Your Question</Title>
              <TextArea
                rows={4}
                placeholder="Ask about the configuration, security, performance, or any improvements you'd like to know about..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                maxLength={500}
                showCount
              />
              <div style={{ marginTop: 8 }}>
                <Text type="secondary">Example questions:</Text>
                <ul style={{ marginTop: 4, marginLeft: 16 }}>
                  <li><Text type="secondary">What filters are configured and what do they do?</Text></li>
                  <li><Text type="secondary">Are there any security vulnerabilities?</Text></li>
                  <li><Text type="secondary">How can I improve the performance?</Text></li>
                  <li><Text type="secondary">What are the dependencies of this listener?</Text></li>
                </ul>
              </div>
            </div>

            <div>
              <Space align="center">
                <Switch
                  checked={includeDependencies}
                  onChange={setIncludeDependencies}
                />
                <Text>Include dependency analysis</Text>
                <Text type="secondary">(recommended for comprehensive analysis)</Text>
              </Space>
            </div>

            <div style={{ textAlign: 'center' }}>
              <Button
                type="primary"
                size="large"
                icon={<RobotOutlined />}
                onClick={handleAnalyze}
                loading={loading}
                disabled={!selectedResourceType || !selectedResource || !question.trim()}
                style={{ minWidth: 200 }}
              >
                Analyze with AI
              </Button>
            </div>
          </Space>
        ) : (
          // Analysis Results
          <Spin spinning={loading} tip="Analyzing configuration...">
            <Space direction="vertical" style={{ width: '100%' }} size="large">

              {/* Success Header */}
              <Alert
                message="Configuration Analysis Complete"
                description={`Analysis for resource "${selectedResource}" completed at ${new Date(analysisResult.processed_at).toLocaleString()}`}
                type="success"
                icon={<CheckCircleOutlined />}
                showIcon
              />

              {/* AI Analysis with Modern Cards */}
              <div style={{ marginBottom: 0 }}>
                <AIAnalysisRenderer analysis={analysisResult.analysis} />
              </div>



              {/* Suggestions */}
              {analysisResult.suggestions && analysisResult.suggestions.length > 0 && (
                <Card
                  title={
                    <Space>
                      <BulbOutlined style={{ color: '#fff' }} />
                      <span>AI Suggestions</span>
                    </Space>
                  }
                  size="small"
                >
                  <List
                    size="small"
                    dataSource={analysisResult.suggestions}
                    renderItem={(suggestion, index) => (
                      <List.Item style={{ paddingLeft: 0, paddingRight: 0 }}>
                        <Text>
                          <span style={{ color: '#1890ff', fontWeight: 'bold', marginRight: 8 }}>
                            {index + 1}.
                          </span>
                          {suggestion}
                        </Text>
                      </List.Item>
                    )}
                  />
                </Card>
              )}

              {/* Warnings */}
              {analysisResult.warnings && analysisResult.warnings.length > 0 && (
                <Alert
                  message="Important Considerations"
                  type="warning"
                  icon={<WarningOutlined />}
                  showIcon
                  description={
                    <List
                      size="small"
                      dataSource={analysisResult.warnings}
                      renderItem={(warning) => (
                        <List.Item style={{ paddingLeft: 0, paddingRight: 0 }}>
                          <Text type="warning">• {warning}</Text>
                        </List.Item>
                      )}
                    />
                  }
                />
              )}

              {/* Configuration Details */}
              <Collapse>
                <Panel header="Resource Configuration Details" key="config">
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <div>
                      <Text strong>Name: </Text>
                      <Text>{analysisResult.resource_config.general.name}</Text>
                    </div>
                    <div>
                      <Text strong>Type: </Text>
                      <Tag className="auto-width-tag" color="blue">{analysisResult.resource_config.general.gtype}</Tag>
                    </div>
                    <div>
                      <Text strong>Collection: </Text>
                      <Tag className="auto-width-tag" color="geekblue">{analysisResult.resource_config.general.collection}</Tag>
                    </div>
                    <div>
                      <Text strong>Project: </Text>
                      <Text>{analysisResult.resource_config.general.project}</Text>
                    </div>
                    <div>
                      <Text strong>Version: </Text>
                      <Text>{analysisResult.resource_config.general.version}</Text>
                    </div>
                    {analysisResult.resource_config.general.metadata?.ai_generated && (
                      <div>
                        <Tag className="auto-width-tag" color="purple">AI Generated</Tag>
                      </div>
                    )}
                  </Space>
                </Panel>

                {/* Dependencies */}
                {analysisResult.dependencies && (
                  <Panel header={`Dependencies (${analysisResult.dependencies.nodes.length} resources)`} key="deps">
                    <List
                      size="small"
                      dataSource={analysisResult.dependencies.nodes}
                      renderItem={(node) => (
                        <List.Item>
                          <Space>
                            <Tag color="geekblue">{node.data.category}</Tag>
                            <Text strong>{node.data.label}</Text>
                            <Text type="secondary">{node.data.gtype}</Text>
                          </Space>
                        </List.Item>
                      )}
                    />
                  </Panel>
                )}

                {/* Related Resources */}
                {Object.keys(analysisResult.related_resources).length > 0 && (
                  <Panel header="Related Resources" key="related">
                    {Object.entries(analysisResult.related_resources).map(([collection, resources]) => (
                      <div key={collection} style={{ marginBottom: 16 }}>
                        <Title level={5} style={{ marginBottom: 8 }}>
                          {collection.toUpperCase()} ({resources.length})
                        </Title>
                        <List
                          size="small"
                          dataSource={resources}
                          renderItem={(resource) => (
                            <List.Item style={{ paddingLeft: 16 }}>
                              <Space>
                                <Text strong>{resource.general.name}</Text>
                                <Text type="secondary">{resource.general.gtype}</Text>
                              </Space>
                            </List.Item>
                          )}
                        />
                      </div>
                    ))}
                  </Panel>
                )}
              </Collapse>

              {/* Token Usage Statistics */}
              {analysisResult.token_usage && (
                <Card
                  size="small"
                  style={{ marginBottom: 12 }}
                  title={
                    <Space>
                      <RobotOutlined style={{ color: '#fff' }} />
                      <Text strong style={{ color: '#fff' }}>AI Usage for This Analysis</Text>
                    </Space>
                  }
                >
                  <Row gutter={16}>
                    <Col span={6}>
                      <Statistic
                        title="Input Tokens"
                        value={analysisResult.token_usage.input_tokens}
                        prefix={<InfoCircleOutlined />}
                        valueStyle={{ color: '#1890ff' }}
                      />
                    </Col>
                    <Col span={6}>
                      <Statistic
                        title="Output Tokens"
                        value={analysisResult.token_usage.output_tokens}
                        prefix={<CheckCircleOutlined />}
                        valueStyle={{ color: '#52c41a' }}
                      />
                    </Col>
                    <Col span={6}>
                      <Statistic
                        title="Total Tokens"
                        value={analysisResult.token_usage.total_tokens}
                        prefix={<RobotOutlined />}
                        valueStyle={{ color: '#722ed1' }}
                      />
                    </Col>
                    <Col span={6}>
                      <Statistic
                        title="Cost (USD)"
                        value={analysisResult.token_usage.cost_usd}
                        precision={4}
                        prefix="$"
                        valueStyle={{ color: '#fa8c16' }}
                      />
                    </Col>
                  </Row>
                  <div style={{
                    marginTop: 16,
                    padding: '8px 12px',
                    background: '#f6ffed',
                    border: '1px solid #b7eb8f',
                    borderRadius: 6
                  }}>
                    <Space>
                      <CheckCircleOutlined style={{ color: '#52c41a' }} />
                      <Text style={{ fontSize: 12 }}>
                        This analysis consumed {analysisResult.token_usage.total_tokens} tokens from your AI quota
                      </Text>
                    </Space>
                  </div>
                </Card>
              )}
            </Space>
          </Spin>
        )}
      </Card>
    </div>
  );
};

export default AIConfigAnalyzer;