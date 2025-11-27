import React from "react";
import { Divider } from 'antd';
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import { FieldConfigType } from "@/utils/tools";
import ECard from "@/elchi/components/common/ECard";
import { EFields } from "@/elchi/components/common/e-components/EFields";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import { useTags } from "@/hooks/useTags";
import { modtag_refresh_rate } from "./_modtag_";
import { generateFields } from "@/common/generate-fields";
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import useResourceForm from "@/hooks/useResourceForm";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
        reduxAction: any;
        title?: string;
    }
};

const ComponentRefreshRate: React.FC<GeneralProps> = ({ veri }) => {
    const { version, reduxStore, keyPrefix, title } = veri;
    const { vTags, loading } = useTags(version, modtag_refresh_rate);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version,
        reduxStore,
    });

    if (loading || !vTags.rr) {
        return null;
    }

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.rr?.Cluster_RefreshRate,
            sf: vTags.rr?.Cluster_RefreshRate_SingleFields,
        }),
    ];

    return (
        <ECard title={title || "DNS Failure Refresh Rate"}>
            <HorizonTags veri={{
                tags: vTags.rr?.Cluster_RefreshRate,
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

export default memorizeComponent(ComponentRefreshRate, compareVeri);
