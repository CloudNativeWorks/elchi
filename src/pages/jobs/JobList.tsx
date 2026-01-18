import React, { useState, useEffect, useCallback } from 'react';
import {
    Table, Button, Tag, Space, Typography, Card, Row, Col,
    Select, DatePicker, Input, Progress,
    Dropdown, App as AntdApp
} from 'antd';
import type { MenuProps } from 'antd';
import {
    ReloadOutlined, DeleteOutlined, RedoOutlined, ExclamationCircleOutlined,
    ScheduleOutlined, CheckCircleOutlined, CloseCircleOutlined,
    EyeOutlined, WarningOutlined, PlayCircleOutlined,
    ClockCircleOutlined, SearchOutlined, UserOutlined, GlobalOutlined,
    ClearOutlined, ThunderboltOutlined, BarChartOutlined
} from '@ant-design/icons';
import { ActionsSVG } from '@/assets/svg/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import duration from 'dayjs/plugin/duration';

import { useJobOperations } from '@/hooks/useJobOperations';
import type {
    BackgroundJob,
    JobStatus,
    JobType,
    JobListRequest,
    JobStatsResponse
} from '@/types/jobs';

dayjs.extend(relativeTime);
dayjs.extend(duration);

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const JobList: React.FC = () => {
    const navigate = useNavigate();
    const { modal } = AntdApp.useApp();
    const {
        loading,
        listJobs,
        cancelJob,
        retryJob,
        retryFailedSnapshots,
        getStuckJobs,
        cleanupStuckJobs,
        getJobStats
    } = useJobOperations();

    // Default last 1 month filter
    const defaultEndDate = dayjs();
    const defaultStartDate = dayjs().subtract(1, 'month');

    const [jobs, setJobs] = useState<BackgroundJob[]>([]);
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [filters, setFilters] = useState<JobListRequest>({
        start_date: defaultStartDate.format('YYYY-MM-DD'),
        end_date: defaultEndDate.format('YYYY-MM-DD')
    });
    const [tempFilters, setTempFilters] = useState<JobListRequest>({
        start_date: defaultStartDate.format('YYYY-MM-DD'),
        end_date: defaultEndDate.format('YYYY-MM-DD')
    });
    const [stats, setStats] = useState<JobStatsResponse | null>(null);
    const [stuckJobsCount, setStuckJobsCount] = useState(0);

    const loadJobs = useCallback(async () => {
        const params: JobListRequest = {
            page: currentPage,
            limit: pageSize,
            sort_by: 'created_at',
            sort_order: 'desc',
            ...filters
        };

        const response = await listJobs(params);
        if (response && response.jobs) {
            setJobs(response.jobs || []);
            setTotal(response.total || 0);
        } else {
            setJobs([]);
            setTotal(0);
        }
    }, [currentPage, pageSize, filters, listJobs]);

    const loadStatsOnly = useCallback(async () => {
        const statsResponse = await getJobStats(filters);
        if (statsResponse) {
            setStats(statsResponse);
        }

        const stuckResponse = await getStuckJobs();
        if (stuckResponse) {
            setStuckJobsCount(stuckResponse.count || 0);
        }
    }, [filters]);

    const applyFilters = useCallback(() => {
        setFilters(tempFilters);
        setCurrentPage(1); // Reset to first page when filtering
    }, [tempFilters]);

    const clearAllFilters = useCallback(() => {
        const defaultFilters = {
            start_date: defaultStartDate.format('YYYY-MM-DD'),
            end_date: defaultEndDate.format('YYYY-MM-DD')
        };
        setTempFilters(defaultFilters);
        setFilters(defaultFilters);
        setCurrentPage(1);
    }, []);

    useEffect(() => {
        loadJobs();
    }, [loadJobs]);

    useEffect(() => {
        loadStatsOnly();
    }, [loadStatsOnly]);

    const getStatusTag = (status: JobStatus) => {
        const statusConfig = {
            PENDING: { color: 'blue', icon: <ClockCircleOutlined /> },
            CLAIMED: { color: 'orange', icon: <PlayCircleOutlined /> },
            RUNNING: { color: 'processing', icon: <PlayCircleOutlined /> },
            COMPLETED: { color: 'success', icon: <CheckCircleOutlined /> },
            FAILED: { color: 'error', icon: <CloseCircleOutlined /> },
            NO_WORK_NEEDED: { color: 'default', icon: <CheckCircleOutlined /> }
        };

        const config = statusConfig[status] || statusConfig.PENDING;
        return (
            <Tag className='auto-width-tag' color={config.color} icon={config.icon}>
                {status.replace(/_/g, ' ')}
            </Tag>
        );
    };

    const getJobTypeTag = (type: JobType) => {
        const typeConfig = {
            SNAPSHOT_UPDATE: { color: 'blue', text: 'Snapshot Update' },
            DISCOVERY_UPDATE: { color: 'green', text: 'Discovery Update' },
            ACME_VERIFICATION: { color: 'cyan', text: 'ACME Certificate Verification' }
        };

        const config = typeConfig[type] || { color: 'default', text: type };
        return <Tag className='auto-width-tag' color={config.color}>{config.text}</Tag>;
    };


    const handleJobAction = async (action: string, job: BackgroundJob) => {
        switch (action) {
            case 'view':
                navigate(`/jobs/${job._id}`);
                break;
            case 'retry':
                await retryJob(job._id);
                loadJobs();
                break;
            case 'retry-failed':
                await retryFailedSnapshots(job._id);
                loadJobs();
                break;
            case 'cancel':
                const success = await cancelJob(job._id);
                if (success) loadJobs();
                break;
            default:
                break;
        }
    };

    const handleStuckJobsCleanup = async () => {
        modal.confirm({
            title: 'Clean Up Stuck Jobs',
            icon: <ExclamationCircleOutlined />,
            content: `This will clean up ${stuckJobsCount} stuck/abandoned jobs. This action cannot be undone.`,
            okText: 'Clean Up',
            cancelText: 'Cancel',
            onOk: async () => {
                const success = await cleanupStuckJobs();
                if (success) {
                    loadJobs();
                    loadStatsOnly();
                }
            },
        });
    };

    const getJobActions = (job: BackgroundJob): MenuProps['items'] => {
        const actions: MenuProps['items'] = [
            {
                key: 'view',
                label: 'View Details',
                icon: <EyeOutlined />,
            }
        ];

        if (job.status === 'PENDING' || job.status === 'CLAIMED') {
            actions.push({
                key: 'cancel',
                label: 'Cancel Job',
                icon: <DeleteOutlined />,
                danger: true,
            });
        }

        if (job.status === 'FAILED' || job.status === 'COMPLETED') {
            actions.push(
                {
                    key: 'retry',
                    label: 'Retry Job',
                    icon: <RedoOutlined />,
                }
            );

            if (job.execution_details?.processed_snapshots?.some(s => s.poke_status === 'FAILED')) {
                actions.push({
                    key: 'retry-failed',
                    label: 'Retry Failed Only',
                    icon: <RedoOutlined />,
                });
            }
        }

        return actions;
    };

    const columns = [
        {
            title: '',
            key: 'actions',
            width: 50,
            render: (_: any, job: BackgroundJob) => (
                <div style={{ display: 'flex', justifyContent: 'center', minWidth: 1 }} onClick={e => e.stopPropagation()}>
                    <Dropdown
                        trigger={['click']}
                        menu={{
                            items: getJobActions(job),
                            onClick: ({ key }) => handleJobAction(key, job)
                        }}
                    >
                        <div
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                            aria-label="Actions"
                        >
                            <ActionsSVG />
                        </div>
                    </Dropdown>
                </div>
            ),
        },
        {
            title: 'Job ID',
            dataIndex: 'job_id',
            key: 'job_id',
            width: 100,
            render: (jobId: string, job: BackgroundJob) => (
                <Button
                    type="link"
                    size="small"
                    onClick={() => navigate(`/jobs/${job._id}`)}
                >
                    {jobId}
                </Button>
            ),
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            width: 100,
            render: (type: JobType) => getJobTypeTag(type),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (status: JobStatus) => getStatusTag(status),
        },
        {
            title: 'Resource',
            key: 'resource',
            width: 230,
            render: (_: any, job: BackgroundJob) => {
                if (job.type === 'ACME_VERIFICATION' && job.metadata.acme) {
                    return (
                        <div>
                            <Text strong style={{ fontSize: 12 }}>
                                {job.metadata.acme.certificate_name}
                            </Text>
                            <br />
                            <Text type="secondary" style={{ fontSize: 11 }}>
                                {job.metadata.acme.domains[0]}
                                {job.metadata.acme.domains.length > 1 && ` +${job.metadata.acme.domains.length - 1}`}
                            </Text>
                        </div>
                    );
                }
                if (job.metadata.source_resource) {
                    return (
                        <div>
                            <Text strong style={{ fontSize: 12 }}>
                                {job.metadata.source_resource.name}
                            </Text>
                            <br />
                            <Text type="secondary" style={{ fontSize: 11 }}>
                                {job.metadata.source_resource.collection} • {job.metadata.source_resource.action}
                            </Text>
                        </div>
                    );
                }
                return <Text type="secondary" style={{ fontSize: 11 }}>-</Text>;
            },
        },
        {
            title: 'User',
            key: 'trigger_user',
            width: 80,
            render: (_: any, job: BackgroundJob) => (
                <Space>
                    <UserOutlined style={{ color: 'var(--color-primary)' }} />
                    <Space direction="vertical" size="small">
                        <Text strong style={{ fontSize: 12 }}>
                            {job.metadata.trigger_user.display_name || job.metadata.trigger_user.username}
                        </Text>
                        <Tag color="blue" style={{ fontSize: 11 }}>{job.metadata.trigger_user.role}</Tag>
                    </Space>
                </Space>
            ),
        },
        {
            title: 'Progress',
            key: 'progress',
            width: 170,
            render: (_: any, job: BackgroundJob) => {
                if (job.status === 'NO_WORK_NEEDED') {
                    return <Text type="secondary" style={{ fontSize: 11 }}>No work needed</Text>;
                }

                if (job.type === 'ACME_VERIFICATION') {
                    return (
                        <div>
                            <Progress
                                percent={job.progress.percentage}
                                size="small"
                                status={job.status === 'FAILED' ? 'exception' : job.status === 'COMPLETED' ? 'success' : 'active'}
                                strokeColor={job.status === 'COMPLETED' ? 'var(--color-success)' : undefined}
                            />
                            <Text style={{ fontSize: 11 }}>
                                {job.status === 'COMPLETED' ? 'Verified' : job.status === 'FAILED' ? 'Failed' : 'Verifying...'}
                            </Text>
                        </div>
                    );
                }

                return (
                    <div>
                        <Progress
                            percent={job.progress.percentage}
                            size="small"
                            status={job.status === 'FAILED' ? 'exception' : job.progress.percentage === 100 ? 'success' : 'active'}
                            strokeColor={job.progress.percentage === 100 ? 'var(--color-success)' : undefined}
                        />
                        <Text style={{ fontSize: 11 }}>
                            {job.progress.percentage === 100 ? (
                                <>
                                    Finished ({job.progress.completed}/{job.progress.total})
                                </>
                            ) : (
                                <>
                                    {job.progress.completed}/{job.progress.total}
                                    {job.progress.failed > 0 && ` (${job.progress.failed} failed)`}
                                </>
                            )}
                        </Text>
                    </div>
                );
            },
        },

    ];

    return (
        <div style={{ padding: '0px' }}>
            {/* Header Section - Outside Card */}
            <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <Space>
                        <ScheduleOutlined style={{ color: 'var(--color-primary)', fontSize: 24 }} />
                        <Title level={4} style={{ margin: 0 }}>Background Jobs</Title>
                    </Space>
                    <Space>
                        <Button
                            icon={<ReloadOutlined />}
                            onClick={() => { loadJobs(); loadStatsOnly(); }}
                            loading={loading}
                        >
                            Refresh
                        </Button>
                        {stuckJobsCount > 0 && (
                            <Button
                                icon={<WarningOutlined />}
                                onClick={handleStuckJobsCleanup}
                                danger
                            >
                                Clean Up {stuckJobsCount} Stuck Jobs
                            </Button>
                        )}
                    </Space>
                </div>

                <Text type="secondary">
                    Monitor and manage async background job processing
                </Text>
            </div>

            {/* Stats Cards */}
            {stats && (
                <Row gutter={[16, 12]} style={{ marginBottom: 16 }}>
                    {/* Count Stats - Left Side (2 rows) */}
                    <Col span={6}>
                        <Row gutter={[12, 8]} style={{ height: '100%' }}>
                            <Col span={12}>
                                <Card
                                    size="small"
                                    style={{ borderRadius: 8, textAlign: 'center', padding: '8px 0', height: '100%' }}
                                >
                                    <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-primary)' }}>
                                        {stats.data?.total_jobs?.toLocaleString() || 0}
                                    </div>
                                    <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>
                                        <ScheduleOutlined style={{ marginRight: 3, fontSize: 10 }} />
                                        Total Jobs
                                    </div>
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card
                                    size="small"
                                    style={{ borderRadius: 8, textAlign: 'center', padding: '8px 0', height: '100%' }}
                                >
                                    <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-success)' }}>
                                        {stats.data?.active_workers || 0}
                                    </div>
                                    <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>
                                        <PlayCircleOutlined style={{ marginRight: 3, fontSize: 10 }} />
                                        Workers
                                    </div>
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card
                                    size="small"
                                    style={{ borderRadius: 8, textAlign: 'center', padding: '8px 0', height: '100%' }}
                                >
                                    <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-warning)' }}>
                                        {stats.data?.queue_size || 0}
                                    </div>
                                    <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>
                                        <ClockCircleOutlined style={{ marginRight: 3, fontSize: 10 }} />
                                        Queue
                                    </div>
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card
                                    size="small"
                                    style={{ borderRadius: 8, textAlign: 'center', padding: '8px 0', height: '100%' }}
                                >
                                    <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-purple)' }}>
                                        {stats.data?.processing_jobs || 0}
                                    </div>
                                    <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>
                                        <ThunderboltOutlined style={{ marginRight: 3, fontSize: 10 }} />
                                        Processing
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
                                >
                                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8, fontWeight: 600 }}>
                                        <UserOutlined style={{ marginRight: 4 }} />
                                        Jobs by User
                                    </div>
                                    <div style={{
                                        height: 'calc(100% - 32px)',
                                        maxHeight: '160px',
                                        overflowY: 'auto',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 4
                                    }}>
                                        {Object.entries(stats.data?.jobs_by_user || {}).length > 0 ? (
                                            Object.entries(stats.data.jobs_by_user)
                                                .sort(([, a], [, b]) => (b as number) - (a as number))
                                                .map(([user, count]) => (
                                                    <div key={user} style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        padding: '2px 8px',
                                                        background: 'var(--color-primary-light)',
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
                                            <div style={{ textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 11, marginTop: 20 }}>
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
                                >
                                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8, fontWeight: 600 }}>
                                        <BarChartOutlined style={{ marginRight: 4 }} />
                                        Jobs by Resource
                                    </div>
                                    <div style={{
                                        height: 'calc(100% - 32px)',
                                        maxHeight: '160px',
                                        overflowY: 'auto',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 4
                                    }}>
                                        {Object.entries(stats.data?.jobs_by_resource || {}).length > 0 ? (
                                            Object.entries(stats.data.jobs_by_resource)
                                                .sort(([, a], [, b]) => (b as number) - (a as number))
                                                .map(([resource, count]) => (
                                                    <div key={resource} style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        padding: '2px 8px',
                                                        background: 'var(--bg-hover)',
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
                                            <div style={{ textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 11, marginTop: 20 }}>
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
                                >
                                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8, fontWeight: 600 }}>
                                        <CheckCircleOutlined style={{ marginRight: 4 }} />
                                        Jobs by Status
                                    </div>
                                    <div style={{
                                        height: 'calc(100% - 32px)',
                                        maxHeight: '160px',
                                        overflowY: 'auto',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 4
                                    }}>
                                        {Object.entries(stats.data?.jobs_by_status || {}).length > 0 ? (
                                            Object.entries(stats.data.jobs_by_status)
                                                .sort(([, a], [, b]) => (b as number) - (a as number))
                                                .map(([status, count]) => (
                                                    <div key={status} style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        padding: '2px 8px',
                                                        background: status === 'COMPLETED' ? 'var(--color-success-light)' : status === 'FAILED' ? 'var(--color-danger-light)' : 'var(--color-primary-light)',
                                                        borderRadius: 4,
                                                        fontSize: 11
                                                    }}>
                                                        <span>{status.replace(/_/g, ' ')}</span>
                                                        <Tag color={status === 'COMPLETED' ? 'green' : status === 'FAILED' ? 'red' : 'blue'} style={{ margin: 0, fontSize: 10 }}>
                                                            {count as number}
                                                        </Tag>
                                                    </div>
                                                ))
                                        ) : (
                                            <div style={{ textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 11, marginTop: 20 }}>
                                                No data available
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            )}

            {/* Advanced Filters */}
            <Card
                size="small"
                style={{
                    marginBottom: 16,
                    borderRadius: 12,
                    boxShadow: 'var(--shadow-sm)'
                }}
            >
                <Row gutter={[16, 16]} align="middle">
                    {/* First Row */}
                    <Col span={4}>
                        <Select
                            placeholder="Filter by status"
                            allowClear
                            style={{ width: '100%' }}
                            value={tempFilters.status}
                            onChange={(value) => setTempFilters(prev => ({ ...prev, status: value }))}
                        >
                            <Option value="PENDING">Pending</Option>
                            <Option value="CLAIMED">Claimed</Option>
                            <Option value="RUNNING">Running</Option>
                            <Option value="COMPLETED">Completed</Option>
                            <Option value="FAILED">Failed</Option>
                            <Option value="NO_WORK_NEEDED">No Work Needed</Option>
                        </Select>
                    </Col>
                    <Col span={5}>
                        <Input
                            placeholder="Search resource name"
                            allowClear
                            prefix={<SearchOutlined />}
                            value={tempFilters.resource_name}
                            onChange={(e) => setTempFilters(prev => ({ ...prev, resource_name: e.target.value }))}
                            onPressEnter={applyFilters}
                        />
                    </Col>
                    <Col span={4}>
                        <Input
                            placeholder="Search username"
                            allowClear
                            prefix={<UserOutlined />}
                            value={tempFilters.username}
                            onChange={(e) => setTempFilters(prev => ({ ...prev, username: e.target.value }))}
                            onPressEnter={applyFilters}
                        />
                    </Col>
                    <Col span={4}>
                        <Input
                            placeholder="Affected listener"
                            allowClear
                            prefix={<GlobalOutlined />}
                            value={tempFilters.affected_listener}
                            onChange={(e) => setTempFilters(prev => ({ ...prev, affected_listener: e.target.value }))}
                            onPressEnter={applyFilters}
                        />
                    </Col>
                    <Col span={4}>
                        <RangePicker
                            style={{ width: '100%' }}
                            format="YYYY-MM-DD"
                            allowClear
                            value={[
                                tempFilters.start_date ? dayjs(tempFilters.start_date) : null,
                                tempFilters.end_date ? dayjs(tempFilters.end_date) : null
                            ]}
                            onChange={(dates) => {
                                if (dates) {
                                    setTempFilters(prev => ({
                                        ...prev,
                                        start_date: dates[0]?.format('YYYY-MM-DD'),
                                        end_date: dates[1]?.format('YYYY-MM-DD'),
                                    }));
                                } else {
                                    setTempFilters(prev => {
                                        const { start_date, end_date, ...rest } = prev;
                                        return rest;
                                    });
                                }
                            }}
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
                                        background: 'var(--bg-surface)',
                                        color: 'var(--text-primary)',
                                        borderColor: 'var(--border-default)',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'linear-gradient(90deg, var(--color-primary) 0%, var(--color-accent) 100%)';
                                        e.currentTarget.style.color = 'white';
                                        e.currentTarget.style.borderColor = 'transparent';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'var(--bg-surface)';
                                        e.currentTarget.style.color = 'var(--text-primary)';
                                        e.currentTarget.style.borderColor = 'var(--border-default)';
                                    }}
                                >
                                    Search
                                </Button>
                                {(Object.keys(tempFilters).length > 0 || Object.keys(filters).length > 0) && (
                                    <Button
                                        icon={<ClearOutlined />}
                                        onClick={clearAllFilters}
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

            {/* Jobs Table */}
            <Card
                style={{
                    borderRadius: 12,
                    boxShadow: 'var(--shadow-sm)',
                }}
                styles={{
                    body: { padding: 12 }
                }}
            >
                <Table
                    columns={columns}
                    dataSource={jobs || []}
                    loading={loading}
                    rowKey="_id"
                    pagination={{
                        current: currentPage,
                        pageSize,
                        total,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} of ${total} jobs`,
                        onChange: (page, size) => {
                            setCurrentPage(page);
                            setPageSize(size);
                        },
                    }}
                    size="small"
                />
            </Card>
        </div>
    );
};

export default JobList;