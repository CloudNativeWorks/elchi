import React, { useEffect, useState } from 'react';
import { Dropdown, Table, Typography, Pagination, Modal, Tag, Input, Space, Card, Select, Button, Row, Col } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { ActionsSVG } from '@/assets/svg/icons';
import { useCustomGetQuery } from '@/common/api';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import { EditOutlined, InboxOutlined, ApiOutlined, SearchOutlined, FilterOutlined, ClearOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getVersionAntdColor } from '@/utils/versionColors';


const { Title, Text } = Typography;
interface ServiceData {
    id: string;
    name: string;
    project: string;
    version: string;
    admin_port: number;
    clients: {
        downstream_address: string;
        client_id: string;
    }[];
    permissions: {
        users: any[];
        groups: any[];
    };
    status: string;
}

interface ApiResponse {
    data: {
        data: ServiceData[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

const serviceActions = [
    { key: '1', label: 'Edit', icon: <EditOutlined />, color: 'blue' },
];

const Services: React.FC = () => {
    const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
    const [filters, setFilters] = useState<Record<string, any>>({});
    const [tempFilters, setTempFilters] = useState<Record<string, any>>({});
    const { project } = useProjectVariable();
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(50);
    const [ipModal, setIpModal] = useState<{ visible: boolean; ips: string[] }>({ visible: false, ips: [] });
    const navigate = useNavigate();


    const onClick = (record: ServiceData, key: string) => {
        if (key === "1") {
            navigate(`/services/${record.id}?version=${record.version}`);
        }
    };

    const applyFilters = () => {
        setFilters(tempFilters);
        setCurrentPage(1); // Reset to first page when filtering
    };

    const clearFilters = () => {
        setTempFilters({});
        setFilters({});
        setCurrentPage(1);
    };

    // Build query parameters
    const buildQueryParams = () => {
        const params = new URLSearchParams();
        params.set('project', project);
        params.set('page', currentPage.toString());
        params.set('limit', pageSize.toString());

        if (filters.name) params.set('name', filters.name);
        if (filters.version) params.set('version', filters.version);
        if (filters.downstream_address) params.set('downstream_address', filters.downstream_address);
        if (filters.status) params.set('status', filters.status);

        return params.toString();
    };

    const { isLoading: isLoadingResource, data: dataResource } = useCustomGetQuery({
        queryKey: `service_list_${project}_${currentPage}_${pageSize}_${JSON.stringify(filters)}`,
        enabled: true,
        path: `api/op/services?${buildQueryParams()}`,
        directApi: true
    });

    useEffect(() => {
        setApiResponse(dataResource || null);
    }, [dataResource]);

    // Parse nested API response structure
    const tableData = Array.isArray(apiResponse?.data?.data) ? apiResponse.data.data : [];
    const totalRecords = apiResponse?.data?.total || 0;


    const columns: ColumnsType<ServiceData> = [
        {
            key: 'operation',
            fixed: 'left',
            width: '3%',
            render: (record) => (
                <div style={{ display: 'flex', justifyContent: 'center', minWidth: 1 }} onClick={e => e.stopPropagation()}>
                    <Dropdown trigger={['click']} menu={{ items: serviceActions, onClick: (e) => onClick(record, e.key) }}>
                        <div
                            style={{
                                background: 'none',
                                border: 'none',
                                padding: 0,
                                cursor: 'pointer',
                                color: 'blue',
                                display: 'flex',
                                alignItems: 'center',
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
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: '30%',
            render: (_, record) => (
                <Text strong>{record.name}</Text>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string, record) => {
                if (record.clients?.length === 0) {
                    return (
                        <Tag className='auto-width-tag'
                            style={{
                                display: 'inline-block',
                                background: '#f5f5f5',
                                color: '#bfbfbf',
                                borderRadius: 4,
                                padding: '2px 14px',
                                border: '0px',
                                fontWeight: 600,
                                fontSize: 12,
                                minWidth: 60,
                                textAlign: 'center',
                                boxShadow: '0 1px 4px #bfbfbf22'
                            }}
                        >
                            <span style={{
                                display: 'inline-block',
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                background: '#bfbfbf',
                                marginRight: 8
                            }} />
                            Not Deployed
                        </Tag>
                    );
                }
                let color = '#bfbfbf', bg = '#bfbfbf22', text = 'Not Deployed';
                if (status === 'Live') {
                    color = '#52c41a'; bg = '#f6ffed'; text = 'Live';
                } else if (status === 'Partial') {
                    color = '#faad14'; bg = '#fffbe6'; text = 'Partial';
                } else if (status === 'Offline') {
                    color = '#ff4d4f'; bg = '#fff1f0'; text = 'Offline';
                }
                return (
                    <Tag className='auto-width-tag' color={color}
                        style={{
                            display: 'inline-block',
                            background: bg,
                            color,
                            borderRadius: 4,
                            padding: '2px 14px',
                            fontWeight: 600,
                            fontSize: 12,
                            minWidth: 60,
                            textAlign: 'center',
                            boxShadow: `0 1px 4px ${color}22`
                        }}
                    >
                        <span style={{
                            display: 'inline-block',
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            background: color,
                            marginRight: 8
                        }} />
                        {text}
                    </Tag>
                );
            },
        },
        {
            title: 'Version',
            dataIndex: 'version',
            key: 'version',
            render: (version: string) => {
                if (!version) return <span style={{ color: '#bfbfbf' }}>-</span>;
                return (
                    <Tag
                        className='auto-width-tag'
                        color={getVersionAntdColor(version)}
                    >
                        {version}
                    </Tag>
                );
            },
        },
        {
            title: 'Deployed',
            dataIndex: 'clients',
            key: 'clients',
            render: (clients: { downstream_address: string; client_id: string }[]) => (
                <span style={{
                    display: 'inline-flex',
                    background: 'linear-gradient(90deg, #e6f7ff 0%, #bae7ff 100%)',
                    color: '#1890ff',
                    alignItems: 'center',
                    borderRadius: 4,
                    padding: '2px 12px',
                    fontWeight: 600,
                    fontSize: 12,
                    boxShadow: '0 1px 4px rgba(82,196,26,0.08)'
                }}>
                    {clients?.length || 0}
                </span>
            ),
        },
        {
            title: 'Ip Addresses',
            dataIndex: 'ip_addresses',
            key: 'ip_addresses',
            render: (_, record) => {
                const ips = record.clients.map((client: any) => client.downstream_address).filter(Boolean);
                if (ips.length === 0) return <span>-</span>;
                if (ips.length === 1) return <span>{ips[0]}</span>;
                return (
                    <>
                        <span>{ips[0]}</span>
                        <a
                            style={{ marginLeft: 8, color: '#1677ff', cursor: 'pointer', fontSize: 12 }}
                            onClick={() => setIpModal({ visible: true, ips })}
                        >
                            +{ips.length - 1} more
                        </a>
                    </>
                );
            },
        },
        {
            title: 'Admin Port',
            dataIndex: 'admin_port',
            key: 'admin_port',
            render: (admin_port) => (
                <span>
                    {admin_port}
                </span>
            ),
        },
    ];

    return (
        <>
            {/* Header Section - Outside Card */}
            <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <Space>
                        <ApiOutlined style={{ color: '#1890ff', fontSize: 24 }} />
                        <Title level={4} style={{ margin: 0 }}>Services</Title>
                    </Space>
                </div>
                
                <Text type="secondary">
                    Manage and monitor Proxy services and their deployment status across your infrastructure.
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
                    <Col span={6}>
                        <Input
                            placeholder="Search by name..."
                            allowClear
                            prefix={<SearchOutlined />}
                            value={tempFilters.name}
                            onChange={(e) => setTempFilters(prev => ({ ...prev, name: e.target.value }))}
                            onPressEnter={applyFilters}
                        />
                    </Col>
                    <Col span={4}>
                        <Select
                            placeholder="Version"
                            allowClear
                            value={tempFilters.version || undefined}
                            onChange={(value) => setTempFilters(prev => ({ ...prev, version: value }))}
                            style={{ width: '100%' }}
                            options={window.APP_CONFIG.AVAILABLE_VERSIONS.map(version => ({
                                label: version,
                                value: version
                            }))}
                        />
                    </Col>
                    <Col span={4}>
                        <Select
                            placeholder="Status"
                            allowClear
                            value={tempFilters.status || undefined}
                            onChange={(value) => setTempFilters(prev => ({ ...prev, status: value }))}
                            style={{ width: '100%' }}
                            options={[
                                { value: "Live", label: "Live (All Connected)" },
                                { value: "Partial", label: "Partial (Some Connected)" },
                                { value: "Offline", label: "Offline (None Connected)" },
                                { value: "Not_Deployed", label: "Not Deployed" }
                            ]}
                        />
                    </Col>
                    <Col span={4}>
                        <Input
                            placeholder="Filter by IP..."
                            allowClear
                            value={tempFilters.downstream_address}
                            onChange={(e) => setTempFilters(prev => ({ ...prev, downstream_address: e.target.value }))}
                            onPressEnter={applyFilters}
                            prefix={<FilterOutlined />}
                        />
                    </Col>
                    <Col span={6}>
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
                    loading={isLoadingResource}
                    rowKey={(record) => record.id}
                    columns={columns}
                    size="small"
                    dataSource={tableData}
                    pagination={false}
                    locale={{
                        emptyText: (
                            <div>
                                <InboxOutlined style={{ fontSize: 48, marginBottom: 8 }} />
                                <div>No Services</div>
                            </div>
                        )
                    }}
                    onRow={(record) => ({
                        onClick: () => navigate(`/services/${record.id}?version=${record.version}`),
                        style: {
                            cursor: 'pointer',
                            background: (record.clients?.length === 0) ? '#fafafa' : undefined
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
                        {apiResponse?.data && (
                            <span style={{ marginLeft: 8 }}>
                                (Page {apiResponse.data.page} of {apiResponse.data.totalPages})
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
                        showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} services`}
                    />
                </div>
            </Card>
            <Modal
                open={ipModal.visible}
                onCancel={() => setIpModal({ visible: false, ips: [] })}
                footer={null}
                title="All IP Addresses"
            >
                <ul style={{ paddingLeft: 20, margin: 0 }}>
                    {ipModal.ips.map((ip, idx) => (
                        <li key={ip + idx} style={{ fontSize: 14 }}>{ip}</li>
                    ))}
                </ul>
            </Modal>
        </>
    );
};

export default Services;
