import React, { useEffect, useState } from "react";
import { Button, Table, Popconfirm } from 'antd';
import { useDispatch } from "react-redux";
import { memorizeComponent, compareVeriReduxStoreAndHttpFilter } from "@/hooks/useMemoComponent";
import { ActionType, ResourceType } from "@/redux/reducer-helpers/common";
import { handleChangeResources } from "@/redux/dispatcher";
import type { ColumnsType } from 'antd/es/table';
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { useCustomGetQuery } from "@/common/api";
import { removeItemAndReorder, useDragAndDropWithKeys } from "./helper";
import { TypedConfigWithIndex } from "@/common/types";
import { FilterDrawer } from "@/elchi/components/common/filterDrawer";
import { ResourceAction } from "@/redux/reducers/slice";
import { DeleteOutlined, InboxOutlined } from '@ant-design/icons';
import { useProjectVariable } from "@/hooks/useProjectVariable";
import ComponentHttpFilterChild from "./http_filter_child";
import { ByteToObjPer, ObjToBase64Per } from "@/utils/typed-config-op";
import { SortableRow } from "../../vhds/Helpers";
import ECard from "@/elchi/components/common/ECard";
import ElchiIconButton from "@/elchi/components/common/ElchiIconButton";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: Record<string, any> | undefined;
        keyPrefix: string;
    }
};

const CommonComponentTypedPerFilter: React.FC<GeneralProps> = ({ veri }) => {
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const { project } = useProjectVariable();
    const [rState, setRState] = useState<any>()
    const { ids, setIds, handleDragDrop } = useDragAndDropWithKeys(
        rState ? rState.map((value: any) => `${value?.value?.name}-${value?.value?.priority}`) : [],
        ResourceAction
    );

    const { data: dataQuery } = useCustomGetQuery({
        queryKey: "custom_per_http_filters",
        enabled: true,
        path: `custom/http_filter_list?collection=filters&version=${veri.version}&project=${project}&metadata_http_filter=per-route&category=envoy.filters.http`
    });

    const { data: httpFilterMainData } = useCustomGetQuery({
        queryKey: "custom_http_filters",
        enabled: true,
        path: `custom/http_filter_list?collection=filters&version=${veri.version}&project=${project}&metadata_http_filter=main&category=envoy.filters.http`
    });

    useEffect(() => {
        if (veri.reduxStore && veri.reduxStore instanceof Map) {
            const entries = Array.from(veri.reduxStore?.entries());

            // eslint-disable-next-line no-unused-vars
            const updatedState = entries.map(([_, value]) => {
                const decodedTypedConfig = ByteToObjPer(value);
                return {
                    ...decodedTypedConfig
                };
            });

            const sortedState = updatedState.toSorted((a, b) => a.value.priority - b.value.priority);

            setRState(sortedState);
            setIds(sortedState.map((value: any) => `${value?.value?.name}-${value?.value?.priority}`));

        }
    }, [veri.reduxStore]);

    const handleDragEnd = (event: DragEndEvent) => {
        handleDragDrop(event, veri.version, veri.keyPrefix, rState)
    };

    const handleDeleteAdditional = ({ event, name }: { event?: React.MouseEvent<HTMLElement>, del_url?: string, name: string }) => {
        if (event) { event.stopPropagation(); }
        const updatedState = removeItemAndReorder(rState, rState.findIndex(item => item.value.name === name));

        handleChangeResources({
            version: veri.version,
            type: ActionType.Update,
            keys: veri.keyPrefix,
            val: updatedState.reduce((acc, item) => {
                acc[item.value.parent_name] = ObjToBase64Per(item);
                return acc;
            }, {}),
            resourceType: ResourceType.Resource,
        }, dispatch, ResourceAction);
    };

    const handleChangeRedux = (data) => {
        const matchedFilter = dataQuery.find((obj: any) => obj.name === data.name);
        const maxKey = rState && rState.length > 0
            ? Math.max(...rState.map(item => item.value?.priority + 1))
            : 0;


        matchedFilter.priority = maxKey;
        matchedFilter.disabled = false;
        matchedFilter.parent_name = data.parent_name
        if (matchedFilter) {
            const httpFilter = {
                name: matchedFilter.name,
                type_url: matchedFilter.gtype,
                value: matchedFilter,
            };
            handleChangeResources(
                {
                    version: veri.version,
                    type: ActionType.Update,
                    keys: `${veri.keyPrefix}.${matchedFilter.parent_name}`,
                    val: ObjToBase64Per(httpFilter),
                    resourceType: ResourceType.Resource
                },
                dispatch,
                ResourceAction
            );

            setIds([...ids, `${matchedFilter.name}-${matchedFilter.priority}`]);
        } else {
            console.error("Matched access log not found for the given value:", matchedFilter?.name);
        }
    };

    const columns: ColumnsType<TypedConfigWithIndex> = [
        {
            key: 'sort',
            width: '3%',
            sorter: false
        },
        {
            title: 'Name',
            width: "30%",
            key: 'value',
            render: (_, record) => { return record.value.name }
        },
        {
            title: 'Type',
            width: "57%",
            key: 'value',
            render: (_, record) => { return record.value.gtype.replace('envoy.', '') }
        },
        {
            title: 'Delete',
            width: "10%",
            key: 'x',
            render: (_, record) =>
                <Popconfirm
                    title="Delete confirmation"
                    description="Are you sure you want to delete this item?"
                    onConfirm={(e) => handleDeleteAdditional({ event: e as React.MouseEvent<HTMLElement>, name: record.value.name })}
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
        <>
            <ECard title={"Typer Per Filter Config (Http Filter)"}>
                <div style={{
                    background: 'var(--card-bg)',
                    padding: '4px 4px 12px 4px',
                    borderRadius: 12,
                    boxShadow: 'var(--shadow-sm)',
                    margin: '4px 0',
                    border: '1px solid var(--border-default)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                        <ElchiIconButton onClick={() => setOpen(true)} />
                    </div>
                    <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={handleDragEnd}>
                        <SortableContext
                            items={ids}
                            strategy={rectSortingStrategy}
                        >
                            <Table
                                components={{
                                    body: {
                                        row: SortableRow,
                                    },
                                }}
                                showSorterTooltip={false}
                                pagination={false}
                                columns={columns}
                                dataSource={rState}
                                rowKey={(record) => `${record.value.name}-${record.value.priority}`}
                                scroll={{ y: 500 }}
                                rowClassName={(record) => {
                                    if (record.value.disabled === true) {
                                        return 'row-disabled';
                                    }
                                    return '';
                                }}
                                locale={{
                                    emptyText: (
                                        <div>
                                            <InboxOutlined style={{ fontSize: 48, marginBottom: 8 }} />
                                            <div>No Typed Per Filter Config</div>
                                        </div>
                                    )
                                }}
                                expandable={{
                                    fixed: true,
                                    expandRowByClick: true,
                                    expandedRowRender: (data) => expandedRowRender(data, veri)
                                }}
                            />
                        </SortableContext>
                    </DndContext>
                </div>
            </ECard>
            <FilterDrawer
                setOpen={setOpen}
                open={open}
                dataQuery={dataQuery}
                addFilter={handleChangeRedux}
                extensions={rState
                    ? rState.map(key => (key.value))
                    : []
                }
                title='HTTP Filters'
                isTypedPerConfig={true}
                httpFilterMain={httpFilterMainData}
            />
        </>
    )
};

export default memorizeComponent(CommonComponentTypedPerFilter, compareVeriReduxStoreAndHttpFilter);

const expandedRowRender = (data: any, veri: any) => {
    return (
        <ComponentHttpFilterChild veri={{
            version: veri.version,
            reduxStore: data.value,
            keyPrefix: `${veri.keyPrefix}.${data.value.parent_name}`,
            isPerFilter: true,
        }} />
    );
};