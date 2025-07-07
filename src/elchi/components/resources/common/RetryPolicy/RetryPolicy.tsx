import React, { useState } from "react";
import { Col, Row, Divider, Flex } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { memorizeComponent, compareVeri } from "@/hooks/useMemoComponent";
import { FieldComponent } from "@/elchi/components/common/FormItems";
import { FieldConfigType, getCondition, getFieldValue, matchesEndOrStartOf, startsWithAny } from "@/utils/tools";
import { FieldTypes } from "@/common/statics/general";
import { useTags } from "@/hooks/useTags";
import { modtag_retry_policy } from "./_modtag_";
import { useModels } from "@/hooks/useModels";
import { generateFields } from "@/common/generate-fields";
import CommonRateLimitedRetryBackoff from "./rate_limeted_retry_backoff";
import CommonComponentHeaderMatcher from "../HeaderMatcher/HeaderMatcher";
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

interface State {
    show_reset_headers: boolean;
    show_retriable_headers: boolean;
    show_retriable_request_headers: boolean;
}

const CommonComponentRetryPolicy: React.FC<GeneralProps> = ({ veri }) => {
    const { vModels } = useModels(veri.version, modtag_retry_policy);
    const { vTags } = useTags(veri.version, modtag_retry_policy);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const [state, setState] = useState<State>({
        show_reset_headers: false,
        show_retriable_headers: false,
        show_retriable_request_headers: false,
    });

    const fieldConfigs_retryPolicy: FieldConfigType[] = [
        ...generateFields({
            f: vTags.rp?.RetryPolicy,
            sf: vTags.rp?.RetryPolicy_SingleFields,
        }),
        {
            tag: "retriable_headers", type: FieldTypes.ArrayIcon, fieldPath: 'retriable_headers', spanNum: 6, condition: true,
            drawerShow: () => {
                const updatedState = { ...state };
                updatedState.show_retriable_headers = true;
                setState(updatedState);
            },
        },
        {
            tag: "retriable_request_headers", type: FieldTypes.ArrayIcon, fieldPath: 'retriable_request_headers', spanNum: 6, condition: true,
            drawerShow: () => {
                const updatedState = { ...state };
                updatedState.show_retriable_request_headers = true;
                setState(updatedState);
            }
        },
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
            <ConditionalComponent
                shouldRender={matchesEndOrStartOf(`rate_limited_retry_back_off`, selectedTags)}
                Component={CommonRateLimitedRetryBackoff}
                componentProps={{
                    version: veri.version,
                    reduxStore: veri.reduxStore?.rate_limited_retry_back_off,
                    keyPrefix: veri.keyPrefix,
                    id: `rate_limited_retry_back_off_0`,
                }}
            />
            <ConditionalComponent
                shouldRender={startsWithAny("retriable_headers", selectedTags)}
                Component={CommonComponentHeaderMatcher}
                componentProps={{
                    version: veri.version,
                    keyPrefix: `${veri.keyPrefix}.retriable_headers`,
                    drawerOpen: state.show_retriable_headers,
                    reduxStore: veri.reduxStore?.retriable_headers,
                    reduxAction: veri.reduxAction,
                    tagMatchPrefix: `${veri.tagMatchPrefix}.retriable_headers`,
                    parentName: "Retriable Headers",
                    drawerClose: () => {
                        const updatedState = { ...state };
                        updatedState.show_retriable_headers = false;
                        setState(updatedState);
                    },
                    id: `retriable_headers_0`,
                }}
            />
            <ConditionalComponent
                shouldRender={startsWithAny("retriable_request_headers", selectedTags)}
                Component={CommonComponentHeaderMatcher}
                componentProps={{
                    version: veri.version,
                    keyPrefix: `${veri.keyPrefix}.retriable_request_headers`,
                    drawerOpen: state.show_retriable_request_headers,
                    reduxStore: veri.reduxStore?.retriable_request_headers,
                    reduxAction: veri.reduxAction,
                    tagMatchPrefix: `${veri.tagMatchPrefix}.retriable_request_headers`,
                    parentName: "Retriable Request Headers",
                    drawerClose: () => {
                        const updatedState = { ...state };
                        updatedState.show_retriable_request_headers = false;
                        setState(updatedState);
                    },
                    id: `retriable_request_headers_0`,
                }}
            />
        </CCard>
    )
};

export default memorizeComponent(CommonComponentRetryPolicy, compareVeri);
