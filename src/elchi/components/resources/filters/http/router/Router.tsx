import React from "react";
import { useLocation } from "react-router-dom";
import { Col, Row, Divider } from "antd";
import { HeadOfResource } from "@/elchi/components/common/HeadOfResources";
import CommonComponentSingleOptions from "@/elchi/components/resources/common/SingleOptions/SingleOptions";
import CustomAnchor from "@/elchi/components/common/CustomAnchor";
import { GTypes } from "@/common/statics/gtypes";
import { useGTypeFields } from "@/hooks/useGtypes";
import useResourceMain from "@/hooks/useResourceMain";
import { FieldConfigType } from "@/utils/tools";
import { useModels } from "@/hooks/useModels";
import RenderLoading from "@/elchi/components/common/Loading";
import { useTags } from "@/hooks/useTags";
import { modtag_router, modtag_us_router } from "./_modtag_";
import { generateFields } from "@/common/generate-fields";
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

const ComponentHttpRouter: React.FC<GeneralProps> = ({ veri }) => {
    const GType = useGTypeFields(GTypes.Router);
    const location = useLocation();
    const { vModels, loading_m } = useModels(veri.version, modtag_router);
    const { vTags, loading } = useTags(veri.version, modtag_router);
    const { loadingCount } = useLoading();
    const { reduxStore, selectedTags, handleChangeTag } = useResourceMain({
        version: veri.version,
        alias: "rtr",
        vModels,
        vTags,
        modelName: "Router",
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.rtr?.Router,
            sf: vTags.rtr?.Router_SingleFields,
        }),
    ];

    useManagedLoading(loading, loading_m);
    if (loadingCount > 0) {
        return <RenderLoading checkPage={true} isLoadingQuery={!vModels || !vTags || loading} error={""} />;
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
                        voidToJSON: vModels.rtr?.Router.toJSON,
                        queryResource: veri.queryResource,
                        envoyVersion: veri.version,
                        gtype: reduxStore?.$type,
                    }}
                />
                <Divider type="horizontal" orientation="left" orientationMargin="0">HTTP Router</Divider>
                <Row>
                    <Col md={4} style={{ display: "block", maxHeight: "auto", overflowY: "auto" }}>
                        <CustomAnchor
                            resourceConfKeys={vTags.rtr?.Router}
                            unsuportedTags={modtag_us_router["HttpRouter"]}
                            singleOptionKeys={vTags.rtr?.Router_SingleFields}
                            selectedTags={selectedTags}
                            index={0}
                            handleChangeTag={handleChangeTag}
                            tagMatchPrefix={"Router"}
                        />
                    </Col>
                    <Col md={20}>
                        <ConditionalComponent
                            shouldRender={selectedTags?.some(item => vTags.rtr?.Router_SingleFields.includes(item))}
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

export default React.memo(ComponentHttpRouter);