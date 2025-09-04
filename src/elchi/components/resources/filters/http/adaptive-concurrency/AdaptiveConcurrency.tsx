import React from "react";
import { useLocation } from "react-router-dom";
import { Col, Row, Divider } from "antd";
import { HeadOfResource } from "@/elchi/components/common/HeadOfResources";
import CustomAnchor from "@/elchi/components/common/CustomAnchor";
import { GTypes } from "@/common/statics/gtypes";
import { useGTypeFields } from "@/hooks/useGtypes";
import useResourceMain from "@/hooks/useResourceMain";
import RenderLoading from "@/elchi/components/common/Loading";
import { useModels } from "@/hooks/useModels";
import { useTags } from "@/hooks/useTags";
import { modtag_adaptive_concurrency } from "./_modtag_";
import { useLoading } from "@/hooks/loadingContext";
import { useManagedLoading } from "@/hooks/useManageLoading";
import { startsWithAny } from "@/utils/tools";
import CommonComponentRuntimeFeatureFlag from "@/elchi/components/resources/common/RuntimeFeatureFlag/RuntimeFeatureFlag";
import CommonComponentHttpStatus from "@resources/common/HttpStatus/http_status";
import ComponentGradientControllerConfig from "./GradientControllerConfig";
import { navigateCases } from "@/elchi/helpers/navigate-cases";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";


type GeneralProps = {
    veri: {
        version: string;
        queryResource: any;
        generalName: string;
        changeGeneralName: any;
    }
};

const ComponentAdaptiveConcurrency: React.FC<GeneralProps> = ({ veri }) => {
    const GType = useGTypeFields(GTypes.AdaptiveConcurrency);
    const location = useLocation();
    const { vModels, loading_m } = useModels(veri.version, modtag_adaptive_concurrency);
    const { vTags, loading } = useTags(veri.version, modtag_adaptive_concurrency);
    const { loadingCount } = useLoading();
    const { reduxStore, selectedTags, handleChangeTag } = useResourceMain({
        version: veri.version,
        alias: "ac",
        vModels,
        vTags,
        modelName: "AdaptiveConcurrency",
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
                    version={veri.version}
                    changeGeneralName={veri.changeGeneralName}
                    locationCheck={location.pathname === GType.createPath}
                    createUpdate={{
                        location_path: location.pathname,
                        GType: GType,
                        offset: 0,
                        name: veri.generalName,
                        reduxStore: reduxStore,
                        voidToJSON: vModels.ac?.AdaptiveConcurrency.toJSON,
                        queryResource: veri.queryResource,
                        envoyVersion: veri.version,
                        gtype: reduxStore?.$type,
                    }}
                />
                <Divider type="horizontal" orientation="left" orientationMargin="0">Adaptive Concurrency</Divider>
                <Row>
                    <Col md={4}>
                        <CustomAnchor
                            resourceConfKeys={vTags.ac?.AdaptiveConcurrency}
                            unsuportedTags={["inline_code"]}
                            singleOptionKeys={vTags.ac?.AdaptiveConcurrency_SingleFields}
                            selectedTags={selectedTags}
                            index={0}
                            handleChangeTag={handleChangeTag}
                            tagMatchPrefix={"AdaptiveConcurrency"}
                            specificTagPrefix={{"gradient_controller_config": "concurrency_controller_config"}}
                        />
                    </Col>
                    <Col md={20}>
                        <ConditionalComponent
                            shouldRender={startsWithAny("concurrency_controller_config.gradient_controller_config", selectedTags)}
                            Component={ComponentGradientControllerConfig}
                            componentProps={{
                                version: veri.version,
                                reduxStore: navigateCases(reduxStore, "concurrency_controller_config.gradient_controller_config"),
                                keyPrefix: `gradient_controller_config`,
                                title: "Gradient Controller Config",
                                id: `gradient_controller_config_0`,
                            }}
                        />
                        <ConditionalComponent
                            shouldRender={startsWithAny("enabled", selectedTags)}
                            Component={CommonComponentRuntimeFeatureFlag}
                            componentProps={{
                                version: veri.version,
                                reduxStore: reduxStore?.enabled,
                                keyPrefix: `enabled`,
                                title: "Enabled",
                                id: `enabled_0`,
                            }}
                        />
                        <ConditionalComponent
                            shouldRender={startsWithAny("concurrency_limit_exceeded_status", selectedTags)}
                            Component={CommonComponentHttpStatus}
                            componentProps={{
                                version: veri.version,
                                reduxStore: reduxStore?.concurrency_limit_exceeded_status,
                                keyPrefix: `concurrency_limit_exceeded_status`,
                                title: "Concurrency Limit Exceeded Status",
                                id: `concurrency_limit_exceeded_status_0`,
                            }}
                        />
                    </Col>
                </Row>
            </>
        )
    );
}

export default React.memo(ComponentAdaptiveConcurrency);