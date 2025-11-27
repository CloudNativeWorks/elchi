import React from "react";
import { Divider } from 'antd';
import { compareVeriReduxStoreAndSelectedTags, memorizeComponent } from "@/hooks/useMemoComponent";
import { FieldConfigType, startsWithAny } from "@/utils/tools";
import ECard from "@/elchi/components/common/ECard";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import { EFields } from "@/elchi/components/common/e-components/EFields";
import { useTags } from "@/hooks/useTags";
import { modtag_header_mutation_rules } from "./_modtag_";
import { generateFields } from "@/common/generate-fields";
import CommonComponentRegexMatcher from "../RegexMatcher/RegexMatcher";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import useResourceForm from "@/hooks/useResourceForm";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        reduxAction: any;
        keyPrefix?: string;
        tagPrefix?: string;
        title?: string;
    }
};


const CommonComponentHeaderMutationRules: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags, loading } = useTags(veri.version, modtag_header_mutation_rules);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    if (loading || !vTags.hmr) {
        return null;
    }

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.hmr?.HeaderMutationRules,
            sf: vTags.hmr?.HeaderMutationRules_SingleFields,
        }),
    ];

    return (
        <ECard title={veri.title || "Header Mutation Rules"}>
            <HorizonTags veri={{
                tags: vTags.hmr?.HeaderMutationRules,
                selectedTags: selectedTags,
                unsupportedTags: [],
                handleChangeTag: handleChangeTag,
                keyPrefix: veri.keyPrefix,
                tagPrefix: '',
                required: [],
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
                <ConditionalComponent
                    shouldRender={startsWithAny("allow_expression", selectedTags)}
                    Component={CommonComponentRegexMatcher}
                    componentProps={{
                        version: veri.version,
                        reduxStore: veri.reduxStore?.allow_expression,
                        keyPrefix: veri.keyPrefix ? `${veri.keyPrefix}.allow_expression` : "allow_expression",
                        reduxAction: veri.reduxAction,
                        tagPrefix: "allow_expression",
                        title: "Allow Expression"
                    }}
                />

                <ConditionalComponent
                    shouldRender={startsWithAny("disallow_expression", selectedTags)}
                    Component={CommonComponentRegexMatcher}
                    componentProps={{
                        version: veri.version,
                        reduxStore: veri.reduxStore?.disallow_expression,
                        keyPrefix: veri.keyPrefix ? `${veri.keyPrefix}.disallow_expression` : "disallow_expression",
                        reduxAction: veri.reduxAction,
                        tagPrefix: "disallow_expression",
                        title: "Disallow Expression"
                    }}
                />
            </EForm>
        </ECard>
    )
};

export default memorizeComponent(CommonComponentHeaderMutationRules, compareVeriReduxStoreAndSelectedTags);
