import React, { useEffect, useState } from 'react';
import { Form, Input, Transfer, Card, Typography, Space, Badge, Divider } from 'antd';
import { TeamOutlined, UserOutlined, SettingOutlined, ArrowLeftOutlined, CloseOutlined, SaveOutlined, PlusOutlined } from '@ant-design/icons';
import { useCustomGetQuery } from '@/common/api';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useCustomApiMutation } from '@/common/custom-api';
import Permissions from './permissions';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import ElchiButton from '@/elchi/components/common/ElchiButton';

const { Title, Text } = Typography;

const Group: React.FC = () => {
    const { groupname } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const mutate = useCustomApiMutation();
    const { project } = useProjectVariable();
    const query = new URLSearchParams(location.search);
    const group_id = query.get('group_id');

    const [targetKeys, setTargetKeys] = useState([]);
    const [permissions, setPermissions] = useState({});
    const isCreatePage = location.pathname === `/settings/create/group`;
    const [form] = Form.useForm();
    const { data: dataGroup } = useCustomGetQuery({
        queryKey: `group_details_${project}`,
        enabled: !isCreatePage,
        path: `api/v3/setting/group/${group_id}?project=${project}`,
        directApi: true
    });

    const { data: userList } = useCustomGetQuery({
        queryKey: `userlist_groups_${project}`,
        enabled: true,
        path: `api/v3/setting/user_list?project=${project}`,
        directApi: true
    });

    const handlePermissionsChange = (newPermissions: any) => {
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

        await mutate.mutateAsync({
            data: values.group,
            method: 'put',
            path: `api/v3/setting/group/${groupName}?project=${project}`
        }, {
            onSuccess: () => {
                navigate('/settings/groups');
            }
        })
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

    const handleChange = (nextTargetKeys: string[]) => {
        setTargetKeys(nextTargetKeys);
    };

    const dataSource = userList?.map((user: any) => ({
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
        <>
            {/* Header Section */}
            <div style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <Space>
                        <TeamOutlined style={{ color: '#1890ff', fontSize: 24 }} />
                        <Title level={4} style={{ margin: 0 }}>
                            {isCreatePage ? 'Create Group' : 'Group Details'}
                        </Title>
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
                        ? 'Create a new user group with member management and resource permissions.'
                        : 'Manage group settings, members, and resource permissions.'
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
                    onFinish={onFinish}
                >
                    {/* Basic Information Section */}
                    <div style={{ marginBottom: 32 }}>
                        <Title level={5} style={{ marginBottom: 20, color: '#1890ff', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <TeamOutlined />
                            Group Information
                        </Title>
                        <Form.Item
                            name={['group', 'groupname']}
                            label="Group Name"
                            rules={[{ required: true, message: 'Group name is required!' }]}
                            style={{ maxWidth: 400 }}
                        >
                            <Input
                                prefix={<TeamOutlined style={{ color: '#bfbfbf' }} />}
                                placeholder="Enter group name"
                                disabled={!isCreatePage}
                                size="large"
                            />
                        </Form.Item>
                    </div>

                    {/* Members Section */}
                    <div style={{ marginBottom: 32 }}>
                        <Title level={5} style={{ marginBottom: 20, color: '#1890ff', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <UserOutlined />
                            Group Members
                        </Title>

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
                            {/* Member Selection Header */}
                            <div style={{ marginBottom: 24 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <UserOutlined />
                                        <Text strong style={{ fontSize: 14 }}>Member Management</Text>
                                    </div>
                                    <Badge
                                        count={`${(targetKeys || []).length}/${(dataSource || []).length}`}
                                        style={{
                                            backgroundColor: (targetKeys || []).length > 0 ? '#52c41a' : '#d9d9d9',
                                            color: (targetKeys || []).length > 0 ? '#fff' : '#666'
                                        }}
                                    />
                                </div>

                                <Text type="secondary" style={{ fontSize: 12 }}>
                                    Select users to add to this group. Group members inherit all group permissions automatically.
                                </Text>
                            </div>

                            <Divider style={{ margin: '20px 0' }} />

                            {/* Members Transfer */}
                            <div>
                                <div style={{ marginBottom: 16 }}>
                                    <Text strong style={{ fontSize: 14 }}>User Assignment</Text>
                                    <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 4 }}>
                                        Assign users to this group for resource access management
                                    </Text>
                                </div>

                                <Form.Item name={['group', 'members']} style={{ margin: 0 }}>
                                    <Transfer
                                        dataSource={dataSource || []}
                                        titles={['Available Users', 'Group Members']}
                                        targetKeys={targetKeys}
                                        onChange={handleChange}
                                        render={item => (
                                            <div style={{ padding: '4px 0' }}>
                                                <div style={{ fontWeight: 500, fontSize: 13 }}>{item.title}</div>
                                                <div style={{ fontSize: 11, color: '#999' }}>{item.description}</div>
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
                                            itemUnit: 'user',
                                            itemsUnit: 'users',
                                            notFoundContent: 'No users found'
                                        }}
                                        style={{
                                            width: '100%'
                                        }}
                                    />
                                </Form.Item>
                            </div>

                            {(targetKeys || []).length > 0 && (
                                <div style={{
                                    marginTop: 16,
                                    padding: '12px 16px',
                                    background: '#e6f7ff',
                                    border: '1px solid #91d5ff',
                                    borderRadius: 6
                                }}>
                                    <Text style={{ fontSize: 12, color: '#1890ff' }}>
                                        <strong>Summary:</strong> {(targetKeys || []).length} user{(targetKeys || []).length !== 1 ? 's' : ''} will be added to this group and inherit group permissions.
                                    </Text>
                                </div>
                            )}
                        </Card>
                    </div>

                    {/* Permissions Section */}
                    <div style={{ marginBottom: 32 }}>
                        <Title level={5} style={{ marginBottom: 20, color: '#1890ff', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <SettingOutlined />
                            Group Permissions
                        </Title>
                        <div style={{ marginBottom: 16 }}>
                            <Text type="secondary" style={{ fontSize: 13 }}>
                                Configure resource permissions that will be inherited by all group members.
                            </Text>
                        </div>
                        <Permissions
                            kind='group'
                            userOrGroupID={group_id || groupname}
                            onPermissionsChange={handlePermissionsChange}
                            form={form}
                        />
                    </div>

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
                            {isCreatePage ? "Create Group" : "Update Group"}
                        </ElchiButton>
                    </div>
                </Form>
            </Card>
        </>
    );
};


export default Group;
