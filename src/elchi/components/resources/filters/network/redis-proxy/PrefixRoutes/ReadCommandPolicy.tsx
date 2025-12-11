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
import CommonComponentCluster from '@resources/common/Clusters/Cluster/Cluster';

type Props = {
    veri: {
        version: string;
        reduxStore: any;
        reduxAction: any;
        keyPrefix: string;
    }
};

const ComponentReadCommandPolicy: React.FC<Props> = ({ veri }) => {
    const { version, reduxStore, keyPrefix, reduxAction } = veri;
    const { vTags, loading } = useTags(version, modtag_prefix_routes);
    const { loadingCount } = useLoading();
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version,
        reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.prrrc?.RedisProxy_PrefixRoutes_Route_ReadCommandPolicy,
            sf: vTags.prrrc?.RedisProxy_PrefixRoutes_Route_ReadCommandPolicy_SingleFields,
            e: ['cluster'],
        }),
    ];

    useManagedLoading(loading);
    if (loadingCount > 0) {
        return <RenderLoading checkPage={true} isLoadingQuery={true} error={""} />;
    }

    return (
        <ECard title="Read Command Policy">
            <HorizonTags veri={{
                tags: vTags.prrrc?.RedisProxy_PrefixRoutes_Route_ReadCommandPolicy,
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
        </ECard>
    );
};

export default React.memo(ComponentReadCommandPolicy);
