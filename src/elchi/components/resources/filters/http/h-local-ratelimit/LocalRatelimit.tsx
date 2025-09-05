import React from 'react';
import { useLocation } from 'react-router-dom';
import { Col, Row, Divider } from 'antd';
import { HeadOfResource } from '@/elchi/components/common/HeadOfResources';
import { FieldConfigType, startsWithAny } from '@/utils/tools';
import CommonComponentSingleOptions from '@/elchi/components/resources/common/SingleOptions/SingleOptions';
import CustomAnchor from '@/elchi/components/common/CustomAnchor';
import CommonComponentTokenBucket from '@resources/common/TokenBucket/TokenBucket';
import { GTypes } from '@/common/statics/gtypes';
import { useGTypeFields } from '@/hooks/useGtypes';
import useResourceMain from '@/hooks/useResourceMain';
import { useModels } from '@/hooks/useModels';
import { useTags } from '@/hooks/useTags';
import { modtag_local_ratelimit } from './_modtag_';
import { generateFields } from '@/common/generate-fields';
import RenderLoading from '@/elchi/components/common/Loading';
import { useLoading } from '@/hooks/loadingContext';
import { useManagedLoading } from '@/hooks/useManageLoading';
import { ResourceAction } from '@/redux/reducers/slice';
import CommonComponentRuntimeFractionalPercent from '@resources/common/RuntimeFractionalPercent/RuntimeFractionalPercent';
import CommonComponentHttpStatus from '@resources/common/HttpStatus/http_status';
import HeaderToAdd from '@resources/common/HeaderOptions/HeaderToAdd/HeaderToAdd';
import ComponentLocalClusterRateLimit from './LocalClusterRateLimit';
import { ConditionalComponent } from '@/elchi/components/common/ConditionalComponent';


type GeneralProps = {
    veri: {
        version: string;
        queryResource: any;
        generalName: string;
        changeGeneralName: any;
    }
};

const ComponentLocalRatelimit: React.FC<GeneralProps> = ({ veri }) => {
    const GType = useGTypeFields(GTypes.HttpLocalRatelimit);
    const location = useLocation();
    const { vModels, loading_m } = useModels(veri.version, modtag_local_ratelimit);
    const { vTags, loading } = useTags(veri.version, modtag_local_ratelimit);
    const { loadingCount } = useLoading();
    const { reduxStore, selectedTags, handleChangeTag } = useResourceMain({
        version: veri.version,
        alias: "lr",
        vModels,
        vTags,
        modelName: "LocalRateLimit",
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.lr?.LocalRateLimit,
            sf: vTags.lr?.LocalRateLimit_SingleFields,
            r: ["stat_prefix"]
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
                    voidToJSON: vModels.lr?.LocalRateLimit.toJSON,
                    queryResource: veri.queryResource,
                    envoyVersion: veri.version,
                    gtype: reduxStore?.$type,
                }}
            />
            <Divider type='horizontal' orientation='left' orientationMargin='0'>Local Ratelimit</Divider>
            <Row>
                <Col md={4}>
                    <CustomAnchor
                        resourceConfKeys={vTags.lr?.LocalRateLimit}
                        unsuportedTags={["rate_limits", "descriptors"]}
                        singleOptionKeys={vTags.lr?.LocalRateLimit_SingleFields}
                        selectedTags={selectedTags}
                        handleChangeTag={handleChangeTag}
                        required={['stat_prefix']}
                    />
                </Col>
                <Col md={20}>
                    <ConditionalComponent
                        shouldRender={selectedTags?.some(item => vTags.lr?.LocalRateLimit_SingleFields.includes(item))}
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
                        shouldRender={startsWithAny("status", selectedTags)}
                        Component={CommonComponentHttpStatus}
                        componentProps={{
                            version: veri.version,
                            reduxStore: reduxStore?.status,
                            keyPrefix: `status`,
                            title: "Status",
                            id: `status_0`,
                        }}
                    />
                    <ConditionalComponent
                        shouldRender={startsWithAny("token_bucket", selectedTags)}
                        Component={CommonComponentTokenBucket}
                        componentProps={{
                            version: veri.version,
                            reduxStore: reduxStore?.token_bucket,
                            keyPrefix: `token_bucket`,
                            title: "Token Bucket",
                            id: `token_bucket_0`,
                        }}
                    />
                    <ConditionalComponent
                        shouldRender={startsWithAny("filter_enabled", selectedTags)}
                        Component={CommonComponentRuntimeFractionalPercent}
                        componentProps={{
                            version: veri.version,
                            reduxAction: ResourceAction,
                            reduxStore: reduxStore?.filter_enabled,
                            keyPrefix: `filter_enabled`,
                            tagPrefix: `filter_enabled`,
                            tagMatchPrefix: `filter_enabled`,
                            title: "Filter Enabled",
                            id: `filter_enabled_0`,
                        }}
                    />
                    <ConditionalComponent
                        shouldRender={startsWithAny("filter_enforced", selectedTags)}
                        Component={CommonComponentRuntimeFractionalPercent}
                        componentProps={{
                            version: veri.version,
                            reduxAction: ResourceAction,
                            reduxStore: reduxStore?.filter_enforced,
                            keyPrefix: `filter_enforced`,
                            tagPrefix: `filter_enforced`,
                            tagMatchPrefix: `filter_enforced`,
                            title: "Filter Enforced",
                            id: `filter_enforced_0`,
                        }}
                    />
                    <div id='request_headers_to_add_when_not_enforced_0'>
                        {startsWithAny("request_headers_to_add_when_not_enforced", selectedTags) &&

                            <HeaderToAdd
                                veri={{
                                    version: veri.version,
                                    reduxStore: reduxStore?.request_headers_to_add_when_not_enforced,
                                    keyPrefix: `request_headers_to_add_when_not_enforced`,
                                    reduxAction: ResourceAction,
                                    title: "Request Headers To Add When Not Enforced",
                                }}
                            />

                        }
                    </div>
                    <div id='response_headers_to_add_0'>
                        {startsWithAny("response_headers_to_add", selectedTags) &&
                            <HeaderToAdd
                                veri={{
                                    version: veri.version,
                                    reduxStore: reduxStore?.response_headers_to_add,
                                    keyPrefix: `response_headers_to_add`,
                                    reduxAction: ResourceAction,
                                    title: "Response Headers To Add",
                                }}
                            />
                        }
                    </div>
                    <ConditionalComponent
                        shouldRender={startsWithAny("local_cluster_rate_limit", selectedTags)}
                        Component={ComponentLocalClusterRateLimit}
                        componentProps={{
                            version: veri.version,
                            keyPrefix: `local_cluster_rate_limit`,
                            title: "Local Cluster Rate Limit",
                            id: `local_cluster_rate_limit_0`,
                        }}
                    />
                </Col>
            </Row>
        </>
    );
}

export default React.memo(ComponentLocalRatelimit);