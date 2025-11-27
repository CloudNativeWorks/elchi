import React from "react";
import { Col, Divider } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { FieldConfigType, matchesEndOrStartOf } from "@/utils/tools";
import { useTags } from "@/hooks/useTags";
import { modtag_least_request_lb_config, modtag_us_least_request_lb_config } from "./_modtag_";
import { generateFields } from "@/common/generate-fields";
import useResourceForm from "@/hooks/useResourceForm";
import ECard from "@/elchi/components/common/ECard";
import { EForm } from "../../../../common/e-components/EForm";
import { EFields } from "../../../../common/e-components/EFields";
import { ConditionalComponent } from "../../../../common/ConditionalComponent";
import CommonComponentRuntimeDouble from "../../../common/RuntimeDouble/RuntimeDouble";
import ComponentSlowStartConfig from "../../../common/SlowStartConfig/SlowStartConfig";

type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
        id: string;
    }
};

const ComponentLeastRequestLbConfig: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_least_request_lb_config);

    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.lrlc?.Cluster_LeastRequestLbConfig,
            sf: vTags.lrlc?.Cluster_LeastRequestLbConfig_SingleFields,
        }),
    ];

    return (
        <ECard title="Least Request LB Config" id={veri.id}>
            <HorizonTags veri={{
                tags: vTags.lrlc?.Cluster_LeastRequestLbConfig,
                selectedTags: selectedTags || [],
                unsupportedTags: modtag_us_least_request_lb_config.Cluster_LeastRequestLbConfig || [],
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
                    shouldRender={matchesEndOrStartOf("active_request_bias", selectedTags || [])}
                    Component={CommonComponentRuntimeDouble}
                    componentProps={{
                        version: veri.version,
                        reduxStore: veri.reduxStore?.active_request_bias,
                        keyPrefix: `${veri.keyPrefix}.active_request_bias`,
                        title: "Active Request Bias"
                    }}
                />
                <ConditionalComponent
                    shouldRender={matchesEndOrStartOf("slow_start_config", selectedTags || [])}
                    Component={ComponentSlowStartConfig}
                    componentProps={{
                        version: veri.version,
                        reduxStore: veri.reduxStore?.slow_start_config,
                        keyPrefix: `${veri.keyPrefix}.slow_start_config`,
                        id: `${veri.id}_slow_start`
                    }}
                />
            </Col>
        </ECard>
    );
};

export default ComponentLeastRequestLbConfig;
