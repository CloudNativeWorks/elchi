import React, { useEffect, useState } from 'react';
import { Divider, Form, Input, Select, message, Switch } from 'antd';
import { useCustomGetQuery } from '@/common/api';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useCustomApiMutation } from '@/common/custom-api';
import { AxiosError } from "axios"
import { errorMessage, successMessage } from '@/common/message';
import Permissions from './permissions';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import useAuth from '@/hooks/useUserDetails';
import ElchiButton from '@/elchi/components/common/ElchiButton';


const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 40 },
};

interface UserFormValues {
    is_create: boolean;
    username?: string;
    email?: string;
    password?: string;
    role?: string;
    base_group?: string;
    base_project?: string;
    groups?: string[];
    active?: boolean;
    permissions?: Record<string, any>;
}

const User: React.FC = () => {
    const { username } = useParams();
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const user_id = query.get('user_id');
    const navigate = useNavigate();
    const mutate = useCustomApiMutation();
    const [baseGroupCleared, setBaseGroupCleared] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [changedValues, setChangedValues] = useState<Partial<UserFormValues>>({});
    const [permissions, setPermissions] = useState({});
    const { project } = useProjectVariable();
    const [selectedProject, setSelectedProject] = useState("");
    const userDetail = useAuth();

    const handlePermissionsChange = (newPermissions) => {
        setPermissions(newPermissions);
    };

    const isCreatePage = location.pathname === `/settings/create/user`;
    const [form] = Form.useForm();
    const { error: isError, data: dataUser } = useCustomGetQuery({
        queryKey: `user_details_${project}`,
        enabled: !isCreatePage,
        path: `api/v3/setting/user/${user_id}?project=${project}`,
        directApi: true
    });

    const { data: dataGroups } = useCustomGetQuery({
        queryKey: `group_list_for_users_${project}`,
        enabled: true,
        path: `api/v3/setting/group_list?project=${project}`,
        directApi: true
    });

    const { data: dataProject } = useCustomGetQuery({
        queryKey: "project_list_for_users",
        enabled: true,
        path: `api/v3/setting/project_list`,
        directApi: true
    });

    const onValuesChange = (changed: any) => {
        setChangedValues(prev => ({ ...prev, ...changed.user }));
    };

    const clearField = () => {
        setBaseGroupCleared(true)
    };

    const onFinish = async () => {
        const formValues = form.getFieldValue('user');

        const finalValues: UserFormValues = {
            ...changedValues,
            ...formValues,
            is_create: isCreatePage,
            base_project: formValues?.base_project || project,
            active: formValues?.active !== undefined ? formValues.active : true
        };

        if (baseGroupCleared) {
            finalValues.base_group = "xremove"
        } else if (finalValues.base_group === undefined) {
            delete finalValues.base_group;
        }

        if (Object.keys(permissions).length > 0) {
            finalValues.permissions = permissions;
        }

        try {
            await mutate.mutateAsync({
                data: finalValues,
                method: 'put',
                path: `api/v3/setting/user/${isCreatePage ? finalValues.username : user_id}?project=${project}`
            }, {
                onSuccess: (data: any) => {
                    successMessage(messageApi, data.message);
                    navigate('/settings/users');
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
        if (dataUser && !isCreatePage) {
            const updatedGroups = dataUser.groups?.map((groupId: string) => {
                const group = dataGroups?.find(data => data._id === groupId);
                return group ? group.groupname : groupId;
            });
            form.setFieldsValue({
                user: {
                    username: dataUser.username,
                    email: dataUser.email,
                    password: '',
                    role: dataUser.role,
                    base_group: dataUser.base_group,
                    base_project: dataUser.base_project,
                    groups: updatedGroups,
                    active: dataUser.active
                }
            });
        }
        if (isError) {
            form.resetFields();
            errorMessage(messageApi, 'Error fetching user details');
        }
    }, [dataUser, form, isCreatePage, dataGroups, selectedProject]);

    useEffect(() => {
        if (isCreatePage) {
            form.resetFields();
        }
    }, [isCreatePage, form]);

    useEffect(() => {
        if (dataProject?.length > 0 && project) {
            setSelectedProject(project);
        }
    }, [dataProject, project]);

    useEffect(() => {
        if (selectedProject && dataProject?.length > 0) {
            form.setFieldsValue({
                user: {
                    base_project: selectedProject,
                }
            });
        }
    }, [selectedProject, dataProject, form]);

    return (
        <>{contextHolder}
            <div style={{
                background: '#fff',
                padding: '12px 12px 24px 12px',
                borderRadius: 12,
                boxShadow: '0 2px 8px rgba(5,117,230,0.06)',
                margin: '4px 0'
            }}>
                <Divider type="horizontal" orientation="left" orientationMargin="0">User Detail</Divider>
                <Form
                    form={form}
                    {...layout}
                    name="nest-messages"
                    onValuesChange={onValuesChange}
                    onFinish={onFinish}
                    style={{ maxWidth: 900 }}
                    autoComplete='nope'
                >
                    <Form.Item name={['user', 'username']} label="Username" rules={[{ required: true, message: 'User name is required!' }]}>
                        <Input autoComplete="nope" disabled={username === 'admin'} />
                    </Form.Item>
                    <Form.Item name={['user', 'email']} label="Email" rules={[{ type: 'email', required: true, message: 'Email is not a valid email!' }]} hasFeedback>
                        <Input />
                    </Form.Item>
                    <Form.Item name={['user', 'password']} label="Password" hasFeedback rules={[
                        { required: isCreatePage, message: 'Please input your password!' },
                        () => ({
                            validator(_, value) {
                                if (!value && isCreatePage) {
                                    return Promise.reject(new Error('Please input your password!'));
                                }
                                if (value) {
                                    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
                                    if (!passwordRegex.test(value)) {
                                        return Promise.reject(new Error('Password must include at least one uppercase letter, one lowercase letter, one number, and one special character.'));
                                    }
                                }
                                return Promise.resolve();
                            },
                        }),
                    ]}
                    >
                        <Input.Password autoComplete="new-password" />
                    </Form.Item>
                    <Form.Item name="confirm" label="Confirm Password" dependencies={['user', 'password']} hasFeedback
                        rules={[
                            {
                                required: isCreatePage,
                                message: 'Please confirm your password!',
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    const password = getFieldValue(['user', 'password']);
                                    if (!value && isCreatePage) {
                                        return Promise.reject(new Error('Please confirm your password!'));
                                    }
                                    if (value) {
                                        if (password !== value) {
                                            return Promise.reject(new Error('The passwords that you entered do not match!'));
                                        }
                                    }
                                    return Promise.resolve();
                                },
                            }),
                        ]}
                    >
                        <Input.Password autoComplete="new-password" />
                    </Form.Item>
                    <Form.Item name={['user', 'role']} label="Role" rules={[{ required: true, message: 'Please select a role' }]} hasFeedback>
                        <Select placeholder="Select a role" disabled={username === 'admin'}>
                            <Select.Option value="owner">Owner</Select.Option>
                            <Select.Option value="admin">Admin</Select.Option>
                            <Select.Option value="editor">Editor</Select.Option>
                            <Select.Option value="viewer">Viewer</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name={['user', 'base_group']} label="Base Group">
                        <Select allowClear placeholder="Select base group" onClear={clearField} disabled={username === 'admin'}>
                            {dataGroups
                                ?.filter(group => group.groupname !== '')
                                .map((groupv) => (
                                    <Select.Option key={`${groupv._id}`} value={groupv._id}>
                                        {groupv.groupname}
                                    </Select.Option>
                                ))
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item name={['user', 'base_project']} initialValue={selectedProject} label="Base Project">
                        <Select
                            placeholder="Select base project"
                            disabled={userDetail?.role !== 'owner' || !isCreatePage}
                        >
                            {dataProject
                                ?.filter((projecta) => projecta["_id"] !== "")
                                .map((projectv) => (
                                    <Select.Option key={projectv["_id"]} value={projectv["_id"]}>
                                        {projectv.projectname}
                                    </Select.Option>
                                ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name={['user', 'groups']} label="Groups">
                        <Select mode="multiple" disabled>
                            <Select.Option key={"non"} value={"non"}>
                                non
                            </Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name={['user', 'active']}
                        label="Active"
                        valuePropName="checked"
                        initialValue={true}
                    >
                        <Switch />
                    </Form.Item>
                    {username !== 'admin' &&
                        <Permissions kind='user' userOrGroupID={user_id || username} onPermissionsChange={handlePermissionsChange} form={form} />
                    }
                    <Form.Item>
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

export default User;
