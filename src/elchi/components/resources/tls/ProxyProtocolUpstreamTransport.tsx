import React from "react";
import { useLocation } from "react-router-dom";
import { Col, Row, Divider } from "antd";
import { HeadOfResource } from "@/elchi/components/common/HeadOfResources";
import CustomAnchor from "@/elchi/components/common/CustomAnchor";
import CommonComponentSingleOptions from "@/elchi/components/resources/common/SingleOptions/SingleOptions";
import { ConditionalComponent } from "../../common/ConditionalComponent";
import { FieldConfigType, matchesEndOrStartOf } from "@/utils/tools";
import { GTypes } from "@/common/statics/gtypes";
import { useGTypeFields } from "@/hooks/useGtypes";
import useResourceMain from "@/hooks/useResourceMain";
import { useTags } from "@/hooks/useTags";
import RenderLoading from "../../common/Loading";
import { modtag_proxy_protocol_upstream_transport } from "./_modtag_";
import { useModels } from "@/hooks/useModels";
import { generateFields } from "@/common/generate-fields";
import { useLoading } from "@/hooks/loadingContext";
import { useManagedLoading } from "@/hooks/useManageLoading";
import ProxyProtocolInnerTransportSocket from "./ProxyProtocolInnerTransportSocket";
import ComponentProxyProtocolConfig from "./ProxyProtocolConfig";


type GeneralProps = {
    veri: {
        version: string;
        gtype: string;
        queryResource: any;
        generalName: string;
        changeGeneralName: any;
    }
};

const ProxyProtocolUpstreamTransportComponent: React.FC<GeneralProps> = ({ veri }) => {
    const GType = useGTypeFields(GTypes.ProxyProtocolUpstreamTransport);
    const { vModels, loading_m } = useModels(veri.version, modtag_proxy_protocol_upstream_transport);
    const { vTags, loading } = useTags(veri.version, modtag_proxy_protocol_upstream_transport);
    const location = useLocation();
    const { loadingCount } = useLoading();
    const { reduxStore, selectedTags, handleChangeTag } = useResourceMain({
        version: veri.version,
        alias: "pput",
        vModels,
        vTags,
        modelName: "ProxyProtocolUpstreamTransport",
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.pput?.ProxyProtocolUpstreamTransport,
            sf: vTags.pput?.ProxyProtocolUpstreamTransport_SingleFields,
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
                        voidToJSON: vModels.pput?.ProxyProtocolUpstreamTransport.toJSON,
                        queryResource: veri.queryResource,
                        envoyVersion: veri.version,
                        gtype: reduxStore?.$type,
                    }}
                />
                <Divider type="horizontal" orientation="left" orientationMargin="0">Proxy Protocol Upstream Transport Configuration</Divider>
                <Row>
                    <Col md={4} style={{ display: "block", maxHeight: "auto", overflowY: "auto" }}>
                        <CustomAnchor
                            resourceConfKeys={vTags.pput?.ProxyProtocolUpstreamTransport}
                            unsuportedTags={[]}
                            singleOptionKeys={vTags.pput?.ProxyProtocolUpstreamTransport_SingleFields}
                            selectedTags={selectedTags}
                            index={0}
                            handleChangeTag={handleChangeTag}
                            tagMatchPrefix={"ProxyProtocolUpstreamTransport"}
                            required={["transport_socket"]}
                            onlyOneTag={[]}
                            specificTagPrefix={{}}
                        />
                    </Col>
                    <Col md={20}>
                        <ConditionalComponent
                            shouldRender={matchesEndOrStartOf("config", selectedTags || [])}
                            Component={ComponentProxyProtocolConfig}
                            componentProps={{
                                version: veri.version,
                                reduxStore: reduxStore?.config,
                                keyPrefix: 'config',
                                id: 'config_0',
                            }}
                        />

                        <ConditionalComponent
                            shouldRender={matchesEndOrStartOf("transport_socket", selectedTags || [])}
                            Component={ProxyProtocolInnerTransportSocket}
                            componentProps={{
                                version: veri.version,
                                reduxStore: reduxStore?.transport_socket,
                                keyPrefix: 'transport_socket',
                                id: 'transport_socket_0',
                            }}
                        />

                        {selectedTags?.some(item => vTags.pput?.ProxyProtocolUpstreamTransport_SingleFields?.includes(item)) &&
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

export default React.memo(ProxyProtocolUpstreamTransportComponent);
