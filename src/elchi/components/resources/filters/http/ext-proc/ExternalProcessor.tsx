import React from "react";
import { useLocation } from "react-router-dom";
import { Col, Row, Divider } from "antd";
import { HeadOfResource } from "@/elchi/components/common/HeadOfResources";
import { GTypes } from "@/common/statics/gtypes";
import { useGTypeFields } from "@/hooks/useGtypes";
import { FieldConfigType, startsWithAny } from "@/utils/tools";
import { modtag_ext_proc, modtag_excluded_ext_proc } from "./_modtag_";
import { useModels } from "@/hooks/useModels";
import { useTags } from "@/hooks/useTags";
import useResourceMain from "@/hooks/useResourceMain";
import CommonComponentSingleOptions from "@/elchi/components/resources/common/SingleOptions/SingleOptions";
import CommonComponentGrpcService from "@/elchi/components/resources/common/GrpcService/GrpcService";
import CommonComponentHeaderMutationRules from "@/elchi/components/resources/common/HeaderMutationRules/HeaderMutationRules";
import CommonComponentProcessingMode from "@/elchi/components/resources/common/ProcessingMode/ProcessingMode";
import CommonComponentAllowedOverrideModes from "@/elchi/components/resources/common/ProcessingMode/AllowedOverrideModes";
import CommonComponentHttpStatus from "@/elchi/components/resources/common/HttpStatus/http_status";
import ComponentHeaderForwardingRules from "./HeaderForwardingRules/HeaderForwardingRules";
import ComponentMetadataOptions from "./MetadataOptions/MetadataOptions";
import CustomAnchor from "@/elchi/components/common/CustomAnchor";
import { generateFields } from "@/common/generate-fields";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";
import { ResourceAction } from "@/redux/reducers/slice";


type GeneralProps = {
    veri: {
        version: string;
        queryResource: any;
        generalName: string;
        changeGeneralName: any;
    }
};

const ComponentHttpExternalProcessor: React.FC<GeneralProps> = ({ veri }) => {
    const GType = useGTypeFields(GTypes.HttpExternalProcessor);
    const location = useLocation();
    const { vModels } = useModels(veri.version, modtag_ext_proc);
    const { vTags } = useTags(veri.version, modtag_ext_proc);
    const { reduxStore, selectedTags, handleChangeTag } = useResourceMain({
        version: veri.version,
        alias: "ep",
        vModels,
        vTags,
        modelName: "ExternalProcessor",
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.ep?.ExternalProcessor,
            sf: vTags.ep?.ExternalProcessor_SingleFields,
        }),
    ];

    return (
        <>
            <HeadOfResource
                generalName={veri.generalName}
                version={veri.version}
                changeGeneralName={veri.changeGeneralName}
                locationCheck={location.pathname === GType.createPath}
                createUpdate={{
                    location_path: location.pathname,
                    GType: GType,
                    offset: 0,
                    name: veri.generalName,
                    reduxStore: reduxStore,
                    voidToJSON: vModels.ep?.ExternalProcessor.toJSON,
                    queryResource: veri.queryResource,
                    envoyVersion: veri.version,
                    gtype: reduxStore?.$type,
                }}
            />
            <Divider type="horizontal" orientation="left" orientationMargin="0">Http External Processor</Divider>
            <Row>
                <Col md={4} style={{ display: "block", maxHeight: "auto", overflowY: "auto" }}>
                    <CustomAnchor
                        resourceConfKeys={vTags.ep?.ExternalProcessor}
                        singleOptionKeys={vTags.ep?.ExternalProcessor_SingleFields}
                        selectedTags={selectedTags}
                        index={0}
                        handleChangeTag={handleChangeTag}
                        tagMatchPrefix={"ExternalProcessor"}
                        unsuportedTags={modtag_excluded_ext_proc}
                    />
                </Col>
                <Col md={20}>
                    <ConditionalComponent
                        shouldRender={selectedTags?.some(item => vTags.ep?.ExternalProcessor_SingleFields.includes(item))}
                        Component={CommonComponentSingleOptions}
                        componentProps={{
                            version: veri.version,
                            selectedTags: selectedTags,
                            fieldConfigs: fieldConfigs,
                            reduxStore: reduxStore,
                            id: `single_options_0`,
                        }}
                    />

                    <ConditionalComponent
                        shouldRender={startsWithAny("grpc_service", selectedTags)}
                        Component={CommonComponentGrpcService}
                        componentProps={{
                            version: veri.version,
                            selectedTags: selectedTags,
                            fieldConfigs: fieldConfigs,
                            tagMatchPrefix: "grpc_service",
                            reduxStore: reduxStore?.grpc_service,
                            keyPrefix: "grpc_service",
                            reduxAction: ResourceAction,
                            id: "grpc_service_0"
                        }}
                    />

                    <ConditionalComponent
                        shouldRender={startsWithAny("processing_mode", selectedTags)}
                        Component={CommonComponentProcessingMode}
                        componentProps={{
                            version: veri.version,
                            reduxStore: reduxStore?.processing_mode,
                            keyPrefix: "processing_mode",
                            reduxAction: ResourceAction,
                            title: "Processing Mode",
                            id: "processing_mode_0"
                        }}
                    />

                    <ConditionalComponent
                        shouldRender={startsWithAny("mutation_rules", selectedTags)}
                        Component={CommonComponentHeaderMutationRules}
                        componentProps={{
                            version: veri.version,
                            reduxStore: reduxStore?.mutation_rules,
                            keyPrefix: "mutation_rules",
                            reduxAction: ResourceAction,
                            title: "Mutation Rules",
                            id: "mutation_rules_0"
                        }}
                    />

                    <ConditionalComponent
                        shouldRender={startsWithAny("forward_rules", selectedTags)}
                        Component={ComponentHeaderForwardingRules}
                        componentProps={{
                            version: veri.version,
                            reduxStore: reduxStore?.forward_rules,
                            keyPrefix: "forward_rules",
                            reduxAction: ResourceAction,
                            title: "Forwarding Rules",
                            id: "forward_rules_0"
                        }}
                    />

                    <ConditionalComponent
                        shouldRender={selectedTags?.includes("allowed_override_modes")}
                        Component={CommonComponentAllowedOverrideModes}
                        componentProps={{
                            version: veri.version,
                            reduxStore: reduxStore?.allowed_override_modes,
                            keyPrefix: "allowed_override_modes",
                            reduxAction: ResourceAction,
                            title: "Allowed Override Modes",
                            id: "allowed_override_modes_0"
                        }}
                    />

                    <ConditionalComponent
                        shouldRender={startsWithAny("status_on_error", selectedTags)}
                        Component={CommonComponentHttpStatus}
                        componentProps={{
                            version: veri.version,
                            reduxStore: reduxStore?.status_on_error,
                            keyPrefix: "status_on_error",
                            title: "Status on Error",
                            id: "status_on_error_0"
                        }}
                    />

                    <ConditionalComponent
                        shouldRender={startsWithAny("metadata_options", selectedTags)}
                        Component={ComponentMetadataOptions}
                        componentProps={{
                            version: veri.version,
                            reduxStore: reduxStore?.metadata_options,
                            keyPrefix: "metadata_options",
                            reduxAction: ResourceAction,
                            title: "Metadata Options",
                            id: "metadata_options_0"
                        }}
                    />

                </Col>
            </Row>
        </>
    );
}

export default React.memo(ComponentHttpExternalProcessor);
