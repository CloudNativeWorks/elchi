import React from "react";
import { Tabs, Row, Divider, Col } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { FieldConfigType, matchesEndOrStartOf } from "@/utils/tools";
import { useTags } from "@/hooks/useTags";
import { modtag_circuit_breakers } from "./_modtag_";
import { generateFields } from "@/common/generate-fields";
import useResourceFormMultiple from "@/hooks/useResourceFormMultiple";
import useTabManager from "@/hooks/useTabManager";
import ECard from "../../common/ECard";
import { EForm } from "../../common/e-components/EForm";
import { EFields } from "../../common/e-components/EFields";
import { ConditionalComponent } from "../../common/ConditionalComponent";
import ComponentRetryBudget from "./RetryBudget";

type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any[] | undefined;
        keyPrefix: string;
        tagMatchPrefix: string;
        reduxAction: any;
        id: string;
        title: string;
    }
};

const ComponentThresholdsList: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_circuit_breakers);
    const { state, onChangeTabs, addTab } = useTabManager({
        initialActiveTab: "0",
        reduxStore: veri.reduxStore,
        keyPrefix: veri.keyPrefix,
        version: veri.version,
        reduxAction: veri.reduxAction
    });

    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceFormMultiple({
        version: veri.version,
        reduxStore: veri.reduxStore,
        keyPrefix: veri.keyPrefix,
        reduxAction: veri.reduxAction
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.cb?.CircuitBreakers_Thresholds,
            sf: vTags.cb?.CircuitBreakers_Thresholds_SingleFields,
        }),
    ];

    return (
        <ECard title={veri.title} id={veri.id} size="small">
            <Tabs
                onChange={onChangeTabs}
                type="editable-card"
                activeKey={state.activeTab}
                onEdit={addTab}
                style={{ width: "99%" }}
                items={veri.reduxStore?.map((data: any, index: number) => ({
                        key: index.toString(),
                        label: `Threshold ${index}`,
                        forceRender: true,
                        children: (
                            <>
                                <Row>
                                    <HorizonTags veri={{
                                        tags: vTags.cb?.CircuitBreakers_Thresholds,
                                        selectedTags: selectedTags[index],
                                        unsupportedTags: [],
                                        index: index,
                                        tagMatchPrefix: veri.tagMatchPrefix,
                                        handleChangeTag: handleChangeTag,
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
                                    shouldRender={matchesEndOrStartOf("retry_budget", selectedTags[index])}
                                    Component={ComponentRetryBudget}
                                    componentProps={{
                                        version: veri.version,
                                        reduxStore: data?.retry_budget,
                                        keyPrefix: `${veri.keyPrefix}.${index}.retry_budget`,
                                        tagMatchPrefix: `${veri.tagMatchPrefix}.retry_budget`,
                                        reduxAction: veri.reduxAction,
                                        id: `retry_budget_${index}`
                                    }}
                                />
                            </>
                        ),
                    })) || []}
                />
        </ECard>
    );
};

export default ComponentThresholdsList;
