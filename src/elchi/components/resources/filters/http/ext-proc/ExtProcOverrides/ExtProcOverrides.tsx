import React, { useEffect } from "react";
import { Divider } from 'antd';
import { useDispatch } from "react-redux";
import { compareVeriReduxStoreAndSelectedTags, memorizeComponent } from "@/hooks/useMemoComponent";
import { FieldConfigType, startsWithAny } from "@/utils/tools";
import ECard from "@/elchi/components/common/ECard";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import { EFields } from "@/elchi/components/common/e-components/EFields";
import { useTags } from "@/hooks/useTags";
import { modtag_ext_proc_overrides, modtag_excluded_ext_proc_overrides } from "./_modtag_";
import { generateFields } from "@/common/generate-fields";
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import useResourceForm from "@/hooks/useResourceForm";
import { handleChangeResources } from "@/redux/dispatcher";
import { ActionType, ResourceType } from "@/redux/reducer-helpers/common";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";
import CommonComponentProcessingMode from "@/elchi/components/resources/common/ProcessingMode/ProcessingMode";
import CommonComponentGrpcService from "@/elchi/components/resources/common/GrpcService/GrpcService";
import CommonComponentHeaderValues from "@/elchi/components/resources/common/HeaderValue/HeaderValues";
import ComponentMetadataOptions from "../MetadataOptions/MetadataOptions";
import { matchesEndOrStartOf } from "@/utils/tools";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        reduxAction: any;
        keyPrefix?: string;
        tagPrefix?: string;
        title?: string;
    }
};


const ComponentExtProcOverrides: React.FC<GeneralProps> = ({ veri }) => {
    const dispatch = useDispatch();
    const { vTags, loading } = useTags(veri.version, modtag_ext_proc_overrides);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    // Initialize empty object in Redux when component mounts
    useEffect(() => {
        if (!veri.reduxStore && veri.keyPrefix) {
            handleChangeResources(
                {
                    version: veri.version,
                    type: ActionType.Update,
                    keys: veri.keyPrefix,
                    val: {},
                    resourceType: ResourceType.Resource
                },
                dispatch,
                veri.reduxAction
            );
        }
    }, []);

    if (loading || !vTags.epo) {
        return null;
    }

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.epo?.ExtProcOverrides,
            sf: vTags.epo?.ExtProcOverrides_SingleFields,
        }),
    ];

    return (
        <ECard title={veri.title || "Ext Proc Overrides"}>
            <HorizonTags veri={{
                tags: vTags.epo?.ExtProcOverrides,
                selectedTags: selectedTags,
                unsupportedTags: modtag_excluded_ext_proc_overrides,
                handleChangeTag: handleChangeTag,
                keyPrefix: veri.keyPrefix,
                tagPrefix: '',
                required: [],
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
            <ConditionalComponent
                shouldRender={startsWithAny("processing_mode", selectedTags)}
                Component={CommonComponentProcessingMode}
                componentProps={{
                    version: veri.version,
                    reduxStore: veri.reduxStore?.processing_mode,
                    keyPrefix: veri.keyPrefix ? `${veri.keyPrefix}.processing_mode` : "processing_mode",
                    reduxAction: veri.reduxAction,
                    title: "Processing Mode"
                }}
            />

            <ConditionalComponent
                shouldRender={startsWithAny("grpc_service", selectedTags)}
                Component={CommonComponentGrpcService}
                componentProps={{
                    version: veri.version,
                    index: 0,
                    reduxStore: veri.reduxStore?.grpc_service,
                    keyPrefix: veri.keyPrefix ? `${veri.keyPrefix}.grpc_service` : "grpc_service",
                    tagMatchPrefix: "ExtProcOverrides.grpc_service",
                    reduxAction: veri.reduxAction,
                    id: "grpc_service_0"
                }}
            />

            <ConditionalComponent
                shouldRender={matchesEndOrStartOf("grpc_initial_metadata", selectedTags)}
                Component={CommonComponentHeaderValues}
                componentProps={{
                    version: veri.version,
                    reduxStore: veri.reduxStore?.grpc_initial_metadata,
                    reduxAction: veri.reduxAction,
                    selectedTags: selectedTags,
                    tag: "grpc_initial_metadata",
                    keyPrefix: veri.keyPrefix ? `${veri.keyPrefix}.grpc_initial_metadata` : "grpc_initial_metadata",
                    title: "gRPC Initial Metadata",
                    id: "grpc_initial_metadata_0"
                }}
            />

            <ConditionalComponent
                shouldRender={startsWithAny("metadata_options", selectedTags)}
                Component={ComponentMetadataOptions}
                componentProps={{
                    version: veri.version,
                    reduxStore: veri.reduxStore?.metadata_options,
                    keyPrefix: veri.keyPrefix ? `${veri.keyPrefix}.metadata_options` : "metadata_options",
                    reduxAction: veri.reduxAction,
                    title: "Metadata Options",
                    id: "metadata_options_0"
                }}
            />

        </ECard>
    )
};

export default memorizeComponent(ComponentExtProcOverrides, compareVeriReduxStoreAndSelectedTags);
