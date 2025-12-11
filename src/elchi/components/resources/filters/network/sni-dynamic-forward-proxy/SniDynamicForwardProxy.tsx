import React from 'react';
import { useLocation } from 'react-router-dom';
import { Col, Row, Divider } from 'antd';
import { ResourceAction } from '@/redux/reducers/slice';
import { HeadOfResource } from '@/elchi/components/common/HeadOfResources';
import { FieldConfigType, matchesEndOrStartOf } from '@/utils/tools';
import CommonComponentSingleOptions from '@/elchi/components/resources/common/SingleOptions/SingleOptions';
import CommonComponentDnsCacheConfig from '@resources/common/DnsCacheConfig/DnsCacheConfig';
import CustomAnchor from '@/elchi/components/common/CustomAnchor';
import { GTypes } from '@/common/statics/gtypes';
import { useGTypeFields } from '@/hooks/useGtypes';
import useResourceMain from '@/hooks/useResourceMain';
import { useModels } from '@/hooks/useModels';
import { useTags } from '@/hooks/useTags';
import { modtag_sni_dynamic_forward_proxy, modtag_us_snidfp } from './_modtag_';
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

const ComponentSniDynamicForwardProxy: React.FC<GeneralProps> = ({ veri }) => {
    const GType = useGTypeFields(GTypes.SniDynamicForwardProxy);
    const location = useLocation();
    const { vModels, loading_m } = useModels(veri.version, modtag_sni_dynamic_forward_proxy);
    const { vTags, loading } = useTags(veri.version, modtag_sni_dynamic_forward_proxy);
    const { loadingCount } = useLoading();
    const { reduxStore, selectedTags, handleChangeTag } = useResourceMain({
        version: veri.version,
        alias: "sdfp",
        vModels,
        vTags,
        modelName: "FilterConfig",
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.sdfp?.FilterConfig,
            sf: vTags.sdfp?.FilterConfig_SingleFields,
            e: [],
            r: ['dns_cache_config']
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
                    voidToJSON: vModels.sdfp?.FilterConfig.toJSON,
                    queryResource: veri.queryResource,
                    envoyVersion: veri.version,
                    gtype: reduxStore?.$type,
                }}
            />
            <Divider type='horizontal' orientation='left' orientationMargin='0'>SNI Dynamic Forward Proxy</Divider>
            <Row>
                <Col md={4} style={{ display: "block", maxHeight: "auto", overflowY: "auto" }}>
                    <CustomAnchor
                        resourceConfKeys={vTags.sdfp?.FilterConfig}
                        unsuportedTags={modtag_us_snidfp['FilterConfig']}
                        singleOptionKeys={vTags.sdfp?.FilterConfig_SingleFields}
                        selectedTags={selectedTags}
                        handleChangeTag={handleChangeTag}
                        tagMatchPrefix={'FilterConfig'}
                        required={['dns_cache_config']}
                        specificTagPrefix={{ 'port_value': 'port_specifier' }}
                    />
                </Col>
                <Col md={20}>
                    <ConditionalComponent
                        shouldRender={matchesEndOrStartOf('dns_cache_config', selectedTags)}
                        Component={CommonComponentDnsCacheConfig}
                        componentProps={{
                            version: veri.version,
                            reduxStore: reduxStore?.dns_cache_config,
                            reduxAction: ResourceAction,
                            keyPrefix: `dns_cache_config`,
                            tagMatchPrefix: 'FilterConfig',
                            title: 'DNS Cache Config',
                            id: `dns_cache_config_0`,
                        }}
                    />
                    <ConditionalComponent
                        shouldRender={selectedTags?.some(item => vTags.sdfp?.FilterConfig_SingleFields.includes(item))}
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

export default React.memo(ComponentSniDynamicForwardProxy);
