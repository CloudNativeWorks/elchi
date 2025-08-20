import React, { useEffect, useState } from 'react';
import { Form, FormInstance, Select, Transfer, Card, Typography, Space, Badge, Divider } from 'antd';
import { 
    GlobalOutlined,      // Listener
    ShareAltOutlined,    // Route  
    ClusterOutlined,     // Cluster
    AimOutlined,         // Endpoint
    KeyOutlined,         // Secret
    FilterOutlined,      // Filter
    AppstoreOutlined,    // Extension
    CodeOutlined         // Bootstrap
} from '@ant-design/icons';
import { useCustomGetQuery } from '@/common/api';
import { useLocation } from 'react-router-dom';
import { useProjectVariable } from '@/hooks/useProjectVariable';

const { Text } = Typography;

const kinds = [
    { value: 'listeners', label: 'Listener', icon: <GlobalOutlined />, description: 'Network listeners and connection handling' },
    { value: 'routes', label: 'Route', icon: <ShareAltOutlined />, description: 'HTTP routing and traffic management' },
    { value: 'clusters', label: 'Cluster', icon: <ClusterOutlined />, description: 'Backend service clusters' },
    { value: 'endpoints', label: 'Endpoint', icon: <AimOutlined />, description: 'Service endpoint configurations' },
    { value: 'secrets', label: 'Secret', icon: <KeyOutlined />, description: 'TLS certificates and secrets' },
    { value: 'filters', label: 'Filter', icon: <FilterOutlined />, description: 'HTTP and network filters' },
    { value: 'extensions', label: 'Extension', icon: <AppstoreOutlined />, description: 'Envoy extensions and plugins' },
    { value: 'bootstrap', label: 'Bootstrap', icon: <CodeOutlined />, description: 'Bootstrap configurations' }
];

type GeneralProps = {
    kind: string;
    userOrGroupID: string;
    onPermissionsChange: any;
    form: FormInstance<any>;
};

const Permission: React.FC<GeneralProps> = ({ kind, userOrGroupID, onPermissionsChange, form }) => {
    const location = useLocation();
    const [targetKeys, setTargetKeys] = useState<string[]>([]);
    const isCreatePage = location.pathname === `/settings/create/${kind}`;
    const { project } = useProjectVariable();
    const [activePerm, setActivePerm] = useState('listeners');
    const [permissions, setPermissions] = useState({});
    const [initialPermissions, setInitialPermissions] = useState({});
    const { data: dataResource } = useCustomGetQuery({
        queryKey: `${activePerm}_list_perm_${project}`,
        enabled: true,
        path: `api/v3/setting/permissions/${kind}s/${activePerm}/${userOrGroupID}?project=${project}`,
        directApi: true
    });

    useEffect(() => {
        if (dataResource) {
            const initialSelected = dataResource.selected ? dataResource.selected.map((item: any) => item?._id) : [];
            form.setFieldsValue({
                all: dataResource.all ? dataResource.all.map((item: any) => item?._id) : [],
                selected: initialSelected,
            });
            setTargetKeys(initialSelected);
            setInitialPermissions((prev) => ({
                ...prev,
                [activePerm]: initialSelected
            }));
        }
    }, [dataResource, form, activePerm]);

    useEffect(() => {
        onPermissionsChange(permissions);
    }, [permissions, onPermissionsChange]);

    const handleChange = (nextTargetKeys: string[]) => {
        const initialSelected = initialPermissions[activePerm] || [];
        const added = nextTargetKeys.filter(key => !initialSelected.includes(key));
        const removed = initialSelected.filter(key => !nextTargetKeys.includes(key));

        const newPermissions = {
            ...permissions,
            [activePerm]: {
                added: added.length > 0 ? added : [],
                removed: removed.length > 0 ? removed : [],
            }
        };

        if (newPermissions[activePerm].added.length === 0 && newPermissions[activePerm].removed.length === 0) {
            delete newPermissions[activePerm];
        }

        setPermissions(newPermissions);
        setTargetKeys(nextTargetKeys);
    };

    useEffect(() => {
        if (isCreatePage) {
            form.resetFields();
            setTargetKeys([]);
        }
    }, [isCreatePage, form]);

    useEffect(() => {
        const initialSelected = initialPermissions[activePerm] || [];
        setTargetKeys([
            ...initialSelected,
            ...(permissions[activePerm]?.added || [])
        ].filter(key => !permissions[activePerm]?.removed.includes(key)));
    }, [activePerm, dataResource, permissions, initialPermissions]);

    const dataSource = dataResource?.all?.map((item: any) => ({
        key: item?._id,
        title: item?.general?.name,
        description: item?.general?.version,
    })) || [];

    const activeKind = kinds.find(kind => kind.value === activePerm);
    const selectedCount = targetKeys.length;
    const totalCount = dataSource.length;

    return (
        <Card
            style={{
                background: '#fafafa',
                border: '1px solid #e8f4ff',
                borderRadius: 8,
                margin: 0
            }}
            styles={{
                body: { padding: '20px' }
            }}
        >
            {/* Resource Type Selection */}
            <div style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {activeKind?.icon}
                        <Text strong style={{ fontSize: 14 }}>Resource Type</Text>
                    </div>
                    <Badge 
                        count={`${selectedCount}/${totalCount}`} 
                        style={{ 
                            backgroundColor: selectedCount > 0 ? '#52c41a' : '#d9d9d9',
                            color: selectedCount > 0 ? '#fff' : '#666'
                        }} 
                    />
                </div>
                
                <Form.Item name={['permissions']} initialValue={activePerm} style={{ margin: 0 }}>
                    <Select
                        style={{ width: '100%' }}
                        size="large"
                        loading={false}
                        onChange={(value) => setActivePerm(value)}
                        placeholder="Select resource type"
                        optionRender={(option) => (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0' }}>
                                {kinds.find(k => k.value === option.value)?.icon}
                                <div>
                                    <div style={{ fontWeight: 500 }}>{option.label}</div>
                                    <div style={{ fontSize: 12, color: '#666' }}>
                                        {kinds.find(k => k.value === option.value)?.description}
                                    </div>
                                </div>
                            </div>
                        )}
                    >
                        {kinds.map(kind => (
                            <Select.Option key={kind.value} value={kind.value}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    {kind.icon}
                                    {kind.label}
                                </div>
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                
                {activeKind && (
                    <Text type="secondary" style={{ fontSize: 12, marginTop: 8, display: 'block' }}>
                        {activeKind.description}
                    </Text>
                )}
            </div>

            <Divider style={{ margin: '20px 0' }} />

            {/* Permissions Transfer */}
            <div>
                <div style={{ marginBottom: 16 }}>
                    <Text strong style={{ fontSize: 14 }}>Resource Permissions</Text>
                    <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 4 }}>
                        Grant access to specific {activeKind?.label.toLowerCase()} resources
                    </Text>
                </div>
                
                <Form.Item name={['all']} style={{ margin: 0 }}>
                    <Transfer
                        dataSource={dataSource}
                        titles={[
                            `Available ${activeKind?.label || 'Resources'}`,
                            `Granted ${activeKind?.label || 'Resources'}`
                        ]}
                        targetKeys={targetKeys}
                        onChange={handleChange}
                        render={item => (
                            <div style={{ padding: '4px 0' }}>
                                <div style={{ fontWeight: 500, fontSize: 13 }}>{item.title}</div>
                                <div style={{ fontSize: 11, color: '#999' }}>v{item.description}</div>
                            </div>
                        )}
                        listStyle={{
                            width: 560,
                            height: 320,
                            borderRadius: 6
                        }}
                        oneWay
                        showSearch
                        locale={{
                            itemUnit: 'resource',
                            itemsUnit: 'resources',
                            notFoundContent: 'No resources found'
                        }}
                        style={{
                            width: '100%'
                        }}
                    />
                </Form.Item>
            </div>

            {selectedCount > 0 && (
                <div style={{ 
                    marginTop: 16, 
                    padding: '12px 16px', 
                    background: '#e6f7ff', 
                    border: '1px solid #91d5ff',
                    borderRadius: 6
                }}>
                    <Text style={{ fontSize: 12, color: '#1890ff' }}>
                        <strong>Summary:</strong> {selectedCount} {activeKind?.label.toLowerCase()} resource{selectedCount !== 1 ? 's' : ''} will be accessible to this user.
                    </Text>
                </div>
            )}
        </Card>
    );
};

export default Permission;