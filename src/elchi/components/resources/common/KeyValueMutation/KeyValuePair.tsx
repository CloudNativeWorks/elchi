import React from "react";
import { Divider } from 'antd';
import { memorizeComponent, compareVeriReduxStoreAndSelectedTags } from "@/hooks/useMemoComponent";
import { FieldConfigType } from "@/utils/tools";
import { EFields } from "@/elchi/components/common/e-components/EFields";
import { useTags } from "@/hooks/useTags";
import { modtag_key_value_mutation } from "./_modtag_";
import { generateFields } from "@/common/generate-fields";
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import useResourceForm from "@/hooks/useResourceForm";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        reduxAction: any;
        keyPrefix?: string;
        title?: string;
    }
};


const CommonComponentKeyValuePair: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags, loading } = useTags(veri.version, modtag_key_value_mutation);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    if (loading || !vTags.kvm) {
        return null;
    }

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.kvm?.KeyValuePair,
            sf: vTags.kvm?.KeyValuePair_SingleFields,
        }),
    ];

    return (
        <>
            <Divider style={{ marginTop: '8px', marginBottom: '8px' }} orientation="left" orientationMargin="0">{veri.title || "Key Value Pair"}</Divider>
            <HorizonTags veri={{
                tags: vTags.kvm?.KeyValuePair,
                selectedTags: selectedTags,
                unsupportedTags: [],
                handleChangeTag: handleChangeTag,
                keyPrefix: veri.keyPrefix,
                tagPrefix: '',
                required: [],
            }} />
            <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
            <EFields
                fieldConfigs={fieldConfigs}
                selectedTags={selectedTags}
                handleChangeRedux={handleChangeRedux}
                reduxStore={veri.reduxStore}
                keyPrefix={veri.keyPrefix}
                version={veri.version}
            />
        </>
    )
};

export default memorizeComponent(CommonComponentKeyValuePair, compareVeriReduxStoreAndSelectedTags);
