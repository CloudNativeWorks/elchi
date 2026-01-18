import React, { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@redux/store";
import { Col, Row, Divider } from "antd";
import { HeadOfResource } from "@/elchi/components/common/HeadOfResources";
import { extractNestedKeys } from "@/utils/get-active-tags";
import { ActionType, ResourceType } from "@/redux/reducer-helpers/common";
import { handleChangeResources } from "@/redux/dispatcher";
import { handleAddRemoveTags } from "@/elchi/helpers/tag-operations";
import { FieldConfigType, matchesEndOrStartOf } from "@/utils/tools";
import { getRouteSpecifier } from "./Helpers";
import { ConfDiscovery } from "@/common/types";
import { ResourceAction } from "@/redux/reducers/slice";
import CommonComponentSingleOptions from "@/elchi/components/resources/common/SingleOptions/SingleOptions";
import ComponentRds from "./rds/Rds";
import ComponentHttpFilters from './HttpFilters';
import CustomAnchor from "@/elchi/components/common/CustomAnchor";
import CommonComponentAccessLog from "@resources/common/AccessLog/AccessLog";
import { GTypes } from "@/common/statics/gtypes";
import { useGTypeFields } from "@/hooks/useGtypes";
import ComponentRoute from "@/elchi/components/resources/route/RouteInside";
import { generateFields } from "@/common/generate-fields";
import RenderLoading from "@/elchi/components/common/Loading";
import { useModels } from "@/hooks/useModels";
import { useTags } from "@/hooks/useTags";
import { modtag_http_connection_manager, modtag_r_hcm, modtag_us_hcm } from "./_modtag_";
import { useLoading } from "@/hooks/loadingContext";
import { useManagedLoading } from "@/hooks/useManageLoading";
import ComponentHttp1ProtocolOptions from "@/elchi/components/resources/extension/http-protocol-options/Http1ProtocolOptions";
import ComponentHttp2ProtocolOptions from "@/elchi/components/resources/extension/http-protocol-options/Http2ProtocolOptions";
import ComponentHttp3ProtocolOptions from "@/elchi/components/resources/extension/http-protocol-options/Http3ProtocolOptions";
import ComponentCommonHttpProtocolOptions from "@/elchi/components/resources/extension/http-protocol-options/CommonHttpProtocolOptions";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";
import ComponentUpgradeConfigs from "./UpgradeConfigs";
import CommonComponentSchemeHeaderTransformation from "@/elchi/components/resources/common/SchemeHeaderTransformation/SchemeHeaderTransformation";
import ComponentAccessLogOptions from "./AccessLogOptions/AccessLogOptions";
import ComponentOriginalIPDetectionExtensions from "./OriginalIPDetectionExtensions/OriginalIPDetectionExtensions";
import ComponentSetCurrentClientCertDetails from "./SetCurrentClientCertDetails/SetCurrentClientCertDetails";
import ComponentProxyStatusConfig from "./ProxyStatusConfig/ProxyStatusConfig";

type GeneralProps = {
    veri: {
        version: string;
        queryResource: any;
        generalName: string;
        changeGeneralName: any;
    }
};

const ComponentHttpConnectionManager: React.FC<GeneralProps> = ({ veri }) => {
    const GType = useGTypeFields(GTypes.HTTPConnectionManager);
    const location = useLocation();
    const dispatch = useDispatch();
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const { vModels, loading_m } = useModels(veri.version, modtag_http_connection_manager);
    const { vTags, loading } = useTags(veri.version, modtag_http_connection_manager);
    const { loadingCount } = useLoading();

    const memoConfigDiscoveryReduxStore = useSelector((state: RootState) => state.VersionedResources[veri.version].ConfigDiscovery);
    const configDiscoveryReduxStore: ConfDiscovery[] = useMemo(() => {
        return memoConfigDiscoveryReduxStore;
    }, [memoConfigDiscoveryReduxStore]);

    const memoReduxStore = useSelector((state: RootState) => state.VersionedResources[veri.version].Resource);
    const reduxStore = useMemo(() => {
        return vModels.hcm?.HttpConnectionManager.fromJSON(memoReduxStore);
    }, [memoReduxStore, vModels]);

    useEffect(() => {
        setSelectedTags(extractNestedKeys(reduxStore));
    }, [veri.version, reduxStore]);

    const handleChangeRedux = (keys: string, val?: string | boolean | number) => {
        handleChangeResources({ version: veri.version, type: ActionType.Delete, keys, val, resourceType: ResourceType.Resource }, dispatch, ResourceAction);
    };

    const handleChangeTag = (keyPrefix: string, tagPrefix: string, tag: string, checked: boolean) => {
        handleAddRemoveTags(keyPrefix, tagPrefix, tag, checked, selectedTags, setSelectedTags, handleChangeRedux);
        if (tag === "http_filters") {
            dispatch(ResourceAction({ version: veri.version, type: ActionType.Delete, keys: [], val: null, resourceType: ResourceType.ConfigDiscovery }));
        }
    }

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.hcm?.HttpConnectionManager,
            sf: vTags.hcm?.HttpConnectionManager_SingleFields,
            r: ["stat_prefix"]
        })
    ];

    useManagedLoading(loading, loading_m);
    if (loadingCount > 0) {
        return <RenderLoading checkPage={true} isLoadingQuery={!vModels || !vTags || loading} error={""} />;
    }

    return (
        reduxStore && (
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
                        voidToJSON: vModels.hcm?.HttpConnectionManager.toJSON,
                        queryResource: veri.queryResource,
                        envoyVersion: veri.version,
                        gtype: reduxStore?.$type,
                        configDiscovery: configDiscoveryReduxStore,
                    }}
                />
                <Divider type="horizontal" orientation="left" orientationMargin="0">HCM Configuration</Divider>
                <Row>
                    <Col md={4} style={{ display: "block", maxHeight: "auto", overflowY: "auto" }} className="custom-scrollbar-side">
                        <CustomAnchor
                            resourceConfKeys={vTags.hcm?.HttpConnectionManager}
                            unsuportedTags={modtag_us_hcm["HCM"]}
                            singleOptionKeys={vTags.hcm?.HttpConnectionManager_SingleFields}
                            selectedTags={selectedTags}
                            handleChangeTag={handleChangeTag}
                            tagMatchPrefix={"HttpConnectionManager"}
                            specificTagPrefix={{ "rds": "route_specifier", "route_config": "route_specifier", 'strip_any_host_port': 'strip_port_mode' }}
                            required={modtag_r_hcm['HttpConnectionManager']}
                            onlyOneTag={[["route_specifier.rds", "route_specifier.route_config"]]}
                        />
                    </Col>
                    <Col md={20}>
                        <ConditionalComponent
                            shouldRender={selectedTags?.some(item => vTags.hcm?.HttpConnectionManager_SingleFields.includes(item))}
                            Component={CommonComponentSingleOptions}
                            componentProps={{
                                version: veri.version,
                                selectedTags: selectedTags,
                                reduxStore: reduxStore,
                                fieldConfigs: fieldConfigs,
                                id: `single_options_0`,
                            }}
                        />
                        <ConditionalComponent
                            shouldRender={matchesEndOrStartOf("route_specifier.rds", selectedTags)}
                            Component={ComponentRds}
                            componentProps={{
                                version: veri.version,
                                reduxStore: getRouteSpecifier(reduxStore),
                                keyPrefix: "rds",
                                tagMatchPrefix: "HttpConnectionManager.route_specifier.rds",
                                id: `rds_0`,
                            }}
                        />
                        <ConditionalComponent
                            shouldRender={matchesEndOrStartOf("route_specifier.route_config", selectedTags)}
                            Component={ComponentRoute}
                            componentProps={{
                                version: veri.version,
                                keyPrefix: `route_config`,
                                tagMatchPrefix: `HttpConnectionManager.route_specifier.route_config`,
                                reduxStore: getRouteSpecifier(reduxStore),
                                reduxAction: ResourceAction,
                                configDiscovery: configDiscoveryReduxStore,
                                GType: GType,
                                id: `route_config_0`,
                            }}
                        />
                        <ConditionalComponent
                            shouldRender={matchesEndOrStartOf("http_filters", selectedTags)}
                            Component={ComponentHttpFilters}
                            componentProps={{
                                version: veri.version,
                                httpFilters: reduxStore?.http_filters,
                                reduxStore: configDiscoveryReduxStore,
                                keyPrefix: "http_filters",
                                id: `http_filters_0`,
                            }}
                        />
                        <ConditionalComponent
                            shouldRender={matchesEndOrStartOf("common_http_protocol_options", selectedTags)}
                            Component={ComponentCommonHttpProtocolOptions}
                            componentProps={{
                                version: veri.version,
                                reduxStore: reduxStore?.common_http_protocol_options,
                                keyPrefix: `common_http_protocol_options`,
                                id: `common_http_protocol_options_0`,
                            }}
                        />
                        <ConditionalComponent
                            shouldRender={matchesEndOrStartOf("http_protocol_options", selectedTags)}
                            Component={ComponentHttp1ProtocolOptions}
                            componentProps={{
                                version: veri.version,
                                reduxStore: reduxStore?.http_protocol_options,
                                keyPrefix: `http_protocol_options`,
                                id: `http_protocol_options_0`,
                            }}
                        />
                        <ConditionalComponent
                            shouldRender={matchesEndOrStartOf("http2_protocol_options", selectedTags)}
                            Component={ComponentHttp2ProtocolOptions}
                            componentProps={{
                                version: veri.version,
                                reduxStore: reduxStore?.http2_protocol_options,
                                keyPrefix: `http2_protocol_options`,
                                id: `http2_protocol_options_0`,
                            }}
                        />
                        <ConditionalComponent
                            shouldRender={matchesEndOrStartOf("http3_protocol_options", selectedTags)}
                            Component={ComponentHttp3ProtocolOptions}
                            componentProps={{
                                version: veri.version,
                                reduxStore: reduxStore?.http3_protocol_options,
                                keyPrefix: `http3_protocol_options`,
                                id: `http3_protocol_options_0`,
                            }}
                        />
                        <ConditionalComponent
                            shouldRender={matchesEndOrStartOf("scheme_header_transformation", selectedTags)}
                            Component={CommonComponentSchemeHeaderTransformation}
                            componentProps={{
                                version: veri.version,
                                reduxStore: reduxStore?.scheme_header_transformation,
                                keyPrefix: "scheme_header_transformation",
                                id: `scheme_header_transformation_0`,
                            }}
                        />

                        <ConditionalComponent
                            shouldRender={matchesEndOrStartOf("access_log", selectedTags)}
                            Component={CommonComponentAccessLog}
                            componentProps={{
                                version: veri.version,
                                keyPrefix: `access_log`,
                                tagMatchPrefix: `HttpConnectionManager.access_log`,
                                reduxStore: reduxStore?.access_log,
                                reduxAction: ResourceAction,
                                id: `access_log_0`,
                            }}
                        />
                        <ConditionalComponent
                            shouldRender={matchesEndOrStartOf("access_log_options", selectedTags)}
                            Component={ComponentAccessLogOptions}
                            componentProps={{
                                version: veri.version,
                                reduxStore: reduxStore?.access_log_options,
                                keyPrefix: "access_log_options",
                                id: `access_log_options_0`,
                            }}
                        />
                        <ConditionalComponent
                            shouldRender={matchesEndOrStartOf("original_ip_detection_extensions", selectedTags)}
                            Component={ComponentOriginalIPDetectionExtensions}
                            componentProps={{
                                version: veri.version,
                                keyPrefix: `original_ip_detection_extensions`,
                                tagMatchPrefix: `HttpConnectionManager.original_ip_detection_extensions`,
                                reduxStore: reduxStore?.original_ip_detection_extensions,
                                reduxAction: ResourceAction,
                                id: `original_ip_detection_extensions_0`,
                                title: "Original IP Detection Extensions",
                            }}
                        />
                        <ConditionalComponent
                            shouldRender={matchesEndOrStartOf("set_current_client_cert_details", selectedTags)}
                            Component={ComponentSetCurrentClientCertDetails}
                            componentProps={{
                                version: veri.version,
                                reduxStore: reduxStore?.set_current_client_cert_details,
                                keyPrefix: "set_current_client_cert_details",
                                title: "Set Current Client Cert Details",
                                id: `set_current_client_cert_details_0`,
                            }}
                        />
                        <ConditionalComponent
                            shouldRender={matchesEndOrStartOf("proxy_status_config", selectedTags)}
                            Component={ComponentProxyStatusConfig}
                            componentProps={{
                                version: veri.version,
                                reduxStore: reduxStore?.proxy_status_config,
                                keyPrefix: "proxy_status_config",
                                title: "Proxy Status Config",
                                id: `proxy_status_config_0`,
                            }}
                        />
                        <ConditionalComponent
                            shouldRender={matchesEndOrStartOf("upgrade_configs", selectedTags)}
                            Component={ComponentUpgradeConfigs}
                            componentProps={{
                                version: veri.version,
                                reduxStore: reduxStore?.upgrade_configs,
                                keyPrefix: "upgrade_configs",
                                tagMatchPrefix: "HttpConnectionManager.upgrade_configs",
                                id: `upgrade_configs_0`,
                            }}
                        />
                    </Col>
                </Row>
            </>
        )
    );
}

export default React.memo(ComponentHttpConnectionManager);


// strip_any_host_port not scroll, http3_protocol_options none