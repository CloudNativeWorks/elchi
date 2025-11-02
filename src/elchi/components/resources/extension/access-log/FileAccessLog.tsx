import React from "react";
import { useLocation } from "react-router-dom";
import { Col, Row, Divider } from "antd";
import { HeadOfResource } from "@/elchi/components/common/HeadOfResources";
import { ResourceAction } from "@/redux/reducers/slice";
import { FieldConfigType, matchesEndOrStartOf, startsWithAny } from "@/utils/tools";
import { navigateCases } from "@/elchi/helpers/navigate-cases";
import { GTypes } from "@/common/statics/gtypes";
import { useGTypeFields } from "@/hooks/useGtypes";
import { useModels } from "@/hooks/useModels";
import { useTags } from "@/hooks/useTags";
import { modtag_file_access_log, modtag_us_accesslog } from "./_modtag_";
import { generateFields } from "@/common/generate-fields";
import useResourceMain from "@/hooks/useResourceMain";
import CustomAnchor from "@/elchi/components/common/CustomAnchor";
import ComponentLogFormat from "./LogFormat";
import CommonComponentSingleOptions from "@/elchi/components/resources/common/SingleOptions/SingleOptions";
import RenderLoading from "@/elchi/components/common/Loading";
import { useLoading } from "@/hooks/loadingContext";
import { useManagedLoading } from "@/hooks/useManageLoading";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";
import { ProfileTwoTone } from "@ant-design/icons";
import CommonComponentPath from "@elchi/components/resources/common/Path/Path"

type GeneralProps = {
    veri: {
        version: string;
        gtype: string;
        queryResource: any;
        generalName: string;
        changeGeneralName: any;
    }
};

const FileAccessLogComponent: React.FC<GeneralProps> = ({ veri }) => {
    const GType = useGTypeFields(GTypes.FileAccessLog);
    const location = useLocation();
    const { vModels, loading_m } = useModels(veri.version, modtag_file_access_log);
    const { vTags, loading } = useTags(veri.version, modtag_file_access_log);
    const { loadingCount } = useLoading();
    const { reduxStore, selectedTags, handleChangeTag } = useResourceMain({
        version: veri.version,
        alias: "fal",
        vModels,
        vTags,
        modelName: "FileAccessLog",
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.fal?.FileAccessLog,
            sf: vTags.fal?.FileAccessLog_SingleFields,
        })
    ];

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
                    voidToJSON: vModels.fal?.FileAccessLog.toJSON,
                    queryResource: veri.queryResource,
                    envoyVersion: veri.version,
                    gtype: reduxStore?.$type,
                }}
            />
            <Divider type="horizontal" orientation="left" orientationMargin="0">File Access Log</Divider>
            <Row>
                <Col md={4} style={{ display: "block", maxHeight: "auto", overflowY: "auto" }}>
                    <CustomAnchor
                        resourceConfKeys={vTags.fal?.FileAccessLog}
                        unsuportedTags={modtag_us_accesslog["file"]}
                        singleOptionKeys={vTags.fal?.FileAccessLog_SingleFields}
                        selectedTags={selectedTags}
                        index={0}
                        handleChangeTag={handleChangeTag}
                        tagMatchPrefix={"FileAccessLog"}
                        required={['path']}
                        specificTagPrefix={{ "log_format": "access_log_format" }}
                        infoBar={[{
                            title: "Operators",
                            icon: <ProfileTwoTone />,
                            info_type: "oprt",
                        }]}
                    />
                </Col>
                <Col md={20}>
                    {startsWithAny("path", selectedTags) &&
                        <CommonComponentPath veri={{
                            version: veri.version,
                            reduxStore: reduxStore?.path,
                            title: "path",
                            reduxAction: ResourceAction,
                        }} />
                    }
                    <ConditionalComponent
                        shouldRender={matchesEndOrStartOf("access_log_format.log_format", selectedTags)}
                        Component={ComponentLogFormat}
                        componentProps={{
                            version: veri.version,
                            keyPrefix: 'log_format',
                            reduxAction: ResourceAction,
                            reduxStore: navigateCases(reduxStore, 'access_log_format.log_format'),
                            tagMatchPrefix: 'FileAccessLog.access_log_format.log_format',
                            id: `log_format_0`,
                        }}
                    />
                </Col>
            </Row>
        </>
    )
}

export default React.memo(FileAccessLogComponent);
