import React from "react";
import { useLocation } from "react-router-dom";
import { Col, Row, Divider } from "antd";
import { HeadOfResource } from "@/elchi/components/common/HeadOfResources";
import CustomAnchor from "@/elchi/components/common/CustomAnchor";
import { GTypes } from "@/common/statics/gtypes";
import { useGTypeFields } from "@/hooks/useGtypes";
import useResourceMain from "@/hooks/useResourceMain";
import { useModels } from "@/hooks/useModels";
import { useTags } from "@/hooks/useTags";
import RenderLoading from "@/elchi/components/common/Loading";
import { modtag_rbac_per_route } from "./_modtag_";
import { useLoading } from "@/hooks/loadingContext";
import { useManagedLoading } from "@/hooks/useManageLoading";
import { startsWithAny } from "@/utils/tools";
import ComponentRbacIn from "./RbacInside";
import { navigateCases } from "@/elchi/helpers/navigate-cases";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";


type GeneralProps = {
    veri: {
        version: string;
        queryResource: any;
        generalName: string;
        changeGeneralName: any;
    }
};

const ComponentRBACPerRoute: React.FC<GeneralProps> = ({ veri }) => {
    const GType = useGTypeFields(GTypes.HttpRBACPerRoute);
    const location = useLocation();
    const { vModels, loading_m } = useModels(veri.version, modtag_rbac_per_route);
    const { vTags, loading } = useTags(veri.version, modtag_rbac_per_route);
    const { loadingCount } = useLoading();
    const { reduxStore, selectedTags, handleChangeTag } = useResourceMain({
        version: veri.version,
        alias: "rpr",
        vModels,
        vTags,
        modelName: "RBACPerRoute",
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
                    voidToJSON: vModels.rpr?.RBACPerRoute.toJSON,
                    queryResource: veri.queryResource,
                    envoyVersion: veri.version,
                    gtype: reduxStore?.$type,
                }}
            />
            <Divider type="horizontal" orientation="left" orientationMargin="0">Http RBAC Per Route</Divider>
            <Row>
                <Col md={4} style={{ display: "block", maxHeight: "auto", overflowY: "auto" }}>
                    <CustomAnchor
                        resourceConfKeys={vTags.rpr?.RBACPerRoute}
                        singleOptionKeys={[]}
                        selectedTags={selectedTags}
                        index={0}
                        handleChangeTag={handleChangeTag}
                        tagMatchPrefix={"RBACPerRoute"}
                    />
                </Col>
                <Col md={20}>
                    <ConditionalComponent
                        shouldRender={startsWithAny("rbac", selectedTags)}
                        Component={ComponentRbacIn}
                        componentProps={{
                            version: veri.version,
                            reduxStore: navigateCases(reduxStore, "rbac"),
                            keyPrefix: `rbac`,
                            id: `rbac_0`,
                        }}
                    />
                </Col>
            </Row>
        </>
    );
}

export default React.memo(ComponentRBACPerRoute);
