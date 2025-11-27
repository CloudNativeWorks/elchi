import React from "react";
import { useLocation } from "react-router-dom";
import { Col, Row, Divider } from "antd";
import { HeadOfResource } from "@/elchi/components/common/HeadOfResources";
import { GTypes } from "@/common/statics/gtypes";
import { useGTypeFields } from "@/hooks/useGtypes";
import { FieldConfigType } from "@/utils/tools";
import { modtag_dynamic_forward_proxy_per_route } from "./_modtag_per_route";
import { useModels } from "@/hooks/useModels";
import { useTags } from "@/hooks/useTags";
import useResourceMain from "@/hooks/useResourceMain";
import CustomAnchor from "@/elchi/components/common/CustomAnchor";
import { generateFields } from "@/common/generate-fields";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";
import CommonComponentSingleOptions from "@/elchi/components/resources/common/SingleOptions/SingleOptions";
import RenderLoading from "@/elchi/components/common/Loading";
import { useLoading } from "@/hooks/loadingContext";
import { useManagedLoading } from "@/hooks/useManageLoading";


type GeneralProps = {
    veri: {
        version: string;
        queryResource: any;
        generalName: string;
        changeGeneralName: any;
    }
};

const ComponentDynamicForwardProxyPerRoute: React.FC<GeneralProps> = ({ veri }) => {
    const GType = useGTypeFields(GTypes.HttpDynamicForwardProxyPerRoute);
    const location = useLocation();
    const { vModels, loading_m } = useModels(veri.version, modtag_dynamic_forward_proxy_per_route);
    const { vTags, loading } = useTags(veri.version, modtag_dynamic_forward_proxy_per_route);
    const { loadingCount } = useLoading();
    const { reduxStore, selectedTags, handleChangeTag } = useResourceMain({
        version: veri.version,
        alias: "dfppr",
        vModels,
        vTags,
        modelName: "PerRouteConfig",
    });

    useManagedLoading(loading, loading_m);
    if (loadingCount > 0) {
        return <RenderLoading checkPage={true} isLoadingQuery={true} error={""} />;
    }

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.dfppr?.PerRouteConfig,
            sf: vTags.dfppr?.PerRouteConfig_SingleFields,
        }),
    ];

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
                    voidToJSON: vModels.dfppr?.PerRouteConfig.toJSON,
                    queryResource: veri.queryResource,
                    envoyVersion: veri.version,
                    gtype: reduxStore?.$type,
                }}
            />
            <Divider type="horizontal" orientation="left" orientationMargin="0">Http Dynamic Forward Proxy Per Route</Divider>
            <Row>
                <Col md={4} style={{ display: "block", maxHeight: "auto", overflowY: "auto" }}>
                    <CustomAnchor
                        resourceConfKeys={vTags.dfppr?.PerRouteConfig}
                        singleOptionKeys={vTags.dfppr?.PerRouteConfig_SingleFields}
                        selectedTags={selectedTags}
                        index={0}
                        handleChangeTag={handleChangeTag}
                        onlyOneTag={[['host_rewrite_specifier.host_rewrite_literal', 'host_rewrite_specifier.host_rewrite_header']]}
                        specificTagPrefix={{
                            'host_rewrite_literal': 'host_rewrite_specifier',
                            'host_rewrite_header': 'host_rewrite_specifier'
                        }}
                    />
                </Col>
                <Col md={20}>
                    <ConditionalComponent
                        shouldRender={selectedTags?.some(item => vTags.dfppr?.PerRouteConfig_SingleFields?.includes(item))}
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
    );
}

export default React.memo(ComponentDynamicForwardProxyPerRoute);
