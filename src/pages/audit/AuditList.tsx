import React, { useState } from 'react';
import { Table, Typography, Pagination, Tag, Input, Space, Card, Select, Button, Row, Col, DatePicker, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useAuditLogs, useAuditStats } from '@/hooks/useAudit';
import { AuditLog } from '@/hooks/useAudit';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import { 
    SearchOutlined, 
    ClearOutlined, 
    InboxOutlined,
    AuditOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    EyeOutlined,
    UserOutlined,
    ClockCircleOutlined,
    BarChartOutlined,
    ThunderboltOutlined,
    ExclamationCircleOutlined,
    DatabaseOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const AuditList: React.FC = () => {
    // Default last 1 month filter
    const defaultEndDate = dayjs();
    const defaultStartDate = dayjs().subtract(1, 'month');
    
    const [filters, setFilters] = useState<Record<string, any>>({
        start_time: defaultStartDate.toISOString(),
        end_time: defaultEndDate.toISOString()
    });
    const [tempFilters, setTempFilters] = useState<Record<string, any>>({
        start_time: defaultStartDate.toISOString(),
        end_time: defaultEndDate.toISOString()
    });
    const { project } = useProjectVariable();
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(50);
    const navigate = useNavigate();

    const { data: auditResponse, isLoading } = useAuditLogs({
        filters: {
            ...filters,
            project
        },
        pagination: {
            limit: pageSize,
            skip: (currentPage - 1) * pageSize
        }
    });

    const { data: statsResponse, isLoading: isStatsLoading } = useAuditStats({
        filters: {
            project,
            ...filters
        }
    });

    const applyFilters = () => {
        setFilters(tempFilters);
        setCurrentPage(1);
    };

    const clearFilters = () => {
        const defaultFilters = {
            start_time: defaultStartDate.toISOString(),
            end_time: defaultEndDate.toISOString()
        };
        setTempFilters(defaultFilters);
        setFilters(defaultFilters);
        setCurrentPage(1);
    };

    const handleDateRangeChange = (dates: any) => {
        if (dates && dates.length === 2) {
            setTempFilters(prev => ({
                ...prev,
                start_time: dates[0].toISOString(),
                end_time: dates[1].toISOString()
            }));
        } else {
            setTempFilters(prev => {
                const { start_time: _, end_time: __, ...rest } = prev;
                return rest;
            });
        }
    };

    const handleViewDetails = (record: AuditLog) => {
        navigate(`/audit/${record.id}`, { state: { auditLog: record } });
    };

    const tableData = auditResponse?.data || [];
    const totalRecords = auditResponse?.pagination?.total || 0;

    const getSuccessTag = (success: boolean) => (
        <Tag 
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

    const columns: ColumnsType<AuditLog> = [
        {
            title: 'Timestamp',
            dataIndex: 'timestamp',
            key: 'timestamp',
            width: '12%',
            sorter: (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
            render: (timestamp: string) => (
                <Tooltip title={new Date(timestamp).toLocaleString()}>
                    <Space direction="vertical" size="small">
                        <Text style={{ fontSize: 12, fontWeight: 500 }}>
                            {formatDistanceToNow(new Date(timestamp), { addSuffix: true })}
                        </Text>
                        <Text type="secondary" style={{ fontSize: 11 }}>
                            {new Date(timestamp).toLocaleTimeString()}
                        </Text>
                    </Space>
                </Tooltip>
            )
        },
        {
            title: 'User',
            dataIndex: 'username',
            key: 'username',
            width: '10%',
            render: (username: string, record: AuditLog) => (
                <Space>
                    <UserOutlined style={{ color: '#1890ff' }} />
                    <Space direction="vertical" size="small">
                        <Text strong style={{ fontSize: 12 }}>{username}</Text>
                        <Tag color="blue" style={{ fontSize: 11 }}>{record.user_role}</Tag>
                    </Space>
                </Space>
            )
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            width: '8%',
            render: (action: string) => (
                <Tag color={getActionColor(action)} style={{ fontWeight: 600 }}>
                    {action.toUpperCase()}
                </Tag>
            )
        },
        {
            title: 'Resource Type',
            key: 'resource',
            width: '15%',
            render: (_, record: AuditLog) => (
                <Space direction="vertical" size="small">
                    <Text strong style={{ fontSize: 12 }}>{record.resource_type?.replace("filters/", "")?.replace("extensions/", "")}</Text>
                    {record.resource_name && (
                        <Text type="secondary" style={{ fontSize: 11 }}>
                            {record.resource_name}
                        </Text>
                    )}
                </Space>
            )
        },
        {
            title: 'Path',
            dataIndex: 'path',
            key: 'path',
            width: '20%',
            render: (path: string) => (
                <Text code style={{ fontSize: 11, maxWidth: 200, display: 'block', wordBreak: 'break-all' }}>
                    {path}
                </Text>
            )
        },
        {
            title: 'Status',
            key: 'status',
            width: '8%',
            render: (_, record: AuditLog) => (
                <Space direction="vertical" size="small">
                    {getSuccessTag(record.success)}
                    <Text style={{ fontSize: 11, color: record.response_status >= 400 ? '#ff4d4f' : '#52c41a' }}>
                        {record.response_status}
                    </Text>
                </Space>
            )
        },
        {
            title: 'Duration',
            dataIndex: 'duration_ms',
            key: 'duration_ms',
            width: '8%',
            sorter: (a, b) => a.duration_ms - b.duration_ms,
            render: (duration: number) => (
                <Space>
                    <ClockCircleOutlined style={{ color: '#faad14' }} />
                    <Text style={{ fontSize: 12 }}>{duration}ms</Text>
                </Space>
            )
        },
        {
            title: 'Actions',
            key: 'actions',
            width: '8%',
            render: (_, record: AuditLog) => (
                <Button
                    type="primary"
                    size="small"
                    icon={<EyeOutlined />}
                    onClick={() => handleViewDetails(record)}
                    style={{ borderRadius: 6 }}
                >
                    Details
                </Button>
            )
        }
    ];

    return (
        <>
            {/* Header Section */}
            <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <Space>
                        <AuditOutlined style={{ color: '#1890ff', fontSize: 24 }} />
                        <Title level={4} style={{ margin: 0 }}>Audit Logs</Title>
                    </Space>
                </div>
                
                <Text type="secondary">
                    Track and monitor all system activities, user actions, and API calls across your infrastructure.
                </Text>
            </div>

            {/* Stats Cards */}
            <Row gutter={[16, 12]} style={{ marginBottom: 16 }}>
                {/* Count Stats - Left Side (2 rows) */}
                <Col span={6}>
                    <Row gutter={[12, 8]} style={{ height: '100%' }}>
                        <Col span={12}>
                            <Card 
                                size="small" 
                                style={{ borderRadius: 8, textAlign: 'center', padding: '8px 0', height: '100%' }}
                                loading={isStatsLoading}
                            >
                                <div style={{ fontSize: 20, fontWeight: 600, color: '#1890ff' }}>
                                    {statsResponse?.data?.total_entries?.toLocaleString() || 0}
                                </div>
                                <div style={{ fontSize: 11, color: '#8c8c8c', marginTop: 2 }}>
                                    <AuditOutlined style={{ marginRight: 3, fontSize: 10 }} />
                                    Total
                                </div>
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card 
                                size="small" 
                                style={{ borderRadius: 8, textAlign: 'center', padding: '8px 0', height: '100%' }}
                                loading={isStatsLoading}
                            >
                                <div style={{ fontSize: 20, fontWeight: 600, color: '#52c41a' }}>
                                    {statsResponse?.data ? `${(statsResponse.data.success_rate * 100).toFixed(1)}%` : '0%'}
                                </div>
                                <div style={{ fontSize: 11, color: '#8c8c8c', marginTop: 2 }}>
                                    <CheckCircleOutlined style={{ marginRight: 3, fontSize: 10 }} />
                                    Success
                                </div>
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card 
                                size="small" 
                                style={{ borderRadius: 8, textAlign: 'center', padding: '8px 0', height: '100%' }}
                                loading={isStatsLoading}
                            >
                                <div style={{ fontSize: 20, fontWeight: 600, color: '#ff4d4f' }}>
                                    {statsResponse?.data ? `${(statsResponse.data.error_rate * 100).toFixed(1)}%` : '0%'}
                                </div>
                                <div style={{ fontSize: 11, color: '#8c8c8c', marginTop: 2 }}>
                                    <ExclamationCircleOutlined style={{ marginRight: 3, fontSize: 10 }} />
                                    Error
                                </div>
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card 
                                size="small" 
                                style={{ borderRadius: 8, textAlign: 'center', padding: '8px 0', height: '100%' }}
                                loading={isStatsLoading}
                            >
                                <div style={{ fontSize: 20, fontWeight: 600, color: '#faad14' }}>
                                    {statsResponse?.data?.average_response_ms ? `${Math.round(statsResponse.data.average_response_ms)}ms` : '0ms'}
                                </div>
                                <div style={{ fontSize: 11, color: '#8c8c8c', marginTop: 2 }}>
                                    <ThunderboltOutlined style={{ marginRight: 3, fontSize: 10 }} />
                                    Avg Time
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </Col>

                {/* Top Lists - Right Side */}
                <Col span={18} style={{ display: 'flex' }}>
                    <Row gutter={[12, 0]} style={{ flex: 1 }}>
                        <Col span={8}>
                            <Card 
                                size="small" 
                                style={{ borderRadius: 8, height: '100%' }}
                                loading={isStatsLoading}
                            >
                                <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 8, fontWeight: 600 }}>
                                    <BarChartOutlined style={{ marginRight: 4 }} />
                                    Top Actions
                                </div>
                                <div style={{ 
                                    height: 'calc(100% - 32px)',
                                    maxHeight: '160px',
                                    overflowY: 'auto',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 4
                                }}>
                                    {Object.entries(statsResponse?.data?.top_actions || {}).length > 0 ? (
                                        Object.entries(statsResponse.data.top_actions)
                                            .sort(([,a], [,b]) => (b as number) - (a as number))
                                            .map(([action, count]) => (
                                            <div key={action} style={{ 
                                                display: 'flex', 
                                                justifyContent: 'space-between', 
                                                alignItems: 'center',
                                                padding: '2px 8px',
                                                background: '#f5f5f5',
                                                borderRadius: 4,
                                                fontSize: 11
                                            }}>
                                                <span>{action.replace(/_/g, ' ')}</span>
                                                <Tag color="default" style={{ margin: 0, fontSize: 10 }}>
                                                    {count as number}
                                                </Tag>
                                            </div>
                                        ))
                                    ) : (
                                        <div style={{ textAlign: 'center', color: '#ccc', fontSize: 11, marginTop: 20 }}>
                                            No data available
                                        </div>
                                    )}
                                </div>
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card 
                                size="small" 
                                style={{ borderRadius: 8, height: '100%' }}
                                loading={isStatsLoading}
                            >
                                <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 8, fontWeight: 600 }}>
                                    <UserOutlined style={{ marginRight: 4 }} />
                                    Top Users
                                </div>
                                <div style={{ 
                                    height: 'calc(100% - 32px)',
                                    maxHeight: '160px',
                                    overflowY: 'auto',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 4
                                }}>
                                    {Object.entries(statsResponse?.data?.top_users || {}).length > 0 ? (
                                        Object.entries(statsResponse.data.top_users)
                                            .sort(([,a], [,b]) => (b as number) - (a as number))
                                            .map(([user, count]) => (
                                            <div key={user} style={{ 
                                                display: 'flex', 
                                                justifyContent: 'space-between', 
                                                alignItems: 'center',
                                                padding: '2px 8px',
                                                background: '#f0f8ff',
                                                borderRadius: 4,
                                                fontSize: 11
                                            }}>
                                                <span>{user}</span>
                                                <Tag color="blue" style={{ margin: 0, fontSize: 10 }}>
                                                    {count as number}
                                                </Tag>
                                            </div>
                                        ))
                                    ) : (
                                        <div style={{ textAlign: 'center', color: '#ccc', fontSize: 11, marginTop: 20 }}>
                                            No data available
                                        </div>
                                    )}
                                </div>
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card 
                                size="small" 
                                style={{ borderRadius: 8, height: '100%' }}
                                loading={isStatsLoading}
                            >
                                <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 8, fontWeight: 600 }}>
                                    <DatabaseOutlined style={{ marginRight: 4 }} />
                                    Top Resources
                                </div>
                                <div style={{ 
                                    height: 'calc(100% - 32px)',
                                    maxHeight: '160px',
                                    overflowY: 'auto',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 4
                                }}>
                                    {Object.entries(statsResponse?.data?.top_resources || {}).length > 0 ? (
                                        Object.entries(statsResponse.data.top_resources)
                                            .sort(([,a], [,b]) => (b as number) - (a as number))
                                            .map(([resource, count]) => (
                                            <div key={resource} style={{ 
                                                display: 'flex', 
                                                justifyContent: 'space-between', 
                                                alignItems: 'center',
                                                padding: '2px 8px',
                                                background: '#f9f0ff',
                                                borderRadius: 4,
                                                fontSize: 11
                                            }}>
                                                <span>{resource.replace(/_/g, ' ')}</span>
                                                <Tag color="purple" style={{ margin: 0, fontSize: 10 }}>
                                                    {count as number}
                                                </Tag>
                                            </div>
                                        ))
                                    ) : (
                                        <div style={{ textAlign: 'center', color: '#ccc', fontSize: 11, marginTop: 20 }}>
                                            No data available
                                        </div>
                                    )}
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>

            {/* Filter Bar */}
            <Card 
                size="small" 
                style={{ 
                    marginBottom: 16,
                    borderRadius: 12,
                    boxShadow: '0 2px 8px rgba(5,117,230,0.06)'
                }}
            >
                <Row gutter={[16, 16]} align="middle">
                    <Col span={5}>
                        <Input
                            placeholder="Search by username..."
                            allowClear
                            prefix={<SearchOutlined />}
                            value={tempFilters.username}
                            onChange={(e) => setTempFilters(prev => ({ ...prev, username: e.target.value }))}
                            onPressEnter={applyFilters}
                        />
                    </Col>
                    <Col span={4}>
                        <Select
                            placeholder="Action"
                            allowClear
                            value={tempFilters.action || undefined}
                            onChange={(value) => setTempFilters(prev => ({ ...prev, action: value }))}
                            style={{ width: '100%' }}
                            options={[
                                { value: "CREATE", label: "CREATE" },
                                { value: "UPDATE", label: "UPDATE" },
                                { value: "DELETE", label: "DELETE" },
                                { value: "DEPLOY", label: "DEPLOY" },
                                { value: "UNDEPLOY", label: "UNDEPLOY" },
                                { value: "SERVICE_START", label: "SERVICE START" },
                                { value: "SERVICE_STOP", label: "SERVICE STOP" },
                                { value: "SERVICE_RESTART", label: "SERVICE RESTART" },
                                { value: "SERVICE_RELOAD", label: "SERVICE RELOAD" },
                            ]}
                        />
                    </Col>
                    <Col span={4}>
                        <Select
                            placeholder="Resource Type"
                            allowClear
                            value={tempFilters.resource_type || undefined}
                            onChange={(value) => setTempFilters(prev => ({ ...prev, resource_type: value }))}
                            style={{ width: '100%' }}
                            options={[
                                { value: "service", label: "Service" },
                                { value: "client", label: "Client" },
                                { value: "listener", label: "Listener" },
                                { value: "cluster", label: "Cluster" },
                                { value: "route", label: "Route" },
                                { value: "user", label: "User" },
                                { value: "project", label: "Project" }
                            ]}
                        />
                    </Col>
                    <Col span={3}>
                        <Select
                            placeholder="Status"
                            allowClear
                            value={tempFilters.success !== undefined ? tempFilters.success : undefined}
                            onChange={(value) => setTempFilters(prev => ({ ...prev, success: value }))}
                            style={{ width: '100%' }}
                            options={[
                                { value: true, label: "Success" },
                                { value: false, label: "Failed" }
                            ]}
                        />
                    </Col>
                    <Col span={5}>
                        <RangePicker
                            placeholder={['Start Date', 'End Date']}
                            value={tempFilters.start_time && tempFilters.end_time ? [dayjs(tempFilters.start_time), dayjs(tempFilters.end_time)] : null}
                            onChange={handleDateRangeChange}
                            style={{ width: '100%' }}
                            showTime
                        />
                    </Col>
                    <Col span={3}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Space>
                                <Button 
                                    icon={<SearchOutlined />}
                                    onClick={applyFilters}
                                    style={{ 
                                        borderRadius: 6,
                                        background: 'white',
                                        border: '1px solid #d9d9d9',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'linear-gradient(90deg, #056ccd 0%, #00c6fb 100%)';
                                        e.currentTarget.style.color = 'white';
                                        e.currentTarget.style.borderColor = '#056ccd';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'white';
                                        e.currentTarget.style.color = 'rgba(0, 0, 0, 0.88)';
                                        e.currentTarget.style.borderColor = '#d9d9d9';
                                    }}
                                >
                                    Search
                                </Button>
                                {(Object.keys(tempFilters).length > 0 || Object.keys(filters).length > 0) && (
                                    <Button 
                                        icon={<ClearOutlined />}
                                        onClick={clearFilters}
                                        style={{ borderRadius: 6 }}
                                    >
                                        Clear
                                    </Button>
                                )}
                            </Space>
                        </div>
                    </Col>
                </Row>
            </Card>

            {/* Data Table Card */}
            <Card
                style={{
                    borderRadius: 12,
                    boxShadow: '0 2px 8px rgba(5,117,230,0.06)',
                }}
                styles={{
                    body: { padding: 12 }
                }}
            >
                <Table
                    loading={isLoading}
                    rowKey={(record) => record.id}
                    columns={columns}
                    size="small"
                    dataSource={tableData}
                    pagination={false}
                    locale={{
                        emptyText: (
                            <div>
                                <InboxOutlined style={{ fontSize: 48, marginBottom: 8 }} />
                                <div>No Audit Logs</div>
                            </div>
                        )
                    }}
                    onRow={(record) => ({
                        onClick: () => handleViewDetails(record),
                        style: {
                            cursor: 'pointer'
                        }
                    })}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        color: '#8c8c8c',
                        fontSize: 12,
                        padding: '4px 0',
                        gap: 6
                    }}>
                        Total: {totalRecords}
                        {auditResponse?.pagination && (
                            <span style={{ marginLeft: 8 }}>
                                (Page {Math.floor((auditResponse.pagination.skip / pageSize) + 1)} of {Math.ceil(totalRecords / pageSize)})
                            </span>
                        )}
                    </div>
                    <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={totalRecords}
                        onChange={setCurrentPage}
                        onShowSizeChange={(_, size) => {
                            setPageSize(size);
                            setCurrentPage(1);
                        }}
                        showSizeChanger={true}
                        pageSizeOptions={['10', '20', '50', '100']}
                        showQuickJumper={totalRecords > 100}
                        showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} audit logs`}
                    />
                </div>
            </Card>
        </>
    );
};

export default AuditList;