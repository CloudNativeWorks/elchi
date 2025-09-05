import React, { useEffect, useState } from 'react';
import { Form, Input, Select, Switch, Card, Typography, Space, Row, Col, Tag } from 'antd';
import { UserOutlined, MailOutlined, KeyOutlined, TeamOutlined, ProjectOutlined, SettingOutlined, ArrowLeftOutlined, CloseOutlined, SaveOutlined, PlusOutlined, SafetyOutlined } from '@ant-design/icons';
import { useCustomGetQuery } from '@/common/api';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useCustomApiMutation } from '@/common/custom-api';
import Permissions from './permissions';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import useAuth from '@/hooks/useUserDetails';
import ElchiButton from '@/elchi/components/common/ElchiButton';

const { Title, Text } = Typography;

interface UserFormValues {
    is_create: boolean;
    username?: string;
    email?: string;
    password?: string;
    role?: string;
    auth_type?: string;
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
    const [changedValues, setChangedValues] = useState<Partial<UserFormValues>>({});
    const [permissions, setPermissions] = useState({});
    const { project } = useProjectVariable();
    const [selectedProject, setSelectedProject] = useState("");
    const userDetail = useAuth();

    const handlePermissionsChange = (newPermissions: any) => {
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

        await mutate.mutateAsync({
            data: finalValues,
            method: 'put',
            path: `api/v3/setting/user/${isCreatePage ? finalValues.username : user_id}?project=${project}`
        }, {
            onSuccess: () => {
                navigate('/settings/users');
            }
        })
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
                    auth_type: dataUser.auth_type,
                    base_group: dataUser.base_group,
                    base_project: dataUser.base_project,
                    groups: updatedGroups,
                    active: dataUser.active
                }
            });
        }
        if (isError) {
            form.resetFields();
        }
    }, [dataUser, form, isCreatePage, dataGroups, selectedProject, isError]);

    useEffect(() => {
        if (isCreatePage) {
            form.resetFields();
        }
    }, [isCreatePage, form]);

    useEffect(() => {
        if (dataProject?.length > 0 && project) {
            const domainKey = window.location.hostname;
            const savedProject = localStorage.getItem(`selectedProject-${domainKey}`);
            setSelectedProject(savedProject || project);
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
        <>
            {/* Header Section */}
            <div style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <Space>
                        <UserOutlined style={{ color: '#1890ff', fontSize: 24 }} />
                        <Title level={4} style={{ margin: 0 }}>
                            {isCreatePage ? 'Create User' : 'User Details'}
                        </Title>
                        {!isCreatePage && dataUser?.auth_type && (
                            <Tag 
                                icon={<SafetyOutlined />} 
                                color={dataUser.auth_type === 'ldap' ? 'cyan' : 'geekblue'}
                            >
                                {dataUser.auth_type.toUpperCase()}
                            </Tag>
                        )}
                    </Space>
                    <ElchiButton
                        type="text"
                        icon={<ArrowLeftOutlined />}
                        onClick={goBack}
                        onlyText
                    >
                        Back
                    </ElchiButton>
                </div>
                <Text type="secondary">
                    {isCreatePage
                        ? 'Create a new user account with role-based permissions and access controls.'
                        : 'Manage user account settings, roles, and permissions.'
                    }
                </Text>
            </div>

            {/* Main Form Card */}
            <Card
                style={{
                    borderRadius: 12,
                    boxShadow: '0 2px 8px rgba(5,117,230,0.06)',
                }}
                styles={{
                    body: { padding: '32px' }
                }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    name="nest-messages"
                    onValuesChange={onValuesChange}
                    onFinish={onFinish}
                    autoComplete='nope'
                >
                    {/* Basic Information Section */}
                    <div style={{ marginBottom: 32 }}>
                        <Title level={5} style={{ marginBottom: 20, color: '#1890ff', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <UserOutlined />
                            Basic Information
                        </Title>
                        <Row gutter={24}>
                            <Col xs={24} lg={12}>
                                <Form.Item
                                    name={['user', 'username']}
                                    label="Username"
                                    rules={[{ required: true, message: 'User name is required!' }]}
                                >
                                    <Input
                                        prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
                                        placeholder="Enter username"
                                        autoComplete="nope"
                                        disabled={username === 'admin' || (dataUser?.auth_type === 'ldap' && !isCreatePage)}
                                        size="large"
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} lg={12}>
                                <Form.Item
                                    name={['user', 'email']}
                                    label="Email"
                                    rules={[{ type: 'email', required: true, message: 'Email is not a valid email!' }]}
                                    hasFeedback
                                >
                                    <Input
                                        prefix={<MailOutlined style={{ color: '#bfbfbf' }} />}
                                        placeholder="Enter email address"
                                        disabled={dataUser?.auth_type === 'ldap' && !isCreatePage}
                                        size="large"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </div>

                    {/* Security Section */}
                    <div style={{ marginBottom: 32 }}>
                        <Title level={5} style={{ marginBottom: 20, color: '#1890ff', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <KeyOutlined />
                            Security
                        </Title>
                        <Row gutter={24}>
                            <Col xs={24} lg={12}>
                                <Form.Item
                                    name={['user', 'password']}
                                    label="Password"
                                    hasFeedback
                                    rules={[
                                        { required: isCreatePage, message: 'Please input your password!' },
                                        () => ({
                                            validator(_, value) {
                                                // Skip password validation for LDAP users
                                                if (dataUser?.auth_type === 'ldap') {
                                                    return Promise.resolve();
                                                }
                                                
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
                                    <Input.Password
                                        prefix={<KeyOutlined style={{ color: '#bfbfbf' }} />}
                                        placeholder={dataUser?.auth_type === 'ldap' ? "LDAP users authenticate via LDAP server" : "Enter password"}
                                        autoComplete="new-password"
                                        size="large"
                                        disabled={dataUser?.auth_type === 'ldap' && !isCreatePage}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} lg={12}>
                                <Form.Item
                                    name="confirm"
                                    label="Confirm Password"
                                    dependencies={['user', 'password', 'user', 'auth_type']}
                                    hasFeedback
                                    rules={[
                                        {
                                            required: isCreatePage,
                                            message: 'Please confirm your password!',
                                        },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                // Skip validation for LDAP users
                                                if (dataUser?.auth_type === 'ldap') {
                                                    return Promise.resolve();
                                                }
                                                
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
                                    <Input.Password
                                        prefix={<KeyOutlined style={{ color: '#bfbfbf' }} />}
                                        placeholder={dataUser?.auth_type === 'ldap' ? "LDAP users authenticate via LDAP server" : "Confirm password"}
                                        autoComplete="new-password"
                                        size="large"
                                        disabled={dataUser?.auth_type === 'ldap' && !isCreatePage}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </div>
                    {/* Role & Permissions Section */}
                    <div style={{ marginBottom: 32 }}>
                        <Title level={5} style={{ marginBottom: 20, color: '#1890ff', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <TeamOutlined />
                            Role & Groups
                        </Title>
                        <Row gutter={24}>
                            <Col xs={24} lg={8}>
                                <Form.Item
                                    name={['user', 'role']}
                                    label="Role"
                                    rules={[{ required: true, message: 'Please select a role' }]}
                                    hasFeedback
                                >
                                    <Select
                                        placeholder="Select a role"
                                        disabled={username === 'admin'}
                                        size="large"
                                    >
                                        <Select.Option value="owner">Owner</Select.Option>
                                        <Select.Option value="admin">Admin</Select.Option>
                                        <Select.Option value="editor">Editor</Select.Option>
                                        <Select.Option value="viewer">Viewer</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col xs={24} lg={8}>
                                <Form.Item name={['user', 'base_group']} label="Base Group">
                                    <Select
                                        allowClear
                                        placeholder="Select base group"
                                        onClear={clearField}
                                        disabled={username === 'admin'}
                                        size="large"
                                    >
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
                            </Col>
                            <Col xs={24} lg={8}>
                                <Form.Item name={['user', 'groups']} label="Groups">
                                    <Select
                                        mode="multiple"
                                        disabled
                                        placeholder="Groups will be assigned"
                                        size="large"
                                    >
                                        <Select.Option key={"non"} value={"non"}>
                                            non
                                        </Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                    </div>

                    {/* Project & Settings Section */}
                    <div style={{ marginBottom: 32 }}>
                        <Title level={5} style={{ marginBottom: 20, color: '#1890ff', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <ProjectOutlined />
                            Project & Settings
                        </Title>
                        <Row gutter={24}>
                            <Col xs={24} lg={12}>
                                <Form.Item
                                    name={['user', 'base_project']}
                                    initialValue={selectedProject}
                                    label="Base Project"
                                >
                                    <Select
                                        placeholder="Select base project"
                                        disabled={userDetail?.role !== 'owner' || !isCreatePage}
                                        size="large"
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
                            </Col>
                            <Col xs={24} lg={12}>
                                <Form.Item
                                    name={['user', 'active']}
                                    label="Account Status"
                                    valuePropName="checked"
                                    initialValue={isCreatePage ? true : undefined}
                                    preserve={false}
                                >
                                    <Switch 
                                        checkedChildren="Active"
                                        unCheckedChildren="Inactive"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </div>
                    {/* Permissions Section */}
                    {username !== 'admin' && (
                        <div style={{ marginBottom: 32 }}>
                            <Title level={5} style={{ marginBottom: 20, color: '#1890ff', display: 'flex', alignItems: 'center', gap: 8 }}>
                                <SettingOutlined />
                                Permissions
                            </Title>
                            <Permissions
                                kind='user'
                                userOrGroupID={user_id || username}
                                onPermissionsChange={handlePermissionsChange}
                                form={form}
                            />
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: 12,
                        paddingTop: 24,
                        borderTop: '1px solid #f0f0f0'
                    }}>
                        <ElchiButton
                            type="default"
                            icon={<CloseOutlined />}
                            onClick={goBack}
                            onlyText
                            size="large"
                        >
                            Cancel
                        </ElchiButton>
                        <ElchiButton
                            type="primary"
                            icon={isCreatePage ? <PlusOutlined /> : <SaveOutlined />}
                            htmlType="submit"
                            onlyText
                            size="large"
                        >
                            {isCreatePage ? "Create User" : "Update User"}
                        </ElchiButton>
                    </div>
                </Form>
            </Card>
        </>
    );
};

export default User;
