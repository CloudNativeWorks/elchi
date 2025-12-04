import React from "react";
import { Col, Row, Divider } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import { FieldConfigType, matchesEndOrStartOf } from "@/utils/tools";
import useResourceForm from "@/hooks/useResourceForm";
import { useTags } from "@/hooks/useTags";
import { modtag_overload_manager } from "../_modtag_";
import { generateFields } from "@/common/generate-fields";
import ECard from "../../../common/ECard";
import { EForm } from "../../../common/e-components/EForm";
import { EFields } from "../../../common/e-components/EFields";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";
import ComponentResourceMonitors from "./ResourceMonitors";
import ComponentOverloadActions from "./OverloadActions";
import ComponentLoadShedPoints from "./LoadShedPoints";
import ComponentBufferFactoryConfig from "./BufferFactoryConfig";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
        id?: string;
    }
};

const ComponentOverloadManager: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_overload_manager);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.om?.OverloadManager,
            sf: vTags.om?.OverloadManager_SingleFields,
        }),
    ]

    return (
        <ECard title="Overload Manager" id={veri.id}>
            <HorizonTags veri={{
                tags: vTags.om?.OverloadManager,
                unsupportedTags: [],
                selectedTags: selectedTags,
                keyPrefix: veri.keyPrefix,
                handleChangeTag: handleChangeTag,
            }} />
            <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
            <Row>
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

                    <ConditionalComponent
                        shouldRender={matchesEndOrStartOf("resource_monitors", selectedTags)}
                        Component={ComponentResourceMonitors}
                        componentProps={{
                            version: veri.version,
                            keyPrefix: `${veri.keyPrefix}.resource_monitors`,
                            tagMatchPrefix: `OverloadManager.resource_monitors`,
                            reduxStore: veri.reduxStore?.resource_monitors,
                            id: `resource_monitors_0`,
                            title: "Resource Monitors",
                        }}
                    />

                    <ConditionalComponent
                        shouldRender={matchesEndOrStartOf("actions", selectedTags)}
                        Component={ComponentOverloadActions}
                        componentProps={{
                            version: veri.version,
                            keyPrefix: `${veri.keyPrefix}.actions`,
                            tagMatchPrefix: `OverloadManager.actions`,
                            reduxStore: veri.reduxStore?.actions,
                            id: `actions_0`,
                            title: "Overload Actions",
                        }}
                    />

                    <ConditionalComponent
                        shouldRender={matchesEndOrStartOf("loadshed_points", selectedTags)}
                        Component={ComponentLoadShedPoints}
                        componentProps={{
                            version: veri.version,
                            keyPrefix: `${veri.keyPrefix}.loadshed_points`,
                            tagMatchPrefix: `OverloadManager.loadshed_points`,
                            reduxStore: veri.reduxStore?.loadshed_points,
                            id: `loadshed_points_0`,
                            title: "LoadShed Points",
                        }}
                    />

                    <ConditionalComponent
                        shouldRender={matchesEndOrStartOf("buffer_factory_config", selectedTags)}
                        Component={ComponentBufferFactoryConfig}
                        componentProps={{
                            version: veri.version,
                            keyPrefix: `${veri.keyPrefix}.buffer_factory_config`,
                            tagMatchPrefix: `OverloadManager.buffer_factory_config`,
                            reduxStore: veri.reduxStore?.buffer_factory_config,
                            id: `buffer_factory_config_0`,
                            title: "Buffer Factory Config",
                        }}
                    />
                </Col>
            </Row>
        </ECard>
    )
};


export default memorizeComponent(ComponentOverloadManager, compareVeri);
