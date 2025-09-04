import React from "react";
import { Col, Divider } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import { FieldConfigType } from "@/utils/tools";
import useResourceForm from "@/hooks/useResourceForm";
import ECard from "@/elchi/components/common/ECard";
import { useTags } from "@/hooks/useTags";
import { modtag_runtime_uint32 } from "./_modtag_";
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

const CommonComponentRuntimeUInt32: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_runtime_uint32);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.ru?.RuntimeUInt32,
            sf: vTags.ru?.RuntimeUInt32_SingleFields,
            r: ['runtime_key']
        }),
    ];

    return (
        <ECard title={veri.title}>
            <HorizonTags veri={{
                tags: vTags.ru?.RuntimeUInt32,
                selectedTags: selectedTags,
                unsupportedTags: [],
                handleChangeTag: handleChangeTag,
                keyPrefix: veri.keyPrefix,
                required: ['runtime_key']
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

export default memorizeComponent(CommonComponentRuntimeUInt32, compareVeri);
