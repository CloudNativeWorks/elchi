import React from "react";
import { Col, Divider } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import { FieldConfigType, startsWithAny } from "@/utils/tools";
import { modtag_drop_overload } from "./_modtag_";
import { useTags } from "@/hooks/useTags";
import { generateFields } from "@/common/generate-fields";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import { EFields } from "@/elchi/components/common/e-components/EFields";
import { ETabs } from "@/elchi/components/common/e-components/ETabs";
import useTabManager from "@/hooks/useTabManager";
import { ResourceAction } from "@/redux/reducers/slice";
import useResourceFormMultiple from "@/hooks/useResourceFormMultiple";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";
import CommonComponentFractionalPercent from "@/elchi/components/resources/common/FractionalPercent/FractionalPercent";
import ECard from "@/elchi/components/common/ECard";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
        title: string;
    }
};

const CommonComponentDropOverload: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_drop_overload);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceFormMultiple({
        version: veri.version,
        reduxStore: veri.reduxStore,
        keyPrefix: veri.keyPrefix,
        reduxAction: ResourceAction
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.do?.ClusterLoadAssignment_Policy_DropOverload,
            sf: vTags.do?.ClusterLoadAssignment_Policy_DropOverload_SingleFields,
            r: ["category"]
        })
    ];

    const { state, onChangeTabs, addTab } = useTabManager({
        initialActiveTab: "0",
        reduxStore: veri.reduxStore,
        keyPrefix: veri.keyPrefix,
        version: veri.version,
        reduxAction: ResourceAction
    });


    const tabItems = veri.reduxStore?.map((data: any, index: number) => ({
        key: index.toString(),
        label: `do: ${index}`,
        forceRender: true,
        children: (
            <>
                <HorizonTags veri={{
                    tags: vTags.do?.ClusterLoadAssignment_Policy_DropOverload,
                    selectedTags: selectedTags[index],
                    unsupportedTags: [],
                    handleChangeTag: handleChangeTag,
                    keyPrefix: `${veri.keyPrefix}.${index}`,
                    required: ["category"],
                    index: index,
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
                    <ConditionalComponent
                        shouldRender={startsWithAny("drop_percentage", selectedTags[index])}
                        Component={CommonComponentFractionalPercent}
                        componentProps={{
                            version: veri.version,
                            keyPrefix: `${veri.keyPrefix}.${index}.drop_percentage`,
                            reduxStore: data.drop_percentage,
                            id: `${veri.keyPrefix}.${index}.drop_percentage`,
                            title: "Drop Percentage",
                        }}
                    />
                </Col>
            </>
        ),
    }));

    return (
        <ECard title={veri.title}>
            <ETabs
                onChange={onChangeTabs}
                onEdit={addTab}
                activeKey={state.activeTab}
                items={tabItems}
                style={{ width: "100%" }}
                type="editable-card"
            />
        </ECard>
    )
};

export default memorizeComponent(CommonComponentDropOverload, compareVeri);
