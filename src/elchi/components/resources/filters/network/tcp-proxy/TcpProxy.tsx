import React from 'react';
import { useLocation } from 'react-router-dom';
import { Col, Row, Divider } from 'antd';
import { ResourceAction } from '@/redux/reducers/slice';
import { HeadOfResource } from '@/elchi/components/common/HeadOfResources';
import { FieldConfigType, matchesEndOrStartOf } from '@/utils/tools';
import { navigateCases } from '@/elchi/helpers/navigate-cases';
import CommonComponentSingleOptions from '@/elchi/components/resources/common/SingleOptions/SingleOptions';
import CustomAnchor from '@/elchi/components/common/CustomAnchor';
import CommonComponentClusterCard from '../../../common/Clusters/Cluster/ClusterCard'
import CommonComponentTCPWeightedClusters from '../../../common/Clusters/WeightedClusters/tcp/WeightedClusters';
import ComponentHashPolicy from './HashPolicy';
import ComponentAccessLogOptions from './AccessLogOptions';
import ComponentTunnelingConfig from './TunnelingConfig';
import CommonComponentAccessLog from '@resources/common/AccessLog/AccessLog';
import { GTypes } from '@/common/statics/gtypes';
import { useGTypeFields } from '@/hooks/useGtypes';
import useResourceMain from '@/hooks/useResourceMain';
import { useModels } from '@/hooks/useModels';
import { useTags } from '@/hooks/useTags';
import { modtag_tcp_proxy, modtag_us_tcpproxy } from './_modtag_';
import { generateFields } from '@/common/generate-fields';
import RenderLoading from '@/elchi/components/common/Loading';
import { useLoading } from '@/hooks/loadingContext';
import { useManagedLoading } from '@/hooks/useManageLoading';
import { ConditionalComponent } from '@/elchi/components/common/ConditionalComponent';


type GeneralProps = {
    veri: {
        version: string;
        queryResource: any;
        generalName: string;
        changeGeneralName: any;
    }
};

const ComponentTcpProxy: React.FC<GeneralProps> = ({ veri }) => {
    const GType = useGTypeFields(GTypes.TcpProxy);
    const location = useLocation();
    const { vModels, loading_m } = useModels(veri.version, modtag_tcp_proxy);
    const { vTags, loading } = useTags(veri.version, modtag_tcp_proxy);
    const { loadingCount } = useLoading();
    const { reduxStore, selectedTags, handleChangeTag } = useResourceMain({
        version: veri.version,
        alias: "tp",
        vModels,
        vTags,
        modelName: "TcpProxy",
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.tp?.TcpProxy,
            sf: vTags.tp?.TcpProxy_SingleFields,
            e: ['cluster_specifier.cluster'],
            r: ['stat_prefix']
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
                    voidToJSON: vModels.tp?.TcpProxy.toJSON,
                    queryResource: veri.queryResource,
                    envoyVersion: veri.version,
                    gtype: reduxStore?.$type,
                }}
            />
            <Divider type='horizontal' orientation='left' orientationMargin='0'>TCP Proxy</Divider>
            <Row>
                <Col md={4}>
                    <CustomAnchor
                        resourceConfKeys={vTags.tp?.TcpProxy}
                        unsuportedTags={modtag_us_tcpproxy['TcpProxy']}
                        singleOptionKeys={vTags.tp?.TcpProxy_SingleFields}
                        selectedTags={selectedTags}
                        handleChangeTag={handleChangeTag}
                        tagMatchPrefix={'TcpProxy'}
                        specificTagPrefix={{ 'cluster': 'cluster_specifier', 'weighted_clusters': 'cluster_specifier' }}
                        onlyOneTag={[['cluster_specifier.cluster', 'cluster_specifier.weighted_clusters']]}
                        required={['cluster', 'weighted_clusters', 'stat_prefix']}
                    />
                </Col>
                <Col md={20}>
                    <ConditionalComponent
                        shouldRender={selectedTags?.some(item => vTags.tp?.TcpProxy_SingleFields.includes(item) && item !== 'cluster_specifier.cluster')}
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
                        shouldRender={matchesEndOrStartOf('cluster_specifier.cluster', selectedTags)}
                        Component={CommonComponentClusterCard}
                        componentProps={{
                            version: veri.version,
                            reduxStore: navigateCases(reduxStore, 'cluster_specifier.cluster'),
                            reduxAction: ResourceAction,
                            alwaysShow: true,
                            tag: 'cluster',
                            id: `cluster_0`,
                        }}
                    />
                    <ConditionalComponent
                        shouldRender={matchesEndOrStartOf('cluster_specifier.weighted_clusters', selectedTags)}
                        Component={CommonComponentTCPWeightedClusters}
                        componentProps={{
                            version: veri.version,
                            reduxStore: navigateCases(reduxStore, 'cluster_specifier.weighted_clusters'),
                            reduxAction: ResourceAction,
                            keyPrefix: `weighted_clusters`,
                            tagPrefix: 'cluster_specifier',
                            tagMatchPrefix: 'TcpProxy',
                            id: `weighted_clusters_0`,
                        }}
                    />
                    <ConditionalComponent
                        shouldRender={matchesEndOrStartOf("access_log", selectedTags)}
                        Component={CommonComponentAccessLog}
                        componentProps={{
                            version: veri.version,
                            keyPrefix: `access_log`,
                            tagMatchPrefix: `TcpProxy.access_log`,
                            reduxStore: reduxStore?.access_log,
                            reduxAction: ResourceAction,
                            id: `access_log_0`,
                        }}
                    />
                    <ConditionalComponent
                        shouldRender={matchesEndOrStartOf('hash_policy', selectedTags)}
                        Component={ComponentHashPolicy}
                        componentProps={{
                            version: veri.version,
                            reduxStore: reduxStore?.hash_policy?.[0],
                            reduxAction: ResourceAction,
                            keyPrefix: `hash_policy.0`,
                            tagMatchPrefix: 'TcpProxy',
                            id: `hash_policy_0`,
                        }}
                    />
                    <ConditionalComponent
                        shouldRender={matchesEndOrStartOf('tunneling_config', selectedTags)}
                        Component={ComponentTunnelingConfig}
                        componentProps={{
                            version: veri.version,
                            reduxStore: reduxStore?.tunneling_config,
                            reduxAction: ResourceAction,
                            keyPrefix: `tunneling_config`,
                            tagMatchPrefix: 'TcpProxy',
                            id: `tunneling_config_0`,
                        }}
                    />
                    <ConditionalComponent
                        shouldRender={matchesEndOrStartOf('access_log_options', selectedTags)}
                        Component={ComponentAccessLogOptions}
                        componentProps={{
                            version: veri.version,
                            reduxStore: reduxStore?.access_log_options,
                            reduxAction: ResourceAction,
                            keyPrefix: `access_log_options`,
                            tagMatchPrefix: 'TcpProxy',
                            id: `access_log_options_0`,
                        }}
                    />
                </Col>
            </Row>
        </>
    );
}

export default React.memo(ComponentTcpProxy);