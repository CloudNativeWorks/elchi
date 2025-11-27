import React from "react";
import { useLocation } from "react-router-dom";
import { Col, Row, Divider } from "antd";
import { HeadOfResource } from "@/elchi/components/common/HeadOfResources";
import { GTypes } from "@/common/statics/gtypes";
import { useGTypeFields } from "@/hooks/useGtypes";
import { FieldConfigType, startsWithAny } from "@/utils/tools";
import { modtag_dynamic_forward_proxy, modtag_excluded_dynamic_forward_proxy } from "./_modtag_";
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
import { navigateCases } from "@/elchi/helpers/navigate-cases";
import ComponentDnsCacheConfig from "../../../common/DnsCacheConfig/DnsCacheConfig";
import ComponentSubClusterConfig from "./SubClusterConfig/SubClusterConfig";
import { ResourceAction } from "@/redux/reducers/slice";


type GeneralProps = {
    veri: {
        version: string;
        queryResource: any;
        generalName: string;
        changeGeneralName: any;
    }
};

const ComponentHttpDynamicForwardProxy: React.FC<GeneralProps> = ({ veri }) => {
    const GType = useGTypeFields(GTypes.HttpDynamicForwardProxy);
    const location = useLocation();
    const { vModels, loading_m } = useModels(veri.version, modtag_dynamic_forward_proxy);
    const { vTags, loading } = useTags(veri.version, modtag_dynamic_forward_proxy);
    const { loadingCount } = useLoading();
    const { reduxStore, selectedTags, handleChangeTag } = useResourceMain({
        version: veri.version,
        alias: "dfp",
        vModels,
        vTags,
        modelName: "FilterConfig",
    });

    useManagedLoading(loading, loading_m);
    if (loadingCount > 0) {
        return <RenderLoading checkPage={true} isLoadingQuery={true} error={""} />;
    }

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.dfp?.FilterConfig,
            sf: vTags.dfp?.FilterConfig_SingleFields,
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
                    voidToJSON: vModels.dfp?.FilterConfig.toJSON,
                    queryResource: veri.queryResource,
                    envoyVersion: veri.version,
                    gtype: reduxStore?.$type,
                }}
            />
            <Divider type="horizontal" orientation="left" orientationMargin="0">Http Dynamic Forward Proxy</Divider>
            <Row>
                <Col md={4} style={{ display: "block", maxHeight: "auto", overflowY: "auto" }}>
                    <CustomAnchor
                        resourceConfKeys={vTags.dfp?.FilterConfig}
                        singleOptionKeys={vTags.dfp?.FilterConfig_SingleFields}
                        selectedTags={selectedTags}
                        index={0}
                        handleChangeTag={handleChangeTag}
                        tagMatchPrefix={"FilterConfig"}
                        unsuportedTags={modtag_excluded_dynamic_forward_proxy}
                        onlyOneTag={[['implementation_specifier.dns_cache_config', 'implementation_specifier.sub_cluster_config']]}
                        specificTagPrefix={{
                            'dns_cache_config': 'implementation_specifier',
                            'sub_cluster_config': 'implementation_specifier'
                        }}
                    />
                </Col>
                <Col md={20}>
                    <ConditionalComponent
                        shouldRender={selectedTags?.some(item => vTags.dfp?.FilterConfig_SingleFields.includes(item))}
                        Component={CommonComponentSingleOptions}
                        componentProps={{
                            version: veri.version,
                            selectedTags: selectedTags,
                            fieldConfigs: fieldConfigs,
                            reduxStore: reduxStore,
                            id: `single_options_0`,
                        }}
                    />

                    {startsWithAny("implementation_specifier.dns_cache_config", selectedTags) && (
                        <ComponentDnsCacheConfig veri={{
                            version: veri.version,
                            reduxStore: navigateCases(reduxStore, "implementation_specifier.dns_cache_config"),
                            keyPrefix: "dns_cache_config",
                            reduxAction: ResourceAction,
                            title: "DNS Cache Configuration"
                        }} />
                    )}

                    {startsWithAny("implementation_specifier.sub_cluster_config", selectedTags) && (
                        <ComponentSubClusterConfig veri={{
                            version: veri.version,
                            reduxStore: navigateCases(reduxStore, "implementation_specifier.sub_cluster_config"),
                            keyPrefix: "sub_cluster_config",
                            reduxAction: ResourceAction,
                            title: "Sub Cluster Configuration"
                        }} />
                    )}
                </Col>
            </Row>
        </>
    );
}

export default React.memo(ComponentHttpDynamicForwardProxy);
