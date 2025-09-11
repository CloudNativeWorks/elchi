import React, { useState } from "react";
import { Col, Tabs, Row, Divider } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { memorizeComponent, compareVeri } from "@/hooks/useMemoComponent";
import { FieldConfigType, startsWithAny } from "@/utils/tools";
import { FieldTypes } from "@/common/statics/general";
import CCard from "@/elchi/components/common/CopyPasteCard";
import CommonComponentHeaderMatcher from "../common/HeaderMatcher/HeaderMatcher";
import useTabManager from "@/hooks/useTabManager";
import useResourceFormMultiple from "@/hooks/useResourceFormMultiple";
import { useTags } from "@/hooks/useTags";
import { modtag_virtual_cluster } from "./_modtag_";
import { useModels } from "@/hooks/useModels";
import { ConditionalComponent } from "../../common/ConditionalComponent";
import { EForm } from "../../common/e-components/EForm";
import { EFields } from "../../common/e-components/EFields";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any[] | undefined;
        reduxAction: any,
        keyPrefix: string,
        tagMatchPrefix: string,
    }
};

interface StateModal {
    show_headers: { [index: number]: boolean; }
}

const ComponentVirtualClusters: React.FC<GeneralProps> = ({ veri }) => {
    const { vModels } = useModels(veri.version, modtag_virtual_cluster);
    const { vTags } = useTags(veri.version, modtag_virtual_cluster);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceFormMultiple({
        version: veri.version,
        reduxStore: veri.reduxStore,
        keyPrefix: veri.keyPrefix,
        reduxAction: veri.reduxAction
    });

    const [stateModal, setStateModal] = useState<StateModal>({
        show_headers: {}
    });

    const { state, onChangeTabs, addTab } = useTabManager({
        initialActiveTab: "0",
        reduxStore: veri.reduxStore,
        keyPrefix: veri.keyPrefix,
        version: veri.version,
        reduxAction: veri.reduxAction
    });

    const fieldConfigs: FieldConfigType[] = [
        { tag: "name", type: FieldTypes.String, placeHolder: "(string)", fieldPath: 'name', required: true, spanNum: 8, },
        {
            tag: "headers", type: FieldTypes.ArrayIcon, spanNum: 8, fieldPath: 'headers', drawerShow: (index: number) => {
                const updatedState = { ...stateModal };
                updatedState.show_headers[index] = true;
                setStateModal(updatedState);
            }
        },
    ]

    return (
        <CCard reduxStore={veri.reduxStore} toJSON={vModels.vc?.VirtualCluster.toJSON} keys={`${veri.keyPrefix}`} Paste={handleChangeRedux} ctype="virtual_clusters" title="Virtual Clusters">
            <Tabs
                onChange={onChangeTabs}
                type="editable-card"
                activeKey={state.activeTab}
                onEdit={addTab}
                style={{ width: "100%" }}
                items={veri.reduxStore?.map((data: any, index: number) => {
                    return {
                        key: index.toString(),
                        label: "vcls: " + index.toString(),
                        forceRender: true,
                        children: (
                            <Row>
                                <HorizonTags veri={{
                                    tags: vTags.vc?.VirtualCluster,
                                    selectedTags: selectedTags[index],
                                    unsupportedTags: [],
                                    index: index,
                                    handleChangeTag: handleChangeTag,
                                    tagPrefix: `virtual_clusters`,
                                    tagMatchPrefix: `${veri.tagMatchPrefix}`,
                                    required: ['name']
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
                                <ConditionalComponent
                                    shouldRender={startsWithAny("headers", selectedTags[index])}
                                    Component={CommonComponentHeaderMatcher}
                                    componentProps={{
                                        version: veri.version,
                                        keyPrefix: `${veri.keyPrefix}.${index}.headers`,
                                        drawerOpen: stateModal.show_headers[index],
                                        reduxStore: data.headers,
                                        reduxAction: veri.reduxAction,
                                        tagMatchPrefix: `${veri.tagMatchPrefix}.headers`,
                                        parentName: "Headers",
                                        drawerClose: () => {
                                            const updatedState = { ...stateModal };
                                            updatedState.show_headers[index] = false;
                                            setStateModal(updatedState);
                                        },
                                        id: `${veri.keyPrefix}.${index}.headers`,
                                    }}
                                />
                            </Row>
                        ),
                    };
                })
                }
            />
        </CCard>
    )
};

export default memorizeComponent(ComponentVirtualClusters, compareVeri);
