import React from "react";
import { Col, Divider } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { FieldConfigType, matchesEndOrStartOf } from "@/utils/tools";
import { useTags } from "@/hooks/useTags";
import { modtag_quic_options, modtag_us_quic_options } from "./_modtag_";
import { generateFields } from "@/common/generate-fields";
import useResourceForm from "@/hooks/useResourceForm";
import ECard from "@/elchi/components/common/ECard";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import { EFields } from "@/elchi/components/common/e-components/EFields";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";
import ComponentQuicProtocolOptions from "./QuicProtocolOptions/QuicProtocolOptions";
import ComponentSaveCmsgConfig from "./SaveCmsgConfig/SaveCmsgConfig";
import { ResourceAction } from '@/redux/reducers/slice';

type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
        id: string;
        title: string;
        reduxAction: typeof ResourceAction;
    }
};

const ComponentQuicOptions: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_quic_options);

    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.qo?.QuicProtocolOptions,
            sf: vTags.qo?.QuicProtocolOptions_SingleFields,
        }),
    ];

    return (
        <ECard title={veri.title} id={veri.id}>
            <HorizonTags veri={{
                tags: vTags.qo?.QuicProtocolOptions,
                selectedTags: selectedTags || [],
                unsupportedTags: modtag_us_quic_options.QuicProtocolOptions || [],
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
                    shouldRender={matchesEndOrStartOf("quic_protocol_options", selectedTags || [])}
                    Component={ComponentQuicProtocolOptions}
                    componentProps={{
                        version: veri.version,
                        reduxStore: veri.reduxStore?.quic_protocol_options,
                        keyPrefix: `${veri.keyPrefix}.quic_protocol_options`,
                        id: `${veri.id}_quic_protocol_options`,
                        title: "QUIC Protocol Options"
                    }}
                />
                <ConditionalComponent
                    shouldRender={matchesEndOrStartOf("save_cmsg_config", selectedTags || [])}
                    Component={ComponentSaveCmsgConfig}
                    componentProps={{
                        version: veri.version,
                        reduxStore: veri.reduxStore?.save_cmsg_config,
                        keyPrefix: `${veri.keyPrefix}.save_cmsg_config`,
                        id: `${veri.id}_save_cmsg_config`,
                        title: "Save Cmsg Config",
                        reduxAction: veri.reduxAction
                    }}
                />
            </Col>
        </ECard>
    );
};

export default ComponentQuicOptions;
