import React from "react";
import { Divider } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import { FieldConfigType, matchesEndOrStartOf } from "@/utils/tools";
import { useTags } from "@/hooks/useTags";
import { modtag_grpc_service_envoy_grpc } from "./_modtag_";
import { generateFields } from "@/common/generate-fields";
import useResourceForm from "@/hooks/useResourceForm";
import ECard from "@/elchi/components/common/ECard";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import { EFields } from "@/elchi/components/common/e-components/EFields";
import { ResourceAction } from "@/redux/reducers/slice";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";
import CommonComponentRetryPolicy from "@/elchi/components/resources/common/RetryPolicy/RetryPolicy";
import CommonComponentCluster from "@/elchi/components/resources/common/Clusters/Cluster/Cluster";
type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
        tagMatchPrefix: string;
    }
};

const CommonEnvoyGrpc: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_grpc_service_envoy_grpc);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.eg?.GrpcService_EnvoyGrpc,
            sf: vTags.eg?.GrpcService_EnvoyGrpc_SingleFields,
            r: ["cluster_name"],
            e: ["cluster_name"]
        }),
    ];


    return (
        <ECard title={"Envoy Grpc"}>
            <HorizonTags veri={{
                tags: vTags.eg?.GrpcService_EnvoyGrpc,
                selectedTags: selectedTags,
                unsupportedTags: [],
                handleChangeTag: handleChangeTag,
                keyPrefix: `${veri.keyPrefix}`,
                tagPrefix: `${veri.tagMatchPrefix}`,
                tagMatchPrefix: `${veri.tagMatchPrefix}`,
                required: ['cluster_name']
            }} />
            <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
            <EForm>
                <ConditionalComponent
                    shouldRender={matchesEndOrStartOf("cluster_name", selectedTags)}
                    Component={CommonComponentCluster}
                    componentProps={{
                        version: veri.version,
                        reduxAction: ResourceAction,
                        reduxStore: veri.reduxStore?.cluster_name,
                        keyPrefix: `${veri.keyPrefix}`,
                        tagPrefix: `${veri.tagMatchPrefix}`,
                        id: `cluster_name_${veri.keyPrefix}`,
                        tag: 'cluster_name',
                        size: 12,
                        selectedTags: selectedTags,
                        isNonEdsCluster: "false"
                    }}
                />
            </EForm>
            <EForm>
                <EFields
                    fieldConfigs={fieldConfigs}
                    selectedTags={selectedTags}
                    handleChangeRedux={handleChangeRedux}
                    reduxStore={veri.reduxStore}
                    keyPrefix={`${veri.keyPrefix}`}
                    version={veri.version}
                />
            </EForm>

            <ConditionalComponent
                shouldRender={matchesEndOrStartOf("retry_policy", selectedTags)}
                Component={CommonComponentRetryPolicy}
                componentProps={{
                    version: veri.version,
                    reduxAction: ResourceAction,
                    reduxStore: veri.reduxStore?.retry_policy,
                    keyPrefix: `${veri.keyPrefix}.retry_policy`,
                    tagMatchPrefix: `${veri.tagMatchPrefix}`,
                    id: `retry_policy_${veri.keyPrefix}`,
                }}
            />
        </ECard>
    )
};

export default memorizeComponent(CommonEnvoyGrpc, compareVeri);
