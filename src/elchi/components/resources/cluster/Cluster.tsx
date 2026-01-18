import React from "react";
import { useLocation } from "react-router-dom";
import { Col, Row, Divider } from "antd";
import { FieldConfigType, matchesEndOrStartOf } from "@/utils/tools";
import { HeadOfResource } from "@/elchi/components/common/HeadOfResources";
import { ResourceAction } from "@/redux/reducers/slice";
import { useGTypeFields } from "@/hooks/useGtypes";
import { GTypes } from "@/common/statics/gtypes";
import { useTags } from "@/hooks/useTags";
import CommonComponentName from '../common/Name/Name'
import CommonComponentSingleOptions from "@/elchi/components/resources/common/SingleOptions/SingleOptions";
import EdsClusterConfig from './EdsClusterConfig'
import CustomAnchor from "@/elchi/components/common/CustomAnchor";
import CommonComponentTransportSocket from '@elchi/components/resources/common/TransportSocket/transport_socket';
import ComponentOutlierDetection from './OutlierDetection';
import ComponentHealthChecks from './HealthChecks';
import ComponentLoadAssignment from './LoadAssignment';
import useResourceMain from "@/hooks/useResourceMain";
import RenderLoading from "../../common/Loading";
import { useModels } from "@/hooks/useModels";
import { modtag_cluster, modtag_r_cluster, modtag_us_cluster } from "./_modtag_";
import { generateFields } from "@/common/generate-fields";
import { useManagedLoading } from "@/hooks/useManageLoading";
import { useLoading } from "@/hooks/loadingContext";
import ComponentTypedExtensionProtocolOptions from './TypedExtensionProtocolOptions';
import ClusterDiscoveryType from './ClusterDiscoveryType';
import CircuitBreakers from './CircuitBreakers';
import ComponentUpstreamBindConfig from './UpstreamBindConfig/UpstreamBindConfig';
import ComponentCommonLbConfig from './CommonLbConfig/CommonLbConfig';
import ComponentUpstreamConnectionOptions from './UpstreamConnectionOptions/UpstreamConnectionOptions';
import ComponentTrackClusterStats from './TrackClusterStats/TrackClusterStats';
import ComponentPreconnectPolicy from './PreconnectPolicy/PreconnectPolicy';
import ComponentRingHashLbConfig from './LbConfig/RingHashLbConfig/RingHashLbConfig';
import ComponentMaglevLbConfig from './LbConfig/MaglevLbConfig/MaglevLbConfig';
import ComponentOriginalDstLbConfig from './LbConfig/OriginalDstLbConfig/OriginalDstLbConfig';
import ComponentLeastRequestLbConfig from './LbConfig/LeastRequestLbConfig/LeastRequestLbConfig';
import ComponentRoundRobinLbConfig from './LbConfig/RoundRobinLbConfig/RoundRobinLbConfig';
import { ConditionalComponent } from "../../common/ConditionalComponent";


type GeneralProps = {
    veri: {
        version: string;
        queryResource: any;
    }
};

const ClusterComponent: React.FC<GeneralProps> = ({ veri }) => {
    const GType = useGTypeFields(GTypes.Cluster);
    const location = useLocation();
    const { vModels, loading_m } = useModels(veri.version, modtag_cluster);
    const { vTags, loading } = useTags(veri.version, modtag_cluster);
    const { loadingCount } = useLoading();

    const { reduxStore, selectedTags, handleChangeTag } = useResourceMain({
        version: veri.version,
        alias: "c",
        vModels,
        vTags,
        modelName: "Cluster",
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.c?.Cluster,
            sf: vTags.c?.Cluster_SingleFields,
            e: ["name"],
            r: ["cluster_discovery_type.type"]
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
                    generalName={reduxStore?.name as string}
                    version={veri.version}
                    locationCheck={false}
                    createUpdate={{
                        location_path: location.pathname,
                        GType: GType,
                        offset: 0,
                        name: reduxStore?.name as string,
                        reduxStore: reduxStore,
                        voidToJSON: vModels.c.Cluster.toJSON,
                        queryResource: veri.queryResource,
                        envoyVersion: veri.version,
                        gtype: reduxStore?.$type,
                    }}
                />
                <Divider type="horizontal" orientation="left" orientationMargin="0">Cluster Configuration</Divider>
                <Row gutter={[2, 0]}>
                    <Col md={4} style={{ display: "block", maxHeight: "100vh", overflowY: "auto" }} className="custom-scrollbar-side">
                        <CustomAnchor
                            resourceConfKeys={vTags.c?.Cluster}
                            unsuportedTags={modtag_us_cluster["Cluster"]}
                            singleOptionKeys={vTags.c ? [...vTags.c?.Cluster_SingleFields?.filter((item: string) => !["name"].includes(item)), "type"] : []}
                            selectedTags={selectedTags}
                            index={0}
                            handleChangeTag={handleChangeTag}
                            specificTagPrefix={{
                                "type": "cluster_discovery_type",
                                "cluster_type": "cluster_discovery_type",
                                "ring_hash_lb_config": "lb_config",
                                "maglev_lb_config": "lb_config",
                                "original_dst_lb_config": "lb_config",
                                "least_request_lb_config": "lb_config",
                                "round_robin_lb_config": "lb_config"
                            }}
                            required={modtag_r_cluster['Cluster']}
                            onlyOneTag={[
                                ["cluster_discovery_type.type", "cluster_discovery_type.cluster_type"],
                                ["lb_config.ring_hash_lb_config", "lb_config.maglev_lb_config", "lb_config.original_dst_lb_config", "lb_config.least_request_lb_config", "lb_config.round_robin_lb_config"]
                            ]}
                            unchangeableTags={["name"]}
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
                                disabled: location.pathname !== GType.createPath,
                                id: "name_0"
                            }}
                        />
                        <ConditionalComponent
                            shouldRender={selectedTags?.some(item => (vTags.c?.Cluster_SingleFields?.includes(item) || item === "cluster_discovery_type.type") && item !== "name")}
                            Component={CommonComponentSingleOptions}
                            componentProps={{
                                version: veri.version,
                                selectedTags: selectedTags,
                                fieldConfigs: fieldConfigs,
                                reduxStore: reduxStore,
                                id: "single_options_0"
                            }}
                        />
                        <ConditionalComponent
                            shouldRender={matchesEndOrStartOf("cluster_discovery_type.cluster_type", selectedTags)}
                            Component={ClusterDiscoveryType}
                            componentProps={{
                                version: veri.version,
                                reduxStore: reduxStore?.cluster_discovery_type?.cluster_type,
                                id: "cluster_discovery_type_0"
                            }}
                        />
                        <ConditionalComponent
                            shouldRender={matchesEndOrStartOf("circuit_breakers", selectedTags)}
                            Component={CircuitBreakers}
                            componentProps={{
                                version: veri.version,
                                keyPrefix: `circuit_breakers`,
                                reduxStore: reduxStore?.circuit_breakers,
                                reduxAction: ResourceAction,
                                tagMatchPrefix: `Cluster.circuit_breakers`,
                                id: "circuit_breakers_0"
                            }}
                        />
                        <ConditionalComponent
                            shouldRender={matchesEndOrStartOf("upstream_bind_config", selectedTags)}
                            Component={ComponentUpstreamBindConfig}
                            componentProps={{
                                version: veri.version,
                                keyPrefix: `upstream_bind_config`,
                                reduxStore: reduxStore?.upstream_bind_config,
                                id: "upstream_bind_config_0"
                            }}
                        />
                        <ConditionalComponent
                            shouldRender={matchesEndOrStartOf("common_lb_config", selectedTags)}
                            Component={ComponentCommonLbConfig}
                            componentProps={{
                                version: veri.version,
                                keyPrefix: `common_lb_config`,
                                reduxStore: reduxStore?.common_lb_config,
                                id: "common_lb_config_0"
                            }}
                        />
                        <ConditionalComponent
                            shouldRender={matchesEndOrStartOf("upstream_connection_options", selectedTags)}
                            Component={ComponentUpstreamConnectionOptions}
                            componentProps={{
                                version: veri.version,
                                keyPrefix: `upstream_connection_options`,
                                reduxStore: reduxStore?.upstream_connection_options,
                                id: "upstream_connection_options_0"
                            }}
                        />
                        <ConditionalComponent
                            shouldRender={matchesEndOrStartOf("track_cluster_stats", selectedTags)}
                            Component={ComponentTrackClusterStats}
                            componentProps={{
                                version: veri.version,
                                keyPrefix: `track_cluster_stats`,
                                reduxStore: reduxStore?.track_cluster_stats,
                                id: "track_cluster_stats_0"
                            }}
                        />
                        <ConditionalComponent
                            shouldRender={matchesEndOrStartOf("preconnect_policy", selectedTags)}
                            Component={ComponentPreconnectPolicy}
                            componentProps={{
                                version: veri.version,
                                keyPrefix: `preconnect_policy`,
                                reduxStore: reduxStore?.preconnect_policy,
                                id: "preconnect_policy_0"
                            }}
                        />
                        <ConditionalComponent
                            shouldRender={matchesEndOrStartOf("lb_config.ring_hash_lb_config", selectedTags)}
                            Component={ComponentRingHashLbConfig}
                            componentProps={{
                                version: veri.version,
                                keyPrefix: `ring_hash_lb_config`,
                                reduxStore: reduxStore?.lb_config?.ring_hash_lb_config,
                                id: "ring_hash_lb_config_0"
                            }}
                        />
                        <ConditionalComponent
                            shouldRender={matchesEndOrStartOf("lb_config.maglev_lb_config", selectedTags)}
                            Component={ComponentMaglevLbConfig}
                            componentProps={{
                                version: veri.version,
                                keyPrefix: `maglev_lb_config`,
                                reduxStore: reduxStore?.lb_config?.maglev_lb_config,
                                id: "maglev_lb_config_0"
                            }}
                        />
                        <ConditionalComponent
                            shouldRender={matchesEndOrStartOf("lb_config.original_dst_lb_config", selectedTags)}
                            Component={ComponentOriginalDstLbConfig}
                            componentProps={{
                                version: veri.version,
                                keyPrefix: `original_dst_lb_config`,
                                reduxStore: reduxStore?.lb_config?.original_dst_lb_config,
                                id: "original_dst_lb_config_0"
                            }}
                        />
                        <ConditionalComponent
                            shouldRender={matchesEndOrStartOf("lb_config.least_request_lb_config", selectedTags)}
                            Component={ComponentLeastRequestLbConfig}
                            componentProps={{
                                version: veri.version,
                                keyPrefix: `least_request_lb_config`,
                                reduxStore: reduxStore?.lb_config?.least_request_lb_config,
                                id: "least_request_lb_config_0"
                            }}
                        />
                        <ConditionalComponent
                            shouldRender={matchesEndOrStartOf("lb_config.round_robin_lb_config", selectedTags)}
                            Component={ComponentRoundRobinLbConfig}
                            componentProps={{
                                version: veri.version,
                                keyPrefix: `round_robin_lb_config`,
                                reduxStore: reduxStore?.lb_config?.round_robin_lb_config,
                                id: "round_robin_lb_config_0"
                            }}
                        />
                        <ConditionalComponent
                            shouldRender={matchesEndOrStartOf("eds_cluster_config", selectedTags)}
                            Component={EdsClusterConfig}
                            componentProps={{
                                version: veri.version,
                                selectedTags: selectedTags,
                                reduxStore: reduxStore?.eds_cluster_config,
                                id: "eds_cluster_config_0"
                            }}
                        />
                        <ConditionalComponent
                            shouldRender={matchesEndOrStartOf("load_assignment", selectedTags)}
                            Component={ComponentLoadAssignment}
                            componentProps={{
                                version: veri.version,
                                keyPrefix: `load_assignment`,
                                tagMatchPrefix: `load_assignment`,
                                reduxStore: reduxStore?.load_assignment,
                                id: "load_assignment_0"
                            }}
                        />
                        <ConditionalComponent
                            shouldRender={matchesEndOrStartOf("health_checks", selectedTags)}
                            Component={ComponentHealthChecks}
                            componentProps={{
                                version: veri.version,
                                keyPrefix: `health_checks`,
                                reduxStore: reduxStore?.health_checks,
                                reduxAction: ResourceAction,
                                tagMatchPrefix: `Cluster.health_checks`,
                                id: "health_checks_0"
                            }}
                        />
                        <ConditionalComponent
                            shouldRender={matchesEndOrStartOf("typed_extension_protocol_options", selectedTags)}
                            Component={ComponentTypedExtensionProtocolOptions}
                            componentProps={{
                                version: veri.version,
                                reduxStore: reduxStore?.typed_extension_protocol_options,
                                id: "typed_extension_protocol_options_0"
                            }}
                        />
                        <ConditionalComponent
                            shouldRender={matchesEndOrStartOf("outlier_detection", selectedTags)}
                            Component={ComponentOutlierDetection}
                            componentProps={{
                                version: veri.version,
                                keyPrefix: `outlier_detection`,
                                tagMatchPrefix: `Cluster.outlier_detection`,
                                reduxStore: reduxStore?.outlier_detection,
                                id: "outlier_detection_0"
                            }}
                        />
                        <ConditionalComponent
                            shouldRender={matchesEndOrStartOf("transport_socket", selectedTags)}
                            Component={CommonComponentTransportSocket}
                            componentProps={{
                                version: veri.version,
                                keyPrefix: `transport_socket`,
                                tagMatchPrefix: `Cluster.transport_socket`,
                                reduxStore: reduxStore?.transport_socket,
                                gtype: 'envoy.extensions.transport_sockets.tls.v3.UpstreamTlsContext',
                                prettyName: 'Upstream',
                                id: "transport_socket_0"
                            }}
                        />
                    </Col>
                </Row>
            </>
        )
    )
}

export default React.memo(ClusterComponent);