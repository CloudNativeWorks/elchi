import React, { useState } from 'react';
import { Input, Typography, Table, Tag } from 'antd';
import { useCustomGetQuery } from '@/common/api';
import { useNavigate } from 'react-router-dom';
import { useProjectVariable } from '@/hooks/useProjectVariable';

const { Title } = Typography;

interface ServiceInfoCardProps {
    clientId: string;
}

const ServiceInfoCard: React.FC<ServiceInfoCardProps> = ({ clientId }) => {
    const { project } = useProjectVariable();
    const { isLoading, data: dataServices, error } = useCustomGetQuery({
        queryKey: `client_services_${clientId}`,
        enabled: !!clientId,
        path: `api/op/services/from_client?client_id=${clientId}&from_client=true&project=${project}`,
        directApi: true
    });
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState('');

    if (isLoading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}><span>Yükleniyor...</span></div>;
    }
    if (error || !dataServices) {
        return <div style={{ color: '#ff4d4f', textAlign: 'center', margin: 32 }}>No services found for this client.</div>;
    }

    let filteredServices = Array.isArray(dataServices)
        ? dataServices.filter((service: any) =>
            Array.isArray(service.clients) && service.clients.some((c: any) => c.client_id === clientId)
        )
        : [];

    if (searchText) {
        const lower = searchText.toLowerCase();
        filteredServices = filteredServices.filter((service: any) =>
            service.name?.toLowerCase().includes(lower) ||
            String(service.admin_port).includes(lower) ||
            (service.clients && service.clients.some((c: any) => c.downstream_address?.toLowerCase().includes(lower)))
        );
    }

    const columns = [
        {
            title: 'Service Name',
            dataIndex: 'name',
            key: 'name',
            render: (name: string) => (
                <span style={{ fontWeight: 600, fontSize: 13 }}>{name}</span>
            ),

        },
        {
            title: 'Admin Port',
            dataIndex: 'admin_port',
            key: 'admin_port',
            render: (admin_port: number) => <span style={{ fontWeight: 500, fontSize: 12 }}>{admin_port}</span>
        },
        {
            title: 'Address(es)',
            dataIndex: 'clients',
            key: 'clients',
            render: (clients: any[]) => (
                <span>
                    {clients.filter((c: any) => c.client_id === clientId).map((c: any, idx: number) => (
                        <Tag className='auto-width-tag' color="blue" key={c.downstream_address + idx} style={{ marginBottom: 2 }}>{c.downstream_address}</Tag>
                    ))}
                </span>
            )
        }
    ];

    return (
        <div style={{ background: '#fff', borderRadius: 8,  padding: 0 }}>
            <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Title level={4} style={{ margin: 0 }}>Services</Title>
                <Input.Search
                    placeholder="Search services..."
                    allowClear
                    value={searchText}
                    onChange={e => setSearchText(e.target.value)}
                    style={{ width: 220 }}
                />
            </div>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'stretch', borderRadius: 8, overflow: 'hidden' }}>

                <div style={{ flex: 1 }}>
                    <Table
                        columns={columns}
                        dataSource={filteredServices}
                        size='small'
                        rowKey="id"
                        pagination={false}
                        onRow={record => ({
                            onClick: () => navigate(`/services/${record.id}`),
                            style: { cursor: 'pointer' }
                        })}
                        locale={{
                            emptyText: <span style={{ color: '#bfbfbf' }}>No managed services for this client.</span>
                        }}
                        style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                    />
                </div>
            </div>
        </div>
    );
};

export default ServiceInfoCard;
