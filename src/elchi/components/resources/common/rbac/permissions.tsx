import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Divider, Button, Table, Popconfirm } from "antd";
import { ActionType, ResourceType } from "@/redux/reducer-helpers/common";
import { handleChangeResources } from "@/redux/dispatcher";
import { compareVeriReduxStoreOnly, memorizeComponent } from "@/hooks/useMemoComponent";
import type { ColumnsType } from 'antd/es/table';
import { ResourceAction } from "@/redux/reducers/slice";
import { AddSVG } from "@/assets/svg/icons";
import { DeleteOutlined, InboxOutlined } from '@ant-design/icons';
import ComponentPermission from "./permission";
import ECard from "@/elchi/components/common/ECard";
import { useModels } from "@/hooks/useModels";
import { modtag_rbac_permission } from "./_modtag_";


type GeneralProps = {
    veri: {
        version: string;
        keyPrefix: string;
        reduxStore: any[] | undefined;
    }
};

interface VirtualHostWithIndex {
    tableIndex: number;
    [key: string]: any;
}

const ComponentPermissions: React.FC<GeneralProps> = ({ veri }) => {
    const dispatch = useDispatch();
    const [dataSource, setDataSource] = useState<VirtualHostWithIndex[]>([]);
    const { vModels } = useModels(veri.version, modtag_rbac_permission);

    // Snippet apply fonksiyonu - ECard için uygun format  
    const handleApplySnippet = (keys: string, data: any) => {
        handleChangeResources({
            version: veri.version,
            type: ActionType.Update,
            keys: keys,
            val: data,
            resourceType: ResourceType.Resource
        }, dispatch, ResourceAction);
    };

    useEffect(() => {
        if (Array.isArray(veri.reduxStore)) {
            const updatedData = veri.reduxStore?.map((data: any, index: number) => ({
                ...data,
                tableIndex: index,
            }));
            setDataSource(updatedData);
        }
    }, [veri.reduxStore]);

    const handleDeleteRedux = ({ index, event }: { keys?: string, index?: number, event?: React.MouseEvent<HTMLElement> }) => {
        if (event) { event.stopPropagation(); }
        const fullKey = veri.keyPrefix ? `${veri.keyPrefix}.${index}` : `${index}`;
        handleChangeResources({ version: veri.version, type: ActionType.Delete, keys: fullKey, resourceType: ResourceType.Resource }, dispatch, ResourceAction);
    };

    const addPermission = () => {
        handleChangeResources({
            version: veri.version,
            type: ActionType.Append,
            keys: veri.keyPrefix,
            val: { any: true },
            resourceType: ResourceType.Resource
        }, dispatch, ResourceAction);
    };

    const columns: ColumnsType<VirtualHostWithIndex> = [
        {
            title: 'Name',
            width: "90%",
            key: 'name',
            render: () => { return "Permission" }
        },
        {
            title: 'Delete',
            width: "10%",
            key: 'x',
            render: (_, __, index) =>
                <Popconfirm
                    title="Delete confirmation"
                    description="Are you sure you want to delete this item?"
                    onConfirm={(e) => handleDeleteRedux({ event: e as React.MouseEvent<HTMLElement>, index: index })}
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
                </Popconfirm>,
        },
    ];

    return (
        <ECard
            title={"Permissions"}
            reduxStore={veri.reduxStore}
            ctype="rbac_permissions"
            toJSON={vModels.rperm?.Permission.toJSON}
            onApply={handleApplySnippet}
            keys={veri.keyPrefix}
            version={veri.version}
        >
            <AddSVG onClick={() => addPermission()} />
            <Divider type="horizontal" style={{ marginBottom: 3, marginTop: -1 }} />
            <Table
                size="small"
                scroll={{ y: 950 }}
                pagination={false}
                rowClassName="cursor-row"
                dataSource={dataSource}
                columns={columns}
                rowKey={(record) => `item-${record.tableIndex}`}
                locale={{
                    emptyText: (
                        <div>
                            <InboxOutlined style={{ fontSize: 48, marginBottom: 8 }} />
                            <div>No Permissions</div>
                        </div>
                    )
                }}
                expandable={{
                    fixed: true,
                    expandRowByClick: true,
                    expandedRowRender: (data, index) => expandedRowRenderFunction(data, index, veri)
                }}
            />

        </ECard>
    )
}

memorizeComponent(ComponentPermission, compareVeriReduxStoreOnly);
export default ComponentPermissions;

const expandedRowRenderFunction = (data: any, index: number, veri: any) => {
    return (
        <ComponentPermission
            veri={{
                version: veri.version,
                reduxStore: data,
                keyPrefix: `${veri.keyPrefix}.${index}`,
                title: "Permission",
            }}
        />
    );
};