import React from "react";
import { useLocation } from "react-router-dom";
import { Col, Row, Divider } from "antd";
import { HeadOfResource } from "@/elchi/components/common/HeadOfResources";
import CustomAnchor from "@/elchi/components/common/CustomAnchor";
import { GTypes } from "@/common/statics/gtypes";
import { useGTypeFields } from "@/hooks/useGtypes";
import { startsWithAny } from "@/utils/tools";
import CommonComponentRuntimeFractionalPercent from "@resources/common/RuntimeFractionalPercent/RuntimeFractionalPercent";
import useResourceMain from "@/hooks/useResourceMain";
import { useModels } from "@/hooks/useModels";
import { useTags } from "@/hooks/useTags";
import RenderLoading from "@/elchi/components/common/Loading";
import { modtag_csrf_policy } from "./_modtag_";
import { useLoading } from "@/hooks/loadingContext";
import { useManagedLoading } from "@/hooks/useManageLoading";
import { ResourceAction } from "@/redux/reducers/slice";
import CommonComponentStringMatchers from "@/elchi/components/resources/common/StringMatcher/StringMatchers";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";


type GeneralProps = {
    veri: {
        version: string;
        queryResource: any;
        generalName: string;
        changeGeneralName: any;
    }
};

const ComponentCsrfPolicy: React.FC<GeneralProps> = ({ veri }) => {
    const GType = useGTypeFields(GTypes.CsrfPolicy);
    const location = useLocation();
    const { vModels, loading_m } = useModels(veri.version, modtag_csrf_policy);
    const { vTags, loading } = useTags(veri.version, modtag_csrf_policy);
    const { loadingCount } = useLoading();
    const { reduxStore, selectedTags, handleChangeTag } = useResourceMain({
        version: veri.version,
        alias: "cp",
        vModels,
        vTags,
        modelName: "CsrfPolicy",
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
                        voidToJSON: vModels.cp?.CsrfPolicy.toJSON,
                        queryResource: veri.queryResource,
                        envoyVersion: veri.version,
                        gtype: reduxStore?.$type,
                    }}
                />
                <Divider type="horizontal" orientation="left" orientationMargin="0">Csrf Policy</Divider>
                <Row>
                    <Col md={4}>
                        <CustomAnchor
                            resourceConfKeys={vTags.cp?.CsrfPolicy}
                            singleOptionKeys={vTags.cp?.CsrfPolicy_SingleFields}
                            selectedTags={selectedTags}
                            index={0}
                            handleChangeTag={handleChangeTag}
                            tagMatchPrefix={"CsrfPolicy"}
                        />
                    </Col>
                    <Col md={20}>
                        <ConditionalComponent
                            shouldRender={startsWithAny("filter_enabled", selectedTags)}
                            Component={CommonComponentRuntimeFractionalPercent}
                            componentProps={{
                                version: veri.version,
                                reduxAction: ResourceAction,
                                reduxStore: reduxStore?.filter_enabled,
                                keyPrefix: `filter_enabled`,
                                tagPrefix: `filter_enabled`,
                                tagMatchPrefix: `filter_enabled`,
                                title: "Filter Enabled",
                                id: `filter_enabled_0`,
                            }}
                        />
                        <ConditionalComponent
                            shouldRender={startsWithAny("shadow_enabled", selectedTags)}
                            Component={CommonComponentRuntimeFractionalPercent}
                            componentProps={{
                                version: veri.version,
                                reduxAction: ResourceAction,
                                reduxStore: reduxStore?.shadow_enabled,
                                keyPrefix: `shadow_enabled`,
                                tagPrefix: `shadow_enabled`,
                                tagMatchPrefix: `shadow_enabled`,
                                title: "Shadow Enabled",
                                id: `shadow_enabled_0`,
                            }}
                        />
                        <ConditionalComponent
                            shouldRender={startsWithAny("additional_origins", selectedTags)}
                            Component={CommonComponentStringMatchers}
                            componentProps={{
                                version: veri.version,
                                selectedTags: selectedTags,
                                reduxAction: ResourceAction,
                                reduxStore: reduxStore?.additional_origins,
                                keyPrefix: `additional_origins`,
                                tagMatchPrefix: `additional_origins`,
                                title: "Additional Origins",
                                tag: "additional_origins",
                                id: `additional_origins_0`,
                            }}
                        />
                    </Col>
                </Row>
            </>
        )
    );
}

export default React.memo(ComponentCsrfPolicy);
