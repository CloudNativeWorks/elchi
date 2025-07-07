import React from "react";
import { Col, Row, Divider } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import { FieldConfigType, startsWithAny } from "@/utils/tools";
import useResourceForm from "@/hooks/useResourceForm";
import ECard from "@/elchi/components/common/ECard";
import { useTags } from "@/hooks/useTags";
import { modtag_http2_protocol_options } from "./_modtag_";
import { generateFields } from "@/common/generate-fields";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import { EFields } from "@/elchi/components/common/e-components/EFields";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";
import CommonComponentKeepaliveSettings from "@/elchi/components/resources/common/KeepaliveSettings/KeepaliveSettings";

type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
    }
};

const ComponentHttp2ProtocolOptions: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_http2_protocol_options);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.h2po?.Http2ProtocolOptions,
            sf: vTags.h2po?.Http2ProtocolOptions_SingleFields,
        })
    ];

    return (
        <ECard title="Http2 Protocol Options">
            <HorizonTags veri={{
                tags: vTags.h2po?.Http2ProtocolOptions,
                selectedTags: selectedTags,
                unsupportedTags: ["stream_error_on_invalid_http_messaging"],
                keyPrefix: veri.keyPrefix,
                handleChangeTag: handleChangeTag,
            }} />
            <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
            <Row>
                <Col md={24}>
                    <EForm>
                        <EFields
                            fieldConfigs={fieldConfigs}
                            selectedTags={selectedTags}
                            handleChangeRedux={handleChangeRedux}
                            reduxStore={veri.reduxStore}
                            keyPrefix={veri.keyPrefix}
                            version={veri.version}
                        />
                    </EForm>
                </Col>
            </Row>
            <ConditionalComponent
                shouldRender={startsWithAny("connection_keepalive", selectedTags)}
                Component={CommonComponentKeepaliveSettings}
                componentProps={{
                    version: veri.version,
                    reduxStore: veri.reduxStore?.connection_keepalive,
                    keyPrefix: `${veri.keyPrefix}.connection_keepalive`,
                    id: `connection_keepalive_0`,
                    title: "Connection Keepalive",
                }}
            />
        </ECard>
    )
};

export default memorizeComponent(ComponentHttp2ProtocolOptions, compareVeri);