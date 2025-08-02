import React, { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@redux/store";
import { Col, Row, Divider } from "antd";
import { ActionType, ResourceType } from "@/redux/reducer-helpers/common";
import { handleChangeResources } from "@/redux/dispatcher";
import { handleAddRemoveTags } from "@/elchi/helpers/tag-operations";
import { extractNestedKeys } from "@/utils/get-active-tags";
import { HeadOfResource } from "@/elchi/components/common/HeadOfResources";
import { ResourceAction } from "@/redux/reducers/slice";
import CustomAnchor from "@/elchi/components/common/CustomAnchor";
import { FieldConfigType, startsWithAny } from "@/utils/tools";
import CommonComponentClusterCard from "@resources/common/Clusters/Cluster/ClusterCard";
import CommonComponentSingleOptions from "@/elchi/components/resources/common/SingleOptions/SingleOptions";
import CommonComponentStruct from "@resources/common/Struct/Struct";
import { GTypes } from "@/common/statics/gtypes";
import { useGTypeFields } from "@/hooks/useGtypes";
import { useModels } from "@/hooks/useModels";
import { useTags } from "@/hooks/useTags";
import { modtag_fluentd_access_log, modtag_us_accesslog } from "./_modtag_";
import RenderLoading from "@/elchi/components/common/Loading";
import { generateFields } from "@/common/generate-fields";
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

const FluentdAccessLogConfigComponent: React.FC<GeneralProps> = ({ veri }) => {
    const GType = useGTypeFields(GTypes.FluentdAccessLog);
    const location = useLocation();
    const dispatch = useDispatch();
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const { vModels, loading_m } = useModels(veri.version, modtag_fluentd_access_log);
    const { vTags, loading } = useTags(veri.version, modtag_fluentd_access_log);
    const { loadingCount } = useLoading();

    const memoReduxStore = useSelector((state: RootState) => state.VersionedResources[veri.version].Resource);
    const reduxStore = useMemo(() => {
        if (!vModels) return null;
        return vModels.flual?.FluentdAccessLogConfig.fromJSON(memoReduxStore) ?? null;
    }, [memoReduxStore, vModels]);

    useEffect(() => {
        setSelectedTags(extractNestedKeys(reduxStore));
    }, [veri.version, reduxStore]);

    const handleChangeRedux = (keys: string, val?: string | boolean | number) => {
        handleChangeResources({ version: veri.version, type: ActionType.Delete, keys, val, resourceType: ResourceType.Resource }, dispatch, ResourceAction);
    };

    const handleChangeTag = (keyPrefix: string, tagPrefix: string, tag: string, checked: boolean) => {
        handleAddRemoveTags(keyPrefix, tagPrefix, tag, checked, selectedTags, setSelectedTags, handleChangeRedux);
    };

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.flual?.FluentdAccessLogConfig,
            sf: vTags.flual?.FluentdAccessLogConfig_SingleFields,
            r: ['tag', 'stat_prefix'],
            e: ['cluster']
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
                    voidToJSON: vModels.flual?.FluentdAccessLogConfig.toJSON,
                    queryResource: veri.queryResource,
                    envoyVersion: veri.version,
                    gtype: reduxStore?.$type,
                }}
            />
            <Divider type="horizontal" orientation="left" orientationMargin="0">Fluentd Access Log Config</Divider>
            <Row>
                <Col md={4}>
                    <CustomAnchor
                        resourceConfKeys={vTags.flual?.FluentdAccessLogConfig}
                        unsuportedTags={modtag_us_accesslog['fluentd']}
                        singleOptionKeys={vTags.flual?.FluentdAccessLogConfig_SingleFields.filter(item => item !== 'cluster')}
                        selectedTags={selectedTags}
                        index={0}
                        handleChangeTag={handleChangeTag}
                        tagMatchPrefix={"FluentdAccessLogConfig"}
                        required={['cluster', 'record', 'tag', 'stat_prefix']}
                        infoBar={[{
                            title: "Operators",
                            icon: <ProfileTwoTone />,
                            info_type: "oprt",
                        }]}
                    />
                </Col>
                <Col md={20} style={{ display: "block", maxHeight: "83vh", overflowY: "auto" }}>
                    <ConditionalComponent
                        shouldRender={startsWithAny("cluster", selectedTags)}
                        Component={CommonComponentClusterCard}
                        componentProps={{
                            version: veri.version,
                            reduxStore: reduxStore?.cluster,
                            tag: 'cluster',
                            reduxAction: ResourceAction,
                            alwaysShow: false,
                            keyPrefix: ``,
                            selectedTags: selectedTags,
                            id: `cluster_0`,
                        }}
                    />
                    <ConditionalComponent
                        shouldRender={selectedTags?.some(item => vTags.flual?.FluentdAccessLogConfig_SingleFields.includes(item) && item !== 'cluster')}
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
                        shouldRender={startsWithAny("record", selectedTags)}
                        Component={CommonComponentStruct}
                        componentProps={{
                            version: veri.version,
                            reduxStore: reduxStore?.record,
                            keyPrefix: ``,
                            tagPrefix: ``,
                            tagMatchPrefix: ``,
                            parentName: 'Record',
                            tag: 'record',
                            id: `record_0`,
                        }}
                    />
                </Col>
            </Row>
        </>
    );
};

export default React.memo(FluentdAccessLogConfigComponent);
