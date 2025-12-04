import React from "react";
import { useLocation } from "react-router-dom";
import { Col, Row, Divider } from "antd";
import { HeadOfResource } from "@/elchi/components/common/HeadOfResources";
import CustomAnchor from "@/elchi/components/common/CustomAnchor";
import { GTypes } from "@/common/statics/gtypes";
import { useGTypeFields } from "@/hooks/useGtypes";
import CommonComponentSingleOptions from "@elchi/components/resources/common/SingleOptions/SingleOptions";
import { FieldConfigType } from "@/utils/tools";
import useResourceMain from "@/hooks/useResourceMain";
import { useModels } from "@/hooks/useModels";
import { useTags } from "@/hooks/useTags";
import { modtag_uri_template_rewriter } from "./_modtag_";
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

const ComponentUriTemplateRewriter: React.FC<GeneralProps> = ({ veri }) => {
    const GType = useGTypeFields(GTypes.UriTemplateRewriter);
    const location = useLocation();
    const { vModels, loading_m } = useModels(veri.version, modtag_uri_template_rewriter);
    const { vTags, loading } = useTags(veri.version, modtag_uri_template_rewriter);
    const { loadingCount } = useLoading();
    const { reduxStore, selectedTags, handleChangeTag } = useResourceMain({
        version: veri.version,
        alias: "utr",
        vModels,
        vTags,
        modelName: "UriTemplateRewriteConfig",
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.utr?.UriTemplateRewriteConfig,
            sf: vTags.utr?.UriTemplateRewriteConfig_SingleFields,
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
                    voidToJSON: vModels.utr?.UriTemplateRewriteConfig.toJSON,
                    queryResource: veri.queryResource,
                    envoyVersion: veri.version,
                    gtype: reduxStore?.$type,
                }}
            />
            <Divider type="horizontal" orientation="left" orientationMargin="0">URI Template Rewriter</Divider>
            <Row>
                <Col md={4} style={{ display: "block", maxHeight: "auto", overflowY: "auto" }}>
                    <CustomAnchor
                        resourceConfKeys={vTags.utr?.UriTemplateRewriteConfig}
                        singleOptionKeys={vTags.utr?.UriTemplateRewriteConfig_SingleFields}
                        selectedTags={selectedTags}
                        index={0}
                        handleChangeTag={handleChangeTag}
                        tagMatchPrefix={"UriTemplateRewriteConfig"}
                        required={["path_template_rewrite"]}
                    />
                </Col>
                <Col md={20}>
                    <ConditionalComponent
                        shouldRender={selectedTags?.some(item => vTags.utr?.UriTemplateRewriteConfig_SingleFields?.includes(item))}
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
}

export default React.memo(ComponentUriTemplateRewriter);
