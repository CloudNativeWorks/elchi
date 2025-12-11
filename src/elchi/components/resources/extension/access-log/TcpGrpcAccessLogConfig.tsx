import React from 'react';
import { Col, Row, Divider } from 'antd';
import { useLocation } from 'react-router-dom';
import { ResourceAction } from '@/redux/reducers/slice';
import { HeadOfResource } from '@/elchi/components/common/HeadOfResources';
import { FieldConfigType, matchesEndOrStartOf } from '@/utils/tools';
import CommonComponentSingleOptions from '@/elchi/components/resources/common/SingleOptions/SingleOptions';
import ComponentCommonGrpcAccessLogConfig from './CommonGrpcAccessLogConfig';
import CustomAnchor from '@/elchi/components/common/CustomAnchor';
import { GTypes } from '@/common/statics/gtypes';
import { useGTypeFields } from '@/hooks/useGtypes';
import useResourceMain from '@/hooks/useResourceMain';
import { useModels } from '@/hooks/useModels';
import { useTags } from '@/hooks/useTags';
import { modtag_tcp_grpc_access_log } from './_modtag_';
import { generateFields } from '@/common/generate-fields';
import RenderLoading from '@/elchi/components/common/Loading';
import { useLoading } from '@/hooks/loadingContext';
import { useManagedLoading } from '@/hooks/useManageLoading';
import { ConditionalComponent } from '@/elchi/components/common/ConditionalComponent';

type GeneralProps = {
    veri: {
        version: string;
        gtype: string;
        queryResource: any;
        generalName: string;
        changeGeneralName: any;
    }
};

const TcpGrpcAccessLogConfigComponent: React.FC<GeneralProps> = ({ veri }) => {
    const GType = useGTypeFields(GTypes.TcpGrpcAccessLog);
    const location = useLocation();
    const { vModels, loading_m } = useModels(veri.version, modtag_tcp_grpc_access_log);
    const { vTags, loading } = useTags(veri.version, modtag_tcp_grpc_access_log);
    const { loadingCount } = useLoading();
    const { reduxStore, selectedTags, handleChangeTag } = useResourceMain({
        version: veri.version,
        alias: "tgal",
        vModels,
        vTags,
        modelName: "TcpGrpcAccessLogConfig",
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.tgal?.TcpGrpcAccessLogConfig,
            sf: vTags.tgal?.TcpGrpcAccessLogConfig_SingleFields,
            e: ['common_config'],
            r: [],
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
                    voidToJSON: vModels.tgal?.TcpGrpcAccessLogConfig.toJSON,
                    queryResource: veri.queryResource,
                    envoyVersion: veri.version,
                    gtype: reduxStore?.$type,
                }}
            />
            <Divider type='horizontal' orientation='left' orientationMargin='0'>TCP gRPC Access Log Config</Divider>
            <Row>
                <Col md={4} style={{ display: "block", maxHeight: "auto", overflowY: "auto" }}>
                    <CustomAnchor
                        resourceConfKeys={vTags.tgal?.TcpGrpcAccessLogConfig}
                        unsuportedTags={[]}
                        singleOptionKeys={vTags.tgal?.TcpGrpcAccessLogConfig_SingleFields}
                        selectedTags={selectedTags}
                        handleChangeTag={handleChangeTag}
                        tagMatchPrefix={'TcpGrpcAccessLogConfig'}
                        required={['common_config']}
                    />
                </Col>
                <Col md={20}>
                    <ConditionalComponent
                        shouldRender={matchesEndOrStartOf('common_config', selectedTags)}
                        Component={ComponentCommonGrpcAccessLogConfig}
                        componentProps={{
                            version: veri.version,
                            reduxStore: reduxStore?.common_config,
                            reduxAction: ResourceAction,
                            keyPrefix: `common_config`,
                            tagMatchPrefix: 'TcpGrpcAccessLogConfig',
                        }}
                    />
                    <ConditionalComponent
                        shouldRender={selectedTags?.some(item => vTags.tgal?.TcpGrpcAccessLogConfig_SingleFields?.includes(item))}
                        Component={CommonComponentSingleOptions}
                        componentProps={{
                            version: veri.version,
                            selectedTags: selectedTags,
                            fieldConfigs: fieldConfigs,
                            reduxStore: reduxStore,
                            id: `single_options_0`,
                        }}
                    />
                </Col>
            </Row>
        </>
    );
}

export default React.memo(TcpGrpcAccessLogConfigComponent);
