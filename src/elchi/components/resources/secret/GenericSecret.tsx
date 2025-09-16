import React from "react";
import { useLocation } from "react-router-dom";
import { Col, Row, Divider } from "antd";
import { HeadOfResource } from "@/elchi/components/common/HeadOfResources";
import { startsWithAny } from "@/utils/tools";
import CustomAnchor from "@/elchi/components/common/CustomAnchor";
import CommonComponentDataSource from "../common/DataSource/DataSource";
import { GTypes } from "@/common/statics/gtypes";
import { useGTypeFields } from "@/hooks/useGtypes";
import useResourceMain from "@/hooks/useResourceMain";
import { useModels } from "@/hooks/useModels";
import { useTags } from "@/hooks/useTags";
import { modtag_generic_secret } from "./_modtag_";
import RenderLoading from "../../common/Loading";
import { useLoading } from "@/hooks/loadingContext";
import { useManagedLoading } from "@/hooks/useManageLoading";
import { ConditionalComponent } from "../../common/ConditionalComponent";


type GeneralProps = {
    veri: {
        version: string;
        gtype: string;
        queryResource: any;
        generalName: string;
        changeGeneralName: any;
    }
};

const ComponentGenericSecret: React.FC<GeneralProps> = ({ veri }) => {
    const GType = useGTypeFields(GTypes.GenericSecret);
    const location = useLocation();
    const { vModels, loading_m } = useModels(veri.version, modtag_generic_secret);
    const { vTags, loading } = useTags(veri.version, modtag_generic_secret);
    const { loadingCount } = useLoading();
    const { reduxStore, selectedTags, handleChangeTag } = useResourceMain({
        version: veri.version,
        alias: "gs",
        vModels,
        vTags,
        modelName: "GenericSecret",
    });

    useManagedLoading(loading, loading_m);
    if (loadingCount > 0) {
        return <RenderLoading checkPage={true} isLoadingQuery={!vModels || !vTags || loading} error={""} />;
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
                        voidToJSON: vModels.gs?.GenericSecret.toJSON,
                        queryResource: veri.queryResource,
                        envoyVersion: veri.version,
                        gtype: reduxStore?.$type,
                    }}
                />
                <Divider type="horizontal" orientation="left" orientationMargin="0">Generic Secret</Divider>
                <Row>
                    <Col md={4} style={{ display: "block", maxHeight: "auto", overflowY: "auto" }}>
                        <CustomAnchor
                            resourceConfKeys={vTags.gs?.GenericSecret}
                            singleOptionKeys={[]}
                            selectedTags={selectedTags}
                            index={0}
                            handleChangeTag={handleChangeTag}
                            required={[]}
                        />
                    </Col>
                    <Col md={20}>
                        <ConditionalComponent
                            shouldRender={startsWithAny("secret", selectedTags)}
                            Component={CommonComponentDataSource}
                            componentProps={{
                                version: veri.version,
                                parentName: 'Secret',
                                reduxStore: reduxStore?.secret,
                                keyPrefix: `secret`,
                                tagPrefix: ``,
                                fileName: 'Secret file',
                                id: `secret_0`,
                            }}
                        />
                    </Col>
                </Row>
            </>
        )
    )
}

export default React.memo(ComponentGenericSecret);
