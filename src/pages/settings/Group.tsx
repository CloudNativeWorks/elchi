import React, { useEffect, useState } from 'react';
import { Divider, Form, Input, Transfer, message } from 'antd';
import { useCustomGetQuery } from '@/common/api';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { errorMessage, successMessage } from '@/common/message';
import { AxiosError } from 'axios';
import { useCustomApiMutation } from '@/common/custom-api';
import Permissions from './permissions';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import ElchiButton from '@/elchi/components/common/ElchiButton';


const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 40 },
};

const Group: React.FC = () => {
    const { groupname } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const mutate = useCustomApiMutation();
    const { project } = useProjectVariable();
    const query = new URLSearchParams(location.search);
    const group_id = query.get('group_id');

    const [targetKeys, setTargetKeys] = useState([]);
    const [messageApi, contextHolder] = message.useMessage();
    const [permissions, setPermissions] = useState({});
    const isCreatePage = location.pathname === `/settings/create/group`;
    const [form] = Form.useForm();
    const { error: isError, data: dataGroup } = useCustomGetQuery({
        queryKey: `group_details_${project}`,
        enabled: !isCreatePage,
        path: `api/v3/setting/group/${group_id}?project=${project}`,
        directApi: true
    });

    useEffect(() => {
        if (isError) {
            errorMessage(messageApi, "Failed to fetch group details");
        }
    }, [isError, messageApi]);

    const { data: userList } = useCustomGetQuery({
        queryKey: `userlist_groups_${project}`,
        enabled: true,
        path: `api/v3/setting/user_list?project=${project}`,
        directApi: true
    });

    const handlePermissionsChange = (newPermissions) => {
        setPermissions(newPermissions);
    };

    const onFinish = async (values: any) => {
        let groupName: string;
        if (isCreatePage) {
            groupName = form.getFieldValue(['group', 'groupname'])
            values.group["is_create"] = true
            values.group["project"] = project;
        } else {
            groupName = group_id
            values.group["is_create"] = false
        }

        if (Object.keys(permissions).length > 0) {
            values.group["permissions"] = permissions;
        }

        try {
            await mutate.mutateAsync({ data: values.group, method: 'put', path: `api/v3/setting/group/${groupName}?project=${project}` }, {
                onSuccess: (data: any) => {
                    successMessage(messageApi, data.message);
                    navigate('/settings/groups');
                },
                onError: (error: any) => {
                    console.log(error?.response?.data?.message)
                },
            })
        } catch (error) {
            if (error instanceof AxiosError) { errorMessage(messageApi, error?.response?.data?.message) }
        }
    };

    const goBack = () => {
        navigate(-1);
    };

    useEffect(() => {
        if (dataGroup) {
            form.setFieldsValue({
                group: {
                    groupname: dataGroup.groupname,
                    members: dataGroup.members,
                }
            });
            setTargetKeys(dataGroup.members);
        } else {
            form.resetFields();
            setTargetKeys([]);
        }
    }, [dataGroup, form]);

    const handleChange = (nextTargetKeys) => {
        setTargetKeys(nextTargetKeys);
    };

    const dataSource = userList?.map(user => ({
        key: user.user_id,
        title: user.username,
        description: user.email,
    }));

    useEffect(() => {
        if (isCreatePage) {
            form.resetFields();
            setTargetKeys([])
        }
    }, [isCreatePage, form]);

    return (
        <>{contextHolder}
            <div style={{
                background: '#fff',
                padding: '12px 12px 24px 12px',
                borderRadius: 12,
                boxShadow: '0 2px 8px rgba(5,117,230,0.06)',
                margin: '4px 0'
            }}>
                <Divider type="horizontal" orientation="left" orientationMargin="0">Group Detail</Divider>
                <Form
                    form={form}
                    {...layout}
                    name="nest-messages"
                    onFinish={onFinish}
                    style={{ maxWidth: 900 }}
                >
                    <Form.Item name={['group', 'groupname']} label="Groupname" rules={[{ required: true, message: 'Group name is required!' }]}>
                        <Input disabled={!isCreatePage} />
                    </Form.Item>
                    <Form.Item name={['group', 'members']} label="Members">
                        <Transfer
                            dataSource={dataSource}
                            titles={['Available Users', 'Group Members']}
                            targetKeys={targetKeys}
                            onChange={handleChange}
                            render={item => item.title}
                            listStyle={{
                                width: 250,
                                height: 300,
                            }}
                            oneWay
                            showSearch
                        />
                    </Form.Item>
                    <Permissions kind='group' userOrGroupID={group_id || groupname} onPermissionsChange={handlePermissionsChange} form={form} />
                    <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-start', gap: 10 }}>
                            <ElchiButton type="primary" htmlType="submit" onlyText>
                                {isCreatePage ? "Create" : "Update"}
                            </ElchiButton>
                            <ElchiButton type="primary" onClick={goBack} onlyText>
                                Back
                            </ElchiButton>
                        </div>
                    </Form.Item>
                </Form>
            </div>
        </>
    );
};


export default Group;
