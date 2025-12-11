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
import RenderLoading from "@/elchi/components/common/Loading";
import { modtag_ext_authz_per_route } from "./_modtag_per_route";
import { useLoading } from "@/hooks/loadingContext";
import { useManagedLoading } from "@/hooks/useManageLoading";
import { startsWithAny } from "@/utils/tools";
import { generateFields } from "@/common/generate-fields";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";
import CommonComponentSingleOptions from "@/elchi/components/resources/common/SingleOptions/SingleOptions";
import ComponentCheckSettings from "./CheckSettings/CheckSettings";
import { ResourceAction } from "@/redux/reducers/slice";
import { navigateCases } from "@/elchi/helpers/navigate-cases";


type GeneralProps = {
    veri: {
        version: string;
        queryResource: any;
        generalName: string;
        changeGeneralName: any;
    }
};

const ComponentExtAuthzPerRoute: React.FC<GeneralProps> = ({ veri }) => {
    const GType = useGTypeFields(GTypes.HttpExtAuthzPerRoute);
    const location = useLocation();
    const { vModels, loading_m } = useModels(veri.version, modtag_ext_authz_per_route);
    const { vTags, loading } = useTags(veri.version, modtag_ext_authz_per_route);
    const { loadingCount } = useLoading();
    const { reduxStore, selectedTags, handleChangeTag } = useResourceMain({
        version: veri.version,
        alias: "eapr",
        vModels,
        vTags,
        modelName: "ExtAuthzPerRoute",
    });

    const fieldConfigs = [
        ...generateFields({
            f: vTags.eapr?.ExtAuthzPerRoute,
            sf: vTags.eapr?.ExtAuthzPerRoute_SingleFields,
        }),
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
                    voidToJSON: vModels.eapr?.ExtAuthzPerRoute.toJSON,
                    queryResource: veri.queryResource,
                    envoyVersion: veri.version,
                    gtype: reduxStore?.$type,
                }}
            />
            <Divider type="horizontal" orientation="left" orientationMargin="0">Http Ext Authz Per Route</Divider>
            <Row>
                <Col md={4} style={{ display: "block", maxHeight: "auto", overflowY: "auto" }}>
                    <CustomAnchor
                        resourceConfKeys={vTags.eapr?.ExtAuthzPerRoute}
                        singleOptionKeys={vTags.eapr?.ExtAuthzPerRoute_SingleFields}
                        selectedTags={selectedTags}
                        index={0}
                        handleChangeTag={handleChangeTag}
                        tagPrefix={"override"}
                        onlyOneTag={[["override.check_settings", "override.disabled"]]}
                    />
                </Col>
                <Col md={20}>
                    <ConditionalComponent
                        shouldRender={selectedTags?.some(item => vTags.eapr?.ExtAuthzPerRoute_SingleFields?.includes(item))}
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
                        shouldRender={startsWithAny("override.check_settings", selectedTags) || startsWithAny("check_settings", selectedTags)}
                        Component={ComponentCheckSettings}
                        componentProps={{
                            version: veri.version,
                            reduxStore: navigateCases(reduxStore, "override.check_settings"),
                            keyPrefix: "check_settings",
                            tagPrefix: "override",
                            reduxAction: ResourceAction,
                            title: "Check Settings",
                            id: "override_check_settings_0"
                        }}
                    />
                </Col>
            </Row>
        </>
    );
}

export default React.memo(ComponentExtAuthzPerRoute);
