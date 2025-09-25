import React, { useEffect } from 'react';
import { Button, Form, Input, InputNumber, Select, Typography, Row, Col, Divider, Card } from 'antd';
import { CheckOutlined, CloseOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title } = Typography;

interface AddBGPRouteMapCardProps {
    onCancel: () => void;
    onSave: (values: any) => void; //eslint-disable-line
    initialValues?: any;
    isEditing?: boolean;
    prefixLists?: any[];
    communityLists?: any[];
}

const AddBGPRouteMapCard: React.FC<AddBGPRouteMapCardProps> = ({
    onCancel,
    onSave,
    initialValues,
    isEditing = false,
    prefixLists = [],
    communityLists = []
}) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (initialValues && isEditing) {
            const formValues = {
                ...initialValues,
                match_conditions: initialValues.match_conditions || []
            };

            if (initialValues.set_actions && typeof initialValues.set_actions === 'object') {
                const setActions = initialValues.set_actions;

                if (setActions.set_local_preference !== undefined) {
                    formValues.set_local_preference = Number(setActions.set_local_preference);
                }
                if (setActions.set_metric !== undefined) {
                    formValues.set_metric = Number(setActions.set_metric);
                }
                if (setActions.set_community) {
                    formValues.set_community = setActions.set_community;
                }
                if (setActions.set_nexthop) {
                    formValues.set_next_hop = setActions.set_nexthop;
                }
            }

            form.setFieldsValue(formValues);
        }
    }, [initialValues, isEditing, form]);

    const handleFinish = (values: any) => {
        const formattedValues = {
            ...values,
            match_conditions: values.match_conditions || [],
            set_actions: {
                set_local_preference: values.set_local_preference !== undefined && values.set_local_preference !== null ? Number(values.set_local_preference) : 0,
                set_metric: values.set_metric !== undefined && values.set_metric !== null ? Number(values.set_metric) : 0
            }
        };

        if (values.set_community) {
            formattedValues.set_actions.set_community = values.set_community;
        }
        if (values.set_next_hop) {
            formattedValues.set_actions.set_nexthop = values.set_next_hop;
        }

        onSave(formattedValues);
        if (!isEditing) {
            form.resetFields();
        }
    };

    const getMatchValueOptions = (matchType: string) => {
        switch (matchType) {
            case 'prefix-list':
                return prefixLists.map(pl => ({
                    label: pl.name,
                    value: pl.name
                }));
            case 'community':
                return communityLists.map(cl => ({
                    label: cl.name,
                    value: cl.name
                }));
            default:
                return [];
        }
    };

    const MatchValueSelect: React.FC<{ name: number;[key: string]: any }> = ({ name, ...props }) => {
        const matchType = Form.useWatch(['match_conditions', name, 'match_type'], form);
        const options = getMatchValueOptions(matchType);

        return (
            <Select
                {...props}
                placeholder={
                    matchType === 'prefix-list'
                        ? 'Select prefix list'
                        : matchType === 'community'
                            ? 'Select community list'
                            : 'Select match type first'
                }
                disabled={!matchType}
                options={options}
                showSearch
                filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
            />
        );
    };

    return (
        <div style={{
            width: '100%',
            background: '#fff',
            borderRadius: 14,
            padding: '20px'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 18 }}>
                <Title level={5} style={{ margin: 0 }}>
                    {isEditing ? 'Edit Route Map' : 'Add Route Map'}
                </Title>
            </div>
            <Divider style={{ marginBottom: 20, marginTop: -12 }} />

            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
            >
                <Row gutter={16}>
                    <Col xs={24} sm={12} md={8}>
                        <Form.Item
                            name="name"
                            label="Route Map Name"
                            rules={[
                                { required: true, message: 'Route map name is required' },
                                { pattern: /^[A-Z0-9_-]+$/, message: 'Use uppercase letters, numbers, underscore, hyphen only' }
                            ]}
                        >
                            <Input placeholder="EXPORT_MAP" disabled={isEditing} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Form.Item
                            name="sequence"
                            label="Sequence Number"
                            rules={[
                                { required: true, message: 'Sequence number is required' },
                                { type: 'number', min: 1, max: 65535, message: 'Must be between 1 and 65535' }
                            ]}
                        >
                            <InputNumber
                                style={{ width: '100%' }}
                                placeholder="10"
                                min={1}
                                max={65535}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Form.Item
                            name="action"
                            label="Action"
                            rules={[{ required: true, message: 'Action is required' }]}
                        >
                            <Select placeholder="Select action">
                                <Select.Option value="permit">Permit</Select.Option>
                                <Select.Option value="deny">Deny</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Divider orientation="left">Match Conditions</Divider>

                <Form.List name="match_conditions">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, ...restField }) => (
                                <Card key={key} size="small" style={{ marginBottom: 8 }}>
                                    <Row gutter={16} align="top">
                                        <Col flex="auto">
                                            <Row gutter={16}>
                                                <Col xs={24} sm={12}>
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, 'match_type']}
                                                        label="Match Type"
                                                        rules={[{ required: true, message: 'Match type is required' }]}
                                                    >
                                                        <Select 
                                                            placeholder="Select match type"
                                                            onChange={() => {
                                                                // Reset match_value when match_type changes
                                                                form.setFieldValue(['match_conditions', name, 'match_value'], undefined);
                                                            }}
                                                        >
                                                            <Select.Option value="prefix-list">Prefix List</Select.Option>
                                                            <Select.Option value="community">Community List</Select.Option>
                                                        </Select>
                                                    </Form.Item>
                                                </Col>
                                                <Col xs={24} sm={12}>
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, 'match_value']}
                                                        label="Match Value"
                                                        rules={[{ required: true, message: 'Match value is required' }]}
                                                    >
                                                        <MatchValueSelect name={name} />
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col style={{ paddingTop: 30 }}>
                                            <Button
                                                type="text"
                                                danger
                                                icon={<DeleteOutlined />}
                                                onClick={() => remove(name)}
                                                title="Remove match condition"
                                            />
                                        </Col>
                                    </Row>
                                </Card>
                            ))}
                            <Form.Item>
                                <Button
                                    type="dashed"
                                    onClick={() => add()}
                                    block
                                    icon={<PlusOutlined />}
                                >
                                    Add Match Condition
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>

                <Divider orientation="left">Set Actions</Divider>

                <Row gutter={16}>
                    <Col xs={24} sm={12} md={8}>
                        <Form.Item name="set_local_preference" label="Set Local Preference">
                            <InputNumber
                                style={{ width: '100%' }}
                                placeholder="100"
                                min={0}
                                max={4294967295}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Form.Item name="set_metric" label="Set Metric">
                            <InputNumber
                                style={{ width: '100%' }}
                                placeholder="0"
                                min={0}
                                max={4294967295}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Form.Item name="set_community" label="Set Community">
                            <Input placeholder="65001:100" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col xs={24} sm={12}>
                        <Form.Item name="set_next_hop" label="Set Next Hop">
                            <Input placeholder="192.168.1.1" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Form.Item name="description" label="Description">
                            <Input placeholder="Route map description" />
                        </Form.Item>
                    </Col>
                </Row>

                <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        icon={<CheckOutlined />}
                        style={{
                            background: 'linear-gradient(90deg, #056ccd 0%, #00c6fb 100%)',
                            border: 'none',
                            fontWeight: 500,
                            boxShadow: '0 2px 8px rgba(0,198,251,0.10)',
                        }}
                    >
                        {isEditing ? 'Update Route Map' : 'Add Route Map'}
                    </Button>
                    <Button onClick={onCancel} icon={<CloseOutlined />}>
                        Cancel
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default AddBGPRouteMapCard; 