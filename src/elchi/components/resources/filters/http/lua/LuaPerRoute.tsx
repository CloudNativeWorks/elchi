import React from "react";
import { useLocation } from "react-router-dom";
import { Col, Row, Divider } from "antd";
import { HeadOfResource } from "@/elchi/components/common/HeadOfResources";
import CustomAnchor from "@/elchi/components/common/CustomAnchor";
import { GTypes } from "@/common/statics/gtypes";
import { useGTypeFields } from "@/hooks/useGtypes";
import { FieldConfigType, startsWithAny } from "@/utils/tools";
import CommonComponentDataSource from "@resources/common/DataSource/DataSource";
import useResourceMain from "@/hooks/useResourceMain";
import { useModels } from "@/hooks/useModels";
import { useTags } from "@/hooks/useTags";
import RenderLoading from "@/elchi/components/common/Loading";
import { modtag_lua_per_route } from "./_modtag_";
import { useLoading } from "@/hooks/loadingContext";
import { useManagedLoading } from "@/hooks/useManageLoading";
import { navigateCases } from "@/elchi/helpers/navigate-cases";
import { generateFields } from "@/common/generate-fields";
import CommonComponentSingleOptions from "@/elchi/components/resources/common/SingleOptions/SingleOptions";
import { FieldTypes } from "@/common/statics/general";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";


type GeneralProps = {
    veri: {
        version: string;
        queryResource: any;
        generalName: string;
        changeGeneralName: any;
    }
};

const ComponentLuaPerRoute: React.FC<GeneralProps> = ({ veri }) => {
    const GType = useGTypeFields(GTypes.LuaPerRoute);
    const location = useLocation();
    const { vModels, loading_m } = useModels(veri.version, modtag_lua_per_route);
    const { vTags, loading } = useTags(veri.version, modtag_lua_per_route);
    const { loadingCount } = useLoading();
    const { reduxStore, selectedTags, handleChangeTag } = useResourceMain({
        version: veri.version,
        alias: "luapr",
        vModels,
        vTags,
        modelName: "LuaPerRoute",
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.luapr?.LuaPerRoute,
            sf: vTags.luapr?.LuaPerRoute_SingleFields,
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
                    voidToJSON: vModels.luapr?.LuaPerRoute.toJSON,
                    queryResource: veri.queryResource,
                    envoyVersion: veri.version,
                    gtype: reduxStore?.$type,
                }}
            />
            <Divider type="horizontal" orientation="left" orientationMargin="0">Lua Per Route</Divider>
            <Row>
                <Col md={4} style={{ display: "block", maxHeight: "auto", overflowY: "auto" }}>
                    <CustomAnchor
                        resourceConfKeys={vTags.luapr?.LuaPerRoute}
                        singleOptionKeys={["disabled", "name"]}
                        selectedTags={selectedTags}
                        index={0}
                        handleChangeTag={handleChangeTag}
                        tagMatchPrefix={"LuaPerRoute"}
                        skipUnchangeble={["name"]}
                        tagPrefix={"override"}
                        onlyOneTag={[["override.disabled", "override.name", "override.source_code"]]}
                    />
                </Col>
                <Col md={20}>
                    <ConditionalComponent
                        shouldRender={selectedTags?.some(item => vTags.luapr?.LuaPerRoute_SingleFields?.includes(item))}
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
                        shouldRender={startsWithAny("override.source_code", selectedTags)}
                        Component={CommonComponentDataSource}
                        componentProps={{
                            version: veri.version,
                            reduxStore: navigateCases(reduxStore, "override.source_code"),
                            keyPrefix: 'source_code',
                            tagPrefix: '',
                            parentName: 'Source Code',
                            fileName: 'Code file',
                            inlineStringType: FieldTypes.Lua,
                            id: `source_code_0`,
                        }}
                    />
                </Col>
            </Row>
        </>
    );
}

export default React.memo(ComponentLuaPerRoute);