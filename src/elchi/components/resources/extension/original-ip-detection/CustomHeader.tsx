import React from "react";
import { useLocation } from "react-router-dom";
import { Col, Row, Divider } from "antd";
import { HeadOfResource } from "@/elchi/components/common/HeadOfResources";
import CustomAnchor from "@/elchi/components/common/CustomAnchor";
import { GTypes } from "@/common/statics/gtypes";
import { useGTypeFields } from "@/hooks/useGtypes";
import CommonComponentSingleOptions from "@elchi/components/resources/common/SingleOptions/SingleOptions";
import { FieldConfigType, matchesEndOrStartOf } from "@/utils/tools";
import CommonComponentHttpStatus from "@/elchi/components/resources/common/HttpStatus/http_status";
import useResourceMain from "@/hooks/useResourceMain";
import { useModels } from "@/hooks/useModels";
import { useTags } from "@/hooks/useTags";
import { modtag_custom_header } from "./_modtag_";
import RenderLoading from "@/elchi/components/common/Loading";
import { generateFields } from "@/common/generate-fields";
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

const ComponentCustomHeader: React.FC<GeneralProps> = ({ veri }) => {
    const GType = useGTypeFields(GTypes.CustomHeaderOriginalIPDetection);
    const location = useLocation();
    const { vModels, loading_m } = useModels(veri.version, modtag_custom_header);
    const { vTags, loading } = useTags(veri.version, modtag_custom_header);
    const { loadingCount } = useLoading();
    const { reduxStore, selectedTags, handleChangeTag } = useResourceMain({
        version: veri.version,
        alias: "ch",
        vModels,
        vTags,
        modelName: "CustomHeaderConfig",
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.ch?.CustomHeaderConfig,
            sf: vTags.ch?.CustomHeaderConfig_SingleFields,
        })
    ];

    useManagedLoading(loading, loading_m);
    if (loadingCount > 0) {
        return <RenderLoading checkPage={true} isLoadingQuery={!vModels || !vTags || loading} error={""} />;
    }

    return (
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
                    voidToJSON: vModels.ch?.CustomHeaderConfig.toJSON,
                    queryResource: veri.queryResource,
                    envoyVersion: veri.version,
                    gtype: reduxStore?.$type,
                }}
            />
            <Divider type="horizontal" orientation="left" orientationMargin="0">Custom Header Original IP Detection</Divider>
            <Row>
                <Col md={4} style={{ display: "block", maxHeight: "auto", overflowY: "auto" }}>
                    <CustomAnchor
                        resourceConfKeys={vTags.ch?.CustomHeaderConfig}
                        singleOptionKeys={vTags.ch?.CustomHeaderConfig_SingleFields}
                        selectedTags={selectedTags}
                        index={0}
                        handleChangeTag={handleChangeTag}
                        tagMatchPrefix={"CustomHeaderConfig"}
                        required={["header_name"]}
                    />
                </Col>
                <Col md={20}>
                    <ConditionalComponent
                        shouldRender={selectedTags?.some(item => vTags.ch?.CustomHeaderConfig_SingleFields?.includes(item))}
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
                        shouldRender={matchesEndOrStartOf("reject_with_status", selectedTags)}
                        Component={CommonComponentHttpStatus}
                        componentProps={{
                            version: veri.version,
                            reduxStore: reduxStore?.reject_with_status,
                            keyPrefix: "reject_with_status",
                            title: "Reject With Status",
                        }}
                    />
                </Col>
            </Row>
        </>
    )
}

export default React.memo(ComponentCustomHeader);
