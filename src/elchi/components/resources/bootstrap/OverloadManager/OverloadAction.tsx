import React from "react";
import { Col, Row, Divider } from "antd";
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import { matchesEndOrStartOf } from "@/utils/tools";
import useResourceForm from "@/hooks/useResourceForm";
import { useTags } from "@/hooks/useTags";
import { modtag_overload_action } from "../_modtag_";
import { EForm } from "../../../common/e-components/EForm";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";
import ComponentTriggers from "./Triggers";
import { FieldComponent } from "@/elchi/components/common/FormItems";
import { FieldTypes } from "@/common/statics/general";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
        tagMatchPrefix: string;
    }
};

const ComponentOverloadAction: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_overload_action);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const overloadActionNames = [
        "envoy.overload_actions.stop_accepting_requests",
        "envoy.overload_actions.disable_http_keepalive",
        "envoy.overload_actions.stop_accepting_connections",
        "envoy.overload_actions.reject_incoming_connections",
        "envoy.overload_actions.shrink_heap",
        "envoy.overload_actions.reduce_timeouts",
        "envoy.overload_actions.reset_high_memory_stream",
    ];

    return (
        <>
            <HorizonTags veri={{
                tags: vTags.oa?.OverloadAction,
                unsupportedTags: ['typed_config', 'name'],
                selectedTags: selectedTags,
                keyPrefix: veri.keyPrefix,
                handleChangeTag: handleChangeTag,
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
                                placeholder: "(Overload Action Name)",
                                values: overloadActionNames,
                                keyPrefix: veri.keyPrefix,
                                spanNum: 24,
                                required: true,
                                displayName: "Action Name",
                            }}
                        />
                    </EForm>

                    <ConditionalComponent
                        shouldRender={matchesEndOrStartOf("triggers", selectedTags)}
                        Component={ComponentTriggers}
                        componentProps={{
                            version: veri.version,
                            keyPrefix: `${veri.keyPrefix}.triggers`,
                            tagMatchPrefix: `${veri.tagMatchPrefix}.triggers`,
                            reduxStore: veri.reduxStore?.triggers,
                            id: `triggers_0`,
                            title: "Triggers",
                        }}
                    />
                </Col>
            </Row>
        </>
    )
};


export default memorizeComponent(ComponentOverloadAction, compareVeri);
