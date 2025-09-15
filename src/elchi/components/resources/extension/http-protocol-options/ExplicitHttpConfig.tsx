import React from "react";
import { Col, Row, Divider } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import useResourceForm from "@/hooks/useResourceForm";
import ECard from "@/elchi/components/common/ECard";
import { startsWithAny } from "@/utils/tools";
import ComponentHttp1ProtocolOptions from "./Http1ProtocolOptions";
import ComponentHttp2ProtocolOptions from "./Http2ProtocolOptions";
import ComponentHttp3ProtocolOptions from "./Http3ProtocolOptions";
import { navigateCases } from "@/elchi/helpers/navigate-cases";
import { useTags } from "@/hooks/useTags";
import { modtag_explicit_http_config } from "./_modtag_";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
    }
};

const ComponentExplicitHttpConfig: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_explicit_http_config);
    const { selectedTags, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    return (
        <ECard title="Explicit Http Config">
            <HorizonTags veri={{
                tags: vTags.ehc?.HttpProtocolOptions_ExplicitHttpConfig,
                selectedTags: selectedTags,
                keyPrefix: veri.keyPrefix,
                handleChangeTag: handleChangeTag,
                tagPrefix: 'protocol_config',
                onlyOneTag: [['protocol_config.http_protocol_options', 'protocol_config.http2_protocol_options', 'protocol_config.http3_protocol_options']],
            }} />
            <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
            <Row>
                <Col md={24}>
                    <ConditionalComponent
                        shouldRender={startsWithAny("protocol_config.http_protocol_options", selectedTags)}
                        Component={ComponentHttp1ProtocolOptions}
                        componentProps={{
                            version: veri.version,
                            reduxStore: navigateCases(veri.reduxStore, "protocol_config.http_protocol_options"),
                            keyPrefix: `${veri.keyPrefix}.http_protocol_options`,
                            id: `http3_protocol_options_0`,
                        }}
                    />
                    <ConditionalComponent
                        shouldRender={startsWithAny("protocol_config.http2_protocol_options", selectedTags)}
                        Component={ComponentHttp2ProtocolOptions}
                        componentProps={{
                            version: veri.version,
                            reduxStore: navigateCases(veri.reduxStore, "protocol_config.http2_protocol_options"),
                            keyPrefix: `${veri.keyPrefix}.http2_protocol_options`,
                            id: `http2_protocol_options_0`,
                        }}
                    />
                    <ConditionalComponent
                        shouldRender={startsWithAny("protocol_config.http3_protocol_options", selectedTags)}
                        Component={ComponentHttp3ProtocolOptions}
                        componentProps={{
                            version: veri.version,
                            reduxStore: navigateCases(veri.reduxStore, "protocol_config.http3_protocol_options"),
                            keyPrefix: `${veri.keyPrefix}.http3_protocol_options`,
                            id: `http3_protocol_options_0`,
                        }}
                    />
                </Col>
            </Row>
        </ECard>
    )
};

export default memorizeComponent(ComponentExplicitHttpConfig, compareVeri);