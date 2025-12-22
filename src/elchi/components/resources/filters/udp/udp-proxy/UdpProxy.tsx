import React from 'react';
import { useLocation } from 'react-router-dom';
import { Col, Row, Divider } from 'antd';
import { HeadOfResource } from '@/elchi/components/common/HeadOfResources';
import { FieldConfigType, matchesEndOrStartOf } from '@/utils/tools';
import CommonComponentSingleOptions from '@/elchi/components/resources/common/SingleOptions/SingleOptions';
import CustomAnchor from '@/elchi/components/common/CustomAnchor';
import { GTypes } from '@/common/statics/gtypes';
import { useGTypeFields } from '@/hooks/useGtypes';
import useResourceMain from '@/hooks/useResourceMain';
import { useModels } from '@/hooks/useModels';
import { useTags } from '@/hooks/useTags';
import { modtag_udp_proxy, modtag_us_udp_proxy, modtag_r_udp_proxy } from './_modtag_';
import { generateFields } from '@/common/generate-fields';
import RenderLoading from '@/elchi/components/common/Loading';
import { useLoading } from '@/hooks/loadingContext';
import { useManagedLoading } from '@/hooks/useManageLoading';
import { ConditionalComponent } from '@/elchi/components/common/ConditionalComponent';
import ComponentHashPolicies from './HashPolicies/HashPolicies';
import CommonComponentAccessLog from '@/elchi/components/resources/common/AccessLog/AccessLog';
import { ResourceAction } from '@/redux/reducers/slice';
import CommonComponentClusterCard from '@/elchi/components/resources/common/Clusters/Cluster/ClusterCard';
import { navigateCases } from '@/elchi/helpers/navigate-cases';
import ComponentAccessLogOptions from './AccessLogOptions/AccessLogOptions';
import ComponentUpstreamSocketConfig from './UpstreamSocketConfig/UpstreamSocketConfig';

type GeneralProps = {
    veri: {
        version: string;
        queryResource: any;
        generalName: string;
        changeGeneralName: any;
    }
};

const ComponentUdpProxy: React.FC<GeneralProps> = ({ veri }) => {
    const GType = useGTypeFields(GTypes.ListenerUdpProxy);
    const location = useLocation();
    const { vModels, loading_m } = useModels(veri.version, modtag_udp_proxy);
    const { vTags, loading } = useTags(veri.version, modtag_udp_proxy);
    const { loadingCount } = useLoading();
    const { reduxStore, selectedTags, handleChangeTag } = useResourceMain({
        version: veri.version,
        alias: "up",
        vModels,
        vTags,
        modelName: "UdpProxyConfig",
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.up?.UdpProxyConfig,
            sf: vTags.up?.UdpProxyConfig_SingleFields,
            r: modtag_r_udp_proxy,
            e: ["route_specifier.cluster"]
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
                    voidToJSON: vModels.up?.UdpProxyConfig.toJSON,
                    queryResource: veri.queryResource,
                    envoyVersion: veri.version,
                    gtype: reduxStore?.$type,
                }}
            />
            <Divider type='horizontal' orientation='left' orientationMargin='0'>UDP Proxy Filter</Divider>
            <Row>
                <Col md={4} style={{ display: "block", maxHeight: "auto", overflowY: "auto" }}>
                    <CustomAnchor
                        resourceConfKeys={vTags.up?.UdpProxyConfig}
                        unsuportedTags={modtag_us_udp_proxy["UdpProxyConfig"]}
                        singleOptionKeys={vTags.up ? [...vTags.up?.UdpProxyConfig_SingleFields] : []}
                        selectedTags={selectedTags}
                        specificTagPrefix={{ "cluster": "route_specifier" }}
                        handleChangeTag={handleChangeTag}
                        required={modtag_r_udp_proxy}
                    />
                </Col>
                <Col md={20}>
                    <ConditionalComponent
                        shouldRender={selectedTags?.some(item => vTags.up?.UdpProxyConfig_SingleFields.includes(item) && item !== 'route_specifier.cluster')}
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
                        shouldRender={matchesEndOrStartOf("route_specifier.cluster", selectedTags)}
                        Component={CommonComponentClusterCard}
                        componentProps={{
                            version: veri.version,
                            reduxStore: navigateCases(reduxStore, "route_specifier.cluster"),
                            keyPrefix: ``,
                            reduxAction: ResourceAction,
                            tag: "cluster",
                            size: 24,
                            selectedTags: selectedTags,
                            alwaysShow: true,
                            id: 'cluster_0'
                        }}
                    />
                    <ConditionalComponent
                        shouldRender={matchesEndOrStartOf("hash_policies", selectedTags)}
                        Component={ComponentHashPolicies}
                        componentProps={{
                            version: veri.version,
                            reduxStore: reduxStore?.hash_policies,
                            keyPrefix: `hash_policies`,
                            reduxAction: ResourceAction,
                            id: "hash_policies_0",
                            title: "Hash Policies"
                        }}
                    />
                    <ConditionalComponent
                        shouldRender={matchesEndOrStartOf("access_log", selectedTags)}
                        Component={CommonComponentAccessLog}
                        componentProps={{
                            version: veri.version,
                            reduxStore: reduxStore?.access_log,
                            keyPrefix: `access_log`,
                            reduxAction: ResourceAction,
                            id: "access_log_0",
                            title: "Access Log"
                        }}
                    />
                    <ConditionalComponent
                        shouldRender={matchesEndOrStartOf("proxy_access_log", selectedTags)}
                        Component={CommonComponentAccessLog}
                        componentProps={{
                            version: veri.version,
                            reduxStore: reduxStore?.proxy_access_log,
                            keyPrefix: `proxy_access_log`,
                            reduxAction: ResourceAction,
                            id: "proxy_access_log_0",
                            title: "Proxy Access Log"
                        }}
                    />
                    <ConditionalComponent
                        shouldRender={matchesEndOrStartOf("access_log_options", selectedTags)}
                        Component={ComponentAccessLogOptions}
                        componentProps={{
                            version: veri.version,
                            reduxStore: reduxStore?.access_log_options,
                            keyPrefix: `access_log_options`,
                            id: "access_log_options_0",
                            title: "Access Log Options"
                        }}
                    />
                    <ConditionalComponent
                        shouldRender={matchesEndOrStartOf("upstream_socket_config", selectedTags)}
                        Component={ComponentUpstreamSocketConfig}
                        componentProps={{
                            version: veri.version,
                            reduxStore: reduxStore?.upstream_socket_config,
                            keyPrefix: `upstream_socket_config`,
                            id: "upstream_socket_config_0",
                            title: "Upstream Socket Config"
                        }}
                    />
                </Col>
            </Row>
        </>
    );
};

export default ComponentUdpProxy;
