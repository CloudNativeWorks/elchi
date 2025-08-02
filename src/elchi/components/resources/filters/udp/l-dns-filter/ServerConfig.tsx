import React from "react";
import { Col, Divider } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import useResourceForm from "@/hooks/useResourceForm";
import ECard from "@/elchi/components/common/ECard";
import { modtag_dns_filter_server_context_config } from "./_modtag_";
import { useTags } from "@/hooks/useTags";
import { startsWithAny } from "@/utils/tools";
import { navigateCases } from "@/elchi/helpers/navigate-cases";
import CommonComponentDataSource from "@/elchi/components/resources/common/DataSource/DataSource";
import { FieldTypes } from "@/common/statics/general";
import ComponentDnsTable from "./DnsTable";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
        title: string;
    }
};

const ComponentServerContextConfig: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_dns_filter_server_context_config);
    const { selectedTags, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    return (
        <ECard title={veri.title}>
            <HorizonTags veri={{
                tags: vTags.dfscc?.DnsFilterConfig_ServerContextConfig,
                selectedTags: selectedTags,
                unsupportedTags: [],
                tagPrefix: "config_source",
                handleChangeTag: handleChangeTag,
                keyPrefix: veri.keyPrefix,
                onlyOneTag: [["config_source.inline_dns_table", "config_source.external_dns_table"]]
            }} />
            <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
            <Col md={24}>
                <ConditionalComponent
                    shouldRender={startsWithAny("config_source.inline_dns_table", selectedTags)}
                    Component={ComponentDnsTable}
                    componentProps={{
                        version: veri.version,
                        reduxStore: navigateCases(veri.reduxStore, "config_source.inline_dns_table"),
                        keyPrefix: `${veri.keyPrefix}.inline_dns_table`,
                        title: 'Inline DNS Table',
                        id: `${veri.keyPrefix}.inline_dns_table`,
                    }}
                />
                <ConditionalComponent
                    shouldRender={startsWithAny("config_source.external_dns_table", selectedTags)}
                    Component={CommonComponentDataSource}
                    componentProps={{
                        version: veri.version,
                        reduxStore: navigateCases(veri.reduxStore, "config_source.external_dns_table"),
                        keyPrefix: `${veri.keyPrefix}.external_dns_table`,
                        tagPrefix: `external_dns_table`,
                        parentName: 'External DNS Table',
                        fileName: 'DNS Table',
                        inlineStringType: FieldTypes.JSON,
                        id: `${veri.keyPrefix}.external_dns_table`,
                    }}
                />
            </Col>
        </ECard>
    )
};

export default memorizeComponent(ComponentServerContextConfig, compareVeri);
