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
import { modtag_proxy_protocol } from './_modtag_';
import { generateFields } from '@/common/generate-fields';
import RenderLoading from '@/elchi/components/common/Loading';
import { useLoading } from '@/hooks/loadingContext';
import { useManagedLoading } from '@/hooks/useManageLoading';
import ComponentRules from "./Rules";
import ComponentProxyProtocolPassThroughTLVs from "./PassThroughTlvs";
import { FieldTypes } from '@/common/statics/general';
import { ConditionalComponent } from '@/elchi/components/common/ConditionalComponent';


type GeneralProps = {
    veri: {
        version: string;
        queryResource: any;
        generalName: string;
        changeGeneralName: any;
    }
};

const ComponentOriginalSrc: React.FC<GeneralProps> = ({ veri }) => {
    const GType = useGTypeFields(GTypes.ListenerProxyProtocol);
    const location = useLocation();
    const { vModels, loading_m } = useModels(veri.version, modtag_proxy_protocol);
    const { vTags, loading } = useTags(veri.version, modtag_proxy_protocol);
    const { loadingCount } = useLoading();
    const { reduxStore, selectedTags, handleChangeTag } = useResourceMain({
        version: veri.version,
        alias: "pp",
        vModels,
        vTags,
        modelName: "ProxyProtocol",
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.pp?.ProxyProtocol,
            sf: vTags.pp?.ProxyProtocol_SingleFields,
        }),
        {
            type: FieldTypes.Tags, tag: "disallowed_versions", fieldPath: 'disallowed_versions', values: ["V1", "V2"]
        },
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
                    voidToJSON: vModels.pp?.ProxyProtocol.toJSON,
                    queryResource: veri.queryResource,
                    envoyVersion: veri.version,
                    gtype: reduxStore?.$type,
                }}
            />
            <Divider type='horizontal' orientation='left' orientationMargin='0'>Proxy Protocol</Divider>
            <Row>
                <Col md={4} style={{ display: "block", maxHeight: "auto", overflowY: "auto" }}>
                    <CustomAnchor
                        resourceConfKeys={vTags.pp?.ProxyProtocol}
                        singleOptionKeys={vTags.pp?.ProxyProtocol_SingleFields}
                        selectedTags={selectedTags}
                        handleChangeTag={handleChangeTag}
                    />
                </Col>
                <Col md={20}>
                    <ConditionalComponent
                        shouldRender={startsWithAny("rules", selectedTags)}
                        Component={ComponentRules}
                        componentProps={{
                            version: veri.version,
                            reduxStore: reduxStore?.rules,
                            keyPrefix: `rules`,
                            id: `rules_0`,
                        }}
                    />
                    <ConditionalComponent
                        shouldRender={selectedTags?.some(item => vTags.pp?.ProxyProtocol_SingleFields.includes(item))}
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
                        shouldRender={startsWithAny("pass_through_tlvs", selectedTags)}
                        Component={ComponentProxyProtocolPassThroughTLVs}
                        componentProps={{
                            version: veri.version,
                            reduxStore: reduxStore?.pass_through_tlvs,
                            keyPrefix: `pass_through_tlvs`,
                            id: `pass_through_tlvs_0`,
                        }}
                    />
                </Col>
            </Row>
        </>
    );
}

export default React.memo(ComponentOriginalSrc);