import React from "react";
import { Col, Row, Divider } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import { FieldConfigType, startsWithAny } from "@/utils/tools";
import useResourceForm from "@/hooks/useResourceForm";
import ECard from "@/elchi/components/common/ECard";
import { useTags } from "@/hooks/useTags";
import { useModels } from "@/hooks/useModels";
import { modtag_http3_protocol_options } from "./_modtag_";
import { generateFields } from "@/common/generate-fields";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import { EFields } from "@/elchi/components/common/e-components/EFields";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";
import CommonComponentQuickProtocolOptions from "@/elchi/components/resources/common/QuickProtocolOptions/QuickProtocolOptions";
import { handleChangeResources } from "@/redux/dispatcher";
import { ActionType, ResourceType } from "@/redux/reducer-helpers/common";
import { ResourceAction } from "@/redux/reducers/slice";
import { useDispatch } from "react-redux";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
    }
};

const ComponentHttp3ProtocolOptions: React.FC<GeneralProps> = ({ veri }) => {
    const dispatch = useDispatch();
    const { vModels } = useModels(veri.version, modtag_http3_protocol_options);
    const { vTags } = useTags(veri.version, modtag_http3_protocol_options);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const handleApplySnippet = (keys: string, data: any) => {
        handleChangeResources({ version: veri.version, type: ActionType.Update, keys: keys, val: data, resourceType: ResourceType.Resource }, dispatch, ResourceAction);
    };

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.h3po?.Http3ProtocolOptions,
            sf: vTags.h3po?.Http3ProtocolOptions_SingleFields,
        })
    ];

    return (
        <ECard 
            title="Http3 Protocol Options"
            reduxStore={veri.reduxStore}
            ctype="http3_protocol_options"
            toJSON={vModels.h3po?.Http3ProtocolOptions?.toJSON}
            onApply={handleApplySnippet}
            keys={veri.keyPrefix}
            version={veri.version}
        >
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