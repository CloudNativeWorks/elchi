import React from "react";
import { Divider } from 'antd';
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import { FieldConfigType, startsWithAny } from "@/utils/tools";
import ECard from "@/elchi/components/common/ECard";
import { EFields } from "@/elchi/components/common/e-components/EFields";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import { useTags } from "@/hooks/useTags";
import { modtag_remote_jwks } from "./_modtag_";
import { generateFields } from "@/common/generate-fields";
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import useResourceForm from "@/hooks/useResourceForm";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";
import CommonComponentHttpUri from "@/elchi/components/resources/common/HttpUri/HttpUri";
import ComponentJwksAsyncFetch from "../JwksAsyncFetch/JwksAsyncFetch";
import CommonComponentRetryPolicy from "@/elchi/components/resources/common/RetryPolicy/RetryPolicy";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
        reduxAction: any;
    }
};

const ComponentRemoteJwks: React.FC<GeneralProps> = ({ veri }) => {
    const { version, reduxStore, keyPrefix, reduxAction } = veri;
    const { vTags, loading } = useTags(version, modtag_remote_jwks);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version,
        reduxStore,
    });

    if (loading || !vTags.rj) {
        return null;
    }

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.rj?.RemoteJwks,
            sf: vTags.rj?.RemoteJwks_SingleFields,
        }),
    ];

    return (
        <ECard title="Remote JWKS">
            <HorizonTags veri={{
                tags: vTags.rj?.RemoteJwks,
                selectedTags: selectedTags,
                unsupportedTags: [],
                handleChangeTag: handleChangeTag,
                keyPrefix: keyPrefix,
                tagPrefix: '',
                specificTagPrefix: {},
                required: [],
                onlyOneTag: [],
            }} />
            <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
            <EForm>
                <EFields
                    fieldConfigs={fieldConfigs}
                    selectedTags={selectedTags}
                    handleChangeRedux={handleChangeRedux}
                    reduxStore={reduxStore}
                    keyPrefix={keyPrefix}
                    version={version}
                />
            </EForm>

            <ConditionalComponent
                shouldRender={startsWithAny("http_uri", selectedTags)}
                Component={CommonComponentHttpUri}
                componentProps={{
                    version: version,
                    reduxStore: reduxStore?.http_uri,
                    keyPrefix: `${keyPrefix}.http_uri`,
                    reduxAction: reduxAction,
                    id: "remote_jwks_http_uri_0"
                }}
            />

            <ConditionalComponent
                shouldRender={startsWithAny("async_fetch", selectedTags)}
                Component={ComponentJwksAsyncFetch}
                componentProps={{

                    version: version,
                    reduxStore: reduxStore?.async_fetch,
                    keyPrefix: `${keyPrefix}.async_fetch`,
                    reduxAction: reduxAction,
                    title: "Async Fetch Configuration"

                }}
            />

            <ConditionalComponent
                shouldRender={startsWithAny("retry_policy", selectedTags)}
                Component={CommonComponentRetryPolicy}
                componentProps={{

                    version: version,
                    reduxStore: reduxStore?.retry_policy,
                    keyPrefix: `${keyPrefix}.retry_policy`,
                    reduxAction: reduxAction,
                    tagMatchPrefix: "RemoteJwks.retry_policy"

                }}
            />
        </ECard>
    )
};

export default memorizeComponent(ComponentRemoteJwks, compareVeri);
