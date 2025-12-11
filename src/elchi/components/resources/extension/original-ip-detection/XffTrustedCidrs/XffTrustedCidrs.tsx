import React from "react";
import { Divider, Tabs } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { compareVeriReduxStoreAndSelectedTags, memorizeComponent } from "@/hooks/useMemoComponent";
import { FieldConfigType } from "@/utils/tools";
import useResourceFormMultiple from "@/hooks/useResourceFormMultiple";
import ECard from "@/elchi/components/common/ECard";
import { modtag_cidr_range } from "../../../common/CidrRange/_modtag_";
import { useTags } from "@/hooks/useTags";
import { generateFields } from "@/common/generate-fields";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import { EFields } from "@/elchi/components/common/e-components/EFields";
import useTabManager from "@/hooks/useTabManager";
import { ResourceAction } from "@/redux/reducers/slice";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
        title: string;
        id: string;
    }
};

const ComponentXffTrustedCidrs: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags, loading } = useTags(veri.version, modtag_cidr_range);
    const { state, onChangeTabs, addTab } = useTabManager({
        initialActiveTab: "0",
        reduxStore: veri.reduxStore,
        keyPrefix: `${veri.keyPrefix}.cidrs`,
        version: veri.version,
        reduxAction: ResourceAction,
    });

    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceFormMultiple({
        version: veri.version,
        keyPrefix: `${veri.keyPrefix}.cidrs`,
        reduxStore: veri.reduxStore,
        reduxAction: ResourceAction,
    });

    if (loading || !vTags.cr) {
        return null;
    }

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.cr?.CidrRange,
            sf: vTags.cr?.CidrRange_SingleFields,
            r: ["address_prefix"]
        }),
    ];

    return (
        <ECard title={veri.title} id={veri.id}>
            <Tabs
                onChange={onChangeTabs}
                type="editable-card"
                activeKey={state.activeTab}
                onEdit={addTab}
                style={{ width: "99%" }}
                items={veri.reduxStore?.map((data: any, index: number) => ({
                    key: index.toString(),
                    label: `CIDR ${index}`,
                    forceRender: true,
                    children: (
                        <>
                            <HorizonTags veri={{
                                tags: vTags.cr?.CidrRange,
                                selectedTags: selectedTags[index],
                                unsupportedTags: [],
                                handleChangeTag: handleChangeTag,
                                keyPrefix: `${veri.keyPrefix}.cidrs`,
                                required: ["address_prefix"],
                                index,
                            }} />
                            <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
                            <EForm>
                                <EFields
                                    fieldConfigs={fieldConfigs}
                                    selectedTags={selectedTags[index]}
                                    handleChangeRedux={handleChangeRedux}
                                    reduxStore={data}
                                    keyPrefix={`${veri.keyPrefix}.cidrs.${index}`}
                                    version={veri.version}
                                />
                            </EForm>
                        </>
                    ),
                }))}
            />
        </ECard>
    )
};

export default memorizeComponent(ComponentXffTrustedCidrs, compareVeriReduxStoreAndSelectedTags);
