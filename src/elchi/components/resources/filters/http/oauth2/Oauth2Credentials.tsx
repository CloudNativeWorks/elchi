import React from "react";
import { Col, Divider } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import { FieldConfigType, startsWithAny } from "@/utils/tools";
import useResourceForm from "@/hooks/useResourceForm";
import ECard from "@/elchi/components/common/ECard";
import { modtag_oauth2_credentials } from "./_modtag_";
import { useTags } from "@/hooks/useTags";
import { generateFields } from "@/common/generate-fields";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";
import CommonComponentSdsSecretConfig from "@resources/common/SdsSecretConfig/SdsSecretConfig";
import ComponentOAuth2CookieNames from "./Oauth2CookieNames";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import { EFields } from "@/elchi/components/common/e-components/EFields";
import { navigateCases } from "@/elchi/helpers/navigate-cases";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
        title: string;
    }
};

const ComponentOAuth2Credentials: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_oauth2_credentials);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.ocred?.OAuth2Credentials,
            sf: vTags.ocred?.OAuth2Credentials_SingleFields,
            r: ["client_id"]
        }),
    ];

    return (
        <ECard title={veri.title}>
            <HorizonTags veri={{
                tags: vTags.ocred?.OAuth2Credentials,
                selectedTags: selectedTags,
                unsupportedTags: [],
                handleChangeTag: handleChangeTag,
                keyPrefix: veri.keyPrefix,
                required: ['client_id', 'token_secret'],
                specificTagPrefix: { 'hmac_secret': 'token_formation' },
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
                    shouldRender={startsWithAny("token_secret", selectedTags)}
                    Component={CommonComponentSdsSecretConfig}
                    componentProps={{
                        version: veri.version,
                        reduxStore: veri.reduxStore?.token_secret,
                        keyPrefix: `${veri.keyPrefix}.token_secret`,
                        title: "Token Secret",
                        id: `token_secret_0`,
                    }}
                />
                <ConditionalComponent
                    shouldRender={startsWithAny("token_formation.hmac_secret", selectedTags)}
                    Component={CommonComponentSdsSecretConfig}
                    componentProps={{
                        version: veri.version,
                        reduxStore: navigateCases(veri.reduxStore, 'token_formation.hmac_secret'),
                        keyPrefix: `${veri.keyPrefix}.hmac_secret`,
                        title: "HMAC Secret",
                        id: `hmac_secret_0`,
                    }}
                />
                <ConditionalComponent
                    shouldRender={startsWithAny("cookie_names", selectedTags)}
                    Component={ComponentOAuth2CookieNames}
                    componentProps={{
                        version: veri.version,
                        reduxStore: veri.reduxStore?.cookie_names,
                        keyPrefix: `${veri.keyPrefix}.cookie_names`,
                        title: "Cookie Names",
                        id: `cookie_names_0`,
                    }}
                />
            </Col>
        </ECard>
    )
};

export default memorizeComponent(ComponentOAuth2Credentials, compareVeri);
