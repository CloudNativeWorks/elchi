import React from "react";
import { Col, Divider, Tabs, Row } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import CCard from "@/elchi/components/common/CopyPasteCard";
import { FieldConfigType } from "@/utils/tools";
import useResourceFormMultiple from "@/hooks/useResourceFormMultiple";
import { useTags } from "@/hooks/useTags";
import { modtag_upgrade_configs } from "./_modtag_";
import { useModels } from "@/hooks/useModels";
import { generateFields } from "@/common/generate-fields";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import { EFields } from "@/elchi/components/common/e-components/EFields";
import { ResourceAction } from "@/redux/reducers/slice";
import useTabManager from "@/hooks/useTabManager";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
        tagMatchPrefix: string;
    }
};

const ComponentUpgradeConfigs: React.FC<GeneralProps> = ({ veri }) => {
    const { vModels } = useModels(veri.version, modtag_upgrade_configs);
    const { vTags } = useTags(veri.version, modtag_upgrade_configs);
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
        ...generateFields({
            f: vTags.uc?.HttpConnectionManager_UpgradeConfig,
            sf: vTags.uc?.HttpConnectionManager_UpgradeConfig_SingleFields,
        }),
    ]

    return (
        <CCard reduxStore={veri.reduxStore} toJSON={vModels.uc?.HttpConnectionManager_UpgradeConfig.toJSON} keys={veri.keyPrefix} Paste={handleChangeRedux} ctype="cla_policy" version={veri.version} title="Upgrade Configs">
            <Tabs
                onChange={onChangeTabs}
                type="editable-card"
                activeKey={state.activeTab}
                onEdit={addTab}
                style={{ width: "99%" }}
                items={Array.isArray(veri.reduxStore) ? veri.reduxStore?.map((data: any, index: number) => {
                    return {
                        key: index.toString(),
                        label: "Config: " + index,
                        forceRender: true,
                        children: (
                            <>
                                <Row>
                                    <HorizonTags veri={{
                                        tags: vTags.uc?.HttpConnectionManager_UpgradeConfig,
                                        unsupportedTags: ["filters"],
                                        selectedTags: selectedTags[index],
                                        index: index,
                                        handleChangeTag: handleChangeTag,
                                        tagMatchPrefix: veri.tagMatchPrefix,
                                        tagPrefix: ``,
                                    }} />
                                </Row>
                                <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
                                <Col md={24}>
                                    <EForm>
                                        <EFields
                                            fieldConfigs={fieldConfigs}
                                            selectedTags={selectedTags[index]}
                                            handleChangeRedux={handleChangeRedux}
                                            reduxStore={data}
                                            keyPrefix={`${veri.keyPrefix}.${index}`}
                                            version={veri.version}
                                        />
                                    </EForm>
                                </Col>
                            </>
                        )
                    }
                }) : []}
            />
        </CCard>
    )
};


export default memorizeComponent(ComponentUpgradeConfigs, compareVeri);