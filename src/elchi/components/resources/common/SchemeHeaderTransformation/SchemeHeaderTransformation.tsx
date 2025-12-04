import React from "react";
import { Divider, Col } from 'antd';
import { memorizeComponent, compareVeriReduxStoreAndSelectedTags } from "@/hooks/useMemoComponent";
import { FieldConfigType } from "@/utils/tools";
import { EFields } from "@/elchi/components/common/e-components/EFields";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import { useTags } from "@/hooks/useTags";
import { modtag_scheme_header_transformation } from "./_modtag_";
import { generateFields } from "@/common/generate-fields";
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import useResourceForm from "@/hooks/useResourceForm";
import ECard from "@/elchi/components/common/ECard";

type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix?: string;
        id: string;
    }
};

const CommonComponentSchemeHeaderTransformation: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags, loading } = useTags(veri.version, modtag_scheme_header_transformation);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    if (loading || !vTags.sht) {
        return null;
    }

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.sht?.SchemeHeaderTransformation,
            sf: vTags.sht?.SchemeHeaderTransformation_SingleFields,
        }),
    ];

    return (
        <ECard title="Scheme Header Transformation" id={veri.id}>
            <HorizonTags veri={{
                tags: vTags.sht?.SchemeHeaderTransformation,
                selectedTags: selectedTags,
                unsupportedTags: [],
                handleChangeTag: handleChangeTag,
                keyPrefix: veri.keyPrefix,
                tagPrefix: '',
                required: [],
                onlyOneTag: [["transformation.scheme_to_overwrite", "match_upstream"]]
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
        </ECard>
    )
};

export default memorizeComponent(CommonComponentSchemeHeaderTransformation, compareVeriReduxStoreAndSelectedTags);
