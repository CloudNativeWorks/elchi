import React from "react";
import { Col, Divider } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import { FieldConfigType } from "@/utils/tools";
import useResourceForm from "@/hooks/useResourceForm";
import ECard from "@/elchi/components/common/ECard";
import { useTags } from "@/hooks/useTags";
import { useModels } from "@/hooks/useModels";
import { modtag_token_bucket } from "./_modtag_";
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

const CommonComponentTokenBucket: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_token_bucket);
    const { vModels } = useModels(veri.version, modtag_token_bucket);
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
            f: vTags.tb?.TokenBucket,
            sf: vTags.tb?.TokenBucket_SingleFields,
            r: ['fill_interval']
        }),
    ];

    return (
        <ECard 
            title={veri.title}
            reduxStore={veri.reduxStore}
            ctype="token_bucket"
            toJSON={vModels.tb?.TokenBucket.toJSON}
            onApply={handleApplySnippet}
            keys={veri.keyPrefix}
            version={veri.version}
        >
            <HorizonTags veri={{
                tags: vTags.tb?.TokenBucket,
                selectedTags: selectedTags,
                unsupportedTags: [],
                handleChangeTag: handleChangeTag,
                keyPrefix: veri.keyPrefix,
                required: ['fill_interval']
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

export default memorizeComponent(CommonComponentTokenBucket, compareVeri);
