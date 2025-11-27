import React from "react";
import { Col, Divider } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { FieldConfigType, matchesEndOrStartOf } from "@/utils/tools";
import { useTags } from "@/hooks/useTags";
import { modtag_downstream_tls_context } from "./_modtag_";
import { generateFields } from "@/common/generate-fields";
import useResourceForm from "@/hooks/useResourceForm";
import ECard from "@/elchi/components/common/ECard";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import { EFields } from "@/elchi/components/common/e-components/EFields";
import { ConditionalComponent } from "../../common/ConditionalComponent";
import ComponentCommonTlsContext from './CommonTlsContext';
import ComponentSessionTicketKeysSdsConfig from "./SessionTickeyKeysSdsConfig";
import { modtag_us_secret } from "../secret/_modtag_";

type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
        id: string;
        title: string;
        tagMatchPrefix: string;
    }
};

const ComponentDownstreamTlsContextNested: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_downstream_tls_context);

    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.dtc?.DownstreamTlsContext,
            sf: vTags.dtc?.DownstreamTlsContext_SingleFields,
        }),
    ];

    return (
        <ECard title={veri.title} id={veri.id} size="small">
            <HorizonTags veri={{
                tags: vTags.dtc?.DownstreamTlsContext,
                selectedTags: selectedTags || [],
                unsupportedTags: modtag_us_secret['DownstreamTlsContext'] || [],
                specificTagPrefix: { "disable_stateless_session_resumption": "session_ticket_keys_type", "session_ticket_keys_sds_secret_config": "session_ticket_keys_type" },
                onlyOneTag: [["session_ticket_keys_type.disable_stateless_session_resumption", "session_ticket_keys_type.session_ticket_keys_sds_secret_config"]],
                keyPrefix: veri.keyPrefix,
                handleChangeTag: handleChangeTag,
            }} />
            <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
            <Col md={24}>
                {matchesEndOrStartOf("common_tls_context", selectedTags) &&
                    <div id={`${veri.id}_common_tls_context`}>
                        <ComponentCommonTlsContext veri={{
                            version: veri.version,
                            keyPrefix: `${veri.keyPrefix}.common_tls_context`,
                            reduxStore: veri.reduxStore?.common_tls_context,
                            tagPrefix: 'common_tls_context',
                            tagMatchPrefix: `${veri.tagMatchPrefix}.common_tls_context`,
                            unsupportedTags: modtag_us_secret['common_tls_context'] || [],
                        }} />
                    </div>
                }
                <ConditionalComponent
                    shouldRender={matchesEndOrStartOf("session_ticket_keys_type.session_ticket_keys_sds_secret_config", selectedTags || [])}
                    Component={ComponentSessionTicketKeysSdsConfig}
                    componentProps={{
                        version: veri.version,
                        keyPrefix: `${veri.keyPrefix}.session_ticket_keys_sds_secret_config`,
                        reduxStore: veri.reduxStore?.session_ticket_keys_type,
                        id: `${veri.id}_session_ticket_keys_sds_secret_config`,
                    }}
                />
                {selectedTags?.some(item => vTags.dtc?.DownstreamTlsContext_SingleFields?.includes(item)) &&
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
            </Col>
        </ECard>
    );
};

export default ComponentDownstreamTlsContextNested;
