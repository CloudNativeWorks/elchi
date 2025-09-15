import React from "react";
import { Col, Divider, Drawer } from 'antd';
import { HorizonTags } from '@/elchi/components/common/HorizonTags';
import { navigateCases } from "@/elchi/helpers/navigate-cases";
import { FieldConfigType, startsWithAny } from '@/utils/tools';
import { FieldTypes } from '@/common/statics/general';
import { useTags } from "@/hooks/useTags";
import { modtag_header_matcher } from "./_modtag_";
import CommonComponentStringMatcher from '../StringMatcher/StringMatcher'
import { generateFields } from "@/common/generate-fields";
import useResourceForm from "@/hooks/useResourceForm";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import { EFields } from "@/elchi/components/common/e-components/EFields";
import ElchiButton from "@/elchi/components/common/ElchiButton";


type GeneralProps = {
    veri: {
        version: string;
        keyPrefix: string;
        drawerOpen: boolean;
        reduxStore: any[] | undefined;
        reduxAction: any;
        tagMatchPrefix: string;
        parentName: string;
        drawerClose: () => void;
    }
};

const CommonComponentHeaderMatcher: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_header_matcher);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.hm?.HeaderMatcher,
            sf: vTags.hm?.HeaderMatcher_SingleFields,
            r: ["name"]
        }),
        { tag: "range_match", type: FieldTypes.Range, additionalTags: ["start", "end", "range_match"], tagPrefix: 'header_match_specifier.range_match', fieldPath: 'range_match', spanNum: 8, required: true, range: { start: 'header_match_specifier.range_match.start', end: 'header_match_specifier.range_match.end' } },
    ];

    return (
        <Drawer
            key={`draver_${veri.keyPrefix}`}
            title={`${veri.parentName} (Header Matcher)`}
            placement="right"
            closable={false}
            open={veri.drawerOpen}
            onClose={veri.drawerClose}
            size='large'
            width={900}
        >
            <HorizonTags veri={{
                tags: vTags.hm?.HeaderMatcher,
                selectedTags: selectedTags,
                unsupportedTags: ["exact_match", "safe_regex_match", "prefix_match", "suffix_match", "contains_match"],
                handleChangeTag: handleChangeTag,
                tagPrefix: `header_match_specifier`,
                keyPrefix: `${veri.keyPrefix}`,
                required: ["name", "range_match", "present_match", "string_match"],
                hiddenTags: ["exact_match", "safe_regex_match", "prefix_match", "suffix_match", "contains_match"],
                onlyOneTag: [["header_match_specifier.present_match", "header_match_specifier.string_match", "header_match_specifier.range_match"]]
            }} />
            <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
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
                    shouldRender={startsWithAny("header_match_specifier.string_match", selectedTags)}
                    Component={CommonComponentStringMatcher}
                    componentProps={{
                        version: veri.version,
                        reduxAction: veri.reduxAction,
                        reduxStore: navigateCases(veri.reduxStore, "header_match_specifier.string_match"),
                        keyPrefix: `${veri.keyPrefix}.string_match`,
                        tagMatchPrefix: `${veri.tagMatchPrefix}.header_match_specifier.string_match`,
                        title: "String Match",
                        id: `header_match_specifier.string_match_0`,
                    }}
                />
            </Col>
            <ElchiButton onlyText style={{ marginTop: 15 }} onClick={() => veri.drawerClose()}>Close</ElchiButton>
        </Drawer>
    )
};

export default CommonComponentHeaderMatcher;

