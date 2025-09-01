import React from 'react';
import { Card, Tag, Space, Typography, Button, Alert, Row, Col, Badge } from 'antd';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuditLogs, AuditLog } from '@/hooks/useAudit';
import {
    ArrowLeftOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    UserOutlined,
    ClockCircleOutlined,
    ApiOutlined
} from '@ant-design/icons';
import { formatDistanceToNow } from 'date-fns';

const { Text } = Typography;

// JSON Syntax Highlighter Component
const JsonSyntaxHighlight: React.FC<{ json: any }> = ({ json }) => {
    const syntaxHighlight = (obj: any): string => {
        let jsonStr = JSON.stringify(obj, null, 2);
        jsonStr = jsonStr.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return jsonStr.replace(
            /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
            (match) => {
                let cls = 'json-number';
                if (/^"/.test(match)) {
                    if (/:$/.test(match)) {
                        cls = 'json-key';
                    } else {
                        cls = 'json-string';
                    }
                } else if (/true|false/.test(match)) {
                    cls = 'json-boolean';
                } else if (/null/.test(match)) {
                    cls = 'json-null';
                }
                return `<span class="${cls}">${match}</span>`;
            }
        );
    };

    return (
        <>
            <style>{`
                .json-key { color: #a626a4; font-weight: 600; }
                .json-string { color: #50a14f; }
                .json-number { color: #986801; }
                .json-boolean { color: #0184bb; }
                .json-null { color: #e45649; }
            `}</style>
            <div dangerouslySetInnerHTML={{ __html: syntaxHighlight(json) }} />
        </>
    );
};

const AuditDetail: React.FC = () => {
    const { auditId } = useParams<{ auditId: string }>();
    const navigate = useNavigate();
    const location = useLocation();

    // Get audit log from state if available, otherwise fetch from API
    const auditLogFromState = location.state?.auditLog as AuditLog | undefined;

    const { data: auditResponse, isLoading } = useAuditLogs({
        filters: {},
        pagination: { limit: 100 },
        enabled: !!auditId && !auditLogFromState
    });

    const auditLog = auditLogFromState || auditResponse?.data?.find((log: AuditLog) => log.id === auditId);

    if (isLoading && !auditLogFromState) {
        return (
            <Card loading={true}>
                <div style={{ height: 200 }} />
            </Card>
        );
    }

    if (!auditLog) {
        return (
            <Card>
                <Alert
                    message="Audit Log Not Found"
                    description="The requested audit log could not be found."
                    type="error"
                    showIcon
                />
                <Button
                    style={{ marginTop: 16 }}
                    onClick={() => navigate('/audit')}
                    icon={<ArrowLeftOutlined />}
                >
                    Back to Audit Logs
                </Button>
            </Card>
        );
    }

    const getSuccessTag = (success: boolean) => (
        <Tag
            className='auto-width-tag'
            icon={success ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
            color={success ? 'green' : 'red'}
            style={{ fontWeight: 600 }}
        >
            {success ? 'Success' : 'Failed'}
        </Tag>
    );

    const getActionColor = (action: string) => {
        switch (action.toLowerCase()) {
            case 'create': return 'green';
            case 'update': return 'blue';
            case 'delete': return 'red';
            case 'read': case 'get': return 'cyan';
            case 'deploy': return 'purple';
            default: return 'default';
        }
    };

    const getMethodColor = (method: string) => {
        switch (method.toUpperCase()) {
            case 'GET': return 'blue';
            case 'POST': return 'green';
            case 'PUT': case 'PATCH': return 'orange';
            case 'DELETE': return 'red';
            default: return 'default';
        }
    };

    return (
        <div style={{ padding: '0px', background: '#f5f7fa', minHeight: '100vh' }}>
            {/* Modern Header */}
            <div style={{
                background: 'white',
                borderRadius: 16,
                padding: '20px 24px',
                marginBottom: 24,
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: 48 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <Button
                            icon={<ArrowLeftOutlined />}
                            onClick={() => navigate('/audit')}
                            style={{ borderRadius: 8 }}
                        >
                            Back
                        </Button>
                        <div style={{
                            width: 1,
                            height: 24,
                            background: '#e8e8e8'
                        }} />
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                {getSuccessTag(auditLog.success)}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Text strong style={{ fontSize: 18 }}>Audit Log</Text>
                                </div>
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                    {formatDistanceToNow(new Date(auditLog.timestamp), { addSuffix: true })}
                                </Text>
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                        <Tag className='auto-width-tag' color={getActionColor(auditLog.action)} style={{ borderRadius: 6, fontWeight: 600, fontSize: 13 }}>
                            {auditLog.action.toUpperCase().replace(/_/g, ' ')}
                        </Tag>
                    </div>
                </div>
            </div>

            <Row gutter={24}>
                <Col span={16}>
                    {/* User & Request Information */}
                    <Card
                        style={{
                            borderRadius: 16,
                            marginBottom: 24,
                            border: 'none',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                        }}
                    >
                        <div style={{ marginBottom: 20 }}>
                            <Text type="secondary" style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
                                USER & REQUEST INFO
                            </Text>
                        </div>
                        <Row gutter={[16, 12]}>
                            <Col span={12}>
                                <div style={{ marginBottom: 8 }}>
                                    <Text type="secondary" style={{ fontSize: 12 }}>User</Text>
                                    <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <UserOutlined style={{ color: '#8c8c8c' }} />
                                        <div>
                                            <Text strong style={{ fontSize: 14 }}>{auditLog.username}</Text>
                                            <div>
                                                <Text style={{ fontSize: 12, color: '#8c8c8c' }}>
                                                    {auditLog.user_role}
                                                </Text>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                            <Col span={12}>
                                <div style={{ marginBottom: 8 }}>
                                    <Text type="secondary" style={{ fontSize: 12 }}>Timestamp</Text>
                                    <div style={{ marginTop: 4 }}>
                                        <Text strong style={{ fontSize: 14 }}>{new Date(auditLog.timestamp).toLocaleString()}</Text>
                                        <div>
                                            <Text style={{ fontSize: 12, color: '#8c8c8c' }}>
                                                {formatDistanceToNow(new Date(auditLog.timestamp), { addSuffix: true })}
                                            </Text>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                            <Col span={12}>
                                <div style={{ marginBottom: 8 }}>
                                    <Text type="secondary" style={{ fontSize: 12 }}>Request ID</Text>
                                    <div style={{ marginTop: 4 }}>
                                        <Text code style={{ fontSize: 12 }}>{auditLog.request_id}</Text>
                                    </div>
                                </div>
                            </Col>
                            <Col span={12}>
                                <div style={{ marginBottom: 8 }}>
                                    <Text type="secondary" style={{ fontSize: 12 }}>Client IP</Text>
                                    <div style={{ marginTop: 4 }}>
                                        <Text code style={{ fontSize: 14 }}>{auditLog.client_ip}</Text>
                                    </div>
                                </div>
                            </Col>
                            <Col span={12}>
                                <div style={{ marginBottom: 8 }}>
                                    <Text type="secondary" style={{ fontSize: 12 }}>Project</Text>
                                    <div style={{ marginTop: 4 }}>
                                        <Tag className='auto-width-tag' style={{ borderRadius: 6 }}>{auditLog.project}</Tag>
                                    </div>
                                </div>
                            </Col>
                            <Col span={12}>
                                <div style={{ marginBottom: 8 }}>
                                    <Text type="secondary" style={{ fontSize: 12 }}>User Agent</Text>
                                    <div style={{ marginTop: 4 }}>
                                        <Text style={{ fontSize: 11, wordBreak: 'break-all', lineHeight: 1.4 }}>
                                            {auditLog.user_agent}
                                        </Text>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Card>

                    {/* API Information */}
                    <Card
                        style={{
                            borderRadius: 16,
                            marginBottom: 24,
                            border: 'none',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                        }}
                    >
                        <div style={{ marginBottom: 20 }}>
                            <Text type="secondary" style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
                                API DETAILS
                            </Text>
                        </div>
                        <Row gutter={[24, 24]}>
                            <Col span={12}>
                                <div style={{ marginBottom: 16 }}>
                                    <Text type="secondary" style={{ fontSize: 12 }}>Method & Path</Text>
                                    <div style={{ marginTop: 4 }}>
                                        <Space>
                                            <Tag className='auto-width-tag' color={getMethodColor(auditLog.method)} style={{ fontWeight: 600 }}>
                                                {auditLog.method}
                                            </Tag>
                                        </Space>
                                        <div style={{ marginTop: 8 }}>
                                            <Text code style={{ fontSize: 12, wordBreak: 'break-all' }}>{auditLog.path}</Text>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                            <Col span={12}>
                                <div style={{ marginBottom: 16 }}>
                                    <Text type="secondary" style={{ fontSize: 12 }}>Resource</Text>
                                    <div style={{ marginTop: 4 }}>
                                        <Text strong style={{ fontSize: 14 }}>{auditLog.resource_name || auditLog.resource_id}</Text>
                                        <div>
                                            <Text style={{ fontSize: 12, color: '#8c8c8c' }}>
                                                {auditLog.resource_type} • {auditLog.api_type}
                                            </Text>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        {auditLog.error_message && (
                            <Alert
                                message="Error Details"
                                description={auditLog.error_message}
                                type="error"
                                showIcon
                                style={{ marginTop: 16, borderRadius: 8 }}
                            />
                        )}
                    </Card>

                    {/* Changes Information */}
                    {auditLog.changes && Object.keys(auditLog.changes).length > 0 && (
                        <Card
                            style={{
                                borderRadius: 16,
                                border: 'none',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                            }}
                        >
                            <div style={{ marginBottom: 20 }}>
                                <Text type="secondary" style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
                                    CHANGES
                                </Text>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                {(() => {
                                    let changes: any;
                                    let isTextDiff = false;
                                    
                                    try {
                                        changes = typeof auditLog.changes.diff === 'string' 
                                            ? JSON.parse(auditLog.changes.diff) 
                                            : auditLog.changes.diff;
                                    } catch {
                                        // If JSON parsing fails, check if it's a text diff
                                        if (typeof auditLog.changes.diff === 'string') {
                                            isTextDiff = true;
                                            changes = auditLog.changes.diff;
                                        } else {
                                            changes = auditLog.changes;
                                        }
                                    }

                                    // Handle text diff format (Go diff output)
                                    if (isTextDiff) {
                                        return (
                                            <div>
                                                <div style={{ 
                                                    background: '#e6f7ff', 
                                                    padding: '8px 12px', 
                                                    borderRadius: '6px 6px 0 0',
                                                    borderLeft: '3px solid #1890ff',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center'
                                                }}>
                                                    <Text strong style={{ color: '#1890ff', fontSize: 13 }}>CHANGES DIFF</Text>
                                                </div>
                                                <pre style={{
                                                    background: '#fff',
                                                    border: '1px solid #91d5ff',
                                                    borderRadius: '0 0 6px 6px',
                                                    padding: 16,
                                                    fontSize: 12,
                                                    lineHeight: 1.4,
                                                    fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                                                    overflow: 'auto',
                                                    maxHeight: 400,
                                                    margin: 0,
                                                    whiteSpace: 'pre-wrap'
                                                }}>
                                                    {changes.split('\n').map((line: string, index: number) => {
                                                        let color = '#262626';
                                                        let background = 'transparent';
                                                        
                                                        if (line.startsWith('+')) {
                                                            color = '#237804';
                                                            background = '#f6ffed';
                                                        } else if (line.startsWith('-')) {
                                                            color = '#cf1322';
                                                            background = '#fff2f0';
                                                        }
                                                        
                                                        return (
                                                            <div
                                                                key={index}
                                                                style={{
                                                                    color,
                                                                    background,
                                                                    padding: line.startsWith('+') || line.startsWith('-') ? '1px 4px' : '0',
                                                                    borderRadius: line.startsWith('+') || line.startsWith('-') ? 2 : 0,
                                                                    margin: line.startsWith('+') || line.startsWith('-') ? '1px 0' : 0
                                                                }}
                                                            >
                                                                {line}
                                                            </div>
                                                        );
                                                    })}
                                                </pre>
                                            </div>
                                        );
                                    }

                                    const changesByType = {
                                        create: [] as any[],
                                        update: [] as any[],
                                        delete: [] as any[]
                                    };

                                    if (changes?.changes) {
                                        changes.changes.forEach((change: any) => {
                                            changesByType[change.type as keyof typeof changesByType]?.push(change);
                                        });
                                    }

                                    return (
                                        <>
                                            {changesByType.create.length > 0 && (
                                                <div>
                                                    <div style={{ 
                                                        background: '#f6ffed', 
                                                        padding: '8px 12px', 
                                                        borderRadius: '6px 6px 0 0',
                                                        borderLeft: '3px solid #52c41a',
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center'
                                                    }}>
                                                        <Text strong style={{ color: '#52c41a', fontSize: 13 }}>CREATED</Text>
                                                        <Badge count={changesByType.create.length} style={{ backgroundColor: '#52c41a' }} />
                                                    </div>
                                                    <div style={{ background: '#fafafa', padding: 16 }}>
                                                        {changesByType.create.map((change, index) => (
                                                            <div key={index} style={{ marginBottom: index < changesByType.create.length - 1 ? 16 : 0 }}>
                                                                <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                                                                    <div style={{
                                                                        background: '#52c41a',
                                                                        color: 'white',
                                                                        width: 24,
                                                                        height: 24,
                                                                        borderRadius: '50%',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                        fontSize: 12,
                                                                        fontWeight: 600
                                                                    }}>
                                                                        {index + 1}
                                                                    </div>
                                                                    <Tag color="green" style={{ borderRadius: 4 }}>
                                                                        {change.path.join(' → ')}
                                                                    </Tag>
                                                                </div>
                                                                <pre style={{
                                                                    background: '#fff',
                                                                    border: '1px solid #d9f7be',
                                                                    borderRadius: 6,
                                                                    padding: 12,
                                                                    fontSize: 12,
                                                                    lineHeight: 1.4,
                                                                    fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                                                                    overflow: 'auto',
                                                                    maxHeight: 200,
                                                                    margin: 0
                                                                }}>
                                                                    {typeof change.value === 'object' 
                                                                        ? <JsonSyntaxHighlight json={change.value} />
                                                                        : String(change.value)
                                                                    }
                                                                </pre>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {changesByType.update.length > 0 && (
                                                <div>
                                                    <div style={{ 
                                                        background: '#e6f7ff', 
                                                        padding: '8px 12px', 
                                                        borderRadius: '6px 6px 0 0',
                                                        borderLeft: '3px solid #1890ff',
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center'
                                                    }}>
                                                        <Text strong style={{ color: '#1890ff', fontSize: 13 }}>UPDATED</Text>
                                                        <Badge count={changesByType.update.length} style={{ backgroundColor: '#1890ff' }} />
                                                    </div>
                                                    <div style={{ background: '#fafafa', padding: 16 }}>
                                                        {changesByType.update.map((change, index) => (
                                                            <div key={index} style={{ marginBottom: index < changesByType.update.length - 1 ? 16 : 0 }}>
                                                                <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                                                                    <div style={{
                                                                        background: '#1890ff',
                                                                        color: 'white',
                                                                        width: 24,
                                                                        height: 24,
                                                                        borderRadius: '50%',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                        fontSize: 12,
                                                                        fontWeight: 600
                                                                    }}>
                                                                        {index + 1}
                                                                    </div>
                                                                    <Tag color="blue" style={{ borderRadius: 4 }}>
                                                                        {change.path.join(' → ')}
                                                                    </Tag>
                                                                </div>
                                                                {change.from !== undefined && change.to !== undefined ? (
                                                                    <div style={{
                                                                        background: '#fff',
                                                                        border: '1px solid #91d5ff',
                                                                        borderRadius: 6,
                                                                        padding: 12,
                                                                        fontSize: 12,
                                                                        fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace'
                                                                    }}>
                                                                        <div style={{ marginBottom: 8 }}>
                                                                            <Text type="secondary" style={{ fontSize: 11 }}>From:</Text>
                                                                            <pre style={{
                                                                                background: '#fff5f5',
                                                                                border: '1px solid #ffccc7',
                                                                                borderRadius: 4,
                                                                                padding: 8,
                                                                                marginTop: 4,
                                                                                marginBottom: 0,
                                                                                overflow: 'auto',
                                                                                maxHeight: 100
                                                                            }}>
                                                                                {typeof change.from === 'object' 
                                                                                    ? <JsonSyntaxHighlight json={change.from} />
                                                                                    : String(change.from)
                                                                                }
                                                                            </pre>
                                                                        </div>
                                                                        <div>
                                                                            <Text type="secondary" style={{ fontSize: 11 }}>To:</Text>
                                                                            <pre style={{
                                                                                background: '#f6ffed',
                                                                                border: '1px solid #b7eb8f',
                                                                                borderRadius: 4,
                                                                                padding: 8,
                                                                                marginTop: 4,
                                                                                marginBottom: 0,
                                                                                overflow: 'auto',
                                                                                maxHeight: 100
                                                                            }}>
                                                                                {typeof change.to === 'object' 
                                                                                    ? <JsonSyntaxHighlight json={change.to} />
                                                                                    : String(change.to)
                                                                                }
                                                                            </pre>
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <pre style={{
                                                                        background: '#fff',
                                                                        border: '1px solid #91d5ff',
                                                                        borderRadius: 6,
                                                                        padding: 12,
                                                                        fontSize: 12,
                                                                        lineHeight: 1.4,
                                                                        fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                                                                        overflow: 'auto',
                                                                        maxHeight: 200,
                                                                        margin: 0
                                                                    }}>
                                                                        {typeof change.value === 'object' 
                                                                            ? <JsonSyntaxHighlight json={change.value} />
                                                                            : String(change.value)
                                                                        }
                                                                    </pre>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {changesByType.delete.length > 0 && (
                                                <div>
                                                    <div style={{ 
                                                        background: '#fff2f0', 
                                                        padding: '8px 12px', 
                                                        borderRadius: '6px 6px 0 0',
                                                        borderLeft: '3px solid #ff4d4f',
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center'
                                                    }}>
                                                        <Text strong style={{ color: '#ff4d4f', fontSize: 13 }}>DELETED</Text>
                                                        <Badge count={changesByType.delete.length} style={{ backgroundColor: '#ff4d4f' }} />
                                                    </div>
                                                    <div style={{ background: '#fafafa', padding: 16 }}>
                                                        {changesByType.delete.map((change, index) => (
                                                            <div key={index} style={{ marginBottom: index < changesByType.delete.length - 1 ? 16 : 0 }}>
                                                                <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                                                                    <div style={{
                                                                        background: '#ff4d4f',
                                                                        color: 'white',
                                                                        width: 24,
                                                                        height: 24,
                                                                        borderRadius: '50%',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                        fontSize: 12,
                                                                        fontWeight: 600
                                                                    }}>
                                                                        {index + 1}
                                                                    </div>
                                                                    <Tag color="red" style={{ borderRadius: 4 }}>
                                                                        {change.path.join(' → ')}
                                                                    </Tag>
                                                                </div>
                                                                <pre style={{
                                                                    background: '#fff',
                                                                    border: '1px solid #ffccc7',
                                                                    borderRadius: 6,
                                                                    padding: 12,
                                                                    fontSize: 12,
                                                                    lineHeight: 1.4,
                                                                    fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                                                                    overflow: 'auto',
                                                                    maxHeight: 200,
                                                                    margin: 0
                                                                }}>
                                                                    {typeof change.value === 'object' 
                                                                        ? <JsonSyntaxHighlight json={change.value} />
                                                                        : String(change.value)
                                                                    }
                                                                </pre>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {(!changes?.changes || changes.changes.length === 0) && (
                                                <div style={{
                                                    textAlign: 'center',
                                                    padding: 32,
                                                    color: '#8c8c8c',
                                                    fontSize: 14
                                                }}>
                                                    No changes detected
                                                </div>
                                            )}
                                        </>
                                    );
                                })()}
                            </div>
                        </Card>
                    )}
                </Col>

                <Col span={8}>
                    {/* Quick Stats */}
                    <Card
                        style={{
                            borderRadius: 16,
                            marginBottom: 24,
                            border: 'none',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                        }}
                    >
                        <div style={{ marginBottom: 20 }}>
                            <Text type="secondary" style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
                                RESPONSE INFO
                            </Text>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '12px 16px',
                                background: auditLog.success ? '#f6ffed' : '#fff2f0',
                                borderRadius: 12
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    {auditLog.success ?
                                        <CheckCircleOutlined style={{ color: '#52c41a' }} /> :
                                        <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
                                    }
                                    <Text style={{ fontSize: 13 }}>Status</Text>
                                </div>
                                <Text strong style={{ fontSize: 16, color: auditLog.success ? '#52c41a' : '#ff4d4f' }}>
                                    {auditLog.success ? 'Success' : 'Failed'}
                                </Text>
                            </div>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '12px 16px',
                                background: '#e6f7ff',
                                borderRadius: 12
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <ApiOutlined style={{ color: '#1890ff' }} />
                                    <Text style={{ fontSize: 13 }}>HTTP Status</Text>
                                </div>
                                <Text strong style={{ fontSize: 16, color: auditLog.response_status >= 400 ? '#ff4d4f' : '#52c41a' }}>
                                    {auditLog.response_status}
                                </Text>
                            </div>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '12px 16px',
                                background: '#fffbe6',
                                borderRadius: 12
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <ClockCircleOutlined style={{ color: '#faad14' }} />
                                    <Text style={{ fontSize: 13 }}>Duration</Text>
                                </div>
                                <Text strong style={{ fontSize: 16, color: '#faad14' }}>{auditLog.duration_ms}ms</Text>
                            </div>
                        </div>
                    </Card>

                    {/* Command Information */}
                    {auditLog.command && auditLog.api_type === 'CLIENT_COMMAND' && (
                        <Card
                            style={{
                                borderRadius: 16,
                                border: 'none',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                            }}
                        >
                            <div style={{ marginBottom: 20 }}>
                                <Text type="secondary" style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
                                    COMMAND DETAILS
                                </Text>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                <div>
                                    <Text type="secondary" style={{ fontSize: 12 }}>Type</Text>
                                    <div style={{ marginTop: 4 }}>
                                        <Tag className='auto-width-tag' color="green" style={{ borderRadius: 6 }}>{auditLog.command.type || 'N/A'}</Tag>
                                    </div>
                                </div>
                                <div>
                                    <Text type="secondary" style={{ fontSize: 12 }}>Subtype</Text>
                                    <div style={{ marginTop: 4 }}>
                                        <Tag className='auto-width-tag' color="blue" style={{ borderRadius: 6 }}>{auditLog.command.sub_type || 'N/A'}</Tag>
                                    </div>
                                </div>
                                <div>
                                    <Text type="secondary" style={{ fontSize: 12 }}>Command Name</Text>
                                    <div style={{ marginTop: 4 }}>
                                        <Text code style={{ fontSize: 12 }}>{auditLog.command.command?.name || 'N/A'}</Text>
                                    </div>
                                </div>
                                <div>
                                    <Text type="secondary" style={{ fontSize: 12 }}>Command Project</Text>
                                    <div style={{ marginTop: 4 }}>
                                        <Text code style={{ fontSize: 12 }}>{auditLog.command.command?.project || 'N/A'}</Text>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )}

                </Col>
            </Row>
        </div>
    );
};

export default AuditDetail;