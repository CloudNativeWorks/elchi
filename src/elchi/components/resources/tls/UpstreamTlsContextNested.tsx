import React from "react";
import { Col, Divider } from 'antd';
import { memorizeComponent, compareVeri } from "@/hooks/useMemoComponent";
import { FieldConfigType, matchesEndOrStartOf } from "@/utils/tools";
import { HorizonTags } from "../../common/HorizonTags";
import ComponentCommonTlsContext from './CommonTlsContext';
import useResourceForm from "@/hooks/useResourceForm";
import ECard from "../../common/ECard";
import { useTags } from "@/hooks/useTags";
import { modtag_upstream_tls_context } from "./_modtag_";
import { generateFields } from "@/common/generate-fields";
import { ConditionalComponent } from "../../common/ConditionalComponent";
import { EForm } from "../../common/e-components/EForm";
import { EFields } from "../../common/e-components/EFields";
import { modtag_us_secret } from "../secret/_modtag_";


type GeneralProps = {
    veri: {
        version: string;
        keyPrefix: string;
        reduxStore: any;
        id: string;
    }
};

/**
 * Nested UpstreamTlsContext component for use within QuicUpstreamTransport
 * Fields:
 * - common_tls_context (CommonTlsContext)
 * - sni (string)
 * - allow_renegotiation (boolean)
 * - max_session_keys (UInt32Value)
 * - enforce_rsa_key_usage (BoolValue)
 */
const ComponentUpstreamTlsContextNested: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_upstream_tls_context);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.utc?.UpstreamTlsContext,
            sf: vTags.utc?.UpstreamTlsContext_SingleFields,
        }),
    ];

    return (
        <ECard title={"Upstream TLS Context"} id={veri.id} size="small">
            <HorizonTags veri={{
                tags: vTags.utc?.UpstreamTlsContext,
                selectedTags: selectedTags || [],
                unsupportedTags: [],
                keyPrefix: veri.keyPrefix,
                handleChangeTag: handleChangeTag,
            }} />
            <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
            <Col md={24}>
                {/* Single fields (sni, allow_renegotiation, max_session_keys, enforce_rsa_key_usage) */}
                {selectedTags?.some(item => vTags.utc?.UpstreamTlsContext_SingleFields?.includes(item)) &&
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

                {/* Common TLS Context (nested) */}
                <ConditionalComponent
                    shouldRender={matchesEndOrStartOf("common_tls_context", selectedTags || [])}
                    Component={ComponentCommonTlsContext}
                    componentProps={{
                        version: veri.version,
                        keyPrefix: `${veri.keyPrefix}.common_tls_context`,
                        reduxStore: veri.reduxStore?.common_tls_context,
                        tagPrefix: 'common_tls_context',
                        tagMatchPrefix: 'QuicUpstreamTransport.upstream_tls_context.common_tls_context',
                        unsupportedTags: modtag_us_secret['common_tls_context'] || [],
                        id: `${veri.id}_common_tls_context`,
                    }}
                />
            </Col>
        </ECard>
    );
};

export default memorizeComponent(ComponentUpstreamTlsContextNested, compareVeri);
