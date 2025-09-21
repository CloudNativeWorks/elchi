import React from "react";
import { Col, Row, Divider, Flex } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { memorizeComponent, compareVeri } from "@/hooks/useMemoComponent";
import { FieldComponent } from "@/elchi/components/common/FormItems";
import { FieldConfigType, getCondition, getFieldValue, matchesEndOrStartOf } from "@/utils/tools";
import { useTags } from "@/hooks/useTags";
import { modtag_retry_policy } from "./_modtag_";
import { useModels } from "@/hooks/useModels";
import { generateFields } from "@/common/generate-fields";
import CCard from "@/elchi/components/common/CopyPasteCard";
import useResourceForm from "@/hooks/useResourceForm";
import CommonRetryBackoff from "./retry_backoff";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import { modtag_us_virtualhost } from "../../vhds/_modtag_";


type GeneralProps = {
    veri: {
        version: string;
        reduxAction: any;
        reduxStore: any;
        keyPrefix: string;
        tagMatchPrefix: string;
    }
};

const CommonComponentCoreRetryPolicy: React.FC<GeneralProps> = ({ veri }) => {
    const { vModels } = useModels(veri.version, modtag_retry_policy);
    const { vTags } = useTags(veri.version, modtag_retry_policy);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const fieldConfigs_retryPolicy: FieldConfigType[] = [
        ...generateFields({
            f: vTags.rp?.RetryPolicy,
            sf: vTags.rp?.RetryPolicy_SingleFields,
        }),
    ];

    return (
        <CCard toJSON={vModels.rp?.RetryPolicy.toJSON} reduxStore={veri.reduxStore} keys={veri.keyPrefix} Paste={handleChangeRedux} ctype="retry_policy" title="Retry Policy">
            <Row>
                <HorizonTags veri={{
                    tags: vTags.rp?.RetryPolicy,
                    selectedTags: selectedTags,
                    unsupportedTags: modtag_us_virtualhost["RetryPolicy"],
                    handleChangeTag: handleChangeTag,
                    keyPrefix: veri.keyPrefix,
                }} />
                <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
                <Col md={24}>
                    <EForm>
                        <Flex wrap="wrap" gap="small">
                            {fieldConfigs_retryPolicy.map((config) => (
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
                                        spanNum: config.spanNum,
                                        condition: getCondition(veri.reduxStore, config),
                                        drawerShow: () => config.drawerShow(),
                                        required: config.required
                                    }}
                                />
                            ))}
                        </Flex>
                    </EForm>
                </Col>
            </Row>
            <ConditionalComponent
                shouldRender={matchesEndOrStartOf(`retry_back_off`, selectedTags)}
                Component={CommonRetryBackoff}
                componentProps={{
                    version: veri.version,
                    reduxStore: veri.reduxStore?.retry_back_off,
                    keyPrefix: veri.keyPrefix,
                    id: `retry_back_off_0`,
                }}
            />
        </CCard>
    )
};

export default memorizeComponent(CommonComponentCoreRetryPolicy, compareVeri);
