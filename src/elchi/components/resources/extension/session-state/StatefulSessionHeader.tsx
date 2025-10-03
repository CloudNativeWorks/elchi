import React from "react";
import { useLocation } from "react-router-dom";
import { Col, Row, Divider } from "antd";
import { HeadOfResource } from "@/elchi/components/common/HeadOfResources";
import CustomAnchor from "@/elchi/components/common/CustomAnchor";
import { GTypes } from "@/common/statics/gtypes";
import { useGTypeFields } from "@/hooks/useGtypes";
import useResourceMain from "@/hooks/useResourceMain";
import { useModels } from "@/hooks/useModels";
import { useTags } from "@/hooks/useTags";
import { modtag_stateful_session_header } from "./_modtag_";
import RenderLoading from "@/elchi/components/common/Loading";
import { useLoading } from "@/hooks/loadingContext";
import { useManagedLoading } from "@/hooks/useManageLoading";
import CommonComponentName from "@/elchi/components/resources/common/Name/Name";
import { ResourceAction } from "@/redux/reducers/slice";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";


type GeneralProps = {
    veri: {
        version: string;
        gtype: string;
        queryResource: any;
        generalName: string;
        changeGeneralName: any;
    }
};

const ComponenStatefulSessionHeader: React.FC<GeneralProps> = ({ veri }) => {
    const GType = useGTypeFields(GTypes.HeaderBasedSessionState);
    const location = useLocation();
    const { vModels, loading_m } = useModels(veri.version, modtag_stateful_session_header);
    const { vTags, loading } = useTags(veri.version, modtag_stateful_session_header);
    const { loadingCount } = useLoading();
    const { reduxStore, selectedTags, handleChangeTag } = useResourceMain({
        version: veri.version,
        alias: "ssh",
        vModels,
        vTags,
        modelName: "HeaderBasedSessionState",
    });

    useManagedLoading(loading, loading_m);
    if (loadingCount > 0) {
        return <RenderLoading checkPage={true} isLoadingQuery={!vModels || !vTags || loading} error={""} />;
    }

    return (
        <>
            <HeadOfResource
                generalName={veri.generalName}
                changeGeneralName={veri.changeGeneralName}
                version={veri.version}
                locationCheck={GType.createPath === location.pathname}
                createUpdate={{
                    location_path: location.pathname,
                    GType: GType,
                    offset: 0,
                    name: veri.generalName,
                    reduxStore: reduxStore,
                    voidToJSON: vModels.ssh?.HeaderBasedSessionState.toJSON,
                    queryResource: veri.queryResource,
                    envoyVersion: veri.version,
                    gtype: reduxStore?.$type,
                }}
            />
            <Divider type="horizontal" orientation="left" orientationMargin="0">Header Based Session State</Divider>
            <Row>
                <Col md={4} style={{ display: "block", maxHeight: "auto", overflowY: "auto" }}>
                    <CustomAnchor
                        resourceConfKeys={vTags.ssh?.HeaderBasedSessionState}
                        selectedTags={selectedTags}
                        index={0}
                        handleChangeTag={handleChangeTag}
                        tagMatchPrefix={"HeaderBasedSessionState"}
                        required={["name"]}
                    />
                </Col>
                <Col md={20}>
                    <ConditionalComponent
                        shouldRender={selectedTags?.includes("name")}
                        Component={CommonComponentName}
                        componentProps={{
                            version: veri.version,
                            title: "name",
                            reduxAction: ResourceAction,
                            reduxStore: reduxStore?.name,
                            id: `name_0`,
                        }}
                    />
                </Col>
            </Row>
        </>
    )
}

export default React.memo(ComponenStatefulSessionHeader);