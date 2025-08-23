import React, { useEffect } from 'react';
import { Drawer, Form, Input, InputNumber, Switch, Button, Space, Divider, Select } from 'antd';
import { BGPNeighborRequest, useBGPOperations } from '@/hooks/useBGPOperations';

interface EditBGPNeighborDrawerProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (values: BGPNeighborRequest) => Promise<void>;
    neighbor?: { peer_ip: string; remote_as: number } | null;
    clientId: string;
}

const EditBGPNeighborDrawer: React.FC<EditBGPNeighborDrawerProps> = ({
    open,
    onClose,
    onSubmit,
    neighbor,
    clientId
}) => {
    const [form] = Form.useForm();
    const { getBGPNeighbor, getBGPPolicyConfig } = useBGPOperations();
    const fetchedRef = React.useRef(false);
    const policyLoadedRef = React.useRef(false);
    const [routeMaps, setRouteMaps] = React.useState<any[]>([]);
    const [prefixLists, setPrefixLists] = React.useState<any[]>([]);

    const loadPolicyConfig = React.useCallback(async () => {
        if (policyLoadedRef.current) return;

        try {
            policyLoadedRef.current = true;
            const result = await getBGPPolicyConfig(clientId);
            if (result.success && result.data) {
                const policyData = result.data[0]?.Result?.Frr?.bgp?.policy_config;
                if (policyData) {
                    const routeMapOptions = (policyData.route_maps || []).map((rm: any) => ({
                        label: rm.name,
                        value: rm.name
                    }));
                    setRouteMaps(routeMapOptions);

                    const prefixListOptions = (policyData.prefix_lists || []).map((pl: any) => ({
                        label: pl.name,
                        value: pl.name
                    }));
                    setPrefixLists(prefixListOptions);
                }
            }
        } catch (error) {
            console.error('Failed to load policy config:', error);
            policyLoadedRef.current = false;
        }
    }, [clientId]);

    useEffect(() => {
        if (open && !policyLoadedRef.current) {
            loadPolicyConfig();
        }
        if (!open) {
            policyLoadedRef.current = false;
        }
    }, [open, loadPolicyConfig]);

    useEffect(() => {
        if (!open) {
            fetchedRef.current = false;
            return;
        }

        if (neighbor?.peer_ip && neighbor?.remote_as && !fetchedRef.current) {
            fetchedRef.current = true;
            getBGPNeighbor(clientId, neighbor.remote_as, neighbor.peer_ip)
                .then(result => {
                    if (result.success && result.data) {
                        const neighborData = result.data[0]?.Result?.Frr?.bgp?.neighbor;
                        if (neighborData) {
                            const formData = {
                                ...neighborData,
                                timers: {
                                    keepalive: neighborData.timers?.keepalive || 60,
                                    holdtime: neighborData.timers?.holdtime || 180
                                },
                                route_map_in: neighborData.route_maps?.route_map_in || [],
                                route_map_out: neighborData.route_maps?.route_map_out || [],
                                prefix_list_in: neighborData.prefix_lists?.prefix_list_in || [],
                                prefix_list_out: neighborData.prefix_lists?.prefix_list_out || []
                            };

                            form.setFieldsValue(formData);
                        }
                    }
                })
                .catch(error => {
                    console.error('Failed to fetch neighbor details:', error);
                });
        }
    }, [neighbor, open]);

    const handleClose = () => {
        form.resetFields();
        fetchedRef.current = false;
        onClose();
    };

    const handleSubmit = async (values: any) => {
        const formattedValues = {
            ...values,
            timers: {
                keepalive: values.timers?.keepalive || 60,
                holdtime: values.timers?.holdtime || 180
            },
            route_maps: {
                ...(Array.isArray(values.route_map_in) && values.route_map_in.length > 0 && {
                    route_map_in: values.route_map_in
                }),
                ...(Array.isArray(values.route_map_out) && values.route_map_out.length > 0 && {
                    route_map_out: values.route_map_out
                })
            },
            prefix_lists: {
                ...(Array.isArray(values.prefix_list_in) && values.prefix_list_in.length > 0 && {
                    prefix_list_in: values.prefix_list_in
                }),
                ...(Array.isArray(values.prefix_list_out) && values.prefix_list_out.length > 0 && {
                    prefix_list_out: values.prefix_list_out
                })
            }
        };

        delete formattedValues.route_map_in;
        delete formattedValues.route_map_out;
        delete formattedValues.prefix_list_in;
        delete formattedValues.prefix_list_out;

        await onSubmit(formattedValues);
    };

    return (
        <Drawer
            title={neighbor ? "Edit BGP Neighbor" : "Add BGP Neighbor"}
            placement="right"
            width={600}
            onClose={handleClose}
            open={open}
            extra={
                <Space>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="primary" onClick={() => form.submit()}>
                        {neighbor ? 'Save Changes' : 'Add Neighbor'}
                    </Button>
                </Space>
            }
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                preserve={false}
                initialValues={{
                    timers: {
                        keepalive: 60,
                        holdtime: 180
                    }
                }}
            >
                <Divider>Basic Configuration</Divider>

                <Form.Item
                    name="peer_ip"
                    label="Neighbor Address"
                    rules={[
                        { required: true, message: 'Please enter neighbor IP address' },
                        { pattern: /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/, message: 'Please enter a valid IP address' }
                    ]}
                >
                    <Input disabled={!!neighbor} placeholder="192.168.1.1" />
                </Form.Item>

                <Form.Item
                    name="remote_as"
                    label="Remote AS"
                    rules={[
                        { required: true, message: 'Please enter remote AS number' },
                        { type: 'number', min: 1, max: 4294967295 }
                    ]}
                >
                    <InputNumber style={{ width: '100%' }} placeholder="65000" />
                </Form.Item>

                <Form.Item
                    name="description"
                    label="Description"
                >
                    <Input placeholder="Neighbor description" />
                </Form.Item>

                <Form.Item
                    name="password"
                    label="Password (MD5)"
                >
                    <Input.Password
                        placeholder="MD5 authentication password"
                        autoComplete="new-password"
                        autoCorrect="off"
                        autoCapitalize="off"
                    />
                </Form.Item>

                <Form.Item
                    name="update_source"
                    label="Update Source"
                >
                    <Input placeholder="Interface or IP address" />
                </Form.Item>

                <Form.Item
                    name="shutdown"
                    valuePropName="checked"
                    label="Shutdown"
                >
                    <Switch />
                </Form.Item>

                <Divider>Address Family IPv4 Unicast</Divider>

                <Form.Item
                    name="next_hop_self"
                    valuePropName="checked"
                    label="Next Hop Self"
                >
                    <Switch />
                </Form.Item>

                <Form.Item
                    name="soft_reconfiguration"
                    valuePropName="checked"
                    label="Soft Reconfiguration"
                >
                    <Switch />
                </Form.Item>

                <Form.Item
                    name="maximum_prefix"
                    label="Maximum Prefix Limit (In)"
                    rules={[{ type: 'number', min: 1 }]}
                >
                    <InputNumber style={{ width: '100%' }} placeholder="5000" />
                </Form.Item>

                <Form.Item
                    name="maximum_prefix_out"
                    label="Maximum Prefix Limit (Out)"
                    rules={[{ type: 'number', min: 1 }]}
                >
                    <InputNumber style={{ width: '100%' }} placeholder="5000" />
                </Form.Item>

                <Divider>Route Maps</Divider>

                <Form.Item
                    name="route_map_in"
                    label="Route Map In"
                >
                    <Select
                        mode="multiple"
                        style={{ width: '100%' }}
                        placeholder="Select route maps"
                        options={routeMaps}
                        allowClear
                        showSearch
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                    />
                </Form.Item>

                <Form.Item
                    name="route_map_out"
                    label="Route Map Out"
                >
                    <Select
                        mode="multiple"
                        style={{ width: '100%' }}
                        placeholder="Select route maps"
                        options={routeMaps}
                        allowClear
                        showSearch
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                    />
                </Form.Item>

                <Divider>Prefix Lists</Divider>

                <Form.Item
                    name="prefix_list_in"
                    label="Prefix List In"
                >
                    <Select
                        mode="multiple"
                        style={{ width: '100%' }}
                        placeholder="Select prefix lists"
                        options={prefixLists}
                        allowClear
                        showSearch
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                    />
                </Form.Item>

                <Form.Item
                    name="prefix_list_out"
                    label="Prefix List Out"
                >
                    <Select
                        mode="multiple"
                        style={{ width: '100%' }}
                        placeholder="Select prefix lists"
                        options={prefixLists}
                        allowClear
                        showSearch
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                    />
                </Form.Item>

                <Divider>Timers</Divider>

                <Form.Item
                    name={['timers', 'keepalive']}
                    label="Keepalive Interval (seconds)"
                    rules={[{ type: 'number', min: 1, max: 65535 }]}
                >
                    <InputNumber style={{ width: '100%' }} placeholder="60" />
                </Form.Item>

                <Form.Item
                    name={['timers', 'holdtime']}
                    label="Hold Time (seconds)"
                    rules={[{ type: 'number', min: 3, max: 65535 }]}
                >
                    <InputNumber style={{ width: '100%' }} placeholder="180" />
                </Form.Item>

                <Divider>Advanced Settings</Divider>

                <Form.Item
                    name="allowas_in"
                    label="Allow AS In"
                    rules={[{ type: 'number', min: 1, max: 10 }]}
                >
                    <InputNumber 
                        style={{ width: '100%' }} 
                        placeholder="1"
                        min={1}
                        max={10}
                    />
                </Form.Item>

                <Form.Item
                    name="weight"
                    label="Weight"
                    rules={[{ type: 'number', min: 0, max: 65535 }]}
                >
                    <InputNumber 
                        style={{ width: '100%' }} 
                        placeholder="32768"
                        min={0}
                        max={65535}
                    />
                </Form.Item>

                <Form.Item
                    name="disable_connected_check"
                    valuePropName="checked"
                    label="Disable Connected Check"
                >
                    <Switch />
                </Form.Item>

                <Divider>eBGP Settings</Divider>

                <Form.Item
                    name="ebgp_multihop"
                    valuePropName="checked"
                    label="EBGP Multihop"
                >
                    <Switch />
                </Form.Item>

                <Form.Item
                    name="ebgp_multihop_ttl"
                    label="EBGP Multihop TTL"
                    rules={[{ type: 'number', min: 1, max: 255 }]}
                >
                    <InputNumber style={{ width: '100%' }} placeholder="1" />
                </Form.Item>

                <Divider orientation="left" orientationMargin={0}>Graceful Restart</Divider>

                <Form.Item
                    name="graceful_restart"
                    label="Enable Graceful Restart"
                    valuePropName="checked"
                    extra="Enable graceful restart for this neighbor"
                >
                    <Switch onChange={(checked) => {
                        if (checked) {
                            form.setFieldValue('graceful_restart_helper', false);
                            form.setFieldValue('graceful_restart_disable', false);
                        }
                    }} />
                </Form.Item>

                <Form.Item
                    name="graceful_restart_helper"
                    label="Graceful Restart Helper Mode"
                    valuePropName="checked"
                    extra="Act only as GR helper (receive-only mode)"
                >
                    <Switch onChange={(checked) => {
                        if (checked) {
                            form.setFieldValue('graceful_restart', false);
                            form.setFieldValue('graceful_restart_disable', false);
                        }
                    }} />
                </Form.Item>

                <Form.Item
                    name="graceful_restart_disable"
                    label="Disable Graceful Restart"
                    valuePropName="checked"
                    extra="Completely disable GR for this neighbor"
                >
                    <Switch onChange={(checked) => {
                        if (checked) {
                            form.setFieldValue('graceful_restart', false);
                            form.setFieldValue('graceful_restart_helper', false);
                        }
                    }} />
                </Form.Item>

            </Form>
        </Drawer>
    );
};

export default EditBGPNeighborDrawer; 