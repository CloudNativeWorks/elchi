import React from "react";
import { Col, Divider } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { FieldConfigType } from "@/utils/tools";
import { useTags } from "@/hooks/useTags";
import { modtag_track_cluster_stats, modtag_us_track_cluster_stats } from "./_modtag_";
import { generateFields } from "@/common/generate-fields";
import useResourceForm from "@/hooks/useResourceForm";
import ECard from "@/elchi/components/common/ECard";
import { EForm } from "../../../common/e-components/EForm";
import { EFields } from "../../../common/e-components/EFields";

type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
        id: string;
    }
};

const ComponentTrackClusterStats: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_track_cluster_stats);

    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.tcs?.TrackClusterStats,
            sf: vTags.tcs?.TrackClusterStats_SingleFields,
        }),
    ];

    return (
        <ECard title="Track Cluster Stats" id={veri.id}>
            <HorizonTags veri={{
                tags: vTags.tcs?.TrackClusterStats,
                selectedTags: selectedTags || [],
                unsupportedTags: modtag_us_track_cluster_stats.TrackClusterStats || [],
                keyPrefix: veri.keyPrefix,
                handleChangeTag: handleChangeTag,
            }} />
            <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
            <Col md={24}>
                <EForm>
                    <EFields
                        fieldConfigs={fieldConfigs}
                        selectedTags={selectedTags || []}
                        handleChangeRedux={handleChangeRedux}
                        reduxStore={veri.reduxStore}
                        keyPrefix={veri.keyPrefix}
                        version={veri.version}
                    />
                </EForm>
            </Col>
        </ECard>
    );
};

export default ComponentTrackClusterStats;
