import React from "react";
import { useLocation } from "react-router-dom";
import { Col, Row, Divider } from "antd";
import { HeadOfResource } from "@/elchi/components/common/HeadOfResources";
import CommonComponentSingleOptions from "@/elchi/components/resources/common/SingleOptions/SingleOptions";
import CustomAnchor from "@/elchi/components/common/CustomAnchor";
import { GTypes } from "@/common/statics/gtypes";
import { useGTypeFields } from "@/hooks/useGtypes";
import { FieldConfigType, startsWithAny } from "@/utils/tools";
import useResourceMain from "@/hooks/useResourceMain";
import { useModels } from "@/hooks/useModels";
import { useTags } from "@/hooks/useTags";
import { generateFields } from "@/common/generate-fields";
import RenderLoading from "@/elchi/components/common/Loading";
import { modtag_stateful_session } from "./_modtag_";
import { useLoading } from "@/hooks/loadingContext";
import { useManagedLoading } from "@/hooks/useManageLoading";
import ComponentSessionStateLink from "@/elchi/components/resources/extension/session-state/SessionStateLink";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";


type GeneralProps = {
    veri: {
        version: string;
        queryResource: any;
        generalName: string;
        changeGeneralName: any;
    }
};

const ComponentStatefulSession: React.FC<GeneralProps> = ({ veri }) => {
    const GType = useGTypeFields(GTypes.StatefulSession);
    const location = useLocation();
    const { vModels, loading_m } = useModels(veri.version, modtag_stateful_session);
    const { vTags, loading } = useTags(veri.version, modtag_stateful_session);
    const { loadingCount } = useLoading();
    const { reduxStore, selectedTags, handleChangeTag } = useResourceMain({
        version: veri.version,
        alias: "ss",
        vModels,
        vTags,
        modelName: "StatefulSession",
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.ss?.StatefulSession,
            sf: vTags.ss?.StatefulSession_SingleFields,
        })
    ];

    useManagedLoading(loading, loading_m);
    if (loadingCount > 0) {
        return <RenderLoading checkPage={true} isLoadingQuery={true} error={""} />;
    }

    return (
        reduxStore && (
            <>
                <HeadOfResource
                    generalName={veri.generalName}
                    version={veri.version}
                    changeGeneralName={veri.changeGeneralName}
                    locationCheck={location.pathname === GType.createPath}
                    createUpdate={{
                        location_path: location.pathname,
                        GType: GType,
                        offset: 0,
                        name: veri.generalName,
                        reduxStore: reduxStore,
                        voidToJSON: vModels.ss?.StatefulSession.toJSON,
                        queryResource: veri.queryResource,
                        envoyVersion: veri.version,
                        gtype: reduxStore?.$type,
                    }}
                />
                <Divider type="horizontal" orientation="left" orientationMargin="0">Stateful Session</Divider>
                <Row>
                    <Col md={4} style={{ display: "block", maxHeight: "auto", overflowY: "auto" }}>
                        <CustomAnchor
                            resourceConfKeys={vTags.ss?.StatefulSession}
                            singleOptionKeys={vTags.ss?.StatefulSession_SingleFields}
                            selectedTags={selectedTags}
                            index={0}
                            handleChangeTag={handleChangeTag}
                            tagMatchPrefix={"StatefulSession"}
                        />
                    </Col>
                    <Col md={20}>
                        <ConditionalComponent
                            shouldRender={startsWithAny("session_state", selectedTags)}
                            Component={ComponentSessionStateLink}
                            componentProps={{
                                version: veri.version,
                                reduxStore: reduxStore?.session_state,
                                keyPrefix: `session_state`,
                                prettyName: "Session State",
                                id: `session_state_0`,
                            }}
                        />
                        <ConditionalComponent
                            shouldRender={selectedTags?.some(item => vTags.ss?.StatefulSession_SingleFields?.includes(item))}
                            Component={CommonComponentSingleOptions}
                            componentProps={{
                                version: veri.version,
                                selectedTags: selectedTags,
                                fieldConfigs: fieldConfigs,
                                reduxStore: reduxStore,
                                id: `single_options_0`,
                            }}
                        />
                    </Col>
                </Row>
            </>
        )
    );
}

export default React.memo(ComponentStatefulSession);
