import React from 'react';
import { Card, Tag, Typography, Button, Alert, Row, Col, Badge } from 'antd';
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
import MonacoEditor from '@monaco-editor/react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs, vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from '@/contexts/ThemeContext';

const { Text } = Typography;

// JSON Syntax Highlighter Component
const JsonValue: React.FC<{
    value: any;
    style?: React.CSSProperties;
    isDark?: boolean;
}> = ({ value, style = {}, isDark = false }) => {
    // Check if value is JSON object/array
    const isJson = typeof value === 'object' && value !== null;

    // Try to parse if it's a string that might be JSON
    let parsedValue = value;
    let isJsonString = false;
    if (typeof value === 'string' && (value.startsWith('{') || value.startsWith('['))) {
        try {
            parsedValue = JSON.parse(value);
            isJsonString = true;
        } catch {
            // Not valid JSON, treat as plain string
        }
    }

    const finalValue = (isJson || isJsonString)
        ? JSON.stringify(parsedValue, null, 2)
        : String(value);

    if (isJson || isJsonString) {
        return (
            <div style={{
                ...style,
                borderRadius: 4,
                overflow: 'auto'
            }}>
                <SyntaxHighlighter
                    language="json"
                    style={isDark ? vscDarkPlus : vs}
                    customStyle={{
                        margin: 0,
                        padding: '6px',
                        fontSize: '11px',
                        lineHeight: 1.3,
                        background: style.background || 'var(--card-bg)',
                        border: style.border || '1px solid var(--border-default)',
                        borderRadius: 4
                    }}
                    wrapLongLines={true}
                >
                    {finalValue}
                </SyntaxHighlighter>
            </div>
        );
    }

    // For non-JSON values, use plain <pre>
    return (
        <pre style={{
            ...style,
            margin: 0,
            padding: 6,
            fontSize: 11,
            lineHeight: 1.3,
            fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all',
            background: style.background || 'var(--card-bg)',
            border: style.border || '1px solid var(--border-default)',
            borderRadius: 4,
            overflow: 'auto'
        }}>
            {finalValue}
        </pre>
    );
};

const AuditDetail: React.FC = () => {
    const { auditId } = useParams<{ auditId: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const { isDark } = useTheme();

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
        <div style={{ padding: '0px', background: 'var(--bg-body)', minHeight: '100vh' }}>
            {/* Modern Header */}
            <div style={{
                background: 'var(--card-bg)',
                borderRadius: 16,
                padding: '20px 24px',
                marginBottom: 24,
                boxShadow: 'var(--shadow-sm)'
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
                            background: 'var(--border-default)'
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
                <Col span={18}>
                    {/* User & Request Information */}
                    <Card
                        style={{
                            borderRadius: 16,
                            marginBottom: 24,
                            border: '1px solid var(--border-default)',
                            background: 'var(--card-bg)',
                            boxShadow: 'var(--shadow-sm)',
                            overflow: 'hidden'
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
                                        <UserOutlined style={{ color: 'var(--text-secondary)' }} />
                                        <div>
                                            <Text strong style={{ fontSize: 14 }}>{auditLog.username}</Text>
                                            <div>
                                                <Text style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
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
                                            <Text style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
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


                    {/* Changes Information */}
                    {auditLog.changes && Object.keys(auditLog.changes).length > 0 && (
                        <Card
                            style={{
                                borderRadius: 16,
                                border: '1px solid var(--border-default)',
                                background: 'var(--card-bg)',
                                boxShadow: 'var(--shadow-sm)',
                                overflow: 'hidden'
                            }}
                        >
                            <div style={{ marginBottom: 20 }}>
                                <Text type="secondary" style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
                                    CHANGES
                                </Text>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                {(() => {
                                    // Special handling for UPGRADE_RESOURCE action
                                    if (auditLog.action === 'UPGRADE_RESOURCE' && auditLog.changes) {
                                        const { from_version, to_version, listener_names, total_listeners, job_id, options } = auditLog.changes as any;

                                        return (
                                            <div>
                                                <div style={{
                                                    background: 'var(--color-purple-bg)',
                                                    padding: '8px 12px',
                                                    borderRadius: '6px 6px 0 0',
                                                    borderLeft: '3px solid var(--color-purple)',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center'
                                                }}>
                                                    <Text strong style={{ color: 'var(--color-purple)', fontSize: 13 }}>RESOURCE UPGRADE</Text>
                                                    {job_id && (
                                                        <Tag className='auto-width-tag' color="purple" style={{ margin: 0 }}>
                                                            Job: {job_id}
                                                        </Tag>
                                                    )}
                                                </div>
                                                <div style={{ background: 'var(--bg-surface)', padding: 16 }}>
                                                    {/* Version Upgrade */}
                                                    <Row gutter={16} style={{ marginBottom: 16 }}>
                                                        <Col span={24}>
                                                            <div style={{
                                                                background: 'var(--card-bg)',
                                                                border: '1px solid var(--color-purple-border)',
                                                                borderRadius: 8,
                                                                padding: 12
                                                            }}>
                                                                <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                                                                    <Text strong>Version Upgrade:</Text>
                                                                    <Tag className='auto-width-tag' color="blue" style={{ fontSize: 12 }}>
                                                                        {from_version}
                                                                    </Tag>
                                                                    <span style={{ color: 'var(--text-secondary)' }}>→</span>
                                                                    <Tag className='auto-width-tag' color="green" style={{ fontSize: 12 }}>
                                                                        {to_version}
                                                                    </Tag>
                                                                </div>
                                                                <div>
                                                                    <Text strong>Total Listeners:</Text> <Text code>{total_listeners || (listener_names?.length || 0)}</Text>
                                                                </div>
                                                            </div>
                                                        </Col>
                                                    </Row>

                                                    {/* Listener Names */}
                                                    {listener_names && listener_names.length > 0 && (
                                                        <Row gutter={16} style={{ marginBottom: 16 }}>
                                                            <Col span={24}>
                                                                <div>
                                                                    <Text type="secondary" style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
                                                                        AFFECTED LISTENERS ({listener_names.length})
                                                                    </Text>
                                                                    <div style={{
                                                                        background: 'var(--card-bg)',
                                                                        border: '1px solid var(--color-purple-border)',
                                                                        borderRadius: 8,
                                                                        padding: 12,
                                                                        marginTop: 8,
                                                                        maxHeight: 200,
                                                                        overflowY: 'auto'
                                                                    }}>
                                                                        {listener_names.map((name: string, idx: number) => (
                                                                            <div key={idx} style={{
                                                                                padding: '4px 0',
                                                                                borderBottom: idx < listener_names.length - 1 ? '1px solid var(--border-default)' : 'none'
                                                                            }}>
                                                                                <Text code style={{ fontSize: 12 }}>{name}</Text>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    )}

                                                    {/* Upgrade Options */}
                                                    {options && (
                                                        <Row gutter={16}>
                                                            <Col span={24}>
                                                                <div>
                                                                    <Text type="secondary" style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
                                                                        UPGRADE OPTIONS
                                                                    </Text>
                                                                    <div style={{
                                                                        background: 'var(--card-bg)',
                                                                        border: '1px solid var(--color-purple-border)',
                                                                        borderRadius: 8,
                                                                        padding: 12,
                                                                        marginTop: 8
                                                                    }}>
                                                                        <Row gutter={[12, 12]}>
                                                                            {options.autocreatemissing !== undefined && (
                                                                                <Col span={12}>
                                                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                                                        <Text type="secondary" style={{ fontSize: 11 }}>Auto Create Missing:</Text>
                                                                                        <Tag className='auto-width-tag' color={options.autocreatemissing ? 'success' : 'default'} style={{ fontSize: 11, margin: 0 }}>
                                                                                            {options.autocreatemissing ? 'Yes' : 'No'}
                                                                                        </Tag>
                                                                                    </div>
                                                                                </Col>
                                                                            )}
                                                                            {options.dryrun !== undefined && (
                                                                                <Col span={12}>
                                                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                                                        <Text type="secondary" style={{ fontSize: 11 }}>Dry Run:</Text>
                                                                                        <Tag className='auto-width-tag' color={options.dryrun ? 'warning' : 'processing'} style={{ fontSize: 11, margin: 0 }}>
                                                                                            {options.dryrun ? 'Yes' : 'No'}
                                                                                        </Tag>
                                                                                    </div>
                                                                                </Col>
                                                                            )}
                                                                            {options.validateclients !== undefined && (
                                                                                <Col span={12}>
                                                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                                                        <Text type="secondary" style={{ fontSize: 11 }}>Validate Clients:</Text>
                                                                                        <Tag className='auto-width-tag' color={options.validateclients ? 'success' : 'default'} style={{ fontSize: 11, margin: 0 }}>
                                                                                            {options.validateclients ? 'Yes' : 'No'}
                                                                                        </Tag>
                                                                                    </div>
                                                                                </Col>
                                                                            )}
                                                                            {options.updatebootstrap !== undefined && (
                                                                                <Col span={12}>
                                                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                                                        <Text type="secondary" style={{ fontSize: 11 }}>Update Bootstrap:</Text>
                                                                                        <Tag className='auto-width-tag' color={options.updatebootstrap ? 'success' : 'default'} style={{ fontSize: 11, margin: 0 }}>
                                                                                            {options.updatebootstrap ? 'Yes' : 'No'}
                                                                                        </Tag>
                                                                                    </div>
                                                                                </Col>
                                                                            )}
                                                                        </Row>
                                                                    </div>
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    }

                                    // Special handling for EXPORT_BACKUP action
                                    if (auditLog.action === 'EXPORT_BACKUP' && auditLog.changes) {
                                        const { backup_id, backup_type, project: projectId } = auditLog.changes as any;

                                        return (
                                            <div>
                                                <div style={{
                                                    background: 'var(--color-primary-bg)',
                                                    padding: '8px 12px',
                                                    borderRadius: '6px 6px 0 0',
                                                    borderLeft: '3px solid var(--color-primary)',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center'
                                                }}>
                                                    <Text strong style={{ color: 'var(--color-primary)', fontSize: 13 }}>BACKUP EXPORT</Text>
                                                    {backup_id && (
                                                        <Tag className='auto-width-tag' color="blue" style={{ margin: 0, fontFamily: 'monospace', fontSize: 11 }}>
                                                            {backup_id}
                                                        </Tag>
                                                    )}
                                                </div>
                                                <div style={{ background: 'var(--bg-surface)', padding: 16 }}>
                                                    <Row gutter={16}>
                                                        <Col span={12}>
                                                            <div style={{
                                                                background: 'var(--card-bg)',
                                                                border: '1px solid var(--color-primary-border)',
                                                                borderRadius: 8,
                                                                padding: 12
                                                            }}>
                                                                <div style={{ marginBottom: 8 }}>
                                                                    <Text strong>Backup Type:</Text>{' '}
                                                                    <Tag className='auto-width-tag' color={backup_type === 'global' ? 'purple' : 'blue'} style={{ fontSize: 12 }}>
                                                                        {backup_type?.toUpperCase()}
                                                                    </Tag>
                                                                </div>
                                                                {projectId && backup_type === 'project' && (
                                                                    <div>
                                                                        <Text strong>Project ID:</Text>{' '}
                                                                        <Text code style={{ fontSize: 11 }}>{projectId}</Text>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </div>
                                        );
                                    }

                                    // Special handling for IMPORT_BACKUP action
                                    if ((auditLog.action === 'IMPORT_BACKUP' || auditLog.action === 'IMPORT_BACKUP_DRY') && auditLog.changes) {
                                        const { backup_id, permission_strategy, dry_run, total_created, total_updated, total_failed, success: importSuccess } = auditLog.changes as any;
                                        const hasStats = total_created !== undefined || total_updated !== undefined || total_failed !== undefined;

                                        return (
                                            <div>
                                                <div style={{
                                                    background: 'var(--color-success-bg)',
                                                    padding: '8px 12px',
                                                    borderRadius: '6px 6px 0 0',
                                                    borderLeft: '3px solid var(--color-success)',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center'
                                                }}>
                                                    <Text strong style={{ color: 'var(--color-success)', fontSize: 13 }}>BACKUP IMPORT</Text>
                                                    <div style={{ display: 'flex', gap: 8 }}>
                                                        {dry_run && (
                                                            <Tag className='auto-width-tag' color="warning" style={{ margin: 0 }}>
                                                                DRY RUN
                                                            </Tag>
                                                        )}
                                                        {importSuccess !== undefined && (
                                                            <Tag className='auto-width-tag' color={importSuccess ? 'success' : 'error'} style={{ margin: 0 }}>
                                                                {importSuccess ? 'SUCCESS' : 'FAILED'}
                                                            </Tag>
                                                        )}
                                                        {backup_id && (
                                                            <Tag className='auto-width-tag' color="green" style={{ margin: 0, fontFamily: 'monospace', fontSize: 11 }}>
                                                                {backup_id}
                                                            </Tag>
                                                        )}
                                                    </div>
                                                </div>
                                                <div style={{ background: 'var(--bg-surface)', padding: 16 }}>
                                                    <Row gutter={16}>
                                                        <Col span={hasStats ? 12 : 24}>
                                                            <div style={{
                                                                background: 'var(--card-bg)',
                                                                border: '1px solid var(--color-success-border)',
                                                                borderRadius: 8,
                                                                padding: 12
                                                            }}>
                                                                {permission_strategy && (
                                                                    <div style={{ marginBottom: 8 }}>
                                                                        <Text strong>Permission Strategy:</Text>{' '}
                                                                        <Tag className='auto-width-tag' color="cyan" style={{ fontSize: 12 }}>
                                                                            {permission_strategy?.toUpperCase()}
                                                                        </Tag>
                                                                    </div>
                                                                )}
                                                                <div>
                                                                    <Text strong>Dry Run:</Text>{' '}
                                                                    <Tag className='auto-width-tag' color={dry_run ? 'warning' : 'success'} style={{ fontSize: 12 }}>
                                                                        {dry_run ? 'YES' : 'NO'}
                                                                    </Tag>
                                                                </div>
                                                            </div>
                                                        </Col>
                                                        {hasStats && (
                                                            <Col span={12}>
                                                                <div>
                                                                    <Text type="secondary" style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
                                                                        IMPORT STATISTICS
                                                                    </Text>
                                                                    <div style={{
                                                                        background: 'var(--card-bg)',
                                                                        border: '1px solid var(--color-success-border)',
                                                                        borderRadius: 8,
                                                                        padding: 12,
                                                                        marginTop: 8,
                                                                        display: 'flex',
                                                                        flexDirection: 'column',
                                                                        gap: 8
                                                                    }}>
                                                                        {total_created !== undefined && (
                                                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                                <Text type="secondary" style={{ fontSize: 11 }}>Created:</Text>
                                                                                <Tag className='auto-width-tag' color="success" style={{ fontSize: 11, margin: 0, minWidth: 40, textAlign: 'center' }}>
                                                                                    {total_created}
                                                                                </Tag>
                                                                            </div>
                                                                        )}
                                                                        {total_updated !== undefined && (
                                                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                                <Text type="secondary" style={{ fontSize: 11 }}>Updated:</Text>
                                                                                <Tag className='auto-width-tag' color="processing" style={{ fontSize: 11, margin: 0, minWidth: 40, textAlign: 'center' }}>
                                                                                    {total_updated}
                                                                                </Tag>
                                                                            </div>
                                                                        )}
                                                                        {total_failed !== undefined && (
                                                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                                <Text type="secondary" style={{ fontSize: 11 }}>Failed:</Text>
                                                                                <Tag className='auto-width-tag' color={total_failed > 0 ? 'error' : 'default'} style={{ fontSize: 11, margin: 0, minWidth: 40, textAlign: 'center' }}>
                                                                                    {total_failed}
                                                                                </Tag>
                                                                            </div>
                                                                        )}
                                                                        {(total_created !== undefined || total_updated !== undefined) && (
                                                                            <div style={{
                                                                                borderTop: '1px solid var(--border-default)',
                                                                                paddingTop: 8,
                                                                                marginTop: 4,
                                                                                display: 'flex',
                                                                                justifyContent: 'space-between',
                                                                                alignItems: 'center'
                                                                            }}>
                                                                                <Text strong style={{ fontSize: 11 }}>Total:</Text>
                                                                                <Text strong style={{ fontSize: 12 }}>
                                                                                    {(total_created || 0) + (total_updated || 0) + (total_failed || 0)}
                                                                                </Text>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </Col>
                                                        )}
                                                    </Row>
                                                </div>
                                            </div>
                                        );
                                    }

                                    // Special handling for DISCOVERY_UPDATE_ENDPOINT action
                                    if (auditLog.action === 'DISCOVERY_UPDATE_ENDPOINT' && auditLog.changes.before && auditLog.changes.after && auditLog.changes.diff) {
                                        const { before, after, diff } = auditLog.changes;
                                        const hasAddedIPs = diff.added_ips && Array.isArray(diff.added_ips) && diff.added_ips.length > 0;
                                        const hasRemovedIPs = diff.removed_ips && Array.isArray(diff.removed_ips) && diff.removed_ips.length > 0;

                                        return (
                                            <div>
                                                <div style={{
                                                    background: 'var(--color-primary-bg)',
                                                    padding: '8px 12px',
                                                    borderRadius: '6px 6px 0 0',
                                                    borderLeft: '3px solid var(--color-primary)',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center'
                                                }}>
                                                    <Text strong style={{ color: 'var(--color-primary)', fontSize: 13 }}>ENDPOINT DISCOVERY UPDATE</Text>
                                                    <div style={{ display: 'flex', gap: 8 }}>
                                                        {hasAddedIPs && (
                                                            <Badge count={diff.added_count || diff.added_ips.length} style={{ backgroundColor: 'var(--color-success)' }}>
                                                                <Tag color="green" style={{ margin: 0 }}>Added</Tag>
                                                            </Badge>
                                                        )}
                                                        {hasRemovedIPs && (
                                                            <Badge count={diff.removed_count || diff.removed_ips.length} style={{ backgroundColor: 'var(--color-error)' }}>
                                                                <Tag color="red" style={{ margin: 0 }}>Removed</Tag>
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                                <div style={{ background: 'var(--bg-surface)', padding: 16 }}>
                                                    {/* BEFORE and AFTER in same row */}
                                                    <Row gutter={16} style={{ marginBottom: 16 }}>
                                                        <Col span={12}>
                                                            <div>
                                                                <Text type="secondary" style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
                                                                    BEFORE
                                                                </Text>
                                                                <div style={{
                                                                    background: 'var(--color-danger-light)',
                                                                    border: '1px solid var(--color-danger-border)',
                                                                    borderRadius: 8,
                                                                    padding: 12,
                                                                    marginTop: 8
                                                                }}>
                                                                    <div style={{ marginBottom: 8 }}>
                                                                        <Text strong>Cluster:</Text> <Text code>{before.cluster}</Text>
                                                                    </div>
                                                                    <div>
                                                                        <Text strong>IP Count:</Text> <Text code>{before.ip_count}</Text>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </Col>
                                                        <Col span={12}>
                                                            <div>
                                                                <Text type="secondary" style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
                                                                    AFTER
                                                                </Text>
                                                                <div style={{
                                                                    background: 'var(--color-success-light)',
                                                                    border: '1px solid var(--color-success-border)',
                                                                    borderRadius: 8,
                                                                    padding: 12,
                                                                    marginTop: 8
                                                                }}>
                                                                    <div style={{ marginBottom: 8 }}>
                                                                        <Text strong>Cluster:</Text> <Text code>{after.cluster}</Text>
                                                                    </div>
                                                                    <div>
                                                                        <Text strong>IP Count:</Text> <Text code>{after.ip_count}</Text>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </Col>
                                                    </Row>

                                                    {/* CHANGES in separate row below */}
                                                    <Row>
                                                        <Col span={24}>
                                                            <div>
                                                                <Text type="secondary" style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
                                                                    CHANGES
                                                                </Text>
                                                                <div style={{
                                                                    background: 'var(--color-warning-light)',
                                                                    border: '1px solid var(--color-warning-border)',
                                                                    borderRadius: 8,
                                                                    padding: 12,
                                                                    marginTop: 8
                                                                }}>
                                                                    {hasAddedIPs && (
                                                                        <div style={{ marginBottom: hasRemovedIPs ? 12 : 0 }}>
                                                                            <Text strong style={{ color: 'var(--color-success)' }}>Added IPs ({diff.added_count || diff.added_ips.length}):</Text>
                                                                            <div style={{
                                                                                background: 'var(--color-success-light)',
                                                                                border: '1px solid var(--color-success-border)',
                                                                                borderRadius: 4,
                                                                                padding: 6,
                                                                                marginTop: 4,
                                                                                maxHeight: 120,
                                                                                overflowY: 'auto'
                                                                            }}>
                                                                                {diff.added_ips.map((ip: string, index: number) => (
                                                                                    <div key={index} style={{
                                                                                        fontSize: 11,
                                                                                        fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                                                                                        padding: 1,
                                                                                        color: 'var(--color-success)'
                                                                                    }}>
                                                                                        + {ip}
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                    {hasRemovedIPs && (
                                                                        <div>
                                                                            <Text strong style={{ color: 'var(--color-error)' }}>Removed IPs ({diff.removed_count || diff.removed_ips.length}):</Text>
                                                                            <div style={{
                                                                                background: 'var(--color-danger-light)',
                                                                                border: '1px solid var(--color-danger-border)',
                                                                                borderRadius: 4,
                                                                                padding: 6,
                                                                                marginTop: 4,
                                                                                maxHeight: 120,
                                                                                overflowY: 'auto'
                                                                            }}>
                                                                                {diff.removed_ips.map((ip: string, index: number) => (
                                                                                    <div key={index} style={{
                                                                                        fontSize: 11,
                                                                                        fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                                                                                        padding: 1,
                                                                                        color: 'var(--color-error)'
                                                                                    }}>
                                                                                        - {ip}
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                    {!hasAddedIPs && !hasRemovedIPs && (
                                                                        <Text type="secondary" style={{ fontSize: 12 }}>No IP changes detected</Text>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </div>
                                        );
                                    }

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
                                                    background: 'var(--color-primary-bg)',
                                                    padding: '8px 12px',
                                                    borderRadius: '6px 6px 0 0',
                                                    borderLeft: '3px solid var(--color-primary)',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center'
                                                }}>
                                                    <Text strong style={{ color: 'var(--color-primary)', fontSize: 13 }}>CHANGES DIFF</Text>
                                                </div>
                                                <pre style={{
                                                    background: 'var(--card-bg)',
                                                    border: '1px solid var(--color-info-border)',
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
                                                        let color = 'var(--text-primary)';
                                                        let background = 'transparent';

                                                        if (line.startsWith('+')) {
                                                            color = 'var(--color-success)';
                                                            background = 'var(--color-success-light)';
                                                        } else if (line.startsWith('-')) {
                                                            color = 'var(--color-danger)';
                                                            background = 'var(--color-danger-light)';
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
                                                        background: 'var(--color-success-bg)',
                                                        padding: '8px 12px',
                                                        borderRadius: '6px 6px 0 0',
                                                        borderLeft: '3px solid var(--color-success)',
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center'
                                                    }}>
                                                        <Text strong style={{ color: 'var(--color-success)', fontSize: 13 }}>ADDED</Text>
                                                        <Badge count={changesByType.create.length} style={{ backgroundColor: 'var(--color-success)' }} />
                                                    </div>
                                                    <div style={{ background: 'var(--bg-surface)', padding: 8 }}>
                                                        {changesByType.create.map((change, index) => (
                                                            <div key={index} style={{ marginBottom: index < changesByType.create.length - 1 ? 8 : 0 }}>
                                                                <div style={{ marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                                                                    <div style={{
                                                                        background: 'var(--color-success)',
                                                                        color: 'white',
                                                                        width: 16,
                                                                        height: 16,
                                                                        borderRadius: '50%',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                        fontSize: 10,
                                                                        fontWeight: 600
                                                                    }}>
                                                                        {index + 1}
                                                                    </div>
                                                                    <Tag color="green" style={{ borderRadius: 3, fontSize: 11, padding: '0 4px' }}>
                                                                        {change.path.join(' → ')}
                                                                    </Tag>
                                                                </div>
                                                                <JsonValue
                                                                    value={change.value}
                                                                    style={{
                                                                        background: 'var(--card-bg)',
                                                                        border: '1px solid var(--color-success-border)'
                                                                    }}
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {changesByType.update.length > 0 && (
                                                <div>
                                                    <div style={{
                                                        background: 'var(--color-primary-bg)',
                                                        padding: '8px 12px',
                                                        borderRadius: '6px 6px 0 0',
                                                        borderLeft: '3px solid var(--color-primary)',
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center'
                                                    }}>
                                                        <Text strong style={{ color: 'var(--color-primary)', fontSize: 13 }}>UPDATED</Text>
                                                        <Badge count={changesByType.update.length} style={{ backgroundColor: 'var(--color-primary)' }} />
                                                    </div>
                                                    <div style={{ background: 'var(--bg-surface)', padding: 8 }}>
                                                        {changesByType.update.map((change, index) => (
                                                            <div key={index} style={{ marginBottom: index < changesByType.update.length - 1 ? 8 : 0 }}>
                                                                <div style={{ marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                                                                    <div style={{
                                                                        background: 'var(--color-primary)',
                                                                        color: 'white',
                                                                        width: 16,
                                                                        height: 16,
                                                                        borderRadius: '50%',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                        fontSize: 10,
                                                                        fontWeight: 600
                                                                    }}>
                                                                        {index + 1}
                                                                    </div>
                                                                    <Tag color="blue" style={{ borderRadius: 3, fontSize: 11, padding: '0 4px' }}>
                                                                        {change.path.join(' → ')}
                                                                    </Tag>
                                                                </div>
                                                                {change.from !== undefined && change.to !== undefined ? (
                                                                    <div style={{
                                                                        background: 'var(--card-bg)',
                                                                        border: '1px solid var(--color-info-border)',
                                                                        borderRadius: 4,
                                                                        padding: 6,
                                                                        fontSize: 11,
                                                                        fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace'
                                                                    }}>
                                                                        <div style={{ marginBottom: 4, display: 'flex', gap: 8 }}>
                                                                            <div style={{ flex: 1 }}>
                                                                                <Text type="secondary" style={{ fontSize: 10 }}>From:</Text>
                                                                                <JsonValue
                                                                                    value={change.from}
                                                                                    style={{
                                                                                        background: 'var(--color-danger-light)',
                                                                                        border: '1px solid var(--color-danger-border)',
                                                                                        marginTop: 2
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                            <div style={{ flex: 1 }}>
                                                                                <Text type="secondary" style={{ fontSize: 10 }}>To:</Text>
                                                                                <JsonValue
                                                                                    value={change.to}
                                                                                    style={{
                                                                                        background: 'var(--color-success-light)',
                                                                                        border: '1px solid var(--color-success-border)',
                                                                                        marginTop: 2
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <JsonValue
                                                                        value={change.value}
                                                                        style={{
                                                                            background: 'var(--card-bg)',
                                                                            border: '1px solid var(--color-info-border)'
                                                                        }}
                                                                    />
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {changesByType.delete.length > 0 && (
                                                <div>
                                                    <div style={{
                                                        background: 'var(--color-error-bg)',
                                                        padding: '8px 12px',
                                                        borderRadius: '6px 6px 0 0',
                                                        borderLeft: '3px solid var(--color-error)',
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center'
                                                    }}>
                                                        <Text strong style={{ color: 'var(--color-error)', fontSize: 13 }}>DELETED</Text>
                                                        <Badge count={changesByType.delete.length} style={{ backgroundColor: 'var(--color-error)' }} />
                                                    </div>
                                                    <div style={{ background: 'var(--bg-surface)', padding: 8 }}>
                                                        {changesByType.delete.map((change, index) => (
                                                            <div key={index} style={{ marginBottom: index < changesByType.delete.length - 1 ? 8 : 0 }}>
                                                                <div style={{ marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                                                                    <div style={{
                                                                        background: 'var(--color-danger)',
                                                                        color: 'white',
                                                                        width: 16,
                                                                        height: 16,
                                                                        borderRadius: '50%',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                        fontSize: 10,
                                                                        fontWeight: 600
                                                                    }}>
                                                                        {index + 1}
                                                                    </div>
                                                                    <Tag color="red" style={{ borderRadius: 3, fontSize: 11, padding: '0 4px' }}>
                                                                        {change.path.join(' → ')}
                                                                    </Tag>
                                                                </div>
                                                                <JsonValue
                                                                    value={change.value}
                                                                    style={{
                                                                        background: 'var(--card-bg)',
                                                                        border: '1px solid var(--color-danger-border)'
                                                                    }}
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {(!changes?.changes || changes.changes.length === 0) && (
                                                <div style={{
                                                    textAlign: 'center',
                                                    padding: 32,
                                                    color: 'var(--text-secondary)',
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
                    {/* Command Information */}
                    {auditLog.command && auditLog.api_type === 'CLIENT_COMMAND' && (
                        <Card
                            style={{
                                borderRadius: 16,
                                marginBottom: 24,
                                border: '1px solid var(--border-default)',
                                background: 'var(--card-bg)',
                                boxShadow: 'var(--shadow-sm)',
                                overflow: 'hidden'
                            }}
                        >
                            <div style={{ marginBottom: 20 }}>
                                <Text type="secondary" style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
                                    COMMAND DETAILS
                                </Text>
                            </div>
                            <div style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border-default)' }}>
                                <MonacoEditor
                                    height="400px"
                                    width="100%"
                                    language="json"
                                    value={JSON.stringify(auditLog.command, null, 2)}
                                    theme={isDark ? 'vs-dark' : 'vs-light'}
                                    options={{
                                        readOnly: true,
                                        minimap: { enabled: false },
                                        automaticLayout: true,
                                        scrollBeyondLastLine: false,
                                        padding: { top: 10 },
                                        bracketPairColorization: { enabled: true },
                                        renderWhitespace: "all",
                                        renderLineHighlight: "all",
                                        folding: true,
                                        foldingHighlight: true,
                                        foldingImportsByDefault: false,
                                        showUnused: false,
                                        wordWrap: "on",
                                        contextmenu: false,
                                        scrollbar: {
                                            vertical: 'auto',
                                            horizontal: 'auto'
                                        }
                                    }}
                                />
                            </div>
                        </Card>
                    )}
                </Col>

                <Col span={6}>
                    {/* API Information */}
                    <Card
                        style={{
                            borderRadius: 16,
                            marginBottom: 24,
                            border: '1px solid var(--border-default)',
                            background: 'var(--card-bg)',
                            boxShadow: 'var(--shadow-sm)',
                            overflow: 'hidden'
                        }}
                    >
                        <div style={{ marginBottom: 20 }}>
                            <Text type="secondary" style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
                                API DETAILS
                            </Text>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div>
                                <Text type="secondary" style={{ fontSize: 12 }}>Method</Text>
                                <div style={{ marginTop: 4 }}>
                                    <Tag className='auto-width-tag' color={getMethodColor(auditLog.method)} style={{ fontWeight: 600 }}>
                                        {auditLog.method}
                                    </Tag>
                                </div>
                            </div>
                            <div>
                                <Text type="secondary" style={{ fontSize: 12 }}>Path</Text>
                                <div style={{ marginTop: 4 }}>
                                    <Text code style={{ fontSize: 11, wordBreak: 'break-all' }}>{auditLog.path}</Text>
                                </div>
                            </div>
                            <div>
                                <Text type="secondary" style={{ fontSize: 12 }}>Resource Name</Text>
                                <div style={{ marginTop: 4 }}>
                                    <Text strong style={{ fontSize: 13 }}>{auditLog.resource_name || auditLog.resource_id}</Text>
                                </div>
                            </div>
                            <div>
                                <Text type="secondary" style={{ fontSize: 12 }}>Resource Type</Text>
                                <div style={{ marginTop: 4 }}>
                                    <Text style={{ fontSize: 12 }}>{auditLog.resource_type}</Text>
                                </div>
                            </div>
                            {auditLog.action === 'UPDATE' && (auditLog as any).save_or_publish && (
                                <div>
                                    <Text type="secondary" style={{ fontSize: 12 }}>Save or Publish</Text>
                                    <div style={{ marginTop: 4 }}>
                                        <Tag
                                            className='auto-width-tag'
                                            color={(auditLog as any).save_or_publish === 'publish' ? 'blue' : 'green'}
                                            style={{ fontWeight: 600 }}
                                        >
                                            {(auditLog as any).save_or_publish.toUpperCase()}
                                        </Tag>
                                    </div>
                                </div>
                            )}
                        </div>
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

                    {/* Quick Stats */}
                    <Card
                        style={{
                            borderRadius: 16,
                            marginBottom: 24,
                            border: '1px solid var(--border-default)',
                            background: 'var(--card-bg)',
                            boxShadow: 'var(--shadow-sm)',
                            overflow: 'hidden'
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
                                background: auditLog.success ? 'var(--color-success-light)' : 'var(--color-danger-light)',
                                borderRadius: 12
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    {auditLog.success ?
                                        <CheckCircleOutlined style={{ color: 'var(--color-success)' }} /> :
                                        <CloseCircleOutlined style={{ color: 'var(--color-error)' }} />
                                    }
                                    <Text style={{ fontSize: 13 }}>Status</Text>
                                </div>
                                <Text strong style={{ fontSize: 16, color: auditLog.success ? 'var(--color-success)' : 'var(--color-danger)' }}>
                                    {auditLog.success ? 'Success' : 'Failed'}
                                </Text>
                            </div>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '12px 16px',
                                background: 'var(--color-info-light)',
                                borderRadius: 12
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <ApiOutlined style={{ color: 'var(--color-info)' }} />
                                    <Text style={{ fontSize: 13 }}>HTTP Status</Text>
                                </div>
                                <Text strong style={{ fontSize: 16, color: auditLog.response_status >= 400 ? 'var(--color-danger)' : 'var(--color-success)' }}>
                                    {auditLog.response_status}
                                </Text>
                            </div>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '12px 16px',
                                background: 'var(--color-warning-light)',
                                borderRadius: 12
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <ClockCircleOutlined style={{ color: 'var(--color-warning)' }} />
                                    <Text style={{ fontSize: 13 }}>Duration</Text>
                                </div>
                                <Text strong style={{ fontSize: 16, color: 'var(--color-warning)' }}>{auditLog.duration_ms}ms</Text>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default AuditDetail;