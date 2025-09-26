import React from "react";
import { Col, Divider } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import useResourceForm from "@/hooks/useResourceForm";
import ECard from "@/elchi/components/common/ECard";
import { modtag_dns_table_dns_endpoint } from "./_modtag_";
import { useTags } from "@/hooks/useTags";
import { startsWithAny } from "@/utils/tools";
import { navigateCases } from "@/elchi/helpers/navigate-cases";
import CommonComponentCluster from "@/elchi/components/resources/common/Clusters/Cluster/Cluster";
import ComponentAddressList from "./AddressList";
import { ResourceAction } from "@/redux/reducers/slice";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";
import { EForm } from "@/elchi/components/common/e-components/EForm";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
        title: string;
    }
};

const ComponentDnsEndpoint: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_dns_table_dns_endpoint);
    const { selectedTags, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    return (
        <ECard title={veri.title}>
            <HorizonTags veri={{
                tags: vTags.dtde?.DnsTable_DnsEndpoint,
                selectedTags: selectedTags,
                unsupportedTags: ["endpoint_config.service_list"],
                tagPrefix: "endpoint_config",
                handleChangeTag: handleChangeTag,
                keyPrefix: veri.keyPrefix,
                onlyOneTag: [["endpoint_config.address_list", "endpoint_config.cluster_name"]]
            }} />
            <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
            <Col md={24}>
                <ConditionalComponent
                    shouldRender={startsWithAny("endpoint_config.address_list", selectedTags)}
                    Component={ComponentAddressList}
                    componentProps={{
                        version: veri.version,
                        reduxStore: navigateCases(veri.reduxStore, "endpoint_config.address_list"),
                        keyPrefix: `${veri.keyPrefix}.address_list`,
                        title: 'Address List',
                        id: `${veri.keyPrefix}.address_list`,
                    }}
                />
                {startsWithAny("endpoint_config.cluster_name", selectedTags) &&
                    <EForm>
                        <CommonComponentCluster veri={{
                            size: 10,
                            alwaysShow: true,
                            selectedTags: [],
                            version: veri.version,
                            reduxStore: navigateCases(veri.reduxStore, "endpoint_config.cluster_name"),
                            keyPrefix: `${veri.keyPrefix}`,
                            reduxAction: ResourceAction,
                            tag: "cluster_name",
                        }} />
                    </EForm>
                }
            </Col>
        </ECard>
    )
};

export default memorizeComponent(ComponentDnsEndpoint, compareVeri);
