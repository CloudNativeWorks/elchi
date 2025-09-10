import React from "react";
import { useLocation } from "react-router-dom";
import { Col, Row, Divider } from "antd";
import { HeadOfResource } from "@/elchi/components/common/HeadOfResources";
import CommonComponentSingleOptions from "@/elchi/components/resources/common/SingleOptions/SingleOptions";
import CustomAnchor from "@/elchi/components/common/CustomAnchor";
import { GTypes } from "@/common/statics/gtypes";
import { useGTypeFields } from "@/hooks/useGtypes";
import { FieldConfigType, startsWithAny } from "@/utils/tools";
import CommonComponentDataSource from "@resources/common/DataSource/DataSource";
import useResourceMain from "@/hooks/useResourceMain";
import { generateFields } from "@/common/generate-fields";
import RenderLoading from "@/elchi/components/common/Loading";
import { useModels } from "@/hooks/useModels";
import { useTags } from "@/hooks/useTags";
import { modtag_lua } from "./_modtag_";
import { useLoading } from "@/hooks/loadingContext";
import { useManagedLoading } from "@/hooks/useManageLoading";
import ComponentSourceCodes from "./SourceCodes";
import { ResourceAction } from "@/redux/reducers/slice";
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

const ComponentLua: React.FC<GeneralProps> = ({ veri }) => {
    const GType = useGTypeFields(GTypes.Lua);
    const location = useLocation();
    const { vModels, loading_m } = useModels(veri.version, modtag_lua);
    const { vTags, loading } = useTags(veri.version, modtag_lua);
    const { loadingCount } = useLoading();
    const { reduxStore, selectedTags, handleChangeTag } = useResourceMain({
        version: veri.version,
        alias: "lua",
        vModels,
        vTags,
        modelName: "Lua",
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.lua?.Lua,
            sf: vTags.lua?.Lua_SingleFields,
        })
    ];

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
                        voidToJSON: vModels.lua?.Lua.toJSON,
                        queryResource: veri.queryResource,
                        envoyVersion: veri.version,
                        gtype: reduxStore?.$type,
                    }}
                />
                <Divider type="horizontal" orientation="left" orientationMargin="0">Lua</Divider>
                <Row>
                    <Col md={4}>
                        <CustomAnchor
                            resourceConfKeys={vTags.lua?.Lua}
                            unsuportedTags={["inline_code"]}
                            singleOptionKeys={vTags.lua?.Lua_SingleFields}
                            selectedTags={selectedTags}
                            index={0}
                            handleChangeTag={handleChangeTag}
                            tagMatchPrefix={"Lua"}
                        />
                    </Col>
                    <Col md={20}>
                        <ConditionalComponent
                            shouldRender={startsWithAny("source_codes", selectedTags)}
                            Component={ComponentSourceCodes}
                            componentProps={{
                                version: veri.version,
                                reduxStore: reduxStore?.source_codes,
                                keyPrefix: 'source_codes',
                                reduxAction: ResourceAction,
                                id: `source_codes_0`,
                            }}
                        />
                        <ConditionalComponent
                            shouldRender={startsWithAny("default_source_code", selectedTags)}
                            Component={CommonComponentDataSource}
                            componentProps={{
                                version: veri.version,
                                reduxStore: reduxStore?.default_source_code,
                                keyPrefix: 'default_source_code',
                                tagPrefix: '',
                                parentName: 'Default Source Code',
                                fileName: 'Code file',
                                inlineStringType: FieldTypes.Lua,
                                id: `default_source_code_0`,
                            }}
                        />
                        <ConditionalComponent
                            shouldRender={selectedTags?.some(item => vTags.lua?.Lua_SingleFields?.includes(item))}
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
    );
}

export default React.memo(ComponentLua);