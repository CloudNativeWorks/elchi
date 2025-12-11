import React from "react";
import { Divider } from 'antd';
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import { FieldConfigType, startsWithAny } from "@/utils/tools";
import ECard from "@/elchi/components/common/ECard";
import { EFields } from "@/elchi/components/common/e-components/EFields";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import { useTags } from "@/hooks/useTags";
import { modtag_authorization_request } from "./_modtag_";
import { generateFields } from "@/common/generate-fields";
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import useResourceForm from "@/hooks/useResourceForm";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";
import CommonComponentListStringMatcher from "@/elchi/components/resources/common/ListStringMatcher/ListStringMatcher";
import CommonComponentHeaderValues from "@/elchi/components/resources/common/HeaderValue/HeaderValues";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
        reduxAction: any;
        title?: string;
    }
};

const ComponentAuthorizationRequest: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_authorization_request);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.ar?.AuthorizationRequest,
            sf: vTags.ar?.AuthorizationRequest_SingleFields,
        })
    ];

    return (
        <ECard title={veri.title || "Authorization Request"}>
            <HorizonTags veri={{
                tags: vTags.ar?.AuthorizationRequest,
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
                shouldRender={startsWithAny("allowed_headers", selectedTags)}
                Component={CommonComponentListStringMatcher}
                componentProps={{
                    version: veri.version,
                    reduxStore: veri.reduxStore?.allowed_headers,
                    keyPrefix: `${veri.keyPrefix}.allowed_headers`,
                    reduxAction: veri.reduxAction,
                    title: "Allowed Headers",
                    id: "authorization_request_allowed_headers_0"
                }}
            />

            <ConditionalComponent
                shouldRender={startsWithAny("headers_to_add", selectedTags)}
                Component={CommonComponentHeaderValues}
                componentProps={{
                    version: veri.version,
                    reduxStore: veri.reduxStore?.headers_to_add,
                    reduxAction: veri.reduxAction,
                    selectedTags: selectedTags,
                    tag: "headers_to_add",
                    keyPrefix: `${veri.keyPrefix}.headers_to_add`,
                    tagMatchPrefix: "AuthorizationRequest",
                    title: "Headers To Add",
                }}
            />
        </ECard>
    )
};

export default memorizeComponent(ComponentAuthorizationRequest, compareVeri);
