import React from "react";
import { Divider } from 'antd';
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import { FieldConfigType, startsWithAny } from "@/utils/tools";
import ECard from "@/elchi/components/common/ECard";
import { EFields } from "@/elchi/components/common/e-components/EFields";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import { useTags } from "@/hooks/useTags";
import { modtag_jwt_provider } from "./_modtag_";
import { generateFields } from "@/common/generate-fields";
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import useResourceForm from "@/hooks/useResourceForm";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";
import { navigateCases } from "@/elchi/helpers/navigate-cases";
import ComponentRemoteJwks from "../RemoteJwks/RemoteJwks";
import CommonComponentDataSource from "@/elchi/components/resources/common/DataSource/DataSource";
import CommonComponentStringMatcher from "@/elchi/components/resources/common/StringMatcher/StringMatcher";
import ComponentJwtCacheConfig from "../JwtCacheConfig/JwtCacheConfig";
import ComponentJwtHeaders from "../JwtHeader/JwtHeaders";
import ComponentJwtClaimToHeaders from "../JwtClaimToHeader/JwtClaimToHeaders";
import ComponentNormalizePayload from "../NormalizePayload/NormalizePayload";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
        reduxAction: any;
    }
};

const ComponentJwtProvider: React.FC<GeneralProps> = ({ veri }) => {
    const { version, reduxStore, keyPrefix, reduxAction } = veri;
    const { vTags, loading } = useTags(version, modtag_jwt_provider);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version,
        reduxStore,
    });

    if (loading || !vTags.jp) {
        return null;
    }

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.jp?.JwtProvider,
            sf: vTags.jp?.JwtProvider_SingleFields,
        }),
    ];

    return (
        <ECard title="JWT Provider">
            <HorizonTags veri={{
                tags: vTags.jp?.JwtProvider,
                selectedTags: selectedTags,
                unsupportedTags: [],
                handleChangeTag: handleChangeTag,
                keyPrefix: keyPrefix,
                tagPrefix: '',
                specificTagPrefix: {'remote_jwks': 'jwks_source_specifier', 'local_jwks': 'jwks_source_specifier'},
                required: [],
                onlyOneTag: [['jwks_source_specifier.remote_jwks', 'jwks_source_specifier.local_jwks']],
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
                shouldRender={startsWithAny("jwks_source_specifier.remote_jwks", selectedTags)}
                Component={ComponentRemoteJwks}
                componentProps={{
                    version: version,
                    reduxStore: navigateCases(reduxStore, "jwks_source_specifier.remote_jwks"),
                    keyPrefix: `${keyPrefix}.remote_jwks`,
                    reduxAction: reduxAction,
                    id: "jwt_provider_remote_jwks_0"
                }}
            />

            <ConditionalComponent
                shouldRender={startsWithAny("jwks_source_specifier.local_jwks", selectedTags)}
                Component={CommonComponentDataSource}
                componentProps={{
                    version: version,
                    reduxStore: navigateCases(reduxStore, "jwks_source_specifier.local_jwks"),
                    keyPrefix: `${keyPrefix}.local_jwks`,
                    reduxAction: reduxAction,
                    parentName: "Local JWKS",
                    id: "jwt_provider_local_jwks_0"
                }}
            />

            <ConditionalComponent
                shouldRender={startsWithAny("subjects", selectedTags)}
                Component={CommonComponentStringMatcher}
                componentProps={{
                    version: version,
                    reduxStore: reduxStore?.subjects,
                    keyPrefix: `${keyPrefix}.subjects`,
                    reduxAction: reduxAction,
                    title: "Subjects (StringMatcher)",
                    id: "jwt_provider_subjects_0"
                }}
            />

            <ConditionalComponent
                shouldRender={startsWithAny("jwt_cache_config", selectedTags)}
                Component={ComponentJwtCacheConfig}
                componentProps={{
                    version: version,
                    reduxStore: reduxStore?.jwt_cache_config,
                    keyPrefix: `${keyPrefix}.jwt_cache_config`,
                    reduxAction: reduxAction,
                    title: "JWT Cache Config",
                    id: "jwt_provider_jwt_cache_config_0"
                }}
            />

            <ConditionalComponent
                shouldRender={startsWithAny("from_headers", selectedTags)}
                Component={ComponentJwtHeaders}
                componentProps={{
                    version: version,
                    reduxStore: reduxStore?.from_headers,
                    reduxAction: reduxAction,
                    selectedTags: selectedTags,
                    tag: "from_headers",
                    keyPrefix: `${keyPrefix}.from_headers`,
                    tagMatchPrefix: "JwtProvider.from_headers",
                    title: "From Headers",
                    id: "jwt_provider_from_headers_0"
                }}
            />

            <ConditionalComponent
                shouldRender={startsWithAny("claim_to_headers", selectedTags)}
                Component={ComponentJwtClaimToHeaders}
                componentProps={{
                    version: version,
                    reduxStore: reduxStore?.claim_to_headers,
                    reduxAction: reduxAction,
                    selectedTags: selectedTags,
                    tag: "claim_to_headers",
                    keyPrefix: `${keyPrefix}.claim_to_headers`,
                    tagMatchPrefix: "JwtProvider.claim_to_headers",
                    title: "Claim To Headers",
                    id: "jwt_provider_claim_to_headers_0"
                }}
            />

            <ConditionalComponent
                shouldRender={startsWithAny("normalize_payload_in_metadata", selectedTags)}
                Component={ComponentNormalizePayload}
                componentProps={{
                    version: version,
                    reduxStore: reduxStore?.normalize_payload_in_metadata,
                    keyPrefix: `${keyPrefix}.normalize_payload_in_metadata`,
                    reduxAction: reduxAction,
                    title: "Normalize Payload In Metadata",
                    id: "jwt_provider_normalize_payload_0"
                }}
            />
        </ECard>
    )
};

export default memorizeComponent(ComponentJwtProvider, compareVeri);
