import React from "react";
import { Col, Divider } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { matchesEndOrStartOf } from "@/utils/tools";
import { useTags } from "@/hooks/useTags";
import { modtag_round_robin_lb_config, modtag_us_round_robin_lb_config } from "./_modtag_";
import useResourceForm from "@/hooks/useResourceForm";
import ECard from "@/elchi/components/common/ECard";
import { ConditionalComponent } from "../../../../common/ConditionalComponent";
import ComponentSlowStartConfig from "../../../common/SlowStartConfig/SlowStartConfig";

type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
        id: string;
    }
};

const ComponentRoundRobinLbConfig: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_round_robin_lb_config);

    const { selectedTags, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    return (
        <ECard title="Round Robin LB Config" id={veri.id}>
            <HorizonTags veri={{
                tags: vTags.rrlc?.Cluster_RoundRobinLbConfig,
                selectedTags: selectedTags || [],
                unsupportedTags: modtag_us_round_robin_lb_config.Cluster_RoundRobinLbConfig || [],
                keyPrefix: veri.keyPrefix,
                handleChangeTag: handleChangeTag,
            }} />
            <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
            <Col md={24}>
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

export default ComponentRoundRobinLbConfig;
