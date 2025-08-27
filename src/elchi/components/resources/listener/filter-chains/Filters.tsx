import React, { useEffect, useState } from 'react';
import type { DragEndEvent } from '@dnd-kit/core';
import type { ColumnsType } from 'antd/es/table';
import { Button, Table } from 'antd';
import { DeleteTwoTone, InboxOutlined } from '@ant-design/icons';
import { useCustomGetQuery } from "@/common/api";
import { TypeConfig } from '@/common/types';
import { useDispatch } from "react-redux";
import { DndContext } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { compareVeriReduxStoreAndFiltersAndfcIndex, memorizeComponent } from '@/hooks/useMemoComponent';
import { SortableContext, verticalListSortingStrategy, } from '@dnd-kit/sortable';
import { handleChangeResources } from '@/redux/dispatcher';
import { ActionType, ResourceType } from '@/redux/reducer-helpers/common';
import { SortableRow } from '../../filters/network/hcm/Helpers';
import { FilterDrawer } from '@/elchi/components/common/filterDrawer';
import { ResourceAction } from '@/redux/reducers/slice';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import { useModels } from '@/hooks/useModels';
import { modtag_filter } from './_modtag_';
import ECard from '@/elchi/components/common/ECard';
import ElchiIconButton from '@/elchi/components/common/ElchiIconButton';
import { handleFilterAdd } from '@/utils/typed-config-helpers';
import { ByteToObj, DecodedTypedConfig } from '@/utils/typed-config-op';
import { getLastDotPart } from '@/utils/tools';


type GeneralProps = {
    veri: {
        version: string;
        keyPrefix: string;
        tagMatchPrefix: string;
        reduxStore: any;
        fcIndex: number;
        fcName: string | undefined;
    }
};

const ComponentFilters: React.FC<GeneralProps> = ({ veri }) => {
    const dispatch = useDispatch();
    const { vModels } = useModels(veri.version, modtag_filter);
    const [state, setState] = useState<DecodedTypedConfig[] | DecodedTypedConfig>()
    const [open, setOpen] = useState(false);
    const { project } = useProjectVariable();
    const [ids, setIds] = useState<string[]>([]);

    const { data: dataQuery } = useCustomGetQuery({
        queryKey: "custom_network_filters",
        enabled: true,
        path: `custom/resource_list?collection=filters&category=envoy.filters.network&version=${veri.version}&project=${project}`
    });

    useEffect(() => {
        const decoded = ByteToObj(veri.reduxStore);
        setState(decoded);

        if (Array.isArray(veri.reduxStore)) {
            const newIds = veri.reduxStore.map((_, index: number) => `item-${index}`);
            setIds(newIds);
        }
    }, [veri.reduxStore]);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over || active.id === over.id || !Array.isArray(veri.reduxStore)) {
            return;
        }

        const oldIndex = parseInt(active.id.toString().replace('item-', ''));
        const newIndex = parseInt(over.id.toString().replace('item-', ''));

        const newFiltersArray = [...veri.reduxStore];

        const [movedItem] = newFiltersArray.splice(oldIndex, 1);
        newFiltersArray.splice(newIndex, 0, movedItem);

        const jsonFilters = newFiltersArray.map((item: any, index: number) => {
            const jsonFilter = vModels.f?.Filter.toJSON(item);

            if (jsonFilter?.typed_config?.value) {
                try {
                    const decodedValue = JSON.parse(atob(jsonFilter.typed_config.value));
                    decodedValue.priority = index;
                    jsonFilter.typed_config.value = btoa(JSON.stringify(decodedValue));
                } catch (error) {
                    console.error("Base64 decode/encode error:", error);
                }
            }

            return jsonFilter;
        });

        handleChangeResources({
            version: veri.version,
            type: ActionType.Update,
            keys: veri.keyPrefix,
            val: jsonFilters,
            resourceType: ResourceType.Resource
        }, dispatch, ResourceAction);

        const newIds = newFiltersArray.map((_, index: number) => `item-${index}`);
        setIds(newIds);
    };

    const handleDeleteAdditional = ({ event, index }: { event?: React.MouseEvent<HTMLElement>, del_url?: string, parent_name: string, index?: number }) => {
        if (event) { event.stopPropagation(); }

        if (index !== undefined) {
            handleChangeResources({
                version: veri.version,
                type: ActionType.Delete,
                keys: `${veri.keyPrefix}.${index}`,
                val: undefined,
                resourceType: ResourceType.Resource
            }, dispatch, ResourceAction);
        }
    };

    const addFilter = (filter: TypeConfig) => {
        handleFilterAdd({
            version: veri.version,
            keyPrefix: veri.keyPrefix,
            selectedItem: filter,
            fcName: veri.fcName,
            dispatch,
        });
    };

    const columns: ColumnsType<any> = [
        {
            key: 'sort',
            width: '3%',
            align: 'center',
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
            render: (_, record) => {
                const gtype = record.gtype;
                return gtype ? getLastDotPart(gtype) : 'Unknown';
            }
        },
        {
            title: 'Delete',
            width: "10%",
            key: 'x',
            render: (_, record) =>
                <Button
                    icon={<DeleteTwoTone twoToneColor="#eb2f96" />}
                    size='small'
                    onClick={(e) => handleDeleteAdditional({ event: e, parent_name: record.parent_name, index: record.tableIndex })}
                    style={{ marginRight: 8 }}
                    iconPosition={"end"}
                />,
        },
    ];

    return (
        <>
            <ECard title={"Filters"}>
                <div style={{
                    background: '#fff',
                    padding: '4px 4px 24px 4px',
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
                            strategy={verticalListSortingStrategy}
                        >
                            <Table
                                components={{
                                    body: {
                                        row: SortableRow,
                                    },
                                }}
                                pagination={false}
                                columns={columns}
                                dataSource={Array.isArray(state) ? (state as DecodedTypedConfig[])?.map((data: DecodedTypedConfig, index: number) => ({
                                    ...data,
                                    tableIndex: index,
                                    name: data.typed_config?.value?.name || 'Unknown',
                                    gtype: data.typed_config?.value?.gtype || data.typed_config?.type_url || 'Unknown',
                                    parent_name: data.name
                                })) : []}
                                rowKey={(record) => `item-${record.tableIndex}`}
                                scroll={{ y: 500 }}
                                locale={{
                                    emptyText: (
                                        <div>
                                            <InboxOutlined style={{ fontSize: 48, marginBottom: 8 }} />
                                            <div>No Filters</div>
                                        </div>
                                    )
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
                extensions={
                    Array.isArray(state)
                        ? state
                            .map(item => item?.typed_config?.value)
                        : []
                }
                addFilter={(filter) => addFilter(filter)}
                title='Network Filters'
                isTypedPerConfig={false}
            />
        </>
    );
};

export default memorizeComponent(ComponentFilters, compareVeriReduxStoreAndFiltersAndfcIndex);
