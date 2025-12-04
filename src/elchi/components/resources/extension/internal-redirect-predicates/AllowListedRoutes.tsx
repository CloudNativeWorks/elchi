import React from "react";
import { useLocation } from "react-router-dom";
import { Col, Row, Divider } from "antd";
import { HeadOfResource } from "@/elchi/components/common/HeadOfResources";
import CustomAnchor from "@/elchi/components/common/CustomAnchor";
import { GTypes } from "@/common/statics/gtypes";
import { useGTypeFields } from "@/hooks/useGtypes";
import { FieldConfigType, dummyToJSON } from "@/utils/tools";
import useResourceMain from "@/hooks/useResourceMain";
import { useModels } from "@/hooks/useModels";
import { useTags } from "@/hooks/useTags";
import { modtag_allow_listed_routes } from "./_modtag_";
import RenderLoading from "@/elchi/components/common/Loading";
import { generateFields } from "@/common/generate-fields";
import { useLoading } from "@/hooks/loadingContext";
import { useManagedLoading } from "@/hooks/useManageLoading";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";
import CommonComponentSingleOptions from "@elchi/components/resources/common/SingleOptions/SingleOptions";


type GeneralProps = {
    veri: {
        version: string;
        gtype: string;
        queryResource: any;
        generalName: string;
        changeGeneralName: any;
    }
};

const ComponentAllowListedRoutes: React.FC<GeneralProps> = ({ veri }) => {
    const GType = useGTypeFields(GTypes.AllowListedRoutesInternalRedirect);
    const location = useLocation();
    const { vModels, loading_m } = useModels(veri.version, modtag_allow_listed_routes);
    const { vTags, loading } = useTags(veri.version, modtag_allow_listed_routes);
    const { loadingCount } = useLoading();
    const { reduxStore, selectedTags, handleChangeTag } = useResourceMain({
        version: veri.version,
        alias: "alr",
        vModels,
        vTags,
        modelName: "AllowListedRoutesConfig",
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.alr?.AllowListedRoutesConfig,
            sf: vTags.alr?.AllowListedRoutesConfig_SingleFields,
            ssn: { "allowed_route_names": 24 }
        })
    ];

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
                    voidToJSON: dummyToJSON,
                    queryResource: veri.queryResource,
                    envoyVersion: veri.version,
                    gtype: reduxStore?.$type,
                }}
            />
            <Divider type="horizontal" orientation="left" orientationMargin="0">Allow Listed Routes Config</Divider>
            <Row>
                <Col md={4} style={{ display: "block", maxHeight: "auto", overflowY: "auto" }}>
                    <CustomAnchor
                        resourceConfKeys={vTags.alr?.AllowListedRoutesConfig}
                        singleOptionKeys={vTags.alr?.AllowListedRoutesConfig_SingleFields}
                        selectedTags={selectedTags}
                        index={0}
                        handleChangeTag={handleChangeTag}
                        tagMatchPrefix={"AllowListedRoutesConfig"}
                    />
                </Col>
                <Col md={20}>
                    <ConditionalComponent
                        shouldRender={selectedTags?.some(item => vTags.alr?.AllowListedRoutesConfig_SingleFields?.includes(item))}
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
};

export default React.memo(ComponentAllowListedRoutes);
