import React from "react";
import { Col, Row, Divider } from "antd";
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import { FieldConfigType } from "@/utils/tools";
import useResourceForm from "@/hooks/useResourceForm";
import { useTags } from "@/hooks/useTags";
import { modtag_trigger } from "../_modtag_";
import { generateFields } from "@/common/generate-fields";
import { EFields } from "../../../common/e-components/EFields";
import ECard from "../../../common/ECard";
import { HorizonTags } from "@/elchi/components/common/HorizonTags";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
        tagMatchPrefix: string;
        id?: string;
        title: string;
    }
};

const ComponentScaledTrigger: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_trigger);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.tr?.ScaledTrigger,
            sf: vTags.tr?.ScaledTrigger_SingleFields,
        }),
    ]

    return (
        <ECard title={veri.title} id={veri.id}>
            <HorizonTags veri={{
                tags: vTags.tr?.ScaledTrigger,
                unsupportedTags: [],
                selectedTags: selectedTags,
                keyPrefix: veri.keyPrefix,
                handleChangeTag: handleChangeTag,
            }} />
            <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
            <Row>
                <Col md={24}>
                    <EFields
                        fieldConfigs={fieldConfigs}
                        selectedTags={selectedTags}
                        handleChangeRedux={handleChangeRedux}
                        reduxStore={veri.reduxStore}
                        keyPrefix={veri.keyPrefix}
                        version={veri.version}
                    />
                </Col>
            </Row>
        </ECard>
    )
};


export default memorizeComponent(ComponentScaledTrigger, compareVeri);
