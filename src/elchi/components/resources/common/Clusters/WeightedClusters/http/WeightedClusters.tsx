import React, { useState } from "react";
import { Col, Divider, Row } from 'antd';
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { FieldTypes } from "@/common/statics/general";
import { FieldConfigType, startsWithAny } from "@/utils/tools";
import CommonComponentWClusters from './Clusters';
import useResourceForm from "@/hooks/useResourceForm";
import ECard from "@/elchi/components/common/ECard";
import { useTags } from "@/hooks/useTags";
import { modtag_weighted_clusters } from "./_modtag_";
import { generateFields } from "@/common/generate-fields";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import { EFields } from "@/elchi/components/common/e-components/EFields";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix?: string;
        tagPrefix?: string;
        tagMatchPrefix?: string;
        reduxAction: any;
    }
};

const CommonComponentWeightedClusters: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_weighted_clusters);
    const [showCluster, setShowCluster] = useState<boolean>(false);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        { tag: "clusters", type: FieldTypes.ArrayIcon, placeHolder: "(string)", fieldPath: 'clusters', spanNum: 4, drawerShow: () => { setShowCluster(true); } },
        ...generateFields({
            f: vTags.wc?.WeightedCluster,
            sf: vTags.wc?.WeightedCluster_SingleFields,
            e: ["name"]
        }),
    ];

    return (
        <>
            <ECard title="Weighted Clusters">
                <Row>
                    <Col md={24}>
                        <HorizonTags veri={{
                            tags: vTags.wc?.WeightedCluster,
                            selectedTags: selectedTags,
                            keyPrefix: veri.keyPrefix,
                            unsupportedTags: ["total_weight"],
                            tagMatchPrefix: `${veri.tagMatchPrefix}.cluster_specifier.weighted_clusters`,
                            handleChangeTag: handleChangeTag,
                            specificTagPrefix: { 'header_name': 'random_value_specifier' }
                        }} />
                        <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
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
                </Row>
            </ECard>
            <ConditionalComponent
                shouldRender={startsWithAny("clusters", selectedTags)}
                Component={CommonComponentWClusters}
                componentProps={{
                    version: veri.version,
                    keyPrefix: `${veri.keyPrefix}.clusters`,
                    drawerOpen: showCluster,
                    reduxStore: veri.reduxStore?.clusters,
                    reduxAction: veri.reduxAction,
                    tagMatchPrefix: `${veri.tagMatchPrefix}.cluster_specifier.weighted_clusters`,
                    drawerClose: () => { setShowCluster(false); },
                    id: `clusters_0`,
                }}
            />
        </>
    )
};

export default memorizeComponent(CommonComponentWeightedClusters, compareVeri);