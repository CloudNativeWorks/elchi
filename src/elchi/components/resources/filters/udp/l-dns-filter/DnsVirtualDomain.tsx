import React from "react";
import { Col, Divider } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import useResourceForm from "@/hooks/useResourceForm";
import ECard from "@/elchi/components/common/ECard";
import { modtag_dns_table_dns_virtual_domain } from "./_modtag_";
import { useTags } from "@/hooks/useTags";
import { FieldConfigType, startsWithAny } from "@/utils/tools";
import ComponentDnsEndpoint from "./DnsEndpoint";
import { generateFields } from "@/common/generate-fields";
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

const ComponentDnsVirtualDomain: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_dns_table_dns_virtual_domain);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.dtdvd?.DnsTable_DnsVirtualDomain,
            sf: vTags.dtdvd?.DnsTable_DnsVirtualDomain_SingleFields,
        })
    ]

    return (
        <ECard title={veri.title}>
            <HorizonTags veri={{
                tags: vTags.dtdvd?.DnsTable_DnsVirtualDomain,
                selectedTags: selectedTags,
                unsupportedTags: [],
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
                    shouldRender={startsWithAny("endpoint", selectedTags)}
                    Component={ComponentDnsEndpoint}
                    componentProps={{
                        version: veri.version,
                        reduxStore: veri.reduxStore?.endpoint,
                        keyPrefix: `${veri.keyPrefix}.endpoint`,
                        title: 'Endpoint',
                        id: `endpoint_0`,
                    }}
                />
            </Col>
        </ECard>
    )
};

export default memorizeComponent(ComponentDnsVirtualDomain, compareVeri);
