import React from "react";
import { Col, Tabs, Row, Divider } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { memorizeComponent, compareVeri } from "@/hooks/useMemoComponent";
import { FieldConfigType, matchesEndOrStartOf } from "@/utils/tools";
import { navigateCases } from "@/elchi/helpers/navigate-cases";
import { useTags } from "@/hooks/useTags";
import { modtag_health_check, modtag_us_cluster } from "./_modtag_";
import { generateFields } from "@/common/generate-fields";
import { useModels } from "@/hooks/useModels";
import CCard from "@/elchi/components/common/CopyPasteCard";
import ComponentHttpHealthCheck from "./HttpHealthCheck";
import ComponentTCPHealthCheck from "./TcpHealthCheck";
import ComponentGrpcHealthCheck from "./GrpcHealthCheck";
import ComponentHCEFSLink from "@/elchi/components/resources/extension/hcefs/HcefsLink";
import useResourceFormMultiple from "@/hooks/useResourceFormMultiple";
import useTabManager from "@/hooks/useTabManager";
import { ConditionalComponent } from "../../common/ConditionalComponent";
import { EForm } from "../../common/e-components/EForm";
import { EFields } from "../../common/e-components/EFields";


type GeneralProps = {
    veri: {
        version: string;
        reduxAction: any;
        reduxStore: any[] | undefined;
        keyPrefix: string;
        tagMatchPrefix: string;
    }
};

const ComponentHealthChecks: React.FC<GeneralProps> = ({ veri }) => {
    const { vModels } = useModels(veri.version, modtag_health_check);
    const { vTags } = useTags(veri.version, modtag_health_check);
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
            f: vTags.h?.HealthCheck,
            sf: vTags.h?.HealthCheck_SingleFields,
            r: ['timeout', 'interval', 'unhealthy_threshold', 'healthy_threshold']
        }),
    ];

    return (
        <CCard ctype="health_checks" reduxStore={veri.reduxStore} toJSON={vModels.h?.HealthCheck.toJSON} keys={veri.keyPrefix} Paste={handleChangeRedux} version={veri.version} title="Health Checks">
            <Tabs
                onChange={onChangeTabs}
                type="editable-card"
                activeKey={state.activeTab}
                onEdit={addTab}
                style={{ width: "99%" }}
                items={veri.reduxStore?.map((data: any, index: number) => {
                    return {
                        key: index.toString(),
                        label: "HC: " + index.toString(),
                        forceRender: true,
                        children: (
                            <>
                                <Row>
                                    <HorizonTags veri={{
                                        tags: vTags.h?.HealthCheck,
                                        selectedTags: selectedTags[index],
                                        unsupportedTags: modtag_us_cluster["HealthCheck"],
                                        index: index,
                                        tagMatchPrefix: `${veri.tagMatchPrefix}`,
                                        handleChangeTag: handleChangeTag,
                                        required: ['timeout', 'interval', 'unhealthy_threshold', 'healthy_threshold', 'http_health_check', 'tcp_health_check', 'grpc_health_check'],
                                        onlyOneTag: [['health_checker.http_health_check', 'health_checker.tcp_health_check', 'health_checker.grpc_health_check']],
                                        specificTagPrefix: { 'http_health_check': 'health_checker', 'tcp_health_check': 'health_checker', 'grpc_health_check': 'health_checker' },
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
                                    shouldRender={matchesEndOrStartOf("health_checker.http_health_check", selectedTags[index])}
                                    Component={ComponentHttpHealthCheck}
                                    componentProps={{
                                        version: veri.version,
                                        reduxStore: navigateCases(data, "health_checker.http_health_check"),
                                        keyPrefix: `${veri.keyPrefix}.${index}.http_health_check`,
                                        tagMatchPrefix: `${veri.tagMatchPrefix}.health_checker.http_health_check`,
                                        id: `health_checker.http_health_check_${index}`
                                    }}
                                />
                                <ConditionalComponent
                                    shouldRender={matchesEndOrStartOf("health_checker.tcp_health_check", selectedTags[index])}
                                    Component={ComponentTCPHealthCheck}
                                    componentProps={{
                                        version: veri.version,
                                        reduxStore: navigateCases(data, "health_checker.tcp_health_check"),
                                        keyPrefix: `${veri.keyPrefix}.${index}.tcp_health_check`,
                                        tagMatchPrefix: `${veri.tagMatchPrefix}.health_checker.tcp_health_check`,
                                        id: `health_checker.tcp_health_check_${index}`
                                    }}
                                />
                                <ConditionalComponent
                                    shouldRender={matchesEndOrStartOf("health_checker.grpc_health_check", selectedTags[index])}
                                    Component={ComponentGrpcHealthCheck}
                                    componentProps={{
                                        version: veri.version,
                                        reduxStore: navigateCases(data, "health_checker.grpc_health_check"),
                                        keyPrefix: `${veri.keyPrefix}.${index}.grpc_health_check`,
                                        tagMatchPrefix: `${veri.tagMatchPrefix}.health_checker.grpc_health_check`,
                                        id: `health_checker.grpc_health_check_${index}`
                                    }}
                                />
                                <ConditionalComponent
                                    shouldRender={matchesEndOrStartOf("event_logger", selectedTags[index])}
                                    Component={ComponentHCEFSLink}
                                    componentProps={{
                                        version: veri.version,
                                        keyPrefix: `${veri.keyPrefix}.${index}.event_logger`,
                                        tagMatchPrefix: `${veri.tagMatchPrefix}.event_logger`,
                                        reduxStore: data?.event_logger,
                                        gtype: 'envoy.extensions.health_check.event_sinks.file.v3.HealthCheckEventFileSink',
                                        prettyName: 'Event Logger',
                                        id: `event_logger_${index}`
                                    }}
                                />
                            </>
                        ),
                    };
                })
                }
            />
        </CCard>
    )
};

export default memorizeComponent(ComponentHealthChecks, compareVeri);
