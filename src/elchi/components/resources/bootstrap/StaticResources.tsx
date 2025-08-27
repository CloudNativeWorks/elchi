import React from "react";
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import ECard from "../../common/ECard";
import { ResourceAction } from "@/redux/reducers/slice";
import TabComponent from "../../common/TabComponent";
import CommonComponentCluster from '../common/Clusters/Cluster/Cluster';
import { EForm } from "../../common/e-components/EForm";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
        tagMatchPrefix: string;
    }
};

const ComponentStaticResources: React.FC<GeneralProps> = ({ veri }) => {
    return (
        <ECard title="Static Resources (Non EDS Clusters)">
            <EForm>
                <TabComponent veri={{
                    version: veri.version,
                    title: 'Clusters',
                    reduxStore: veri.reduxStore,
                    keyPrefix: `${veri.keyPrefix}`,
                    label: 'Cluster',
                    component: CommonComponentCluster,
                    isCluster: true,
                    veri: {
                        version: veri.version,
                        reduxStore: veri.reduxStore,
                        reduxAction: ResourceAction,
                        keyPrefix: veri.keyPrefix,
                        size: 8,
                        selectedTags: ["name"],
                        tag: 'name',
                        isNonEdsCluster: "true",
                    }
                }} />
            </EForm>
        </ECard >
    )
};

export default memorizeComponent(ComponentStaticResources, compareVeri);