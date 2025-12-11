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
import { modtag_redis_proxy } from '../_modtag_';
import { generateFields } from '@/common/generate-fields';
import useResourceForm from '@/hooks/useResourceForm';
import { FieldConfigType, matchesEndOrStartOf } from '@/utils/tools';
import { ConditionalComponent } from '@/elchi/components/common/ConditionalComponent';
import CommonComponentGrpcService from '@resources/common/GrpcService/GrpcService';

type Props = {
    veri: {
        version: string;
        reduxStore: any;
        reduxAction: any;
        keyPrefix: string;
    }
};

const ComponentExternalAuthProvider: React.FC<Props> = ({ veri }) => {
    const { version, reduxStore, keyPrefix, reduxAction } = veri;
    const { vTags, loading } = useTags(version, modtag_redis_proxy);
    const { loadingCount } = useLoading();
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version,
        reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.reap?.RedisExternalAuthProvider,
            sf: vTags.reap?.RedisExternalAuthProvider_SingleFields,
            e: ['grpc_service'],
        }),
    ];

    useManagedLoading(loading);
    if (loadingCount > 0) {
        return <RenderLoading checkPage={true} isLoadingQuery={true} error={""} />;
    }

    return (
        <ECard title="External Auth Provider">
            <HorizonTags veri={{
                tags: vTags.reap?.RedisExternalAuthProvider,
                selectedTags: selectedTags,
                unsupportedTags: [],
                handleChangeTag: handleChangeTag,
                keyPrefix: keyPrefix,
                tagPrefix: '',
                required: ['grpc_service'],
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
        </ECard>
    );
};

export default React.memo(ComponentExternalAuthProvider);
