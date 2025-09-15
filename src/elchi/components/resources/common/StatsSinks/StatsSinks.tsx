import React, { useEffect, useState, useCallback } from "react";
import { Col, Tabs } from 'antd';
import { useDispatch } from "react-redux";
import { ActionType, ResourceType } from "@/redux/reducer-helpers/common";
import { handleChangeResources } from "@/redux/dispatcher";
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import { ResourceAction } from "@/redux/reducers/slice";
import { useCustomGetQuery } from "@/common/api";
import { FieldComponent } from "@/elchi/components/common/FormItems";
import { FieldTypes } from "@/common/statics/general";
import { ByteToObj, ObjToBase64 } from "@/utils/typed-config-op";
import { extractLastNumber } from "@/utils/tools";
import { useProjectVariable } from "@/hooks/useProjectVariable";
import useTabManager from "@/hooks/useTabManager";
import ECard from "@/elchi/components/common/ECard";
import { modtag_stats_sink } from "./_modtag_";
import { useModels } from "@/hooks/useModels";
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

const CommonComponentStatsSinks: React.FC<GeneralProps> = ({ veri }) => {
    const dispatch = useDispatch();
    const [rState, setRState] = useState<any>()
    const { project } = useProjectVariable();
    const { vModels } = useModels(veri.version, modtag_stats_sink);
    const { state, onChangeTabs, addTab } = useTabManager({
        initialActiveTab: "0",
        reduxStore: veri.reduxStore,
        keyPrefix: veri.keyPrefix,
        version: veri.version,
        reduxAction: veri.reduxAction
    });

    const [searchQuery, setSearchQuery] = useState<string>('');
    const debouncedSearch = useCallback(debounce((value: string) => setSearchQuery(value), 300), []);

    const { data: queryData } = useCustomGetQuery({
        queryKey: `custom_stats_sink_${searchQuery}`,
        enabled: true,
        path: `custom/resource_list_search?collection=extensions&category=envoy.stats_sinks&version=${veri.version}&project=${project}&search=${searchQuery}`
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
            filter = vModels.ss?.StatsSink.toJSON(veri.reduxStore[index].filter);
        }

        const matchedAL = queryData.find((obj: any) => obj.name === val);

        if (matchedAL) {
            const stats_sink = {
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
                    val: ObjToBase64(stats_sink),
                    resourceType: ResourceType.Resource
                },
                dispatch,
                ResourceAction
            );
        } else {
            console.error("Matched stats sink not found for the given value:", val);
        }
    };

    return (
        <ECard title={"Stats Sinks"}>
            <Tabs
                onChange={onChangeTabs}
                type="editable-card"
                activeKey={state.activeTab}
                onEdit={addTab}
                style={{ width: "99%" }}
                items={rState?.map((data: any, index: number) => {
                    return {
                        key: index.toString(),
                        label: "stats_sinks: " + index.toString(),
                        forceRender: true,
                        children: (
                            <>
                                <Col md={24}>
                                    <EForm>
                                        <FieldComponent
                                            veri={{
                                                alwaysShow: true,
                                                selectedTags: [],
                                                handleChange: handleChangeRedux,
                                                tag: `${index}`,
                                                value: data?.typed_config?.value?.name,
                                                type: FieldTypes.Select,
                                                placeholder: "(Stats Sink)",
                                                values: queryData?.map((obj: any) => obj.name) || [],
                                                keyPrefix: `${veri.keyPrefix}`,
                                                spanNum: 8,
                                                required: true,
                                                displayName: "Stats Sink",
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

export default memorizeComponent(CommonComponentStatsSinks, compareVeri);
