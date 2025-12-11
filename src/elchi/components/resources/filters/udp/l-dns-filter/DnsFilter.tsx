import React from 'react';
import { useLocation } from 'react-router-dom';
import { Col, Row, Divider } from 'antd';
import { HeadOfResource } from '@/elchi/components/common/HeadOfResources';
import { FieldConfigType, startsWithAny } from '@/utils/tools';
import CommonComponentSingleOptions from '@/elchi/components/resources/common/SingleOptions/SingleOptions';
import CustomAnchor from '@/elchi/components/common/CustomAnchor';
import { GTypes } from '@/common/statics/gtypes';
import { useGTypeFields } from '@/hooks/useGtypes';
import useResourceMain from '@/hooks/useResourceMain';
import { useModels } from '@/hooks/useModels';
import { useTags } from '@/hooks/useTags';
import { modtag_dns_filter } from './_modtag_';
import { generateFields } from '@/common/generate-fields';
import RenderLoading from '@/elchi/components/common/Loading';
import { useLoading } from '@/hooks/loadingContext';
import { useManagedLoading } from '@/hooks/useManageLoading';
import ComponentClientContextConfig from './ClientConfig';
import ComponentServerContextConfig from './ServerConfig';
import { ConditionalComponent } from '@/elchi/components/common/ConditionalComponent';
import CommonComponentAccessLog from '@resources/common/AccessLog/AccessLog';
import { ResourceAction } from '@/redux/reducers/slice';


type GeneralProps = {
    veri: {
        version: string;
        queryResource: any;
        generalName: string;
        changeGeneralName: any;
    }
};

const ComponentDnsFilter: React.FC<GeneralProps> = ({ veri }) => {
    const GType = useGTypeFields(GTypes.ListenerDnsFilter);
    const location = useLocation();
    const { vModels, loading_m } = useModels(veri.version, modtag_dns_filter);
    const { vTags, loading } = useTags(veri.version, modtag_dns_filter);
    const { loadingCount } = useLoading();
    const { reduxStore, selectedTags, handleChangeTag } = useResourceMain({
        version: veri.version,
        alias: "df",
        vModels,
        vTags,
        modelName: "DnsFilterConfig",
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.df?.DnsFilterConfig,
            sf: vTags.df?.DnsFilterConfig_SingleFields,
            e: [],
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
                    voidToJSON: vModels.df?.DnsFilterConfig.toJSON,
                    queryResource: veri.queryResource,
                    envoyVersion: veri.version,
                    gtype: reduxStore?.$type,
                }}
            />
            <Divider type='horizontal' orientation='left' orientationMargin='0'>DNS Filter</Divider>
            <Row>
                <Col md={4} style={{ display: "block", maxHeight: "auto", overflowY: "auto" }}>
                    <CustomAnchor
                        resourceConfKeys={vTags.df?.DnsFilterConfig}
                        singleOptionKeys={vTags.df?.DnsFilterConfig_SingleFields}
                        selectedTags={selectedTags}
                        handleChangeTag={handleChangeTag}
                    />
                </Col>
                <Col md={20}>
                    <ConditionalComponent
                        shouldRender={selectedTags?.some(item => vTags.df?.DnsFilterConfig_SingleFields.includes(item))}
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
                        shouldRender={startsWithAny("server_config", selectedTags)}
                        Component={ComponentServerContextConfig}
                        componentProps={{
                            version: veri.version,
                            reduxStore: reduxStore?.server_config,
                            keyPrefix: 'server_config',
                            title: 'Server Config',
                            id: `server_config_0`,
                        }}
                    />
                    <ConditionalComponent
                        shouldRender={startsWithAny("client_config", selectedTags)}
                        Component={ComponentClientContextConfig}
                        componentProps={{
                            version: veri.version,
                            reduxStore: reduxStore?.client_config,
                            keyPrefix: 'client_config',
                            title: 'Client Config',
                            id: `client_config_0`,
                        }}
                    />
                    <ConditionalComponent
                        shouldRender={startsWithAny("access_log", selectedTags)}
                        Component={CommonComponentAccessLog}
                        componentProps={{
                            version: veri.version,
                            reduxStore: reduxStore?.access_log,
                            reduxAction: ResourceAction,
                            keyPrefix: 'access_log',
                            tagMatchPrefix: 'DnsFilterConfig',
                        }}
                    />
                </Col>
            </Row>
        </>
    );
}

export default React.memo(ComponentDnsFilter);
