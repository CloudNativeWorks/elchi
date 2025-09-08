import React, { useState } from "react";
import { Button, Col, Table, Row, Modal, Form, Input, Select, Switch } from 'antd';
import { useDispatch } from "react-redux";
import type { ColumnsType } from 'antd/es/table';
import { ActionType, ResourceType } from "@/redux/reducer-helpers/common";
import { showSuccessNotification, showErrorNotification } from '@/common/notificationHandler';
import { checkIfExists, makeHeaderValue } from "./helpers";
import { FieldComponent } from "@/elchi/components/common/FormItems";
import { handleChangeResources } from "@/redux/dispatcher";
import { FieldTypes } from "@/common/statics/general";
import { DeleteTwoTone, InboxOutlined } from '@ant-design/icons';
import { useTags } from "@/hooks/useTags";
import { modtag_header_value_option } from "./_modtag_";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import ECard from "@/elchi/components/common/ECard";

import ElchiIconButton from "@/elchi/components/common/ElchiIconButton";
import ElchiButton from "@/elchi/components/common/ElchiButton";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
        reduxAction: any;
        title: string;
    }
};

interface State {
    modal: boolean;
    expandedAddress: string[]
}

interface ExpandedRowProps {
    record: any;
    index: number;
    veri: any;
    handleChangeRedux: any;
    actions: any;
}

const renderExpandedRow = (record: any, index: number, veri: any, handleChangeRedux: any, actions: any) => (
    <ExpandedRowComponent
        record={record}
        index={index}
        veri={veri}
        handleChangeRedux={handleChangeRedux}
        actions={actions}
    />
);

const ExpandedRowComponent: React.FC<ExpandedRowProps> = ({ record, index, veri, handleChangeRedux, actions }) => (
    <EForm>
        <Row gutter={[5, 1]}>
            <FieldComponent veri={{
                alwaysShow: true,
                selectedTags: [],
                keyPrefix: `${veri.keyPrefix}.${index}.header`,
                tagPrefix: `${veri.keyPrefix}.header`,
                handleChange: handleChangeRedux,
                tag: "key",
                value: record?.header?.key,
                type: FieldTypes.String,
                placeholder: "(string)",
                spanNum: 12,
            }}
            />
            <FieldComponent veri={{
                alwaysShow: true,
                selectedTags: [],
                keyPrefix: `${veri.keyPrefix}.${index}.header`,
                tagPrefix: `${veri.keyPrefix}.header`,
                handleChange: handleChangeRedux,
                tag: "value",
                value: record?.header?.value,
                type: FieldTypes.String,
                placeholder: "(string)",
                spanNum: 12,
            }}
            />

            <FieldComponent veri={{
                alwaysShow: true,
                selectedTags: [],
                keyPrefix: `${veri.keyPrefix}.${index}`,
                tagPrefix: `${veri.keyPrefix}`,
                handleChange: handleChangeRedux,
                tag: "append_action",
                value: record?.append_action,
                values: actions,
                type: FieldTypes.Select,
                placeholder: "(HeaderAppendAction)",
                spanNum: 12,
            }}
            />
            <FieldComponent veri={{
                alwaysShow: true,
                selectedTags: [],
                keyPrefix: `${veri.keyPrefix}.${index}`,
                tagPrefix: `${veri.keyPrefix}`,
                handleChange: handleChangeRedux,
                tag: "keep_empty_value",
                value: record?.keep_empty_value,
                type: FieldTypes.Boolean,
                spanNum: 12,
            }}
            />
        </Row>
    </EForm>
);

const HeaderToAdd: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_header_value_option);
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [state, setState] = useState<State>({
        modal: false,
        expandedAddress: []
    });

    const handleAdd = (values: any) => {
        if (!values.keep_empty_value) { values.keep_empty_value = false }
        const isEmpty = (obj: object) => Object.values(obj).some(value => value === undefined || value === '');

        if (isEmpty(values)) {
            showErrorNotification("Fill all box!");
            return;
        }

        if (!checkIfExists(veri.reduxStore, values.key)) {
            handleChangeResources({ version: veri.version, type: ActionType.Append, keys: veri.keyPrefix, val: makeHeaderValue(values), resourceType: ResourceType.Resource }, dispatch, veri.reduxAction);
            setState((prevState) => ({ ...prevState, modal: false }));
            showSuccessNotification("Added");
        } else {
            showErrorNotification("Already exists!");
        }
    };

    const handleDelete = (event: React.MouseEvent<HTMLElement>, index: any) => {
        const fullKey = `${veri.keyPrefix}.${index}`

        event.stopPropagation();
        handleChangeResources({ version: veri.version, type: ActionType.Delete, keys: fullKey, resourceType: ResourceType.Resource }, dispatch, veri.reduxAction);
        showSuccessNotification("Removed")
    };

    const handleChangeRedux = (keys: string, val: string | boolean | number) => {
        handleChangeResources({ version: veri.version, type: ActionType.Update, keys, val, resourceType: ResourceType.Resource }, dispatch, veri.reduxAction);
    };

    const columns: ColumnsType<any> = [
        {
            title: 'Key',
            dataIndex: ["header", "key"],
            width: 200,
            key: 'key',
            render: (_, record) => (<div className="custom-ellipsis" title={record?.header?.key}>{record?.header?.key}</div>)
        },
        {
            title: 'Value',
            dataIndex: ["header", "value"],
            width: 200,
            key: 'value',
            render: (_, record) => (<div className="custom-ellipsis" title={record?.header?.value}>{record?.header?.value}</div>)
        },
        {
            title: 'Action',
            dataIndex: '',
            width: 50,
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

    const actions = vTags.hvo?.HeaderValueOption?.filter((item: any) => item.name === "append_action")?.[0]?.enums || [];
    return (
        <>
            <Modal
                title={`Add Header`}
                centered
                open={state.modal}
                onOk={() => form.submit()}
                onCancel={() => setState((prevState) => ({ ...prevState, modal: false }))}
                footer={[
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                        <ElchiButton
                            onlyText={true}
                            key="cancel"
                            onClick={() => setState((prevState) => ({ ...prevState, modal: false }))}
                        >
                            Cancel
                        </ElchiButton>
                        <ElchiButton
                            onlyText={true}
                            key="submit"
                            onClick={() => form.submit()}
                        >
                            OK
                        </ElchiButton>
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
                    <Row gutter={[5, 1]}>
                        <Col span={12}>
                            <Form.Item
                                label="Key"
                                name="key"
                                style={{ display: "inline-block", width: `calc(95% )` }}
                            >
                                <Input
                                    placeholder={"(string)"}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Value"
                                name="value"
                                style={{ display: "inline-block", width: `calc(95% )` }}
                            >
                                <Input
                                    placeholder={"(string)"}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Append Action"
                                name="append_action"
                                style={{ display: "inline-block", width: `calc(95% )` }}
                            >
                                <Select
                                    size="small"
                                    placeholder="HeaderAppendAction"
                                    options={actions?.map(item => ({ value: item, label: item }))}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Keep Empty Value"
                                name="keep_empty_value"
                                style={{ display: "inline-block", width: `calc(95% )` }}
                                valuePropName="checked"
                            >
                                <Switch
                                    checkedChildren="True"
                                    unCheckedChildren="False"
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>

            <ECard title={veri.title}>
                <Col md={24}>
                    <ElchiIconButton
                        style={{ marginBottom: 5 }}
                        onClick={() => setState((prevState) => ({ ...prevState, modal: true }))}
                        disabled={veri.reduxStore?.length >= 10}
                    />
                    <Table
                        size="small"
                        columns={columns}
                        dataSource={Array.isArray(veri.reduxStore)
                            ? veri.reduxStore?.map((record, index) => ({
                                ...record,
                                tableIndex: index
                            }))
                            : []
                        }
                        rowKey={(record) => record.tableIndex}
                        locale={{
                            emptyText: (
                                <div>
                                    <InboxOutlined style={{ fontSize: 48, marginBottom: 8 }} />
                                    <div>No Headers</div>
                                </div>
                            )
                        }}
                        expandable={{
                            expandRowByClick: true,
                            expandedRowRender: (record, index) => renderExpandedRow(record, index, veri, handleChangeRedux, actions),
                            rowExpandable: () => true,
                        }}
                    />
                </Col>
            </ECard>
        </>
    )
};

export default HeaderToAdd;
