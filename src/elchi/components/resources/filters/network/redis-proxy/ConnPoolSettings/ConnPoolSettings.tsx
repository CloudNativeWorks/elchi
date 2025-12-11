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
import { modtag_conn_pool_settings } from './_modtag_';
import { generateFields } from '@/common/generate-fields';
import useResourceForm from '@/hooks/useResourceForm';
import { FieldConfigType, matchesEndOrStartOf } from '@/utils/tools';
import { ConditionalComponent } from '@/elchi/components/common/ConditionalComponent';
import ComponentDnsCacheConfig from '@resources/common/DnsCacheConfig/DnsCacheConfig';
import ComponentConnectionRateLimit from './ConnectionRateLimit/ConnectionRateLimit';

type Props = {
    veri: {
        version: string;
        reduxStore: any;
        reduxAction: any;
        keyPrefix: string;
        tagMatchPrefix: string;
    }
};

const ComponentConnPoolSettings: React.FC<Props> = ({ veri }) => {
    const { version, reduxStore, keyPrefix, reduxAction } = veri;
    const { vTags, loading } = useTags(version, modtag_conn_pool_settings);
    const { loadingCount } = useLoading();
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version,
        reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.cps?.RedisProxy_ConnPoolSettings,
            sf: vTags.cps?.RedisProxy_ConnPoolSettings_SingleFields,
            e: [],
        }),
    ];

    useManagedLoading(loading);
    if (loadingCount > 0) {
        return <RenderLoading checkPage={true} isLoadingQuery={true} error={""} />;
    }

    return (
        <ECard title="Connection Pool Settings">
            <HorizonTags veri={{
                tags: vTags.cps?.RedisProxy_ConnPoolSettings,
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
                shouldRender={matchesEndOrStartOf('dns_cache_config', selectedTags)}
                Component={ComponentDnsCacheConfig}
                componentProps={{
                    version: version,
                    reduxStore: reduxStore?.dns_cache_config,
                    reduxAction: reduxAction,
                    keyPrefix: `${keyPrefix}.dns_cache_config`,
                    title: "DNS Cache Config",
                }}
            />
            <ConditionalComponent
                shouldRender={matchesEndOrStartOf('connection_rate_limit', selectedTags)}
                Component={ComponentConnectionRateLimit}
                componentProps={{
                    version: version,
                    reduxStore: reduxStore?.connection_rate_limit,
                    reduxAction: reduxAction,
                    keyPrefix: `${keyPrefix}.connection_rate_limit`,
                    tagMatchPrefix: 'RedisProxy_ConnPoolSettings',
                    id: `connection_rate_limit_0`,
                }}
            />
        </ECard>
    );
};

export default React.memo(ComponentConnPoolSettings);
