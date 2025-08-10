import React, { useEffect, useState } from 'react';
import { Dropdown, Table, Pagination, Tag, Typography, Input, Space, Card } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { ActionsSVG } from '@/assets/svg/icons';
import { DateTimeTool } from '@/utils/date-time-tool';
import { useCustomGetQuery } from '@/common/api';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import { DeleteOutlined, EditOutlined, InboxOutlined, CloudServerOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';


const { Title, Text } = Typography;
interface DataType {
    id: string;
    client_id: string;
    access_token: string;
    arch: string;
    connected: boolean;
    hostname: string;
    kernel: string;
    last_seen: Date;
    metadata: Record<string, string>;
    name: string;
    os: string;
    projects: any[];
    session_token: string;
    version: string;
    service_ips: string[];
}

const clientActions = [
    { key: '1', label: 'Edit', icon: <EditOutlined />, color: 'blue' },
    { key: '2', label: 'Delete', danger: true, icon: <DeleteOutlined /> },
];

const Clients: React.FC = () => {
    const [versionColors, setVersionColors] = useState<Record<string, string>>({});
    const [tableData, setTableData] = useState([]);
    const [searchText, setSearchText] = useState('');
    const { project } = useProjectVariable();
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 50;
    const navigate = useNavigate();

    const onClick = (record: DataType, key: string) => {
        if (key === "1") {
            navigate(`/clients/${record.client_id}`);
        }
    };

    const { isLoading: isLoadingResource, data: dataResource } = useCustomGetQuery({
        queryKey: `client_list_${project}`,
        enabled: true,
        path: `api/op/clients?project=${project}&with_service_ips=true`,
        directApi: true
    });

    useEffect(() => {
        setTableData(dataResource || []);

        if (dataResource && Array.isArray(dataResource)) {
            const uniqueVersions = [...new Set(dataResource.map(item => item.version))];
            const colors = ['cyan', 'gold', 'blue', 'purple', 'geekblue'];
            const newVersionColors: Record<string, string> = {};

            uniqueVersions.forEach((version, index) => {
                newVersionColors[version] = colors[index % colors.length];
            });

            setVersionColors(newVersionColors);
        }
    }, [dataResource]);

    const filteredTableData = React.useMemo(() => {
        if (!searchText) return tableData;
        const lower = searchText.toLowerCase();
        return tableData.filter((item: DataType) =>
            item.name?.toLowerCase().includes(lower) ||
            item.hostname?.toLowerCase().includes(lower) ||
            item.os?.toLowerCase().includes(lower) ||
            item.arch?.toLowerCase().includes(lower) ||
            item.version?.toLowerCase().includes(lower) ||
            (item.service_ips && item.service_ips.join(',').toLowerCase().includes(lower))
        );
    }, [searchText, tableData]);

    const paginatedData = React.useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredTableData.slice(start, start + pageSize);
    }, [filteredTableData, currentPage]);

    const columns: ColumnsType<DataType> = [
        {
            key: 'operation',
            fixed: 'left',
            width: '3%',
            render: (record) => (
                <div style={{ display: 'flex', justifyContent: 'center', minWidth: 1, height: 'auto' }} onClick={e => e.stopPropagation()}>
                    <Dropdown trigger={['click']} menu={{ items: clientActions, onClick: (e) => onClick(record, e.key) }}>
                        <div
                            style={{
                                background: 'none',
                                border: 'none',
                                padding: 0,
                                cursor: 'pointer',
                                textDecoration: 'underline',
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
            fixed: 'left',
            render: (_, record) => (
                <Text strong>{record.name}</Text>
            ),
        },
        {
            title: 'Service IPs',
            dataIndex: 'service_ips',
            key: 'service_ips',
            render: (service_ips: string[]) => (
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
                    {service_ips?.length || 0}
                </span>
            ),
        },
        {
            title: 'Version',
            dataIndex: 'version',
            key: 'version',
            render: (_, record) => (
                <Tag className='auto-width-tag' color={versionColors[record.version] || 'default'}>{record.version}</Tag>
            )
        },
        {
            title: 'Status',
            dataIndex: 'connected',
            key: 'connected',
            render: (connected) => (
                connected ? (
                    <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        background: '#e6fffb',
                        color: '#52c41a',
                        borderRadius: 4,
                        padding: '2px 12px',
                        fontWeight: 600,
                        fontSize: 12,
                        boxShadow: '0 1px 4px rgba(82,196,26,0.08)'
                    }}>
                        <span style={{
                            display: 'inline-block',
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            background: '#52c41a',
                            marginRight: 8
                        }} />
                        Live
                    </span>
                ) : (
                    <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        background: '#fff1f0',
                        color: '#ff4d4f',
                        borderRadius: 4,
                        padding: '2px 12px',
                        fontWeight: 600,
                        fontSize: 12,
                        boxShadow: '0 1px 4px rgba(255,77,79,0.08)'
                    }}>
                        <span style={{
                            display: 'inline-block',
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            background: '#ff4d4f',
                            marginRight: 8
                        }} />
                        Offline
                    </span>
                )
            ),
        },
        {
            title: 'Last Seen',
            dataIndex: 'last_seen',
            key: 'last_seen',
            render: (last_seen) => (
                <span>
                    {DateTimeTool(last_seen)}
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
                        <CloudServerOutlined style={{ color: '#1890ff', fontSize: 24 }} />
                        <Title level={4} style={{ margin: 0 }}>Clients</Title>
                    </Space>
                    <Space>
                        <Input.Search
                            placeholder="Search clients..."
                            allowClear
                            value={searchText}
                            onChange={e => setSearchText(e.target.value)}
                            style={{ width: 250 }}
                            prefix={<SearchOutlined />}
                        />
                    </Space>
                </div>
                
                <Text type="secondary">
                    Connected clients and their configuration status across your infrastructure.
                </Text>
            </div>

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
                    rowKey={(record) => record?.groupname || record?.id}
                    size='small'
                    columns={columns}
                    dataSource={paginatedData}
                    pagination={false}
                    scroll={{ y: 500 }}
                    locale={{
                        emptyText: (
                            <div>
                                <InboxOutlined style={{ fontSize: 48, marginBottom: 8 }} />
                                <div>No Clients</div>
                            </div>
                        )
                    }}
                    onRow={(record) => ({
                        onClick: () => navigate(`/clients/${record.client_id}`),
                        style: { cursor: 'pointer' }
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
                        Total: {filteredTableData?.length}
                    </div>
                    <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={filteredTableData.length}
                        onChange={setCurrentPage}
                        showSizeChanger={false}
                    />
                </div>
            </Card>
        </>
    );
};

export default Clients;
