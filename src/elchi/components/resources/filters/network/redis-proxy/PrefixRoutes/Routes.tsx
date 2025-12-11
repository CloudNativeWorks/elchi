import React, { useState, useEffect } from 'react';
import { Col, Divider, Row, Tabs } from 'antd';
import { useDispatch } from 'react-redux';
import ECard from '@/elchi/components/common/ECard';
import { HorizonTags } from '@/elchi/components/common/HorizonTags';
import { EForm } from '@/elchi/components/common/e-components/EForm';
import { EFields } from '@/elchi/components/common/e-components/EFields';
import { handleChangeResources } from '@/redux/dispatcher';
import { ActionType, ResourceType } from '@/redux/reducer-helpers/common';
import { useTags } from '@/hooks/useTags';
import { useLoading } from '@/hooks/loadingContext';
import { useManagedLoading } from '@/hooks/useManageLoading';
import RenderLoading from '@/elchi/components/common/Loading';
import { modtag_prefix_routes } from './_modtag_';
import { generateFields } from '@/common/generate-fields';
import useResourceForm from '@/hooks/useResourceForm';
import { FieldConfigType, matchesEndOrStartOf } from '@/utils/tools';
import { ConditionalComponent } from '@/elchi/components/common/ConditionalComponent';
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

const ComponentRoutes: React.FC<Props> = ({ veri }) => {
    const dispatch = useDispatch();
    const { version, reduxStore, keyPrefix, reduxAction } = veri;
    const [activeKey, setActiveKey] = useState<string>('0');
    const { vTags, loading } = useTags(version, modtag_prefix_routes);
    const { loadingCount } = useLoading();

    const routes = reduxStore || [];
    const routeKeys = Array.isArray(routes)
        ? routes.map((_, index) => String(index))
        : [];

    useEffect(() => {
        if (routeKeys.length === 0) {
            handleAddRoute();
        } else if (!routeKeys.includes(activeKey)) {
            setActiveKey(routeKeys[0]);
        }
    }, []);

    const handleAddRoute = () => {
        const currentRoutes = Array.isArray(reduxStore) ? [...reduxStore] : [];
        const newIndex = currentRoutes.length;

        currentRoutes.push({});

        handleChangeResources(
            {
                version: version,
                type: ActionType.Update,
                keys: keyPrefix,
                val: currentRoutes,
                resourceType: ResourceType.Resource
            },
            dispatch,
            reduxAction
        );

        setActiveKey(String(newIndex));
    };

    const handleRemoveRoute = (targetKey: string | React.MouseEvent | React.KeyboardEvent) => {
        const key = String(targetKey);
        const currentRoutes = Array.isArray(reduxStore) ? [...reduxStore] : [];
        const index = parseInt(key);

        if (index >= 0 && index < currentRoutes.length) {
            currentRoutes.splice(index, 1);

            handleChangeResources(
                {
                    version: version,
                    type: ActionType.Update,
                    keys: keyPrefix,
                    val: currentRoutes,
                    resourceType: ResourceType.Resource
                },
                dispatch,
                reduxAction
            );

            if (activeKey === key) {
                const newIndex = Math.max(0, index - 1);
                setActiveKey(String(newIndex));
            }
        }
    };

    useManagedLoading(loading);
    if (loadingCount > 0) {
        return <RenderLoading checkPage={true} isLoadingQuery={true} error={""} />;
    }

    return (
        <ECard title="Routes">
            <Tabs
                type="editable-card"
                activeKey={activeKey}
                onChange={setActiveKey}
                onEdit={(targetKey, action) => {
                    if (action === 'add') {
                        handleAddRoute();
                    } else {
                        handleRemoveRoute(targetKey);
                    }
                }}
                items={routeKeys.map((key) => {
                    const index = parseInt(key);
                    const routeData = Array.isArray(routes) ? routes[index] : {};

                    return {
                        key: key,
                        label: `Route ${index}`,
                        closable: routeKeys.length > 1,
                        children: (
                            <RouteContent
                                version={version}
                                reduxStore={routeData}
                                reduxAction={reduxAction}
                                keyPrefix={`${keyPrefix}.${index}`}
                                vTags={vTags}
                            />
                        ),
                    };
                })}
            />
        </ECard>
    );
};

type RouteContentProps = {
    version: string;
    reduxStore: any;
    reduxAction: any;
    keyPrefix: string;
    vTags: any;
};

const RouteContent: React.FC<RouteContentProps> = ({ version, reduxStore, reduxAction, keyPrefix, vTags }) => {
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

    return (
        <>
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
        </>
    );
};

export default React.memo(ComponentRoutes);
