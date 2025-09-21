import React from "react";
import { Col, Divider } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { memorizeComponent, compareVeri } from "@/hooks/useMemoComponent";
import { FieldTypes } from "@/common/statics/general";
import { FieldConfigType } from "@/utils/tools";
import { modtag_string_matcher } from "./_modtag_";
import { useTags } from "@/hooks/useTags";
import useResourceForm from "@/hooks/useResourceForm";
import ECard from "@/elchi/components/common/ECard";
import { generateFields } from "@/common/generate-fields";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import { EFields } from "@/elchi/components/common/e-components/EFields";


type GeneralProps = {
    veri: {
        version: string;
        reduxAction: any;
        reduxStore: any;
        keyPrefix: string;
        tagMatchPrefix: string;
        title: string;
    }
};

const CommonComponentStringMatcher: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_string_matcher);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        { tag: "safe_regex", type: FieldTypes.Regex, placeHolder: "(google regex)", fieldPath: 'match_pattern.safe_regex.regex', tagPrefix: `match_pattern.safe_regex`, navigate: true, spanNum: 18, required: true, additionalTags: ["regex"], },
        ...generateFields({
            f: vTags.sm?.StringMatcher,
            sf: vTags.sm?.StringMatcher_SingleFields,
            r: ['match_pattern.exact', 'match_pattern.prefix', 'match_pattern.suffix', 'match_pattern.contains', 'match_pattern.safe_regex'],
            sn: 12
        }),
    ];

    return (
        <ECard title={veri.title}>
            <Col md={24}>
                <EForm>
                    <HorizonTags key={"string_match"} veri={{
                        tags: vTags.sm?.StringMatcher,
                        selectedTags: selectedTags,
                        unsupportedTags: ["match_pattern.custom"],
                        handleChangeTag: handleChangeTag,
                        keyPrefix: veri.keyPrefix,
                        tagPrefix: ``,
                        tagMatchPrefix: `${veri.tagMatchPrefix}`,
                        required: ["exact", "suffix", "prefix", "contains", "safe_regex"],
                        specificTagPrefix: {
                            "exact": "match_pattern",
                            "suffix": "match_pattern",
                            "prefix": "match_pattern",
                            "contains": "match_pattern",
                            "safe_regex": "match_pattern"
                        },
                        onlyOneTag: [[
                            "match_pattern.exact",
                            "match_pattern.suffix",
                            "match_pattern.prefix",
                            "match_pattern.contains",
                            "match_pattern.safe_regex",
                        ]]
                    }} />
                    <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
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

export default memorizeComponent(CommonComponentStringMatcher, compareVeri);
