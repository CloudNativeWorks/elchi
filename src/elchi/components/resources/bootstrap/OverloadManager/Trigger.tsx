import React, { useState, useCallback } from "react";
import { Col, Row, Divider } from "antd";
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import useResourceForm from "@/hooks/useResourceForm";
import { useTags } from "@/hooks/useTags";
import { modtag_trigger } from "../_modtag_";
import { EForm } from "../../../common/e-components/EForm";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";
import { matchesEndOrStartOf } from "@/utils/tools";
import { FieldComponent } from "@/elchi/components/common/FormItems";
import { FieldTypes } from "@/common/statics/general";
import { useCustomGetQuery } from "@/common/api";
import { useProjectVariable } from "@/hooks/useProjectVariable";
import { debounce } from "lodash";
import ComponentThresholdTrigger from "./ThresholdTrigger";
import ComponentScaledTrigger from "./ScaledTrigger";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
        tagMatchPrefix: string;
    }
};

const ComponentTrigger: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_trigger);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });
    const { project } = useProjectVariable();

    const [searchQuery, setSearchQuery] = useState<string>('');
    const debouncedSearch = useCallback(debounce((value: string) => setSearchQuery(value), 300), []);

    const { data: queryData } = useCustomGetQuery({
        queryKey: `custom_resource_monitors_trigger_${searchQuery}`,
        enabled: true,
        path: `custom/resource_list_search?collection=extensions&category=envoy.resource_monitors&version=${veri.version}&project=${project}&search=${searchQuery}`
    });

    return (
        <>
            <HorizonTags veri={{
                tags: vTags.tr?.Trigger,
                unsupportedTags: ['name'],
                selectedTags: selectedTags,
                keyPrefix: veri.keyPrefix,
                handleChangeTag: handleChangeTag,
                specificTagPrefix: { "threshold": "trigger_oneof", "scaled": "trigger_oneof" },
                onlyOneTag: [['trigger_oneof.threshold', 'trigger_oneof.scaled']]
            }} />
            <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
            <Row>
                <Col md={24}>
                    <EForm>
                        <FieldComponent
                            veri={{
                                alwaysShow: true,
                                selectedTags: [],
                                handleChange: handleChangeRedux,
                                tag: "name",
                                value: veri.reduxStore?.name,
                                type: FieldTypes.Select,
                                placeholder: "(Resource Monitor Name)",
                                values: queryData?.map((obj: any) => obj.canonical_name) || [],
                                keyPrefix: veri.keyPrefix,
                                spanNum: 24,
                                required: true,
                                displayName: "Resource Monitor Name",
                                onSearch: debouncedSearch,
                            }}
                        />
                    </EForm>

                    <ConditionalComponent
                        shouldRender={matchesEndOrStartOf("trigger_oneof.threshold", selectedTags)}
                        Component={ComponentThresholdTrigger}
                        componentProps={{
                            version: veri.version,
                            keyPrefix: `${veri.keyPrefix}.threshold`,
                            tagMatchPrefix: `${veri.tagMatchPrefix}.threshold`,
                            reduxStore: veri.reduxStore?.trigger_oneof?.threshold,
                            id: `threshold_trigger_0`,
                            title: "Threshold Trigger",
                        }}
                    />

                    <ConditionalComponent
                        shouldRender={matchesEndOrStartOf("trigger_oneof.scaled", selectedTags)}
                        Component={ComponentScaledTrigger}
                        componentProps={{
                            version: veri.version,
                            keyPrefix: `${veri.keyPrefix}.scaled`,
                            tagMatchPrefix: `${veri.tagMatchPrefix}.scaled`,
                            reduxStore: veri.reduxStore?.trigger_oneof?.scaled,
                            id: `scaled_trigger_0`,
                            title: "Scaled Trigger",
                        }}
                    />
                </Col>
            </Row>
        </>
    )
};


export default memorizeComponent(ComponentTrigger, compareVeri);
