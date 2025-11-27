import React from "react";
import { Divider } from 'antd';
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import { FieldConfigType, startsWithAny } from "@/utils/tools";
import ECard from "@/elchi/components/common/ECard";
import { EFields } from "@/elchi/components/common/e-components/EFields";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import { useTags } from "@/hooks/useTags";
import { modtag_sub_clusters_config } from "./_modtag_sub_clusters";
import { generateFields } from "@/common/generate-fields";
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import useResourceForm from "@/hooks/useResourceForm";
import ComponentPreresolveClusters from "./PreresolveClusters/PreresolveClusters";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
        reduxAction: any;
    }
};

const ComponentSubClustersConfig: React.FC<GeneralProps> = ({ veri }) => {
    const { version, reduxStore, keyPrefix } = veri;
    const { vTags, loading } = useTags(version, modtag_sub_clusters_config);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version,
        reduxStore,
    });

    if (loading || !vTags.scc) {
        return null;
    }

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.scc?.SubClustersConfig,
            sf: vTags.scc?.SubClustersConfig_SingleFields,
        }),
    ];

    return (
        <>
            <ECard title="Sub Clusters Configuration">
                <HorizonTags veri={{
                    tags: vTags.scc?.SubClustersConfig,
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

            {startsWithAny("preresolve_clusters", selectedTags) && (
                <ComponentPreresolveClusters
                    veri={{
                        version: version,
                        reduxStore: reduxStore?.preresolve_clusters,
                        keyPrefix: `${keyPrefix}.preresolve_clusters`,
                        reduxAction: veri.reduxAction,
                        title: "Preresolve Clusters"
                    }}
                />
            )}
        </>
    )
};

export default memorizeComponent(ComponentSubClustersConfig, compareVeri);
