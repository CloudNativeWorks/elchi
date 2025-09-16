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
import { modtag_health_check_event_file_sink } from "./_modtag_";
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

const ComponentHCEFS: React.FC<GeneralProps> = ({ veri }) => {
    const GType = useGTypeFields(GTypes.HCEFS);
    const location = useLocation();
    const { vModels, loading_m } = useModels(veri.version, modtag_health_check_event_file_sink);
    const { vTags, loading } = useTags(veri.version, modtag_health_check_event_file_sink);
    const { loadingCount } = useLoading();
    const memoReduxStore = useSelector((state: RootState) => state.VersionedResources[veri.version].Resource);
    const reduxStore = useMemo(() => {
        return vModels.hcefs?.HealthCheckEventFileSink.fromJSON(memoReduxStore);
    }, [memoReduxStore, vModels]);

    const { selectedTags, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.hcefs?.HealthCheckEventFileSink,
            sf: vTags.hcefs?.HealthCheckEventFileSink_SingleFields,
            r: ["event_log_path"],
            sn: 24
        })
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
                    locationCheck={GType.createPath === location.pathname}
                    createUpdate={{
                        location_path: location.pathname,
                        GType: GType,
                        offset: 0,
                        name: veri.generalName,
                        reduxStore: reduxStore,
                        voidToJSON: vModels.hcefs?.HealthCheckEventFileSink.toJSON,
                        queryResource: veri.queryResource,
                        envoyVersion: veri.version,
                        gtype: reduxStore?.$type,
                    }}
                />
                <Divider type="horizontal" orientation="left" orientationMargin="0">Health Check Event File Sink</Divider>
                <Row>
                    <Col md={4} style={{ display: "block", maxHeight: "auto", overflowY: "auto" }}>
                        <CustomAnchor
                            resourceConfKeys={vTags.hcefs?.HealthCheckEventFileSink}
                            singleOptionKeys={vTags.hcefs?.HealthCheckEventFileSink_SingleFields}
                            selectedTags={selectedTags}
                            handleChangeTag={handleChangeTag}
                            required={"event_log_path"}
                        />
                    </Col>
                    <Col md={20} style={{ display: "block", maxHeight: "83vh", overflowY: "auto" }}>
                        <ConditionalComponent
                            shouldRender={selectedTags?.some(item => vTags.hcefs?.HealthCheckEventFileSink_SingleFields?.includes(item))}
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

export default React.memo(ComponentHCEFS);