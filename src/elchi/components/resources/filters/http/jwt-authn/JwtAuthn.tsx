import React from "react";
import { useLocation } from "react-router-dom";
import { Col, Row, Divider } from "antd";
import { HeadOfResource } from "@/elchi/components/common/HeadOfResources";
import { GTypes } from "@/common/statics/gtypes";
import { useGTypeFields } from "@/hooks/useGtypes";
import { FieldConfigType } from "@/utils/tools";
import { modtag_jwt_authn, modtag_excluded_jwt_authn } from "./_modtag_";
import { useModels } from "@/hooks/useModels";
import { useTags } from "@/hooks/useTags";
import useResourceMain from "@/hooks/useResourceMain";
import CustomAnchor from "@/elchi/components/common/CustomAnchor";
import { generateFields } from "@/common/generate-fields";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";
import CommonComponentSingleOptions from "@/elchi/components/resources/common/SingleOptions/SingleOptions";
import MapField from "@/elchi/components/common/MapField/MapField";
import ComponentJwtProvider from "./JwtProvider/JwtProvider";
import ComponentJwtRequirement from "./JwtRequirement/JwtRequirement";
import RenderLoading from "@/elchi/components/common/Loading";
import { useLoading } from "@/hooks/loadingContext";
import { useManagedLoading } from "@/hooks/useManageLoading";
import { startsWithAny } from "@/utils/tools";
import { ResourceAction } from "@/redux/reducers/slice";


type GeneralProps = {
    veri: {
        version: string;
        queryResource: any;
        generalName: string;
        changeGeneralName: any;
    }
};

const ComponentHttpJwtAuthn: React.FC<GeneralProps> = ({ veri }) => {
    const GType = useGTypeFields(GTypes.HttpJwtAuthn);
    const location = useLocation();
    const { vModels, loading_m } = useModels(veri.version, modtag_jwt_authn);
    const { vTags, loading } = useTags(veri.version, modtag_jwt_authn);
    const { loadingCount } = useLoading();
    const { reduxStore, selectedTags, handleChangeTag } = useResourceMain({
        version: veri.version,
        alias: "ja",
        vModels,
        vTags,
        modelName: "JwtAuthentication",
    });

    useManagedLoading(loading, loading_m);
    if (loadingCount > 0) {
        return <RenderLoading checkPage={true} isLoadingQuery={true} error={""} />;
    }

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.ja?.JwtAuthentication,
            sf: vTags.ja?.JwtAuthentication_SingleFields,
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
                    voidToJSON: vModels.ja?.JwtAuthentication.toJSON,
                    queryResource: veri.queryResource,
                    envoyVersion: veri.version,
                    gtype: reduxStore?.$type,
                }}
            />
            <Divider type="horizontal" orientation="left" orientationMargin="0">Http JWT Authentication</Divider>
            <Row>
                <Col md={4} style={{ display: "block", maxHeight: "auto", overflowY: "auto" }}>
                    <CustomAnchor
                        resourceConfKeys={vTags.ja?.JwtAuthentication}
                        singleOptionKeys={vTags.ja?.JwtAuthentication_SingleFields}
                        selectedTags={selectedTags}
                        index={0}
                        handleChangeTag={handleChangeTag}
                        tagMatchPrefix={"JwtAuthentication"}
                        unsuportedTags={modtag_excluded_jwt_authn}
                    />
                </Col>
                <Col md={20}>
                    <ConditionalComponent
                        shouldRender={selectedTags?.some(item => vTags.ja?.JwtAuthentication_SingleFields.includes(item))}
                        Component={CommonComponentSingleOptions}
                        componentProps={{
                            version: veri.version,
                            selectedTags: selectedTags,
                            fieldConfigs: fieldConfigs,
                            reduxStore: reduxStore,
                            id: `single_options_0`,
                        }}
                    />

                    {startsWithAny("providers", selectedTags) && (
                        <MapField
                            version={veri.version}
                            reduxStore={reduxStore?.providers}
                            keyPrefix="providers"
                            reduxAction={ResourceAction}
                            title="JWT Providers"
                            valueType="component"
                            ValueComponent={ComponentJwtProvider}
                            keyPlaceholder="Provider name (e.g., auth0, okta, google)"
                            id="providers_0"
                        />
                    )}

                    {startsWithAny("requirement_map", selectedTags) && (
                        <MapField
                            version={veri.version}
                            reduxStore={reduxStore?.requirement_map}
                            keyPrefix="requirement_map"
                            reduxAction={ResourceAction}
                            title="Requirement Map"
                            valueType="component"
                            ValueComponent={ComponentJwtRequirement}
                            keyPlaceholder="Requirement name (e.g., require-jwt, allow-missing)"
                            id="requirement_map_0"
                        />
                    )}

                    {/*
                    TODO: Remaining complex components:
                    - rules (RequirementRule[]) - Array of route matching + JWT requirements
                    - filter_state_rules (FilterStateRule) - Dynamic filter state based requirements

                    These require:
                    - Array component for rules
                    - RouteMatch component (complex path/prefix/regex matching)
                    - FilterStateRule component (filter state key + requirements)
                    */}
                </Col>
            </Row>
        </>
    );
}

export default React.memo(ComponentHttpJwtAuthn);
