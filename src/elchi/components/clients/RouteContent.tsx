import React, { useMemo, useState } from 'react';
import { Table, Button, Divider, Popconfirm, Tooltip } from 'antd';
import { DeleteOutlined, PlusOutlined, LockOutlined } from '@ant-design/icons';
import AddRouteCard from './AddRouteCard';
import { useNetworkOperations, RouteOperation, Route, InterfaceState, RoutingTableDefinition } from '@/hooks/useNetworkOperations';
import { showErrorNotification, showWarningNotification } from '@/common/notificationHandler';

interface RouteContentProps {
    routes: Route[];
    loading: boolean;
    interfaces: InterfaceState[];
    routingTables: RoutingTableDefinition[];
    clientId: string;
    onRefresh?: () => void;
}

const SYSTEM_SOURCES = ['dhcp', 'kernel', 'boot', 'system'];

const PROTECTED_PROTOCOLS = {
    'bgp': 'BGP routes are dynamically managed and should not be manually deleted',
    'ospf': 'OSPF routes are dynamically managed and should not be manually deleted',
    'isis': 'ISIS routes are dynamically managed and should not be manually deleted',
    'zebra': 'FRR/Zebra routes are dynamically managed and should not be manually deleted',
    'bird': 'BIRD routes are dynamically managed and should not be manually deleted',
    'kernel': 'Kernel routes are system managed and should not be manually deleted',
    'redirect': 'ICMP redirect routes are system managed and should not be manually deleted',
    'dhcp': 'DHCP routes are service managed and deletion may break network connectivity',
    'ra': 'IPv6 Router Advertisement routes are system managed and should not be deleted'
};

const RouteContent: React.FC<RouteContentProps> = ({ routes, loading, interfaces, routingTables, clientId, onRefresh }) => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [actionLoading, setActionLoading] = useState(false);
    const { manageRoutes } = useNetworkOperations();

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

            // Convert to new route operations format
            const routeOperations: RouteOperation[] = routeList.map((route: any) => ({
                action: 'ADD',
                route: {
                    to: route.to,
                    via: route.via,
                    interface: route.interface,
                    ...(route.table && { table: Number(route.table) }),
                    ...(route.metric && { metric: Number(route.metric) }),
                    ...(route.scope && { scope: route.scope }),
                    ...(route.protocol && { protocol: route.protocol })
                }
            }));

            const response = await manageRoutes(clientId, routeOperations);

            if (response.success) {
                // Only close form and refresh on success
                setShowAddForm(false);
                onRefresh?.();
            }
        } catch (error: any) {
            // Check for detailed error message in multiple locations
            let errorMessage = 'Failed to add route';

            // Check response.data.message first (backend validation errors)
            if (error?.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            // Check direct response.message 
            else if (error?.response?.message) {
                errorMessage = error.response.message;
            }
            // Check general error.message
            else if (error?.message) {
                errorMessage = error.message;
            }

            showErrorNotification(errorMessage);
            // Don't close form on error - keep it open so user can fix the issue
        } finally {
            setActionLoading(false);
        }
    };

    const handleBatchRemove = async () => {
        if (selectedRowKeys.length === 0) {
            showWarningNotification('Please select routes to remove');
            return;
        }

        // Filter out system routes and direct routes
        const validKeys = selectedRowKeys.filter(key => {
            const route = routes.find(r =>
                `${r.interface}-${r.to}-${r.via}-${r.table}` === key
            );
            return route && !SYSTEM_SOURCES.includes(route.source) && !PROTECTED_PROTOCOLS.hasOwnProperty(route.protocol); // Don't allow deletion of protected protocol routes
        });

        if (validKeys.length === 0) {
            showWarningNotification('Cannot remove system routes or protected protocol routes');
            return;
        }

        setActionLoading(true);
        try {
            // Convert to new route operations format
            const routeOperations: RouteOperation[] = validKeys.map(key => {
                const route = routes.find(r =>
                    `${r.interface}-${r.to}-${r.via}-${r.table}` === key
                );
                if (!route) throw new Error(`Route not found for key: ${key}`);

                return {
                    action: 'DELETE',
                    route: {
                        to: route.to,
                        via: route.via,
                        interface: route.interface,
                        ...(route.table && { table: Number(route.table) }),
                        ...(route.metric && { metric: Number(route.metric) }),
                        ...(route.scope && { scope: route.scope }),
                        ...(route.protocol && { protocol: route.protocol })
                    }
                };
            });

            await manageRoutes(clientId, routeOperations);

            setSelectedRowKeys([]);
            onRefresh?.();
        } catch (error: any) {
            // Check for detailed error message in multiple locations
            let errorMessage = 'Failed to remove routes';

            // Check response.data.message first (backend validation errors)
            if (error?.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            // Check direct response.message 
            else if (error?.response?.message) {
                errorMessage = error.response.message;
            }
            // Check general error.message
            else if (error?.message) {
                errorMessage = error.message;
            }

            showErrorNotification(errorMessage);
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
            width: '10%',
        },
        {
            title: 'Protocol',
            dataIndex: 'protocol',
            key: 'protocol',
            width: '10%',
            render: (text: string) => text || '-',
        },
        {
            title: 'Table',
            dataIndex: 'table',
            key: 'table',
            width: '8%',
            render: (text: number) => text || 'Main',
        },
        {
            title: 'Metric',
            dataIndex: 'metric',
            key: 'metric',
            width: '8%',
            render: (text: number) => text || '-',
        },
        {
            title: 'Source',
            dataIndex: 'source',
            key: 'source',
            width: '15%',
            render: (text: string, record: any) => {
                if (SYSTEM_SOURCES.includes(text)) {
                    return (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <LockOutlined style={{ color: '#8c8c8c', fontSize: 12 }} />
                            <span style={{ color: '#8c8c8c' }}>{text}</span>
                        </div>
                    );
                }
                if (PROTECTED_PROTOCOLS.hasOwnProperty(record.protocol)) { // Protected protocol routes
                    return (
                        <Tooltip title={PROTECTED_PROTOCOLS[record.protocol]} placement="topLeft">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <LockOutlined style={{ color: '#8c8c8c', fontSize: 12 }} />
                                <span style={{ color: '#8c8c8c' }}>{text || record.protocol}</span>
                            </div>
                        </Tooltip>
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
            disabled: record.isDivider || SYSTEM_SOURCES.includes(record.source) || PROTECTED_PROTOCOLS.hasOwnProperty(record.protocol), // Disable selection for protected protocol routes
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
                                        <td colSpan={8} style={{ padding: '8px 16px', background: '#fafafa' }}>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 8,
                                                color: '#8c8c8c',
                                                fontSize: 13
                                            }}>
                                                <Divider orientation='left' orientationMargin={0} style={{ marginLeft: -12, marginBottom: 0, marginTop: 0, fontSize: 12, color: '#8c8c8c' }} >System Routes </Divider>
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