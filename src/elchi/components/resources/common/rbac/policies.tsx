import React, { useState } from "react";
import { Button, Drawer, Input, Modal, Table, Popconfirm } from 'antd';
import { useDispatch } from "react-redux";
import { ActionType, ResourceType } from "@/redux/reducer-helpers/common";
import { handleChangeResources } from "@/redux/dispatcher";
import { memorizeComponent, compareVeri } from "@/hooks/useMemoComponent";
import { ResourceAction } from "@/redux/reducers/slice";
import { ColumnsType } from "antd/es/table";
import { DeleteOutlined, InboxOutlined } from '@ant-design/icons';
import ComponentPolicy from "./policy";
import ElchiIconButton from "@/elchi/components/common/ElchiIconButton";
import ElchiButton from "@/elchi/components/common/ElchiButton";


type GeneralProps = {
    veri: {
        version: string;
        drawerOpen: boolean;
        drawerClose: any;
        reduxStore: Map<string, any> | undefined;
        keyPrefix: string;
    };
};

interface TableWithIndex {
    tableIndex: number;
    key: string;
    value: any;
}

const CommonComponentPolicies: React.FC<GeneralProps> = ({ veri }) => {
    const dispatch = useDispatch();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [newKey, setNewKey] = useState<string>("");

    const handleDeleteRedux = ({ index, event }: { index?: string, event?: React.MouseEvent<HTMLElement> }) => {
        if (event) { event.stopPropagation(); }

        const fullKey = veri.keyPrefix ? `${veri.keyPrefix}.${index}` : `${index}`;
        handleChangeResources({ version: veri.version, type: ActionType.Delete, keys: fullKey, resourceType: ResourceType.Resource }, dispatch, ResourceAction);
    };

    const addPolicy = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        const keym = newKey || `policy_${(veri.reduxStore ? veri.reduxStore?.size : 0) + 1}`;
        handleChangeResources({
            version: veri.version,
            type: ActionType.Update,
            keys: `${veri.keyPrefix}.${keym}`,
            val: {},
            resourceType: ResourceType.Resource
        }, dispatch, ResourceAction);

        setNewKey("");
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setNewKey("");
    };

    const columns: ColumnsType<TableWithIndex> = [
        {
            title: 'Name',
            width: "87%",
            key: 'name',
            dataIndex: 'key',
        },
        {
            title: 'Delete',
            width: "10%",
            key: 'x',
            render: (record) =>
                <Popconfirm
                    title="Delete confirmation"
                    description="Are you sure you want to delete this item?"
                    onConfirm={(e) => handleDeleteRedux({ event: e as React.MouseEvent<HTMLElement>, index: record.key })}
                    okText="Yes"
                    cancelText="No"
                    placement="left"
                >
                    <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined style={{ color: 'var(--color-danger)' }} />}
                        size='small'
                        className="elchi-delete-button"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'var(--color-danger-light)',
                            border: '1px solid var(--color-danger-border)',
                            borderRadius: '6px'
                        }}
                    />
                </Popconfirm>
        },
    ];

    return (
        <>
            <Drawer
                title="Policies"
                placement="right"
                closable={false}
                onClose={veri.drawerClose}
                open={veri.drawerOpen}
                size='large'
                width={1400}
            >

                <div style={{
                    background: 'var(--card-bg)',
                    padding: '12px 12px 24px 12px',
                    borderRadius: 12,
                    boxShadow: 'var(--shadow-sm)',
                    margin: '4px 0',
                    border: '1px solid var(--border-default)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                        <ElchiIconButton onClick={() => addPolicy()} />
                    </div>
                    <Table
                        size="small"
                        scroll={{ y: 950 }}
                        pagination={false}
                        rowClassName="cursor-row"
                        dataSource={veri.reduxStore instanceof Map ? Array.from(veri.reduxStore?.entries()).map(([key, value], index) => ({ key, value, tableIndex: index })) : []}
                        columns={columns}
                        rowKey={(record) => `item-${record.tableIndex}`}
                        locale={{
                            emptyText: (
                                <div>
                                    <InboxOutlined style={{ fontSize: 48, marginBottom: 8 }} />
                                    <div>No Policies</div>
                                </div>
                            )
                        }}
                        expandable={{
                            fixed: true,
                            expandRowByClick: true,
                            expandedRowRender: (data, index) => expandedRowRenderFunction(data, index, veri)
                        }}
                    />
                </div>
                <ElchiButton onlyText style={{ marginTop: 15 }} onClick={() => veri.drawerClose()}>Close</ElchiButton>
            </Drawer>
            <Modal
                title="Add Policy"
                open={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Add"
                cancelText="Cancel"
            >
                <Input
                    placeholder="Enter policy key"
                    value={newKey}
                    onChange={(e) => setNewKey(e.target.value)}
                />
            </Modal>
        </>
    )
};

export default memorizeComponent(CommonComponentPolicies, compareVeri);

const expandedRowRenderFunction = (data: any, _: number, veri: any) => {
    return <ComponentPolicy key={`policies`} veri={{
        version: veri.version,
        keyPrefix: `${veri.keyPrefix}.${data.key}`,
        reduxStore: data.value,
    }} />
};

