import React from "react";
import { Divider } from 'antd';
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import { FieldConfigType } from "@/utils/tools";
import ECard from "@/elchi/components/common/ECard";
import { EFields } from "@/elchi/components/common/e-components/EFields";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import { useTags } from "@/hooks/useTags";
import { modtag_jwt_claim_to_header } from "./_modtag_";
import { generateFields } from "@/common/generate-fields";
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import useResourceForm from "@/hooks/useResourceForm";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
        reduxAction: any;
        tagMatchPrefix?: string;
        title?: string;
    }
};

const ComponentJwtClaimToHeader: React.FC<GeneralProps> = ({ veri }) => {
    const { version, reduxStore, keyPrefix, title } = veri;
    const { vTags, loading } = useTags(version, modtag_jwt_claim_to_header);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version,
        reduxStore,
    });

    if (loading || !vTags.jch) {
        return null;
    }

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.jch?.JwtClaimToHeader,
            sf: vTags.jch?.JwtClaimToHeader_SingleFields,
        }),
    ];

    return (
        <ECard title={title || "JWT Claim To Header"}>
            <HorizonTags veri={{
                tags: vTags.jch?.JwtClaimToHeader,
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
        </ECard>
    )
};

export default memorizeComponent(ComponentJwtClaimToHeader, compareVeri);
