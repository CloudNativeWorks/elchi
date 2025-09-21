import React, { useState } from "react";
import { Col, Row, Divider, Tabs } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { FieldConfigType, startsWithAny } from "@/utils/tools";
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import { FieldTypes } from "@/common/statics/general";
import { ResourceAction } from "@/redux/reducers/slice";
import useTabManager from "@/hooks/useTabManager";
import useResourceFormMultiple from "@/hooks/useResourceFormMultiple";
import CCard from "@/elchi/components/common/CopyPasteCard";
import CommonComponentLocality from "@elchi/components/resources/common/Locality/Locality";
import LBEndpointComponent from './lb_endpoints/lb_endpoints'
import { useTags } from "@/hooks/useTags";
import { modtag_locality_lb_endpoints } from "./_modtag_";
import { generateFields } from "@/common/generate-fields";
import { useModels } from "@/hooks/useModels";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import { EFields } from "@/elchi/components/common/e-components/EFields";
import { modtag_us_cla } from "../../endpoint/_modtag_";


type GeneralProps = {
    veri: {
        version: string;
        keyPrefix: string;
        tagMatchPrefix: string;
        reduxStore: any
    }
};

interface ModalState {
    show_lb_endpoints: { [index: number]: boolean; }
}

const ComponentEndpoints: React.FC<GeneralProps> = ({ veri }) => {
    const { vModels } = useModels(veri.version, modtag_locality_lb_endpoints);
    const { vTags } = useTags(veri.version, modtag_locality_lb_endpoints);
    const [stateModal, setStateModal] = useState<ModalState>({
        show_lb_endpoints: {},
    });

    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceFormMultiple({
        version: veri.version,
        reduxStore: veri.reduxStore,
        keyPrefix: veri.keyPrefix,
        reduxAction: ResourceAction
    });

    const { state, onChangeTabs, addTab } = useTabManager({
        initialActiveTab: "0",
        reduxStore: veri.reduxStore,
        keyPrefix: veri.keyPrefix,
        version: veri.version,
        reduxAction: ResourceAction
    });

    const fieldConfigs: FieldConfigType[] = [
        {
            tag: "lb_endpoints", type: FieldTypes.ArrayIcon, placeHolder: "(number)", fieldPath: 'lb_endpoints', spanNum: 4, drawerShow: (index: number) => {
                const updatedState = { ...stateModal };
                updatedState.show_lb_endpoints[index] = true;
                setStateModal(updatedState);
            }
        },
        ...generateFields({
            f: vTags.LocalityLbEndpoints?.LocalityLbEndpoints,
            sf: vTags.LocalityLbEndpoints?.LocalityLbEndpoints_SingleFields,
        }),
    ]

    if (!vModels) { return <div>Module not found!...</div>; }

    return (
        <CCard reduxStore={veri.reduxStore} toJSON={vModels.LocalityLbEndpoints?.LocalityLbEndpoints.toJSON} keys={veri.keyPrefix} Paste={handleChangeRedux} ctype="endpoints" version={veri.version} title="Endpoints">
            <Tabs
                onChange={onChangeTabs}
                type="editable-card"
                activeKey={state.activeTab}
                onEdit={addTab}
                style={{ width: "99%" }}
                items={Array.isArray(veri.reduxStore) ? veri.reduxStore?.map((data: any, index: number) => {
                    if (stateModal.show_lb_endpoints[index] === undefined) {
                        stateModal.show_lb_endpoints[index] = false;
                    }
                    return {
                        key: index.toString(),
                        label: "Endpoint: " + index,
                        forceRender: true,
                        children: (
                            <>
                                <Row>
                                    <HorizonTags veri={{
                                        tags: vTags.LocalityLbEndpoints?.LocalityLbEndpoints,
                                        selectedTags: selectedTags[index],
                                        unsupportedTags: modtag_us_cla["endpoints"],
                                        index: index,
                                        handleChangeTag: handleChangeTag,
                                        tagMatchPrefix: veri.tagMatchPrefix,
                                        tagPrefix: `endpoints`,
                                    }}
                                    />
                                    <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
                                    <Col md={24}>
                                        <EForm>
                                            <EFields
                                                fieldConfigs={fieldConfigs}
                                                selectedTags={selectedTags[index]}
                                                handleChangeRedux={handleChangeRedux}
                                                reduxStore={data}
                                                keyPrefix={`${veri.keyPrefix}.${index}`}
                                                drawerIndex={index}
                                                version={veri.version}
                                            />
                                        </EForm>
                                    </Col>
                                </Row>
                                <ConditionalComponent
                                    shouldRender={startsWithAny("locality", selectedTags[index])}
                                    Component={CommonComponentLocality}
                                    componentProps={{
                                        version: veri.version,
                                        index: index,
                                        reduxStore: data.locality,
                                        keyPrefix: `${veri.keyPrefix}.${index}.locality`,
                                        tagMatchPrefix: `${veri.tagMatchPrefix}.locality`,
                                        id: `locality_0`,
                                    }}
                                />
                                <ConditionalComponent
                                    shouldRender={startsWithAny("lb_endpoints", selectedTags[index])}
                                    Component={LBEndpointComponent}
                                    componentProps={{
                                        version: veri.version,
                                        keyPrefix: `${veri.keyPrefix}.${index}.lb_endpoints`,
                                        drawerOpen: stateModal.show_lb_endpoints[index],
                                        reduxStore: data.lb_endpoints,
                                        tagMatchPrefix: `${veri.tagMatchPrefix}.lb_endpoints`,
                                        drawerClose: () => {
                                            const updatedState = { ...stateModal };
                                            updatedState.show_lb_endpoints[index] = false;
                                            setStateModal(updatedState);
                                        },
                                        id: `lb_endpoints_0`,
                                    }}
                                />
                            </>
                        ),
                    };
                })
                    : undefined}
            />
        </CCard>
    )
};


export default memorizeComponent(ComponentEndpoints, compareVeri);