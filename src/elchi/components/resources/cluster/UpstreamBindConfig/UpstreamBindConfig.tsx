import React from "react";
import { Col, Divider } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { FieldConfigType, matchesEndOrStartOf } from "@/utils/tools";
import { useTags } from "@/hooks/useTags";
import { modtag_upstream_bind_config, modtag_us_upstream_bind_config } from "./_modtag_";
import { generateFields } from "@/common/generate-fields";
import useResourceForm from "@/hooks/useResourceForm";
import ECard from "@/elchi/components/common/ECard";
import { EForm } from "../../../common/e-components/EForm";
import { EFields } from "../../../common/e-components/EFields";
import { ConditionalComponent } from "../../../common/ConditionalComponent";
import CommonComponentSocketAddress from "../../common/Address/socket_address";
import ComponentSocketOptions from "./SocketOptions/SocketOptions";
import ComponentExtraSourceAddresses from "./ExtraSourceAddresses/ExtraSourceAddresses";
import { ResourceAction } from "@/redux/reducers/slice";

type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
        id: string;
    }
};

const ComponentUpstreamBindConfig: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_upstream_bind_config);

    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.bc?.BindConfig,
            sf: vTags.bc?.BindConfig_SingleFields,
        }),
    ];

    return (
        <ECard title="Upstream Bind Config" id={veri.id}>
            <HorizonTags veri={{
                tags: vTags.bc?.BindConfig,
                selectedTags: selectedTags || [],
                unsupportedTags: modtag_us_upstream_bind_config.BindConfig || [],
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
                    shouldRender={matchesEndOrStartOf("source_address", selectedTags || [])}
                    Component={CommonComponentSocketAddress}
                    componentProps={{
                        version: veri.version,
                        reduxStore: veri.reduxStore?.source_address,
                        keyPrefix: `${veri.keyPrefix}.source_address`,
                        unsupportedAddressTag: [],
                        unsupportedSocketAddressTag: []
                    }}
                />
                <ConditionalComponent
                    shouldRender={matchesEndOrStartOf("socket_options", selectedTags || [])}
                    Component={ComponentSocketOptions}
                    componentProps={{
                        version: veri.version,
                        reduxStore: veri.reduxStore?.socket_options,
                        keyPrefix: `${veri.keyPrefix}.socket_options`,
                        reduxAction: ResourceAction,
                        id: `${veri.id}_socket_options`,
                        title: "Socket Options"
                    }}
                />
                <ConditionalComponent
                    shouldRender={matchesEndOrStartOf("extra_source_addresses", selectedTags || [])}
                    Component={ComponentExtraSourceAddresses}
                    componentProps={{
                        version: veri.version,
                        reduxStore: veri.reduxStore?.extra_source_addresses,
                        keyPrefix: `${veri.keyPrefix}.extra_source_addresses`,
                        reduxAction: ResourceAction,
                        id: `${veri.id}_extra_source_addresses`,
                        title: "Extra Source Addresses"
                    }}
                />
            </Col>
        </ECard>
    );
};

export default ComponentUpstreamBindConfig;
