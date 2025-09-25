import React from "react";
import { useLocation } from "react-router-dom";
import { Col, Row, Divider } from "antd";
import { HeadOfResource } from "@/elchi/components/common/HeadOfResources";
import { GTypes } from "@/common/statics/gtypes";
import { useGTypeFields } from "@/hooks/useGtypes";
import { FieldConfigType, matchesEndOrStartOf, startsWithAny } from "@/utils/tools";
import { modtag_rbac } from "./_modtag_";
import { useModels } from "@/hooks/useModels";
import { useTags } from "@/hooks/useTags";
import useResourceMain from "@/hooks/useResourceMain";
import CommonComponentSingleOptions from "@/elchi/components/resources/common/SingleOptions/SingleOptions";
import CustomAnchor from "@/elchi/components/common/CustomAnchor";
import { generateFields } from "@/common/generate-fields";
import ComponentRBAC from "@resources/common/rbac/rbac";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";


type GeneralProps = {
    veri: {
        version: string;
        queryResource: any;
        generalName: string;
        changeGeneralName: any;
    }
};

const ComponentHttpRBAC: React.FC<GeneralProps> = ({ veri }) => {
    const GType = useGTypeFields(GTypes.HttpRBAC);
    const location = useLocation();
    const { vModels } = useModels(veri.version, modtag_rbac);
    const { vTags } = useTags(veri.version, modtag_rbac);
    const { reduxStore, selectedTags, handleChangeTag } = useResourceMain({
        version: veri.version,
        alias: "r",
        vModels,
        vTags,
        modelName: "RBAC",
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.r?.RBAC,
            sf: vTags.r?.RBAC_SingleFields,
        }),
    ];

    return (
        <>
            <HeadOfResource
                generalName={veri.generalName}
                version={veri.version}
                changeGeneralName={veri.changeGeneralName}
                locationCheck={location.pathname === GType.createPath}
                createUpdate={{
                    location_path: location.pathname,
                    GType: GType,
                    offset: 0,
                    name: veri.generalName,
                    reduxStore: reduxStore,
                    voidToJSON: vModels.r?.RBAC.toJSON,
                    queryResource: veri.queryResource,
                    envoyVersion: veri.version,
                    gtype: reduxStore?.$type,
                }}
            />
            <Divider type="horizontal" orientation="left" orientationMargin="0">Http RBAC</Divider>
            <Row>
                <Col md={4} style={{ display: "block", maxHeight: "auto", overflowY: "auto" }}>
                    <CustomAnchor
                        resourceConfKeys={vTags.r?.RBAC}
                        unsuportedTags={["matcher", "shadow_matcher"]}
                        singleOptionKeys={vTags.r?.RBAC_SingleFields}
                        selectedTags={selectedTags}
                        index={0}
                        handleChangeTag={handleChangeTag}
                        tagMatchPrefix={"RBAC"}
                    />
                </Col>
                <Col md={20}>
                    <ConditionalComponent
                        shouldRender={startsWithAny("rules", selectedTags)}
                        Component={ComponentRBAC}
                        componentProps={{
                            version: veri.version,
                            reduxStore: reduxStore?.rules,
                            keyPrefix: `rules`,
                            title: "Rules",
                            id: `rules_0`,
                        }}
                    />
                    <ConditionalComponent
                        shouldRender={matchesEndOrStartOf("shadow_rules", selectedTags)}
                        Component={ComponentRBAC}
                        componentProps={{
                            version: veri.version,
                            reduxStore: reduxStore?.shadow_rules,
                            keyPrefix: `shadow_rules`,
                            title: "Shadow Rules",
                            id: `shadow_rules_0`,
                        }}
                    />
                    <ConditionalComponent
                        shouldRender={selectedTags?.some(item => vTags.r?.RBAC_SingleFields.includes(item))}
                        Component={CommonComponentSingleOptions}
                        componentProps={{
                            version: veri.version,
                            selectedTags: selectedTags,
                            fieldConfigs: fieldConfigs,
                            reduxStore: reduxStore,
                            id: `single_options_0`,
                        }}
                    />
                </Col>
            </Row>
        </>
    );
}

export default React.memo(ComponentHttpRBAC);