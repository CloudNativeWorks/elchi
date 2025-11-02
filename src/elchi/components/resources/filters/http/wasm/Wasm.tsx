import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Col, Row, Divider } from "antd";
import { HeadOfResource } from "@/elchi/components/common/HeadOfResources";
import CustomAnchor from "@/elchi/components/common/CustomAnchor";
import { GTypes } from "@/common/statics/gtypes";
import { useGTypeFields } from "@/hooks/useGtypes";
import useResourceMain from "@/hooks/useResourceMain";
import { useModels } from "@/hooks/useModels";
import RenderLoading from "@/elchi/components/common/Loading";
import { useTags } from "@/hooks/useTags";
import { modtag_wasm } from "./_modtag_";
import { useLoading } from "@/hooks/loadingContext";
import { useManagedLoading } from "@/hooks/useManageLoading";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";
import { matchesEndOrStartOf } from "@/utils/tools";
import ComponentConfig from "./Config";
import { useQuery } from "@tanstack/react-query";
import { wafApi } from "@/pages/waf/wafApi";
import { useProjectVariable } from "@/hooks/useProjectVariable";

type GeneralProps = {
    veri: {
        version: string;
        queryResource: any;
        generalName: string;
        changeGeneralName: any;
    }
};

const ComponentHttpWasm: React.FC<GeneralProps> = ({ veri }) => {
    const GType = useGTypeFields(GTypes.HttpWasm);
    const location = useLocation();
    const { project } = useProjectVariable();
    const { vModels, loading_m } = useModels(veri.version, modtag_wasm);
    const { vTags, loading } = useTags(veri.version, modtag_wasm);
    const { loadingCount } = useLoading();
    const { reduxStore, selectedTags, handleChangeTag } = useResourceMain({
        version: veri.version,
        alias: "wsm",
        vModels,
        vTags,
        modelName: "Wasm",
    });

    // WAF config state
    const [generalWaf, setGeneralWaf] = useState<string>("");

    // Fetch WAF configs
    const { data: wafConfigs } = useQuery({
        queryKey: ['waf-configs-list', project],
        queryFn: () => wafApi.getWafConfigs({ project }),
        enabled: !!project
    });

    // Initialize WAF from queryResource
    useEffect(() => {
        if (veri.queryResource?.general?.waf) {
            setGeneralWaf(veri.queryResource.general.waf);
        }
    }, [veri.queryResource]);

    useManagedLoading(loading, loading_m);
    if (loadingCount > 0) {
        return <RenderLoading checkPage={true} isLoadingQuery={!vModels || !vTags || loading} error={""} />;
    }

    const handleWafChange = (wafName: string) => {
        console.log('WAF changed to:', wafName);
        setGeneralWaf(wafName);
    };

    console.log('Current generalWaf state:', generalWaf);

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
                        voidToJSON: vModels.wsm?.Wasm.toJSON,
                        queryResource: veri.queryResource,
                        envoyVersion: veri.version,
                        gtype: reduxStore?.$type,
                    }}
                    wafConfig={generalWaf}
                    changeWafConfig={handleWafChange}
                    wafConfigs={wafConfigs?.map(cfg => ({ name: cfg.name, id: cfg.id }))}
                />
                <Divider type="horizontal" orientation="left" orientationMargin="0">HTTP Wasm</Divider>
                <Row>
                    <Col md={4} style={{ display: "block", maxHeight: "auto", overflowY: "auto" }}>
                        <CustomAnchor
                            resourceConfKeys={vTags.wsm?.Wasm}
                            unsuportedTags={[]}
                            singleOptionKeys={[]}
                            selectedTags={selectedTags}
                            index={0}
                            handleChangeTag={handleChangeTag}
                            tagMatchPrefix={"Wasm"}
                        />
                    </Col>
                    <Col md={20}>
                        <ConditionalComponent
                            shouldRender={matchesEndOrStartOf("config", selectedTags)}
                            Component={ComponentConfig}
                            componentProps={{
                                version: veri.version,
                                reduxStore: reduxStore?.config,
                                keyPrefix: `config`,
                                title: "Config",
                                wafSelected: !!generalWaf,
                            }}
                        />
                    </Col>
                </Row>
            </>
        )
    );
}

export default React.memo(ComponentHttpWasm);