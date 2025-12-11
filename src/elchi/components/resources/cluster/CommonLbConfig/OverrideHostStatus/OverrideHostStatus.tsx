import React from "react";
import { Col, Divider } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { FieldConfigType, matchesEndOrStartOf } from "@/utils/tools";
import { useTags } from "@/hooks/useTags";
import { modtag_override_host_status } from "./_modtag_";
import { generateFields } from "@/common/generate-fields";
import useResourceForm from "@/hooks/useResourceForm";
import ECard from "@/elchi/components/common/ECard";
import { EForm } from "../../../../common/e-components/EForm";
import { EFields } from "../../../../common/e-components/EFields";
import { ConditionalComponent } from "../../../../common/ConditionalComponent";
import ComponentStatuses from "./Statuses/Statuses";

type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
        id: string;
    }
};

const ComponentOverrideHostStatus: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_override_host_status);

    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.ohs?.HealthStatusSet,
            sf: vTags.ohs?.HealthStatusSet_SingleFields,
        }),
    ];

    return (
        <ECard title="Override Host Status" id={veri.id}>
            <HorizonTags veri={{
                tags: vTags.ohs?.HealthStatusSet,
                selectedTags: selectedTags || [],
                unsupportedTags: [],
                keyPrefix: veri.keyPrefix,
                handleChangeTag: handleChangeTag,
            }} />
            <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
            <Col md={24}>
                <EForm>
                    <EFields
                        fieldConfigs={fieldConfigs}
                        selectedTags={selectedTags || []}
                        handleChangeRedux={handleChangeRedux}
                        reduxStore={veri.reduxStore}
                        keyPrefix={veri.keyPrefix}
                        version={veri.version}
                    />
                </EForm>
                <ConditionalComponent
                    shouldRender={matchesEndOrStartOf("statuses", selectedTags || [])}
                    Component={ComponentStatuses}
                    componentProps={{
                        version: veri.version,
                        reduxStore: veri.reduxStore?.statuses,
                        keyPrefix: `${veri.keyPrefix}.statuses`,
                        id: `${veri.id}_statuses`
                    }}
                />
            </Col>
        </ECard>
    );
};

export default ComponentOverrideHostStatus;
