import React, { useEffect, useState } from 'react';
import { Form, FormInstance, Select, Transfer } from 'antd';
import { useCustomGetQuery } from '@/common/api';
import { useLocation } from 'react-router-dom';
import { useProjectVariable } from '@/hooks/useProjectVariable';

const kinds = [
    { value: 'listeners', label: 'Listener' },
    { value: 'routes', label: 'Route' },
    { value: 'clusters', label: 'Cluster' },
    { value: 'endpoints', label: 'Endpoint' },
    { value: 'secrets', label: 'Secret' },
    { value: 'filters', label: 'Filter' },
    { value: 'extensions', label: 'Extension' },
    { value: 'bootstrap', label: 'Bootstrap' }
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

    return (
        <>
            <Form.Item name={['permissions']} label="Resource" initialValue={activePerm}>
                <Select
                    style={{ width: 120, marginBottom: '5px' }}
                    loading={false}
                    options={kinds}
                    onChange={(value) => setActivePerm(value)}
                />
            </Form.Item>
            <Form.Item name={['all']} label="Permissions">
                <Transfer
                    dataSource={dataSource}
                    titles={['Available Resource', 'Selected Resource']}
                    targetKeys={targetKeys}
                    onChange={handleChange}
                    render={item => `${item.title} - (${item.description})`}
                    listStyle={{
                        width: 250,
                        height: 300,
                    }}
                    oneWay
                    showSearch
                />
            </Form.Item>
        </>
    );
};

export default Permission;