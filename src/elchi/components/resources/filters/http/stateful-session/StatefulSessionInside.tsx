import React from "react";
import { Col, Divider } from "antd";
import { useTags } from "@/hooks/useTags";
import { modtag_stateful_session } from "./_modtag_";
import useResourceForm from "@/hooks/useResourceForm";
import { generateFields } from "@/common/generate-fields";
import { FieldConfigType, startsWithAny } from "@/utils/tools";
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import ECard from "@/elchi/components/common/ECard";
import ComponentSessionStateLink from "@/elchi/components/resources/extension/session-state/SessionStateLink";
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

const ComponentStatefulSessionIn: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_stateful_session);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.ss?.StatefulSession,
            sf: vTags.ss?.StatefulSession_SingleFields,
        }),
    ];

    return (
        <>
            <ECard title="Stateful Session">
                <HorizonTags veri={{
                    tags: vTags.ss?.StatefulSession,
                    selectedTags: selectedTags,
                    handleChangeTag: handleChangeTag,
                    keyPrefix: veri.keyPrefix,
                }} />
                <Divider type="horizontal" style={{ marginBottom: 5, marginTop: 5 }} />
                <Col md={24}>
                    <ConditionalComponent
                        shouldRender={startsWithAny("session_state", selectedTags)}
                        Component={ComponentSessionStateLink}
                        componentProps={{
                            version: veri.version,
                            reduxStore: veri.reduxStore?.session_state,
                            keyPrefix: `${veri.keyPrefix}.session_state`,
                            prettyName: "Session State",
                            id: `session_state_0`,
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
        </>
    );
}

export default React.memo(ComponentStatefulSessionIn);
