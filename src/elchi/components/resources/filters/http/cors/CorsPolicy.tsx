import React from "react";
import { useLocation } from "react-router-dom";
import { Col, Row, Divider } from "antd";
import { HeadOfResource } from "@/elchi/components/common/HeadOfResources";
import { ResourceAction } from "@/redux/reducers/slice";
import CommonComponentSingleOptions from "@/elchi/components/resources/common/SingleOptions/SingleOptions";
import CustomAnchor from "@/elchi/components/common/CustomAnchor";
import { GTypes } from "@/common/statics/gtypes";
import { useGTypeFields } from "@/hooks/useGtypes";
import { FieldConfigType, startsWithAny } from "@/utils/tools";
import CommonComponentRuntimeFractionalPercent from "@resources/common/RuntimeFractionalPercent/RuntimeFractionalPercent";
import CommonComponentStringMatchers from "@resources/common/StringMatcher/StringMatchers";
import useResourceMain from "@/hooks/useResourceMain";
import { useModels } from "@/hooks/useModels";
import { useTags } from "@/hooks/useTags";
import RenderLoading from "@/elchi/components/common/Loading";
import { generateFields } from "@/common/generate-fields";
import { modtag_cors_policy } from "./_modtag_";
import { useLoading } from "@/hooks/loadingContext";
import { useManagedLoading } from "@/hooks/useManageLoading";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";


type GeneralProps = {
    veri: {
        version: string;
        queryResource: any;
        generalName: string;
        changeGeneralName: any;
    }
};

const ComponentCorsPolicy: React.FC<GeneralProps> = ({ veri }) => {
    const GType = useGTypeFields(GTypes.CorsPolicy);
    const location = useLocation();
    const { vModels, loading_m } = useModels(veri.version, modtag_cors_policy);
    const { vTags, loading } = useTags(veri.version, modtag_cors_policy);
    const { loadingCount } = useLoading();
    const { reduxStore, selectedTags, handleChangeTag } = useResourceMain({
        version: veri.version,
        alias: "cp",
        vModels,
        vTags,
        modelName: "CorsPolicy",
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.cp?.CorsPolicy,
            sf: vTags.cp?.CorsPolicy_SingleFields,
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
                version={veri.version}
                changeGeneralName={veri.changeGeneralName}
                locationCheck={location.pathname === GType.createPath}
                createUpdate={{
                    location_path: location.pathname,
                    GType: GType,
                    offset: 0,
                    name: veri.generalName,
                    reduxStore: reduxStore,
                    voidToJSON: vModels.cp?.CorsPolicy.toJSON,
                    queryResource: veri.queryResource,
                    envoyVersion: veri.version,
                    gtype: reduxStore?.$type,
                }}
            />
            <Divider type="horizontal" orientation="left" orientationMargin="0">Cors Policy</Divider>
            <Row>
                <Col md={4} style={{ display: "block", maxHeight: "auto", overflowY: "auto" }}>
                    <CustomAnchor
                        resourceConfKeys={vTags.cp?.CorsPolicy}
                        singleOptionKeys={vTags.cp?.CorsPolicy_SingleFields}
                        selectedTags={selectedTags}
                        index={0}
                        handleChangeTag={handleChangeTag}
                        tagMatchPrefix={"CorsPolicy"}
                    />
                </Col>
                <Col md={20}>
                    <ConditionalComponent
                        shouldRender={startsWithAny("allow_origin_string_match", selectedTags)}
                        Component={CommonComponentStringMatchers}
                        componentProps={{
                            version: veri.version,
                            selectedTags: selectedTags,
                            reduxAction: ResourceAction,
                            reduxStore: reduxStore?.allow_origin_string_match,
                            keyPrefix: `allow_origin_string_match`,
                            tagMatchPrefix: `CorsPolicy.allow_origin_string_match`,
                            title: "Allow Origin String Match",
                            tag: "allow_origin_string_match",
                            id: `allow_origin_string_match_0`,
                        }}
                    />
                    <ConditionalComponent
                        shouldRender={selectedTags?.some(item => vTags.cp?.CorsPolicy_SingleFields?.includes(item))}
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
                        shouldRender={startsWithAny("filter_enabled", selectedTags)}
                        Component={CommonComponentRuntimeFractionalPercent}
                        componentProps={{
                            version: veri.version,
                            reduxAction: ResourceAction,
                            reduxStore: reduxStore?.filter_enabled,
                            keyPrefix: `filter_enabled`,
                            tagPrefix: `CorsPolicy.filter_enabled`,
                            tagMatchPrefix: `CorsPolicy.filter_enabled`,
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
                            tagPrefix: `CorsPolicy.shadow_enabled`,
                            tagMatchPrefix: `CorsPolicy.shadow_enabled`,
                            title: "Shadow Enabled",
                            id: `shadow_enabled_0`,
                        }}
                    />
                </Col>
            </Row>
        </>
    );
}

export default React.memo(ComponentCorsPolicy);
