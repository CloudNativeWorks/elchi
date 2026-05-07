import React, { useEffect } from "react";
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
        /**
         * True when this WASM filter is wired to an Elchi-managed WAF config.
         * Drives WAF-specific defaults (e.g. the Coraza WASM binary path)
         * without affecting generic WASM extension usage of this component.
         */
        wafSelected?: boolean;
    }
};

/**
 * Default Local Data Source filename for the Coraza WASM binary that loads
 * Elchi-injected WAF configs at runtime. Pinned to match the embedded
 * `coraza_version` in the backend (`pkg/waf/data/crs_rules_4.14.0_metadata.json`).
 * Bump in lockstep with the backend if the Coraza version changes.
 */
const CORAZA_WASM_DEFAULT_PATH = '/var/lib/elchi/waf/v0.6.0/coraza.wasm';

const ComponentVmConfig: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_vm_config);
    const { vModels } = useModels(veri.version, modtag_vm_config);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    // WAF auto-fill: when this WASM filter carries an Elchi WAF config and the
    // Local Data Source filename is empty, populate it with the canonical
    // Coraza binary path. The check is "empty" rather than "undefined" so a
    // user who clears the field doesn't get clobbered after the next render
    // (an explicitly cleared field will still be empty here, but `wafSelected`
    // implies the WAF binary is needed — matches user expectation that this
    // is a fixed value for WAF deployments).
    const currentLocalFilename: string | undefined =
        veri.reduxStore?.code?.local?.filename;
    useEffect(() => {
        if (!veri.wafSelected) return;
        if (currentLocalFilename) return;
        handleChangeRedux(
            `${veri.keyPrefix}.code.local.filename`,
            CORAZA_WASM_DEFAULT_PATH,
        );
        // handleChangeRedux deliberately not in deps: even if it gets a fresh
        // identity each render, the inner `if (currentLocalFilename) return`
        // makes the effect idempotent — once we dispatch, the redux subtree
        // updates, currentLocalFilename becomes set, and re-runs short-circuit.
    }, [veri.wafSelected, currentLocalFilename, veri.keyPrefix, handleChangeRedux]);

    const handleApplySnippet = (keys: string, data: any) => {
        handleChangeRedux(keys, data);
    };

    // `runtime` is a proto-string in the schema, but Envoy validates it
    // against a fixed registry of WASM engine names at load time. We pin
    // those four values here so the form renders a Select instead of a
    // free-form text input.
    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.vm?.VmConfig,
            sf: vTags.vm?.VmConfig_SingleFields,
            eo: {
                runtime: [
                    'envoy.wasm.runtime.null',
                    'envoy.wasm.runtime.v8',
                    'envoy.wasm.runtime.wamr',
                    'envoy.wasm.runtime.wasmtime',
                ],
            },
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
