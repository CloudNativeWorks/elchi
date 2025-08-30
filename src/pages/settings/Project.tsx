import React, { useEffect, useState } from 'react';
import { Form, Input, Transfer, message, Card, Typography, Space, Badge, Divider } from 'antd';
import { ProjectOutlined, UserOutlined, ArrowLeftOutlined, CloseOutlined, SaveOutlined, PlusOutlined } from '@ant-design/icons';
import { useCustomGetQuery } from '@/common/api';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCustomApiMutation } from '@/common/custom-api';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import ElchiButton from '@/elchi/components/common/ElchiButton';

const { Title, Text } = Typography;

const Project: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const mutate = useCustomApiMutation();
    const query = new URLSearchParams(location.search);
    const project_id = query.get('project_id');
    const { project } = useProjectVariable();
    const [targetKeys, setTargetKeys] = useState([]);
    const isCreatePage = location.pathname === `/settings/create/project`;
    const [form] = Form.useForm();
    const { /* isLoading: isLoadingResource */ data: dataProject } = useCustomGetQuery({
        queryKey: "project_details",
        enabled: !isCreatePage,
        path: `api/v3/setting/project/${project_id}`,
        directApi: true
    });

    const { data: userList } = useCustomGetQuery({
        queryKey: `userlist_projects${project}`,
        enabled: true,
        path: `api/v3/setting/user_list?project=${project}&isProjectPage=yes`,
        directApi: true
    });

    const onFinish = async (values: any) => {
        let projectName: string;
        if (isCreatePage) {
            projectName = form.getFieldValue(['project', 'projectname'])
            values.project["is_create"] = true
        } else {
            projectName = project_id
            values.project["is_create"] = false
        }

        if (values.project.members) {
            values.project.members = values.project.members.filter(member => member !== null);
        }

        await mutate.mutateAsync({ data: values.project, method: 'put', path: `api/v3/setting/project/${projectName}` }, {
            onSuccess: () => {
                navigate('/settings/projects');
            }
        })
    };

    const goBack = () => {
        navigate(-1);
    };

    useEffect(() => {
        if (dataProject) {
            const validMembers = dataProject.members?.filter(member => member !== null) || [];
            form.setFieldsValue({
                project: {
                    projectname: dataProject.projectname,
                    members: validMembers,
                }
            });
            setTargetKeys(validMembers);
        }
    }, [dataProject, form]);

    const handleChange = (nextTargetKeys: string[]) => {
        const filteredKeys = nextTargetKeys.filter(key => key !== null);
        setTargetKeys(filteredKeys);
        form.setFieldsValue({
            project: {
                ...form.getFieldValue('project'),
                members: filteredKeys
            }
        });
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
                        <ProjectOutlined style={{ color: '#1890ff', fontSize: 24 }} />
                        <Title level={4} style={{ margin: 0 }}>
                            {isCreatePage ? 'Create Project' : 'Project Details'}
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
                        ? 'Create a new project workspace with member management and resource organization.'
                        : 'Manage project settings, members, and workspace configuration.'
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
                            <ProjectOutlined />
                            Project Information
                        </Title>
                        <Form.Item
                            name={['project', 'projectname']}
                            label="Project Name"
                            rules={[{ required: true, message: 'Project name is required!' }]}
                            style={{ maxWidth: 400 }}
                        >
                            <Input
                                prefix={<ProjectOutlined style={{ color: '#bfbfbf' }} />}
                                placeholder="Enter project name"
                                disabled={!isCreatePage}
                                size="large"
                            />
                        </Form.Item>
                    </div>

                    {/* Members Section */}
                    <div style={{ marginBottom: 32 }}>
                        <Title level={5} style={{ marginBottom: 20, color: '#1890ff', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <UserOutlined />
                            Project Members
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
                                        count={`${targetKeys.length}/${(dataSource || []).length}`}
                                        style={{
                                            backgroundColor: targetKeys.length > 0 ? '#52c41a' : '#d9d9d9',
                                            color: targetKeys.length > 0 ? '#fff' : '#666'
                                        }}
                                    />
                                </div>

                                <Text type="secondary" style={{ fontSize: 12 }}>
                                    Select users to grant access to this project workspace and its resources.
                                </Text>
                            </div>

                            <Divider style={{ margin: '20px 0' }} />

                            {/* Members Transfer */}
                            <div>
                                <div style={{ marginBottom: 16 }}>
                                    <Text strong style={{ fontSize: 14 }}>User Assignment</Text>
                                    <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 4 }}>
                                        Assign users to this project for workspace access and collaboration
                                    </Text>
                                </div>

                                <Form.Item name={['project', 'members']} style={{ margin: 0 }}>
                                    <Transfer
                                        dataSource={dataSource || []}
                                        titles={['Available Users', 'Project Members']}
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

                            {targetKeys.length > 0 && (
                                <div style={{
                                    marginTop: 16,
                                    padding: '12px 16px',
                                    background: '#e6f7ff',
                                    border: '1px solid #91d5ff',
                                    borderRadius: 6
                                }}>
                                    <Text style={{ fontSize: 12, color: '#1890ff' }}>
                                        <strong>Summary:</strong> {targetKeys.length} user{targetKeys.length !== 1 ? 's' : ''} will have access to this project workspace.
                                    </Text>
                                </div>
                            )}
                        </Card>
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
                            {isCreatePage ? "Create Project" : "Update Project"}
                        </ElchiButton>
                    </div>
                </Form>
            </Card>
        </>
    );
};


export default Project;
