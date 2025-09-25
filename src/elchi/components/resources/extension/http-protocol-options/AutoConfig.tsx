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
import { modtag_auto_config } from "./_modtag_";
import { useTags } from "@/hooks/useTags";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
    }
};

const ComponentAutoConfig: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_auto_config);
    const { selectedTags, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    return (
        <ECard title={"Auto Config"}>
            <HorizonTags veri={{
                tags: vTags.ahc?.HttpProtocolOptions_AutoHttpConfig,
                unsupportedTags: ["alternate_protocols_cache_options"],
                selectedTags: selectedTags,
                keyPrefix: veri.keyPrefix,
                handleChangeTag: handleChangeTag,
            }} />
            <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
            <Row>
                <Col md={24}>
                    <ConditionalComponent
                        shouldRender={startsWithAny("http_protocol_options", selectedTags)}
                        Component={ComponentHttp1ProtocolOptions}
                        componentProps={{
                            version: veri.version,
                            reduxStore: veri.reduxStore?.http_protocol_options,
                            keyPrefix: `${veri.keyPrefix}.http_protocol_options`,
                            id: `http_protocol_options_0`,
                        }}
                    />
                    <ConditionalComponent
                        shouldRender={startsWithAny("http2_protocol_options", selectedTags)}
                        Component={ComponentHttp2ProtocolOptions}
                        componentProps={{
                            version: veri.version,
                            reduxStore: veri.reduxStore?.http2_protocol_options,
                            keyPrefix: `${veri.keyPrefix}.http2_protocol_options`,
                            id: `http2_protocol_options_0`,
                        }}
                    />
                    <ConditionalComponent
                        shouldRender={startsWithAny("http3_protocol_options", selectedTags)}
                        Component={ComponentHttp3ProtocolOptions}
                        componentProps={{
                            version: veri.version,
                            reduxStore: veri.reduxStore?.http3_protocol_options,
                            keyPrefix: `${veri.keyPrefix}.http3_protocol_options`,
                            id: `http3_protocol_options_0`,
                        }}
                    />
                </Col>
            </Row>
        </ECard>
    )
};

export default memorizeComponent(ComponentAutoConfig, compareVeri);