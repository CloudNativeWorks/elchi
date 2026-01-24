import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Col, Row, Divider, Button, Table, Popconfirm } from "antd";
import { HeadOfResource } from "@/elchi/components/common/HeadOfResources";
import { ActionType, ResourceType } from "@/redux/reducer-helpers/common";
import { handleChangeResources } from "@/redux/dispatcher";
import { headerOptionFields } from "@/common/statics/general";
import { FieldConfigType, matchesEndOrStartOf } from "@/utils/tools";
import { compareVeriReduxStoreOnly, memorizeComponent } from "@/hooks/useMemoComponent";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { moveArrayItemToNewPosition, SortableRow } from "./Helpers";
import type { ColumnsType } from 'antd/es/table';
import { ResourceAction } from "@/redux/reducers/slice";
import { DeleteOutlined, InboxOutlined } from '@ant-design/icons';
import { toJSON } from "@/elchi/helpers/to-json";
import { GTypeFieldsBase } from "@/common/statics/gtypes";
import { useModels } from "@/hooks/useModels";
import { modtag_r_virtualhost, modtag_us_virtualhost, modtag_virtual_host } from "./_modtag_";
import { generateFields } from "@/common/generate-fields";
import { useTags } from "@/hooks/useTags";
import CustomAnchor from "@/elchi/components/common/CustomAnchor";
import CommonComponentName from '../common/Name/Name';
import Domains from './Domains';
import ComponentVirtualClusters from './VirtualClusters'
import CommonComponentSingleOptions from '../common/SingleOptions/SingleOptions';
import CommonComponentHeaderOptions from "../common/HeaderOptions/HeaderOptions";
import ComponentHedgePolicy from './HedgePolicy'
import CommonComponentRetryPolicy from '../common/RetryPolicy/RetryPolicy'
import CommonComponentRequestMirrorPolicy from '../common/RequestMirrorPolicy/RequestMirrorPolicy'
import VhdsRouteComponent from './Routes';
import CommonComponentTypedPerFilter from '@resources/common/TypedPerFilter/typed_per_filter';
import useResourceForm from "@/hooks/useResourceForm";
import { ConditionalComponent } from "../../common/ConditionalComponent";
import ElchiIconButton from "../../common/ElchiIconButton";
import { GTypes } from "@/common/statics/gtypes"

type GeneralProps = {
    veri: {
        version: string;
        keyPrefix: string;
        queryResource: any;
        generalName: string;
        changeGeneralName: any;
        reduxStore: any[] | undefined;
        isMainComponent: boolean;
        GType: GTypeFieldsBase;
    }
};

type GeneralPropsChild = {
    veri: {
        version: string;
        queryResource: any;
        generalName: string;
        reduxStore: any;
        keyPrefix: string;
    }
};

interface VirtualHostWithIndex {
    tableIndex: number;
    [key: string]: any;
}

const VirtualHostComponent: React.FC<GeneralProps> = ({ veri }) => {
    const location = useLocation();
    const dispatch = useDispatch();
    const [ids, setIds] = useState<string[]>([]);
    const { vModels } = useModels(veri.version, modtag_virtual_host);

    useEffect(() => {
        if (veri.reduxStore) { setIds(veri.reduxStore?.map((_: any, index: number) => `item-${index}`)); }
    }, [veri.reduxStore]);

    const handleDeleteRedux = ({ index, event }: { keys?: string, index?: number, event?: React.MouseEvent<HTMLElement> }) => {
        if (event) { event.stopPropagation(); }
        const fullKey = veri.keyPrefix ? `${veri.keyPrefix}.${index}` : `${index}`;
        handleChangeResources({ version: veri.version, type: ActionType.Delete, keys: fullKey, resourceType: ResourceType.Resource }, dispatch, ResourceAction);
    };

    const handleChangeRedux = (keys: string, val: any) => {
        handleChangeResources({ version: veri.version, type: ActionType.Update, keys, val, resourceType: ResourceType.Resource }, dispatch, ResourceAction);
    };

    const addVhds = () => {
        handleChangeResources({
            version: veri.version,
            type: ActionType.Append,
            keys: veri.keyPrefix,
            val: { name: `newVirtualHost${(veri.reduxStore?.length || 0) + 1}` },
            resourceType: ResourceType.Resource
        }, dispatch, ResourceAction);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { over, active } = event;
        if (over && typeof active.id === "string" && typeof over.id === "string") {
            const oldIndex = parseInt(active.id.replace('item-', ''), 10);
            const newIndex = parseInt(over.id.replace('item-', ''), 10);

            if (oldIndex !== newIndex) {
                const updatedItems = moveArrayItemToNewPosition([...(veri.reduxStore || [])], oldIndex, newIndex);
                handleChangeRedux(`${veri.keyPrefix}`, toJSON({ resourceType: vModels.vh?.VirtualHost, resource: updatedItems }));
                setIds(updatedItems.map((_, index) => `item-${index}`));
            }
        }
    };

    const columns: ColumnsType<VirtualHostWithIndex> = [
        {
            key: 'sort',
            width: '3%',
        },
        {
            title: 'Name',
            width: "27%",
            key: 'name',
            dataIndex: ['host_identifier', 'endpoint', 'address', 'address', 'socket_address', 'address'],
            render: (_, record) => { return record.name }
        },
        {
            title: 'Domains',
            width: "60%",
            key: 'action',
            dataIndex: ["host_identifier", "endpoint", "address", "address", "socket_address", "port_specifier", "port_value"],
            render: (_, record) => { return record?.domains?.join(", ") }
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
        <>
            {veri.isMainComponent &&
                <>
                    <HeadOfResource
                        generalName={veri.generalName}
                        version={veri.version}
                        changeGeneralName={veri.changeGeneralName}
                        locationCheck={location.pathname === veri.GType.createPath}
                        createUpdate={{
                            location_path: location.pathname,
                            GType: veri.GType,
                            offset: 0,
                            name: veri.generalName,
                            reduxStore: veri.reduxStore,
                            voidToJSON: vModels.vh?.VirtualHost.toJSON,
                            queryResource: veri.queryResource,
                            envoyVersion: veri.version,
                            gtype: GTypes.VirtualHost,
                        }}
                    />
                    <Divider type="horizontal" orientation="left" orientationMargin="0">HTTP Route Components</Divider>
                </>
            }
            <div style={{
                background: 'var(--card-bg)',
                padding: '12px 12px 24px 12px',
                borderRadius: 12,
                boxShadow: 'var(--shadow-sm)',
                margin: '4px 0',
                border: '1px solid var(--border-default)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                    <ElchiIconButton onClick={() => addVhds()} />
                </div>
                <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={handleDragEnd}>
                    <SortableContext items={ids} strategy={rectSortingStrategy}>
                        <Table
                            components={{ body: { row: SortableRow } }}
                            size="small"
                            scroll={{ y: 950 }}
                            pagination={false}
                            rowClassName="cursor-row"
                            dataSource={Array.isArray(veri.reduxStore) ? veri.reduxStore?.map((data: any, index: number) => ({ ...data, tableIndex: index })) : []}
                            columns={columns}
                            rowKey={(record) => `item-${record.tableIndex}`}
                            locale={{
                                emptyText: (
                                    <div>
                                        <InboxOutlined style={{ fontSize: 48, marginBottom: 8 }} />
                                        <div>No Virtual Hosts</div>
                                    </div>
                                )
                            }}
                            expandable={{
                                rowExpandable: () => true,
                                expandRowByClick: true,
                                expandedRowRender: (data, index) => expandedRowRenderFunction(data, index, veri)
                            }}
                        />
                    </SortableContext>
                </DndContext>
            </div>
        </>
    )
}

const VirtualHostComponentChild: React.FC<GeneralPropsChild> = ({ veri }) => {
    const { vModels } = useModels(veri.version, modtag_virtual_host);
    const { vTags } = useTags(veri.version, modtag_virtual_host);
    const { selectedTags, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.vh?.VirtualHost,
            sf: vTags.vh?.VirtualHost_SingleFields,
            e: ['name', 'domains', 'request_headers_to_remove', 'response_headers_to_remove']
        }),
    ]

    return (
        <Row>
            <Col md={4} style={{ display: "block", maxHeight: "auto", overflowY: "auto" }}>
                <CustomAnchor
                    resourceConfKeys={vTags.vh?.VirtualHost}
                    unsuportedTags={modtag_us_virtualhost['VirtualHost']}
                    singleOptionKeys={vTags.vh?.VirtualHost_SingleFields.filter((field: string) => !["domains", "name", "request_headers_to_remove", "response_headers_to_remove"].includes(field))}
                    headerOptionKeys={headerOptionFields}
                    selectedTags={selectedTags}
                    keyPrefix={veri.keyPrefix}
                    index={Number(veri.keyPrefix)}
                    handleChangeTag={handleChangeTag}
                    tagMatchPrefix={"VirtualHost"}
                    required={modtag_r_virtualhost['VirtualHost']}
                    unchangeableTags={["name"]}
                />
            </Col>
            <Col md={20}>
                <ConditionalComponent
                    shouldRender={selectedTags?.includes("name")}
                    Component={CommonComponentName}
                    componentProps={{
                        version: veri.version,
                        title: "name",
                        keyPrefix: `${veri.keyPrefix}`,
                        reduxAction: ResourceAction,
                        reduxStore: veri.reduxStore?.name,
                        id: `name_${veri.keyPrefix}`,
                    }}
                />
                <ConditionalComponent
                    shouldRender={selectedTags?.includes("domains")}
                    Component={Domains}
                    componentProps={{
                        keyPrefix: veri.keyPrefix,
                        version: veri.version,
                        reduxAction: ResourceAction,
                        reduxStore: veri.reduxStore?.domains || [],
                        id: `domains_${veri.keyPrefix}`,
                    }}
                />
                <ConditionalComponent
                    shouldRender={selectedTags?.some(item => vTags.vh?.VirtualHost_SingleFields.filter(field => field !== "request_headers_to_remove" && field !== "response_headers_to_remove" && field !== 'domains' && field !== 'name').includes(item))}
                    Component={CommonComponentSingleOptions}
                    componentProps={{
                        version: veri.version,
                        selectedTags: selectedTags,
                        fieldConfigs: fieldConfigs,
                        reduxStore: veri.reduxStore,
                        keyPrefix: `${veri.keyPrefix}`,
                        id: `single_options_${veri.keyPrefix}`,
                    }}
                />
                <ConditionalComponent
                    shouldRender={selectedTags?.includes("routes")}
                    Component={VhdsRouteComponent}
                    componentProps={{
                        version: veri.version,
                        reduxAction: ResourceAction,
                        reduxStore: veri.reduxStore?.routes,
                        keyPrefix: `${veri.keyPrefix}.routes`,
                        tagMatchPrefix: "VirtualHost.routes",
                        id: `routes_${veri.keyPrefix}`,
                    }}
                />
                <ConditionalComponent
                    shouldRender={selectedTags?.includes("virtual_clusters")}
                    Component={ComponentVirtualClusters}
                    componentProps={{
                        version: veri.version,
                        reduxStore: veri.reduxStore?.virtual_clusters,
                        reduxAction: ResourceAction,
                        keyPrefix: `${veri.keyPrefix}.virtual_clusters`,
                        tagMatchPrefix: "VirtualHost.virtual_clusters",
                        id: `virtual_clusters_${veri.keyPrefix}`,
                    }}
                />
                <ConditionalComponent
                    shouldRender={selectedTags?.some(item => headerOptionFields.includes(item))}
                    Component={CommonComponentHeaderOptions}
                    componentProps={{
                        version: veri.version,
                        selectedTags: selectedTags,
                        reduxStore: {
                            response_headers_to_remove: veri.reduxStore?.response_headers_to_remove,
                            response_headers_to_add: veri.reduxStore?.response_headers_to_add,
                            request_headers_to_remove: veri.reduxStore?.request_headers_to_remove,
                            request_headers_to_add: veri.reduxStore?.request_headers_to_add,
                        },
                        reduxAction: ResourceAction,
                        keyPrefix: `${veri.keyPrefix}`,
                        toJSON: vModels.vh?.VirtualHost.toJSON,
                        id: `header_options_${veri.keyPrefix}`,
                    }}
                />
                <ConditionalComponent
                    shouldRender={matchesEndOrStartOf("typed_per_filter_config", selectedTags)}
                    Component={CommonComponentTypedPerFilter}
                    componentProps={{
                        version: veri.version,
                        reduxStore: veri.reduxStore?.typed_per_filter_config,
                        keyPrefix: `${veri.keyPrefix}.typed_per_filter_config`,
                        id: `typed_per_filter_config_${veri.keyPrefix}`,
                    }}
                />
                <ConditionalComponent
                    shouldRender={matchesEndOrStartOf("retry_policy", selectedTags)}
                    Component={CommonComponentRetryPolicy}
                    componentProps={{
                        version: veri.version,
                        reduxAction: ResourceAction,
                        reduxStore: veri.reduxStore?.retry_policy,
                        keyPrefix: `${veri.keyPrefix}.retry_policy`,
                        tagMatchPrefix: "VirtualHost.retry_policy",
                        id: `retry_policy_${veri.keyPrefix}`,
                    }}
                />
                <ConditionalComponent
                    shouldRender={matchesEndOrStartOf("hedge_policy", selectedTags)}
                    Component={ComponentHedgePolicy}
                    componentProps={{
                        version: veri.version,
                        reduxStore: veri.reduxStore?.hedge_policy,
                        keyPrefix: `${veri.keyPrefix}.hedge_policy`,
                        id: `hedge_policy_${veri.keyPrefix}`,
                    }}
                />
                <ConditionalComponent
                    shouldRender={matchesEndOrStartOf("request_mirror_policies", selectedTags)}
                    Component={CommonComponentRequestMirrorPolicy}
                    componentProps={{
                        version: veri.version,
                        reduxAction: ResourceAction,
                        reduxStore: veri.reduxStore?.request_mirror_policies,
                        keyPrefix: `${veri.keyPrefix}.request_mirror_policies`,
                        tagMatchPrefix: "VirtualHost.request_mirror_policies",
                        id: `request_mirror_policies_${veri.keyPrefix}`,
                    }}
                />
            </Col>
        </Row>
    )
}

memorizeComponent(VirtualHostComponentChild, compareVeriReduxStoreOnly);
export default VirtualHostComponent;

const expandedRowRenderFunction = (data: any, index: number, veri: any) => {
    return (
        <VirtualHostComponentChild
            veri={{
                version: veri.version,
                queryResource: veri.queryResource,
                reduxStore: data,
                generalName: veri.generalName,
                keyPrefix: veri.keyPrefix ? `${veri.keyPrefix}.${index}` : `${index}`,
            }}
        />
    );
};