import React from 'react';
import { Col, Divider } from 'antd';
import { HorizonTags } from '@/elchi/components/common/HorizonTags';
import { EForm } from '@/elchi/components/common/e-components/EForm';
import { EFields } from '@/elchi/components/common/e-components/EFields';
import ECard from '@/elchi/components/common/ECard';
import { useTags } from '@/hooks/useTags';
import { useLoading } from '@/hooks/loadingContext';
import { useManagedLoading } from '@/hooks/useManageLoading';
import RenderLoading from '@/elchi/components/common/Loading';
import { modtag_http_grpc_access_log } from './_modtag_';
import { generateFields } from '@/common/generate-fields';
import useResourceForm from '@/hooks/useResourceForm';
import { FieldConfigType, matchesEndOrStartOf } from '@/utils/tools';
import { ConditionalComponent } from '@/elchi/components/common/ConditionalComponent';
import CommonComponentGrpcService from '@resources/common/GrpcService/GrpcService';
import CommonComponentCoreRetryPolicy from '@resources/common/CoreRetryPolicy/RetryPolicy';
import CommonComponentCustomTags from '@resources/common/CustomTags/CustomTags';

type Props = {
    veri: {
        version: string;
        reduxStore: any;
        reduxAction: any;
        keyPrefix: string;
        tagMatchPrefix: string;
    }
};

const ComponentCommonGrpcAccessLogConfig: React.FC<Props> = ({ veri }) => {
    const { version, reduxStore, keyPrefix, reduxAction, tagMatchPrefix } = veri;
    const { vTags, loading } = useTags(version, modtag_http_grpc_access_log);
    const { loadingCount } = useLoading();
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version,
        reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.cgal?.CommonGrpcAccessLogConfig,
            sf: vTags.cgal?.CommonGrpcAccessLogConfig_SingleFields,
            e: ['grpc_service', 'grpc_stream_retry_policy', 'custom_tags'],
        }),
    ];

    useManagedLoading(loading);
    if (loadingCount > 0) {
        return <RenderLoading checkPage={true} isLoadingQuery={true} error={""} />;
    }

    return (
        <ECard title="Common gRPC Access Log Config">
            <HorizonTags veri={{
                tags: vTags.cgal?.CommonGrpcAccessLogConfig,
                selectedTags: selectedTags,
                unsupportedTags: [],
                handleChangeTag: handleChangeTag,
                keyPrefix: keyPrefix,
                tagPrefix: '',
                required: ['log_name', 'grpc_service'],
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
                shouldRender={matchesEndOrStartOf('grpc_service', selectedTags)}
                Component={CommonComponentGrpcService}
                componentProps={{
                    version: version,
                    reduxStore: reduxStore?.grpc_service,
                    reduxAction: reduxAction,
                    keyPrefix: `${keyPrefix}.grpc_service`,
                }}
            />
            <ConditionalComponent
                shouldRender={matchesEndOrStartOf('grpc_stream_retry_policy', selectedTags)}
                Component={CommonComponentCoreRetryPolicy}
                componentProps={{
                    version: version,
                    reduxStore: reduxStore?.grpc_stream_retry_policy,
                    reduxAction: reduxAction,
                    keyPrefix: `${keyPrefix}.grpc_stream_retry_policy`,
                    tagMatchPrefix: 'CommonGrpcAccessLogConfig',
                }}
            />
            <ConditionalComponent
                shouldRender={matchesEndOrStartOf('custom_tags', selectedTags)}
                Component={CommonComponentCustomTags}
                componentProps={{
                    version: version,
                    reduxStore: reduxStore?.custom_tags,
                    reduxAction: reduxAction,
                    keyPrefix: `${keyPrefix}.custom_tags`,
                    id: `custom_tags_0`,
                }}
            />
        </ECard>
    );
};

export default React.memo(ComponentCommonGrpcAccessLogConfig);
