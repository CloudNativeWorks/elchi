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
import CommonComponentRuntimeFractionalPercent from '@resources/common/RuntimeFractionalPercent/RuntimeFractionalPercent';
import CommonComponentCluster from '@resources/common/Clusters/Cluster/Cluster';

type Props = {
    veri: {
        version: string;
        reduxStore: any;
        reduxAction: any;
        keyPrefix: string;
    }
};

const ComponentRequestMirrorPolicies: React.FC<Props> = ({ veri }) => {
    const dispatch = useDispatch();
    const { version, reduxStore, keyPrefix, reduxAction } = veri;
    const [activeKey, setActiveKey] = useState<string>('0');
    const { vTags, loading } = useTags(version, modtag_prefix_routes);
    const { loadingCount } = useLoading();

    const policies = reduxStore || [];
    const policyKeys = Array.isArray(policies)
        ? policies.map((_, index) => String(index))
        : [];

    useEffect(() => {
        if (policyKeys.length === 0) {
            handleAddPolicy();
        } else if (!policyKeys.includes(activeKey)) {
            setActiveKey(policyKeys[0]);
        }
    }, []);

    const handleAddPolicy = () => {
        const currentPolicies = Array.isArray(reduxStore) ? [...reduxStore] : [];
        const newIndex = currentPolicies.length;

        currentPolicies.push({});

        handleChangeResources(
            {
                version: version,
                type: ActionType.Update,
                keys: keyPrefix,
                val: currentPolicies,
                resourceType: ResourceType.Resource
            },
            dispatch,
            reduxAction
        );

        setActiveKey(String(newIndex));
    };

    const handleRemovePolicy = (targetKey: string | React.MouseEvent | React.KeyboardEvent) => {
        const key = String(targetKey);
        const currentPolicies = Array.isArray(reduxStore) ? [...reduxStore] : [];
        const index = parseInt(key);

        if (index >= 0 && index < currentPolicies.length) {
            currentPolicies.splice(index, 1);

            handleChangeResources(
                {
                    version: version,
                    type: ActionType.Update,
                    keys: keyPrefix,
                    val: currentPolicies,
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
        <ECard title="Request Mirror Policies">
            <Tabs
                type="editable-card"
                activeKey={activeKey}
                onChange={setActiveKey}
                onEdit={(targetKey, action) => {
                    if (action === 'add') {
                        handleAddPolicy();
                    } else {
                        handleRemovePolicy(targetKey);
                    }
                }}
                items={policyKeys.map((key) => {
                    const index = parseInt(key);
                    const policyData = Array.isArray(policies) ? policies[index] : {};

                    return {
                        key: key,
                        label: `Policy ${index}`,
                        closable: policyKeys.length > 1,
                        children: (
                            <PolicyContent
                                version={version}
                                reduxStore={policyData}
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

type PolicyContentProps = {
    version: string;
    reduxStore: any;
    reduxAction: any;
    keyPrefix: string;
    vTags: any;
};

const PolicyContent: React.FC<PolicyContentProps> = ({ version, reduxStore, reduxAction, keyPrefix, vTags }) => {
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version,
        reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.prrmp?.RedisProxy_PrefixRoutes_Route_RequestMirrorPolicy,
            sf: vTags.prrmp?.RedisProxy_PrefixRoutes_Route_RequestMirrorPolicy_SingleFields,
            e: ['runtime_fraction', 'cluster'],
        }),
    ];

    return (
        <>
            <HorizonTags veri={{
                tags: vTags.prrmp?.RedisProxy_PrefixRoutes_Route_RequestMirrorPolicy,
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
                shouldRender={matchesEndOrStartOf('runtime_fraction', selectedTags)}
                Component={CommonComponentRuntimeFractionalPercent}
                componentProps={{
                    version: version,
                    reduxStore: reduxStore?.runtime_fraction,
                    reduxAction: reduxAction,
                    keyPrefix: `${keyPrefix}.runtime_fraction`,
                    tagPrefix: '',
                    tagMatchPrefix: 'RedisProxy_PrefixRoutes_Route_RequestMirrorPolicy',
                    title: 'Runtime Fraction',
                }}
            />
        </>
    );
};

export default React.memo(ComponentRequestMirrorPolicies);
