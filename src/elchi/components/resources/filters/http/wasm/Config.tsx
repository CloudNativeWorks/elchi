import React from "react";
import { Col, Divider } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import { FieldConfigType, startsWithAny } from "@/utils/tools";
import useResourceForm from "@/hooks/useResourceForm";
import ECard from "@/elchi/components/common/ECard";
import { modtag_config, modtag_us_wasm } from "./_modtag_";
import { useTags } from "@/hooks/useTags";
import { useModels } from "@/hooks/useModels";
import { generateFields } from "@/common/generate-fields";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import { EFields } from "@/elchi/components/common/e-components/EFields";
import ComponentConfiguration from "./Configuration";
import ComponentVmConfig from "./VmConfig";
import ComponentReloadConfig from "./ReloadConfig";
import { matchesEndOrStartOf } from "@/utils/tools";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
        title: string;
        wafSelected?: boolean;
    }
};

const ComponentConfig: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_config);
    const { vModels } = useModels(veri.version, modtag_config);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const handleApplySnippet = (keys: string, data: any) => {
        handleChangeRedux(keys, data);
    };

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.cnfg?.PluginConfig,
            sf: vTags.cnfg?.PluginConfig_SingleFields,
        }),
    ];

    // Filter selectedTags to exclude nested vm.vm_config.* tags but keep vm.vm_config itself
    const filteredSelectedTags = selectedTags.filter(tag => {
        // Keep tags that don't start with vm.vm_config
        if (!tag.startsWith('vm.vm_config')) return true;
        // Keep vm.vm_config and vm.vm_config.$type
        if (tag === 'vm.vm_config' || tag === 'vm.vm_config.$type') return true;
        // Filter out all other nested tags like vm.vm_config.configuration.*
        return false;
    });

    return (
        <ECard
            title={veri.title}
            reduxStore={veri.reduxStore}
            ctype="wasm_config"
            toJSON={vModels.cnfg?.PluginConfig.toJSON}
            onApply={handleApplySnippet}
            keys={veri.keyPrefix}
            version={veri.version}
        >
            <HorizonTags veri={{
                tags: vTags.cnfg?.PluginConfig,
                selectedTags: filteredSelectedTags,
                unsupportedTags: modtag_us_wasm["config"],
                handleChangeTag: handleChangeTag,
                keyPrefix: veri.keyPrefix,
                specificTagPrefix: {"vm_config": "vm"},
                hiddenTags: veri.wafSelected ? ["configuration"] : []
            }} />
            <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
            <Col md={24}>
                <EForm>
                    <EFields
                        fieldConfigs={fieldConfigs}
                        selectedTags={selectedTags}
                        handleChangeRedux={handleChangeRedux}
                        reduxStore={veri.reduxStore}
                        keyPrefix={`${veri.keyPrefix}`}
                        version={veri.version}
                    />
                </EForm>
            </Col>
            <ConditionalComponent
                shouldRender={startsWithAny("configuration", selectedTags) && !veri.wafSelected}
                Component={ComponentConfiguration}
                componentProps={{
                    version: veri.version,
                    reduxStore: veri.reduxStore,
                    keyPrefix: veri.keyPrefix,
                    title: "Configuration",
                }}
            />
            <ConditionalComponent
                shouldRender={matchesEndOrStartOf("vm.vm_config", selectedTags)}
                Component={ComponentVmConfig}
                componentProps={{
                    version: veri.version,
                    reduxStore: veri.reduxStore?.vm?.vm_config,
                    keyPrefix: `${veri.keyPrefix}.vm_config`,
                    title: "VM Config",
                }}
            />
            <ConditionalComponent
                shouldRender={matchesEndOrStartOf("reload_config", selectedTags)}
                Component={ComponentReloadConfig}
                componentProps={{
                    version: veri.version,
                    reduxStore: veri.reduxStore?.reload_config,
                    keyPrefix: `${veri.keyPrefix}.reload_config`,
                    title: "Reload Config",
                }}
            />
        </ECard>
    )
};

export default memorizeComponent(ComponentConfig, compareVeri);
