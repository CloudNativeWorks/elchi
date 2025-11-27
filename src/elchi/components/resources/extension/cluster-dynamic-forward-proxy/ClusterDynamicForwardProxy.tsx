import React from "react";
import { useLocation } from "react-router-dom";
import { Divider, Row, Col } from 'antd';
import { FieldConfigType, startsWithAny } from "@/utils/tools";
import { HeadOfResource } from "@/elchi/components/common/HeadOfResources";
import { ResourceAction } from "@/redux/reducers/slice";
import { navigateCases } from "@/elchi/helpers/navigate-cases";
import { GTypes } from "@/common/statics/gtypes";
import { useGTypeFields } from "@/hooks/useGtypes";
import { useModels } from "@/hooks/useModels";
import { useTags } from "@/hooks/useTags";
import { modtag_cluster_dynamic_forward_proxy } from "./_modtag_";
import { generateFields } from "@/common/generate-fields";
import useResourceMain from "@/hooks/useResourceMain";
import CustomAnchor from "@/elchi/components/common/CustomAnchor";
import ComponentDnsCacheConfig from "../../common/DnsCacheConfig/DnsCacheConfig";
import ComponentSubClustersConfig from "./SubClustersConfig";
import RenderLoading from "@/elchi/components/common/Loading";
import { useLoading } from "@/hooks/loadingContext";
import { useManagedLoading } from "@/hooks/useManageLoading";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";
import CommonComponentSingleOptions from "@/elchi/components/resources/common/SingleOptions/SingleOptions";


type GeneralProps = {
    veri: {
        version: string;
        gtype: string;
        queryResource: any;
        generalName: string;
        changeGeneralName: any;
    }
};

const modtag_excluded_cluster_dynamic_forward_proxy = [
    'dns_cache_config',
    'sub_clusters_config',
];

const ComponentClusterDynamicForwardProxy: React.FC<GeneralProps> = ({ veri }) => {
    const GType = useGTypeFields(GTypes.ClusterDynamicForwardProxy);
    const location = useLocation();
    const { vModels, loading_m } = useModels(veri.version, modtag_cluster_dynamic_forward_proxy);
    const { vTags, loading } = useTags(veri.version, modtag_cluster_dynamic_forward_proxy);
    const { loadingCount } = useLoading();
    const { reduxStore, selectedTags, handleChangeTag } = useResourceMain({
        version: veri.version,
        alias: "cdfp",
        vModels,
        vTags,
        modelName: "ClusterConfig",
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.cdfp?.ClusterConfig,
            sf: vTags.cdfp?.ClusterConfig_SingleFields,
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
                changeGeneralName={veri.changeGeneralName}
                version={veri.version}
                locationCheck={GType.createPath === location.pathname}
                createUpdate={{
                    location_path: location.pathname,
                    GType: GType,
                    offset: 0,
                    name: veri.generalName,
                    reduxStore: reduxStore,
                    voidToJSON: vModels.cdfp?.ClusterConfig.toJSON,
                    queryResource: veri.queryResource,
                    envoyVersion: veri.version,
                    gtype: reduxStore?.$type,
                }}
            />
            <Divider type="horizontal" orientation="left" orientationMargin="0">Cluster Dynamic Forward Proxy</Divider>

            <Row>
                <Col md={4} style={{ display: "block", maxHeight: "auto", overflowY: "auto" }}>
                    <CustomAnchor
                        resourceConfKeys={vTags.cdfp?.ClusterConfig}
                        singleOptionKeys={vTags.cdfp?.ClusterConfig_SingleFields}
                        selectedTags={selectedTags}
                        index={0}
                        handleChangeTag={handleChangeTag}
                        specificTagPrefix={{ 'dns_cache_config': 'cluster_implementation_specifier', 'sub_clusters_config': 'cluster_implementation_specifier' }}
                        onlyOneTag={[['cluster_implementation_specifier.sub_clusters_config', 'cluster_implementation_specifier.dns_cache_config']]}
                        unsuportedTags={modtag_excluded_cluster_dynamic_forward_proxy}
                    />
                </Col>
                <Col md={20}>
                    <ConditionalComponent
                        shouldRender={selectedTags?.some(item => vTags.cdfp?.ClusterConfig_SingleFields.includes(item))}
                        Component={CommonComponentSingleOptions}
                        componentProps={{
                            version: veri.version,
                            selectedTags: selectedTags,
                            fieldConfigs: fieldConfigs,
                            reduxStore: reduxStore,
                            id: `single_options_0`
                        }}
                    />
                    {startsWithAny("cluster_implementation_specifier.dns_cache_config", selectedTags) && (
                        <ComponentDnsCacheConfig veri={{
                            version: veri.version,
                            reduxStore: navigateCases(reduxStore, "cluster_implementation_specifier.dns_cache_config"),
                            keyPrefix: "dns_cache_config",
                            reduxAction: ResourceAction,
                            title: "DNS Cache Configuration"
                        }} />
                    )}

                    {startsWithAny("cluster_implementation_specifier.sub_clusters_config", selectedTags) && (
                        <ComponentSubClustersConfig veri={{
                            version: veri.version,
                            reduxStore: navigateCases(reduxStore, "cluster_implementation_specifier.sub_clusters_config"),
                            keyPrefix: "sub_clusters_config",
                            reduxAction: ResourceAction,
                        }} />
                    )}
                </Col>
            </Row>


        </>
    )
};

export default React.memo(ComponentClusterDynamicForwardProxy);
