import React from "react";
import { Col, Divider } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import { FieldConfigType, startsWithAny } from "@/utils/tools";
import useResourceForm from "@/hooks/useResourceForm";
import ECard from "@/elchi/components/common/ECard";
import { useTags } from "@/hooks/useTags";
import { modtag_runtime_feature_percent } from "./_modtag_";
import { generateFields } from "@/common/generate-fields";
import CommonComponentPercent from "@/elchi/components/resources/common/Percent/Percent";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import { EFields } from "@/elchi/components/common/e-components/EFields";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
        title: string;
    }
};

const CommonComponentRuntimePercent: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_runtime_feature_percent);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.rp?.RuntimePercent,
            sf: vTags.rp?.RuntimePercent_SingleFields,
            r: ['runtime_key']
        }),
    ];

    return (
        <ECard title={veri.title}>
            <HorizonTags veri={{
                tags: vTags.rp?.RuntimePercent,
                selectedTags: selectedTags,
                unsupportedTags: [],
                handleChangeTag: handleChangeTag,
                keyPrefix: veri.keyPrefix,
                required: ['runtime_key']
            }} />
            <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
            <Col md={24}>
                <ConditionalComponent
                    shouldRender={startsWithAny("default_value", selectedTags)}
                    Component={CommonComponentPercent}
                    componentProps={{
                        version: veri.version,
                        reduxStore: veri.reduxStore?.default_value,
                        keyPrefix: `${veri.keyPrefix}.default_value`,
                        title: "Default Value",
                        id: `default_value_0`,
                    }}
                />
                <EForm>
                    <EFields
                        fieldConfigs={fieldConfigs}
                        selectedTags={selectedTags}
                        handleChangeRedux={handleChangeRedux}
                        reduxStore={veri.reduxStore}
                        keyPrefix={veri.keyPrefix}
                        version={veri.version}
                    />
                </EForm>
            </Col>
        </ECard>
    )
};

export default memorizeComponent(CommonComponentRuntimePercent, compareVeri);
