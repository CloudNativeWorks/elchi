import React from "react";
import { Col, Divider } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import { FieldConfigType, matchesEndOrStartOf } from "@/utils/tools";
import useResourceForm from "@/hooks/useResourceForm";
import ECard from "@/elchi/components/common/ECard";
import { useTags } from "@/hooks/useTags";
import { modtag_grpc_service } from "./_modtag_";
import { generateFields } from "@/common/generate-fields";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import { EFields } from "@/elchi/components/common/e-components/EFields";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";
import { ResourceAction } from "@/redux/reducers/slice";
import CommonComponentRetryPolicy from "@/elchi/components/resources/common/RetryPolicy/RetryPolicy";
import CommonComponentEnvoyGrpc from "@/elchi/components/resources/common/GrpcService/EnvoyGrpc";
import { navigateCases } from "@/elchi/helpers/navigate-cases";


type GeneralProps = {
    veri: {
        version: string;
        index: number;
        reduxStore: any;
        keyPrefix: string;
        tagMatchPrefix: string;
    }
};

const CommonComponentGrpcService: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_grpc_service);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.gs?.GrpcService,
            sf: vTags.gs?.GrpcService_SingleFields,
        }),
    ];

    return (
        <ECard title={"GrpcService"}>
            <HorizonTags veri={{
                tags: vTags.gs?.GrpcService,
                selectedTags: selectedTags,
                unsupportedTags: ["target_specifier.google_grpc", "initial_metadata"],
                handleChangeTag: handleChangeTag,
                specificTagPrefix: { "envoy_grpc": `target_specifier` },
                required: ["envoy_grpc"],
                keyPrefix: `${veri.keyPrefix}`,
            }} />
            <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
            <Col md={24}>
                <EForm>
                    <EFields
                        fieldConfigs={fieldConfigs}
                        selectedTags={selectedTags}
                        handleChangeRedux={handleChangeRedux}
                        reduxStore={veri.reduxStore}
                        tagPrefix={`${veri.tagMatchPrefix}`}
                        keyPrefix={veri.keyPrefix}
                        version={veri.version}
                    />
                </EForm>
            </Col>
            <ConditionalComponent
                shouldRender={matchesEndOrStartOf("target_specifier.envoy_grpc", selectedTags)}
                Component={CommonComponentEnvoyGrpc}
                componentProps={{
                    version: veri.version,
                    reduxStore: navigateCases(veri.reduxStore, "target_specifier.envoy_grpc"),
                    keyPrefix: `${veri.keyPrefix}.envoy_grpc`,
                    tagMatchPrefix: `${veri.tagMatchPrefix}.target_specifier`,
                }}
            />
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

export default memorizeComponent(CommonComponentGrpcService, compareVeri);
