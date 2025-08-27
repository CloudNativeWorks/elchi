import React from "react";
import { Col, Divider } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import { FieldConfigType, startsWithAny } from "@/utils/tools";
import useResourceForm from "@/hooks/useResourceForm";
import ECard from "@/elchi/components/common/ECard";
import { useTags } from "@/hooks/useTags";
import { modtag_quick_protocol_options } from "./_modtag_";
import { generateFields } from "@/common/generate-fields";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import { EFields } from "@/elchi/components/common/e-components/EFields";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";
import CommonComponentQuicKeepAliveSettings from "@/elchi/components/resources/common/QuickKeepaliveSettings/QuickKeepaliveSettings";


type GeneralProps = {
    veri: {
        version: string;
        index: number;
        reduxStore: any;
        keyPrefix: string;
        tagMatchPrefix: string;
        title: string;
    }
};

const CommonComponentQuickProtocolOptions: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_quick_protocol_options);
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
        <ECard title={veri.title}>
            <HorizonTags veri={{
                tags: vTags.qpo?.QuicProtocolOptions,
                selectedTags: selectedTags,
                unsupportedTags: [],
                index: veri.index,
                handleChangeTag: handleChangeTag,
                tagMatchPrefix: veri.tagMatchPrefix,
                keyPrefix: `${veri.keyPrefix}`,
            }} />
            <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
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
            <ConditionalComponent
                shouldRender={startsWithAny("connection_keepalive", selectedTags)}
                Component={CommonComponentQuicKeepAliveSettings}
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

export default memorizeComponent(CommonComponentQuickProtocolOptions, compareVeri);
