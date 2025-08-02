import React from "react";
import { Col, Divider } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import { FieldConfigType, matchesEndOrStartOf } from "@/utils/tools";
import CommonComponentValue from './Value';
import useResourceForm from "@/hooks/useResourceForm";
import ECard from "@/elchi/components/common/ECard";
import { useTags } from "@/hooks/useTags";
import { modtag_comparison_filter } from "./_modtag_";
import { generateFields } from "@/common/generate-fields";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import { EFields } from "@/elchi/components/common/e-components/EFields";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
    }
};

const CommonComponentComparison: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_comparison_filter);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.cf?.ComparisonFilter,
            sf: vTags.cf?.ComparisonFilter_SingleFields,
        }),
        //{ tag: "op", type: FieldTypes.Select, placeHolder: "(string)", values: ['EQ', 'GE', 'LE'], fieldPath: 'op' },
    ];

    return (
        <ECard title={"Comparison"}>
            <HorizonTags veri={{
                tags: vTags.cf?.ComparisonFilter,
                selectedTags: selectedTags,
                unsupportedTags: [],
                handleChangeTag: handleChangeTag,
                keyPrefix: `${veri.keyPrefix}`,
                required: ["value"]
            }} />
            <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
            <Col md={24}>
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
                <ConditionalComponent
                    shouldRender={matchesEndOrStartOf("value", selectedTags)}
                    Component={CommonComponentValue}
                    componentProps={{
                        version: veri.version,
                        reduxStore: veri.reduxStore?.value,
                        keyPrefix: `${veri.keyPrefix}.value`,
                        id: `value_0`,
                    }}
                />
            </Col>
        </ECard>
    )
};

export default memorizeComponent(CommonComponentComparison, compareVeri);
