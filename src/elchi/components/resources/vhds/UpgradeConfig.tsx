import React from "react";
import { Col, Divider, Row, Tabs } from 'antd';
import { memorizeComponent, compareVeri } from "@/hooks/useMemoComponent";
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { FieldConfigType } from "@/utils/tools";
import useResourceForm from "@/hooks/useResourceForm";
import useTabManager from "@/hooks/useTabManager";
import ECard from "../../common/ECard";
import { modtag_upgrade_config } from "./_modtag_";
import { useTags } from "@/hooks/useTags";
import { generateFields } from "@/common/generate-fields";
import { EForm } from "../../common/e-components/EForm";
import { EFields } from "../../common/e-components/EFields";


type GeneralProps = {
    veri: {
        version: string;
        keyPrefix: string;
        reduxStore: any[] | undefined;
        reduxAction: any;
        tagMatchPrefix: string;
    }
};

type GeneralPropsChild = {
    veri: {
        version: string;
        keyPrefix: string;
        reduxStore: any;
        reduxAction: any;
        tagMatchPrefix: string;
    }
};

const ComponentUpgradeConfig: React.FC<GeneralProps> = ({ veri }) => {
    const { state, onChangeTabs, addTab } = useTabManager({
        initialActiveTab: "0",
        reduxStore: veri.reduxStore,
        keyPrefix: veri.keyPrefix,
        version: veri.version,
        reduxAction: veri.reduxAction
    });

    return (
        <ECard title={'Upgrade Config'}>
            <Tabs
                onChange={onChangeTabs}
                type="editable-card"
                activeKey={state.activeTab}
                onEdit={addTab}
                style={{ width: "100%" }}
                items={veri.reduxStore?.map((data: any, index: number) => {
                    return {
                        key: index.toString(),
                        label: `UC: ${index}`,
                        forceRender: true,
                        children: (
                            <ComponentUpgradeConfigChild veri={{
                                version: veri.version,
                                reduxAction: veri.reduxAction,
                                reduxStore: data,
                                keyPrefix: `${veri.keyPrefix}.${index}`,
                                tagMatchPrefix: veri.tagMatchPrefix
                            }} />
                        ),
                    };
                })
                }
            />
        </ECard>
    )
};


const ComponentUpgradeConfigChild: React.FC<GeneralPropsChild> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_upgrade_config);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.uc?.RouteAction_UpgradeConfig,
            sf: vTags.uc?.RouteAction_UpgradeConfig_SingleFields,
        })
    ]

    return (
        <Row>
            <HorizonTags veri={{
                tags: vTags.uc?.RouteAction_UpgradeConfig,
                unsupportedTags: ['connect_config'],
                selectedTags: selectedTags,
                handleChangeTag: handleChangeTag,
                tagPrefix: `upgrade_configs`,
                tagMatchPrefix: `${veri.tagMatchPrefix}`,
                keyPrefix: veri.keyPrefix,
            }} />
            <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
            <Col md={24}>
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
            </Col>
        </Row>
    )
};

export default memorizeComponent(ComponentUpgradeConfig, compareVeri);
