import React, { useState, useEffect } from 'react';
import { Tabs, Table, Button, Card, Modal, message, Popconfirm, Tag, Space } from 'antd';
import { PlusOutlined, DeleteOutlined, ReloadOutlined, EditOutlined } from '@ant-design/icons';
import AddBGPRouteMapCard from './forms/AddBGPRouteMapCard';
import AddBGPCommunityListCard from './forms/AddBGPCommunityListCard';
import AddBGPPrefixListCard from './forms/AddBGPPrefixListCard';
import { useBGPOperations } from '@/hooks/useBGPOperations';

interface BGPPoliciesContentProps {
    clientId: string;
}

const BGPPoliciesContent: React.FC<BGPPoliciesContentProps> = ({ clientId }) => {
    const [routeMaps, setRouteMaps] = useState<any[]>([]);
    const [communityLists, setCommunityLists] = useState<any[]>([]);
    const [prefixLists, setPrefixLists] = useState<any[]>([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [activeTab, setActiveTab] = useState('routemaps');
    const [showAddForm, setShowAddForm] = useState(false);
    const [formType, setFormType] = useState<'routemap' | 'community' | 'prefix'>('routemap');
    const [editingItem, setEditingItem] = useState<any>(null);

    const {
        loading,
        getBGPPolicyConfig,
        applyBGPRouteMap,
        removeBGPRouteMap,
        applyBGPPrefixList,
        removeBGPPrefixList,
        applyBGPCommunityList,
        removeBGPCommunityList
    } = useBGPOperations();

    const loadPolicyConfig = async () => {
        try {
            const result = await getBGPPolicyConfig(clientId);
            if (result.success && result.data) {
                const policyConfig = result.data[0]?.Result?.Frr?.bgp?.policy_config;
                if (policyConfig) {
                    const routeMapsData = policyConfig.route_maps || [];
                    const formattedRouteMaps = routeMapsData.map((rm: any) => ({
                        name: rm.name,
                        sequence: rm.sequence,
                        action: rm.action === 1 ? 'permit' : 'deny',
                        description: rm.description || '-',
                        match_conditions: rm.match_conditions || [],
                        set_actions: rm.set_actions || []
                    }));
                    setRouteMaps(formattedRouteMaps);

                    const prefixListsData = policyConfig.prefix_lists || [];
                    const formattedPrefixLists = prefixListsData.map((pl: any) => ({
                        name: pl.name,
                        sequence: pl.sequence,
                        action: pl.action === 1 ? 'permit' : 'deny',
                        prefix: pl.prefix,
                        le: pl.le,
                        ge: pl.ge
                    }));
                    setPrefixLists(formattedPrefixLists);

                    const communityListsData = policyConfig.community_lists || [];
                    const formattedCommunityLists = communityListsData.map((cl: any) => ({
                        ...cl,
                        action: cl.action === 1 ? 'permit' : 'deny',
                        community_values: cl.community_values ? cl.community_values.replace(/\s+/g, ', ') : '',
                        type: cl.type || 'standard'
                    }));
                    setCommunityLists(formattedCommunityLists);
                }
            }
        } catch (error) {
            console.error('Failed to load BGP policy configuration:', error);
            setRouteMaps([]);
            setPrefixLists([]);
            setCommunityLists([]);
        }
    };

    useEffect(() => {
        loadPolicyConfig();
    }, [clientId]);

    const handleAddPolicy = (type: 'routemap' | 'community' | 'prefix') => {
        setFormType(type);
        setEditingItem(null);
        setShowAddForm(true);
    };

    const handleEditPolicy = (type: 'routemap' | 'community' | 'prefix', item: any) => {
        setFormType(type);
        setEditingItem(item);
        setShowAddForm(true);
    };

    const handleSavePolicy = async (values: any) => {
        try {
            let result;

            switch (formType) {
                case 'routemap':
                    const formattedRouteMap = {
                        ...values,
                        action: values.action === 'permit' ? 1 : 2,
                        match_conditions: values.match_conditions || []
                    };
                    result = await applyBGPRouteMap(clientId, formattedRouteMap);
                    break;

                case 'prefix':
                    const formattedPrefixList = {
                        ...values,
                        action: values.action === 'permit' ? 1 : 2
                    };
                    result = await applyBGPPrefixList(clientId, formattedPrefixList);
                    break;

                case 'community':
                    const formattedCommunityList = {
                        ...values,
                        action: values.action === 'permit' ? 1 : 2,
                        community_values: values.community_values ? values.community_values.replace(/,\s*/g, ' ').trim() : ''
                    };
                    result = await applyBGPCommunityList(clientId, formattedCommunityList);
                    break;

                default:
                    throw new Error('Unknown policy type');
            }

            if (result.success) {
                setShowAddForm(false);
                setEditingItem(null);
                setFormType('routemap');
                await loadPolicyConfig();
            }
        } catch (error) {
            console.error('Failed to save policy:', error);
        }
    };

    const handleRefresh = () => {
        loadPolicyConfig();
    };

    const isPrefixListUsedInRouteMaps = (prefixListName: string): string[] => {
        const usedInRouteMaps: string[] = [];
        routeMaps.forEach(routeMap => {
            if (routeMap.match_conditions && Array.isArray(routeMap.match_conditions)) {
                routeMap.match_conditions.forEach((condition: any) => {
                    if (condition.match_type === 'prefix-list' && condition.match_value === prefixListName) {
                        usedInRouteMaps.push(routeMap.name);
                    }
                });
            }
        });
        return usedInRouteMaps;
    };

    const isCommunityListUsedInRouteMaps = (communityListName: string): string[] => {
        const usedInRouteMaps: string[] = [];
        routeMaps.forEach(routeMap => {
            if (routeMap.match_conditions && Array.isArray(routeMap.match_conditions)) {
                routeMap.match_conditions.forEach((condition: any) => {
                    if (condition.match_type === 'community' && condition.match_value === communityListName) {
                        usedInRouteMaps.push(routeMap.name);
                    }
                });
            }
        });
        return usedInRouteMaps;
    };

    const handleBatchRemove = (type: 'routemap' | 'community' | 'prefix') => {
        if (selectedRowKeys.length === 0) return;

        console.log('Removing policies:', selectedRowKeys, 'for client:', clientId);

        const blockedItems: string[] = [];
        if (type === 'prefix') {
            selectedRowKeys.forEach(itemName => {
                const usedInRouteMaps = isPrefixListUsedInRouteMaps(itemName as string);
                if (usedInRouteMaps.length > 0) {
                    blockedItems.push(`"${itemName}" (used in: ${usedInRouteMaps.join(', ')})`);
                }
            });
        } else if (type === 'community') {
            selectedRowKeys.forEach(itemName => {
                const usedInRouteMaps = isCommunityListUsedInRouteMaps(itemName as string);
                if (usedInRouteMaps.length > 0) {
                    blockedItems.push(`"${itemName}" (used in: ${usedInRouteMaps.join(', ')})`);
                }
            });
        }

        if (blockedItems.length > 0) {
            message.error(`Cannot delete the following ${type}s because they are being used in route maps: ${blockedItems.join(', ')}`);
            return;
        }

        switch (type) {
            case 'routemap':
                setRouteMaps(prev => prev.filter(item => !selectedRowKeys.includes(item.name)));
                break;
            case 'community':
                setCommunityLists(prev => prev.filter(item => !selectedRowKeys.includes(item.name)));
                break;
            case 'prefix':
                setPrefixLists(prev => prev.filter(item => !selectedRowKeys.includes(item.name)));
                break;
        }

        setSelectedRowKeys([]);
        message.success(`${selectedRowKeys.length} ${type}(s) removed successfully`);
    };

    const handleDeleteRouteMap = async (record: any) => {
        try {
            const result = await removeBGPRouteMap(clientId, record.name, record.sequence);
            if (result.success) {
                await loadPolicyConfig(); // Refresh data
            }
        } catch (error) {
            console.error('Failed to delete route map:', error);
        }
    };

    const handleDeleteCommunityList = async (record: any) => {
        try {
            const result = await removeBGPCommunityList(clientId, record.name, record.sequence);
            if (result.success) {
                await loadPolicyConfig(); // Refresh data
            }
        } catch (error) {
            console.error('Failed to delete community list:', error);
        }
    };

    const handleDeletePrefixList = async (record: any) => {
        try {
            const result = await removeBGPPrefixList(clientId, record.name, record.sequence);
            if (result.success) {
                await loadPolicyConfig(); // Refresh data
            }
        } catch (error) {
            console.error('Failed to delete prefix list:', error);
        }
    };

    const routeMapColumns = [
        { title: 'Name', dataIndex: 'name', key: 'name', width: '20%' },
        { title: 'Sequence', dataIndex: 'sequence', key: 'sequence', width: '10%' },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            width: '10%',
            render: (action: string) => (
                <Tag className='auto-width-tag' color={action === 'permit' ? 'green' : 'red'}>
                    {action}
                </Tag>
            )
        },
        {
            title: 'Match Conditions',
            dataIndex: 'match_conditions',
            key: 'match_conditions',
            width: '35%',
            render: (matches: any[]) => {
                if (!matches || matches.length === 0) return '-';
                return (
                    <div>
                        {matches.map((match, index) => (
                            <Tag className='auto-width-tag' key={index} color="blue" style={{ marginBottom: 2 }}>
                                {match.match_type}: {match.match_value}
                            </Tag>
                        ))}
                    </div>
                );
            }
        },
        { title: 'Description', dataIndex: 'description', key: 'description', width: '15%' },
        {
            title: 'Actions',
            key: 'actions',
            width: '10%',
            render: (record: any) => (
                <Space size="small">
                    <Button
                        size="small"
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => handleEditPolicy('routemap', record)}
                        title="Edit Route Map"
                    />
                    <Popconfirm
                        title="Delete route map?"
                        description="This action cannot be undone."
                        onConfirm={() => handleDeleteRouteMap(record)}
                        okText="Delete"
                        cancelText="Cancel"
                    >
                        <Button
                            size="small"
                            danger
                            type="text"
                            icon={<DeleteOutlined />}
                            title="Delete"
                        />
                    </Popconfirm>
                </Space>
            )
        }
    ];

    const communityListColumns = [
        { title: 'Name', dataIndex: 'name', key: 'name', width: '20%' },
        { title: 'Sequence', dataIndex: 'sequence', key: 'sequence', width: '10%' },
        { title: 'Type', dataIndex: 'type', key: 'type', width: '15%' },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            width: '10%',
            render: (action: string) => (
                <Tag className='auto-width-tag' color={action === 'permit' ? 'green' : 'red'}>
                    {action}
                </Tag>
            )
        },
        {
            title: 'Community Values',
            dataIndex: 'community_values',
            key: 'community_values',
            width: '35%',
            render: (values: string) => values || '-'
        },
        {
            title: 'Actions',
            key: 'actions',
            width: '10%',
            render: (record: any) => (
                <Space size="small">
                    <Button
                        size="small"
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => handleEditPolicy('community', record)}
                        title="Edit Community List"
                    />
                    <Popconfirm
                        title="Delete Community List?"
                        description={() => {
                            const usedInRouteMaps = isCommunityListUsedInRouteMaps(record.name);
                            if (usedInRouteMaps.length > 0) {
                                return (
                                    <div>
                                        <div>This community list is being used in route maps:</div>
                                        <div style={{ color: '#ff4d4f', fontWeight: 500 }}>
                                            {usedInRouteMaps.join(', ')}
                                        </div>
                                        <div>Cannot delete until removed from route maps.</div>
                                    </div>
                                );
                            }
                            return "This action cannot be undone.";
                        }}
                        onConfirm={() => {
                            const usedInRouteMaps = isCommunityListUsedInRouteMaps(record.name);
                            if (usedInRouteMaps.length > 0) {
                                message.error(`Cannot delete community list "${record.name}". It is being used in route maps: ${usedInRouteMaps.join(', ')}`);
                                return;
                            }
                            handleDeleteCommunityList(record);
                        }}
                        okText="Delete"
                        cancelText="Cancel"
                        okButtonProps={{
                            disabled: isCommunityListUsedInRouteMaps(record.name).length > 0
                        }}
                    >
                        <Button
                            size="small"
                            danger
                            type="text"
                            icon={<DeleteOutlined />}
                            title="Delete Community List"
                            disabled={isCommunityListUsedInRouteMaps(record.name).length > 0}
                        />
                    </Popconfirm>
                </Space>
            )
        }
    ];

    const prefixListColumns = [
        { title: 'Name', dataIndex: 'name', key: 'name', width: '20%' },
        { title: 'Sequence', dataIndex: 'sequence', key: 'sequence', width: '10%' },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            width: '10%',
            render: (action: string) => (
                <Tag className='auto-width-tag' color={action === 'permit' ? 'green' : 'red'}>
                    {action}
                </Tag>
            )
        },
        { title: 'Prefix', dataIndex: 'prefix', key: 'prefix', width: '30%' },
        {
            title: 'Length Range',
            key: 'length_range',
            width: '20%',
            render: (record: any) => {
                if (record.le || record.ge) {
                    return `${record.ge ? `ge ${record.ge}` : ''} ${record.le ? `le ${record.le}` : ''}`.trim();
                }
                return '-';
            }
        },
        {
            title: 'Actions',
            key: 'actions',
            width: '10%',
            render: (record: any) => (
                <Space size="small">
                    <Button
                        size="small"
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => handleEditPolicy('prefix', record)}
                        title="Edit Prefix List"
                    />
                    <Popconfirm
                        title="Delete Prefix List?"
                        description={() => {
                            const usedInRouteMaps = isPrefixListUsedInRouteMaps(record.name);
                            if (usedInRouteMaps.length > 0) {
                                return (
                                    <div>
                                        <div>This prefix list is being used in route maps:</div>
                                        <div style={{ color: '#ff4d4f', fontWeight: 500 }}>
                                            {usedInRouteMaps.join(', ')}
                                        </div>
                                        <div>Cannot delete until removed from route maps.</div>
                                    </div>
                                );
                            }
                            return "This action cannot be undone.";
                        }}
                        onConfirm={() => {
                            const usedInRouteMaps = isPrefixListUsedInRouteMaps(record.name);
                            if (usedInRouteMaps.length > 0) {
                                message.error(`Cannot delete prefix list "${record.name}". It is being used in route maps: ${usedInRouteMaps.join(', ')}`);
                                return;
                            }
                            handleDeletePrefixList(record);
                        }}
                        okText="Delete"
                        cancelText="Cancel"
                        okButtonProps={{
                            disabled: isPrefixListUsedInRouteMaps(record.name).length > 0
                        }}
                    >
                        <Button
                            size="small"
                            danger
                            type="text"
                            icon={<DeleteOutlined />}
                            title="Delete Prefix List"
                            disabled={isPrefixListUsedInRouteMaps(record.name).length > 0}
                        />
                    </Popconfirm>
                </Space>
            )
        }
    ];

    const getRowSelectionProps = (type: 'routemap' | 'community' | 'prefix') => ({
        selectedRowKeys,
        onChange: (newSelectedRowKeys: React.Key[]) => {
            setSelectedRowKeys(newSelectedRowKeys);
        },
        getCheckboxProps: (record: any) => {
            let isUsedInRouteMaps = false;
            if (type === 'prefix') {
                isUsedInRouteMaps = isPrefixListUsedInRouteMaps(record.name).length > 0;
            } else if (type === 'community') {
                isUsedInRouteMaps = isCommunityListUsedInRouteMaps(record.name).length > 0;
            }
            return {
                disabled: isUsedInRouteMaps,
                title: isUsedInRouteMaps ? `Cannot select: Used in route maps` : undefined
            };
        }
    });

    const renderTabContent = (type: 'routemap' | 'community' | 'prefix', data: any[], columns: any[]) => (
        <div>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <Popconfirm
                        title={`Remove selected ${type}s?`}
                        description="This action cannot be undone."
                        onConfirm={() => handleBatchRemove(type)}
                        okText="Remove All"
                        cancelText="Cancel"
                    >
                        <Button
                            danger
                            icon={<DeleteOutlined />}
                            disabled={selectedRowKeys.length === 0}
                            style={{ borderRadius: 8 }}
                        >
                            Remove Selected {selectedRowKeys.length > 0 && `(${selectedRowKeys.length})`}
                        </Button>
                    </Popconfirm>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                    <Button
                        icon={<ReloadOutlined />}
                        onClick={handleRefresh}
                        loading={loading}
                        style={{ borderRadius: 8 }}
                    >
                        Refresh
                    </Button>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => handleAddPolicy(type)}
                        style={{
                            background: 'linear-gradient(90deg, #056ccd 0%, #00c6fb 100%)',
                            border: 'none',
                            borderRadius: 8,
                            fontWeight: 500,
                            boxShadow: '0 2px 8px rgba(0,198,251,0.10)',
                        }}
                        className="modern-add-btn"
                    >
                        Add {type === 'routemap' ? 'Route Map' : type === 'community' ? 'Community List' : 'Prefix List'}
                    </Button>
                </div>
            </div>

            <Card style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <Table
                    rowSelection={getRowSelectionProps(type)}
                    dataSource={data}
                    columns={columns}
                    rowKey="name"
                    pagination={false}
                    size="middle"
                    loading={loading}
                />
            </Card>
        </div>
    );

    const getFormComponent = () => {
        switch (formType) {
            case 'routemap':
                return (
                    <AddBGPRouteMapCard
                        onCancel={() => {
                            setShowAddForm(false);
                            setEditingItem(null);
                        }}
                        onSave={handleSavePolicy}
                        initialValues={editingItem}
                        isEditing={!!editingItem}
                        prefixLists={prefixLists}
                        communityLists={communityLists}
                    />
                );
            case 'community':
                return (
                    <AddBGPCommunityListCard
                        onCancel={() => {
                            setShowAddForm(false);
                            setEditingItem(null);
                        }}
                        onSave={handleSavePolicy}
                        initialValues={editingItem}
                        isEditing={!!editingItem}
                    />
                );
            case 'prefix':
                return (
                    <AddBGPPrefixListCard
                        onCancel={() => {
                            setShowAddForm(false);
                            setEditingItem(null);
                        }}
                        onSave={handleSavePolicy}
                        initialValues={editingItem}
                        isEditing={!!editingItem}
                    />
                );
            default:
                return null;
        }
    };

    const getModalTitle = () => {
        const action = editingItem ? 'Edit' : 'Add';
        switch (formType) {
            case 'routemap': return `${action} Route Map`;
            case 'community': return `${action} Community List`;
            case 'prefix': return `${action} Prefix List`;
            default: return `${action} Policy`;
        }
    };

    const tabItems = [
        {
            key: 'routemaps',
            label: 'Route Maps',
            children: renderTabContent('routemap', routeMaps, routeMapColumns)
        },
        {
            key: 'communities',
            label: 'Community Lists',
            children: renderTabContent('community', communityLists, communityListColumns)
        },
        {
            key: 'prefixes',
            label: 'Prefix Lists',
            children: renderTabContent('prefix', prefixLists, prefixListColumns)
        }
    ];

    return (
        <div>
            <Tabs
                activeKey={activeTab}
                onChange={(key) => {
                    setActiveTab(key);
                    setSelectedRowKeys([]);
                }}
                items={tabItems}
                tabBarStyle={{ marginBottom: 16 }}
            />

            <Modal
                title={getModalTitle()}
                open={showAddForm}
                onCancel={() => {
                    setShowAddForm(false);
                    setEditingItem(null);
                }}
                footer={null}
                width={700}
            >
                {getFormComponent()}
            </Modal>
        </div>
    );
};

export default BGPPoliciesContent; 