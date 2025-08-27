import React from "react";
import { Col, Divider } from 'antd';
import { memorizeComponent, compareVeri } from "@/hooks/useMemoComponent";
import { FieldConfigType, matchesEndOrStartOf } from "@/utils/tools";
import { HorizonTags } from "../../common/HorizonTags";
import ComponentTlsParams from './TlsParams';
import ComponentValidationSdsConfig from "./ValidationSdsConfig";
import ComponentCertSdsConfig from "./CertSdsConfig";
import useResourceForm from "@/hooks/useResourceForm";
import ECard from "../../common/ECard";
import { useTags } from "@/hooks/useTags";
import { modtag_common_tls_context } from "./_modtag_";
import { generateFields } from "@/common/generate-fields";
import { ConditionalComponent } from "../../common/ConditionalComponent";
import { EForm } from "../../common/e-components/EForm";
import { EFields } from "../../common/e-components/EFields";
import CommonComponentTlsKeyLog from "@resources/common/TlsKeyLog/TlsKeyLog";


type GeneralProps = {
    veri: {
        version: string;
        keyPrefix: string;
        reduxStore: any;
        tagMatchPrefix: string;
        tagPrefix: string;
        unsupportedTags: string[];
    }
};

const ComponentCommonTlsContext: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_common_tls_context);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.ctc?.CommonTlsContext,
            sf: vTags.ctc?.CommonTlsContext_SingleFields,
        })
    ]

    return (
        <ECard title={"Common TLS Context"}>
            <HorizonTags veri={{
                tags: vTags.ctc?.CommonTlsContext,
                selectedTags: selectedTags,
                unsupportedTags: veri.unsupportedTags,
                handleChangeTag: handleChangeTag,
                tagMatchPrefix: veri.tagMatchPrefix,
                keyPrefix: veri.keyPrefix,
                tagPrefix: '',
                specificTagPrefix: { 'validation_context_sds_secret_config': 'validation_context_type' }
            }} />
            <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type='horizontal' />
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
                <ConditionalComponent
                    shouldRender={matchesEndOrStartOf("tls_params", selectedTags)}
                    Component={ComponentTlsParams}
                    componentProps={{
                        version: veri.version,
                        keyPrefix: 'common_tls_context.tls_params',
                        reduxStore: veri.reduxStore?.tls_params,
                        tagPrefix: 'tls_params',
                        tagMatchPrefix: 'DownstreamTlsContext.common_tls_context.tls_params',
                        unsupportedTags: [],
                        id: `tls_params_0`,
                    }}
                />
                <ConditionalComponent
                    shouldRender={matchesEndOrStartOf("tls_certificate_sds_secret_configs", selectedTags)}
                    Component={ComponentCertSdsConfig}
                    componentProps={{
                        version: veri.version,
                        keyPrefix: `${veri.keyPrefix}.tls_certificate_sds_secret_configs`,
                        reduxStore: veri.reduxStore?.tls_certificate_sds_secret_configs,
                        tagPrefix: 'tls_certificate_sds_secret_configs',
                        tagMatchPrefix: 'DownstreamTlsContext.common_tls_context.tls_certificate_sds_secret_configs',
                        unsupportedTags: [],
                        id: `tls_certificate_sds_secret_configs_0`,
                    }}
                />
                <ConditionalComponent
                    shouldRender={matchesEndOrStartOf("validation_context_type.validation_context_sds_secret_config", selectedTags)}
                    Component={ComponentValidationSdsConfig}
                    componentProps={{
                        version: veri.version,
                        keyPrefix: 'common_tls_context.validation_context_sds_secret_config',
                        reduxStore: veri.reduxStore?.validation_context_type,
                        id: `validation_context_sds_secret_config_0`,
                    }}
                />
                <ConditionalComponent
                    shouldRender={matchesEndOrStartOf("key_log", selectedTags)}
                    Component={CommonComponentTlsKeyLog}
                    componentProps={{
                        version: veri.version,
                        keyPrefix: 'common_tls_context.key_log',
                        reduxStore: veri.reduxStore?.key_log,
                        id: `key_log_0`,
                        title: 'Key Log',
                    }}
                />
            </Col>
        </ECard>
    )
};

export default memorizeComponent(ComponentCommonTlsContext, compareVeri);
