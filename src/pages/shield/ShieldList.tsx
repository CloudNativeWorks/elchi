import React, { useState, useMemo } from 'react';
import {
    Card,
    Typography,
    Space,
    Row,
    Col,
    Input,
    Button,
    Table,
    Modal,
    Tag,
    Tabs,
    Tooltip,
    App as AntdApp,
} from 'antd';
import {
    SearchOutlined,
    ClearOutlined,
    PlusOutlined,
    DeleteOutlined,
    ExclamationCircleOutlined,
    SafetyOutlined,
    SyncOutlined,
    RadarChartOutlined,
} from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ElchiButton from '@/elchi/components/common/ElchiButton';
import { shieldApi } from './shieldApi';
import { ShieldPolicy } from './types';
import { useShieldMutations } from './hooks/useShieldMutations';
import { isShieldAdmin } from './utils';
import ShieldEvents from './ShieldEvents';

const { Title, Text } = Typography;
const { confirm } = Modal;

const ShieldList: React.FC = () => {
    const navigate = useNavigate();
    const { project } = useProjectVariable();
    const { notification } = AntdApp.useApp();
    const [searchTerm, setSearchTerm] = useState('');
    const admin = isShieldAdmin();
    // Events live as a tab under Shield (not a separate sidebar item). The active
    // tab is URL-driven so /shield?tab=events deep-links straight to the feed
    // (e.g. the "View all" link on a client's Shield panel).
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = admin && searchParams.get('tab') === 'events' ? 'events' : 'policies';

    // Fetch shield policies (list responses omit file contents)
    const { data: policies, isLoading } = useQuery({
        queryKey: ['shield-policies', project],
        queryFn: () => shieldApi.listPolicies(project),
        enabled: !!project,
    });

    const queryClient = useQueryClient();
    const { syncMutation, notifyDeploy } = useShieldMutations(undefined, project);

    // Row-scoped delete (the shared hook's delete is bound to a single id;
    // the list deletes arbitrary rows — same approach as WafList).
    const deleteMutation = useMutation({
        mutationFn: (rowId: string) => shieldApi.deletePolicy(rowId, project),
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ['shield-policies'] });
            notifyDeploy(res.deploy, 'deleted');
        },
        onError: (err: Error) => {
            // The global error toast is suppressed for shield mutations; without
            // this the confirm modal would just close on a silent failure.
            notification.error({ message: 'Delete failed', description: err.message, placement: 'topRight' });
        },
    });

    const filteredData = useMemo(() => {
        if (!policies) return [];
        return policies.filter(p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [policies, searchTerm]);

    const handleDelete = (record: ShieldPolicy) => {
        confirm({
            title: 'Delete Shield Policy',
            icon: <ExclamationCircleOutlined />,
            content: (
                <span>
                    Are you sure you want to delete <b>{record.name}</b>?<br />
                    The remaining policies re-deploy to every connected edge. Deleting the
                    LAST policy pushes an explicit &quot;inspection off&quot; config (a true clear).
                </span>
            ),
            okText: 'Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk() {
                return deleteMutation.mutateAsync(record.id);
            },
        });
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a: ShieldPolicy, b: ShieldPolicy) => a.name.localeCompare(b.name),
            render: (text: string) => <Text strong>{text}</Text>,
        },
        {
            title: 'Config',
            key: 'config',
            render: (_: unknown, record: ShieldPolicy) => {
                const files = record.files ?? [];
                const config = files.find(f => !f.path.includes('/'));
                const dataCount = files.filter(f => f.path.includes('/')).length;
                return (
                    <Space size={4} wrap>
                        {config && <Tag className='auto-width-tag' style={{ fontFamily: 'monospace' }}>{config.path}</Tag>}
                        {dataCount > 0 && (
                            <Tag className='auto-width-tag' color="blue">{dataCount} data file{dataCount !== 1 ? 's' : ''}</Tag>
                        )}
                    </Space>
                );
            },
        },
        {
            title: 'Version',
            dataIndex: 'version',
            key: 'version',
            width: 100,
            render: (v: number) => <Tag className='auto-width-tag' color="purple">v{v}</Tag>,
        },
        {
            title: 'Updated',
            dataIndex: 'updated_at',
            key: 'updated_at',
            sorter: (a: ShieldPolicy, b: ShieldPolicy) =>
                new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime(),
            render: (date: string) => new Date(date).toLocaleString(),
        },
        ...(admin ? [{
            title: 'Actions',
            key: 'actions',
            fixed: 'right' as const,
            width: 80,
            render: (_: unknown, record: ShieldPolicy) => (
                <Tooltip title="Delete">
                    <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(record);
                        }}
                    />
                </Tooltip>
            ),
        }] : []),
    ];

    const policiesContent = (
        <>
            {/* Header Section */}
            <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <Space>
                        <SafetyOutlined style={{ color: 'var(--color-primary)', fontSize: 24 }} />
                        <Title level={4} style={{ margin: 0 }}>
                            Shield Policies
                        </Title>
                    </Space>
                    {admin && (
                        <Space>
                            <Tooltip title="Re-push the project's merged policy set to all connected edges (e.g. after recovery)">
                                <Button
                                    icon={<SyncOutlined />}
                                    loading={syncMutation.isPending}
                                    onClick={() => {
                                        // With ZERO policies, sync pushes the explicit
                                        // "inspection off" clear config to every connected
                                        // edge — make that consequence explicit first.
                                        if ((policies?.length ?? 0) === 0) {
                                            confirm({
                                                title: 'Sync with no policies?',
                                                icon: <ExclamationCircleOutlined />,
                                                content: 'This project has no shield policies. Sync will push an explicit "inspection off" config to all connected edges in the project. Continue?',
                                                okText: 'Sync',
                                                cancelText: 'Cancel',
                                                onOk: () => syncMutation.mutateAsync(),
                                            });
                                            return;
                                        }
                                        syncMutation.mutate();
                                    }}
                                >
                                    Sync
                                </Button>
                            </Tooltip>
                            <ElchiButton icon={<PlusOutlined />} onClick={() => navigate('/shield/create')}>
                                Add New Shield Policy
                            </ElchiButton>
                        </Space>
                    )}
                </div>

                <Text type="secondary">
                    Manage elchi-shield (edge API security / WAF sidecar) config policies. A project&apos;s policies are
                    merged into one bundle and synced to every connected edge automatically; deploys run as background jobs.
                </Text>
            </div>

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
                    <Col span={18}>
                        <Input
                            placeholder="Search by name..."
                            allowClear
                            prefix={<SearchOutlined />}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </Col>
                    <Col span={6}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            {searchTerm && (
                                <Button
                                    icon={<ClearOutlined />}
                                    onClick={() => setSearchTerm('')}
                                    style={{ borderRadius: 6 }}
                                >
                                    Clear Filters
                                </Button>
                            )}
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
                    dataSource={filteredData}
                    columns={columns}
                    loading={isLoading}
                    rowKey="id"
                    onRow={(record) => ({
                        onClick: () => navigate(`/shield/${record.id}`),
                        style: { cursor: 'pointer' }
                    })}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Total ${total} items`,
                    }}
                    scroll={{ x: 1000 }}
                />
            </Card>
        </>
    );

    // Non-admins only see policies (the events API is admin/owner-gated).
    if (!admin) return policiesContent;

    return (
        <Tabs
            activeKey={activeTab}
            onChange={(key) => setSearchParams(key === 'events' ? { tab: 'events' } : {})}
            items={[
                {
                    key: 'policies',
                    label: <span><SafetyOutlined /> Policies</span>,
                    children: policiesContent,
                },
                {
                    key: 'events',
                    label: <span><RadarChartOutlined /> Security Events</span>,
                    children: <ShieldEvents />,
                },
            ]}
        />
    );
};

export default ShieldList;
