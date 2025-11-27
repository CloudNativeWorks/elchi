import React from "react";
import { Divider } from 'antd';
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import { FieldConfigType, startsWithAny } from "@/utils/tools";
import ECard from "@/elchi/components/common/ECard";
import { EFields } from "@/elchi/components/common/e-components/EFields";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import { useTags } from "@/hooks/useTags";
import { modtag_authorization_response } from "./_modtag_";
import { generateFields } from "@/common/generate-fields";
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import useResourceForm from "@/hooks/useResourceForm";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";
import CommonComponentListStringMatcher from "@/elchi/components/resources/common/ListStringMatcher/ListStringMatcher";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
        reduxAction: any;
        title?: string;
    }
};

const ComponentAuthorizationResponse: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_authorization_response);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.ares?.AuthorizationResponse,
            sf: vTags.ares?.AuthorizationResponse_SingleFields,
        })
    ];

    return (
        <ECard title={veri.title || "Authorization Response"}>
            <HorizonTags veri={{
                tags: vTags.ares?.AuthorizationResponse,
                selectedTags: selectedTags,
                unsupportedTags: [],
                handleChangeTag: handleChangeTag,
                keyPrefix: veri.keyPrefix,
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

            <ConditionalComponent
                shouldRender={startsWithAny("allowed_upstream_headers", selectedTags)}
                Component={CommonComponentListStringMatcher}
                componentProps={{
                    version: veri.version,
                    reduxStore: veri.reduxStore?.allowed_upstream_headers,
                    keyPrefix: `${veri.keyPrefix}.allowed_upstream_headers`,
                    reduxAction: veri.reduxAction,
                    title: "Allowed Upstream Headers",
                    id: "authorization_response_allowed_upstream_headers_0"
                }}
            />

            <ConditionalComponent
                shouldRender={startsWithAny("allowed_upstream_headers_to_append", selectedTags)}
                Component={CommonComponentListStringMatcher}
                componentProps={{
                    version: veri.version,
                    reduxStore: veri.reduxStore?.allowed_upstream_headers_to_append,
                    keyPrefix: `${veri.keyPrefix}.allowed_upstream_headers_to_append`,
                    reduxAction: veri.reduxAction,
                    title: "Allowed Upstream Headers To Append",
                    id: "authorization_response_allowed_upstream_headers_to_append_0"
                }}
            />

            <ConditionalComponent
                shouldRender={startsWithAny("allowed_client_headers", selectedTags)}
                Component={CommonComponentListStringMatcher}
                componentProps={{
                    version: veri.version,
                    reduxStore: veri.reduxStore?.allowed_client_headers,
                    keyPrefix: `${veri.keyPrefix}.allowed_client_headers`,
                    reduxAction: veri.reduxAction,
                    title: "Allowed Client Headers",
                    id: "authorization_response_allowed_client_headers_0"
                }}
            />

            <ConditionalComponent
                shouldRender={startsWithAny("allowed_client_headers_on_success", selectedTags)}
                Component={CommonComponentListStringMatcher}
                componentProps={{
                    version: veri.version,
                    reduxStore: veri.reduxStore?.allowed_client_headers_on_success,
                    keyPrefix: `${veri.keyPrefix}.allowed_client_headers_on_success`,
                    reduxAction: veri.reduxAction,
                    title: "Allowed Client Headers On Success",
                    id: "authorization_response_allowed_client_headers_on_success_0"
                }}
            />

            <ConditionalComponent
                shouldRender={startsWithAny("dynamic_metadata_from_headers", selectedTags)}
                Component={CommonComponentListStringMatcher}
                componentProps={{
                    version: veri.version,
                    reduxStore: veri.reduxStore?.dynamic_metadata_from_headers,
                    keyPrefix: `${veri.keyPrefix}.dynamic_metadata_from_headers`,
                    reduxAction: veri.reduxAction,
                    title: "Dynamic Metadata From Headers",
                    id: "authorization_response_dynamic_metadata_from_headers_0"
                }}
            />
        </ECard>
    )
};

export default memorizeComponent(ComponentAuthorizationResponse, compareVeri);
