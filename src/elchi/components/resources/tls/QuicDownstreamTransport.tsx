import React from "react";
import { useLocation } from "react-router-dom";
import { Col, Row, Divider } from "antd";
import { HeadOfResource } from "@/elchi/components/common/HeadOfResources";
import CustomAnchor from "@/elchi/components/common/CustomAnchor";
import CommonComponentSingleOptions from "@/elchi/components/resources/common/SingleOptions/SingleOptions";
import ComponentDownstreamTlsContextNested from './DownstreamTlsContextNested';
import { ConditionalComponent } from "../../common/ConditionalComponent";
import { FieldConfigType, matchesEndOrStartOf } from "@/utils/tools";
import { GTypes } from "@/common/statics/gtypes";
import { useGTypeFields } from "@/hooks/useGtypes";
import useResourceMain from "@/hooks/useResourceMain";
import { useTags } from "@/hooks/useTags";
import RenderLoading from "../../common/Loading";
import { modtag_quic_downstream_transport } from "./_modtag_";
import { useModels } from "@/hooks/useModels";
import { generateFields } from "@/common/generate-fields";
import { useLoading } from "@/hooks/loadingContext";
import { useManagedLoading } from "@/hooks/useManageLoading";


type GeneralProps = {
    veri: {
        version: string;
        gtype: string;
        queryResource: any;
        generalName: string;
        changeGeneralName: any;
    }
};

const QuicDownstreamTransportComponent: React.FC<GeneralProps> = ({ veri }) => {
    const GType = useGTypeFields(GTypes.QuicDownstreamTransport);
    const { vModels, loading_m } = useModels(veri.version, modtag_quic_downstream_transport);
    const { vTags, loading } = useTags(veri.version, modtag_quic_downstream_transport);
    const location = useLocation();
    const { loadingCount } = useLoading();
    const { reduxStore, selectedTags, handleChangeTag } = useResourceMain({
        version: veri.version,
        alias: "qdt",
        vModels,
        vTags,
        modelName: "QuicDownstreamTransport",
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.qdt?.QuicDownstreamTransport,
            sf: vTags.qdt?.QuicDownstreamTransport_SingleFields,
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
                        voidToJSON: vModels.qdt?.QuicDownstreamTransport.toJSON,
                        queryResource: veri.queryResource,
                        envoyVersion: veri.version,
                        gtype: reduxStore?.$type,
                    }}
                />
                <Divider type="horizontal" orientation="left" orientationMargin="0">QUIC Downstream Transport Configuration</Divider>
                <Row>
                    <Col md={4} style={{ display: "block", maxHeight: "auto", overflowY: "auto" }}>
                        <CustomAnchor
                            resourceConfKeys={vTags.qdt?.QuicDownstreamTransport}
                            unsuportedTags={[]}
                            singleOptionKeys={vTags.qdt?.QuicDownstreamTransport_SingleFields}
                            selectedTags={selectedTags}
                            index={0}
                            handleChangeTag={handleChangeTag}
                            tagMatchPrefix={"QuicDownstreamTransport"}
                            required={[]}
                            onlyOneTag={[]}
                            specificTagPrefix={{}}
                        />
                    </Col>
                    <Col md={20}>
                        <ConditionalComponent
                            shouldRender={matchesEndOrStartOf("downstream_tls_context", selectedTags || [])}
                            Component={ComponentDownstreamTlsContextNested}
                            componentProps={{
                                version: veri.version,
                                reduxStore: reduxStore?.downstream_tls_context,
                                keyPrefix: 'downstream_tls_context',
                                id: 'downstream_tls_context_0',
                                title: "Downstream TLS Context",
                                tagMatchPrefix: 'QuicDownstreamTransport.downstream_tls_context',
                            }}
                        />

                        {selectedTags?.some(item => vTags.qdt?.QuicDownstreamTransport_SingleFields?.includes(item)) &&
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

export default React.memo(QuicDownstreamTransportComponent);
