import React from "react";
import { memorizeComponent, compareVeriReduxStoreAndSelectedTags } from "@/hooks/useMemoComponent";
import { startsWithAny } from "@/utils/tools";
import ECard from "@/elchi/components/common/ECard";
import { useTags } from "@/hooks/useTags";
import { modtag_header_mutation } from "./_modtag_";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import useResourceForm from "@/hooks/useResourceForm";
import CommonComponentHeaderMutations from "@/elchi/components/resources/common/HeaderMutations/HeaderMutations";
import CommonComponentKeyValueMutation from "@/elchi/components/resources/common/KeyValueMutation/KeyValueMutation";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        reduxAction: any;
        keyPrefix?: string;
    }
};


const ComponentMutations: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags, loading } = useTags(veri.version, modtag_header_mutation);
    const { selectedTags, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    if (loading || !vTags.hm) {
        return null;
    }

    return (
        <ECard title="Mutations">
            <HorizonTags veri={{
                tags: vTags.hm?.Mutations,
                selectedTags: selectedTags,
                unsupportedTags: [],
                handleChangeTag: handleChangeTag,
                keyPrefix: veri.keyPrefix,
                tagPrefix: '',
                required: [],
            }} />

            <ConditionalComponent
                shouldRender={startsWithAny("request_mutations", selectedTags)}
                Component={CommonComponentHeaderMutations}
                componentProps={{
                    version: veri.version,
                    reduxStore: veri.reduxStore?.request_mutations,
                    keyPrefix: veri.keyPrefix ? `${veri.keyPrefix}.request_mutations` : "request_mutations",
                    tagMatchPrefix: veri.keyPrefix ? `${veri.keyPrefix}.request_mutations` : "request_mutations",
                    reduxAction: veri.reduxAction,
                    title: "Request Mutations"
                }}
            />

            <ConditionalComponent
                shouldRender={startsWithAny("query_parameter_mutations", selectedTags)}
                Component={CommonComponentKeyValueMutation}
                componentProps={{
                    version: veri.version,
                    reduxStore: veri.reduxStore?.query_parameter_mutations,
                    keyPrefix: veri.keyPrefix ? `${veri.keyPrefix}.query_parameter_mutations` : "query_parameter_mutations",
                    reduxAction: veri.reduxAction,
                    title: "Query Parameter Mutations"
                }}
            />

            <ConditionalComponent
                shouldRender={startsWithAny("response_mutations", selectedTags)}
                Component={CommonComponentHeaderMutations}
                componentProps={{
                    version: veri.version,
                    reduxStore: veri.reduxStore?.response_mutations,
                    keyPrefix: veri.keyPrefix ? `${veri.keyPrefix}.response_mutations` : "response_mutations",
                    tagMatchPrefix: veri.keyPrefix ? `${veri.keyPrefix}.response_mutations` : "response_mutations",
                    reduxAction: veri.reduxAction,
                    title: "Response Mutations"
                }}
            />

            <ConditionalComponent
                shouldRender={startsWithAny("response_trailers_mutations", selectedTags)}
                Component={CommonComponentHeaderMutations}
                componentProps={{
                    version: veri.version,
                    reduxStore: veri.reduxStore?.response_trailers_mutations,
                    keyPrefix: veri.keyPrefix ? `${veri.keyPrefix}.response_trailers_mutations` : "response_trailers_mutations",
                    tagMatchPrefix: veri.keyPrefix ? `${veri.keyPrefix}.response_trailers_mutations` : "response_trailers_mutations",
                    reduxAction: veri.reduxAction,
                    title: "Response Trailers Mutations"
                }}
            />

            <ConditionalComponent
                shouldRender={startsWithAny("request_trailers_mutations", selectedTags)}
                Component={CommonComponentHeaderMutations}
                componentProps={{
                    version: veri.version,
                    reduxStore: veri.reduxStore?.request_trailers_mutations,
                    keyPrefix: veri.keyPrefix ? `${veri.keyPrefix}.request_trailers_mutations` : "request_trailers_mutations",
                    tagMatchPrefix: veri.keyPrefix ? `${veri.keyPrefix}.request_trailers_mutations` : "request_trailers_mutations",
                    reduxAction: veri.reduxAction,
                    title: "Request Trailers Mutations"
                }}
            />
        </ECard>
    )
};

export default memorizeComponent(ComponentMutations, compareVeriReduxStoreAndSelectedTags);
