import React from "react";
import { Divider } from 'antd';
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import { FieldConfigType, startsWithAny } from "@/utils/tools";
import ECard from "@/elchi/components/common/ECard";
import { EFields } from "@/elchi/components/common/e-components/EFields";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import { useTags } from "@/hooks/useTags";
import { modtag_jwt_requirement } from "./_modtag_";
import { generateFields } from "@/common/generate-fields";
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import useResourceForm from "@/hooks/useResourceForm";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";
import { navigateCases } from "@/elchi/helpers/navigate-cases";
import ComponentProviderWithAudiences from "../ProviderWithAudiences/ProviderWithAudiences";
import CommonComponentEmpty from "@/elchi/components/resources/common/Empty/Empty";
import ComponentJwtRequirementOrList from "../JwtRequirementOrList/JwtRequirementOrList";
import ComponentJwtRequirementAndList from "../JwtRequirementAndList/JwtRequirementAndList";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
        reduxAction: any;
    }
};

const ComponentJwtRequirement: React.FC<GeneralProps> = ({ veri }) => {
    const { version, reduxStore, keyPrefix, reduxAction } = veri;
    const { vTags, loading } = useTags(version, modtag_jwt_requirement);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version,
        reduxStore,
    });

    if (loading || !vTags.jr) {
        return null;
    }

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.jr?.JwtRequirement,
            sf: vTags.jr?.JwtRequirement_SingleFields,
        }),
    ];

    return (
        <ECard title="JWT Requirement">
            <HorizonTags veri={{
                tags: vTags.jr?.JwtRequirement,
                selectedTags: selectedTags,
                unsupportedTags: [],
                handleChangeTag: handleChangeTag,
                keyPrefix: keyPrefix,
                tagPrefix: '',
                specificTagPrefix: {
                    'provider_name': 'requires_type',
                    'provider_and_audiences': 'requires_type',
                    'requires_any': 'requires_type',
                    'requires_all': 'requires_type',
                    'allow_missing': 'requires_type',
                    'allow_missing_or_failed': 'requires_type'
                },
                required: [],
                onlyOneTag: [[
                    'requires_type.provider_name',
                    'requires_type.provider_and_audiences',
                    'requires_type.requires_any',
                    'requires_type.requires_all',
                    'requires_type.allow_missing',
                    'requires_type.allow_missing_or_failed'
                ]],
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
                shouldRender={startsWithAny("requires_type.provider_and_audiences", selectedTags)}
                Component={ComponentProviderWithAudiences}
                componentProps={{
                    version: version,
                    reduxStore: navigateCases(reduxStore, "requires_type.provider_and_audiences"),
                    keyPrefix: `${keyPrefix}.provider_and_audiences`,
                    reduxAction: reduxAction,
                    id: "jwt_requirement_provider_audiences_0"
                }}
            />

            {startsWithAny("requires_type.allow_missing_or_failed", selectedTags) && (
                <CommonComponentEmpty veri={{
                    version: version,
                    reduxStore: navigateCases(reduxStore, "requires_type.allow_missing_or_failed"),
                    keyPrefix: `${keyPrefix}.allow_missing_or_failed`,
                    reduxAction: reduxAction,
                    title: "Allow Missing or Failed JWT",
                    description: "The requirement is always satisfied even if JWT is missing or the JWT verification fails. All JWTs will be verified and passed to another filter for decision making.",
                    withForm: false
                }} />
            )}

            {startsWithAny("requires_type.allow_missing", selectedTags) && !startsWithAny("requires_type.allow_missing_or_failed", selectedTags) && (
                <CommonComponentEmpty veri={{
                    version: version,
                    reduxStore: navigateCases(reduxStore, "requires_type.allow_missing"),
                    keyPrefix: `${keyPrefix}.allow_missing`,
                    reduxAction: reduxAction,
                    title: "Allow Missing JWT",
                    description: "The requirement is satisfied if JWT is missing, but failed if JWT is presented but invalid. This is used to only verify JWTs and pass the verified payload to another filter.",
                    withForm: false
                }} />
            )}

            {startsWithAny("requires_type.requires_any", selectedTags) && (
                <ComponentJwtRequirementOrList veri={{
                    version: version,
                    reduxStore: navigateCases(reduxStore, "requires_type.requires_any"),
                    keyPrefix: `${keyPrefix}.requires_any`,
                    reduxAction: reduxAction,
                    title: "JWT Requirements (OR Logic - Any Must Pass)"
                }} />
            )}

            {startsWithAny("requires_type.requires_all", selectedTags) && (
                <ComponentJwtRequirementAndList veri={{
                    version: version,
                    reduxStore: navigateCases(reduxStore, "requires_type.requires_all"),
                    keyPrefix: `${keyPrefix}.requires_all`,
                    reduxAction: reduxAction,
                    title: "JWT Requirements (AND Logic - All Must Pass)"
                }} />
            )}
        </ECard>
    )
};

export default memorizeComponent(ComponentJwtRequirement, compareVeri);
