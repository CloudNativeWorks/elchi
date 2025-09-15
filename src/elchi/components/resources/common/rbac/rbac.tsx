import React, { useState } from "react";
import { Col, Divider } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import { FieldConfigType, startsWithAny } from "@/utils/tools";
import useResourceForm from "@/hooks/useResourceForm";
import ECard from "@/elchi/components/common/ECard";
import { modtag_rbac_rules } from "./_modtag_";
import { useTags } from "@/hooks/useTags";
import { useModels } from "@/hooks/useModels";
import { generateFields } from "@/common/generate-fields";
import { FieldTypes } from "@/common/statics/general";
import CommonComponentPolicies from "./policies";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";
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

const ComponentRBAC: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_rbac_rules);
    const { vModels } = useModels(veri.version, modtag_rbac_rules);
    const [stateModal, setStateModal] = useState(false);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    // Snippet apply fonksiyonu - ECard için uygun format
    const handleApplySnippet = (keys: string, data: any) => {
        handleChangeRedux(keys, data);
    };

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.rr?.RBAC,
            sf: vTags.rr?.RBAC_SingleFields,
        }),
        { tag: "policies", type: FieldTypes.ArrayIcon, condition: true, fieldPath: 'policies', spanNum: 5, drawerShow: () => { setStateModal(true) } },
    ];

    return (
        <ECard 
            title={veri.title}
            reduxStore={veri.reduxStore}
            ctype="rbac"
            toJSON={vModels.rr?.RBAC.toJSON}
            onApply={handleApplySnippet}
            keys={veri.keyPrefix}
            version={veri.version}
        >
            <HorizonTags veri={{
                tags: vTags.rr?.RBAC,
                selectedTags: selectedTags,
                unsupportedTags: [],
                handleChangeTag: handleChangeTag,
                keyPrefix: veri.keyPrefix,
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
            </Col>
            <ConditionalComponent
                shouldRender={startsWithAny("policies", selectedTags)}
                Component={CommonComponentPolicies}
                componentProps={{
                    version: veri.version,
                    keyPrefix: `${veri.keyPrefix}.policies`,
                    drawerOpen: stateModal,
                    reduxStore: veri.reduxStore?.policies,
                    drawerClose: () => { setStateModal(false) },
                    id: `policies_0`,
                }}
            />
        </ECard>
    )
};

export default memorizeComponent(ComponentRBAC, compareVeri);
