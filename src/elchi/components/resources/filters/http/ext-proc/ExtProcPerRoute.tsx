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
import { modtag_ext_proc_per_route } from "./_modtag_";
import { useLoading } from "@/hooks/loadingContext";
import { useManagedLoading } from "@/hooks/useManageLoading";
import { FieldConfigType, startsWithAny } from "@/utils/tools";
import { generateFields } from "@/common/generate-fields";
import CommonComponentSingleOptions from "@/elchi/components/resources/common/SingleOptions/SingleOptions";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";
import ComponentExtProcOverrides from "./ExtProcOverrides/ExtProcOverrides";
import { ResourceAction } from "@/redux/reducers/slice";


type GeneralProps = {
    veri: {
        version: string;
        queryResource: any;
        generalName: string;
        changeGeneralName: any;
    }
};

const ComponentExtProcPerRoute: React.FC<GeneralProps> = ({ veri }) => {
    const GType = useGTypeFields(GTypes.HttpExtProcPerRoute);
    const location = useLocation();
    const { vModels, loading_m } = useModels(veri.version, modtag_ext_proc_per_route);
    const { vTags, loading } = useTags(veri.version, modtag_ext_proc_per_route);
    const { loadingCount } = useLoading();
    const { reduxStore, selectedTags, handleChangeTag } = useResourceMain({
        version: veri.version,
        alias: "eppr",
        vModels,
        vTags,
        modelName: "ExtProcPerRoute",
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.eppr?.ExtProcPerRoute,
            sf: vTags.eppr?.ExtProcPerRoute_SingleFields,
        }),
    ];

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
                    voidToJSON: vModels.eppr?.ExtProcPerRoute.toJSON,
                    queryResource: veri.queryResource,
                    envoyVersion: veri.version,
                    gtype: reduxStore?.$type,
                }}
            />
            <Divider type="horizontal" orientation="left" orientationMargin="0">Http External Processor Per Route</Divider>
            <Row>
                <Col md={4} style={{ display: "block", maxHeight: "auto", overflowY: "auto" }}>
                    <CustomAnchor
                        resourceConfKeys={vTags.eppr?.ExtProcPerRoute}
                        singleOptionKeys={vTags.eppr?.ExtProcPerRoute_SingleFields}
                        selectedTags={selectedTags}
                        index={0}
                        handleChangeTag={handleChangeTag}
                        tagPrefix={"override"}
                        onlyOneTag={[["override.overrides", "override.disabled"]]}
                    />
                </Col>
                <Col md={20}>
                    <ConditionalComponent
                        shouldRender={selectedTags?.some(item => vTags.eppr?.ExtProcPerRoute_SingleFields?.includes(item))}
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
                        shouldRender={startsWithAny("override.overrides", selectedTags) || startsWithAny("overrides", selectedTags)}
                        Component={ComponentExtProcOverrides}
                        componentProps={{
                            version: veri.version,
                            reduxStore: reduxStore?.override?.overrides,
                            keyPrefix: "overrides",
                            tagMatchPrefix: "override",
                            reduxAction: ResourceAction,
                            title: "Ext Proc Overrides",
                            id: "override_overrides_0"
                        }}
                    />
                </Col>
            </Row>
        </>
    );
}

export default React.memo(ComponentExtProcPerRoute);
