import React, { useEffect } from "react";
import { Divider } from 'antd';
import { useDispatch } from "react-redux";
import { compareVeriReduxStoreAndSelectedTags, memorizeComponent } from "@/hooks/useMemoComponent";
import { FieldConfigType, startsWithAny } from "@/utils/tools";
import ECard from "@/elchi/components/common/ECard";
import { EFields } from "@/elchi/components/common/e-components/EFields";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import { useTags } from "@/hooks/useTags";
import { modtag_check_settings } from "./_modtag_";
import { generateFields } from "@/common/generate-fields";
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import useResourceForm from "@/hooks/useResourceForm";
import { handleChangeResources } from "@/redux/dispatcher";
import { ActionType, ResourceType } from "@/redux/reducer-helpers/common";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";
import CommonComponentGrpcService from "@/elchi/components/resources/common/GrpcService/GrpcService";
import ComponentHttpService from "../HttpService/HttpService";
import ComponentBufferSettings from "../BufferSettings/BufferSettings";
import MapField from "@/elchi/components/common/MapField/MapField";
import { navigateCases } from "@/elchi/helpers/navigate-cases";


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


const ComponentCheckSettings: React.FC<GeneralProps> = ({ veri }) => {
    const dispatch = useDispatch();
    const { vTags, loading } = useTags(veri.version, modtag_check_settings);
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

    if (loading || !vTags.cs) {
        return null;
    }

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.cs?.CheckSettings,
            sf: vTags.cs?.CheckSettings_SingleFields,
        }),
    ];

    return (
        <ECard title={veri.title || "Check Settings"}>
            <HorizonTags veri={{
                tags: vTags.cs?.CheckSettings,
                selectedTags: selectedTags,
                unsupportedTags: [],
                handleChangeTag: handleChangeTag,
                keyPrefix: veri.keyPrefix,
                tagPrefix: '',
                specificTagPrefix: {'grpc_service': 'service_override', 'http_service': 'service_override'},
                required: [],
                onlyOneTag: [['service_override.grpc_service', 'service_override.http_service']],
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
                shouldRender={startsWithAny("service_override.grpc_service", selectedTags)}
                Component={CommonComponentGrpcService}
                componentProps={{
                    version: veri.version,
                    index: 0,
                    reduxStore: navigateCases(veri.reduxStore, "service_override.grpc_service"),
                    keyPrefix: veri.keyPrefix ? `${veri.keyPrefix}.grpc_service` : "grpc_service",
                    tagMatchPrefix: "CheckSettings.service_override.grpc_service",
                    reduxAction: veri.reduxAction,
                    id: "service_override_grpc_service_0"
                }}
            />

            <ConditionalComponent
                shouldRender={startsWithAny("service_override.http_service", selectedTags)}
                Component={ComponentHttpService}
                componentProps={{
                    version: veri.version,
                    reduxStore: navigateCases(veri.reduxStore, "service_override.http_service"),
                    keyPrefix: veri.keyPrefix ? `${veri.keyPrefix}.http_service` : "http_service",
                    reduxAction: veri.reduxAction,
                    title: "HTTP Service Override",
                }}
            />

            <ConditionalComponent
                shouldRender={startsWithAny("with_request_body", selectedTags)}
                Component={ComponentBufferSettings}
                componentProps={{
                    version: veri.version,
                    reduxStore: veri.reduxStore?.with_request_body,
                    keyPrefix: veri.keyPrefix ? `${veri.keyPrefix}.with_request_body` : "with_request_body",
                    title: "With Request Body",
                }}
            />

            {startsWithAny("context_extensions", selectedTags) && (
                <MapField
                    version={veri.version}
                    reduxStore={veri.reduxStore?.context_extensions}
                    keyPrefix={veri.keyPrefix ? `${veri.keyPrefix}.context_extensions` : "context_extensions"}
                    reduxAction={veri.reduxAction}
                    title="Context Extensions"
                    valueType="string"
                    keyPlaceholder="Extension key"
                    valuePlaceholder="Extension value"
                    id="context_extensions_0"
                />
            )}
        </ECard>
    )
};

export default memorizeComponent(ComponentCheckSettings, compareVeriReduxStoreAndSelectedTags);
