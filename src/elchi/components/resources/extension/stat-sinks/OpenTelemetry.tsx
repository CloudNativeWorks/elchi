import React from "react";
import { useLocation } from "react-router-dom";
import { Col, Row, Divider } from "antd";
import { HeadOfResource } from "@/elchi/components/common/HeadOfResources";
import CommonComponentSingleOptions from "@/elchi/components/resources/common/SingleOptions/SingleOptions";
import CommonComponentGrpcService from "@/elchi/components/resources/common/GrpcService/GrpcService";
import { GTypes } from "@/common/statics/gtypes";
import { useGTypeFields } from "@/hooks/useGtypes";
import useResourceMain from "@/hooks/useResourceMain";
import CustomAnchor from "@/elchi/components/common/CustomAnchor";
import { useModels } from "@/hooks/useModels";
import { useTags } from "@/hooks/useTags";
import { modtag_opentelemetry } from "./_modtag_";
import RenderLoading from "@/elchi/components/common/Loading";
import { useLoading } from "@/hooks/loadingContext";
import { useManagedLoading } from "@/hooks/useManageLoading";
import { generateFields } from "@/common/generate-fields";
import { FieldConfigType, startsWithAny } from "@/utils/tools";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";
import { navigateCases } from "@/elchi/helpers/navigate-cases";


type GeneralProps = {
    veri: {
        version: string;
        gtype: string;
        queryResource: any;
        generalName: string;
        changeGeneralName: any;
    }
};

const OpenTelemetryComponent: React.FC<GeneralProps> = ({ veri }) => {
    const GType = useGTypeFields(GTypes.OpenTelemetry);
    const location = useLocation();
    const { vModels, loading_m } = useModels(veri.version, modtag_opentelemetry);
    const { vTags, loading } = useTags(veri.version, modtag_opentelemetry);
    const { loadingCount } = useLoading();
    const { reduxStore, selectedTags, handleChangeTag } = useResourceMain({
        version: veri.version,
        alias: "otel",
        vModels,
        vTags,
        modelName: "SinkConfig",
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.otel?.SinkConfig,
            sf: vTags.otel?.SinkConfig_SingleFields,
        })
    ];

    useManagedLoading(loading, loading_m);
    if (loadingCount > 0) {
        return <RenderLoading checkPage={true} isLoadingQuery={true} error={""} />;
    }

    return (
        <>
            <HeadOfResource
                generalName={veri.generalName}
                changeGeneralName={veri.changeGeneralName}
                version={veri.version}
                locationCheck={GType.createPath === location.pathname}
                createUpdate={{
                    location_path: location.pathname,
                    GType: GType,
                    offset: 0,
                    name: veri.generalName,
                    reduxStore: reduxStore,
                    voidToJSON: vModels.otel?.SinkConfig.toJSON,
                    queryResource: veri.queryResource,
                    envoyVersion: veri.version,
                    gtype: reduxStore?.$type,
                }}
            />
            <Divider type="horizontal" orientation="left" orientationMargin="0">Open Telemetry</Divider>
            <Row>
                <Col md={4} style={{ display: "block", maxHeight: "auto", overflowY: "auto" }}>
                    <CustomAnchor
                        resourceConfKeys={vTags.otel?.SinkConfig}
                        selectedTags={selectedTags}
                        index={0}
                        handleChangeTag={handleChangeTag}
                        specificTagPrefix={{ "grpc_service": "protocol_specifier" }}
                        required={['grpc_service']}
                    />
                </Col>
                <Col md={20}>
                    <ConditionalComponent
                        shouldRender={startsWithAny("protocol_specifier.grpc_service", selectedTags)}
                        Component={CommonComponentGrpcService}
                        componentProps={{
                            version: veri.version,
                            selectedTags: selectedTags,
                            fieldConfigs: fieldConfigs,
                            tagMatchPrefix: `protocol_specifier.grpc_service`,
                            reduxStore: navigateCases(reduxStore, "protocol_specifier.grpc_service"),
                            keyPrefix: `grpc_service`,
                            id: `grpc_service_0`,
                        }}
                    />
                    <ConditionalComponent
                        shouldRender={selectedTags?.some(item => vTags.otel?.SinkConfig_SingleFields?.includes(item))}
                        Component={CommonComponentSingleOptions}
                        componentProps={{
                            version: veri.version,
                            selectedTags: selectedTags,
                            fieldConfigs: fieldConfigs,
                            reduxStore: reduxStore,
                            id: `single_options_0`,
                        }}
                    />
                </Col>
            </Row>
        </>
    )
}

export default React.memo(OpenTelemetryComponent);