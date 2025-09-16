import React from "react";
import { useLocation } from "react-router-dom";
import { Col, Row, Divider } from "antd";
import { HeadOfResource } from "@/elchi/components/common/HeadOfResources";
import CustomAnchor from "@/elchi/components/common/CustomAnchor";
import { GTypes } from "@/common/statics/gtypes";
import { useGTypeFields } from "@/hooks/useGtypes";
import { FieldConfigType, startsWithAny } from "@/utils/tools";
import ComponentRequestDirectionConfig from "./RequestDirectionConfig";
import CommonComponentSingleOptions from "@/elchi/components/resources/common/SingleOptions/SingleOptions";
import ComponentResponseDirectionConfig from "./ResponseDirectionConfig";
import useResourceMain from "@/hooks/useResourceMain";
import ComponentCompressorLibrary from "./CompressorLibrary";
import { useModels } from "@/hooks/useModels";
import { useTags } from "@/hooks/useTags";
import { modtag_compressor, modtag_us_compressor } from "./_modtag_";
import { generateFields } from "@/common/generate-fields";
import RenderLoading from "@/elchi/components/common/Loading";
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

const ComponentCompressor: React.FC<GeneralProps> = ({ veri }) => {
    const GType = useGTypeFields(GTypes.Compressor);
    const location = useLocation();
    const { vModels, loading_m } = useModels(veri.version, modtag_compressor);
    const { vTags, loading } = useTags(veri.version, modtag_compressor);
    const { loadingCount } = useLoading();
    const { reduxStore, selectedTags, handleChangeTag } = useResourceMain({
        version: veri.version,
        alias: "cmp",
        vModels,
        vTags,
        modelName: "Compressor",
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.cmp?.Compressor,
            sf: vTags.cmp?.Compressor_SingleFields,
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
                        voidToJSON: vModels.cmp?.Compressor.toJSON,
                        queryResource: veri.queryResource,
                        envoyVersion: veri.version,
                        gtype: reduxStore?.$type,
                    }}
                />
                <Divider type="horizontal" orientation="left" orientationMargin="0">Compressor</Divider>
                <Row>
                    <Col md={4} style={{ display: "block", maxHeight: "auto", overflowY: "auto" }}>
                        <CustomAnchor
                            resourceConfKeys={vTags.cmp?.Compressor}
                            unsuportedTags={modtag_us_compressor["Compressor"]}
                            singleOptionKeys={vTags.cmp?.Compressor_SingleFields}
                            selectedTags={selectedTags}
                            index={0}
                            handleChangeTag={handleChangeTag}
                            tagMatchPrefix={"Compressor"}
                        />
                    </Col>
                    <Col md={20}>
                        <ConditionalComponent
                            shouldRender={startsWithAny("compressor_library", selectedTags)}
                            Component={ComponentCompressorLibrary}
                            componentProps={{
                                version: veri.version,
                                reduxStore: reduxStore?.compressor_library,
                                keyPrefix: 'compressor_library',
                                id: `compressor_library_0`,
                            }}
                        />
                        <ConditionalComponent
                            shouldRender={startsWithAny("request_direction_config", selectedTags)}
                            Component={ComponentRequestDirectionConfig}
                            componentProps={{
                                version: veri.version,
                                reduxStore: reduxStore?.request_direction_config,
                                keyPrefix: 'request_direction_config',
                                tagMatchPrefix: 'Compressor.request_direction_config',
                                title: 'Request Direction Config',
                                id: `request_direction_config_0`,
                            }}
                        />
                        <ConditionalComponent
                            shouldRender={startsWithAny("response_direction_config", selectedTags)}
                            Component={ComponentResponseDirectionConfig}
                            componentProps={{
                                version: veri.version,
                                reduxStore: reduxStore?.response_direction_config,
                                keyPrefix: 'response_direction_config',
                                tagMatchPrefix: 'Compressor.response_direction_config',
                                title: 'Response Direction Config',
                                id: `response_direction_config_0`,
                            }}
                        />
                        <ConditionalComponent
                            shouldRender={selectedTags?.some(item => vTags.cmp?.Compressor_SingleFields?.includes(item))}
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

export default React.memo(ComponentCompressor);