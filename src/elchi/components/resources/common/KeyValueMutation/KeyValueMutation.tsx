import React from "react";
import { Divider } from 'antd';
import { compareVeriReduxStoreAndSelectedTags, memorizeComponent } from "@/hooks/useMemoComponent";
import { FieldConfigType, startsWithAny } from "@/utils/tools";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import { EFields } from "@/elchi/components/common/e-components/EFields";
import { useTags } from "@/hooks/useTags";
import { modtag_key_value_mutation } from "./_modtag_";
import { generateFields } from "@/common/generate-fields";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import useResourceFormMultiple from "@/hooks/useResourceFormMultiple";
import { ResourceAction } from "@/redux/reducers/slice";
import CommonComponentKeyValueAppend from "./KeyValueAppend";
import useTabManager from "@/hooks/useTabManager";
import { Tabs } from "antd";
import ECard from "@/elchi/components/common/ECard";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        reduxAction: any;
        keyPrefix?: string;
        tagPrefix?: string;
        title?: string;
    }
};


const CommonComponentKeyValueMutation: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags, loading } = useTags(veri.version, modtag_key_value_mutation);
    const { state, onChangeTabs, addTab } = useTabManager({
        initialActiveTab: "0",
        reduxStore: veri.reduxStore,
        keyPrefix: veri.keyPrefix,
        version: veri.version,
        reduxAction: veri.reduxAction || ResourceAction,
    });

    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceFormMultiple({
        version: veri.version,
        keyPrefix: veri.keyPrefix,
        reduxStore: veri.reduxStore,
        reduxAction: veri.reduxAction || ResourceAction,
    });

    if (loading || !vTags.kvm) {
        return null;
    }

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.kvm?.KeyValueMutation,
            sf: vTags.kvm?.KeyValueMutation_SingleFields,
        }),
    ];

    return (
        <ECard title={veri.title || "Key Value Mutation"}>
            <Tabs
                onChange={onChangeTabs}
                type="editable-card"
                activeKey={state.activeTab}
                onEdit={addTab}
                style={{ width: "99%" }}
                items={veri.reduxStore?.map((data: any, index: number) => ({
                    key: index.toString(),
                    label: `KeyValueMutation ${index}`,
                    forceRender: true,
                    children: (
                        <>
                            <HorizonTags veri={{
                                tags: vTags.kvm?.KeyValueMutation,
                                selectedTags: selectedTags[index],
                                unsupportedTags: [],
                                handleChangeTag: handleChangeTag,
                                keyPrefix: veri.keyPrefix,
                                tagPrefix: '',
                                required: [],
                                index,
                            }} />
                            <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
                            <EForm>
                                <EFields
                                    fieldConfigs={fieldConfigs}
                                    selectedTags={selectedTags[index]}
                                    handleChangeRedux={handleChangeRedux}
                                    reduxStore={data}
                                    keyPrefix={`${veri.keyPrefix}.${index}`}
                                    version={veri.version}
                                />
                                <ConditionalComponent
                                    shouldRender={startsWithAny("append", selectedTags[index])}
                                    Component={CommonComponentKeyValueAppend}
                                    componentProps={{
                                        version: veri.version,
                                        reduxStore: data?.append,
                                        keyPrefix: `${veri.keyPrefix}.${index}.append`,
                                        reduxAction: veri.reduxAction,
                                        title: "Append"
                                    }}
                                />
                            </EForm>
                        </>
                    ),
                })) || []}
            />
        </ECard>
    )
};

export default memorizeComponent(CommonComponentKeyValueMutation, compareVeriReduxStoreAndSelectedTags);
