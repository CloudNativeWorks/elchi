import React, { useEffect } from 'react';
import { Form, Input, Button, Space, Card, Switch, Typography } from 'antd';

const { TextArea } = Input;

interface BasicInfo {
    name: string;
    description: string;
    scenario_id: string;
    is_global?: boolean;
}

interface BasicInfoStepProps {
    initialValues: BasicInfo;
    onNext: (values: BasicInfo) => void;
    onCancel: () => void;
}

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({
    initialValues,
    onNext,
    onCancel
}) => {
    const [form] = Form.useForm();

    // Update form when initialValues change (for edit mode)
    useEffect(() => {
        form.setFieldsValue(initialValues);
    }, [initialValues, form]);

    const handleFinish = (values: any) => {
        onNext(values);
    };

    return (
        <Card title="Basic Information">
            <Form
                form={form}
                layout="vertical"
                initialValues={initialValues}
                onFinish={handleFinish}
                style={{ maxWidth: '600px' }}
            >
                <Form.Item
                    name="name"
                    label="Scenario Name"
                    rules={[
                        { required: true, message: 'Please enter scenario name' },
                        { min: 3, message: 'Name must be at least 3 characters' },
                        { max: 50, message: 'Name must not exceed 50 characters' }
                    ]}
                >
                    <Input 
                        placeholder="Enter scenario name"
                        size="large"
                    />
                </Form.Item>

                <Form.Item
                    name="description"
                    label="Description"
                    rules={[
                        { required: true, message: 'Please enter scenario description' },
                        { min: 10, message: 'Description must be at least 10 characters' }
                    ]}
                >
                    <TextArea
                        rows={4}
                        placeholder="Describe what this scenario does and its purpose"
                        size="large"
                    />
                </Form.Item>


                <Form.Item
                    name="is_global"
                    valuePropName="checked"
                    help="Global scenarios are available to all projects, while project-specific scenarios are only available within the current project"
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Switch />
                        <Typography.Text>Make available to all projects</Typography.Text>
                    </div>
                </Form.Item>

                <Form.Item style={{ marginTop: '32px' }}>
                    <Space>
                        <Button size="large" onClick={onCancel}>
                            Cancel
                        </Button>
                        <Button type="primary" htmlType="submit" size="large">
                            Next: Configure Resources
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default BasicInfoStep;