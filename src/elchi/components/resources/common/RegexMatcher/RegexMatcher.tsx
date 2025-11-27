import React from "react";
import { Divider } from 'antd';
import { compareVeriReduxStoreAndSelectedTags, memorizeComponent } from "@/hooks/useMemoComponent";
import { FieldConfigType, startsWithAny } from "@/utils/tools";
import ECard from "@/elchi/components/common/ECard";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import { EFields } from "@/elchi/components/common/e-components/EFields";
import { useTags } from "@/hooks/useTags";
import { modtag_regex_matcher } from "./_modtag_";
import { generateFields } from "@/common/generate-fields";
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import useResourceForm from "@/hooks/useResourceForm";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";
import CommonComponentGoogleRE2 from "../GoogleRE2/GoogleRE2";


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


const CommonComponentRegexMatcher: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags, loading } = useTags(veri.version, modtag_regex_matcher);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    if (loading || !vTags.rm) {
        return null;
    }

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.rm?.RegexMatcher,
            sf: vTags.rm?.RegexMatcher_SingleFields,
        }),
    ];

    console.log(selectedTags)

    return (
        <ECard title={veri.title || "Regex Matcher"}>
            <HorizonTags veri={{
                tags: vTags.rm?.RegexMatcher,
                selectedTags: selectedTags,
                unsupportedTags: [],
                handleChangeTag: handleChangeTag,
                keyPrefix: veri.keyPrefix,
                tagPrefix: '',
                specificTagPrefix: {'google_re2': 'engine_type'},
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
                    shouldRender={startsWithAny("engine_type.google_re2", selectedTags)}
                    Component={CommonComponentGoogleRE2}
                    componentProps={{
                        version: veri.version,
                        reduxStore: veri.reduxStore?.google_re2,
                        keyPrefix: veri.keyPrefix ? `${veri.keyPrefix}.google_re2` : "google_re2",
                        reduxAction: veri.reduxAction,
                        tagPrefix: "google_re2",
                        title: "Google RE2"
                    }}
                />
            </EForm>
        </ECard>
    )
};

export default memorizeComponent(CommonComponentRegexMatcher, compareVeriReduxStoreAndSelectedTags);
