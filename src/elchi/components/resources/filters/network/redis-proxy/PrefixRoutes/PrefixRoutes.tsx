import React from 'react';
import { Col, Divider, Row } from 'antd';
import { HorizonTags } from '@/elchi/components/common/HorizonTags';
import { EForm } from '@/elchi/components/common/e-components/EForm';
import { EFields } from '@/elchi/components/common/e-components/EFields';
import ECard from '@/elchi/components/common/ECard';
import { useTags } from '@/hooks/useTags';
import { useLoading } from '@/hooks/loadingContext';
import { useManagedLoading } from '@/hooks/useManageLoading';
import RenderLoading from '@/elchi/components/common/Loading';
import { modtag_prefix_routes } from './_modtag_';
import { generateFields } from '@/common/generate-fields';
import useResourceForm from '@/hooks/useResourceForm';
import { FieldConfigType, matchesEndOrStartOf } from '@/utils/tools';
import { ConditionalComponent } from '@/elchi/components/common/ConditionalComponent';
import ComponentRoutes from './Routes';
import ComponentRequestMirrorPolicies from './RequestMirrorPolicies';
import ComponentReadCommandPolicy from './ReadCommandPolicy';
import CommonComponentCluster from '@resources/common/Clusters/Cluster/Cluster';

type Props = {
    veri: {
        version: string;
        reduxStore: any;
        reduxAction: any;
        keyPrefix: string;
    }
};

const ComponentPrefixRoutes: React.FC<Props> = ({ veri }) => {
    const { version, reduxStore, keyPrefix, reduxAction } = veri;
    const { vTags, loading } = useTags(version, modtag_prefix_routes);
    const { loadingCount } = useLoading();
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version,
        reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.pr?.RedisProxy_PrefixRoutes,
            sf: vTags.pr?.RedisProxy_PrefixRoutes_SingleFields,
            e: ['routes', 'catch_all_route'],
        }),
    ];

    useManagedLoading(loading);
    if (loadingCount > 0) {
        return <RenderLoading checkPage={true} isLoadingQuery={true} error={""} />;
    }

    return (
        <ECard title="Prefix Routes">
            <HorizonTags veri={{
                tags: vTags.pr?.RedisProxy_PrefixRoutes,
                selectedTags: selectedTags,
                unsupportedTags: [],
                handleChangeTag: handleChangeTag,
                keyPrefix: keyPrefix,
                tagPrefix: '',
                required: [],
            }} />
            <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
            <Col md={24}>
                <EForm>
                    <EFields
                        fieldConfigs={fieldConfigs}
                        selectedTags={selectedTags}
                        handleChangeRedux={handleChangeRedux}
                        reduxStore={reduxStore}
                        keyPrefix={keyPrefix}
                        version={version}
                    />
                </EForm>
            </Col>
            <ConditionalComponent
                shouldRender={matchesEndOrStartOf('routes', selectedTags)}
                Component={ComponentRoutes}
                componentProps={{
                    version: version,
                    reduxStore: reduxStore?.routes,
                    reduxAction: reduxAction,
                    keyPrefix: `${keyPrefix}.routes`,
                }}
            />
            <ConditionalComponent
                shouldRender={matchesEndOrStartOf('catch_all_route', selectedTags)}
                Component={CatchAllRoute}
                componentProps={{
                    version: version,
                    reduxStore: reduxStore?.catch_all_route,
                    reduxAction: reduxAction,
                    keyPrefix: `${keyPrefix}.catch_all_route`,
                }}
            />
        </ECard>
    );
};

type CatchAllRouteProps = {
    veri: {
        version: string;
        reduxStore: any;
        reduxAction: any;
        keyPrefix: string;
    }
};

const CatchAllRoute: React.FC<CatchAllRouteProps> = ({ veri }) => {
    const { version, reduxStore, reduxAction, keyPrefix } = veri;
    const { vTags, loading } = useTags(version, modtag_prefix_routes);
    const { loadingCount } = useLoading();
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version,
        reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.prr?.RedisProxy_PrefixRoutes_Route,
            sf: vTags.prr?.RedisProxy_PrefixRoutes_Route_SingleFields,
            e: ['request_mirror_policy', 'read_command_policy', 'cluster'],
        }),
    ];

    useManagedLoading(loading);
    if (loadingCount > 0) {
        return <RenderLoading checkPage={true} isLoadingQuery={true} error={""} />;
    }

    return (
        <ECard title="Catch All Route">
            <HorizonTags veri={{
                tags: vTags.prr?.RedisProxy_PrefixRoutes_Route,
                selectedTags: selectedTags,
                unsupportedTags: [],
                handleChangeTag: handleChangeTag,
                keyPrefix: keyPrefix,
                tagPrefix: '',
                required: [],
            }} />
            <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
            <Col md={24}>
                <EForm>
                    {matchesEndOrStartOf('cluster', selectedTags) && (
                        <Row>
                            <CommonComponentCluster veri={{
                                version: version,
                                reduxStore: reduxStore?.cluster,
                                keyPrefix: keyPrefix,
                                reduxAction: reduxAction,
                                tag: 'cluster',
                                size: 24,
                                selectedTags: selectedTags,
                                alwaysShow: true,
                            }} />
                        </Row>
                    )}
                    <EFields
                        fieldConfigs={fieldConfigs}
                        selectedTags={selectedTags}
                        handleChangeRedux={handleChangeRedux}
                        reduxStore={reduxStore}
                        keyPrefix={keyPrefix}
                        version={version}
                    />
                </EForm>
            </Col>
            <ConditionalComponent
                shouldRender={matchesEndOrStartOf('request_mirror_policy', selectedTags)}
                Component={ComponentRequestMirrorPolicies}
                componentProps={{
                    version: version,
                    reduxStore: reduxStore?.request_mirror_policy,
                    reduxAction: reduxAction,
                    keyPrefix: `${keyPrefix}.request_mirror_policy`,
                }}
            />
            <ConditionalComponent
                shouldRender={matchesEndOrStartOf('read_command_policy', selectedTags)}
                Component={ComponentReadCommandPolicy}
                componentProps={{
                    version: version,
                    reduxStore: reduxStore?.read_command_policy,
                    reduxAction: reduxAction,
                    keyPrefix: `${keyPrefix}.read_command_policy`,
                }}
            />
        </ECard>
    );
};

export default React.memo(ComponentPrefixRoutes);
