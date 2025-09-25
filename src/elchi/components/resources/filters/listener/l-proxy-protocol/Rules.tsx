import React from "react";
import { Col, Tabs, Row, Divider } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { memorizeComponent, compareVeri } from "@/hooks/useMemoComponent";
import { FieldConfigType, startsWithAny } from "@/utils/tools";
import { useTags } from "@/hooks/useTags";
import { modtag_proxy_protocol_rule } from "./_modtag_";
import ComponentKeyValuePair from "./KeyValuePair";
import { generateFields } from "@/common/generate-fields";
import useTabManager from "@/hooks/useTabManager";
import useResourceFormMultiple from "@/hooks/useResourceFormMultiple";
import ECard from "@/elchi/components/common/ECard";
import { ResourceAction } from "@/redux/reducers/slice";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import { EFields } from "@/elchi/components/common/e-components/EFields";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any[] | undefined;
        keyPrefix: string;
    }
};

const ComponentRules: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_proxy_protocol_rule);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceFormMultiple({
        version: veri.version,
        reduxStore: veri.reduxStore,
        keyPrefix: veri.keyPrefix,
        reduxAction: ResourceAction
    });

    const { state, onChangeTabs, addTab } = useTabManager({
        initialActiveTab: "0",
        reduxStore: veri.reduxStore,
        keyPrefix: veri.keyPrefix,
        version: veri.version,
        reduxAction: ResourceAction
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.ppr?.ProxyProtocol_Rule,
            sf: vTags.ppr?.ProxyProtocol_Rule_SingleFields,
        })
    ];

    return (
        <ECard title="Rule">
            <Tabs
                onChange={onChangeTabs}
                type="editable-card"
                activeKey={state.activeTab}
                onEdit={addTab}
                style={{ width: "100%" }}
                items={veri.reduxStore?.map((data: any, index: number) => {
                    return {
                        key: index.toString(),
                        label: "Rule: " + index.toString(),
                        forceRender: true,
                        children: (
                            <>
                                <Row>
                                    <HorizonTags veri={{
                                        tags: vTags.ppr?.ProxyProtocol_Rule,
                                        selectedTags: selectedTags[index],
                                        handleChangeTag: handleChangeTag,
                                        index: index,
                                        keyPrefix: veri.keyPrefix,
                                    }} />
                                    <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
                                    <Col md={24}>
                                        <EForm>
                                            <EFields
                                                fieldConfigs={fieldConfigs}
                                                selectedTags={selectedTags[index]}
                                                handleChangeRedux={handleChangeRedux}
                                                reduxStore={data}
                                                keyPrefix={`${veri.keyPrefix}.${index}`}
                                                version={veri.version}
                                            />
                                        </EForm>
                                    </Col>
                                </Row>
                                <ConditionalComponent
                                    shouldRender={startsWithAny("on_tlv_present", selectedTags[index])}
                                    Component={ComponentKeyValuePair}
                                    componentProps={{
                                        version: veri.version,
                                        reduxStore: data?.on_tlv_present,
                                        keyPrefix: `${veri.keyPrefix}.${index}.on_tlv_present`,
                                        id: `on_tlv_present_0`,
                                    }}
                                />
                            </>
                        ),
                    };
                })
                }
            />
        </ECard>
    )
};

export default memorizeComponent(ComponentRules, compareVeri);
