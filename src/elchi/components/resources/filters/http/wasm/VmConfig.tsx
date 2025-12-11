import React from "react";
import { Col, Divider } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import { FieldConfigType } from "@/utils/tools";
import useResourceForm from "@/hooks/useResourceForm";
import ECard from "@/elchi/components/common/ECard";
import { modtag_vm_config, modtag_us_wasm } from "./_modtag_";
import { useTags } from "@/hooks/useTags";
import { useModels } from "@/hooks/useModels";
import { generateFields } from "@/common/generate-fields";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import { EFields } from "@/elchi/components/common/e-components/EFields";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";
import { matchesEndOrStartOf } from "@/utils/tools";
import ComponentConfiguration from "./Configuration";
import CommonAsyncDataSource from "@/elchi/components/resources/common/AsyncDataSource/AsyncDataSource";

type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
        title: string;
    }
};

const ComponentVmConfig: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_vm_config);
    const { vModels } = useModels(veri.version, modtag_vm_config);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const handleApplySnippet = (keys: string, data: any) => {
        handleChangeRedux(keys, data);
    };

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.vm?.VmConfig,
            sf: vTags.vm?.VmConfig_SingleFields,
        }),
    ];

    return (
        <ECard
            title={veri.title}
            reduxStore={veri.reduxStore}
            ctype="wasm_vm_config"
            toJSON={vModels.vm?.VmConfig.toJSON}
            onApply={handleApplySnippet}
            keys={veri.keyPrefix}
            version={veri.version}
        >
            <HorizonTags veri={{
                tags: vTags.vm?.VmConfig,
                selectedTags: selectedTags,
                unsupportedTags: modtag_us_wasm["vm_config"],
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
                        keyPrefix={`${veri.keyPrefix}`}
                        version={veri.version}
                    />
                </EForm>
            </Col>
            <ConditionalComponent
                shouldRender={matchesEndOrStartOf("configuration", selectedTags)}
                Component={ComponentConfiguration}
                componentProps={{
                    version: veri.version,
                    reduxStore: veri.reduxStore,
                    keyPrefix: veri.keyPrefix,
                    title: "Configuration",
                }}
            />
            <ConditionalComponent
                shouldRender={matchesEndOrStartOf("code", selectedTags)}
                Component={CommonAsyncDataSource}
                componentProps={{
                    version: veri.version,
                    reduxStore: veri.reduxStore?.code,
                    keyPrefix: `${veri.keyPrefix}.code`,
                    title: "Code",
                }}
            />
        </ECard>
    );
};

export default memorizeComponent(ComponentVmConfig, compareVeri);
