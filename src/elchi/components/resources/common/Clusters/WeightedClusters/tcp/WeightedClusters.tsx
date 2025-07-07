import React, { useState } from "react";
import { Col, Divider, Row } from 'antd';
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { FieldComponent } from "@/elchi/components/common/FormItems";
import { FieldTypes } from "@/common/statics/general";
import { startsWithAny } from "@/utils/tools";
import CommonComponentTWClusters from './Clusters';
import useResourceForm from "@/hooks/useResourceForm";
import ECard from "@/elchi/components/common/ECard";
import { modtag_weighted_clusters } from "./_modtag_";
import { useTags } from "@/hooks/useTags";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";
import { EForm } from "@/elchi/components/common/e-components/EForm";


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

const CommonComponentTCPWeightedClusters: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_weighted_clusters);
    const [showCluster, setShowCluster] = useState<boolean>(false);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    return (
        <>
            <ECard title="Weighted Clusters">
                <Row>
                    <Col md={24}>
                        <HorizonTags veri={{
                            tags: vTags.wc?.TcpProxy_WeightedCluster,
                            selectedTags: selectedTags,
                            unsupportedTags: [],
                            tagPrefix: '',
                            tagMatchPrefix: `${veri.tagMatchPrefix}.cluster_specifier.weighted_clusters`,
                            handleChangeTag: handleChangeTag,
                        }} />
                        <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
                        <EForm>
                            <FieldComponent veri={{
                                selectedTags: selectedTags,
                                keyPrefix: `${veri.keyPrefix}`,
                                tagPrefix: '',
                                handleChange: handleChangeRedux,
                                tag: `clusters`,
                                value: veri.reduxStore?.clusters,
                                type: FieldTypes.ArrayIcon,
                                spanNum: 6,
                                condition: veri.reduxStore?.clusters?.[0],
                                drawerShow: () => { setShowCluster(true); }
                            }} />
                        </EForm>
                    </Col>
                </Row>
            </ECard>
            <ConditionalComponent
                shouldRender={startsWithAny("clusters", selectedTags)}
                Component={CommonComponentTWClusters}
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

export default memorizeComponent(CommonComponentTCPWeightedClusters, compareVeri);