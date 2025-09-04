import React, { useState } from "react";
import { Col, Divider } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import useResourceForm from "@/hooks/useResourceForm";
import ECard from "@/elchi/components/common/ECard";
import { modtag_dns_resolution_config } from "./_modtag_";
import { useTags } from "@/hooks/useTags";
import { FieldConfigType, startsWithAny } from "@/utils/tools";
import ComponentDnsResolverOptions from "./DnsResolverOptions";
import { FieldTypes } from "@/common/statics/general";
import ComponentResolvers from "./Resolvers";
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

const ComponentDnsResolutionConfig: React.FC<GeneralProps> = ({ veri }) => {
    const [resolvers, setResolvers] = useState<boolean>(false);
    const { vTags } = useTags(veri.version, modtag_dns_resolution_config);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        { tag: "resolvers", type: FieldTypes.ArrayIcon, fieldPath: 'resolvers', spanNum: 8, drawerShow: () => { setResolvers(true); }, },
    ]

    return (
        <ECard title={veri.title}>
            <HorizonTags veri={{
                tags: vTags.drc?.DnsResolutionConfig,
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
                    shouldRender={startsWithAny("dns_resolver_options", selectedTags)}
                    Component={ComponentDnsResolverOptions}
                    componentProps={{
                        version: veri.version,
                        reduxStore: veri.reduxStore?.dns_resolver_options,
                        keyPrefix: `${veri.keyPrefix}.dns_resolver_options`,
                        title: 'DNS Resolver Options',
                        id: `dns_resolver_options_0`,
                    }}
                />
            </Col>
            <ConditionalComponent
                shouldRender={startsWithAny("resolvers", selectedTags)}
                Component={ComponentResolvers}
                componentProps={{
                    version: veri.version,
                    keyPrefix: `${veri.keyPrefix}.resolvers`,
                    drawerOpen: resolvers,
                    reduxStore: veri.reduxStore?.resolvers,
                    drawerClose: () => { setResolvers(false); },
                    id: `resolvers_0`,
                }}
            />
        </ECard>
    )
};

export default memorizeComponent(ComponentDnsResolutionConfig, compareVeri);
