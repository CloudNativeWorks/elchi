import React from "react";
import { Col, Row, Divider } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import { FieldConfigType, startsWithAny } from "@/utils/tools";
import useResourceForm from "@/hooks/useResourceForm";
import ECard from "@/elchi/components/common/ECard";
import { useTags } from "@/hooks/useTags";
import { modtag_http3_protocol_options } from "./_modtag_";
import { generateFields } from "@/common/generate-fields";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import { EFields } from "@/elchi/components/common/e-components/EFields";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";
import CommonComponentQuickProtocolOptions from "@/elchi/components/resources/common/QuickProtocolOptions/QuickProtocolOptions";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
    }
};

const ComponentHttp3ProtocolOptions: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_http3_protocol_options);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.h3po?.Http3ProtocolOptions,
            sf: vTags.h3po?.Http3ProtocolOptions_SingleFields,
        })
    ];

    return (
        <ECard title="Http3 Protocol Options">
            <HorizonTags veri={{
                tags: vTags.h3po?.Http3ProtocolOptions,
                selectedTags: selectedTags,
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
                shouldRender={startsWithAny("quic_protocol_options", selectedTags)}
                Component={CommonComponentQuickProtocolOptions}
                componentProps={{
                    version: veri.version,
                    reduxStore: veri.reduxStore?.quic_protocol_options,
                    keyPrefix: `${veri.keyPrefix}.quic_protocol_options`,
                    id: `quic_protocol_options_0`,
                    title: "Quic Protocol Options",
                }}
            />
        </ECard>
    )
};

export default memorizeComponent(ComponentHttp3ProtocolOptions, compareVeri);