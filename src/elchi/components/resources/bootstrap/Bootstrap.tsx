import React from "react";
import { useLocation } from "react-router-dom";
import { Col, Row, Divider } from "antd";
import { HeadOfResource } from "@/elchi/components/common/HeadOfResources";
import { FieldConfigType, matchesEndOrStartOf } from "@/utils/tools";
import ComponentNode from './Node';
import ComponentAdmin from './Admin';
import CustomAnchor from "@/elchi/components/common/CustomAnchor";
import ComponentDynamicResources from './DynamicResources';
import ComponentStaticResources from './StaticResources';
import { GTypes } from "@/common/statics/gtypes";
import { useGTypeFields } from "@/hooks/useGtypes";
import useResourceMain from "@/hooks/useResourceMain";
import CommonComponentSingleOptions from "@/elchi/components/resources/common/SingleOptions/SingleOptions";
import { useTags } from "@/hooks/useTags";
import RenderLoading from "../../common/Loading";
import { modtag_bootstrap, modtag_us_bootstrap } from "./_modtag_";
import { useModels } from "@/hooks/useModels";
import { generateFields } from "@/common/generate-fields";
import { Version } from "@/conf";
import { useLoading } from "@/hooks/loadingContext";
import { useManagedLoading } from "@/hooks/useManageLoading";
import { ConditionalComponent } from "../../common/ConditionalComponent";
import ComponentMemoryAllocatorManager from "./MemoryAllocatorManager";
import ComponentDeferredStatOptions from "./DeferredStatOptions";
import ComponentOverloadManager from "./OverloadManager/OverloadManager";
import CommonComponentStatsSinks from "@/elchi/components/resources/common/StatsSinks/StatsSinks";
import { ResourceAction } from "@/redux/reducers/slice";

type GeneralProps = {
    veri: {
        version: Version;
        queryResource: any;
        generalName: string;
        changeGeneralName: any;
    }
};

const ComponentBootstrap: React.FC<GeneralProps> = ({ veri }) => {
    const GType = useGTypeFields(GTypes.BootStrap);
    const location = useLocation();
    const { vTags, loading } = useTags(veri.version, modtag_bootstrap);
    const { vModels, loading_m } = useModels(veri.version, modtag_bootstrap);
    const { loadingCount } = useLoading();
    const { reduxStore, selectedTags, handleChangeTag } = useResourceMain({
        version: veri.version,
        alias: "b",
        vModels,
        vTags,
        modelName: "Bootstrap",
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.b?.Bootstrap,
            sf: vTags.b?.Bootstrap_SingleFields,
        }),
    ]

    useManagedLoading(loading, loading_m);
    if (loadingCount > 0) {
        return <RenderLoading checkPage={true} isLoadingQuery={!vModels || loading} error={""} />;
    }

    return (
        reduxStore && (
            <>
                <HeadOfResource
                    generalName={veri.generalName}
                    changeGeneralName={veri.changeGeneralName}
                    version={veri.version}
                    locationCheck={location.pathname === GType.createPath}
                    createUpdate={{
                        location_path: location.pathname,
                        GType: GType,
                        offset: 0,
                        name: veri.generalName,
                        reduxStore: reduxStore,
                        voidToJSON: vModels.b?.Bootstrap.toJSON,
                        queryResource: veri.queryResource,
                        envoyVersion: veri.version,
                        gtype: vModels.b?.Bootstrap.$type,
                        rawQuery: veri.queryResource?.resource?.resource
                    }}
                />
                <Divider type="horizontal" orientation="left" orientationMargin="0">Bootstrap Configuration</Divider>
                <Row>
                    <Col md={4} style={{ display: "block", maxHeight: "auto", overflowY: "auto" }}>
                        <CustomAnchor
                            resourceConfKeys={vTags.b?.Bootstrap}
                            unsuportedTags={modtag_us_bootstrap["Bootstrap"]}
                            singleOptionKeys={vTags.b?.Bootstrap_SingleFields}
                            selectedTags={selectedTags}
                            index={0}
                            handleChangeTag={handleChangeTag}
                            doNotChange={["dynamic_resources", "static_resources"]}
                            onlyOneTag={[["stats_flush_interval", "stats_flush.stats_flush_on_admin"]]}
                            specificTagPrefix={{ "stats_flush_on_admin": "stats_flush", "stats_eviction_interval": "stats_eviction" }}
                            unchangeableTags={["admin", "node", "dynamic_resources", "static_resources"]}
                        />
                    </Col>
                    <Col md={20}>
                        <ConditionalComponent
                            shouldRender={matchesEndOrStartOf("node", selectedTags)}
                            Component={ComponentNode}
                            componentProps={{
                                version: veri.version,
                                reduxStore: reduxStore?.node,
                                keyPrefix: "node",
                                tagMatchPrefix: "Bootstrap.node",
                                id: `node_0`,
                            }}
                        />
                        <ConditionalComponent
                            shouldRender={selectedTags?.some(item => vTags.b?.Bootstrap_SingleFields.includes(item))}
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
                            shouldRender={matchesEndOrStartOf("stats_sinks", selectedTags)}
                            Component={CommonComponentStatsSinks}
                            componentProps={{
                                version: veri.version,
                                reduxStore: reduxStore?.stats_sinks,
                                keyPrefix: "stats_sinks",
                                tagMatchPrefix: "Bootstrap.stats_sinks",
                                reduxAction: ResourceAction,
                                id: `stats_sinks_0`,
                            }}
                        />
                        <ConditionalComponent
                            shouldRender={matchesEndOrStartOf("static_resources", selectedTags)}
                            Component={ComponentStaticResources}
                            componentProps={{
                                version: veri.version,
                                reduxStore: reduxStore?.static_resources?.clusters,
                                keyPrefix: "static_resources.clusters",
                                tagMatchPrefix: "Bootstrap.static_resources.clusters",
                                id: `static_resources_0`,
                            }}
                        />
                        <ConditionalComponent
                            shouldRender={matchesEndOrStartOf("dynamic_resources", selectedTags)}
                            Component={ComponentDynamicResources}
                            componentProps={{
                                version: veri.version,
                                reduxStore: reduxStore?.dynamic_resources,
                                keyPrefix: "dynamic_resources.ads_config",
                                tagMatchPrefix: "Bootstrap.dynamic_resources.ads_config",
                                id: `dynamic_resources_0`,
                            }}
                        />
                        <ConditionalComponent
                            shouldRender={matchesEndOrStartOf("deferred_stat_options", selectedTags)}
                            Component={ComponentDeferredStatOptions}
                            componentProps={{
                                version: veri.version,
                                keyPrefix: `deferred_stat_options`,
                                reduxStore: reduxStore?.deferred_stat_options,
                                id: `deferred_stat_options_0`,
                            }}
                        />
                        <ConditionalComponent
                            shouldRender={matchesEndOrStartOf("admin", selectedTags)}
                            Component={ComponentAdmin}
                            componentProps={{
                                version: veri.version,
                                reduxStore: reduxStore?.admin,
                                keyPrefix: "admin",
                                tagMatchPrefix: "Bootstrap.admin",
                                id: `admin_0`,
                                managed: veri.queryResource?.general?.managed,
                            }}
                        />

                        <ConditionalComponent
                            shouldRender={matchesEndOrStartOf("memory_allocator_manager", selectedTags)}
                            Component={ComponentMemoryAllocatorManager}
                            componentProps={{
                                version: veri.version,
                                keyPrefix: `memory_allocator_manager`,
                                reduxStore: reduxStore?.memory_allocator_manager,
                                id: `memory_allocator_manager_0`,
                            }}
                        />

                        <ConditionalComponent
                            shouldRender={matchesEndOrStartOf("overload_manager", selectedTags)}
                            Component={ComponentOverloadManager}
                            componentProps={{
                                version: veri.version,
                                keyPrefix: `overload_manager`,
                                reduxStore: reduxStore?.overload_manager,
                                id: `overload_manager_0`,
                            }}
                        />

                    </Col>
                </Row>
            </>
        )
    )
}

export default React.memo(ComponentBootstrap);