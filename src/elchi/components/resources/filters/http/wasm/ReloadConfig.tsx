import React from "react";
import { Divider } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import useResourceForm from "@/hooks/useResourceForm";
import ECard from "@/elchi/components/common/ECard";
import { useTags } from "@/hooks/useTags";
import { useModels } from "@/hooks/useModels";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";
import { matchesEndOrStartOf } from "@/utils/tools";
import CommonBackoffStrategy from "@/elchi/components/resources/common/BackoffStrategy/BackoffStrategy";

const modtag_reload_config = [
    {
        alias: 'rlc',
        relativePath: 'envoy/extensions/wasm/v3/wasm',
        names: ['ReloadConfig', 'ReloadConfig_SingleFields'],
    },
];

type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
        title: string;
    }
};

const ComponentReloadConfig: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_reload_config);
    const { vModels } = useModels(veri.version, modtag_reload_config);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const handleApplySnippet = (keys: string, data: any) => {
        handleChangeRedux(keys, data);
    };

    return (
        <ECard
            title={veri.title}
            reduxStore={veri.reduxStore}
            ctype="wasm_reload_config"
            toJSON={vModels.rlc?.ReloadConfig.toJSON}
            onApply={handleApplySnippet}
            keys={veri.keyPrefix}
            version={veri.version}
        >
            <HorizonTags veri={{
                tags: vTags.rlc?.ReloadConfig,
                selectedTags: selectedTags,
                unsupportedTags: [],
                handleChangeTag: handleChangeTag,
                keyPrefix: veri.keyPrefix,
            }} />
            <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
            <ConditionalComponent
                shouldRender={matchesEndOrStartOf("backoff", selectedTags)}
                Component={CommonBackoffStrategy}
                componentProps={{
                    version: veri.version,
                    reduxStore: veri.reduxStore?.backoff,
                    keyPrefix: `${veri.keyPrefix}.backoff`,
                }}
            />
        </ECard>
    );
};

export default memorizeComponent(ComponentReloadConfig, compareVeri);
