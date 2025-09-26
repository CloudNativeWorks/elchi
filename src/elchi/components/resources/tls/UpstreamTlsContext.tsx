import React from "react";
import { useLocation } from "react-router-dom";
import { Col, Row, Divider } from "antd";
import { HeadOfResource } from "@/elchi/components/common/HeadOfResources";
import CustomAnchor from "@/elchi/components/common/CustomAnchor";
import CommonComponentSingleOptions from "@/elchi/components/resources/common/SingleOptions/SingleOptions";
import { FieldConfigType, matchesEndOrStartOf } from "@/utils/tools";
import ComponentCommonTlsContext from './CommonTlsContext';
import { GTypes } from "@/common/statics/gtypes";
import { useGTypeFields } from "@/hooks/useGtypes";
import useResourceMain from "@/hooks/useResourceMain";
import { useModels } from "@/hooks/useModels";
import { useTags } from "@/hooks/useTags";
import RenderLoading from "../../common/Loading";
import { modtag_upstream_tls_context } from "./_modtag_";
import { generateFields } from "@/common/generate-fields";
import { useLoading } from "@/hooks/loadingContext";
import { useManagedLoading } from "@/hooks/useManageLoading";
import { ConditionalComponent } from "../../common/ConditionalComponent";
import { modtag_us_secret } from "../secret/_modtag_";


type GeneralProps = {
    veri: {
        version: string;
        gtype: string;
        queryResource: any;
        generalName: string;
        changeGeneralName: any;
    }
};

const UpstreamTLSContextComponent: React.FC<GeneralProps> = ({ veri }) => {
    const GType = useGTypeFields(GTypes.UpstreamTlsContext);
    const location = useLocation();
    const { vModels, loading_m } = useModels(veri.version, modtag_upstream_tls_context);
    const { vTags, loading } = useTags(veri.version, modtag_upstream_tls_context);
    const { loadingCount } = useLoading();
    const { reduxStore, selectedTags, handleChangeTag } = useResourceMain({
        version: veri.version,
        alias: "utc",
        vModels,
        vTags,
        modelName: "UpstreamTlsContext",
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.utc?.UpstreamTlsContext,
            sf: vTags.utc?.UpstreamTlsContext_SingleFields,
        }),
    ]

    useManagedLoading(loading, loading_m);
    if (loadingCount > 0) {
        return <RenderLoading checkPage={true} isLoadingQuery={!vModels || !vTags || loading} error={""} />;
    }

    return (
        reduxStore && (
            <>
                <HeadOfResource
                    generalName={veri.generalName}
                    changeGeneralName={veri.changeGeneralName}
                    version={veri.version}
                    locationCheck={GType.createPath === location.pathname}
                    createUpdate={{
                        location_path: location.pathname,
                        GType: GType,
                        offset: 0,
                        name: veri.generalName,
                        reduxStore: reduxStore,
                        voidToJSON: vModels.utc?.UpstreamTlsContext.toJSON,
                        queryResource: veri.queryResource,
                        envoyVersion: veri.version,
                        gtype: reduxStore?.$type,
                    }}
                />
                <Divider type="horizontal" orientation="left" orientationMargin="0">Upstream TLS Configuration</Divider>
                <Row>
                    <Col md={4} style={{ display: "block", maxHeight: "auto", overflowY: "auto" }}>
                        <CustomAnchor
                            resourceConfKeys={vTags.utc?.UpstreamTlsContext}
                            singleOptionKeys={vTags.utc?.UpstreamTlsContext_SingleFields}
                            selectedTags={selectedTags}
                            index={0}
                            handleChangeTag={handleChangeTag}
                            tagMatchPrefix={"UpstreamTlsContext"}
                        />
                    </Col>
                    <Col md={20}>
                        <ConditionalComponent
                            shouldRender={matchesEndOrStartOf("common_tls_context", selectedTags)}
                            Component={ComponentCommonTlsContext}
                            componentProps={{
                                version: veri.version,
                                keyPrefix: 'common_tls_context',
                                reduxStore: reduxStore?.common_tls_context,
                                tagPrefix: 'common_tls_context',
                                tagMatchPrefix: 'UpstreamTlsContext.common_tls_context',
                                unsupportedTags: modtag_us_secret['common_tls_context'],
                                id: `common_tls_context_0`,
                            }}
                        />
                        <ConditionalComponent
                            shouldRender={selectedTags?.some(item => vTags.utc?.UpstreamTlsContext_SingleFields.includes(item))}
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
        )
    )
}

export default React.memo(UpstreamTLSContextComponent);