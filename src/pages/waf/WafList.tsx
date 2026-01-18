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
    Tooltip,
    message
} from 'antd';
import {
    SearchOutlined,
    ClearOutlined,
    PlusOutlined,
    DeleteOutlined,
    ExclamationCircleOutlined,
    FireOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ElchiButton from '@/elchi/components/common/ElchiButton';
import { wafApi } from './wafApi';
import { WafConfig } from './types';

const { Title, Text } = Typography;
const { confirm } = Modal;

const WafList: React.FC = () => {
    const navigate = useNavigate();
    const { project } = useProjectVariable();
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch WAF configs
    const { data: wafConfigs, isLoading } = useQuery({
        queryKey: ['waf-configs', project],
        queryFn: () => wafApi.getWafConfigs({
            project
        }),
        enabled: !!project,
    });

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: (id: string) => wafApi.deleteWafConfig(id, project),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['waf-configs'] });
            message.success('WAF config deleted successfully');
        },
    });

    // Filter data based on search term
    const filteredData = useMemo(() => {
        if (!wafConfigs) return [];

        return wafConfigs.filter(waf =>
            waf.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [wafConfigs, searchTerm]);

    const handleDelete = (record: WafConfig) => {
        confirm({
            title: 'Delete WAF Config',
            icon: <ExclamationCircleOutlined />,
            content: `Are you sure you want to delete "${record.name}"?`,
            okText: 'Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk() {
                deleteMutation.mutate(record.id);
            },
        });
    };

    const handleCreate = () => {
        navigate('/waf/create');
    };

    const clearFilters = () => {
        setSearchTerm('');
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a: WafConfig, b: WafConfig) => a.name.localeCompare(b.name),
            render: (text: string) => <Text strong>{text}</Text>,
        },
        {
            title: 'Default Directives',
            dataIndex: ['data', 'default_directives'],
            key: 'default_directives',
            render: (text: string) => <Tag className='auto-width-tag' color="green">{text}</Tag>,
        },
        {
            title: 'Directive Sets',
            key: 'directive_count',
            render: (_: any, record: WafConfig) => {
                const count = Object.keys(record.data?.directives_map || {}).length;
                return <Text>{count} set{count !== 1 ? 's' : ''}</Text>;
            },
        },
        {
            title: 'Created',
            dataIndex: 'created_at',
            key: 'created_at',
            sorter: (a: WafConfig, b: WafConfig) =>
                new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
            render: (date: string) => new Date(date).toLocaleString(),
        },
        {
            title: 'Updated',
            dataIndex: 'updated_at',
            key: 'updated_at',
            sorter: (a: WafConfig, b: WafConfig) =>
                new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime(),
            render: (date: string) => new Date(date).toLocaleString(),
        },
        {
            title: 'Actions',
            key: 'actions',
            fixed: 'right' as const,
            width: 80,
            render: (_: any, record: WafConfig) => (
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
        },
    ];

    return (
        <>
            {/* Header Section */}
            <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <Space>
                        <FireOutlined style={{ color: 'var(--color-danger)', fontSize: 24 }} />
                        <Title level={4} style={{ margin: 0 }}>
                            WAF Configurations
                        </Title>
                    </Space>
                    <Space>
                        <ElchiButton icon={<PlusOutlined />} onClick={handleCreate}>
                            Add New WAF Config
                        </ElchiButton>
                    </Space>
                </div>

                <Text type="secondary">
                    Manage Web Application Firewall (WAF) configurations including OWASP Core Rule Set settings.
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
                                    onClick={clearFilters}
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
                        onClick: () => navigate(`/waf/${record.id}`),
                        style: { cursor: 'pointer' }
                    })}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Total ${total} items`,
                    }}
                    scroll={{ x: 1200 }}
                />
            </Card>

        </>
    );
};

export default WafList;
