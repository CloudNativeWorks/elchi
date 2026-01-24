import React from "react";
import { Divider } from 'antd';
import { compareVeriReduxStoreAndSelectedTags, memorizeComponent } from "@/hooks/useMemoComponent";
import { FieldConfigType, startsWithAny } from "@/utils/tools";
import ECard from "@/elchi/components/common/ECard";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import { EFields } from "@/elchi/components/common/e-components/EFields";
import { useTags } from "@/hooks/useTags";
import { modtag_header_mutations } from "./_modtag_";
import { generateFields } from "@/common/generate-fields";
import CommonComponentHeaderValueOption from "../HeaderValueOption/HeaderValueOption";
import CommonComponentStringMatcher from "../StringMatcher/StringMatcher";
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


const CommonComponentHeaderMutation: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags, loading } = useTags(veri.version, modtag_header_mutations);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    if (loading || !vTags.hm) {
        return null;
    }

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.hm?.HeaderMutation,
            sf: vTags.hm?.HeaderMutation_SingleFields,
        }),
    ];

    return (
        <ECard title={veri.title || "Header Mutation"}>
            <HorizonTags veri={{
                tags: vTags.hm?.HeaderMutation,
                selectedTags: selectedTags,
                unsupportedTags: [],
                handleChangeTag: handleChangeTag,
                keyPrefix: veri.keyPrefix,
                tagPrefix: '',
                required: [],
                specificTagPrefix: {
                    "remove": "action",
                    "append": "action",
                    "remove_on_match": "action"
                },
                onlyOneTag: [["action.remove", "action.append", "action.remove_on_match"]]
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
                    shouldRender={startsWithAny("action.append", selectedTags)}
                    Component={CommonComponentHeaderValueOption}
                    componentProps={{
                        version: veri.version,
                        reduxStore: veri.reduxStore?.action?.append,
                        keyPrefix: veri.keyPrefix ? `${veri.keyPrefix}.append` : "append",
                        reduxAction: veri.reduxAction,
                        tagPrefix: "append",
                        title: "Header Value Option"
                    }}
                />

                <ConditionalComponent
                    shouldRender={startsWithAny("action.remove_on_match", selectedTags)}
                    Component={CommonComponentStringMatcher}
                    componentProps={{
                        version: veri.version,
                        reduxStore: veri.reduxStore?.action?.remove_on_match?.key_matcher,
                        keyPrefix: veri.keyPrefix ? `${veri.keyPrefix}.remove_on_match.key_matcher` : "remove_on_match.key_matcher",
                        tagMatchPrefix: veri.keyPrefix ? `${veri.keyPrefix}.remove_on_match.key_matcher` : "remove_on_match.key_matcher",
                        reduxAction: veri.reduxAction,
                        title: "Key Matcher"
                    }}
                />

            </EForm>
        </ECard>
    )
};

export default memorizeComponent(CommonComponentHeaderMutation, compareVeriReduxStoreAndSelectedTags);
