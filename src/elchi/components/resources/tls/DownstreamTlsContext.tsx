import React from "react";
import { useLocation } from "react-router-dom";
import { Col, Row, Divider } from "antd";
import { HeadOfResource } from "@/elchi/components/common/HeadOfResources";
import CustomAnchor from "@/elchi/components/common/CustomAnchor";
import CommonComponentSingleOptions from "@/elchi/components/resources/common/SingleOptions/SingleOptions";
import ComponentCommonTlsContext from './CommonTlsContext';
import { FieldConfigType, matchesEndOrStartOf } from "@/utils/tools";
import { GTypes } from "@/common/statics/gtypes";
import { useGTypeFields } from "@/hooks/useGtypes";
import useResourceMain from "@/hooks/useResourceMain";
import { useTags } from "@/hooks/useTags";
import RenderLoading from "../../common/Loading";
import { modtag_downstream_tls_context } from "./_modtag_";
import { useModels } from "@/hooks/useModels";
import { generateFields } from "@/common/generate-fields";
import { useLoading } from "@/hooks/loadingContext";
import { useManagedLoading } from "@/hooks/useManageLoading";
import { ConditionalComponent } from "../../common/ConditionalComponent";
import ComponentSessionTicketKeysSdsConfig from "./SessionTickeyKeysSdsConfig";
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

const DownstreamTLSContextComponent: React.FC<GeneralProps> = ({ veri }) => {
    const GType = useGTypeFields(GTypes.DownstreamTlsContext);
    const { vModels, loading_m } = useModels(veri.version, modtag_downstream_tls_context);
    const { vTags, loading } = useTags(veri.version, modtag_downstream_tls_context);
    const location = useLocation();
    const { loadingCount } = useLoading();
    const { reduxStore, selectedTags, handleChangeTag } = useResourceMain({
        version: veri.version,
        alias: "dtc",
        vModels,
        vTags,
        modelName: "DownstreamTlsContext",
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.dtc?.DownstreamTlsContext,
            sf: vTags.dtc?.DownstreamTlsContext_SingleFields,
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
                        voidToJSON: vModels.dtc?.DownstreamTlsContext.toJSON,
                        queryResource: veri.queryResource,
                        envoyVersion: veri.version,
                        gtype: reduxStore?.$type,
                    }}
                />
                <Divider type="horizontal" orientation="left" orientationMargin="0">Downstream TLS Configuration</Divider>
                <Row>
                    <Col md={4}>
                        <CustomAnchor
                            resourceConfKeys={vTags.dtc?.DownstreamTlsContext}
                            unsuportedTags={modtag_us_secret['DownstreamTlsContext']}
                            singleOptionKeys={[...vTags.dtc?.DownstreamTlsContext_SingleFields, "disable_stateless_session_resumption"]}
                            selectedTags={selectedTags}
                            index={0}
                            handleChangeTag={handleChangeTag}
                            tagMatchPrefix={"DownstreamTlsContext"}
                            required={[]}
                            onlyOneTag={[["session_ticket_keys_type.disable_stateless_session_resumption", "session_ticket_keys_type.session_ticket_keys_sds_secret_config"]]}
                            specificTagPrefix={{ "disable_stateless_session_resumption": "session_ticket_keys_type", "session_ticket_keys_sds_secret_config": "session_ticket_keys_type" }}
                        />
                    </Col>
                    <Col md={20} style={{ display: "block", maxHeight: "83vh", overflowY: "auto" }}>
                        {matchesEndOrStartOf("common_tls_context", selectedTags) &&
                            <div id="common_tls_context_0">
                                <ComponentCommonTlsContext veri={{
                                    version: veri.version,
                                    keyPrefix: 'common_tls_context',
                                    reduxStore: reduxStore?.common_tls_context,
                                    tagPrefix: 'common_tls_context',
                                    tagMatchPrefix: 'common_tls_context',
                                    unsupportedTags: modtag_us_secret['common_tls_context'],
                                }} />
                            </div>
                        }
                        <ConditionalComponent
                            shouldRender={matchesEndOrStartOf("session_ticket_keys_type.session_ticket_keys_sds_secret_config", selectedTags)}
                            Component={ComponentSessionTicketKeysSdsConfig}
                            componentProps={{
                                version: veri.version,
                                keyPrefix: 'session_ticket_keys_sds_secret_config',
                                reduxStore: reduxStore.session_ticket_keys_type,
                                id: `session_ticket_keys_sds_secret_config_0`,
                            }}
                        />

                        {selectedTags?.some(item => vTags.dtc?.DownstreamTlsContext_SingleFields.includes(item)) &&
                            <div id="single_options_0">
                                <CommonComponentSingleOptions veri={{
                                    version: veri.version,
                                    selectedTags: selectedTags,
                                    fieldConfigs: fieldConfigs,
                                    reduxStore: reduxStore,
                                }}
                                />
                            </div>
                        }
                    </Col>
                </Row>
            </>
        )
    )
}

export default React.memo(DownstreamTLSContextComponent);