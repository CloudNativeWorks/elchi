import React from "react";
import { Divider } from 'antd';
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import { FieldConfigType, startsWithAny } from "@/utils/tools";
import ECard from "@/elchi/components/common/ECard";
import { EFields } from "@/elchi/components/common/e-components/EFields";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import { useTags } from "@/hooks/useTags";
import { modtag_http_service } from "./_modtag_";
import { generateFields } from "@/common/generate-fields";
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import useResourceForm from "@/hooks/useResourceForm";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";
import CommonComponentHttpUri from "@/elchi/components/resources/common/HttpUri/HttpUri";
import CommonComponentRetryPolicy from "@/elchi/components/resources/common/RetryPolicy/RetryPolicy";
import ComponentAuthorizationRequest from "./AuthorizationRequest/AuthorizationRequest";
import ComponentAuthorizationResponse from "./AuthorizationResponse/AuthorizationResponse";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
        reduxAction: any;
        title?: string;
    }
};

const ComponentHttpService: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_http_service);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.hs?.HttpService,
            sf: vTags.hs?.HttpService_SingleFields,
        })
    ];

    return (
        <ECard title={veri.title || "HTTP Service"}>
            <HorizonTags veri={{
                tags: vTags.hs?.HttpService,
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
                shouldRender={startsWithAny("server_uri", selectedTags)}
                Component={CommonComponentHttpUri}
                componentProps={{
                    version: veri.version,
                    reduxStore: veri.reduxStore?.server_uri,
                    keyPrefix: `${veri.keyPrefix}.server_uri`,
                    title: "Server URI",
                }}
            />

            <ConditionalComponent
                shouldRender={startsWithAny("authorization_request", selectedTags)}
                Component={ComponentAuthorizationRequest}
                componentProps={{
                    version: veri.version,
                    reduxStore: veri.reduxStore?.authorization_request,
                    keyPrefix: `${veri.keyPrefix}.authorization_request`,
                    reduxAction: veri.reduxAction,
                    title: "Authorization Request",
                }}
            />

            <ConditionalComponent
                shouldRender={startsWithAny("authorization_response", selectedTags)}
                Component={ComponentAuthorizationResponse}
                componentProps={{
                    version: veri.version,
                    reduxStore: veri.reduxStore?.authorization_response,
                    keyPrefix: `${veri.keyPrefix}.authorization_response`,
                    reduxAction: veri.reduxAction,
                    title: "Authorization Response",
                }}
            />

            <ConditionalComponent
                shouldRender={startsWithAny("retry_policy", selectedTags)}
                Component={CommonComponentRetryPolicy}
                componentProps={{
                    version: veri.version,
                    reduxStore: veri.reduxStore?.retry_policy,
                    keyPrefix: `${veri.keyPrefix}.retry_policy`,
                    reduxAction: veri.reduxAction,
                    tagMatchPrefix: "HttpService",
                    title: "Retry Policy",
                    id: `retry_policy_${veri.keyPrefix}`,
                }}
            />
        </ECard>
    )
};

export default memorizeComponent(ComponentHttpService, compareVeri);
