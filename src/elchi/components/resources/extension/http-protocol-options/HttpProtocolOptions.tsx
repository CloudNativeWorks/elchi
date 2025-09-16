import React from "react";
import { useLocation } from "react-router-dom";
import { Col, Row, Divider } from "antd";
import { HeadOfResource } from "@/elchi/components/common/HeadOfResources";
import CustomAnchor from "@/elchi/components/common/CustomAnchor";
import { GTypes } from "@/common/statics/gtypes";
import { useGTypeFields } from "@/hooks/useGtypes";
import useResourceMain from "@/hooks/useResourceMain";
import { startsWithAny } from "@/utils/tools";
import ComponentUpstreamHttpProtocolOptions from "./UpstreamHttpProtocolOptions";
import ComponentCommonHttpProtocolOptions from "./CommonHttpProtocolOptions";
import { modtag_http_protocol_options, modtag_us_hpo } from "./_modtag_";
import { useModels } from "@/hooks/useModels";
import { useTags } from "@/hooks/useTags";
import { useLoading } from "@/hooks/loadingContext";
import RenderLoading from "@/elchi/components/common/Loading";
import { useManagedLoading } from "@/hooks/useManageLoading";
import ComponentExplicitHttpConfig from "./ExplicitHttpConfig";
import { navigateCases } from "@/elchi/helpers/navigate-cases";
import UseDownstreamProtocolConfig from "./UseDownstreamProtocolConfig";
import ComponentAutoConfig from "./AutoConfig";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";


type GeneralProps = {
    veri: {
        version: string;
        gtype: string;
        queryResource: any;
        generalName: string;
        changeGeneralName: any;
    }
};

const ComponentHttpProtocolOptions: React.FC<GeneralProps> = ({ veri }) => {
    const GType = useGTypeFields(GTypes.HttpProtocolOptions);
    const location = useLocation();
    const { vModels, loading_m } = useModels(veri.version, modtag_http_protocol_options);
    const { vTags, loading } = useTags(veri.version, modtag_http_protocol_options);
    const { loadingCount } = useLoading();
    const { reduxStore, selectedTags, handleChangeTag } = useResourceMain({
        version: veri.version,
        alias: "hpo",
        vModels,
        vTags,
        modelName: "HttpProtocolOptions",
    });

    useManagedLoading(loading, loading_m);
    if (loadingCount > 0) {
        return <RenderLoading checkPage={true} isLoadingQuery={true} error={""} />;
    }

    return (
        reduxStore && (
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
                        voidToJSON: vModels.hpo?.HttpProtocolOptions.toJSON,
                        queryResource: veri.queryResource,
                        envoyVersion: veri.version,
                        gtype: reduxStore?.$type,
                    }}
                />
                <Divider type="horizontal" orientation="left" orientationMargin="0">Http Protocol Options</Divider>
                <Row>
                    <Col md={4} style={{ display: "block", maxHeight: "auto", overflowY: "auto" }}>
                        <CustomAnchor
                            resourceConfKeys={vTags.hpo?.HttpProtocolOptions}
                            unsuportedTags={modtag_us_hpo["HttpProtocolOptions"]}
                            singleOptionKeys={[]}
                            selectedTags={selectedTags}
                            index={0}
                            handleChangeTag={handleChangeTag}
                            tagMatchPrefix={"HttpProtocolOptions"}
                            specificTagPrefix={{ explicit_http_config: 'upstream_protocol_options', use_downstream_protocol_config: 'upstream_protocol_options', auto_config: 'upstream_protocol_options' }}
                            onlyOneTag={[["upstream_protocol_options.explicit_http_config", "upstream_protocol_options.use_downstream_protocol_config", "upstream_protocol_options.auto_config"]]}
                        />
                    </Col>
                    <Col md={20}>
                        <ConditionalComponent
                            shouldRender={startsWithAny("common_http_protocol_options", selectedTags)}
                            Component={ComponentCommonHttpProtocolOptions}
                            componentProps={{
                                version: veri.version,
                                reduxStore: reduxStore?.common_http_protocol_options,
                                keyPrefix: `common_http_protocol_options`,
                                id: `common_http_protocol_options_0`,
                            }}
                        />
                        <ConditionalComponent
                            shouldRender={startsWithAny("upstream_http_protocol_options", selectedTags)}
                            Component={ComponentUpstreamHttpProtocolOptions}
                            componentProps={{
                                version: veri.version,
                                reduxStore: reduxStore?.upstream_http_protocol_options,
                                keyPrefix: `upstream_http_protocol_options`,
                                tagMatchPrefix: `HttpProtocolOptions.upstream_http_protocol_options`,
                                id: `upstream_http_protocol_options_0`,
                            }}
                        />
                        <ConditionalComponent
                            shouldRender={startsWithAny("upstream_protocol_options.explicit_http_config", selectedTags)}
                            Component={ComponentExplicitHttpConfig}
                            componentProps={{
                                version: veri.version,
                                reduxStore: navigateCases(reduxStore, "upstream_protocol_options.explicit_http_config"),
                                keyPrefix: `explicit_http_config`,
                                id: `explicit_http_config_0`,
                            }}
                        />
                        <ConditionalComponent
                            shouldRender={startsWithAny("upstream_protocol_options.use_downstream_protocol_config", selectedTags)}
                            Component={UseDownstreamProtocolConfig}
                            componentProps={{
                                version: veri.version,
                                reduxStore: navigateCases(reduxStore, "upstream_protocol_options.use_downstream_protocol_config"),
                                keyPrefix: `use_downstream_protocol_config`,
                                id: `use_downstream_protocol_config_0`,
                            }}
                        />
                        <ConditionalComponent
                            shouldRender={startsWithAny("upstream_protocol_options.auto_config", selectedTags)}
                            Component={ComponentAutoConfig}
                            componentProps={{
                                version: veri.version,
                                reduxStore: navigateCases(reduxStore, "upstream_protocol_options.auto_config"),
                                keyPrefix: `auto_config`,
                                id: `auto_config_0`,
                            }}
                        />
                    </Col>
                </Row>
            </>
        )
    )
}

export default React.memo(ComponentHttpProtocolOptions);