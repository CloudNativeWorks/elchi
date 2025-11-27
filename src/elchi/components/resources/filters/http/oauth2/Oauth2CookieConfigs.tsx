import React from "react";
import { Col, Divider, Row } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import { FieldConfigType, startsWithAny } from "@/utils/tools";
import useResourceForm from "@/hooks/useResourceForm";
import ECard from "@/elchi/components/common/ECard";
import { modtag_oauth2_cookie_configs } from "./_modtag_";
import { useTags } from "@/hooks/useTags";
import { generateFields } from "@/common/generate-fields";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import { EFields } from "@/elchi/components/common/e-components/EFields";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
        title: string;
    }
};

const ComponentOAuth2CookieConfigs: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_oauth2_cookie_configs);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.occ?.CookieConfig,
            sf: vTags.occ?.CookieConfig_SingleFields,
        }),
    ];

    const cookieConfigSection = (cookieType: string, label: string) => {
        if (!startsWithAny(cookieType, selectedTags)) return null;

        return (
            <>
                <Divider orientation="left" orientationMargin="0">{label}</Divider>
                <Col md={24}>
                    <EForm>
                        <EFields
                            fieldConfigs={fieldConfigs}
                            selectedTags={vTags.occ?.CookieConfig_SingleFields || []}
                            handleChangeRedux={handleChangeRedux}
                            reduxStore={veri.reduxStore?.[cookieType]}
                            keyPrefix={`${veri.keyPrefix}.${cookieType}`}
                            version={veri.version}
                        />
                    </EForm>
                </Col>
            </>
        );
    };

    return (
        <ECard title={veri.title}>
            <HorizonTags veri={{
                tags: vTags.occ?.CookieConfigs,
                selectedTags: selectedTags,
                unsupportedTags: [],
                handleChangeTag: handleChangeTag,
                keyPrefix: veri.keyPrefix,
            }} />
            <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
            <Row>
                {cookieConfigSection('bearer_token_cookie_config', 'Bearer Token Cookie')}
                {cookieConfigSection('oauth_hmac_cookie_config', 'OAuth HMAC Cookie')}
                {cookieConfigSection('oauth_expires_cookie_config', 'OAuth Expires Cookie')}
                {cookieConfigSection('id_token_cookie_config', 'ID Token Cookie')}
                {cookieConfigSection('refresh_token_cookie_config', 'Refresh Token Cookie')}
                {cookieConfigSection('oauth_nonce_cookie_config', 'OAuth Nonce Cookie')}
                {cookieConfigSection('code_verifier_cookie_config', 'Code Verifier Cookie')}
            </Row>
        </ECard>
    )
};

export default memorizeComponent(ComponentOAuth2CookieConfigs, compareVeri);
