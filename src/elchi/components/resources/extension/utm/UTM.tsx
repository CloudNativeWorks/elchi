import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@redux/store";
import { Col, Row, Divider } from "antd";
import { HeadOfResource } from "@/elchi/components/common/HeadOfResources";
import { useGTypeFields } from "@/hooks/useGtypes";
import { GTypes } from "@/common/statics/gtypes";
import { FieldConfigType } from "@/utils/tools";
import useResourceForm from "@/hooks/useResourceForm";
import CustomAnchor from "@/elchi/components/common/CustomAnchor";
import CommonComponentSingleOptions from "@/elchi/components/resources/common/SingleOptions/SingleOptions";
import { useModels } from "@/hooks/useModels";
import { useTags } from "@/hooks/useTags";
import { modtag_uri_template_match } from "./_modtag_";
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
        changeGeneralName: any,
    }
};

const ComponentUTM: React.FC<GeneralProps> = ({ veri }) => {
    const GType = useGTypeFields(GTypes.UTM);
    const location = useLocation();
    const { vModels, loading_m } = useModels(veri.version, modtag_uri_template_match);
    const { vTags, loading } = useTags(veri.version, modtag_uri_template_match);
    const { loadingCount } = useLoading();
    const memoReduxStore = useSelector((state: RootState) => state.VersionedResources[veri.version].Resource);
    const reduxStore = useMemo(() => {
        return vModels.utm?.UriTemplateMatchConfig.fromJSON(memoReduxStore);
    }, [memoReduxStore, vModels]);

    const { selectedTags, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.utm?.UriTemplateMatchConfig,
            sf: vTags.utm?.UriTemplateMatchConfig_SingleFields,
            r: ["path_template"],
            sn: 24
        })
    ];

    useManagedLoading(loading, loading_m);
    if (loadingCount > 0) {
        return <RenderLoading checkPage={true} isLoadingQuery={!vModels || !vTags || loading} error={""} />;
    }

    if (Array.isArray(vTags.utm?.UriTemplateMatchConfig) && vTags.utm.UriTemplateMatchConfig.length > 0) {
        vTags.utm.UriTemplateMatchConfig[0].comment = `
If specified, the route is a template match rule meaning that the \`:path\` header (without the query string) must match the given \`path_template\` pattern.

Path template matching types:

* \`*\` : Matches a single path component, up to the next path separator: /

* \`**\` : Matches zero or more path segments. If present, must be the last operator.

* \`{name} or {name=*}\` :  A named variable matching one path segment up to the next path separator: /.

* \`{name=videos/*}\` : A named variable matching more than one path segment.
     The path component matching videos/* is captured as the named variable.

* \`{name=**}\` : A named variable matching zero or more path segments.


For example:

* \`/videos/*/*/*.m4s\` would match \`videos/123414/hls/1080p5000_00001.m4s\`

* \`/videos/{file}\` would match \`/videos/1080p5000_00001.m4s\`

* \`/**.mpd\` would match \`/content/123/india/dash/55/manifest.mpd\`
`
    }

    return (
        reduxStore && (
            <>
                <HeadOfResource
                    generalName={veri.generalName}
                    version={veri.version}
                    changeGeneralName={veri.changeGeneralName}
                    locationCheck={GType.createPath === location.pathname}
                    createUpdate={{
                        location_path: location.pathname,
                        GType: GType,
                        offset: 0,
                        name: veri.generalName,
                        reduxStore: reduxStore,
                        voidToJSON: vModels.utm?.UriTemplateMatchConfig.toJSON,
                        queryResource: veri.queryResource,
                        envoyVersion: veri.version,
                        gtype: reduxStore?.$type,
                    }}
                />
                <Divider type="horizontal" orientation="left" orientationMargin="0">Uri Template Match</Divider>
                <Row>
                    <Col md={4} style={{ display: "block", maxHeight: "auto", overflowY: "auto" }}>
                        <CustomAnchor
                            resourceConfKeys={vTags.utm?.UriTemplateMatchConfig}
                            singleOptionKeys={vTags.utm?.UriTemplateMatchConfig_SingleFields}
                            selectedTags={selectedTags}
                            handleChangeTag={handleChangeTag}
                            required={"path_template"}
                        />
                    </Col>
                    <Col md={20}>
                        <ConditionalComponent
                            shouldRender={selectedTags?.some(item => vTags.utm?.UriTemplateMatchConfig_SingleFields?.includes(item))}
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
    )
}

export default React.memo(ComponentUTM);