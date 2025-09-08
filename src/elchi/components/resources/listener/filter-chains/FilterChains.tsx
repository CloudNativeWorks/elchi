import React, { useState, useEffect } from "react";
import { Col, Row, Tabs, Divider } from 'antd';
import { useDispatch } from "react-redux";
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { processArray } from "@/utils/get-active-tags";
import { ActionType, ResourceType } from "@/redux/reducer-helpers/common";
import { handleChangeResources } from "@/redux/dispatcher";
import { handleAddRemoveTags_A } from "@/elchi/helpers/tag-operations";
import ComponentFilters from "./Filters";
import { ConfDiscovery } from "@/common/types";
import { deleteMatchedConfigDiscovery, /* findResourceByParentName */ } from "../helpers";
import usePrevious from "@/hooks/usePrevious";
import { replaceToEmpty, generateUniqueId, insertDashBeforeUniqID, FieldConfigType, matchesEndOrStartOf } from "@/utils/tools";
import { compareVeriReduxStoreAndConfigDiscoveryAndListenerName, memorizeComponent } from "@/hooks/useMemoComponent";
import { FieldTypes } from "@/common/statics/general";
import { ResourceAction } from "@/redux/reducers/slice";
import CommonComponentTransportSocket from '@elchi/components/resources/common/TransportSocket/transport_socket'
import ECard from "@/elchi/components/common/ECard";
import { useTags } from "@/hooks/useTags";
import { modtag_filter_chain } from "./_modtag_";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import { EFields } from "@/elchi/components/common/e-components/EFields";
import { modtag_us_listener } from "../_modtag_";


type GeneralProps = {
    veri: {
        version: string;
        keyPrefix: string;
        tagMatchPrefix: string;
        reduxStore: any[] | undefined;
        configDiscovery: ConfDiscovery[];
        listenerName: string;
    }
};

interface State {
    activeKey: string;
}

const ComponentFilterChain: React.FC<GeneralProps> = ({ veri }) => {
    const dispatch = useDispatch();
    const { vTags } = useTags(veri.version, modtag_filter_chain);
    const previousListenerName = usePrevious<string | undefined>(veri.listenerName);
    const [selectedTags, setSelectedTags] = useState<Record<number, string[]>>(processArray(veri.reduxStore) as Record<number, string[]>);
    const [state, setState] = useState<State>({
        activeKey: "0",
    });

    useEffect(() => {
        setSelectedTags(processArray(veri.reduxStore) as Record<number, string[]>)
    }, [veri.reduxStore]);

    useEffect(() => {
        if (previousListenerName && previousListenerName !== veri.listenerName) {
            veri.reduxStore?.forEach((value: any, id: number) => {
                handleChangeResources({
                    version: veri.version,
                    type: ActionType.Update,
                    keys: `${veri.keyPrefix}.${id}.name`,
                    val: `${veri.listenerName}${replaceToEmpty(value.name, previousListenerName)}`,
                    resourceType: ResourceType.Resource
                }, dispatch, ResourceAction);
            })

            veri.configDiscovery?.forEach((value: ConfDiscovery, id: number) => {
                if (value.parent_name?.startsWith(previousListenerName)) {
                    handleChangeResources({
                        version: veri.version,
                        type: ActionType.Update,
                        keys: `${id}.parent_name`,
                        val: `${veri.listenerName}${replaceToEmpty(value.parent_name, previousListenerName)}`,
                        resourceType: ResourceType.ConfigDiscovery
                    }, dispatch, ResourceAction);
                }
            })

        }
    }, [previousListenerName, veri.reduxStore]);

    const handleChangeRedux = (keys: string, val: string | boolean | number) => {
        handleChangeResources({ version: veri.version, type: ActionType.Update, keys, val, resourceType: ResourceType.Resource }, dispatch, ResourceAction);
    };

    const handleDeleteRedux = ({ keys, index }: { keys?: string, index?: number }) => {
        const fullKey = keys
            ? `${veri.keyPrefix}.${state.activeKey}.${keys}`
            : `${veri.keyPrefix}.${index}`;
        handleChangeResources({ version: veri.version, type: ActionType.Delete, keys: fullKey, resourceType: ResourceType.Resource }, dispatch, ResourceAction);
        if (!keys) {
            deleteMatchedConfigDiscovery(veri?.reduxStore?.[index].name as string, veri.configDiscovery, veri.version, dispatch);
        }
    };

    const handleChangeTag = (keyPrefix: string, tagPrefix: string, tag: string, checked: boolean, index: number, doNotChange: boolean) => {
        handleAddRemoveTags_A(keyPrefix, tagPrefix, tag, index, checked, selectedTags, setSelectedTags, handleDeleteRedux, doNotChange);
        if (tag === "filters" && !checked) {
            deleteMatchedConfigDiscovery(veri?.reduxStore?.[index].name as string, veri.configDiscovery, veri.version, dispatch);
        }
    }

    const onChangeTabs = (activeKey: string) => {
        setState((prevState) => ({
            ...prevState,
            activeKey: activeKey
        }));
    };

    const addFilterChain = (
        targetKey: React.MouseEvent | React.KeyboardEvent | string,
        action: 'add' | 'remove',
    ) => {
        if (action === 'add') {
            handleChangeResources({ keys: `${veri.keyPrefix}`, version: veri.version, type: ActionType.Append, val: { name: `${previousListenerName}-fc${generateUniqueId(6)}` }, resourceType: ResourceType.Resource }, dispatch, ResourceAction);
            const activeKey: number = veri.reduxStore?.length || 0
            setState((prevState) => {
                return {
                    ...prevState,
                    activeKey: activeKey.toString(),
                }
            });
        } else {
            const targetIndex = parseInt(targetKey as string, 10);
            const newActiveKey = (targetIndex - 1) < 0 ? "0" : (targetIndex - 1).toString();
            setState((prevState) => ({
                ...prevState,
                activeKey: newActiveKey,
            }));
            handleDeleteRedux({ index: targetIndex })
        }
    };

    const fieldConfigs: FieldConfigType[] = [
        { tag: "name", type: FieldTypes.String, fieldPath: 'name', spanNum: 6, placeHolder: '(name)', disabled: true },
        { tag: "transport_socket_connect_timeout", type: FieldTypes.Duration, fieldPath: 'transport_socket_connect_timeout', spanNum: 6, placeHolder: '(duration)' },
    ];

    return (
        <ECard title="Filter Chains">
            <Tabs
                onChange={onChangeTabs}
                type="editable-card"
                activeKey={state.activeKey}
                onEdit={addFilterChain}
                style={{ width: "99%" }}
                className="tabContainer"
                destroyOnHidden
                items={veri.reduxStore?.map((data: any, index: number) => {
                    return {
                        key: index.toString(),
                        label: insertDashBeforeUniqID(replaceToEmpty(data?.name, `${veri.listenerName}-`)),
                        forceRender: true,
                        children: (
                            <Row>
                                <HorizonTags veri={{
                                    tags: vTags.fc?.FilterChain,
                                    selectedTags: selectedTags[index],
                                    unsupportedTags: modtag_us_listener['filters_chains'],
                                    index: index,
                                    handleChangeTag: handleChangeTag,
                                    doNotChange: ["name"],
                                    tagMatchPrefix: veri.tagMatchPrefix,
                                }} />
                                <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
                                <Col md={24}>
                                    <EForm>
                                        <EFields
                                            fieldConfigs={fieldConfigs}
                                            selectedTags={selectedTags[index]}
                                            handleChangeRedux={handleChangeRedux}
                                            reduxStore={data}
                                            keyPrefix={`${veri.keyPrefix}.${index}`}
                                            version={veri.version}
                                        />
                                    </EForm>
                                </Col>
                                <Col md={24}>
                                    <ConditionalComponent
                                        shouldRender={selectedTags[index]?.includes("filters")}
                                        Component={ComponentFilters}
                                        componentProps={{
                                            version: veri.version,
                                            filters: data.filters,
                                            keyPrefix: `${veri.keyPrefix}.${index}.filters`,
                                            tagMatchPrefix: `${veri.tagMatchPrefix}.filters`,
                                            reduxStore: data.filters,
                                            fcIndex: index,
                                            fcName: `${data.name}`,
                                            id: `filters_${index}`
                                        }}
                                    />
                                </Col>
                                <Col md={24}>
                                    <ConditionalComponent
                                        shouldRender={matchesEndOrStartOf("transport_socket", selectedTags[index])}
                                        Component={CommonComponentTransportSocket}
                                        componentProps={{
                                            version: veri.version,
                                            keyPrefix: `${veri.keyPrefix}.${index}.transport_socket`,
                                            tagMatchPrefix: `${veri.tagMatchPrefix}.transport_socket`,
                                            reduxStore: data?.transport_socket,
                                            gtype: 'envoy.extensions.transport_sockets.tls.v3.DownstreamTlsContext',
                                            prettyName: 'Downstream',
                                            id: `transport_socket_${index}`
                                        }}
                                    />
                                </Col>
                            </Row>
                        ),
                    };
                })}
            />
        </ECard>
    )
};

export default memorizeComponent(ComponentFilterChain, compareVeriReduxStoreAndConfigDiscoveryAndListenerName);
