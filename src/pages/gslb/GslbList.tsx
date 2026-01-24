/**
 * GSLB Records List
 * Displays all GSLB records with search, filter, and CRUD operations
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
    Typography,
    Space,
    Button,
    Table,
    Modal,
    Tag,
    Badge,
    Input,
    Select,
    InputNumber,
    Row,
    Col
} from 'antd';
import {
    PlusOutlined,
    DeleteOutlined,
    ExclamationCircleOutlined,
    GlobalOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    MinusCircleOutlined,
    SettingOutlined,
    SearchOutlined,
    BarChartOutlined
} from '@ant-design/icons';
import { MdPerson, MdAutorenew } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ElchiButton from '@/elchi/components/common/ElchiButton';
import { gslbApi } from './gslbApi';
import { GSLBRecord } from './types';
import { HEALTH_STATUS } from './constants';

const { Title, Text } = Typography;
const { confirm } = Modal;

const GslbList: React.FC = () => {
    const navigate = useNavigate();
    const { project } = useProjectVariable();
    const queryClient = useQueryClient();
    const [searchInput, setSearchInput] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'enabled' | 'disabled' | undefined>(undefined);
    const [probeTypeFilter, setProbeTypeFilter] = useState<'http' | 'https' | 'tcp' | undefined>(undefined);
    const [probeIntervalFilter, setProbeIntervalFilter] = useState<10 | 20 | 30 | 60 | 90 | 120 | 180 | 300 | undefined>(undefined);
    const [ttlFilter, setTtlFilter] = useState<number | undefined>(undefined);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(100);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchTerm(searchInput);
            setPage(1); // Reset to first page on search
        }, 500);

        return () => clearTimeout(timer);
    }, [searchInput]);

    // Fetch GSLB records with server-side pagination, search, and filters
    const { data: gslbData, isLoading } = useQuery({
        queryKey: ['gslb-records', project, page, pageSize, searchTerm, statusFilter, probeTypeFilter, probeIntervalFilter, ttlFilter],
        queryFn: () => gslbApi.getGslbRecords({
            project,
            page,
            limit: pageSize,
            search: searchTerm || undefined,
            status: statusFilter,
            probe_type: probeTypeFilter,
            probe_interval: probeIntervalFilter,
            ttl: ttlFilter
        }),
        enabled: !!project,
    });

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: (id: string) => gslbApi.deleteGslbRecord(id, project),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['gslb-records'] });
        },
        onError: (error: any) => {
            // Error already handled by gslbApi via handleApiResponse
            console.error('Delete failed:', error);
        }
    });

    // Bulk update mutation
    const bulkUpdateMutation = useMutation({
        mutationFn: ({ recordIds, enabled }: { recordIds: string[]; enabled: boolean }) =>
            gslbApi.bulkUpdateGslbRecords(recordIds, enabled),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['gslb-records'] });
            setSelectedRowKeys([]); // Clear selection after successful update
        },
        onError: (error: any) => {
            console.error('Bulk update failed:', error);
        }
    });

    // Use records directly from API (no client-side filtering needed)
    const filteredData = useMemo(() => {
        return gslbData?.records || [];
    }, [gslbData]);

    // Calculate health status for a record
    const getHealthStatus = (record: GSLBRecord) => {
        if (!record.probe) {
            return HEALTH_STATUS.NO_PROBE;
        }

        // Use new IP statistics fields from backend (total_ips, healthy_ips, unhealthy_ips)
        const totalCount = record.total_ips ?? 0;
        const healthyCount = record.healthy_ips ?? 0;

        if (totalCount === 0) {
            return 'PROBE_CONFIGURED';
        }

        if (healthyCount === 0) {
            return HEALTH_STATUS.ALL_UNHEALTHY;
        } else if (healthyCount === totalCount) {
            return HEALTH_STATUS.ALL_HEALTHY;
        } else {
            return HEALTH_STATUS.SOME_UNHEALTHY;
        }
    };

    // Render health status badge
    const renderHealthStatus = (record: GSLBRecord) => {
        const status = getHealthStatus(record);
        const healthyCount = record.healthy_ips ?? 0;
        const totalCount = record.total_ips ?? 0;

        switch (status) {
            case HEALTH_STATUS.ALL_HEALTHY:
                return (
                    <Badge status="success" text={
                        <span style={{ color: 'var(--color-success)' }}>
                            <CheckCircleOutlined /> All Healthy ({totalCount}/{totalCount})
                        </span>
                    } />
                );
            case HEALTH_STATUS.SOME_UNHEALTHY:
                return (
                    <Badge status="warning" text={
                        <span style={{ color: 'var(--color-warning)' }}>
                            <ExclamationCircleOutlined /> Partial ({healthyCount}/{totalCount})
                        </span>
                    } />
                );
            case HEALTH_STATUS.ALL_UNHEALTHY:
                return (
                    <Badge status="error" text={
                        <span style={{ color: 'var(--color-danger)' }}>
                            <CloseCircleOutlined /> All Unhealthy (0/{totalCount})
                        </span>
                    } />
                );
            case 'PROBE_CONFIGURED':
                return (
                    <Badge status="processing" text={
                        <span style={{ color: 'var(--color-primary)' }}>
                            <CheckCircleOutlined /> Health Check Enabled
                        </span>
                    } />
                );
            case HEALTH_STATUS.NO_PROBE:
                return (
                    <Badge status="default" text={
                        <span style={{ color: 'var(--text-tertiary)' }}>
                            <MinusCircleOutlined /> No Health Check
                        </span>
                    } />
                );
            default:
                return null;
        }
    };

    const handleDelete = (record: GSLBRecord) => {
        // Check if auto-created
        if (record.service_id && record.service_id !== '') {
            Modal.error({
                title: 'Cannot Delete Auto-Created Record',
                content: (
                    <div>
                        <p>This GSLB record was automatically created by the system and is linked to a service.</p>
                        <p><strong>Service ID:</strong> {record.service_id}</p>
                        <p>To delete this record, you must delete the associated service instead.</p>
                    </div>
                ),
            });
            return;
        }

        confirm({
            title: 'Delete GSLB Record',
            icon: <ExclamationCircleOutlined />,
            content: `Are you sure you want to delete "${record.fqdn}"?`,
            okText: 'Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk() {
                deleteMutation.mutate(record.id);
            },
        });
    };

    const handleCreate = () => {
        navigate('/gslb/create');
    };

    const handleSettings = () => {
        navigate('/settings?tab=gslb');
    };

    const handleBulkEnable = () => {
        if (selectedRowKeys.length === 0) return;

        confirm({
            title: 'Enable Selected Records',
            icon: <ExclamationCircleOutlined />,
            content: `Are you sure you want to enable ${selectedRowKeys.length} record(s)?`,
            okText: 'Enable',
            okType: 'primary',
            cancelText: 'Cancel',
            onOk() {
                bulkUpdateMutation.mutate({
                    recordIds: selectedRowKeys as string[],
                    enabled: true
                });
            },
        });
    };

    const handleBulkDisable = () => {
        if (selectedRowKeys.length === 0) return;

        confirm({
            title: 'Disable Selected Records',
            icon: <ExclamationCircleOutlined />,
            content: `Are you sure you want to disable ${selectedRowKeys.length} record(s)?`,
            okText: 'Disable',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk() {
                bulkUpdateMutation.mutate({
                    recordIds: selectedRowKeys as string[],
                    enabled: false
                });
            },
        });
    };


    const columns = [
        {
            title: 'FQDN',
            dataIndex: 'fqdn',
            key: 'fqdn',
            sorter: (a: GSLBRecord, b: GSLBRecord) => a.fqdn.localeCompare(b.fqdn),
            render: (text: string, record: GSLBRecord) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {record.service_id && record.service_id !== '' ? (
                        <MdAutorenew style={{ fontSize: 18, color: 'var(--color-primary)' }} title="Auto-created by system" />
                    ) : (
                        <MdPerson style={{ fontSize: 18, color: 'var(--color-success)' }} title="Manually created" />
                    )}
                    <Text strong>{text}</Text>
                </div>
            ),
        },
        {
            title: 'TTL',
            dataIndex: 'ttl',
            key: 'ttl',
            render: (ttl: number) => <Text>{ttl}s</Text>,
        },
        {
            title: 'Status',
            key: 'enabled',
            dataIndex: 'enabled',
            render: (enabled: boolean) => (
                <Tag className='auto-width-tag' color={enabled ? 'green' : 'default'}>
                    {enabled ? 'Enabled' : 'Disabled'}
                </Tag>
            ),
        },
        {
            title: 'Probe',
            key: 'probe',
            render: (_: any, record: GSLBRecord) => {
                if (!record.probe) {
                    return <Text type="secondary">-</Text>;
                }
                return <Tag className='auto-width-tag' color="purple">{record.probe.type.toUpperCase()}</Tag>;
            },
        },
        {
            title: 'Interval',
            dataIndex: 'interval',
            key: 'interval',
            render: (_: any, record: GSLBRecord) => {
                if (!record.probe) {
                    return <Text type="secondary">-</Text>;
                }
                return <Tag className='auto-width-tag' color="processing">{record.probe.interval}s</Tag>;
            },
        },
        {
            title: 'Health Status',
            key: 'health',
            render: (_: any, record: GSLBRecord) => renderHealthStatus(record),
        },
        {
            title: 'IPs',
            key: 'ips_count',
            render: (_: any, record: GSLBRecord) => {
                const count = record.total_ips ?? 0;
                return <Text>{count} {count === 1 ? 'IP' : 'IPs'}</Text>;
            },
        },
        {
            title: 'Created',
            dataIndex: 'created_at',
            key: 'created_at',
            sorter: (a: GSLBRecord, b: GSLBRecord) =>
                new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
            render: (date: string) => new Date(date).toLocaleString(),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 80,
            render: (_: any, record: GSLBRecord) => {
                const isAutoCreated = record.service_id && record.service_id !== '';

                return (
                    <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(record);
                        }}
                        disabled={isAutoCreated}
                        title={isAutoCreated ? 'Cannot delete auto-created records' : 'Delete'}
                    />
                );
            },
        },
    ];

    return (
        <>
            {/* Header Section */}
            <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <Space>
                        <GlobalOutlined style={{ color: 'var(--color-primary)', fontSize: 24 }} />
                        <Title level={4} style={{ margin: 0 }}>
                            GSLB Records
                        </Title>
                    </Space>
                    <Space>
                        <Button
                            icon={<BarChartOutlined />}
                            onClick={() => navigate('/gslb/statistics')}
                        >
                            Statistics
                        </Button>
                        <Button
                            icon={<SettingOutlined />}
                            onClick={handleSettings}
                        >
                            Settings
                        </Button>
                        <ElchiButton icon={<PlusOutlined />} onClick={handleCreate}>
                            Add New GSLB Record
                        </ElchiButton>
                    </Space>
                </div>

                <Text type="secondary">
                    Manage Global Server Load Balancing DNS records with health checking and automatic failover.
                </Text>
            </div>


            {/* Data Table */}
            <div
                style={{
                    background: 'var(--card-bg)',
                    borderRadius: 12,
                    border: '1px solid var(--border-default)',
                    boxShadow: 'var(--shadow-sm)',
                    overflow: 'hidden',
                    marginBottom: 16
                }}
            >
                {/* Table Header */}
                <div style={{
                    background: 'var(--bg-surface)',
                    borderBottom: '1px solid var(--border-default)',
                    padding: '12px 16px'
                }}>
                    {/* First Row: Title and Bulk Actions */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 0 }}>
                        <Space>
                            {selectedRowKeys.length > 0 && (
                                <Space style={{ marginBottom: 12 }}>
                                    <Text type="secondary">({selectedRowKeys.length} selected)</Text>
                                    <Button
                                        type="primary"
                                        size="small"
                                        onClick={handleBulkEnable}
                                        loading={bulkUpdateMutation.isPending}
                                    >
                                        Enable
                                    </Button>
                                    <Button
                                        danger
                                        size="small"
                                        onClick={handleBulkDisable}
                                        loading={bulkUpdateMutation.isPending}
                                    >
                                        Disable
                                    </Button>
                                </Space>
                            )}
                        </Space>
                    </div>

                    {/* Second Row: Filters */}
                    <Row gutter={8}>
                        <Col>
                            <Input
                                placeholder="Search by FQDN..."
                                prefix={<SearchOutlined />}
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                style={{ width: 220 }}
                                allowClear
                            />
                        </Col>
                        <Col>
                            <Select
                                placeholder="Status"
                                value={statusFilter}
                                onChange={(value) => {
                                    setStatusFilter(value);
                                    setPage(1);
                                }}
                                style={{ width: 120 }}
                                allowClear
                                options={[
                                    { label: 'Enabled', value: 'enabled' },
                                    { label: 'Disabled', value: 'disabled' }
                                ]}
                            />
                        </Col>
                        <Col>
                            <Select
                                placeholder="Probe Type"
                                value={probeTypeFilter}
                                onChange={(value) => {
                                    setProbeTypeFilter(value);
                                    setPage(1);
                                }}
                                style={{ width: 120 }}
                                allowClear
                                options={[
                                    { label: 'HTTP', value: 'http' },
                                    { label: 'HTTPS', value: 'https' },
                                    { label: 'TCP', value: 'tcp' }
                                ]}
                            />
                        </Col>
                        <Col>
                            <Select
                                placeholder="Interval"
                                value={probeIntervalFilter}
                                onChange={(value) => {
                                    setProbeIntervalFilter(value);
                                    setPage(1);
                                }}
                                style={{ width: 120 }}
                                allowClear
                                options={[
                                    { label: '10s', value: 10 },
                                    { label: '20s', value: 20 },
                                    { label: '30s', value: 30 },
                                    { label: '60s', value: 60 },
                                    { label: '90s', value: 90 },
                                    { label: '120s', value: 120 },
                                    { label: '180s', value: 180 },
                                    { label: '300s', value: 300 }
                                ]}
                            />
                        </Col>
                        <Col>
                            <InputNumber
                                placeholder="TTL"
                                value={ttlFilter}
                                onChange={(value) => {
                                    setTtlFilter(value || undefined);
                                    setPage(1);
                                }}
                                style={{ width: 120 }}
                                min={1}
                                max={86400}
                                addonAfter="s"
                            />
                        </Col>
                    </Row>
                </div>

                {/* Table Content */}
                <div style={{ padding: '12px' }}>
                    <Table
                        dataSource={filteredData}
                        columns={columns}
                        loading={isLoading}
                        rowKey="id"
                        rowSelection={{
                            selectedRowKeys,
                            onChange: (selectedKeys) => {
                                setSelectedRowKeys(selectedKeys);
                            },
                        }}
                        onRow={(record) => ({
                            onClick: (e) => {
                                // Prevent navigation if clicking on buttons or interactive elements
                                const target = e.target as HTMLElement;
                                if (target.closest('button') || target.closest('.ant-btn') || target.closest('.ant-checkbox-wrapper')) {
                                    return;
                                }
                                navigate(`/gslb/${record.id}`);
                            },
                            style: { cursor: 'pointer' }
                        })}
                        pagination={{
                            current: page,
                            pageSize: pageSize,
                            total: gslbData?.count || 0,
                            showSizeChanger: true,
                            showTotal: (total) => `Total ${total} records`,
                            pageSizeOptions: ['10', '20', '50', '100'],
                            onChange: (newPage, newPageSize) => {
                                setPage(newPage);
                                if (newPageSize !== pageSize) {
                                    setPageSize(newPageSize);
                                    setPage(1);
                                }
                            },
                        }}
                    />
                </div>
            </div>

        </>
    );
};

export default GslbList;
