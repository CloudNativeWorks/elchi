import React from "react";
import { Col, Divider } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { FieldConfigType, matchesEndOrStartOf } from "@/utils/tools";
import { useTags } from "@/hooks/useTags";
import { modtag_common_lb_config, modtag_us_common_lb_config } from "./_modtag_";
import { generateFields } from "@/common/generate-fields";
import useResourceForm from "@/hooks/useResourceForm";
import ECard from "@/elchi/components/common/ECard";
import { EForm } from "../../../common/e-components/EForm";
import { EFields } from "../../../common/e-components/EFields";
import { ConditionalComponent } from "../../../common/ConditionalComponent";
import CommonComponentPercent from "../../common/Percent/Percent";
import ComponentZoneAwareLbConfig from "./ZoneAwareLbConfig/ZoneAwareLbConfig";
import ComponentLocalityWeightedLbConfig from "./LocalityWeightedLbConfig/LocalityWeightedLbConfig";
import ComponentConsistentHashingLbConfig from "./ConsistentHashingLbConfig/ConsistentHashingLbConfig";
import ComponentOverrideHostStatus from "./OverrideHostStatus/OverrideHostStatus";

type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
        id: string;
    }
};

const ComponentCommonLbConfig: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_common_lb_config);

    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.clc?.Cluster_CommonLbConfig,
            sf: vTags.clc?.Cluster_CommonLbConfig_SingleFields,
        }),
    ];

    return (
        <ECard title="Common LB Config" id={veri.id}>
            <HorizonTags veri={{
                tags: vTags.clc?.Cluster_CommonLbConfig,
                selectedTags: selectedTags || [],
                unsupportedTags: modtag_us_common_lb_config.Cluster_CommonLbConfig || [],
                keyPrefix: veri.keyPrefix,
                handleChangeTag: handleChangeTag,
                tagPrefix: ``,
                specificTagPrefix: {
                    "zone_aware_lb_config": "locality_config_specifier",
                    "locality_weighted_lb_config": "locality_config_specifier"
                },
                onlyOneTag: [["locality_config_specifier.zone_aware_lb_config", "locality_config_specifier.locality_weighted_lb_config"]]
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
                    shouldRender={matchesEndOrStartOf("healthy_panic_threshold", selectedTags || [])}
                    Component={CommonComponentPercent}
                    componentProps={{
                        version: veri.version,
                        reduxStore: veri.reduxStore?.healthy_panic_threshold,
                        keyPrefix: `${veri.keyPrefix}.healthy_panic_threshold`,
                        title: "Healthy Panic Threshold"
                    }}
                />
                <ConditionalComponent
                    shouldRender={matchesEndOrStartOf("locality_config_specifier.zone_aware_lb_config", selectedTags || [])}
                    Component={ComponentZoneAwareLbConfig}
                    componentProps={{
                        version: veri.version,
                        reduxStore: veri.reduxStore?.locality_config_specifier?.zone_aware_lb_config,
                        keyPrefix: `${veri.keyPrefix}.zone_aware_lb_config`,
                        id: `${veri.id}_zone_aware`
                    }}
                />
                <ConditionalComponent
                    shouldRender={matchesEndOrStartOf("locality_config_specifier.locality_weighted_lb_config", selectedTags || [])}
                    Component={ComponentLocalityWeightedLbConfig}
                    componentProps={{
                        version: veri.version,
                        reduxStore: veri.reduxStore?.locality_config_specifier?.locality_weighted_lb_config,
                        keyPrefix: `${veri.keyPrefix}.locality_weighted_lb_config`,
                        id: `${veri.id}_locality_weighted`
                    }}
                />
                <ConditionalComponent
                    shouldRender={matchesEndOrStartOf("consistent_hashing_lb_config", selectedTags || [])}
                    Component={ComponentConsistentHashingLbConfig}
                    componentProps={{
                        version: veri.version,
                        reduxStore: veri.reduxStore?.consistent_hashing_lb_config,
                        keyPrefix: `${veri.keyPrefix}.consistent_hashing_lb_config`,
                        id: `${veri.id}_consistent_hashing`
                    }}
                />
                <ConditionalComponent
                    shouldRender={matchesEndOrStartOf("override_host_status", selectedTags || [])}
                    Component={ComponentOverrideHostStatus}
                    componentProps={{
                        version: veri.version,
                        reduxStore: veri.reduxStore?.override_host_status,
                        keyPrefix: `${veri.keyPrefix}.override_host_status`,
                        id: `${veri.id}_override_host_status`
                    }}
                />
            </Col>
        </ECard>
    );
};

export default ComponentCommonLbConfig;
