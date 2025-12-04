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
import { useProjectVariable } from "@/hooks/useProjectVariable";
import useTabManager from "@/hooks/useTabManager";
import ECard from "@/elchi/components/common/ECard";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import { debounce } from "lodash";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
        tagMatchPrefix: string;
        id?: string;
        title: string;
    }
};

const ComponentResourceMonitors: React.FC<GeneralProps> = ({ veri }) => {
    const dispatch = useDispatch();
    const [rState, setRState] = useState<any>()
    const { project } = useProjectVariable();
    const { state, onChangeTabs, addTab } = useTabManager({
        initialActiveTab: "0",
        reduxStore: veri.reduxStore,
        keyPrefix: veri.keyPrefix,
        version: veri.version,
        reduxAction: ResourceAction
    });

    const [searchQuery, setSearchQuery] = useState<string>('');
    const debouncedSearch = useCallback(debounce((value: string) => setSearchQuery(value), 300), []);

    const { data: queryData } = useCustomGetQuery({
        queryKey: `custom_resource_monitors_${searchQuery}`,
        enabled: true,
        path: `custom/resource_list_search?collection=extensions&category=envoy.resource_monitors&version=${veri.version}&project=${project}&search=${searchQuery}`
    });

    useEffect(() => {
        if (veri.reduxStore) {
            setRState(ByteToObj(veri.reduxStore))
        }
    }, [veri.reduxStore]);

    const handleChangeRedux = (key: string, val: string) => {
        const matchedExt = queryData.find((obj: any) => obj.name === val);

        if (matchedExt) {
            const typedExtension = {
                name: matchedExt.canonical_name,
                typed_config: {
                    type_url: matchedExt.gtype,
                    value: matchedExt
                }
            };

            handleChangeResources(
                {
                    version: veri.version,
                    type: ActionType.Update,
                    keys: key,
                    val: ObjToBase64(typedExtension),
                    resourceType: ResourceType.Resource
                },
                dispatch,
                ResourceAction
            );
        } else {
            console.error("Matched resource monitor extension not found for the given value:", val);
        }
    };

    return (
        <ECard title={veri.title} id={veri.id}>
            <Tabs
                onChange={onChangeTabs}
                type="editable-card"
                activeKey={state.activeTab}
                onEdit={addTab}
                style={{ width: "99%" }}
                items={rState?.map((data: any, index: number) => {
                    const monitorType = data?.typed_config?.value?.canonical_name || data?.name || '';
                    return {
                        key: index.toString(),
                        label: `${data?.typed_config?.value?.name} ${index}${monitorType ? ` (${monitorType})` : ''}`,
                        forceRender: true,
                        children: (
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
                                            placeholder: "(Resource Monitor)",
                                            values: queryData?.map((obj: any) => obj.name) || [],
                                            keyPrefix: `${veri.keyPrefix}`,
                                            spanNum: 24,
                                            required: true,
                                            displayName: "Resource Monitor",
                                            onSearch: debouncedSearch,
                                        }}
                                    />
                                </EForm>
                            </Col>
                        ),
                    };
                })
                }
            />
        </ECard>
    )
};

export default memorizeComponent(ComponentResourceMonitors, compareVeri);
