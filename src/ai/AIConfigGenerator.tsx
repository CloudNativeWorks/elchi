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
  Collapse
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

// AI Analysis Renderer Component
export const AIAnalysisRenderer: React.FC<{ analysis: string }> = ({ analysis }) => {
  // Add CSS animations
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes pulse {
        0% {
          transform: scale(1);
          opacity: 1;
        }
        50% {
          transform: scale(1.05);
          opacity: 0.7;
        }
        100% {
          transform: scale(1);
          opacity: 1;
        }
      }
      
      @keyframes slideInFromLeft {
        from {
          opacity: 0;
          transform: translateX(-20px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
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

  const getSectionStyle = (type: string, index: number) => {
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
            p: ({ children }) => (
              <Typography.Paragraph style={{ 
                marginBottom: 8, 
                fontSize: 14,
                color: '#595959',
                lineHeight: '1.6'
              }}>
                {children}
              </Typography.Paragraph>
            ),
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
                    margin: 0
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
          style={getSectionStyle(section.type, index)}
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
              p: ({ children, ...props }) => {
                const childText = String(children).trim();
                const isListHeader = childText.endsWith(':');
                const isError = childText.startsWith('[HIGH]') || childText.startsWith('[MEDIUM]') || childText.startsWith('[LOW]');
                const isNumberedHeader = /^\d+\.\s+[^:]*:$/.test(childText); // Like "1. Control Plane Connectivity:"
                const isSectionHeader = isListHeader && (childText.includes('Plane') || childText.includes('Configuration') || childText.includes('Timing') || childText.includes('Connection') || childText.length > 10); // General section headers
                
                // Process text to highlight IP addresses and config values
                const processText = (text: any) => {
                  if (typeof text !== 'string') return text;
                  
                  // Split by double spaces or multiple spaces to handle line breaks
                  const lines = text.split(/\s{2,}|\n/).filter(line => line.trim());
                  
                  return lines.map((line, lineIndex) => {
                    // Highlight IP addresses
                    const ipRegex = /(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/g;
                    const parts = line.split(ipRegex);
                    
                    const processedLine = parts.map((part, index) => {
                      if (ipRegex.test(part)) {
                        return (
                          <Typography.Text
                            key={index}
                            style={{
                              backgroundColor: '#f6ffed',
                              color: '#389e0d',
                              padding: '1px 4px',
                              borderRadius: 3,
                              fontFamily: 'monospace',
                              fontSize: 13
                            }}
                          >
                            {part}
                          </Typography.Text>
                        );
                      }
                      return part;
                    });
                    
                    // Return each line as a separate div to ensure proper line breaks
                    return (
                      <div key={lineIndex} style={{ marginBottom: lineIndex < lines.length - 1 ? 8 : 0 }}>
                        {processedLine}
                      </div>
                    );
                  });
                };
                
                // Handle numbered headers and section headers specially
                if (isNumberedHeader || isSectionHeader) {
                  return (
                    <h4 style={{ 
                      margin: '0px 0 12px 0',
                      fontSize: 15,
                      fontWeight: 600,
                      color: '#262626',
                      lineHeight: '1.6',
                      paddingLeft: 0
                    }}>
                      {childText}
                    </h4>
                  );
                }
                
                return (
                  <div style={{ 
                    marginBottom: isListHeader ? 16 : 8, 
                    fontSize: isListHeader ? 15 : 14, 
                    color: isError ? '#ff4d4f' : (isListHeader ? '#262626' : '#595959'),
                    fontWeight: isError || isListHeader ? 600 : 400,
                    marginTop: isListHeader ? 12 : 0,
                    lineHeight: '1.6',
                    backgroundColor: isError ? '#fff2f0' : 'transparent',
                    padding: isError ? '8px 12px' : 0,
                    borderRadius: isError ? 6 : 0,
                    border: isError ? '1px solid #ffccc7' : 'none'
                  }}>
                    {processText(children)}
                  </div>
                );
              },
              ul: ({ children }) => (
                <ul style={{ 
                  margin: '8px 0 12px 0', 
                  listStyle: 'none',
                  paddingLeft: 0,
                  display: 'block'
                }}>
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol style={{ 
                  margin: '8px 0 12px 0',
                  paddingLeft: 0,
                  listStyle: 'none',
                  display: 'block'
                }}>
                  {children}
                </ol>
              ),
              li: ({ children }) => {
                const childrenText = String(children).trim();
                const stepMatch = childrenText.match(/^(\d+)\.\s*(.+)/);
                
                // Handle numbered steps for solutions and next steps
                if (stepMatch && (section.type === 'solutions' || section.type === 'next_steps' || section.type === 'answer')) {
                  const stepNumber = stepMatch[1];
                  const stepText = stepMatch[2];
                  
                  return (
                    <li style={{ 
                      marginBottom: 16,
                      listStyle: 'none',
                      paddingLeft: 0,
                      display: 'block'
                    }}>
                      <div style={{
                        display: 'flex',
                        gap: 16,
                        alignItems: 'flex-start'
                      }}>
                        <div style={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          background: section.type === 'solutions' ? '#52c41a' : '#722ed1',
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold',
                          fontSize: 14,
                          flexShrink: 0
                        }}>
                          {stepNumber}
                        </div>
                        
                        <div style={{
                          flex: 1,
                          padding: '12px 16px',
                          background: '#fafafa',
                          borderRadius: 8,
                          border: '1px solid #f0f0f0'
                        }}>
                          <Typography.Text style={{ 
                            fontSize: 14, 
                            color: '#262626',
                            lineHeight: '1.6'
                          }}>
                            {stepText}
                          </Typography.Text>
                        </div>
                      </div>
                    </li>
                  );
                }
                
                // Handle error entries with color coding
                const isError = childrenText.startsWith('[HIGH]') || childrenText.startsWith('[MEDIUM]') || childrenText.startsWith('[LOW]');
                const errorLevel = isError ? childrenText.match(/\[(HIGH|MEDIUM|LOW)\]/)?.[1] : null;
                
                const getErrorColor = (level: string | null) => {
                  switch (level) {
                    case 'HIGH': return '#ff4d4f';
                    case 'MEDIUM': return '#fa8c16';
                    case 'LOW': return '#faad14';
                    default: return '#1890ff';
                  }
                };
                
                // Check if this list item is actually a section header
                const isListItemHeader = childrenText.endsWith(':') && (
                  childrenText.includes('Connectivity') || 
                  childrenText.includes('Configuration') || 
                  childrenText.includes('Initialization') || 
                  childrenText.includes('Plane') ||
                  /^\d+\.\s+[A-Z][^:]*:$/.test(childrenText) || // Numbered headers like "1. Control Plane Connectivity:"
                  childrenText.length > 15 // Longer text ending with colon is likely a header
                );
                
                if (isListItemHeader) {
                  return (
                    <li style={{ 
                      listStyle: 'none',
                      paddingLeft: 0,
                      marginBottom: 8,
                      marginTop: 12,
                      display: 'block'
                    }}>
                      <div style={{ 
                        margin: 0,
                        fontSize: 15,
                        fontWeight: 600,
                        color: '#262626',
                        paddingLeft: 0,
                        lineHeight: '1.4'
                      }}>
                        {childrenText}
                      </div>
                    </li>
                  );
                }
                
                // Regular list items with proper bullet alignment
                const bulletStyle = {
                  width: isError ? '8px' : '6px',
                  height: isError ? '8px' : '6px',
                  borderRadius: '50%',
                  backgroundColor: isError ? getErrorColor(errorLevel) : 
                    (section.type === 'warnings' ? '#fa8c16' : 
                     section.type === 'errors' ? '#ff4d4f' : '#1890ff'),
                  display: 'inline-block',
                  marginRight: '12px',
                  marginTop: '0.5em',
                  verticalAlign: 'top',
                  flexShrink: 0
                };
                
                return (
                  <li style={{ 
                    marginBottom: isError ? 12 : 8,
                    listStyle: 'none',
                    paddingLeft: 0,
                    display: 'block',
                    background: isError ? '#fafafa' : 'transparent',
                    padding: isError ? '8px 12px' : '4px 0',
                    borderRadius: isError ? 6 : 0,
                    border: isError ? `1px solid ${getErrorColor(errorLevel)}20` : 'none',
                    lineHeight: '1.6'
                  }}>
                    <span style={bulletStyle}></span>
                    <div style={{ 
                      display: 'inline-block',
                      width: 'calc(100% - 20px)',
                      verticalAlign: 'top',
                      color: isError ? '#262626' : '#595959', 
                      fontWeight: isError ? 500 : 400,
                      fontSize: 14,
                      lineHeight: '1.6'
                    }}>
                      {children}
                    </div>
                  </li>
                );
              },
              strong: ({ children }) => {
                const text = String(children).trim();
                
                // Check if this is a UI navigation path (contains > or →)
                if (text.includes('→') || text.includes('>') || text.includes('Sidebar') || text.includes('Tag Navigation')) {
                  return (
                    <Typography.Text style={{
                      backgroundColor: '#f0f5ff',
                      color: '#722ed1',
                      padding: '4px 8px',
                      borderRadius: 4,
                      fontWeight: 600,
                      border: '1px solid #d6e4ff',
                      fontSize: 13,
                      fontFamily: 'monospace'
                    }}>
                      {children}
                    </Typography.Text>
                  );
                }
                
                // Check if this is a UI button/element (quoted text)
                if (text.startsWith('"') && text.endsWith('"')) {
                  return (
                    <Typography.Text style={{
                      backgroundColor: '#f0f8ff',
                      color: '#1890ff',
                      padding: '2px 6px',
                      borderRadius: 4,
                      fontWeight: 600,
                      border: '1px solid #d6e4ff',
                      fontSize: 13
                    }}>
                      {children}
                    </Typography.Text>
                  );
                }
                
                // Check if this is a section header that might be inline (ends with :)
                if (text.endsWith(':') && text.length > 5) {
                  return (
                    <div style={{ 
                      marginTop: 16, 
                      marginBottom: 8,
                      paddingTop: 8,
                      borderTop: '1px solid #f0f0f0'
                    }}>
                      <Typography.Text strong style={{ 
                        color: '#262626',
                        fontSize: 15,
                        display: 'block'
                      }}>
                        {children}
                      </Typography.Text>
                    </div>
                  );
                }
                
                // Check for error levels
                if (text.includes('[HIGH]') || text.includes('[MEDIUM]') || text.includes('[LOW]')) {
                  const level = text.match(/\[(HIGH|MEDIUM|LOW)\]/)?.[1];
                  const color = level === 'HIGH' ? '#ff4d4f' : level === 'MEDIUM' ? '#fa8c16' : '#faad14';
                  
                  return (
                    <Typography.Text strong style={{ 
                      color: color,
                      backgroundColor: `${color}15`,
                      padding: '2px 6px',
                      borderRadius: 4,
                      fontSize: 13
                    }}>
                      {children}
                    </Typography.Text>
                  );
                }
                
                return (
                  <Typography.Text strong style={{ 
                    color: '#262626'
                  }}>
                    {children}
                  </Typography.Text>
                );
              },
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
                        fontSize: 13,
                        fontFamily: 'SFMono-Regular, Monaco, Consolas, monospace'
                      }}
                    >
                      {children}
                    </Typography.Text>
                  );
                }
                
                // Handle YAML and other code blocks
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
                        fontWeight: 500,
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
                      color: '#24292e',
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

interface AIConfigAnalyzerProps {
  onAnalysisComplete?: (result: ConfigAnalysisResult) => void;
}

const AIConfigAnalyzer: React.FC<AIConfigAnalyzerProps> = ({
  onAnalysisComplete
}) => {
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
      onAnalysisComplete?.(analysisResult);
      message.success('Configuration analysis completed successfully!');
    }
  }, [analysisResult, onAnalysisComplete]);

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
              <div style={{ marginBottom: 24 }}>
                <AIAnalysisRenderer analysis={analysisResult.analysis} />
              </div>

              {/* Suggestions */}
              {analysisResult.suggestions && analysisResult.suggestions.length > 0 && (
                <Card
                  title={
                    <Space>
                      <BulbOutlined style={{ color: '#1890ff' }} />
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
            </Space>
          </Spin>
        )}
      </Card>
    </div>
  );
};

export default AIConfigAnalyzer;