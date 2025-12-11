import React, { useState } from "react";
import { Col, Divider } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import useResourceForm from "@/hooks/useResourceForm";
import ECard from "@/elchi/components/common/ECard";
import { modtag_dns_table } from "./_modtag_";
import { useTags } from "@/hooks/useTags";
import { FieldConfigType, startsWithAny } from "@/utils/tools";
import { generateFields } from "@/common/generate-fields";
import ComponentVirtualDomains from "./VirtualDomains";
import { FieldTypes } from "@/common/statics/general";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import { EFields } from "@/elchi/components/common/e-components/EFields";
import CommonComponentStringMatchers from '@resources/common/StringMatcher/StringMatchers';
import { ResourceAction } from '@/redux/reducers/slice';


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
        title: string;
    }
};

const ComponentDnsTable: React.FC<GeneralProps> = ({ veri }) => {
    const [virtualDomains, setVirtualDomains] = useState<boolean>(false);
    const { vTags } = useTags(veri.version, modtag_dns_table);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.dt?.DnsTable,
            sf: vTags.dt?.DnsTable_SingleFields,
            e: ['known_suffixes'],
        }),
        { tag: "virtual_domains", type: FieldTypes.ArrayIcon, fieldPath: 'virtual_domains', spanNum: 8, drawerShow: () => { setVirtualDomains(true); }, },
    ];

    return (
        <ECard title={veri.title}>
            <HorizonTags veri={{
                tags: vTags.dt?.DnsTable,
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
                    shouldRender={startsWithAny("virtual_domains", selectedTags)}
                    Component={ComponentVirtualDomains}
                    componentProps={{
                        version: veri.version,
                        keyPrefix: `${veri.keyPrefix}.virtual_domains`,
                        drawerOpen: virtualDomains,
                        reduxStore: veri.reduxStore?.virtual_domains,
                        drawerClose: () => { setVirtualDomains(false); },
                        id: `virtual_domains_0`,
                    }}
                />
                <ConditionalComponent
                    shouldRender={startsWithAny("known_suffixes", selectedTags)}
                    Component={CommonComponentStringMatchers}
                    componentProps={{
                        version: veri.version,
                        reduxStore: veri.reduxStore?.known_suffixes,
                        reduxAction: ResourceAction,
                        selectedTags: selectedTags,
                        tag: "known_suffixes",
                        keyPrefix: `${veri.keyPrefix}.known_suffixes`,
                        tagMatchPrefix: 'DnsTable',
                        title: 'Known Suffixes',
                    }}
                />
            </Col>
        </ECard>
    )
};

export default memorizeComponent(ComponentDnsTable, compareVeri);
