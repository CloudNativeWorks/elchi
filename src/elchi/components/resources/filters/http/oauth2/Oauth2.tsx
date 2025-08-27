import React from "react";
import { useLocation } from "react-router-dom";
import { Col, Row, Divider } from "antd";
import { HeadOfResource } from "@/elchi/components/common/HeadOfResources";
import CustomAnchor from "@/elchi/components/common/CustomAnchor";
import { GTypes } from "@/common/statics/gtypes";
import { useGTypeFields } from "@/hooks/useGtypes";
import useResourceMain from "@/hooks/useResourceMain";
import RenderLoading from "@/elchi/components/common/Loading";
import { useModels } from "@/hooks/useModels";
import { useTags } from "@/hooks/useTags";
import { modtag_oauth2 } from "./_modtag_";
import { useLoading } from "@/hooks/loadingContext";
import { useManagedLoading } from "@/hooks/useManageLoading";
import ComponentOAuth2Config from "./Oauth2Config";
import { startsWithAny } from "@/utils/tools";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";


type GeneralProps = {
    veri: {
        version: string;
        queryResource: any;
        generalName: string;
        changeGeneralName: any;
    }
};

const ComponentOAuth2: React.FC<GeneralProps> = ({ veri }) => {
    const GType = useGTypeFields(GTypes.OAuth2);
    const location = useLocation();
    const { vModels, loading_m } = useModels(veri.version, modtag_oauth2);
    const { vTags, loading } = useTags(veri.version, modtag_oauth2);
    const { loadingCount } = useLoading();
    const { reduxStore, selectedTags, handleChangeTag } = useResourceMain({
        version: veri.version,
        alias: "o",
        vModels,
        vTags,
        modelName: "OAuth2",
    });

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
                    voidToJSON: vModels.o?.OAuth2.toJSON,
                    queryResource: veri.queryResource,
                    envoyVersion: veri.version,
                    gtype: GTypes.OAuth2,
                }}
            />
            <Divider type="horizontal" orientation="left" orientationMargin="0">OAuth2</Divider>
            <Row>
                <Col md={4}>
                    <CustomAnchor
                        resourceConfKeys={vTags.o?.OAuth2}
                        selectedTags={selectedTags}
                        index={0}
                        handleChangeTag={handleChangeTag}
                        required={["config"]}
                    />
                </Col>
                <Col md={20}>
                    <ConditionalComponent
                        shouldRender={startsWithAny("config", selectedTags)}
                        Component={ComponentOAuth2Config}
                        componentProps={{
                            version: veri.version,
                            reduxStore: reduxStore?.config,
                            keyPrefix: `config`,
                            title: "Config",
                            id: `config_0`,
                        }}
                    />
                </Col>
            </Row>
        </>
    );
}

export default React.memo(ComponentOAuth2);