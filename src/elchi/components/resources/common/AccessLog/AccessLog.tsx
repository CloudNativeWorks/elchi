import React, { useEffect, useState, useCallback } from "react";
import { Col, Divider, Tabs } from 'antd';
import { useDispatch } from "react-redux";
import { ActionType, ResourceType } from "@/redux/reducer-helpers/common";
import { handleChangeResources } from "@/redux/dispatcher";
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import { ResourceAction } from "@/redux/reducers/slice";
import { useCustomGetQuery } from "@/common/api";
import { FieldComponent } from "@/elchi/components/common/FormItems";
import { FieldTypes } from "@/common/statics/general";
import { ByteToObj, ObjToBase64 } from "@/utils/typed-config-op";
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { extractLastNumber, matchesEndOrStartOf } from "@/utils/tools";
import ComponentFilter from "./filter";
import { useProjectVariable } from "@/hooks/useProjectVariable";
import useTabManager from "@/hooks/useTabManager";
import useResourceFormMultiple from "@/hooks/useResourceFormMultiple";
import ECard from "@/elchi/components/common/ECard";
import { useTags } from "@/hooks/useTags";
import { modtag_accesslog } from "./_modtag_";
import { useModels } from "@/hooks/useModels";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import { debounce } from "lodash";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
        tagMatchPrefix: string;
        reduxAction: any;
    }
};

const CommonComponentAccessLog: React.FC<GeneralProps> = ({ veri }) => {
    const dispatch = useDispatch();
    const [rState, setRState] = useState<any>()
    const { project } = useProjectVariable();
    const { vModels } = useModels(veri.version, modtag_accesslog);
    const { vTags } = useTags(veri.version, modtag_accesslog);
    const { state, onChangeTabs, addTab } = useTabManager({
        initialActiveTab: "0",
        reduxStore: veri.reduxStore,
        keyPrefix: veri.keyPrefix,
        version: veri.version,
        reduxAction: veri.reduxAction
    });

    const { selectedTags, handleChangeTag } = useResourceFormMultiple({
        version: veri.version,
        reduxStore: veri.reduxStore,
        keyPrefix: veri.keyPrefix,
        reduxAction: veri.reduxAction
    });

    const [searchQuery, setSearchQuery] = useState<string>('');
    const debouncedSearch = useCallback(debounce((value: string) => setSearchQuery(value), 300), []);

    const { data: queryData } = useCustomGetQuery({
        queryKey: `custom_accesslog_${searchQuery}`,
        enabled: true,
        path: `custom/resource_list_search?collection=extensions&category=envoy.access_loggers&version=${veri.version}&project=${project}&search=${searchQuery}`
    });

    useEffect(() => {
        if (veri.reduxStore) {
            setRState(ByteToObj(veri.reduxStore))
        }
    }, [veri.reduxStore]);

    const handleChangeRedux = (key: string, val: string) => {
        const index = extractLastNumber(key);
        let filter: any;

        if (index !== null && veri.reduxStore[index]?.filter) {
            filter = vModels.al?.AccessLogFilter.toJSON(veri.reduxStore[index].filter);
        }

        const matchedAL = queryData.find((obj: any) => obj.name === val);

        if (matchedAL) {
            const accesslog = {
                name: matchedAL.canonical_name,
                filter: filter || undefined,
                typed_config: {
                    type_url: matchedAL.gtype,
                    value: matchedAL
                }
            };

            handleChangeResources(
                {
                    version: veri.version,
                    type: ActionType.Update,
                    keys: key,
                    val: ObjToBase64(accesslog),
                    resourceType: ResourceType.Resource
                },
                dispatch,
                ResourceAction
            );
        } else {
            console.error("Matched access log not found for the given value:", val);
        }
    };

    return (
        <ECard title={"Access Log"}>
            <Tabs
                onChange={onChangeTabs}
                type="editable-card"
                activeKey={state.activeTab}
                onEdit={addTab}
                style={{ width: "99%" }}
                items={rState?.map((data: any, index: number) => {
                    return {
                        key: index.toString(),
                        label: "access_log: " + index.toString(),
                        forceRender: true,
                        children: (
                            <>
                                <HorizonTags veri={{
                                    tags: vTags.al?.AccessLog,
                                    unsupportedTags: ["name", "config_type.typed_config"],
                                    hiddenTags: ["config_type.typed_config"],
                                    selectedTags: selectedTags[index],
                                    handleChangeTag: handleChangeTag,
                                    tagPrefix: "",
                                    keyPrefix: ``,
                                    tagMatchPrefix: `${veri.tagMatchPrefix}`,
                                    index: index,
                                }} />
                                <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
                                <Col md={24}>
                                    <ConditionalComponent
                                        shouldRender={matchesEndOrStartOf("filter", selectedTags[index])}
                                        Component={ComponentFilter}
                                        componentProps={{
                                            version: veri.version,
                                            reduxStore: veri.reduxStore[index]?.filter,
                                            keyPrefix: `${veri.keyPrefix}.${index}.filter`,
                                            tagMatchPrefix: `${veri.tagMatchPrefix}.filter`,
                                            id: `filter_0`,
                                        }}
                                    />
                                    <EForm>
                                        <FieldComponent
                                            veri={{
                                                alwaysShow: true,
                                                selectedTags: [],
                                                handleChange: handleChangeRedux,
                                                tag: `${index}`,
                                                value: data?.typed_config?.value?.name,
                                                type: FieldTypes.Select,
                                                placeholder: "(Access Log)",
                                                values: queryData?.map((obj: any) => obj.name) || [],
                                                keyPrefix: `${veri.keyPrefix}`,
                                                spanNum: 24,
                                                required: true,
                                                displayName: "Access Log",
                                                onSearch: debouncedSearch,
                                            }}
                                        />
                                    </EForm>
                                </Col>
                            </>
                        ),
                    };
                })
                }
            />
        </ECard>
    )
};

export default memorizeComponent(CommonComponentAccessLog, compareVeri);
