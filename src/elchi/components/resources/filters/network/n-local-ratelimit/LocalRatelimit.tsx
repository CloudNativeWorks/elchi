import React from 'react';
import { useLocation } from 'react-router-dom';
import { Col, Row, Divider } from 'antd';
import { HeadOfResource } from '@/elchi/components/common/HeadOfResources';
import { FieldConfigType, startsWithAny } from '@/utils/tools';
import CommonComponentSingleOptions from '@/elchi/components/resources/common/SingleOptions/SingleOptions';
import CustomAnchor from '@/elchi/components/common/CustomAnchor';
import CommonComponentTokenBucket from '@resources/common/TokenBucket/TokenBucket';
import CommonComponentRuntimeFeatureFlag from '@resources/common/RuntimeFeatureFlag/RuntimeFeatureFlag';
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
    const GType = useGTypeFields(GTypes.NetworkLocalRatelimit);
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
            r: ["stat_prefix", "token_bucket"]
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
                <Col md={4} style={{ display: "block", maxHeight: "auto", overflowY: "auto" }}>
                    <CustomAnchor
                        resourceConfKeys={vTags.lr?.LocalRateLimit}
                        singleOptionKeys={vTags.lr?.LocalRateLimit_SingleFields}
                        selectedTags={selectedTags}
                        handleChangeTag={handleChangeTag}
                        required={['stat_prefix', 'token_bucket']}
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
                        shouldRender={startsWithAny("runtime_enabled", selectedTags)}
                        Component={CommonComponentRuntimeFeatureFlag}
                        componentProps={{
                            version: veri.version,
                            reduxStore: reduxStore?.runtime_enabled,
                            keyPrefix: `runtime_enabled`,
                            title: "Runtime Enabled",
                            id: `runtime_enabled_0`,
                        }}
                    />
                </Col>
            </Row>
        </>
    );
}

export default React.memo(ComponentLocalRatelimit);