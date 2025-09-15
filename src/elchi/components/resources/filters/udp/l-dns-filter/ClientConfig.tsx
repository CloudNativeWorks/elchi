import React from "react";
import { Col, Divider } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import useResourceForm from "@/hooks/useResourceForm";
import ECard from "@/elchi/components/common/ECard";
import { modtag_dns_filter_client_context_config } from "./_modtag_";
import { useTags } from "@/hooks/useTags";
import { FieldConfigType, startsWithAny } from "@/utils/tools";
import { generateFields } from "@/common/generate-fields";
import ComponentDnsResolutionConfig from "./DnsResolutionConfig";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import { EFields } from "@/elchi/components/common/e-components/EFields";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
        title: string;
    }
};

const ComponentClientContextConfig: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_dns_filter_client_context_config);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.dfccc?.DnsFilterConfig_ClientContextConfig,
            sf: vTags.dfccc?.DnsFilterConfig_ClientContextConfig_SingleFields,
        })
    ];

    return (
        <ECard title={veri.title}>
            <HorizonTags veri={{
                tags: vTags.dfccc?.DnsFilterConfig_ClientContextConfig,
                selectedTags: selectedTags,
                unsupportedTags: ["typed_dns_resolver_config"],
                handleChangeTag: handleChangeTag,
                keyPrefix: veri.keyPrefix,
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
                <ConditionalComponent
                    shouldRender={startsWithAny("dns_resolution_config", selectedTags)}
                    Component={ComponentDnsResolutionConfig}
                    componentProps={{
                        version: veri.version,
                        reduxStore: veri.reduxStore?.dns_resolution_config,
                        keyPrefix: `${veri.keyPrefix}.dns_resolution_config`,
                        title: 'DNS Resolution Config',
                        id: `dns_resolution_config_0`,
                    }}
                />
            </Col>
        </ECard>
    )
};

export default memorizeComponent(ComponentClientContextConfig, compareVeri);
