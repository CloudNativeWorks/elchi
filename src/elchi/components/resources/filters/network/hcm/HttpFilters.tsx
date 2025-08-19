import React, { useState } from "react";
import { Button, Table } from 'antd';
import { useDispatch } from "react-redux";
import { memorizeComponent, compareVeriReduxStoreAndHttpFilter } from "@/hooks/useMemoComponent";
import { ActionType, ResourceType } from "@/redux/reducer-helpers/common";
import { handleChangeResources } from "@/redux/dispatcher";
import type { ColumnsType } from 'antd/es/table';
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { useCustomGetQuery } from "@/common/api";
import { ConfDiscovery, ConfigDiscoveryWithIndex } from "@/common/types";
import { SortableRow } from "./Helpers";
import { HttpFilterConfigDiscovery, ConfigSource } from "@/common/statics/config-source-ads";
import { useDragAndDrop } from "@/hooks/useDragAndDrop";
import { FilterDrawer } from "@/elchi/components/common/filterDrawer";
import { ResourceAction } from "@/redux/reducers/slice";
import { DeleteTwoTone, InboxOutlined } from '@ant-design/icons';
import { useProjectVariable } from "@/hooks/useProjectVariable";
import ComponentHttpFilterChild from "@resources/common/TypedPerFilter/http_filter_child";
import ECard from "@/elchi/components/common/ECard";
import { useModels } from "@/hooks/useModels";
import { modtag_http_filter } from "./_modtag_";
import ElchiIconButton from "@/elchi/components/common/ElchiIconButton";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: ConfDiscovery[];
        httpFilters: any[] | undefined;
        keyPrefix: string;
    }
};

const ComponentHttpFilters: React.FC<GeneralProps> = ({ veri }) => {
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const { vModels } = useModels(veri.version, modtag_http_filter);
    const { project } = useProjectVariable();
    const { ids, setIds, handleDragDrop } = useDragAndDrop(veri.reduxStore?.map((_, index: number) => `item-${index}`) || [], ResourceAction)
    const { data: dataQuery } = useCustomGetQuery({
        queryKey: "custom_http_filters",
        enabled: true,
        path: `custom/http_filter_list?collection=filters&version=${veri.version}&project=${project}&metadata_http_filter=main&category=envoy.filters.http`
    });

    const handleDragEnd = (event: DragEndEvent) => {
        const filters = veri.httpFilters.map((item: any) => vModels.hf?.HttpFilter.toJSON(item));
        handleDragDrop(event, veri.version, veri.keyPrefix, [...(veri.reduxStore || [])], filters)
    };

    const handleDeleteAdditional = ({ event, parent_name }: { event?: React.MouseEvent<HTMLElement>, del_url?: string, parent_name: string }) => {
        if (event) { event.stopPropagation(); }
        handleChangeResources({ version: veri.version, type: ActionType.DeleteConfigDiscovery, keys: veri.keyPrefix, parent_name: parent_name, resourceType: ResourceType.ConfigDiscovery }, dispatch, ResourceAction);
    };

    const addFilter = (filter: ConfDiscovery) => {
        const name = filter.name;
        filter.parent_name = name;

        const tempConfigDiscovery: HttpFilterConfigDiscovery = {
            name: name,
            config_discovery: {
                config_source: ConfigSource,
                type_urls: [filter.gtype]
            },
            is_optional: false,
            disabled: false,
        };

        handleChangeResources({
            version: veri.version,
            type: ActionType.AppendFilter,
            keys: veri.keyPrefix,
            val: tempConfigDiscovery,
            resourceType: ResourceType.Resource,
            extension: filter,
        }, dispatch, ResourceAction);

        setIds([`item-0`, ...ids.map((_, index) => `item-${index + 1}`)]);
    };

    const columns: ColumnsType<ConfigDiscoveryWithIndex> = [
        {
            key: 'sort',
            width: '3%',
        },
        {
            title: 'Name',
            width: "30%",
            key: 'value',
            render: (_, record) => { return record.name }
        },
        {
            title: 'Type',
            width: "57%",
            key: 'gtype',
            render: (_, record) => { return record.gtype }
        },
        {
            title: 'Delete',
            width: "10%",
            key: 'x',
            render: (_, record) =>
                <Button
                    icon={<DeleteTwoTone twoToneColor="#eb2f96" />}
                    size='small'
                    onClick={(e) => handleDeleteAdditional({ event: e, parent_name: record.parent_name })}
                    style={{ marginRight: 8 }}
                    iconPosition={"end"}
                />,
        },
    ];

    return (
        <>
            <ECard title={"Http Filters"}>
                <div style={{
                    background: '#fff',
                    padding: '4px 4px 12px 4px',
                    borderRadius: 12,
                    boxShadow: '0 2px 8px rgba(5,117,230,0.06)',
                    margin: '4px 0'
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
                                pagination={false}
                                columns={columns}
                                dataSource={Array.isArray(veri.reduxStore) ? veri.reduxStore
                                    ?.filter((data: ConfDiscovery) => data.category === 'envoy.filters.http')
                                    ?.map((data: ConfDiscovery, index: number) => ({ ...data, tableIndex: index })) : []}
                                rowKey={(record) => `item-${record.tableIndex}`}
                                scroll={{ y: 500 }}
                                locale={{
                                    emptyText: (
                                        <div>
                                            <InboxOutlined style={{ fontSize: 48, marginBottom: 8 }} />
                                            <div>No Http Filters</div>
                                        </div>
                                    )
                                }}
                                rowClassName={(record) => {
                                    const matchingHttpFilter = veri.httpFilters.find((filter: any) => filter.name === record.name);
                                    if (matchingHttpFilter && matchingHttpFilter.disabled === true) {
                                        return 'row-disabled';
                                    }
                                    return '';
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
                extensions={veri.reduxStore}
                addFilter={addFilter}
                title='HTTP Filters'
                isTypedPerConfig={false}
            />
        </>
    )
};

export default memorizeComponent(ComponentHttpFilters, compareVeriReduxStoreAndHttpFilter);

const expandedRowRender = (data: any, veri: any) => {
    const fIndex = veri.httpFilters.findIndex((filter: any) => filter.name === data.name);
    const matchingHttpFilter = veri.httpFilters[fIndex];

    return (
        <ComponentHttpFilterChild veri={{
            version: veri.version,
            reduxStore: matchingHttpFilter || {},
            keyPrefix: fIndex !== -1 ? `${veri.keyPrefix}.${fIndex}` : `${veri.keyPrefix}`,
            isPerFilter: false,
        }} />
    );
};