import React, { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@redux/store";
import { Col, Row, Divider } from "antd";
import { ActionType, ResourceType } from "@/redux/reducer-helpers/common";
import { handleAddRemoveTags } from "@/elchi/helpers/tag-operations";
import { handleChangeResources } from "@/redux/dispatcher";
import { extractNestedKeys } from "@/utils/get-active-tags";
import { FieldConfigType, matchesEndOrStartOf } from "@/utils/tools";
import { headerOptionFields } from "@/common/statics/general";
import { HeadOfResource } from "@/elchi/components/common/HeadOfResources";
import { ResourceAction } from "@/redux/reducers/slice";
import { GTypes } from "@/common/statics/gtypes";
import { useGTypeFields } from "@/hooks/useGtypes";
import { ConfDiscovery } from "@/common/types";
import { useTags } from "@/hooks/useTags";
import { modtag_r_route, modtag_route, modtag_us_route } from "./_modtag_";
import { useModels } from "@/hooks/useModels";
import { generateFields } from "@/common/generate-fields";
import CustomAnchor from "@/elchi/components/common/CustomAnchor";
import VirtualHosts from './VirtualHosts';
import CommonComponentSingleOptions from "@/elchi/components/resources/common/SingleOptions/SingleOptions";
import CommonComponentName from '../common/Name/Name';
import CommonComponentHeaderOptions from "../common/HeaderOptions/HeaderOptions";
import CommonComponentRequestMirrorPolicy from '../common/RequestMirrorPolicy/RequestMirrorPolicy'
import Vhds from "./VHDS";
import CommonComponentTypedPerFilter from "@resources/common/TypedPerFilter/typed_per_filter";
import RenderLoading from "../../common/Loading";
import { useLoading } from "@/hooks/loadingContext";
import { useManagedLoading } from "@/hooks/useManageLoading";
import { ConditionalComponent } from "../../common/ConditionalComponent";


type GeneralProps = {
    veri: {
        version: string;
        queryResource: any;
    }
};

const RouteComponent: React.FC<GeneralProps> = ({ veri }) => {
    const GType = useGTypeFields(GTypes.Route);
    const location = useLocation();
    const dispatch = useDispatch();
    const { vModels, loading_m } = useModels(veri.version, modtag_route);
    const { vTags, loading } = useTags(veri.version, modtag_route);
    const { loadingCount } = useLoading();
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const memoReduxStore = useSelector((state: RootState) => state.VersionedResources[veri.version]?.Resource);
    const reduxStore = useMemo(() => {
        return vModels.rc?.RouteConfiguration.fromJSON(memoReduxStore);
    }, [memoReduxStore, vModels]);

    const memoConfigDiscoveryReduxStore = useSelector((state: RootState) => state.VersionedResources[veri.version].ConfigDiscovery);
    const configDiscoveryReduxStore: ConfDiscovery[] = useMemo(() => {
        return memoConfigDiscoveryReduxStore;
    }, [memoConfigDiscoveryReduxStore]);

    useEffect(() => {
        setSelectedTags(extractNestedKeys(reduxStore));
    }, [veri.version, reduxStore]);

    const handleChangeRedux = (keys: string, val?: string | boolean | number) => {
        handleChangeResources({ version: veri.version, type: ActionType.Delete, keys, val, resourceType: ResourceType.Resource }, dispatch, ResourceAction);
        const vhdsItemIndex = configDiscoveryReduxStore.findIndex(item => item.category === "vhds");
        if (vhdsItemIndex !== -1 && keys === "vhds") {
            dispatch(ResourceAction({
                version: veri.version,
                type: ActionType.Delete,
                keys: [`${vhdsItemIndex}`],
                val: null,
                resourceType: ResourceType.ConfigDiscovery
            }));
        }
    };

    const handleChangeTag = (keyPrefix: string, tagPrefix: string, tag: string, checked: boolean) => {
        handleAddRemoveTags(keyPrefix, tagPrefix, tag, checked, selectedTags, setSelectedTags, handleChangeRedux);
    }

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.rc?.RouteConfiguration,
            sf: vTags.rc?.RouteConfiguration_SingleFields,
            e: ["name", "request_headers_to_remove", "response_headers_to_remove"]
        }),
    ]

    useManagedLoading(loading, loading_m);
    if (loadingCount > 0) {
        return <RenderLoading checkPage={true} isLoadingQuery={!vModels || loading} error={""} />;
    }

    return (
        <>
            <HeadOfResource
                generalName={reduxStore?.name}
                version={veri.version}
                locationCheck={false}
                createUpdate={{
                    location_path: location.pathname,
                    GType: GType,
                    offset: 0,
                    name: reduxStore?.name,
                    reduxStore: reduxStore,
                    voidToJSON: vModels.rc?.RouteConfiguration.toJSON,
                    queryResource: veri.queryResource,
                    envoyVersion: veri.version,
                    gtype: reduxStore?.$type,
                    configDiscovery: configDiscoveryReduxStore,
                }}
            />
            <Divider type="horizontal" orientation="left" orientationMargin="0">HTTP Route Configuration</Divider>
            <Row>
                <Col md={4} style={{ display: "block", maxHeight: "auto", overflowY: "auto" }}>
                    <CustomAnchor
                        resourceConfKeys={vTags.rc?.RouteConfiguration}
                        unsuportedTags={modtag_us_route['RouteConfiguration']}
                        singleOptionKeys={vTags.rc?.RouteConfiguration_SingleFields.filter((item: string) => !["name", "response_headers_to_remove", "request_headers_to_remove"].includes(item))}
                        headerOptionKeys={headerOptionFields}
                        selectedTags={selectedTags}
                        index={0}
                        handleChangeTag={handleChangeTag}
                        required={modtag_r_route['RouteConfiguration']}
                        unchangeableTags={["name"]}
                    />
                </Col>
                <Col md={20}>
                    <ConditionalComponent
                        shouldRender={selectedTags?.includes("name")}
                        Component={CommonComponentName}
                        componentProps={{
                            version: veri.version,
                            title: "name",
                            reduxAction: ResourceAction,
                            reduxStore: reduxStore?.name,
                            disabled: location.pathname !== GType.createPath,
                            id: `name_0`
                        }}
                    />
                    <ConditionalComponent
                        shouldRender={selectedTags?.includes("virtual_hosts")}
                        Component={VirtualHosts}
                        componentProps={{
                            version: veri.version,
                            reduxAction: ResourceAction,
                            reduxStore: reduxStore?.virtual_hosts,
                            keyPrefix: 'virtual_hosts',
                            selectedTags: selectedTags,
                            GType: GType,
                            id: `virtual_hosts_0`
                        }}
                    />
                    <ConditionalComponent
                        shouldRender={matchesEndOrStartOf("vhds", selectedTags)}
                        Component={Vhds}
                        componentProps={{
                            version: veri.version,
                            vhds: reduxStore?.vhds,
                            reduxAction: ResourceAction,
                            reduxStore: configDiscoveryReduxStore,
                            routeName: reduxStore?.name,
                            keyPrefix: undefined,
                            id: `vhds_0`
                        }}
                    />
                    <ConditionalComponent
                        shouldRender={selectedTags?.some(item => vTags.rc?.RouteConfiguration_SingleFields.includes(item) && item !== "name")}
                        Component={CommonComponentSingleOptions}
                        componentProps={{
                            version: veri.version,
                            selectedTags: selectedTags,
                            fieldConfigs: fieldConfigs,
                            reduxStore: reduxStore,
                            id: `single_options_0`
                        }}
                    />
                    <ConditionalComponent
                        shouldRender={selectedTags?.some(item => headerOptionFields.includes(item))}
                        Component={CommonComponentHeaderOptions}
                        componentProps={{
                            version: veri.version,
                            selectedTags: selectedTags,
                            reduxStore: reduxStore,
                            reduxAction: ResourceAction,
                            toJSON: vModels.rc?.RouteConfiguration.toJSON,
                            id: `header_options_0`
                        }}
                    />
                    <ConditionalComponent
                        shouldRender={matchesEndOrStartOf("request_mirror_policies", selectedTags)}
                        Component={CommonComponentRequestMirrorPolicy}
                        componentProps={{
                            version: veri.version,
                            reduxAction: ResourceAction,
                            reduxStore: reduxStore?.request_mirror_policies,
                            keyPrefix: `request_mirror_policies`,
                            tagMatchPrefix: "RouteConfiguration.request_mirror_policies",
                            id: `request_mirror_policies_0`
                        }}
                    />
                    <ConditionalComponent
                        shouldRender={matchesEndOrStartOf("typed_per_filter_config", selectedTags)}
                        Component={CommonComponentTypedPerFilter}
                        componentProps={{
                            version: veri.version,
                            reduxStore: reduxStore?.typed_per_filter_config,
                            keyPrefix: `typed_per_filter_config`,
                            id: `typed_per_filter_config_0`
                        }}
                    />
                </Col>
            </Row>
        </>
    );
}

export default RouteComponent;