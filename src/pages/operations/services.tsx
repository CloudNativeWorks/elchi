import React, { useEffect, useState } from 'react';
import { Dropdown, Table, Typography, Pagination, Modal, Tag, Input, Space, Card } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { ActionsSVG } from '@/assets/svg/icons';
import { useCustomGetQuery } from '@/common/api';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import { EditOutlined, InboxOutlined, ApiOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getVersionAntdColor } from '@/utils/versionColors';


const { Title, Text } = Typography;
interface DataType {
    id: string;
    name: string;
    project: string;
    admin_port: number;
    status: string;
    version?: string;
    clients: {
        downstream_address: string;
        client_id: string;
    }[];
}

const serviceActions = [
    { key: '1', label: 'Edit', icon: <EditOutlined />, color: 'blue' },
];

const Services: React.FC = () => {
    const [tableData, setTableData] = useState([]);
    const [searchText, setSearchText] = useState('');
    const { project } = useProjectVariable();
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 50;
    const [ipModal, setIpModal] = useState<{ visible: boolean; ips: string[] }>({ visible: false, ips: [] });
    const navigate = useNavigate();

    const onClick = (record: DataType, key: string) => {
        if (key === "1") {
            navigate(`/services/${record.id}?version=${record.version}`);
        }
    };

    const { isLoading: isLoadingResource, data: dataResource } = useCustomGetQuery({
        queryKey: `service_list_${project}`,
        enabled: true,
        path: `api/op/services?project=${project}`,
        directApi: true
    });

    useEffect(() => {
        setTableData(dataResource || []);
    }, [dataResource]);

    const filteredTableData = React.useMemo(() => {
        if (!searchText) return tableData;
        const lower = searchText.toLowerCase();
        return tableData.filter((item: DataType) =>
            item.name?.toLowerCase().includes(lower) ||
            item.admin_port?.toString().includes(lower) ||
            item.status?.toLowerCase().includes(lower) ||
            item.clients?.some((client: { downstream_address: string }) => client.downstream_address?.toLowerCase().includes(lower))
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
                let color = '#52c41a', bg = '#f6ffed', text = 'Live';
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
                const ips = record.clients.map(client => client.downstream_address).filter(Boolean);
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
                    <Space>
                        <Input.Search
                            placeholder="Search services..."
                            allowClear
                            value={searchText}
                            onChange={e => setSearchText(e.target.value)}
                            style={{ width: 250 }}
                            prefix={<SearchOutlined />}
                        />
                    </Space>
                </div>
                
                <Text type="secondary">
                    Manage and monitor Proxy services and their deployment status across your infrastructure.
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
                    columns={columns}
                    size="small"
                    dataSource={paginatedData}
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
