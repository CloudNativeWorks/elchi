import React from "react";
import { Card, Col, Divider, Row, Collapse } from 'antd';
import { memorizeComponent, compareVeri } from "@/hooks/useMemoComponent";
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { navigateCases } from "@/elchi/helpers/navigate-cases";
import { FieldConfigType, matchesEndOrStartOf, startsWithAny } from "@/utils/tools";
import { getCollapseItems } from "@/elchi/components/common/CollapseItems";
import CommonComponentRegexMatchAndSubstitute from '../common/RegexMatchAndSubstitute/RegexMatchAndSubstitute';
import CommonComponentRetryPolicy from '../common/RetryPolicy/RetryPolicy';
import CommonComponentRequestMirrorPolicy from '../common/RequestMirrorPolicy/RequestMirrorPolicy';
import CommonComponentPathRewritePolicy from '../common/PathRewritePolicy/PathRewritePolicy';
import ComponentMaxStreamDuration from './MaxStreamDuration';
import ComponentHedgePolicy from './HedgePolicy';
import ComponentUpgradeConfig from './UpgradeConfig';
import ComponentHashPolicy from './hash-policy/HashPolicy';
import ComponentInternalRedirectPolicy from './InternalRedirectPolicy';
import CommonComponentCluster from '../common/Clusters/Cluster/Cluster';
import CommonComponentWeightedClusters from '../common/Clusters/WeightedClusters/http/WeightedClusters'
import useResourceForm from "@/hooks/useResourceForm";
import { useTags } from "@/hooks/useTags";
import { modtag_route_action, modtag_us_virtualhost } from "./_modtag_";
import { generateFields } from "@/common/generate-fields";
import { ConditionalComponent } from "../../common/ConditionalComponent";
import { EForm } from "../../common/e-components/EForm";
import { EFields } from "../../common/e-components/EFields";


type GeneralProps = {
    veri: {
        version: string;
        keyPrefix: string;
        reduxStore: any;
        reduxAction: any;
        tagMatchPrefix: string;
    }
};

const ComponentRoute: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_route_action);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.rta?.RouteAction,
            sf: vTags.rta?.RouteAction_SingleFields,
            e: ["cluster_specifier.cluster"]
        }),
    ]

    return (
        <Card size='small' title={'Route'} styles={{ header: { background: 'white', color: 'black' } }} style={{ marginBottom: 8, width: '100%' }}>
            <Row>
                <HorizonTags veri={{
                    tags: vTags.rta?.RouteAction,
                    selectedTags: selectedTags,
                    unsupportedTags: modtag_us_virtualhost['route'],
                    handleChangeTag: handleChangeTag,
                    keyPrefix: veri.keyPrefix,
                    tagMatchPrefix: `${veri.tagMatchPrefix}`,
                    required: ["cluster", "cluster_header", "weighted_clusters"],
                    onlyOneTag: [
                        ['cluster_specifier.cluster', 'cluster_specifier.cluster_header', 'cluster_specifier.weighted_clusters'],
                        ['prefix_rewrite', 'regex_rewrite', 'path_rewrite_policy'],
                        ['host_rewrite_specifier.host_rewrite_literal', 'host_rewrite_specifier.auto_host_rewrite', 'host_rewrite_specifier.host_rewrite_header', 'host_rewrite_specifier.host_rewrite_path_regex']
                    ],
                    specificTagPrefix: {
                        'cluster': 'cluster_specifier',
                        'cluster_header': 'cluster_specifier',
                        'weighted_clusters': 'cluster_specifier',
                        'host_rewrite_literal': 'host_rewrite_specifier',
                        'auto_host_rewrite': 'host_rewrite_specifier',
                        'host_rewrite_header': 'host_rewrite_specifier',
                        'host_rewrite_path_regex': 'host_rewrite_specifier',
                    }
                }} />
                <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
                <Col md={24}>
                    <EForm>
                        <CommonComponentCluster veri={{
                            version: veri.version,
                            reduxStore: navigateCases(veri.reduxStore, 'cluster_specifier.cluster'),
                            reduxAction: veri.reduxAction,
                            keyPrefix: veri.keyPrefix,
                            tagPrefix: 'cluster_specifier',
                            size: 8,
                            selectedTags: selectedTags,
                            tag: 'cluster'
                        }} />
                        <EFields
                            fieldConfigs={fieldConfigs}
                            selectedTags={selectedTags}
                            handleChangeRedux={handleChangeRedux}
                            reduxStore={veri.reduxStore}
                            keyPrefix={veri.keyPrefix}
                            version={veri.version}
                        />
                    </EForm>
                    <ConditionalComponent
                        shouldRender={matchesEndOrStartOf("cluster_specifier.weighted_clusters", selectedTags)}
                        Component={CommonComponentWeightedClusters}
                        componentProps={{
                            version: veri.version,
                            reduxStore: navigateCases(veri.reduxStore, 'cluster_specifier.weighted_clusters'),
                            reduxAction: veri.reduxAction,
                            keyPrefix: `${veri.keyPrefix}.weighted_clusters`,
                            tagPrefix: 'cluster_specifier',
                            tagMatchPrefix: veri.tagMatchPrefix,
                            id: `${veri.keyPrefix}.weighted_clusters`,
                        }}
                    />
                    <Row>
                        <Collapse accordion bordered={false} size="small"
                            style={{ width: '100%', marginBottom: 10, background: "#1890ff" }}
                            items={getCollapseItems([
                                {
                                    reduxStore: veri.reduxStore?.regex_rewrite,
                                    version: veri.version,
                                    reduxAction: veri.reduxAction,
                                    componentName: 'Regex Rewrite',
                                    component: CommonComponentRegexMatchAndSubstitute,
                                    keyPrefix: `${veri.keyPrefix}.regex_rewrite`,
                                    tagPrefix: `regex_rewrite`,
                                    tagMatchPrefix: `${veri.tagMatchPrefix}.regex_rewrite`,
                                    condition: startsWithAny("regex_rewrite", selectedTags),
                                },
                                {
                                    reduxStore: veri.reduxStore?.path_rewrite_policy,
                                    version: veri.version,
                                    reduxAction: veri.reduxAction,
                                    componentName: 'Path Rewrite Policy',
                                    component: CommonComponentPathRewritePolicy,
                                    keyPrefix: `${veri.keyPrefix}`,
                                    tagPrefix: `path_rewrite_policy`,
                                    tagMatchPrefix: `${veri.tagMatchPrefix}.path_rewrite_policy`,
                                    condition: startsWithAny("path_rewrite_policy", selectedTags),
                                },
                                {
                                    reduxStore: navigateCases(veri.reduxStore, 'host_rewrite_specifier.host_rewrite_path_regex'),
                                    version: veri.version,
                                    reduxAction: veri.reduxAction,
                                    componentName: 'Host Rewrite Path Regex',
                                    component: CommonComponentRegexMatchAndSubstitute,
                                    keyPrefix: `${veri.keyPrefix}.host_rewrite_path_regex`,
                                    tagPrefix: `host_rewrite_specifier.host_rewrite_path_regex`,
                                    tagMatchPrefix: `${veri.tagMatchPrefix}.host_rewrite_specifier.host_rewrite_path_regex`,
                                    condition: startsWithAny("host_rewrite_specifier.host_rewrite_path_regex", selectedTags),
                                },
                                {
                                    reduxStore: veri.reduxStore?.retry_policy,
                                    version: veri.version,
                                    reduxAction: veri.reduxAction,
                                    componentName: 'Retry Policy',
                                    component: CommonComponentRetryPolicy,
                                    keyPrefix: `${veri.keyPrefix}.retry_policy`,
                                    tagMatchPrefix: `${veri.tagMatchPrefix}.retry_policy`,
                                    condition: matchesEndOrStartOf("retry_policy", selectedTags),
                                },
                                {
                                    reduxStore: veri.reduxStore?.request_mirror_policies,
                                    version: veri.version,
                                    reduxAction: veri.reduxAction,
                                    componentName: 'Request Mirror Policies',
                                    component: CommonComponentRequestMirrorPolicy,
                                    keyPrefix: `${veri.keyPrefix}.request_mirror_policies`,
                                    tagMatchPrefix: `${veri.tagMatchPrefix}.request_mirror_policies`,
                                    condition: matchesEndOrStartOf("request_mirror_policies", selectedTags),
                                },
                                {
                                    reduxStore: veri.reduxStore?.hedge_policy,
                                    version: veri.version,
                                    reduxAction: veri.reduxAction,
                                    componentName: 'Hedge Policy',
                                    component: ComponentHedgePolicy,
                                    keyPrefix: `${veri.keyPrefix}.hedge_policy`,
                                    tagMatchPrefix: `${veri.tagMatchPrefix}.hedge_policy`,
                                    condition: matchesEndOrStartOf("hedge_policy", selectedTags),
                                },
                                {
                                    reduxStore: veri.reduxStore?.max_stream_duration,
                                    version: veri.version,
                                    reduxAction: veri.reduxAction,
                                    componentName: 'Max Stream Duration',
                                    component: ComponentMaxStreamDuration,
                                    keyPrefix: `${veri.keyPrefix}.max_stream_duration`,
                                    tagMatchPrefix: `${veri.tagMatchPrefix}.max_stream_duration`,
                                    condition: matchesEndOrStartOf("max_stream_duration", selectedTags),
                                },
                                {
                                    reduxStore: veri.reduxStore?.upgrade_configs,
                                    version: veri.version,
                                    reduxAction: veri.reduxAction,
                                    componentName: 'Upgrade Configs',
                                    component: ComponentUpgradeConfig,
                                    keyPrefix: `${veri.keyPrefix}.upgrade_configs`,
                                    tagMatchPrefix: `${veri.tagMatchPrefix}.upgrade_configs`,
                                    condition: matchesEndOrStartOf("upgrade_configs", selectedTags),
                                },
                                {
                                    reduxStore: veri.reduxStore?.hash_policy,
                                    version: veri.version,
                                    reduxAction: veri.reduxAction,
                                    componentName: 'Hash Policy',
                                    component: ComponentHashPolicy,
                                    keyPrefix: `${veri.keyPrefix}.hash_policy`,
                                    tagMatchPrefix: `${veri.tagMatchPrefix}.hash_policy`,
                                    condition: matchesEndOrStartOf("hash_policy", selectedTags),
                                },
                                {
                                    reduxStore: veri.reduxStore?.internal_redirect_policy,
                                    version: veri.version,
                                    reduxAction: veri.reduxAction,
                                    componentName: 'Internal Redirect Policy',
                                    component: ComponentInternalRedirectPolicy,
                                    keyPrefix: `${veri.keyPrefix}.internal_redirect_policy`,
                                    tagMatchPrefix: `${veri.tagMatchPrefix}.internal_redirect_policy`,
                                    condition: matchesEndOrStartOf("internal_redirect_policy", selectedTags),
                                }
                            ])}
                        />
                    </Row>
                </Col>
            </Row>
        </Card>
    )
};

export default memorizeComponent(ComponentRoute, compareVeri);
