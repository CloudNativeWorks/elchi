import React from "react";
import { useLocation } from "react-router-dom";
import { Col, Row, Divider } from "antd";
import { HeadOfResource } from "@/elchi/components/common/HeadOfResources";
import { ResourceAction } from "@/redux/reducers/slice";
import CustomAnchor from "@/elchi/components/common/CustomAnchor";
import { matchesEndOrStartOf } from "@/utils/tools";
import ComponentLogFormat from "./LogFormat";
import { navigateCases } from "@/elchi/helpers/navigate-cases";
import { GTypes } from "@/common/statics/gtypes";
import { useGTypeFields } from "@/hooks/useGtypes";
import useResourceMain from "@/hooks/useResourceMain";
import { useTags } from "@/hooks/useTags";
import { useModels } from "@/hooks/useModels";
import { modtag_stderr_access_log } from "./_modtag_";
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

const StderrAccessLogComponent: React.FC<GeneralProps> = ({ veri }) => {
    const GType = useGTypeFields(GTypes.StdErrAccessLog);
    const location = useLocation();
    const { vModels, loading_m } = useModels(veri.version, modtag_stderr_access_log);
    const { vTags, loading } = useTags(veri.version, modtag_stderr_access_log);
    const { loadingCount } = useLoading();
    const { reduxStore, selectedTags, handleChangeTag } = useResourceMain({
        version: veri.version,
        alias: "erral",
        vModels,
        vTags,
        modelName: "StdErrAccessLog",
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
                    voidToJSON: vModels.erral?.StderrAccessLog.toJSON,
                    queryResource: veri.queryResource,
                    envoyVersion: veri.version,
                    gtype: reduxStore?.$type,
                }}
            />
            <Divider type="horizontal" orientation="left" orientationMargin="0">Stderr Access Log</Divider>
            <Row>
                <Col md={4}>
                    <CustomAnchor
                        resourceConfKeys={vTags.erral?.StderrAccessLog}
                        selectedTags={selectedTags}
                        index={0}
                        handleChangeTag={handleChangeTag}
                        tagMatchPrefix={"StderrAccessLog"}
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
                            tagMatchPrefix: 'StderrAccessLog.access_log_format.log_format',
                            id: `log_format_0`,
                        }}
                    />
                </Col>
            </Row>
        </>
    )
}

export default React.memo(StderrAccessLogComponent);