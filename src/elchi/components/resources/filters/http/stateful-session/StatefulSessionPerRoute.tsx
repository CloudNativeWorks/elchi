import React from "react";
import { useLocation } from "react-router-dom";
import { Col, Row, Divider } from "antd";
import { HeadOfResource } from "@/elchi/components/common/HeadOfResources";
import CustomAnchor from "@/elchi/components/common/CustomAnchor";
import { GTypes } from "@/common/statics/gtypes";
import { useGTypeFields } from "@/hooks/useGtypes";
import { FieldConfigType, startsWithAny } from "@/utils/tools";
import useResourceMain from "@/hooks/useResourceMain";
import { useModels } from "@/hooks/useModels";
import { useTags } from "@/hooks/useTags";
import RenderLoading from "@/elchi/components/common/Loading";
import { modtag_stateful_session_per_route } from "./_modtag_";
import { useLoading } from "@/hooks/loadingContext";
import { useManagedLoading } from "@/hooks/useManageLoading";
import { generateFields } from "@/common/generate-fields";
import CommonComponentSingleOptions from "@/elchi/components/resources/common/SingleOptions/SingleOptions";
import ComponentStatefulSessionIn from "./StatefulSessionInside";
import { navigateCases } from "@/elchi/helpers/navigate-cases";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";


type GeneralProps = {
    veri: {
        version: string;
        queryResource: any;
        generalName: string;
        changeGeneralName: any;
    }
};

const ComponentStatefulSessionPerRoute: React.FC<GeneralProps> = ({ veri }) => {
    const GType = useGTypeFields(GTypes.StatefulSessionPerRoute);
    const location = useLocation();
    const { vModels, loading_m } = useModels(veri.version, modtag_stateful_session_per_route);
    const { vTags, loading } = useTags(veri.version, modtag_stateful_session_per_route);
    const { loadingCount } = useLoading();
    const { reduxStore, selectedTags, handleChangeTag } = useResourceMain({
        version: veri.version,
        alias: "sspr",
        vModels,
        vTags,
        modelName: "StatefulSessionPerRoute",
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.sspr?.StatefulSessionPerRoute,
            sf: vTags.sspr?.StatefulSessionPerRoute_SingleFields,
        })
    ];

    useManagedLoading(loading, loading_m);
    if (loadingCount > 0) {
        return <RenderLoading checkPage={true} isLoadingQuery={true} error={""} />;
    }

    return (
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
                    voidToJSON: vModels.sspr?.StatefulSessionPerRoute.toJSON,
                    queryResource: veri.queryResource,
                    envoyVersion: veri.version,
                    gtype: reduxStore?.$type,
                }}
            />
            <Divider type="horizontal" orientation="left" orientationMargin="0">Stateful Session Per Route</Divider>
            <Row>
                <Col md={4}>
                    <CustomAnchor
                        resourceConfKeys={vTags.sspr?.StatefulSessionPerRoute}
                        singleOptionKeys={["disabled"]}
                        selectedTags={selectedTags}
                        index={0}
                        handleChangeTag={handleChangeTag}
                        tagMatchPrefix={"StatefulSessionPerRoute"}
                        tagPrefix={"override"}
                        onlyOneTag={[["override.disabled", "override.stateful_session"]]}
                    />
                </Col>
                <Col md={20}>
                    <ConditionalComponent
                        shouldRender={selectedTags?.some(item => vTags.sspr?.StatefulSessionPerRoute_SingleFields?.includes(item))}
                        Component={CommonComponentSingleOptions}
                        componentProps={{
                            version: veri.version,
                            selectedTags: selectedTags,
                            fieldConfigs: fieldConfigs,
                            reduxStore: reduxStore,
                            id: `single_options_0`,
                        }}
                    />
                    <ConditionalComponent
                        shouldRender={startsWithAny("override.stateful_session", selectedTags)}
                        Component={ComponentStatefulSessionIn}
                        componentProps={{
                            version: veri.version,
                            reduxStore: navigateCases(reduxStore, "override.stateful_session"),
                            keyPrefix: `stateful_session`,
                            id: `stateful_session_0`,
                        }}
                    />
                </Col>
            </Row>
        </>
    );
}

export default React.memo(ComponentStatefulSessionPerRoute);