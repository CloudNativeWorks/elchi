import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Col, Divider, Drawer, Row } from "antd";
import { ActionType, ResourceType } from "@/redux/reducer-helpers/common";
import { handleAddRemoveTags } from "@/elchi/helpers/tag-operations";
import { handleChangeResources } from "@/redux/dispatcher";
import { extractNestedKeys } from "@/utils/get-active-tags";
import { FieldConfigType, matchesEndOrStartOf } from "@/utils/tools";
import { FieldTypes, headerOptionFields } from "@/common/statics/general";
import { ResourceAction } from "@/redux/reducers/slice";
import CommonComponentHeaderOptions from "../common/HeaderOptions/HeaderOptions";
import CommonComponentRequestMirrorPolicy from '../common/RequestMirrorPolicy/RequestMirrorPolicy'
import Vhds from "./VHDS";
import { ConfDiscovery } from "@/common/types";
import { HorizonTags } from "../../common/HorizonTags";
import CCard from "../../common/CopyPasteCard";
import VirtualHostComponent from "../vhds/VirtualHosts";
import { GTypeFieldsBase } from "@/common/statics/gtypes";
import CommonComponentTypedPerFilter from '@resources/common/TypedPerFilter/typed_per_filter';
import { useTags } from "@/hooks/useTags";
import { modtag_route } from "./_modtag_";
import { useModels } from "@/hooks/useModels";
import { generateFields } from "@/common/generate-fields";
import { ConditionalComponent } from "../../common/ConditionalComponent";
import { EForm } from "../../common/e-components/EForm";
import { EFields } from "../../common/e-components/EFields";
import ElchiButton from "../../common/ElchiButton";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        reduxAction: any;
        keyPrefix: string;
        tagMatchPrefix: string;
        configDiscovery: ConfDiscovery[];
        GType: GTypeFieldsBase;
    }
};

const ComponentRoute: React.FC<GeneralProps> = ({ veri }) => {
    const dispatch = useDispatch();
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const { vModels } = useModels(veri.version, modtag_route);
    const { vTags } = useTags(veri.version, modtag_route);
    const [state, setState] = useState<boolean>(false);

    useEffect(() => {
        setSelectedTags(extractNestedKeys(veri.reduxStore));
    }, [veri.version, veri.reduxStore]);

    const handleDeleteRedux = (keys: string, val?: string | boolean | number) => {
        handleChangeResources({ version: veri.version, type: ActionType.Delete, keys, val, resourceType: ResourceType.Resource }, dispatch, ResourceAction);
    };

    const handleChangeRedux = (keys: string, val: any) => {
        handleChangeResources({ version: veri.version, type: ActionType.Update, keys, val, resourceType: ResourceType.Resource }, dispatch, ResourceAction);
    };

    const handleChangeTag = (keyPrefix: string, tagPrefix: string, tag: string, checked: boolean) => {
        handleAddRemoveTags(keyPrefix, tagPrefix, tag, checked, selectedTags, setSelectedTags, handleDeleteRedux);

        if (tag === "vhds") {
            const vhdsItemIndex = veri.configDiscovery.findIndex(item => item.category === "vhds");

            if (vhdsItemIndex !== -1) {
                dispatch(ResourceAction({
                    version: veri.version,
                    type: ActionType.Delete,
                    keys: [`${vhdsItemIndex}`],
                    val: null,
                    resourceType: ResourceType.ConfigDiscovery
                }));
            }
        }
    }

    const fieldConfigs: FieldConfigType[] = [
        { tag: "virtual_hosts", type: FieldTypes.ArrayIcon, fieldPath: 'virtual_hosts', drawerShow: () => { setState(true); }, },
        ...generateFields({
            f: vTags.rc?.RouteConfiguration,
            sf: vTags.rc?.RouteConfiguration_SingleFields,
            r: ["name"]
        }),
    ]

    return (
        <>
            <CCard reduxStore={veri.reduxStore} keys={''} toJSON={vModels.rc?.RouteConfiguration.toJSON} Paste={handleChangeRedux} ctype="route_config" version={veri.version} title="Route Config">
                <Row>
                    <Col md={24}>
                        <HorizonTags veri={{
                            tags: vTags.rc?.RouteConfiguration,
                            // this is not supported by envoy https://github.com/envoyproxy/envoy/issues/23263
                            // remove the vhds tag when supported
                            unsupportedTags: ["vhds", "metadata"],
                            selectedTags: selectedTags,
                            handleChangeTag: handleChangeTag,
                            keyPrefix: `${veri.keyPrefix}`,
                            tagMatchPrefix: `${veri.tagMatchPrefix}`,
                            required: ["name"],
                        }} />
                        <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
                        <EForm>
                            <EFields
                                fieldConfigs={fieldConfigs}
                                selectedTags={selectedTags}
                                handleChangeRedux={handleChangeRedux}
                                reduxStore={veri.reduxStore}
                                keyPrefix={veri.keyPrefix}
                                version={veri.version}
                            />
                        </EForm>
                        <ConditionalComponent
                            shouldRender={matchesEndOrStartOf("vhds", selectedTags)}
                            Component={Vhds}
                            componentProps={{
                                version: veri.version,
                                vhds: veri.reduxStore?.vhds,
                                reduxAction: ResourceAction,
                                reduxStore: veri.configDiscovery,
                                keyPrefix: `${veri.keyPrefix}`,
                                routeName: veri.reduxStore?.name,
                                id: `vhds_0`
                            }}
                        />
                        <ConditionalComponent
                            shouldRender={selectedTags?.some(item => headerOptionFields.includes(item))}
                            Component={CommonComponentHeaderOptions}
                            componentProps={{
                                version: veri.version,
                                selectedTags: selectedTags,
                                reduxStore: veri.reduxStore,
                                reduxAction: ResourceAction,
                                toJSON: vModels.rc?.HttpConnectionManager?.toJSON,
                                id: `header_options_0`
                            }}
                        />
                        <ConditionalComponent
                            shouldRender={matchesEndOrStartOf("request_mirror_policies", selectedTags)}
                            Component={CommonComponentRequestMirrorPolicy}
                            componentProps={{
                                version: veri.version,
                                reduxAction: ResourceAction,
                                reduxStore: veri.reduxStore?.request_mirror_policies,
                                keyPrefix: `${veri.keyPrefix}.request_mirror_policies`,
                                tagMatchPrefix: `${veri.tagMatchPrefix}.request_mirror_policies`,
                                id: `request_mirror_policies_0`
                            }}
                        />
                        <ConditionalComponent
                            shouldRender={matchesEndOrStartOf("typed_per_filter_config", selectedTags)}
                            Component={CommonComponentTypedPerFilter}
                            componentProps={{
                                version: veri.version,
                                reduxStore: veri.reduxStore?.typed_per_filter_config,
                                keyPrefix: `${veri.keyPrefix}.typed_per_filter_config`,
                                id: `typed_per_filter_config_0`
                            }}
                        />
                    </Col>
                </Row>
            </CCard>
            <Drawer
                key={`draver_${veri.keyPrefix}`}
                title={`HTTP Route Components`}
                placement="right"
                closable={false}
                open={state}
                onClose={() => setState(false)}
                size='large'
                width={1400}
                zIndex={1009}
            >
                <VirtualHostComponent veri={{
                    version: veri.version,
                    keyPrefix: `${veri.keyPrefix}.virtual_hosts`,
                    queryResource: null,
                    generalName: "",
                    changeGeneralName: null,
                    reduxStore: veri.reduxStore?.virtual_hosts,
                    isMainComponent: false,
                    GType: veri.GType,
                }} />
                <ElchiButton onlyText style={{ marginTop: 15 }} onClick={() => setState(false)}>Close</ElchiButton>
            </Drawer>
        </>
    );
}

export default ComponentRoute;