import React from "react";
import { Col, Divider } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { memorizeComponent, compareVeri } from "@/hooks/useMemoComponent";
import { FieldConfigType, prettyTag } from "@/utils/tools";
import { FieldTypes } from "@/common/statics/general";
import useResourceForm from "@/hooks/useResourceForm";
import ECard from "@/elchi/components/common/ECard";
import { useTags } from "@/hooks/useTags";
import { modtag_regex } from "./_modtag_";
import { generateFields } from "@/common/generate-fields";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import { EFields } from "@/elchi/components/common/e-components/EFields";


type GeneralProps = {
    veri: {
        version: string;
        reduxAction: any;
        reduxStore: any;
        keyPrefix: string;
        tagPrefix: string;
        tagMatchPrefix: string;
        prettyName?: string;
    }
};

const CommonComponentRegexMatchAndSubstitute: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_regex);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        { tag: "pattern", type: FieldTypes.Regex, placeHolder: "(google regex)", fieldPath: 'pattern.regex', additionalTags: ['regex'], spanNum: 24, navigate: true },
        ...generateFields({
            f: vTags.rmas?.RegexMatchAndSubstitute,
            sf: vTags.rmas?.RegexMatchAndSubstitute_SingleFields,
            ssn: {"substitution": 24}
        })
    ];

    return (
        <ECard title={` ${veri.prettyName ? veri.prettyName : prettyTag(veri.tagPrefix)} -> Regex Match And Substitute`}>
            <Col md={24}>
                <HorizonTags veri={{
                    tags: vTags.rmas?.RegexMatchAndSubstitute,
                    selectedTags: selectedTags,
                    tagPrefix: '',
                    keyPrefix: veri.keyPrefix,
                    tagMatchPrefix: veri.tagMatchPrefix,
                    handleChangeTag: handleChangeTag,
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
            </Col>
        </ECard>
    )
};

export default memorizeComponent(CommonComponentRegexMatchAndSubstitute, compareVeri);
