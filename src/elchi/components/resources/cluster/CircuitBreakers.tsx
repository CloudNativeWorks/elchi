import React from "react";
import { Col, Divider, Row } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { matchesEndOrStartOf } from "@/utils/tools";
import { useTags } from "@/hooks/useTags";
import { modtag_circuit_breakers } from "./_modtag_";
import useResourceForm from "@/hooks/useResourceForm";
import ECard from "../../common/ECard";
import { ConditionalComponent } from "../../common/ConditionalComponent";
import ComponentThresholdsList from "./ThresholdsList";

type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
        tagMatchPrefix: string;
        reduxAction: any;
        id: string;
    }
};

const CircuitBreakers: React.FC<GeneralProps> = ({ veri }) => {
    const { id } = veri;
    const { vTags } = useTags(veri.version, modtag_circuit_breakers);

    const { selectedTags, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    return (
        <ECard title="Circuit Breakers" id={id}>
            <HorizonTags veri={{
                tags: vTags.cbs?.CircuitBreakers,
                selectedTags: selectedTags || [],
                unsupportedTags: [],
                keyPrefix: veri.keyPrefix,
                tagMatchPrefix: veri.tagMatchPrefix,
                handleChangeTag: handleChangeTag,
            }} />
            <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
            <Row gutter={[16, 16]}>
                <Col md={24}>
                    <ConditionalComponent
                        shouldRender={matchesEndOrStartOf("thresholds", selectedTags || [])}
                        Component={ComponentThresholdsList}
                        componentProps={{
                            version: veri.version,
                            keyPrefix: `${veri.keyPrefix}.thresholds`,
                            reduxStore: veri.reduxStore?.thresholds,
                            reduxAction: veri.reduxAction,
                            tagMatchPrefix: `${veri.tagMatchPrefix}.thresholds`,
                            id: `${id}_thresholds`,
                            title: "Thresholds"
                        }}
                    />
                </Col>
                <Col md={24}>
                    <ConditionalComponent
                        shouldRender={matchesEndOrStartOf("per_host_thresholds", selectedTags || [])}
                        Component={ComponentThresholdsList}
                        componentProps={{
                            version: veri.version,
                            keyPrefix: `${veri.keyPrefix}.per_host_thresholds`,
                            reduxStore: veri.reduxStore?.per_host_thresholds,
                            reduxAction: veri.reduxAction,
                            tagMatchPrefix: `${veri.tagMatchPrefix}.per_host_thresholds`,
                            id: `${id}_per_host`,
                            title: "Per-Host Thresholds"
                        }}
                    />
                </Col>
            </Row>
        </ECard>
    );
};

export default CircuitBreakers;
