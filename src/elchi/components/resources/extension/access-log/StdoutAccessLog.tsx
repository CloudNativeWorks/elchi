import React from "react";
import { useLocation } from "react-router-dom";
import { Col, Row, Divider } from "antd";
import { HeadOfResource } from "@/elchi/components/common/HeadOfResources";
import { ResourceAction } from "@/redux/reducers/slice";
import { matchesEndOrStartOf } from "@/utils/tools";
import { navigateCases } from "@/elchi/helpers/navigate-cases";
import { GTypes } from "@/common/statics/gtypes";
import { useGTypeFields } from "@/hooks/useGtypes";
import useResourceMain from "@/hooks/useResourceMain";
import ComponentLogFormat from "./LogFormat";
import CustomAnchor from "@/elchi/components/common/CustomAnchor";
import { useModels } from "@/hooks/useModels";
import { useTags } from "@/hooks/useTags";
import { modtag_stdout_access_log } from "./_modtag_";
import RenderLoading from "@/elchi/components/common/Loading";
import { useLoading } from "@/hooks/loadingContext";
import { useManagedLoading } from "@/hooks/useManageLoading";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";
import { ProfileTwoTone } from "@ant-design/icons";


type GeneralProps = {
    veri: {
        version: string;
        gtype: string;
        queryResource: any;
        generalName: string;
        changeGeneralName: any;
    }
};

const StdoutAccessLogComponent: React.FC<GeneralProps> = ({ veri }) => {
    const GType = useGTypeFields(GTypes.StdoutAccessLog);
    const location = useLocation();
    const { vModels, loading_m } = useModels(veri.version, modtag_stdout_access_log);
    const { vTags, loading } = useTags(veri.version, modtag_stdout_access_log);
    const { loadingCount } = useLoading();
    const { reduxStore, selectedTags, handleChangeTag } = useResourceMain({
        version: veri.version,
        alias: "outal",
        vModels,
        vTags,
        modelName: "StdoutAccessLog",
    });

    useManagedLoading(loading, loading_m);
    if (loadingCount > 0) {
        return <RenderLoading checkPage={true} isLoadingQuery={true} error={""} />;
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
                    voidToJSON: vModels.outal?.StdoutAccessLog.toJSON,
                    queryResource: veri.queryResource,
                    envoyVersion: veri.version,
                    gtype: reduxStore?.$type,
                }}
            />
            <Divider type="horizontal" orientation="left" orientationMargin="0">Stdout Access Log</Divider>
            <Row>
                <Col md={4}>
                    <CustomAnchor
                        resourceConfKeys={vTags.outal?.StdoutAccessLog}
                        selectedTags={selectedTags}
                        index={0}
                        handleChangeTag={handleChangeTag}
                        tagMatchPrefix={"StdoutAccessLog"}
                        required={['path']}
                        specificTagPrefix={{ "log_format": "access_log_format" }}
                        infoBar={[{
                            title: "Operators",
                            icon: <ProfileTwoTone />,
                            info_type: "oprt",
                        }]}
                    />
                </Col>
                <Col md={20} style={{ display: "block", maxHeight: "83vh", overflowY: "auto" }}>
                    <ConditionalComponent
                        shouldRender={matchesEndOrStartOf("access_log_format", selectedTags)}
                        Component={ComponentLogFormat}
                        componentProps={{
                            version: veri.version,
                            keyPrefix: 'log_format',
                            reduxAction: ResourceAction,
                            reduxStore: navigateCases(reduxStore, 'access_log_format.log_format'),
                            tagMatchPrefix: 'StdoutAccessLog.access_log_format.log_format',
                            id: `log_format_0`,
                        }}
                    />
                </Col>
            </Row>
        </>
    )
}

export default React.memo(StdoutAccessLogComponent);