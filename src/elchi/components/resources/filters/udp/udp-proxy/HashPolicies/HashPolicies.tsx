import React, { useState } from "react";
import { Col, Divider, Tabs } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { FieldConfigType } from "@/utils/tools";
import { useTags } from "@/hooks/useTags";
import { modtag_hash_policy, modtag_us_hash_policy } from "./_modtag_";
import { generateFields } from "@/common/generate-fields";
import useResourceFormMultiple from "@/hooks/useResourceFormMultiple";
import useTabManager from "@/hooks/useTabManager";
import ECard from "@/elchi/components/common/ECard";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import { EFields } from "@/elchi/components/common/e-components/EFields";

type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
        reduxAction: any;
        id: string;
        title: string;
    }
};

const ComponentHashPolicies: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_hash_policy);

    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceFormMultiple({
        version: veri.version,
        reduxStore: veri.reduxStore,
        keyPrefix: veri.keyPrefix,
        reduxAction: veri.reduxAction,
    });

    const { state, onChangeTabs, addTab } = useTabManager({
        initialActiveTab: "0",
        reduxStore: veri.reduxStore,
        keyPrefix: veri.keyPrefix,
        reduxAction: veri.reduxAction,
        version: veri.version,
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.hp?.UdpProxyConfig_HashPolicy,
            sf: vTags.hp?.UdpProxyConfig_HashPolicy_SingleFields,
        }),
    ];

    return (
        <ECard title={veri.title} id={veri.id}>
            <Tabs
                type="editable-card"
                onChange={onChangeTabs}
                activeKey={state.activeTab}
                onEdit={addTab}
                items={veri.reduxStore?.map((_: any, idx: number) => ({
                    key: idx.toString(),
                    label: `Policy ${idx}`,
                    forceRender: true,
                    children: (
                        <>
                            <HorizonTags veri={{
                                tags: vTags.hp?.UdpProxyConfig_HashPolicy,
                                selectedTags: selectedTags[idx] || [],
                                unsupportedTags: modtag_us_hash_policy.UdpProxyConfig_HashPolicy || [],
                                specificTagPrefix: {"source_ip": "policy_specifier", "key": "policy_specifier"},
                                onlyOneTag: [["policy_specifier.source_ip", "policy_specifier.key"]],
                                keyPrefix: ``,
                                handleChangeTag: handleChangeTag,
                                tagPrefix: "",
                                tagMatchPrefix: `${veri.keyPrefix}`,
                                index: idx,
                            }} />
                            <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
                            <Col md={24}>
                                <EForm>
                                    <EFields
                                        fieldConfigs={fieldConfigs}
                                        selectedTags={selectedTags[idx] || []}
                                        handleChangeRedux={handleChangeRedux}
                                        reduxStore={veri.reduxStore?.[idx]}
                                        keyPrefix={`${veri.keyPrefix}.${idx}`}
                                        version={veri.version}
                                    />
                                </EForm>
                            </Col>
                        </>
                    ),
                }))}
            />
        </ECard>
    );
};

export default ComponentHashPolicies;
