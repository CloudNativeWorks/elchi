import React, { useMemo, useState } from 'react';
import { Table, Button, Divider, message, Popconfirm } from 'antd';
import { DeleteOutlined, PlusOutlined, LockOutlined } from '@ant-design/icons';
import AddRouteCard from './AddRouteCard';
import { useNetworkOperations } from '@/hooks/useNetworkOperations';

interface RouteContentProps {
    routes: any[];
    loading: boolean;
    interfaces: any[];
    routingTables: { name: string; table: number; }[];
    clientId: string;
    onRefresh?: () => void;
}

const SYSTEM_SOURCES = ['dhcp', 'kernel', 'boot', 'system'];

const RouteContent: React.FC<RouteContentProps> = ({ routes, loading, interfaces, routingTables, clientId, onRefresh }) => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [actionLoading, setActionLoading] = useState(false);
    const { addRoute, removeRoute } = useNetworkOperations();

    const handleAddRoute = () => {
        setShowAddForm(true);
    };

    const handleCancelAdd = () => {
        setShowAddForm(false);
    };

    const handleSaveRoute = async (values: any) => {
        setActionLoading(true);
        try {
            // values: { routes: [{ to, via, interface, table, metric }] } or single route
            const routeList = values.routes || [values];
            
            // Group routes by interface
            const interfacesMap: { [ifname: string]: any[] } = {};
            routeList.forEach((route: any) => {
                if (!route.interface) return;
                if (!interfacesMap[route.interface]) interfacesMap[route.interface] = [];
                interfacesMap[route.interface].push({
                    to: route.to,
                    via: route.via,
                    ...(route.table && { table: Number(route.table) }),
                    ...(route.metric && { metric: Number(route.metric) })
                });
            });
            
            const interfaces = Object.entries(interfacesMap).map(([ifname, routes]) => ({ ifname, routes }));
            await addRoute(clientId, interfaces);
            message.success('Route(s) added successfully!');
            setShowAddForm(false);
            onRefresh?.();
        } catch (error: any) {
            message.error('Failed to add route: ' + (error?.message || error));
        } finally {
            setActionLoading(false);
        }
    };

    const handleBatchRemove = async () => {
        if (selectedRowKeys.length === 0) {
            message.warning('Please select routes to remove');
            return;
        }
        
        // Filter out system routes
        const validKeys = selectedRowKeys.filter(key => {
            const route = routes.find(r => 
                `${r.interface}-${r.to}-${r.via}-${r.table}` === key
            );
            return route && !SYSTEM_SOURCES.includes(route.source);
        });
        
        if (validKeys.length === 0) {
            message.warning('Cannot remove system routes');
            return;
        }
        
        setActionLoading(true);
        try {
            // Group routes to remove by interface
            const interfacesMap: { [ifname: string]: any[] } = {};
            validKeys.forEach(key => {
                const route = routes.find(r => 
                    `${r.interface}-${r.to}-${r.via}-${r.table}` === key
                );
                if (!route) return;
                
                if (!interfacesMap[route.interface]) interfacesMap[route.interface] = [];
                interfacesMap[route.interface].push({
                    to: route.to,
                    via: route.via,
                    ...(route.table && { table: Number(route.table) }),
                    ...(route.metric && { metric: Number(route.metric) })
                });
            });
            
            const interfaces = Object.entries(interfacesMap).map(([ifname, routes]) => ({ ifname, routes }));
            await removeRoute(clientId, interfaces);
            message.success(`${validKeys.length} route(s) removed successfully!`);
            setSelectedRowKeys([]);
            onRefresh?.();
        } catch (error: any) {
            message.error('Failed to remove routes: ' + (error?.message || error));
        } finally {
            setActionLoading(false);
        }
    };

    const sortedRoutes = useMemo(() => {
        const staticRoutes = routes.filter(route => !SYSTEM_SOURCES.includes(route.source));
        const systemRoutes = routes.filter(route => SYSTEM_SOURCES.includes(route.source));

        const sortByInterface = (a: any, b: any) => a.interface.localeCompare(b.interface);
        
        const sortedStatic = [...staticRoutes].sort(sortByInterface);
        const sortedSystem = [...systemRoutes].sort(sortByInterface);

        if (sortedStatic.length > 0 && sortedSystem.length > 0) {
            return [
                ...sortedStatic,
                { isDivider: true, id: 'divider' },
                ...sortedSystem
            ];
        }

        return [...sortedStatic, ...sortedSystem];
    }, [routes]);

    // Show add form when requested
    if (showAddForm) {
        return (
            <AddRouteCard
                interfaces={interfaces}
                routingTables={routingTables}
                onCancel={handleCancelAdd}
                onSave={handleSaveRoute}
            />
        );
    }

    const columns = [
        {
            title: 'Interface',
            dataIndex: 'interface',
            key: 'interface',
            width: '15%',
        },
        {
            title: 'Destination',
            dataIndex: 'to',
            key: 'to',
            width: '25%',
        },
        {
            title: 'Gateway',
            dataIndex: 'via',
            key: 'via',
            width: '25%',
            render: (text: string) => text || 'direct',
        },
        {
            title: 'Scope',
            dataIndex: 'scope',
            key: 'scope',
            width: '15%',
        },
        {
            title: 'Table',
            dataIndex: 'table',
            key: 'table',
            width: '10%',
            render: (text: number) => text || 'Main',
        },
        {
            title: 'Metric',
            dataIndex: 'metric',
            key: 'metric',
            width: '10%',
            render: (text: number) => text || '-',
        },
        {
            title: 'Source',
            dataIndex: 'source',
            key: 'source',
            width: '15%',
            render: (text: string) => {
                if (SYSTEM_SOURCES.includes(text)) {
                    return (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <LockOutlined style={{ color: '#8c8c8c', fontSize: 12 }} />
                            <span style={{ color: '#8c8c8c' }}>{text}</span>
                        </div>
                    );
                }
                return text || 'static';
            },
        },
    ];

    const rowSelection = {
        selectedRowKeys,
        onChange: (newSelectedRowKeys: React.Key[]) => {
            setSelectedRowKeys(newSelectedRowKeys);
        },
        getCheckboxProps: (record: any) => ({
            disabled: record.isDivider || SYSTEM_SOURCES.includes(record.source),
        }),
    };

    return (
        <div>
            <div style={{ 
                marginBottom: 16, 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <Popconfirm
                        title="Remove selected routes?"
                        description={`Are you sure you want to remove ${selectedRowKeys.length} route(s)? This action cannot be undone.`}
                        onConfirm={handleBatchRemove}
                        okText="Yes, Remove"
                        cancelText="Cancel"
                        disabled={selectedRowKeys.length === 0 || actionLoading}
                    >
                        <Button
                            danger
                            icon={<DeleteOutlined />}
                            disabled={selectedRowKeys.length === 0 || actionLoading}
                            loading={actionLoading}
                            style={{
                                borderRadius: 8,
                            }}
                        >
                            Remove Selected {selectedRowKeys.length > 0 && `(${selectedRowKeys.length})`}
                        </Button>
                    </Popconfirm>
                </div>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAddRoute}
                    loading={actionLoading}
                    style={{
                        background: 'linear-gradient(90deg, #056ccd 0%, #00c6fb 100%)',
                        border: 'none',
                        borderRadius: 8,
                        fontWeight: 500,
                        boxShadow: '0 2px 8px rgba(0,198,251,0.10)',
                    }}
                    className="modern-add-btn"
                >
                    Add Route
                </Button>
            </div>
            <Table
                rowSelection={rowSelection}
                dataSource={sortedRoutes}
                columns={columns}
                rowKey={(record) => record.isDivider ? 'divider' : `${record.interface}-${record.to}-${record.via}-${record.table}`}
                loading={loading || actionLoading}
                pagination={false}
                size="middle"
                style={{ 
                    background: '#fff',
                    borderRadius: 12,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                }}
                components={{
                    body: {
                        row: ({ children, ...props }: any) => {
                            if (props['data-row-key'] === 'divider') {
                                return (
                                    <tr>
                                        <td colSpan={7} style={{ padding: '8px 16px', background: '#fafafa' }}>
                                            <div style={{ 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                gap: 8,
                                                color: '#8c8c8c',
                                                fontSize: 13
                                            }}>
                                                <Divider orientation='left' orientationMargin={0} style={{ marginLeft: -12, marginBottom:0, marginTop:0, fontSize: 12, color: '#8c8c8c' }} >System Routes </Divider>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            }
                            return <tr {...props}>{children}</tr>;
                        }
                    }
                }}
            />
        </div>
    );
};

export default RouteContent; 