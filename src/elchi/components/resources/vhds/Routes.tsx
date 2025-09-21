import React, { useEffect, useState } from "react";
import { Button, Col, Collapse, Divider, Row, Table } from 'antd';
import { useDispatch } from "react-redux";
import { memorizeComponent, compareVeri } from "@/hooks/useMemoComponent";
import { ActionType, ResourceType } from "@/redux/reducer-helpers/common";
import { handleChangeResources } from "@/redux/dispatcher";
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { FieldComponent } from "@/elchi/components/common/FormItems";
import { headerOptionFields } from "@/common/statics/general";
import type { ColumnsType } from 'antd/es/table';
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { SortableRow, moveArrayItemToNewPosition } from "./Helpers";
import { getCollapseItems } from "@/elchi/components/common/CollapseItems";
import { FieldConfigType, getFieldValue, matchesEndOrStartOf } from "@/utils/tools";
import { navigateCases } from "@/elchi/helpers/navigate-cases";
import { toJSON } from "@/elchi/helpers/to-json";
import { DeleteTwoTone, InboxOutlined } from '@ant-design/icons';
import CCard from "@/elchi/components/common/CopyPasteCard";
import CommonComponentHeaderOptions from "../common/HeaderOptions/HeaderOptions";
import ComponentRouteMatch from './Match';
import ComponentDirectResponse from './DirectResponse';
import ComponentRedirect from './Redirect';
import ComponentRoute from './Route';
import CommonComponentTypedPerFilter from '@resources/common/TypedPerFilter/typed_per_filter';
import useResourceFormMultiple from "@/hooks/useResourceFormMultiple";
import { useTags } from "@/hooks/useTags";
import { modtag_route, modtag_us_virtualhost } from "./_modtag_";
import { generateFields } from "@/common/generate-fields";
import { useModels } from "@/hooks/useModels";
import { actionCheck, matchCheck } from "./Helpers";
import { EForm } from "../../common/e-components/EForm";
import ElchiIconButton from "../../common/ElchiIconButton";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any[] | undefined;
        reduxAction: any,
        keyPrefix: string,
        tagMatchPrefix: string
    }
};

interface RouteWithIndex {
    tableIndex: number;
    [key: string]: any;
}

const excludeFields = ["request_headers_to_remove", "response_headers_to_remove"]

const VhdsRoutesComponent: React.FC<GeneralProps> = ({ veri }) => {
    const dispatch = useDispatch();
    const { vModels } = useModels(veri.version, modtag_route);
    const { vTags } = useTags(veri.version, modtag_route);
    const [ids, setIds] = useState<string[]>([]);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceFormMultiple({
        version: veri.version,
        reduxStore: veri.reduxStore,
        keyPrefix: veri.keyPrefix,
        reduxAction: veri.reduxAction
    });

    useEffect(() => {
        if (veri.reduxStore) {
            setIds(veri.reduxStore?.map((_, index) => `item-${index}`));
        }
    }, [veri.reduxStore]);


    const handleDeleteRedux = ({ keys, index, event }: { keys?: string, index?: number, event?: React.MouseEvent<HTMLElement> }) => {
        if (event) { event.stopPropagation(); }
        const fullKey = keys ?
            `${veri.keyPrefix}.${index}.${keys}` :
            `${veri.keyPrefix}.${index}`;
        handleChangeResources({ version: veri.version, type: ActionType.Delete, keys: fullKey, resourceType: ResourceType.Resource }, dispatch, veri.reduxAction);
    };

    const columns: ColumnsType<RouteWithIndex> = [
        {
            key: 'sort',
            width: '3%',

        },
        {
            title: 'Name',
            width: "17%",
            key: 'name',
            render: (_, record) => { return record.name }
        },
        {
            title: 'Match',
            width: "50%",
            key: 'action',
            render: (_, record) => { return matchCheck(record) }
        },
        {
            title: 'Action',
            width: "20%",
            key: 'action',
            render: (_, record) => { return actionCheck(record) }
        },
        {
            title: 'Delete',
            width: "10%",
            key: 'x',
            render: (_, __, index) =>
                <Button
                    icon={<DeleteTwoTone twoToneColor="#eb2f96" />}
                    size='small'
                    onClick={(e) => handleDeleteRedux({ event: e, index: index })}
                    style={{ marginRight: 8 }}
                    iconPosition={"end"}
                />,
        },
    ];

    const addRoute = () => {
        handleChangeResources({
            version: veri.version,
            type: ActionType.Append,
            keys: `${veri.keyPrefix}`,
            val: { name: `newRoute${(veri.reduxStore?.length || 0) + 1}` },
            resourceType: ResourceType.Resource
        }, dispatch, veri.reduxAction);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { over, active } = event;
        if (over && typeof active.id === "string" && typeof over.id === "string") {
            const oldIndex = parseInt(active.id.replace('item-', ''), 10);
            const newIndex = parseInt(over.id.replace('item-', ''), 10);

            if (oldIndex !== newIndex) {
                const updatedItems = moveArrayItemToNewPosition([...(veri.reduxStore || [])], oldIndex, newIndex);
                handleChangeRedux(`${veri.keyPrefix}`, toJSON({ resourceType: vModels.r?.Route, resource: updatedItems }));

                setIds(updatedItems.map((_, index) => `item-${index}`));
            }
        }
    };

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.r?.Route,
            sf: vTags.r?.Route_SingleFields,
            r: ["name"]
        }),
    ]

    if (!vModels || !vTags) { return <div>Module not found!...</div>; }

    return (
        <CCard reduxStore={veri.reduxStore} toJSON={vModels.r?.Route.toJSON} keys={veri.keyPrefix} Paste={handleChangeRedux} version={veri.version} ctype="routes" title="Routes">
            <div style={{
                background: '#fff',
                padding: '4px 4px 12px 4px',
                borderRadius: 12,
                boxShadow: '0 2px 8px rgba(5,117,230,0.06)',
                margin: '4px 0'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                    <ElchiIconButton onClick={() => addRoute()} />
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
                                        <div>No Routes</div>
                                    </div>
                                )
                            }}
                            expandable={{
                                expandRowByClick: true,
                                expandedRowRender: (data, index) =>
                                    expandedRowRender({
                                        data,
                                        index,
                                        veri,
                                        selectedTags,
                                        vTags,
                                        handleChangeTag,
                                        handleChangeRedux,
                                        fieldConfigs
                                    })
                            }}
                        />
                    </SortableContext>
                </DndContext>
            </div>
        </CCard>
    )
};

export default memorizeComponent(VhdsRoutesComponent, compareVeri);

const expandedRowRender = ({
    data,
    index,
    veri,
    selectedTags,
    vTags,
    handleChangeTag,
    handleChangeRedux,
    fieldConfigs,
}: {
    data: any;
    index: number;
    veri: any;
    selectedTags: any;
    vTags: any;
    handleChangeTag: any;
    handleChangeRedux: any;
    fieldConfigs: any;
}) => {
    return (
        <>
            <Row>
                <HorizonTags
                    veri={{
                        tags: vTags.r?.Route,
                        selectedTags: selectedTags[index],
                        unsupportedTags: modtag_us_virtualhost["routes"],
                        index: index,
                        handleChangeTag: handleChangeTag,
                        required: ["match", "route", "redirect", "direct_response", "name"],
                        onlyOneTag: [["action.route", "action.redirect", "action.direct_response"]],
                        specificTagPrefix: { route: "action", redirect: "action", direct_response: "action" }
                    }}
                />
                <Divider style={{ marginTop: "8px", marginBottom: "8px" }} type="horizontal" />
                <Col md={24}>
                    <EForm>
                        <Row gutter={[5, 1]}>
                            {fieldConfigs.filter((config: FieldConfigType) => !excludeFields.includes(config.tag)).map((config: any) => (
                                <FieldComponent
                                    key={config.tag}
                                    veri={{
                                        selectedTags: selectedTags[index],
                                        handleChange: handleChangeRedux,
                                        tag: config.tag,
                                        keyPrefix: `${veri.keyPrefix}.${index}`,
                                        value: getFieldValue(data, config, veri.version),
                                        type: config.type,
                                        placeholder: config.placeHolder,
                                        values: config.values,
                                        tagPrefix: config.tagPrefix,
                                        required: config.required
                                    }}
                                />
                            ))}
                        </Row>
                    </EForm>
                </Col>
            </Row>
            <Row>
                <Collapse
                    accordion
                    bordered={false}
                    size="small"
                    style={{ width: "100%", marginBottom: 10, background: "linear-gradient(90deg, #056ccd 0%, #00c6fb 100%)" }}
                    items={getCollapseItems([
                        {
                            reduxStore: data.match,
                            version: veri.version,
                            reduxAction: veri.reduxAction,
                            componentName: "Match",
                            component: ComponentRouteMatch,
                            keyPrefix: `${veri.keyPrefix}.${index}.match`,
                            tagMatchPrefix: `${veri.tagMatchPrefix}.match`,
                            condition: matchesEndOrStartOf("match", selectedTags[index])
                        },
                        {
                            reduxStore: navigateCases(data, "action.direct_response"),
                            version: veri.version,
                            reduxAction: veri.reduxAction,
                            componentName: "Direct Response",
                            component: ComponentDirectResponse,
                            keyPrefix: `${veri.keyPrefix}.${index}.direct_response`,
                            tagMatchPrefix: `${veri.tagMatchPrefix}.action.direct_response`,
                            condition: matchesEndOrStartOf("action.direct_response", selectedTags[index])
                        },
                        {
                            reduxStore: navigateCases(data, "action.redirect"),
                            version: veri.version,
                            reduxAction: veri.reduxAction,
                            componentName: "Redirect",
                            component: ComponentRedirect,
                            keyPrefix: `${veri.keyPrefix}.${index}.redirect`,
                            tagMatchPrefix: `${veri.tagMatchPrefix}.action.redirect`,
                            condition: matchesEndOrStartOf("action.redirect", selectedTags[index])
                        },
                        {
                            reduxStore: navigateCases(data, "action.route"),
                            version: veri.version,
                            reduxAction: veri.reduxAction,
                            componentName: "Route",
                            component: ComponentRoute,
                            keyPrefix: `${veri.keyPrefix}.${index}.route`,
                            tagMatchPrefix: `${veri.tagMatchPrefix}.action.route`,
                            condition: matchesEndOrStartOf("action.route", selectedTags[index])
                        },
                        {
                            reduxStore: navigateCases(data, "typed_per_filter_config"),
                            version: veri.version,
                            reduxAction: veri.reduxAction,
                            componentName: "Typed Per Filter Config",
                            component: CommonComponentTypedPerFilter,
                            keyPrefix: `${veri.keyPrefix}.${index}.typed_per_filter_config`,
                            tagMatchPrefix: `${veri.tagMatchPrefix}.typed_per_filter_config`,
                            condition: matchesEndOrStartOf("typed_per_filter_config", selectedTags[index]),
                        },
                        {
                            reduxStore: {
                                response_headers_to_remove: data.response_headers_to_remove,
                                response_headers_to_add: data.response_headers_to_add,
                                request_headers_to_remove: data.request_headers_to_remove,
                                request_headers_to_add: data.request_headers_to_add
                            },
                            version: veri.version,
                            reduxAction: veri.reduxAction,
                            selectedTags: selectedTags[index],
                            componentName: "Header Option",
                            component: CommonComponentHeaderOptions,
                            keyPrefix: `${veri.keyPrefix}.${index}`,
                            tagMatchPrefix: `${veri.tagMatchPrefix}`,
                            condition: selectedTags[index]?.some((item: any) =>
                                headerOptionFields.includes(item)
                            ),
                        }
                    ])}
                />
            </Row>
        </>
    );
};