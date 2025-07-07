import React, { useEffect, useState } from 'react';
import { Divider, Form, Input, Transfer, message } from 'antd';
import { useCustomGetQuery } from '@/common/api';
import { useLocation, useNavigate } from 'react-router-dom';
import { errorMessage, successMessage } from '@/common/message';
import { AxiosError } from 'axios';
import { useCustomApiMutation } from '@/common/custom-api';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import ElchiButton from '@/elchi/components/common/ElchiButton';


const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 40 },
};

const Project: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const mutate = useCustomApiMutation();
    const query = new URLSearchParams(location.search);
    const project_id = query.get('project_id');
    const { project } = useProjectVariable();
    const [targetKeys, setTargetKeys] = useState([]);
    const [messageApi, contextHolder] = message.useMessage();
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

        try {
            await mutate.mutateAsync({ data: values.project, method: 'put', path: `api/v3/setting/project/${projectName}` }, {
                onSuccess: (data: any) => {
                    successMessage(messageApi, data.message);
                    navigate('/settings/projects');
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

    const handleChange = (nextTargetKeys) => {
        const filteredKeys = nextTargetKeys.filter(key => key !== null);
        setTargetKeys(filteredKeys);
        form.setFieldsValue({
            project: {
                ...form.getFieldValue('project'),
                members: filteredKeys
            }
        });
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
                <Divider type="horizontal" orientation="left" orientationMargin="0">Project Detail</Divider>
                <Form
                    form={form}
                    {...layout}
                    name="nest-messages"
                    onFinish={onFinish}
                    style={{ maxWidth: 900 }}
                >
                    <Form.Item name={['project', 'projectname']} label="Projectname" rules={[{ required: true, message: 'Project name is required!' }]}>
                        <Input disabled={!isCreatePage} />
                    </Form.Item>
                    <Form.Item name={['project', 'members']} label="Members">
                        <Transfer
                            dataSource={dataSource}
                            titles={['Available Users', 'Project Members']}
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


export default Project;
