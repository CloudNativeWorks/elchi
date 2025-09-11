import React, { useState } from "react";
import { Col, Row, message, Form, Drawer, Button, Modal, InputNumber, Select, Input, Table, Space } from "antd";
import { getIPAddresses } from "@/utils/ip-addresses";
import { checkIfExists, makeInitialEndpoints } from "./helpers";
import { navigateCases } from "@/elchi/helpers/navigate-cases";
import { ActionType, ResourceType } from "@/redux/reducer-helpers/common";
import { useDispatch } from "react-redux";
import type { ColumnsType } from 'antd/es/table';
import { handleChangeResources } from "@/redux/dispatcher";
import { memorizeComponent, compareVeri } from "@/hooks/useMemoComponent";
import { ResourceAction } from "@/redux/reducers/slice";
import { DeleteTwoTone, InboxOutlined } from '@ant-design/icons';
import ComponentLBEndpoint from "./lb_endpoint";
import ElchiButton from "@/elchi/components/common/ElchiButton";
import { showErrorNotification, showWarningNotification, showSuccessNotification } from '@/common/notificationHandler';


type GeneralProps = {
    veri: {
        version: string;
        keyPrefix: string;
        drawerOpen: boolean;
        reduxStore: any;
        tagMatchPrefix: string;
        drawerClose: () => void;
    }
};

interface State {
    modal: boolean;
    modal_bulk: boolean;
}

interface LbEndpointWithIndex {
    tableIndex: number;
}

const LBEndpointsComponent: React.FC<GeneralProps> = ({ veri }) => {
    const [form] = Form.useForm();
    const [form_bulk] = Form.useForm();
    const dispatch = useDispatch();
    const [state, setState] = useState<State>({
        modal: false,
        modal_bulk: false,
    });

    const columns: ColumnsType<LbEndpointWithIndex> = [
        {
            title: 'Address',
            width: "40%",
            key: 'address',
            dataIndex: ['host_identifier', 'endpoint', 'address', 'address', 'socket_address', 'address'],
            render: (_, record) => { return navigateCases(record, "host_identifier.endpoint.address.address.socket_address.address") }
        },
        {
            title: 'Port',
            width: "20%",
            key: 'port_value',
            dataIndex: ["host_identifier", "endpoint", "address", "address", "socket_address", "port_specifier", "port_value"],
            render: (_, record) => { return navigateCases(record, "host_identifier.endpoint.address.address.socket_address.port_specifier.port_value") }
        },
        {
            title: 'Protocol',
            width: "20%",
            key: 'protocol',
            dataIndex: ["host_identifier", "endpoint", "address", "address", "socket_address", "protocol"],
            render: (_, record) => { return navigateCases(record, "host_identifier.endpoint.address.address.socket_address.protocol") }
        },
        {
            title: 'Action',
            width: "20%",
            key: 'x',
            render: (_, __, index) =>
                <Button
                    icon={<DeleteTwoTone twoToneColor="#eb2f96" />}
                    size='small'
                    onClick={(e) => handleDelete(e, index)}
                    style={{ marginRight: 8 }}
                    iconPosition={"end"}
                />,
        },
    ];

    const handleDelete = (event: React.MouseEvent<HTMLElement>, index: any) => {
        const fullKey = `${veri.keyPrefix}.${index}`

        event.stopPropagation();
        handleChangeResources({ version: veri.version, type: ActionType.Delete, keys: fullKey, resourceType: ResourceType.Resource }, dispatch, ResourceAction);
        showSuccessNotification("Removed")
    };

    const handleAdd = (values: any) => {
        let fail = false;
        const isEmpty = (obj: object) => Object.values(obj).some(value => value === undefined || value === '');

        if (isEmpty(values)) {
            showErrorNotification("Fill all box!");
            return;
        }

        if (values.address) {
            if (!checkIfExists(veri.reduxStore, values.address, values.port_value)) {
                handleChangeResources({ keys: `${veri.keyPrefix}`, version: veri.version, type: ActionType.Append, val: makeInitialEndpoints(values), resourceType: ResourceType.Resource }, dispatch, ResourceAction);
                setState((prevState) => ({ ...prevState, modal: false }));
                showSuccessNotification("Added");
            } else {
                showErrorNotification("Already exists!");
            }
        }

        if (values.bulkAddress) {
            const addresses = getIPAddresses(values.bulkAddress)
            if (Array.isArray(addresses)) {
                addresses.forEach((ip) => {
                    if (!checkIfExists(veri.reduxStore, ip, values.port_value)) {
                        const address = { address: ip, port_value: values.port_value, protocol: values.protocol }
                        handleChangeResources({ keys: `${veri.keyPrefix}`, version: veri.version, type: ActionType.Append, val: makeInitialEndpoints(address), resourceType: ResourceType.Resource }, dispatch, ResourceAction);
                    } else { fail = true }
                });

                if (fail) {
                    showWarningNotification("Some addresses were already on the list!");
                }

                setState((prevState) => ({ ...prevState, modal_bulk: false }));
                showSuccessNotification("Added");
            } else {
                showErrorNotification(addresses);
            }
        }
    };

    return (
        <>
            <Modal
                title="Add Endpoint"
                centered
                open={state.modal}
                onOk={() => form.submit()}
                onCancel={() => setState((prevState) => ({ ...prevState, modal: false }))}
                footer={[
                    <div key="footer-buttons" style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                        <ElchiButton onlyText onClick={() => setState((prevState) => ({ ...prevState, modal: false }))}>Cancel</ElchiButton>
                        <ElchiButton onlyText onClick={() => form.submit()}>OK</ElchiButton>
                    </div>
                ]}
            >
                <Form
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    layout="vertical"
                    size="small"
                    style={{ maxWidth: "100%" }}
                    onFinish={handleAdd}
                    form={form}
                >
                    <Form.Item
                        label="address"
                        name="address"
                        style={{ display: "inline-block", width: `calc(46% )`, margin: 2 }}
                    >
                        <Input
                            placeholder={"192.168.1.1 or x.d.com"}
                        />
                    </Form.Item>
                    <Form.Item
                        label="port_value"
                        name="port_value"
                        style={{ display: "inline-block", width: `calc(46% )`, margin: 2 }}
                    >
                        <InputNumber
                            min={0}
                            max={65535}
                            type="number"
                            style={{ width: "100%" }}
                            placeholder="80"
                        />
                    </Form.Item>
                    <Form.Item
                        label="protocol"
                        name="protocol"
                        style={{ display: "inline-block", width: `calc(46% )`, margin: 2 }}
                    >
                        <Select
                            size="small"
                            placeholder="TCP | UDP"
                            options={[{ value: "TCP", label: "TCP" }, { value: "UDP", label: "UDP" }]}
                        />
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title="Add Bulk Endpoints"
                centered
                open={state.modal_bulk}
                onOk={() => form_bulk.submit()}
                onCancel={() => setState((prevState) => ({ ...prevState, modal_bulk: false }))}
                footer={[
                    <div key="footer-bulk-buttons" style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                        <ElchiButton onlyText onClick={() => setState((prevState) => ({ ...prevState, modal_bulk: false }))}>Cancel</ElchiButton>
                        <ElchiButton onlyText onClick={() => form_bulk.submit()}>OK</ElchiButton>
                    </div>
                ]}
            >
                <Form
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    layout="vertical"
                    size="small"
                    style={{ maxWidth: "100%" }}
                    onFinish={handleAdd}
                    form={form_bulk}
                >
                    <Form.Item
                        label="addresses"
                        name="bulkAddress"
                        style={{ display: "inline-block", width: `calc(100% )` }}
                    >
                        <Input.TextArea
                            rows={4}
                            placeholder={"eg: 192.168.1.0/24, 192.168.55.0-192.168.55.10, 192.168.1.100 or example.domain.com"}
                        />
                    </Form.Item>
                    <Form.Item
                        label="port_value"
                        name="port_value"
                        style={{ display: "inline-block", width: `calc(46% )`, margin: 2 }}
                    >
                        <InputNumber
                            min={0}
                            max={65535}
                            type="number"
                            style={{ width: "100%" }}
                            placeholder="80"
                        />
                    </Form.Item>
                    <Form.Item
                        label="protocol"
                        name="protocol"
                        style={{ display: "inline-block", width: `calc(46% )`, margin: 2 }}
                    >
                        <Select
                            size="small"
                            placeholder="TCP | UDP"
                            options={[{ value: "TCP", label: "TCP" }, { value: "UDP", label: "UDP" }]}
                        />
                    </Form.Item>
                </Form>
            </Modal>
            <Drawer
                title={`LB Endpoints`}
                placement="right"
                closable={false}
                width={"60%"}
                open={veri.drawerOpen}
                onClose={veri.drawerClose}
                size='large'
            >
                <Row>
                    <div style={{
                        background: '#fff',
                        padding: '12px 12px 24px 12px',
                        borderRadius: 12,
                        boxShadow: '0 2px 8px rgba(5,117,230,0.06)',
                        margin: '4px 0'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                            <ElchiButton onClick={() => setState((prevState) => ({ ...prevState, modal: true }))} onlyText>Add Endpoint</ElchiButton>
                            <ElchiButton style={{ marginLeft: 10 }} onClick={() => setState((prevState) => ({ ...prevState, modal_bulk: true }))} onlyText>Add Bulk Endpoints</ElchiButton>
                        </div>
                        <Table
                            size="small"
                            scroll={{ y: "auto" }}
                            pagination={{ pageSize: 50 }}
                            rowClassName="cursor-row"
                            dataSource={Array.isArray(veri.reduxStore)
                                ? veri.reduxStore?.map((record, index) => ({
                                    ...record,
                                    tableIndex: index
                                }))
                                : []
                            }
                            columns={columns}
                            rowKey={(record) => record.tableIndex}
                            locale={{
                                emptyText: (
                                    <div>
                                        <InboxOutlined style={{ fontSize: 48, marginBottom: 8 }} />
                                        <div>No Endpoints</div>
                                    </div>
                                )
                            }}
                            expandable={{
                                expandRowByClick: true,
                                rowExpandable: () => true,
                                expandedRowRender: (record, index) => (
                                    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                                        <Row>
                                            <Col md={24}>
                                                <ComponentLBEndpoint veri={{
                                                    version: veri.version,
                                                    keyPrefix: `${veri.keyPrefix}.${index}`,
                                                    reduxStore: record,
                                                }} />
                                            </Col>
                                        </Row>
                                    </Space>
                                ),
                            }}
                        />
                    </div>
                </Row>
                <ElchiButton onlyText style={{ marginTop: 15 }} onClick={() => veri.drawerClose()}>Close</ElchiButton>
            </Drawer>
        </>
    );
}
export default memorizeComponent(LBEndpointsComponent, compareVeri);

