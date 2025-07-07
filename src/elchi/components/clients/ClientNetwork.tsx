import React, { useEffect, useState, useMemo } from 'react';
import { useClientNetworks } from '@/hooks/useClientNetworks';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import InterfaceContent from './InterfaceContent';
import RouteContent from './RouteContent';
import RoutingPolicyContent from './RoutingPolicyContent';
import BGPContent from './bgp/BGPContent';

const MENU_ITEMS = [
    { key: 'interfaces', label: 'Interfaces' },
    { key: 'route', label: 'Route' },
    { key: 'routing_policy', label: 'Routing Policy' },
    { key: 'bgp', label: 'BGP' },
];

const ClientNetwork: React.FC<{ clientId: string }> = ({ clientId }) => {
    const { project } = useProjectVariable();
    const { loading, error, networkData, refetch } = useClientNetworks({ project: project, clientId: clientId });
    const [activeTab, setActiveTab] = useState('interfaces');

    useEffect(() => {
        refetch();
    }, [clientId, activeTab]);

    const interfaces = networkData?.[0]?.Result?.Network.interfaces || [];
    const routes = interfaces.reduce((acc: any[], curr: any) => {
        if (Array.isArray(curr.routes)) {
            curr.routes.forEach((route: any) => {
                acc.push({ ...route, interface: curr.ifname });
            });
        }
        return acc;
    }, []);

    const policies = interfaces.reduce((acc: any[], curr: any) => {
        if (Array.isArray(curr.routing_policies)) {
            curr.routing_policies.forEach((policy: any) => {
                // Filter out empty objects and invalid policies
                if (policy && 
                    typeof policy === 'object' && 
                    Object.keys(policy).length > 0 &&
                    (policy.from || policy.to || policy.table !== undefined)) {
                    acc.push({ ...policy, interface: curr.ifname });
                }
            });
        }
        return acc;
    }, []);

    // Create routing tables list
    const routingTables = useMemo(() => {
        // Default tables
        const defaultTables = [
            { name: 'main', table: 254 },
            { name: 'default', table: 253 }
        ];

        // Extract tables from interfaces data with their interface names
        const tablesFromData = new Map<number, string>();
        interfaces.forEach((iface: any) => {
            if (iface.table && iface.table !== 254 && iface.table !== 253) {
                tablesFromData.set(iface.table, iface.ifname);
            }
        });

        // Convert to array and add to default tables
        const additionalTables = Array.from(tablesFromData).map(([tableNum, ifname]) => ({
            name: ifname,
            table: tableNum
        }));

        return [...defaultTables, ...additionalTables].sort((a, b) => b.table - a.table);
    }, [interfaces]);

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
                            <InterfaceContent
                                interfaces={interfaces}
                                loading={loading}
                                error={error}
                                clientId={clientId}
                                routingTables={routingTables}
                            />
                        )}
                        {activeTab === 'route' && (
                            <RouteContent
                                routes={routes}
                                loading={loading}
                                interfaces={interfaces}
                                routingTables={routingTables}
                                clientId={clientId}
                                onRefresh={refetch}
                            />
                        )}
                        {activeTab === 'routing_policy' && (
                            <RoutingPolicyContent
                                clientId={clientId}
                                policies={policies}
                                loading={loading}
                                routingTables={routingTables}
                                onRefresh={refetch}
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