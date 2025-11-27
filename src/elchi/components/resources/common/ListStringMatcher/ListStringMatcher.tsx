import React from "react";
import { compareVeriReduxStoreAndSelectedTags, memorizeComponent } from "@/hooks/useMemoComponent";
import CommonComponentStringMatchers from "@/elchi/components/resources/common/StringMatcher/StringMatchers";
import { startsWithAny } from "@/utils/tools";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        reduxAction: any;
        keyPrefix?: string;
        title?: string;
    }
};


const CommonComponentListStringMatcher: React.FC<GeneralProps> = ({ veri }) => {
    // ListStringMatcher just wraps StringMatchers for the patterns array
    // No need for HorizonTags since there's only one field (patterns)

    return (
        <CommonComponentStringMatchers
            veri={{
                version: veri.version,
                reduxStore: veri.reduxStore?.patterns,
                reduxAction: veri.reduxAction,
                selectedTags: ["patterns"], // Always show patterns
                tag: "patterns",
                keyPrefix: veri.keyPrefix ? `${veri.keyPrefix}.patterns` : "patterns",
                tagMatchPrefix: "ListStringMatcher",
                title: veri.title || "String Matchers"
            }}
        />
    );
};

export default memorizeComponent(CommonComponentListStringMatcher, compareVeriReduxStoreAndSelectedTags);
