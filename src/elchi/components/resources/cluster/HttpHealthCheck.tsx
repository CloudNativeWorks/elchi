import React, { useState } from "react";
import { Col, Row, Divider } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import { FieldTypes } from "@/common/statics/general";
import { ResourceAction } from "@/redux/reducers/slice";
import { FieldConfigType, startsWithAny } from "@/utils/tools";
import { navigateCases } from "@/elchi/helpers/navigate-cases";
import HeaderToAdd from "../common/HeaderOptions/HeaderToAdd/HeaderToAdd";
import CommonComponentStringMatcher from "../common/StringMatcher/StringMatcher";
import CommonComponentArrayRange from "../common/ArrayRange/ArrayRange";
import CommonComponentPayloadSlice from "../common/Payload/WithArray";
import useResourceForm from "@/hooks/useResourceForm";
import ECard from "../../common/ECard";
import { useTags } from "@/hooks/useTags";
import { modtag_http_health_check, modtag_us_cluster } from "./_modtag_";
import { generateFields } from "@/common/generate-fields";
import { ConditionalComponent } from "../../common/ConditionalComponent";
import { EForm } from "../../common/e-components/EForm";
import { EFields } from "../../common/e-components/EFields";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
        tagMatchPrefix: string;
    }
};

const ComponentHttpHealthCheck: React.FC<GeneralProps> = ({ veri }) => {
    const [showExpectedStatuses, setShowExpectedStatuses] = useState<boolean>(false);
    const [showRetriableStatuses, setShowRetriableStatuses] = useState<boolean>(false);
    const [showReceive, setShowReceive] = useState<boolean>(false);
    const { vTags } = useTags(veri.version, modtag_http_health_check);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.hh?.HealthCheck_HttpHealthCheck,
            sf: vTags.hh?.HealthCheck_HttpHealthCheck_SingleFields,
            ssn: { "request_headers_to_remove": 6 }
        }),
        { tag: "expected_statuses", type: FieldTypes.ArrayIcon, fieldPath: 'expected_statuses', spanNum: 4, drawerShow: () => { setShowExpectedStatuses(true); }, },
        { tag: "retriable_statuses", type: FieldTypes.ArrayIcon, fieldPath: 'retriable_statuses', spanNum: 4, drawerShow: () => { setShowRetriableStatuses(true); }, },
        { tag: "receive", type: FieldTypes.ArrayIcon, fieldPath: 'receive', spanNum: 4, drawerShow: () => { setShowReceive(true); }, },
    ]

    return (
        <ECard title="HTTP Health Check">
            <HorizonTags veri={{
                tags: vTags.hh?.HealthCheck_HttpHealthCheck,
                unsupportedTags: modtag_us_cluster["HttpHealthCheck"],
                selectedTags: selectedTags,
                keyPrefix: veri.keyPrefix,
                handleChangeTag: handleChangeTag,
                tagMatchPrefix: veri.tagMatchPrefix,
                required: ["path"]
            }} />
            <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
            <Row>
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
                        shouldRender={selectedTags.includes("request_headers_to_add")}
                        Component={HeaderToAdd}
                        componentProps={{
                            version: veri.version,
                            reduxStore: veri.reduxStore?.request_headers_to_add,
                            keyPrefix: veri.keyPrefix ? `${veri.keyPrefix}.request_headers_to_add` : "request_headers_to_add",
                            reduxAction: ResourceAction,
                            id: veri.keyPrefix ? `${veri.keyPrefix}.request_headers_to_add` : "request_headers_to_add",
                        }}
                    />
                    <ConditionalComponent
                        shouldRender={startsWithAny("service_name_matcher", selectedTags)}
                        Component={CommonComponentStringMatcher}
                        componentProps={{
                            version: veri.version,
                            reduxAction: ResourceAction,
                            reduxStore: navigateCases(veri.reduxStore, "service_name_matcher"),
                            keyPrefix: `${veri.keyPrefix}.service_name_matcher`,
                            tagMatchPrefix: `${veri.tagMatchPrefix}.service_name_matcher`,
                            title: "Service Name Matcher",
                            id: `${veri.keyPrefix}.service_name_matcher`,
                        }}
                    />
                </Col>
            </Row>
            {
                startsWithAny("expected_statuses", selectedTags) &&
                <CommonComponentArrayRange key="expected_statuses" veri={{
                    version: veri.version,
                    keyPrefix: `${veri.keyPrefix}.expected_statuses`,
                    drawerOpen: showExpectedStatuses,
                    reduxStore: veri.reduxStore?.expected_statuses,
                    drawerClose: () => { setShowExpectedStatuses(false); }
                }} />
            }
            {
                startsWithAny("retriable_statuses", selectedTags) &&
                <CommonComponentArrayRange key="retriable_statuses" veri={{
                    version: veri.version,
                    keyPrefix: `${veri.keyPrefix}.retriable_statuses`,
                    drawerOpen: showRetriableStatuses,
                    reduxStore: veri.reduxStore?.retriable_statuses,
                    drawerClose: () => { setShowRetriableStatuses(false); }
                }} />
            }
            {
                startsWithAny("receive", selectedTags) &&
                <CommonComponentPayloadSlice key="receive" veri={{
                    version: veri.version,
                    keyPrefix: `${veri.keyPrefix}.receive`,
                    drawerOpen: showReceive,
                    reduxStore: veri.reduxStore?.receive,
                    reduxAction: ResourceAction,
                    tagMatchPrefix: `${veri.tagMatchPrefix}.receive`,
                    drawerClose: () => { setShowReceive(false); },
                    title: "Receive",
                }} />
            }
        </ECard>
    )
};


export default memorizeComponent(ComponentHttpHealthCheck, compareVeri);