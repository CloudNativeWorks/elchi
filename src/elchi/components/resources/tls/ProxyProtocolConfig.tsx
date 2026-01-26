import React from "react";
import { Col, Divider } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { FieldConfigType, matchesEndOrStartOf } from "@/utils/tools";
import { useTags } from "@/hooks/useTags";
import { modtag_proxy_protocol_config } from "./_modtag_";
import { generateFields } from "@/common/generate-fields";
import useResourceForm from "@/hooks/useResourceForm";
import ECard from "@/elchi/components/common/ECard";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import { EFields } from "@/elchi/components/common/e-components/EFields";
import { ConditionalComponent } from "../../common/ConditionalComponent";
import ComponentProxyProtocolPassThroughTLVs from "./ProxyProtocolPassThroughTLVs";
import ComponentTlvEntries from "./TlvEntries";
import { ResourceAction } from "@/redux/reducers/slice";

type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
        id: string;
    }
};

/**
 * ProxyProtocolConfig component for configuring PROXY protocol settings
 * Fields:
 * - version: V1 or V2 (enum)
 * - pass_through_tlvs: ProxyProtocolPassThroughTLVs (nested)
 * - added_tlvs: TlvEntry[] (array)
 */
const ComponentProxyProtocolConfig: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_proxy_protocol_config);

    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.ppc?.ProxyProtocolConfig,
            sf: vTags.ppc?.ProxyProtocolConfig_SingleFields,
        }),
    ];

    return (
        <ECard title={"Config"} id={veri.id} size="small">
            <HorizonTags veri={{
                tags: vTags.ppc?.ProxyProtocolConfig,
                selectedTags: selectedTags || [],
                unsupportedTags: [],
                keyPrefix: veri.keyPrefix,
                handleChangeTag: handleChangeTag,
            }} />
            <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
            <Col md={24}>
                {/* Version field (single field) */}
                {selectedTags?.some(item => vTags.ppc?.ProxyProtocolConfig_SingleFields?.includes(item)) &&
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
                }

                {/* Pass Through TLVs (nested component) */}
                <ConditionalComponent
                    shouldRender={matchesEndOrStartOf("pass_through_tlvs", selectedTags || [])}
                    Component={ComponentProxyProtocolPassThroughTLVs}
                    componentProps={{
                        version: veri.version,
                        reduxStore: veri.reduxStore?.pass_through_tlvs,
                        keyPrefix: `${veri.keyPrefix}.pass_through_tlvs`,
                        id: `${veri.id}_pass_through_tlvs`,
                    }}
                />

                {/* Added TLVs (array component) */}
                <ConditionalComponent
                    shouldRender={matchesEndOrStartOf("added_tlvs", selectedTags || [])}
                    Component={ComponentTlvEntries}
                    componentProps={{
                        version: veri.version,
                        reduxStore: veri.reduxStore?.added_tlvs,
                        keyPrefix: `${veri.keyPrefix}.added_tlvs`,
                        reduxAction: ResourceAction,
                        id: `${veri.id}_added_tlvs`,
                    }}
                />
            </Col>
        </ECard>
    );
};

export default ComponentProxyProtocolConfig;
