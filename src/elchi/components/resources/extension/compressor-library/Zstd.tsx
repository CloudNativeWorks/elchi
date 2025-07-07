import React from "react";
import { useLocation } from "react-router-dom";
import { Col, Row, Divider } from "antd";
import { HeadOfResource } from "@/elchi/components/common/HeadOfResources";
import { GTypes } from "@/common/statics/gtypes";
import { useGTypeFields } from "@/hooks/useGtypes";
import { FieldConfigType, startsWithAny } from "@/utils/tools";
import CommonComponentSingleOptions from "@elchi/components/resources/common/SingleOptions/SingleOptions";
import CommonComponentDataSource from "@elchi/components/resources/common/DataSource/DataSource";
import useResourceMain from "@/hooks/useResourceMain";
import CustomAnchor from "@/elchi/components/common/CustomAnchor";
import { useModels } from "@/hooks/useModels";
import { useTags } from "@/hooks/useTags";
import { modtag_zstd } from "./_modtag_";
import { generateFields } from "@/common/generate-fields";
import RenderLoading from "@/elchi/components/common/Loading";
import { useLoading } from "@/hooks/loadingContext";
import { useManagedLoading } from "@/hooks/useManageLoading";
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

const ComponentZstd: React.FC<GeneralProps> = ({ veri }) => {
    const GType = useGTypeFields(GTypes.ZstdCompressor);
    const location = useLocation();
    const { vModels, loading_m } = useModels(veri.version, modtag_zstd);
    const { vTags, loading } = useTags(veri.version, modtag_zstd);
    const { loadingCount } = useLoading();
    const { reduxStore, selectedTags, handleChangeTag } = useResourceMain({
        version: veri.version,
        alias: "z",
        vModels,
        vTags,
        modelName: "Zstd",
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.z?.Zstd,
            sf: vTags.z?.Zstd_SingleFields,
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
                    changeGeneralName={veri.changeGeneralName}
                    version={veri.version}
                    locationCheck={GType.createPath === location.pathname}
                    createUpdate={{
                        location_path: location.pathname,
                        GType: GType,
                        offset: 0,
                        name: veri.generalName,
                        reduxStore: reduxStore,
                        voidToJSON: vModels.z?.Zstd.toJSON,
                        queryResource: veri.queryResource,
                        envoyVersion: veri.version,
                        gtype: reduxStore?.$type,
                    }}
                />
                <Divider type="horizontal" orientation="left" orientationMargin="0">Zstd Compressor</Divider>
                <Row>
                    <Col md={4}>
                        <CustomAnchor
                            resourceConfKeys={vTags.z?.Zstd}
                            singleOptionKeys={vTags.z?.Zstd_SingleFields}
                            selectedTags={selectedTags}
                            index={0}
                            handleChangeTag={handleChangeTag}
                            tagMatchPrefix={"Zstd"}
                            required={[]}
                        />
                    </Col>
                    <Col md={20}>
                        <ConditionalComponent
                            shouldRender={selectedTags?.some(item => vTags.z?.Zstd_SingleFields?.includes(item))}
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
                            shouldRender={startsWithAny("dictionary", selectedTags)}
                            Component={CommonComponentDataSource}
                            componentProps={{
                                version: veri.version,
                                reduxStore: reduxStore?.dictionary,
                                keyPrefix: `dictionary`,
                                tagPrefix: `dictionary`,
                                parentName: 'Dictionary',
                                fileName: 'Dictionary file',
                                unsuportedTags: ['inline_bytes', 'inline_string', 'environment_variable'],
                                id: `dictionary_0`,
                            }}
                        />
                    </Col>
                </Row>
            </>
        )
    )
}

export default React.memo(ComponentZstd);
