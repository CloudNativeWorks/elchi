import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useNetworkOperations, NetworkState, InterfaceState, Route, RoutingPolicy, RoutingTableDefinition } from '@/hooks/useNetworkOperations';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import InterfaceOverview from './InterfaceOverview';
import RouteContent from './RouteContent';
import RoutingPolicyContent from './RoutingPolicyContent';
import RoutingTableManager from './RoutingTableManager';
import BGPContent from './bgp/BGPContent';

const MENU_ITEMS = [
    { key: 'interfaces', label: 'Interfaces' },
    { key: 'route', label: 'Route' },
    { key: 'routing_policy', label: 'Routing Policy' },
    { key: 'routing_tables', label: 'Routing Tables' },
    { key: 'bgp', label: 'BGP' },
];

const ClientNetwork: React.FC<{ clientId: string }> = ({ clientId }) => {
    const { project } = useProjectVariable();
    const networkOps = useNetworkOperations();
    const [networkState, setNetworkState] = useState<NetworkState | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('interfaces');

    const fetchNetworkState = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await networkOps.getNetworkState(clientId);
            if (response.success && response.network_state) {
                setNetworkState(response.network_state);
            } else {
                setError(response.error || 'Failed to fetch network state');
            }
        } catch (err: any) {
            setError(err?.message || 'Failed to fetch network state');
        } finally {
            setLoading(false);
        }
    }, [clientId, networkOps]);

    useEffect(() => {
        fetchNetworkState();
    }, [clientId, activeTab]);

    // Use network state structure directly with proper types
    const interfaces: InterfaceState[] = networkState?.interfaces || [];
    const routes: Route[] = networkState?.routes || [];
    const policies: RoutingPolicy[] = networkState?.policies || [];
    
    // Get routing tables from network state - backend provides all tables including system tables
    const routingTables: RoutingTableDefinition[] = useMemo(() => {
        // Just use tables from backend, they should include both system and custom tables
        const backendTables: RoutingTableDefinition[] = networkState?.routing_tables || [];
        
        // If backend doesn't provide system tables, add them as fallback
        if (backendTables.length === 0 || !backendTables.find((t: RoutingTableDefinition) => t.id === 254)) {
            const systemTables: RoutingTableDefinition[] = [
                { id: 253, name: 'default' },
                { id: 254, name: 'main' },
                { id: 255, name: 'local' }
            ];
            return [...systemTables, ...backendTables]
                .filter((table: RoutingTableDefinition) => table.id !== 0) // Hide unspec table
                .sort((a, b) => a.id - b.id);
        }
        
        // Backend provides all tables, filter out unspec and sort them
        return backendTables
            .filter((table: RoutingTableDefinition) => table.id !== 0) // Hide unspec table
            .sort((a: RoutingTableDefinition, b: RoutingTableDefinition) => a.id - b.id);
    }, [networkState?.routing_tables]);

    return (
        <div style={{ boxShadow: 'none', padding: 0, margin: 0 }}>
            <div style={{ display: 'flex' }}>
                <div
                    style={{
                        width: 200,
                        minWidth: 180,
                        maxWidth: 260,
                        borderRight: '1px solid #e6e6e6',
                        background: '#fafdff',
                        padding: '4px 10px 0 0',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        minHeight: 500,
                        boxSizing: 'border-box',
                        position: 'relative',
                    }}
                >
                    <div style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', gap: 6 }}>
                        {MENU_ITEMS.map((item) => {
                            const selected = activeTab === item.key;
                            return (
                                <div
                                    key={item.key}
                                    onClick={() => setActiveTab(item.key)}
                                    style={{
                                        position: 'relative',
                                        display: 'flex',
                                        alignItems: 'center',
                                        height: 36,
                                        padding: selected ? '6px 14px 6px 16px' : '6px 14px',
                                        fontWeight: selected ? 600 : 500,
                                        color: selected ? '#0284c7' : '#64748b',
                                        background: selected
                                            ? 'linear-gradient(to right, #f0f9ff, #e0f2fe)'
                                            : 'transparent',
                                        borderLeft: selected ? '3px solid #0284c7' : 'none',
                                        boxShadow: selected
                                            ? '0 3px 10px rgba(14, 165, 233, 0.1)'
                                            : 'none',
                                        marginLeft: selected ? 2 : 0,
                                        fontSize: 13,
                                        cursor: 'pointer',
                                        transition: 'all 0.18s',
                                        marginBottom: 0,
                                        borderRadius: '8px 8px 8px 8px',
                                        width: '100%',
                                    }}
                                    onMouseEnter={e => {
                                        if (!selected) {
                                            e.currentTarget.style.background = '#f8fafc';
                                            e.currentTarget.style.color = '#0ea5e9';
                                        }
                                    }}
                                    onMouseLeave={e => {
                                        if (!selected) {
                                            e.currentTarget.style.background = 'transparent';
                                            e.currentTarget.style.color = '#64748b';
                                        }
                                    }}
                                >
                                    {item.label}
                                </div>
                            );
                        })}
                        <div style={{ flex: 1 }} />
                    </div>
                </div>
                <div style={{ flex: 1, padding: '0 8px', display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }}>
                    <div style={{ width: '100%', padding: 0 }}>
                        {activeTab === 'interfaces' && (
                            <InterfaceOverview
                                interfaces={interfaces}
                                loading={loading}
                                error={error}
                                clientId={clientId}
                                currentNetplanYaml={networkState?.current_netplan_yaml}
                                onRefresh={fetchNetworkState}
                            />
                        )}
                        {activeTab === 'route' && (
                            <RouteContent
                                routes={routes}
                                loading={loading}
                                interfaces={interfaces}
                                routingTables={routingTables}
                                clientId={clientId}
                                onRefresh={fetchNetworkState}
                            />
                        )}
                        {activeTab === 'routing_policy' && (
                            <RoutingPolicyContent
                                clientId={clientId}
                                policies={policies}
                                loading={loading}
                                interfaces={interfaces}
                                routingTables={routingTables}
                                onRefresh={fetchNetworkState}
                            />
                        )}
                        {activeTab === 'routing_tables' && (
                            <RoutingTableManager
                                tables={networkState?.routing_tables || []}
                                routes={routes}
                                policies={policies}
                                clientId={clientId}
                                onRefresh={fetchNetworkState}
                            />
                        )}
                        {activeTab === 'bgp' && (
                            <BGPContent
                                clientId={clientId}
                                project={project}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientNetwork; 