import React, { useCallback } from "react";
import { useLocation } from "react-router-dom";
import { Col, Row, Divider, Alert } from "antd";
import { matchesEndOrStartOf } from "@/utils/tools";
import { HeadOfResource } from "@/elchi/components/common/HeadOfResources";
import { ResourceAction } from "@/redux/reducers/slice";
import { GTypes } from "@/common/statics/gtypes";
import { useGTypeFields } from "@/hooks/useGtypes";
import { useTags } from "@/hooks/useTags";
import { modtag_cluster_load_assignment, modtag_r_cla, modtag_us_cla } from "./_modtag_";
import { useModels } from "@/hooks/useModels";
import useResourceMain from "@/hooks/useResourceMain";
import RenderLoading from "../../common/Loading";
import CustomAnchor from "@/elchi/components/common/CustomAnchor";
import CommonComponentName from '../common/Name/Name';
import Endpoints from '@elchi/components/resources/common/endpoints/endpoints';
import ComponentPolicy from '@elchi/components/resources/common/Policy/policy';
import { useLoading } from "@/hooks/loadingContext";
import { useManagedLoading } from "@/hooks/useManageLoading";
import { ConditionalComponent } from "../../common/ConditionalComponent";
import { useSelector } from 'react-redux';
import { InfoCircleOutlined } from '@ant-design/icons';


type GeneralProps = {
    veri: {
        version: string;
        queryResource: any;
    }
};

const ComponentEndpoint: React.FC<GeneralProps> = ({ veri }) => {
    const GType = useGTypeFields(GTypes.Endpoint);
    const location = useLocation();
    const { vModels, loading_m } = useModels(veri.version, modtag_cluster_load_assignment);
    const { vTags, loading } = useTags(veri.version, modtag_cluster_load_assignment);
    const { loadingCount } = useLoading();

    const { reduxStore, selectedTags, handleChangeTag } = useResourceMain({
        version: veri.version,
        alias: "cla",
        vModels,
        vTags,
        modelName: "ClusterLoadAssignment",
    });

    // Get discovery data from Redux
    const discoveryData = useSelector((state: any) =>
        state.VersionedResources[veri.version]?.ElchiDiscovery || []
    );

    // Check if discovery is active
    const hasDiscoveryConfig = discoveryData && discoveryData.length > 0;

    useManagedLoading(loading, loading_m);
    if (loadingCount > 0) {
        return <RenderLoading checkPage={true} isLoadingQuery={true} error={""} />;
    }

    return (
        <>
            <HeadOfResource
                generalName={reduxStore?.cluster_name as string}
                version={veri.version}
                locationCheck={false}
                createUpdate={{
                    location_path: location.pathname,
                    GType: GType,
                    offset: 0,
                    name: reduxStore?.cluster_name as string,
                    reduxStore: reduxStore,
                    voidToJSON: vModels.cla?.ClusterLoadAssignment.toJSON,
                    queryResource: veri.queryResource,
                    envoyVersion: veri.version,
                    gtype: reduxStore?.$type,
                }}
            />
            <Divider type="horizontal" orientation="left" orientationMargin="0">Endpoint Configuration</Divider>
            <Row>
                <Col md={4}>
                    <CustomAnchor
                        resourceConfKeys={vTags.cla?.ClusterLoadAssignment}
                        unsuportedTags={modtag_us_cla["ClusterLoadAssignment"]}
                        selectedTags={selectedTags}
                        index={0}
                        handleChangeTag={handleChangeTag}
                        tagMatchPrefix="ClusterLoadAssignment"
                        required={modtag_r_cla['ClusterLoadAssignment']}
                        unchangeableTags={["cluster_name"]}
                    />
                </Col>
                <Col md={20}>
                    {/* Discovery warning - show before endpoints section */}
                    {hasDiscoveryConfig && matchesEndOrStartOf("endpoints", selectedTags) && (
                        <Alert
                            message="Automatic Discovery Enabled"
                            description={
                                <span>
                                    <strong>{discoveryData.length} cluster(s)</strong> configured for automatic discovery.
                                    <br />
                                    <strong>Please do not manually edit Lb Endpoints and Locality configurations</strong> -
                                    they will be automatically populated from the discovered services.
                                </span>
                            }
                            type="info"
                            icon={<InfoCircleOutlined />}
                            showIcon
                            style={{
                                marginBottom: 16,
                                borderRadius: 8,
                                backgroundColor: '#e6f7ff',
                                borderColor: '#91d5ff'
                            }}
                            closable={false}
                        />
                    )}
                    <ConditionalComponent
                        shouldRender={selectedTags?.includes("cluster_name")}
                        Component={CommonComponentName}
                        componentProps={{
                            version: veri.version,
                            title: "cluster_name",
                            reduxAction: ResourceAction,
                            reduxStore: reduxStore?.cluster_name,
                            disabled: location.pathname !== GType.createPath,
                            id: `cluster_name_0`,
                        }}
                    />
                    <ConditionalComponent
                        shouldRender={matchesEndOrStartOf("endpoints", selectedTags)}
                        Component={Endpoints}
                        componentProps={{
                            version: veri.version,
                            reduxStore: reduxStore?.endpoints,
                            keyPrefix: "endpoints",
                            tagMatchPrefix: "ClusterLoadAssignment.endpoints",
                            id: `endpoints_0`,
                        }}
                    />
                    <ConditionalComponent
                        shouldRender={matchesEndOrStartOf("policy", selectedTags)}
                        Component={ComponentPolicy}
                        componentProps={{
                            version: veri.version,
                            reduxStore: reduxStore?.policy,
                            keyPrefix: "policy",
                            tagMatchPrefix: "ClusterLoadAssignment.policy",
                            id: `policy_0`,
                        }}
                    />
                </Col>
            </Row>
        </>
    );
}

export default React.memo(ComponentEndpoint);

