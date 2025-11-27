import React from "react";
import { useLocation } from "react-router-dom";
import { Col, Row, Divider } from "antd";
import { HeadOfResource } from "@/elchi/components/common/HeadOfResources";
import { GTypes } from "@/common/statics/gtypes";
import { useGTypeFields } from "@/hooks/useGtypes";
import { FieldConfigType, startsWithAny } from "@/utils/tools";
import { modtag_ext_authz, modtag_excluded_ext_authz } from "./_modtag_";
import { useModels } from "@/hooks/useModels";
import { useTags } from "@/hooks/useTags";
import useResourceMain from "@/hooks/useResourceMain";
import { navigateCases } from "@/elchi/helpers/navigate-cases";
import CommonComponentSingleOptions from "@/elchi/components/resources/common/SingleOptions/SingleOptions";
import CommonComponentGrpcService from "@/elchi/components/resources/common/GrpcService/GrpcService";
import CommonComponentHeaderMutationRules from "@/elchi/components/resources/common/HeaderMutationRules/HeaderMutationRules";
import CommonComponentHttpStatus from "@/elchi/components/resources/common/HttpStatus/http_status";
import CommonComponentRuntimeFractionalPercent from "@/elchi/components/resources/common/RuntimeFractionalPercent/RuntimeFractionalPercent";
import CommonComponentRuntimeFeatureFlag from "@/elchi/components/resources/common/RuntimeFeatureFlag/RuntimeFeatureFlag";
import CommonComponentListStringMatcher from "@/elchi/components/resources/common/ListStringMatcher/ListStringMatcher";
import ComponentBufferSettings from "./BufferSettings/BufferSettings";
import ComponentHttpService from "./HttpService/HttpService";
import CustomAnchor from "@/elchi/components/common/CustomAnchor";
import { generateFields } from "@/common/generate-fields";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";
import { ResourceAction } from "@/redux/reducers/slice";
import RenderLoading from "@/elchi/components/common/Loading";
import { useLoading } from "@/hooks/loadingContext";
import { useManagedLoading } from "@/hooks/useManageLoading";


type GeneralProps = {
    veri: {
        version: string;
        queryResource: any;
        generalName: string;
        changeGeneralName: any;
    }
};

const ComponentHttpExtAuthz: React.FC<GeneralProps> = ({ veri }) => {
    const GType = useGTypeFields(GTypes.HttpExtAuthz);
    const location = useLocation();
    const { vModels, loading_m } = useModels(veri.version, modtag_ext_authz);
    const { vTags, loading } = useTags(veri.version, modtag_ext_authz);
    const { loadingCount } = useLoading();
    const { reduxStore, selectedTags, handleChangeTag } = useResourceMain({
        version: veri.version,
        alias: "ea",
        vModels,
        vTags,
        modelName: "ExtAuthz",
    });

    useManagedLoading(loading, loading_m);
    if (loadingCount > 0) {
        return <RenderLoading checkPage={true} isLoadingQuery={true} error={""} />;
    }

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.ea?.ExtAuthz,
            sf: vTags.ea?.ExtAuthz_SingleFields,
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
                    voidToJSON: vModels.ea?.ExtAuthz.toJSON,
                    queryResource: veri.queryResource,
                    envoyVersion: veri.version,
                    gtype: reduxStore?.$type,
                }}
            />
            <Divider type="horizontal" orientation="left" orientationMargin="0">Http External Authorization</Divider>
            <Row>
                <Col md={4} style={{ display: "block", maxHeight: "auto", overflowY: "auto" }}>
                    <CustomAnchor
                        resourceConfKeys={vTags.ea?.ExtAuthz}
                        singleOptionKeys={vTags.ea?.ExtAuthz_SingleFields}
                        selectedTags={selectedTags}
                        index={0}
                        handleChangeTag={handleChangeTag}
                        tagMatchPrefix={"ExtAuthz"}
                        unsuportedTags={modtag_excluded_ext_authz}
                        onlyOneTag={[['services.grpc_service', 'services.http_service']]}
                        specificTagPrefix={{'http_service': 'services', 'grpc_service': 'services'}}
                    />
                </Col>
                <Col md={20}>
                    <ConditionalComponent
                        shouldRender={selectedTags?.some(item => vTags.ea?.ExtAuthz_SingleFields.includes(item))}
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
                        shouldRender={startsWithAny("services.grpc_service", selectedTags)}
                        Component={CommonComponentGrpcService}
                        componentProps={{
                            version: veri.version,
                            index: 0,
                            reduxStore: navigateCases(reduxStore, "services.grpc_service"),
                            keyPrefix: "grpc_service",
                            tagMatchPrefix: "ExtAuthz.services.grpc_service",
                            reduxAction: ResourceAction,
                            id: "services_grpc_service_0"
                        }}
                    />

                    <ConditionalComponent
                        shouldRender={startsWithAny("services.http_service", selectedTags)}
                        Component={ComponentHttpService}
                        componentProps={{
                            version: veri.version,
                            reduxStore: navigateCases(reduxStore, "services.http_service"),
                            keyPrefix: "http_service",
                            reduxAction: ResourceAction,
                            title: "HTTP Service",
                        }}
                    />

                    <ConditionalComponent
                        shouldRender={startsWithAny("status_on_error", selectedTags)}
                        Component={CommonComponentHttpStatus}
                        componentProps={{
                            version: veri.version,
                            reduxStore: reduxStore?.status_on_error,
                            keyPrefix: "status_on_error",
                            title: "Status On Error",
                            id: "status_on_error_0"
                        }}
                    />

                    <ConditionalComponent
                        shouldRender={startsWithAny("deny_at_disable", selectedTags)}
                        Component={CommonComponentRuntimeFeatureFlag}
                        componentProps={{
                            version: veri.version,
                            reduxStore: reduxStore?.deny_at_disable,
                            keyPrefix: "deny_at_disable",
                            reduxAction: ResourceAction,
                            title: "Deny at Disable",
                            id: "deny_at_disable_0"
                        }}
                    />

                    <ConditionalComponent
                        shouldRender={startsWithAny("decoder_header_mutation_rules", selectedTags)}
                        Component={CommonComponentHeaderMutationRules}
                        componentProps={{
                            version: veri.version,
                            reduxStore: reduxStore?.decoder_header_mutation_rules,
                            keyPrefix: "decoder_header_mutation_rules",
                            reduxAction: ResourceAction,
                            title: "Decoder Header Mutation Rules",
                            id: "decoder_header_mutation_rules_0"
                        }}
                    />

                    <ConditionalComponent
                        shouldRender={startsWithAny("with_request_body", selectedTags)}
                        Component={ComponentBufferSettings}
                        componentProps={{
                            version: veri.version,
                            reduxStore: reduxStore?.with_request_body,
                            keyPrefix: "with_request_body",
                            title: "With Request Body",
                            id: "with_request_body_0"
                        }}
                    />

                    <ConditionalComponent
                        shouldRender={startsWithAny("filter_enabled", selectedTags)}
                        Component={CommonComponentRuntimeFractionalPercent}
                        componentProps={{
                            version: veri.version,
                            reduxStore: reduxStore?.filter_enabled,
                            keyPrefix: "filter_enabled",
                            reduxAction: ResourceAction,
                            title: "Filter Enabled",
                            id: "filter_enabled_0"
                        }}
                    />

                    <ConditionalComponent
                        shouldRender={startsWithAny("allowed_headers", selectedTags)}
                        Component={CommonComponentListStringMatcher}
                        componentProps={{
                            version: veri.version,
                            reduxStore: reduxStore?.allowed_headers,
                            keyPrefix: "allowed_headers",
                            reduxAction: ResourceAction,
                            title: "Allowed Headers",
                            id: "allowed_headers_0"
                        }}
                    />

                    <ConditionalComponent
                        shouldRender={startsWithAny("disallowed_headers", selectedTags)}
                        Component={CommonComponentListStringMatcher}
                        componentProps={{
                            version: veri.version,
                            reduxStore: reduxStore?.disallowed_headers,
                            keyPrefix: "disallowed_headers",
                            reduxAction: ResourceAction,
                            title: "Disallowed Headers",
                            id: "disallowed_headers_0"
                        }}
                    />
                </Col>
            </Row>
        </>
    );
}

export default React.memo(ComponentHttpExtAuthz);
