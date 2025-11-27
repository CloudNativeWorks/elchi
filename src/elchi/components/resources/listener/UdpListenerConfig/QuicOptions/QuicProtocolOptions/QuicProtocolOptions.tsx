import React from "react";
import { Col, Divider } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { FieldConfigType, matchesEndOrStartOf } from "@/utils/tools";
import { useTags } from "@/hooks/useTags";
import { modtag_quic_protocol_options, modtag_us_quic_protocol_options } from "./_modtag_";
import { generateFields } from "@/common/generate-fields";
import useResourceForm from "@/hooks/useResourceForm";
import ECard from "@/elchi/components/common/ECard";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import { EFields } from "@/elchi/components/common/e-components/EFields";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";
import ComponentQuicKeepAliveSettings from "./QuicKeepAliveSettings/QuicKeepAliveSettings";

type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
        id: string;
        title: string;
    }
};

const ComponentQuicProtocolOptions: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_quic_protocol_options);

    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.qpo?.QuicProtocolOptions,
            sf: vTags.qpo?.QuicProtocolOptions_SingleFields,
        }),
    ];

    return (
        <ECard title={veri.title} id={veri.id} size="small">
            <HorizonTags veri={{
                tags: vTags.qpo?.QuicProtocolOptions,
                selectedTags: selectedTags || [],
                unsupportedTags: modtag_us_quic_protocol_options.QuicProtocolOptions || [],
                keyPrefix: veri.keyPrefix,
                handleChangeTag: handleChangeTag,
            }} />
            <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
            <Col md={24}>
                <EForm>
                    <EFields
                        fieldConfigs={fieldConfigs}
                        selectedTags={selectedTags || []}
                        handleChangeRedux={handleChangeRedux}
                        reduxStore={veri.reduxStore}
                        keyPrefix={veri.keyPrefix}
                        version={veri.version}
                    />
                </EForm>
                <ConditionalComponent
                    shouldRender={matchesEndOrStartOf("connection_keepalive", selectedTags || [])}
                    Component={ComponentQuicKeepAliveSettings}
                    componentProps={{
                        version: veri.version,
                        reduxStore: veri.reduxStore?.connection_keepalive,
                        keyPrefix: `${veri.keyPrefix}.connection_keepalive`,
                        id: `${veri.id}_connection_keepalive`,
                        title: "Connection Keep Alive"
                    }}
                />
            </Col>
        </ECard>
    );
};

export default ComponentQuicProtocolOptions;
