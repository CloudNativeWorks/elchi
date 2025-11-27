import React from "react";
import { Divider } from 'antd';
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import { FieldConfigType, startsWithAny } from "@/utils/tools";
import ECard from "@/elchi/components/common/ECard";
import { EFields } from "@/elchi/components/common/e-components/EFields";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import { useTags } from "@/hooks/useTags";
import { modtag_dns_cache_config } from "./_modtag_";
import { generateFields } from "@/common/generate-fields";
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import useResourceForm from "@/hooks/useResourceForm";
import ComponentRefreshRate from "../../cluster/RefreshRate/RefreshRate";
import ComponentDnsCacheCircuitBreakers from "./DnsCacheCircuitBreakers/DnsCacheCircuitBreakers";
import ComponentPreresolveHostnames from "./PreresolveHostnames/PreresolveHostnames";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
        reduxAction: any;
        title: string;
    }
};

const ComponentDnsCacheConfig: React.FC<GeneralProps> = ({ veri }) => {
    const { version, reduxStore, keyPrefix, title, reduxAction } = veri;
    const { vTags, loading } = useTags(version, modtag_dns_cache_config);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version,
        reduxStore,
    });

    if (loading || !vTags.dcc) {
        return null;
    }

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.dcc?.DnsCacheConfig,
            sf: vTags.dcc?.DnsCacheConfig_SingleFields,
        }),
    ];

    return (
        <>
            <ECard title={title}>
                <HorizonTags veri={{
                    tags: vTags.dcc?.DnsCacheConfig,
                    selectedTags: selectedTags,
                    unsupportedTags: ['typed_dns_resolver_config', 'use_tcp_for_dns_lookups', 'dns_resolution_config', 'key_value_config'],
                    handleChangeTag: handleChangeTag,
                    keyPrefix: keyPrefix,
                    tagPrefix: '',
                    specificTagPrefix: {},
                    required: [],
                    onlyOneTag: [],
                }} />
                <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
                <EForm>
                    <EFields
                        fieldConfigs={fieldConfigs}
                        selectedTags={selectedTags}
                        handleChangeRedux={handleChangeRedux}
                        reduxStore={reduxStore}
                        keyPrefix={keyPrefix}
                        version={version}
                    />
                </EForm>
            </ECard>

            {startsWithAny("dns_failure_refresh_rate", selectedTags) && (
                <ComponentRefreshRate veri={{
                    version: version,
                    reduxStore: reduxStore?.dns_failure_refresh_rate,
                    keyPrefix: `${keyPrefix}.dns_failure_refresh_rate`,
                    reduxAction: reduxAction,
                    title: "DNS Failure Refresh Rate"
                }} />
            )}

            {startsWithAny("dns_cache_circuit_breaker", selectedTags) && (
                <ComponentDnsCacheCircuitBreakers veri={{
                    version: version,
                    reduxStore: reduxStore?.dns_cache_circuit_breaker,
                    keyPrefix: `${keyPrefix}.dns_cache_circuit_breaker`,
                    reduxAction: reduxAction,
                }} />
            )}

            {startsWithAny("preresolve_hostnames", selectedTags) && (
                <ComponentPreresolveHostnames veri={{
                    version: version,
                    reduxStore: reduxStore?.preresolve_hostnames,
                    keyPrefix: `${keyPrefix}.preresolve_hostnames`,
                    reduxAction: reduxAction,
                }} />
            )}
        </>
    )
};

export default memorizeComponent(ComponentDnsCacheConfig, compareVeri);
