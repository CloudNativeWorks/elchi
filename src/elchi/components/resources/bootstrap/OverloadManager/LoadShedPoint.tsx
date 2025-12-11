import React from "react";
import { Col, Row, Divider } from "antd";
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import { matchesEndOrStartOf } from "@/utils/tools";
import useResourceForm from "@/hooks/useResourceForm";
import { useTags } from "@/hooks/useTags";
import { modtag_loadshed_point } from "../_modtag_";
import { EForm } from "../../../common/e-components/EForm";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";
import ComponentTriggers from "./Triggers";
import { FieldComponent } from "@/elchi/components/common/FormItems";
import { FieldTypes } from "@/common/statics/general";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
        tagMatchPrefix: string;
    }
};

const ComponentLoadShedPoint: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_loadshed_point);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    return (
        <>
            <HorizonTags veri={{
                tags: vTags.lsp?.LoadShedPoint,
                unsupportedTags: ['name'],
                selectedTags: selectedTags,
                keyPrefix: veri.keyPrefix,
                handleChangeTag: handleChangeTag,
            }} />
            <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
            <Row>
                <Col md={24}>
                    <EForm>
                        <FieldComponent
                            veri={{
                                alwaysShow: true,
                                selectedTags: [],
                                handleChange: handleChangeRedux,
                                tag: "name",
                                value: veri.reduxStore?.name,
                                type: FieldTypes.String,
                                placeholder: "(LoadShed Point Name)",
                                keyPrefix: veri.keyPrefix,
                                spanNum: 24,
                                required: true,
                                displayName: "Name",
                            }}
                        />
                    </EForm>

                    <ConditionalComponent
                        shouldRender={matchesEndOrStartOf("triggers", selectedTags)}
                        Component={ComponentTriggers}
                        componentProps={{
                            version: veri.version,
                            keyPrefix: `${veri.keyPrefix}.triggers`,
                            tagMatchPrefix: `${veri.tagMatchPrefix}.triggers`,
                            reduxStore: veri.reduxStore?.triggers,
                            id: `loadshed_triggers_0`,
                            title: "Triggers",
                        }}
                    />
                </Col>
            </Row>
        </>
    )
};


export default memorizeComponent(ComponentLoadShedPoint, compareVeri);
