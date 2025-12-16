import React from 'react';
import { useLocation } from 'react-router-dom';
import { Col, Row, Divider } from 'antd';
import { ResourceAction } from '@/redux/reducers/slice';
import { HeadOfResource } from '@/elchi/components/common/HeadOfResources';
import { FieldConfigType, matchesEndOrStartOf } from '@/utils/tools';
import CommonComponentSingleOptions from '@/elchi/components/resources/common/SingleOptions/SingleOptions';
import ComponentConnPoolSettings from './ConnPoolSettings/ConnPoolSettings';
import ComponentDownstreamAuthPasswords from './DownstreamAuthPasswords/DownstreamAuthPasswords';
import ComponentFaults from './Faults/Faults';
import ComponentPrefixRoutes from './PrefixRoutes/PrefixRoutes';
import ComponentExternalAuthProvider from './ExternalAuthProvider/ExternalAuthProvider';
import CommonComponentDataSource from '@resources/common/DataSource/DataSource';
import CustomAnchor from '@/elchi/components/common/CustomAnchor';
import { GTypes } from '@/common/statics/gtypes';
import { useGTypeFields } from '@/hooks/useGtypes';
import useResourceMain from '@/hooks/useResourceMain';
import { useModels } from '@/hooks/useModels';
import { useTags } from '@/hooks/useTags';
import { modtag_redis_proxy, modtag_us_redisproxy } from './_modtag_';
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

const ComponentRedisProxy: React.FC<GeneralProps> = ({ veri }) => {
    const GType = useGTypeFields(GTypes.RedisProxy);
    const location = useLocation();
    const { vModels, loading_m } = useModels(veri.version, modtag_redis_proxy);
    const { vTags, loading } = useTags(veri.version, modtag_redis_proxy);
    const { loadingCount } = useLoading();
    const { reduxStore, selectedTags, handleChangeTag } = useResourceMain({
        version: veri.version,
        alias: "rp",
        vModels,
        vTags,
        modelName: "RedisProxy",
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.rp?.RedisProxy,
            sf: vTags.rp?.RedisProxy_SingleFields,
            e: [],
            r: ['stat_prefix', 'settings']
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
                    voidToJSON: vModels.rp?.RedisProxy.toJSON,
                    queryResource: veri.queryResource,
                    envoyVersion: veri.version,
                    gtype: reduxStore?.$type,
                }}
            />
            <Divider type='horizontal' orientation='left' orientationMargin='0'>Redis Proxy</Divider>
            <Row>
                <Col md={4} style={{ display: "block", maxHeight: "auto", overflowY: "auto" }}>
                    <CustomAnchor
                        resourceConfKeys={vTags.rp?.RedisProxy}
                        unsuportedTags={modtag_us_redisproxy['RedisProxy']}
                        singleOptionKeys={vTags.rp?.RedisProxy_SingleFields}
                        selectedTags={selectedTags}
                        handleChangeTag={handleChangeTag}
                        tagMatchPrefix={'RedisProxy'}
                        required={['stat_prefix', 'settings']}
                    />
                </Col>
                <Col md={20}>
                    <ConditionalComponent
                        shouldRender={selectedTags?.some(item => vTags.rp?.RedisProxy_SingleFields.includes(item))}
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
                        shouldRender={matchesEndOrStartOf('settings', selectedTags)}
                        Component={ComponentConnPoolSettings}
                        componentProps={{
                            version: veri.version,
                            reduxStore: reduxStore?.settings,
                            reduxAction: ResourceAction,
                            keyPrefix: `settings`,
                            tagMatchPrefix: 'RedisProxy',
                            id: `settings_0`,
                        }}
                    />
                    <ConditionalComponent
                        shouldRender={matchesEndOrStartOf('prefix_routes', selectedTags)}
                        Component={ComponentPrefixRoutes}
                        componentProps={{
                            version: veri.version,
                            reduxStore: reduxStore?.prefix_routes,
                            reduxAction: ResourceAction,
                            keyPrefix: `prefix_routes`,
                            id: `prefix_routes_0`,
                        }}
                    />
                    <ConditionalComponent
                        shouldRender={matchesEndOrStartOf('downstream_auth_passwords', selectedTags)}
                        Component={ComponentDownstreamAuthPasswords}
                        componentProps={{
                            version: veri.version,
                            reduxStore: reduxStore?.downstream_auth_passwords,
                            reduxAction: ResourceAction,
                            keyPrefix: `downstream_auth_passwords`,
                            id: `downstream_auth_passwords_0`,
                        }}
                    />
                    <ConditionalComponent
                        shouldRender={matchesEndOrStartOf('faults', selectedTags)}
                        Component={ComponentFaults}
                        componentProps={{
                            version: veri.version,
                            reduxStore: reduxStore?.faults,
                            reduxAction: ResourceAction,
                            keyPrefix: `faults`,
                            id: `faults_0`,
                        }}
                    />
                    <ConditionalComponent
                        shouldRender={matchesEndOrStartOf('downstream_auth_username', selectedTags)}
                        Component={CommonComponentDataSource}
                        componentProps={{
                            version: veri.version,
                            reduxStore: reduxStore?.downstream_auth_username,
                            keyPrefix: `downstream_auth_username`,
                            tagPrefix: 'specifier',
                            parentName: 'Redis Proxy',
                            fileName: 'downstream-auth-username',
                            id: `downstream_auth_username_0`,
                        }}
                    />
                    <ConditionalComponent
                        shouldRender={matchesEndOrStartOf('external_auth_provider', selectedTags)}
                        Component={ComponentExternalAuthProvider}
                        componentProps={{
                            version: veri.version,
                            reduxStore: reduxStore?.external_auth_provider,
                            reduxAction: ResourceAction,
                            keyPrefix: `external_auth_provider`,
                            id: `external_auth_provider_0`,
                        }}
                    />
                </Col>
            </Row>
        </>
    );
}

export default React.memo(ComponentRedisProxy);
