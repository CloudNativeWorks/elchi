import React from "react";
import { Col, Divider } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { FieldConfigType, matchesEndOrStartOf } from "@/utils/tools";
import { useTags } from "@/hooks/useTags";
import { modtag_circuit_breakers } from "./_modtag_";
import { generateFields } from "@/common/generate-fields";
import useResourceForm from "@/hooks/useResourceForm";
import ECard from "@/elchi/components/common/ECard";
import { EForm } from "../../common/e-components/EForm";
import { EFields } from "../../common/e-components/EFields";
import { ConditionalComponent } from "../../common/ConditionalComponent";
import CommonComponentPercent from "../common/Percent/Percent";

type GeneralProps = {
    veri: {
        version: string;
        reduxAction: any;
        reduxStore: any;
        keyPrefix: string;
        tagMatchPrefix: string;
        id: string;
    }
};

const ComponentRetryBudget: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_circuit_breakers);

    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.cbr?.CircuitBreakers_Thresholds_RetryBudget,
            sf: vTags.cbr?.CircuitBreakers_Thresholds_RetryBudget_SingleFields,
        }),
    ];

    return (
        <ECard title="Retry Budget" id={veri.id}>
            <HorizonTags veri={{
                tags: vTags.cbr?.CircuitBreakers_Thresholds_RetryBudget,
                selectedTags: selectedTags || [],
                unsupportedTags: [],
                keyPrefix: veri.keyPrefix,
                tagMatchPrefix: `${veri.tagMatchPrefix}`,
                handleChangeTag: handleChangeTag,
            }} />
            <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
            <Col md={24}>
                <EForm>
                    <EFields
                        fieldConfigs={fieldConfigs}
                        selectedTags={selectedTags || []}
                        handleChangeRedux={handleChangeRedux}
                        reduxStore={veri.reduxStore}
                        keyPrefix={veri.keyPrefix}
                        version={veri.version}
                    />
                </EForm>
                <ConditionalComponent
                    shouldRender={matchesEndOrStartOf("budget_percent", selectedTags || [])}
                    Component={CommonComponentPercent}
                    componentProps={{
                        version: veri.version,
                        reduxStore: veri.reduxStore?.budget_percent,
                        keyPrefix: `${veri.keyPrefix}.budget_percent`,
                        title: "Budget Percent"
                    }}
                />
            </Col>
        </ECard>
    );
};

export default ComponentRetryBudget;
