import React from "react";
import { Col, Divider } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import useResourceForm from "@/hooks/useResourceForm";
import ECard from "@/elchi/components/common/ECard";
import { modtag_gradient_controller_config } from "./_modtag_";
import { useTags } from "@/hooks/useTags";
import { startsWithAny } from "@/utils/tools";
import CommonComponentPercent from "@/elchi/components/resources/common/Percent/Percent";
import ComponentConcurrencyLimitParams from "./ConcurrencyLimitParams";
import ComponentMinRttCalcParams from "./MinRttCalcParams";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
        title: string;
    }
};

const ComponentGradientControllerConfig: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_gradient_controller_config);
    const { selectedTags, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    return (
        <ECard title={veri.title}>
            <HorizonTags veri={{
                tags: vTags.gcg?.GradientControllerConfig,
                selectedTags: selectedTags,
                unsupportedTags: [],
                handleChangeTag: handleChangeTag,
                keyPrefix: veri.keyPrefix,
            }} />
            <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
            <Col md={24}>
                <ConditionalComponent
                    shouldRender={startsWithAny("sample_aggregate_percentile", selectedTags)}
                    Component={CommonComponentPercent}
                    componentProps={{
                        version: veri.version,
                        reduxStore: veri.reduxStore?.sample_aggregate_percentile,
                        keyPrefix: `${veri.keyPrefix}.sample_aggregate_percentile`,
                        title: "Sample Aggregate Percentile",
                        id: `sample_aggregate_percentile_0`,
                    }}
                />
                <ConditionalComponent
                    shouldRender={startsWithAny("concurrency_limit_params", selectedTags)}
                    Component={ComponentConcurrencyLimitParams}
                    componentProps={{
                        version: veri.version,
                        reduxStore: veri.reduxStore?.concurrency_limit_params,
                        keyPrefix: `${veri.keyPrefix}.concurrency_limit_params`,
                        title: "Concurrency Limit Params",
                        id: `concurrency_limit_params_0`,
                    }}
                />
                <ConditionalComponent
                    shouldRender={startsWithAny("min_rtt_calc_params", selectedTags)}
                    Component={ComponentMinRttCalcParams}
                    componentProps={{
                        version: veri.version,
                        reduxStore: veri.reduxStore?.min_rtt_calc_params,
                        keyPrefix: `${veri.keyPrefix}.min_rtt_calc_params`,
                        title: "Min Rtt Calc Params",
                        id: `min_rtt_calc_params_0`,
                    }}
                />
            </Col>
        </ECard>
    )
};

export default memorizeComponent(ComponentGradientControllerConfig, compareVeri);
