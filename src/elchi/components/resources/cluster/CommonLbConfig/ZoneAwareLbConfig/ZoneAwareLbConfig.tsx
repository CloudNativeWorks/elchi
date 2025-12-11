import React from "react";
import { Col, Divider } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { FieldConfigType, matchesEndOrStartOf } from "@/utils/tools";
import { useTags } from "@/hooks/useTags";
import { modtag_zone_aware_lb_config } from "./_modtag_";
import { generateFields } from "@/common/generate-fields";
import useResourceForm from "@/hooks/useResourceForm";
import ECard from "@/elchi/components/common/ECard";
import { EForm } from "../../../../common/e-components/EForm";
import { EFields } from "../../../../common/e-components/EFields";
import { ConditionalComponent } from "../../../../common/ConditionalComponent";
import CommonComponentPercent from "../../../common/Percent/Percent";

type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
        id: string;
    }
};

const ComponentZoneAwareLbConfig: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_zone_aware_lb_config);

    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.zalc?.Cluster_CommonLbConfig_ZoneAwareLbConfig,
            sf: vTags.zalc?.Cluster_CommonLbConfig_ZoneAwareLbConfig_SingleFields,
        }),
    ];

    return (
        <ECard title="Zone Aware LB Config" id={veri.id}>
            <HorizonTags veri={{
                tags: vTags.zalc?.Cluster_CommonLbConfig_ZoneAwareLbConfig,
                selectedTags: selectedTags || [],
                unsupportedTags: [],
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
                    shouldRender={matchesEndOrStartOf("routing_enabled", selectedTags || [])}
                    Component={CommonComponentPercent}
                    componentProps={{
                        version: veri.version,
                        reduxStore: veri.reduxStore?.routing_enabled,
                        keyPrefix: `${veri.keyPrefix}.routing_enabled`,
                        title: "Routing Enabled"
                    }}
                />
            </Col>
        </ECard>
    );
};

export default ComponentZoneAwareLbConfig;
