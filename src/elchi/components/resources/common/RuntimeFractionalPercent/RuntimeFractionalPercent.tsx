import React from "react";
import { Col, Divider, Row } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { memorizeComponent, compareVeri } from "@/hooks/useMemoComponent";
import { FieldComponent } from "@/elchi/components/common/FormItems";
import { FieldConfigType, getFieldValue, startsWithAny } from "@/utils/tools";
import { useTags } from "@/hooks/useTags";
import { modtag_runtime_fractional_percent } from "./_modtag_";
import useResourceForm from "@/hooks/useResourceForm";
import ECard from "@/elchi/components/common/ECard";
import { generateFields } from "@/common/generate-fields";
import { FieldTypes } from "@/common/statics/general";
import { EForm } from "@/elchi/components/common/e-components/EForm";


type GeneralProps = {
    veri: {
        version: string;
        reduxAction: any;
        reduxStore: any;
        keyPrefix: string;
        tagPrefix: string;
        tagMatchPrefix: string;
        title?: string;
    }
};

const CommonComponentRuntimeFractionalPercent: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_runtime_fractional_percent);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.rfp?.RuntimeFractionalPercent,
            sf: vTags.rfp?.RuntimeFractionalPercent_SingleFields,
        }),
    ];

    return (
        <ECard title={`${veri.title}`}>
            <Col md={24}>
                <HorizonTags veri={{
                    tags: vTags.rfp?.RuntimeFractionalPercent,
                    selectedTags: selectedTags,
                    unsupportedTags: [],
                    tagPrefix: '',
                    tagMatchPrefix: veri.tagMatchPrefix,
                    handleChangeTag: handleChangeTag,
                    keyPrefix: veri.keyPrefix,
                    required: ['default_value']
                }} />
                <EForm>
                    <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
                    <Row gutter={[5, 1]}>
                        {startsWithAny("default_value", selectedTags) &&
                            <>
                                <FieldComponent veri={{
                                    selectedTags: selectedTags,
                                    alwaysShow: true,
                                    handleChange: handleChangeRedux,
                                    tag: "default_value.numerator",
                                    value: veri.reduxStore?.default_value?.numerator,
                                    type: FieldTypes.Number,
                                    keyPrefix: `${veri.keyPrefix}`,
                                    tagPrefix: `default_value`,
                                    spanNum: 8,
                                    required: true
                                }} />
                                <FieldComponent veri={{
                                    selectedTags: selectedTags,
                                    alwaysShow: true,
                                    handleChange: handleChangeRedux,
                                    tag: "default_value.denominator",
                                    value: veri.reduxStore?.default_value?.denominator,
                                    values: vTags.fp?.FractionalPercent.find(item => item.name === "denominator")?.enums,
                                    type: FieldTypes.Select,
                                    keyPrefix: `${veri.keyPrefix}`,
                                    tagPrefix: `default_value`,
                                    spanNum: 8,
                                    required: true
                                }} />
                            </>
                        }
                        {fieldConfigs.map((config) => (
                            <FieldComponent key={config.tag}
                                veri={{
                                    selectedTags: selectedTags,
                                    handleChange: handleChangeRedux,
                                    tag: config.tag,
                                    value: getFieldValue(veri.reduxStore, config, veri.version),
                                    type: config.type,
                                    placeholder: config.placeHolder,
                                    values: config.values,
                                    tagPrefix: config.tagPrefix,
                                    keyPrefix: `${veri.keyPrefix}`,
                                }}
                            />
                        ))}
                    </Row>
                </EForm>
            </Col>
        </ECard>
    )
};

export default memorizeComponent(CommonComponentRuntimeFractionalPercent, compareVeri);
