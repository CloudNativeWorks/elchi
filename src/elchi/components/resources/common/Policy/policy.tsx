import React from "react";
import { Col, Divider } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import CCard from "@/elchi/components/common/CopyPasteCard";
import { FieldConfigType, startsWithAny } from "@/utils/tools";
import useResourceForm from "@/hooks/useResourceForm";
import { useTags } from "@/hooks/useTags";
import { modtag_policy } from "./_modtag_";
import { useModels } from "@/hooks/useModels";
import { generateFields } from "@/common/generate-fields";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import { EFields } from "@/elchi/components/common/e-components/EFields";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";
import CommonComponentDropOverload from "./DropOverload";
import { modtag_us_cla } from "../../endpoint/_modtag_";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
        tagMatchPrefix: string;
    }
};

const ComponentPolicy: React.FC<GeneralProps> = ({ veri }) => {
    const { vModels } = useModels(veri.version, modtag_policy);
    const { vTags } = useTags(veri.version, modtag_policy);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.cp?.ClusterLoadAssignment_Policy,
            sf: vTags.cp?.ClusterLoadAssignment_Policy_SingleFields,
        }),
    ]

    return (
        <CCard reduxStore={veri.reduxStore} toJSON={vModels.cp?.ClusterLoadAssignment_Policy.toJSON} keys={veri.keyPrefix} Paste={handleChangeRedux} ctype="cla_policy" title="Policy">
            <HorizonTags veri={{
                tags: vTags.cp?.ClusterLoadAssignment_Policy,
                unsupportedTags: modtag_us_cla["policy"],
                selectedTags: selectedTags,
                keyPrefix: veri.keyPrefix,
                handleChangeTag: handleChangeTag,
                tagMatchPrefix: veri.tagMatchPrefix,
                tagPrefix: `policy`,
            }} />
            <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
            <Col md={24}>
                <ConditionalComponent
                    shouldRender={startsWithAny("drop_overloads", selectedTags)}
                    Component={CommonComponentDropOverload}
                    componentProps={{
                        version: veri.version,
                        keyPrefix: `${veri.keyPrefix}.drop_overloads`,
                        reduxStore: veri.reduxStore?.drop_overloads,
                        parentName: "Drop Overloads",
                        id: `${veri.keyPrefix}.drop_overloads`,
                        title: "Drop Overloads",
                    }}
                />
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
        </CCard>
    )
};


export default memorizeComponent(ComponentPolicy, compareVeri);