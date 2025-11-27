import React from "react";
import { Col, Divider } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { FieldConfigType, matchesEndOrStartOf } from "@/utils/tools";
import { useTags } from "@/hooks/useTags";
import { modtag_upstream_connection_options, modtag_us_upstream_connection_options } from "./_modtag_";
import { generateFields } from "@/common/generate-fields";
import useResourceForm from "@/hooks/useResourceForm";
import ECard from "@/elchi/components/common/ECard";
import { EForm } from "../../../common/e-components/EForm";
import { EFields } from "../../../common/e-components/EFields";
import { ConditionalComponent } from "../../../common/ConditionalComponent";
import CommonComponentTcpKeepalive from "../../common/TcpKeepalive/TcpKeepalive";
import ComponentHappyEyeballsConfig from "./HappyEyeballsConfig/HappyEyeballsConfig";

type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
        id: string;
    }
};

const ComponentUpstreamConnectionOptions: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_upstream_connection_options);

    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.uco?.UpstreamConnectionOptions,
            sf: vTags.uco?.UpstreamConnectionOptions_SingleFields,
        }),
    ];

    return (
        <ECard title="Upstream Connection Options" id={veri.id}>
            <HorizonTags veri={{
                tags: vTags.uco?.UpstreamConnectionOptions,
                selectedTags: selectedTags || [],
                unsupportedTags: modtag_us_upstream_connection_options.UpstreamConnectionOptions || [],
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
                    shouldRender={matchesEndOrStartOf("tcp_keepalive", selectedTags || [])}
                    Component={CommonComponentTcpKeepalive}
                    componentProps={{
                        version: veri.version,
                        reduxStore: veri.reduxStore?.tcp_keepalive,
                        keyPrefix: `${veri.keyPrefix}.tcp_keepalive`,
                        title: "TCP Keepalive"
                    }}
                />
                <ConditionalComponent
                    shouldRender={matchesEndOrStartOf("happy_eyeballs_config", selectedTags || [])}
                    Component={ComponentHappyEyeballsConfig}
                    componentProps={{
                        version: veri.version,
                        reduxStore: veri.reduxStore?.happy_eyeballs_config,
                        keyPrefix: `${veri.keyPrefix}.happy_eyeballs_config`,
                        id: `${veri.id}_happy_eyeballs`
                    }}
                />
            </Col>
        </ECard>
    );
};

export default ComponentUpstreamConnectionOptions;
