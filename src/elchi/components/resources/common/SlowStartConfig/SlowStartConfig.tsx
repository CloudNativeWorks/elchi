import React from "react";
import { Col, Divider } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { FieldConfigType, matchesEndOrStartOf } from "@/utils/tools";
import { useTags } from "@/hooks/useTags";
import { modtag_slow_start_config, modtag_us_slow_start_config } from "./_modtag_";
import { generateFields } from "@/common/generate-fields";
import useResourceForm from "@/hooks/useResourceForm";
import ECard from "@/elchi/components/common/ECard";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import { EFields } from "@/elchi/components/common/e-components/EFields";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";
import CommonComponentRuntimeDouble from "../RuntimeDouble/RuntimeDouble";
import CommonComponentPercent from "../Percent/Percent";

type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
        id: string;
    }
};

const ComponentSlowStartConfig: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_slow_start_config);

    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.ssc?.Cluster_SlowStartConfig,
            sf: vTags.ssc?.Cluster_SlowStartConfig_SingleFields,
        }),
    ];

    return (
        <ECard title="Slow Start Config" id={veri.id}>
            <HorizonTags veri={{
                tags: vTags.ssc?.Cluster_SlowStartConfig,
                selectedTags: selectedTags || [],
                unsupportedTags: modtag_us_slow_start_config.Cluster_SlowStartConfig || [],
                keyPrefix: veri.keyPrefix,
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
                    shouldRender={matchesEndOrStartOf("aggression", selectedTags || [])}
                    Component={CommonComponentRuntimeDouble}
                    componentProps={{
                        version: veri.version,
                        reduxStore: veri.reduxStore?.aggression,
                        keyPrefix: `${veri.keyPrefix}.aggression`,
                        title: "Aggression"
                    }}
                />
                <ConditionalComponent
                    shouldRender={matchesEndOrStartOf("min_weight_percent", selectedTags || [])}
                    Component={CommonComponentPercent}
                    componentProps={{
                        version: veri.version,
                        reduxStore: veri.reduxStore?.min_weight_percent,
                        keyPrefix: `${veri.keyPrefix}.min_weight_percent`,
                        title: "Min Weight Percent"
                    }}
                />
            </Col>
        </ECard>
    );
};

export default ComponentSlowStartConfig;
