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
                <Row>
                    <Col md={4} style={{ display: "block", maxHeight: "auto", overflowY: "auto" }}>
                        <CustomAnchor
                            resourceConfKeys={vTags.c?.Cluster}
                            unsuportedTags={modtag_us_cluster["Cluster"]}
                            singleOptionKeys={vTags.c ? [...vTags.c?.Cluster_SingleFields?.filter((item: string) => !["name"].includes(item)), "type"] : []}
                            selectedTags={selectedTags}
                            index={0}
                            handleChangeTag={handleChangeTag}
                            specificTagPrefix={{ "type": "cluster_discovery_type" }}
                            required={modtag_r_cluster['Cluster']}
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