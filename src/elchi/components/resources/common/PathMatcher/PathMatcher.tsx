import React from "react";
import { Col, Divider } from 'antd';
import ECard from "@/elchi/components/common/ECard";
import { useTags } from "@/hooks/useTags";
import { modtag_path_matcher } from "./_modtag_";
import useResourceForm from "@/hooks/useResourceForm";
import { startsWithAny } from "@/utils/tools";
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import CommonComponentStringMatcher from "@resources/common/StringMatcher/StringMatcher";
import { ResourceAction } from "@/redux/reducers/slice";
import { navigateCases } from "@/elchi/helpers/navigate-cases";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";


type GeneralProps = {
    veri: {
        version: string;
        title: string;
        keyPrefix: string;
        reduxStore: any | undefined;
    }
};

const CommonComponentPathMatcher: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_path_matcher);
    const { selectedTags, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    return (
        <ECard title={veri.title}>
            <HorizonTags veri={{
                tags: vTags.pm?.PathMatcher,
                selectedTags: selectedTags,
                unsupportedTags: [],
                handleChangeTag: handleChangeTag,
                keyPrefix: `${veri.keyPrefix}`,
                required: ["path"],
                specificTagPrefix: { 'path': 'rule' }
            }} />
            <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
            <Col md={24}>
                <ConditionalComponent
                    shouldRender={startsWithAny("rule", selectedTags)}
                    Component={CommonComponentStringMatcher}
                    componentProps={{
                        version: veri.version,
                        reduxAction: ResourceAction,
                        reduxStore: navigateCases(veri.reduxStore, "rule.path"),
                        keyPrefix: `${veri.keyPrefix}.path`,
                        tagMatchPrefix: "rule",
                        title: "Path",
                        id: `rule_0`,
                    }}
                />
            </Col>
        </ECard>
    )
};

export default memorizeComponent(CommonComponentPathMatcher, compareVeri);
