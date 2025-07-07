import React from "react";
import { Col, Divider } from "antd";
import { useTags } from "@/hooks/useTags";
import { modtag_rbac } from "./_modtag_";
import useResourceForm from "@/hooks/useResourceForm";
import { generateFields } from "@/common/generate-fields";
import { FieldConfigType, matchesEndOrStartOf } from "@/utils/tools";
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import ECard from "@/elchi/components/common/ECard";
import ComponentRBAC from "@resources/common/rbac/rbac";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import { EFields } from "@/elchi/components/common/e-components/EFields";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
    }
};

const ComponentRbacIn: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_rbac);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.r?.RBAC,
            sf: vTags.r?.RBAC_SingleFields,
        }),
    ];


    return (
        <>
            <ECard title="Rbac">
                <HorizonTags veri={{
                    tags: vTags.r?.RBAC,
                    selectedTags: selectedTags,
                    unsupportedTags: ["shadow_matcher", "matcher"],
                    handleChangeTag: handleChangeTag,
                    keyPrefix: veri.keyPrefix,
                }} />
                <Divider type="horizontal" style={{ marginBottom: 3, marginTop: -1 }} />
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
                        shouldRender={matchesEndOrStartOf("rules", selectedTags)}
                        Component={ComponentRBAC}
                        componentProps={{
                            version: veri.version,
                            reduxStore: veri.reduxStore?.rules,
                            keyPrefix: `${veri.keyPrefix}.rules`,
                            title: "Rules",
                            id: `rules_0`,
                        }}
                    />
                    <ConditionalComponent
                        shouldRender={matchesEndOrStartOf("shadow_rules", selectedTags)}
                        Component={ComponentRBAC}
                        componentProps={{
                            version: veri.version,
                            reduxStore: veri.reduxStore?.shadow_rules,
                            keyPrefix: `${veri.keyPrefix}.shadow_rules`,
                            title: "Shadow Rules",
                            id: `shadow_rules_0`,
                        }}
                    />
                </Col>
            </ECard>
        </>
    );
}

export default React.memo(ComponentRbacIn);
