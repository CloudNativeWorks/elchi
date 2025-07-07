import React from "react";
import { Divider } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import { FieldConfigType } from "@/utils/tools";
import { useTags } from "@/hooks/useTags";
import { modtag_retry_backoff } from "./_modtag_";
import { generateFields } from "@/common/generate-fields";
import useResourceForm from "@/hooks/useResourceForm";
import ECard from "@/elchi/components/common/ECard";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import { EFields } from "@/elchi/components/common/e-components/EFields";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
    }
};

const CommonRetryBackoff: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_retry_backoff);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.rbo?.RetryPolicy_RetryBackOff,
            sf: vTags.rbo?.RetryPolicy_RetryBackOff_SingleFields,
            r: ["retry_back_off.base_interval"]
        }),
    ];

    return (
        <ECard title={"Retry Back Off"}>
            <HorizonTags veri={{
                tags: vTags.rbo?.RetryPolicy_RetryBackOff,
                selectedTags: selectedTags,
                unsupportedTags: [],
                handleChangeTag: handleChangeTag,
                keyPrefix: `${veri.keyPrefix}.retry_back_off`,
                required: ['base_interval']
            }} />
            <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
            <EForm>
                <EFields
                    fieldConfigs={fieldConfigs}
                    selectedTags={selectedTags}
                    handleChangeRedux={handleChangeRedux}
                    reduxStore={veri.reduxStore}
                    keyPrefix={`${veri.keyPrefix}.retry_back_off`}
                    tagPrefix="retry_back_off"
                    version={veri.version}
                />
            </EForm>
        </ECard>
    )
};

export default memorizeComponent(CommonRetryBackoff, compareVeri);
