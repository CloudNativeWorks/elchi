import React from "react";
import { Col, Row, Divider } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import { FieldTypes } from "@/common/statics/general";
import { FieldConfigType, startsWithAny } from "@/utils/tools";
import ComponentGrpcServices from './GrpcServices';
import useResourceForm from "@/hooks/useResourceForm";
import ECard from "../../common/ECard";
import { modtag_api_config_source, modtag_us_bootstrap } from "./_modtag_";
import { useTags } from "@/hooks/useTags";
import { ConditionalComponent } from "../../common/ConditionalComponent";
import { EForm } from "../../common/e-components/EForm";
import { EFields } from "../../common/e-components/EFields";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
        tagMatchPrefix: string;
    }
};

const ComponentDynamicResources: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_api_config_source);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore?.ads_config,
    });


    const fieldConfigs: FieldConfigType[] = [
        { tag: "api_type", type: FieldTypes.Select, placeHolder: "(ApiType)", fieldPath: 'api_type', values: ["DELTA_GRPC"], disabled: true },
        { tag: "transport_api_version", type: FieldTypes.Select, placeHolder: "(ApiVersion)", fieldPath: 'transport_api_version', values: ["V3"], disabled: true },
        { tag: "set_node_on_first_message_only", type: FieldTypes.Boolean, fieldPath: 'set_node_on_first_message_only', disabled: true },
    ]

    return (
        <ECard title="Dynamic Resources (ADS) (ReadOnly)">
            <HorizonTags veri={{
                tags: vTags.acs?.ApiConfigSource,
                unsupportedTags: modtag_us_bootstrap["ads_config"],
                selectedTags: selectedTags,
                keyPrefix: veri.keyPrefix,
                handleChangeTag: handleChangeTag,
                tagMatchPrefix: veri.tagMatchPrefix,
                doNotChange: ["api_type", "transport_api_version", "set_node_on_first_message_only", "grpc_services"],
            }} />
            <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
            <Row>
                <Col md={24}>
                    <EForm>
                        <EFields
                            fieldConfigs={fieldConfigs}
                            selectedTags={selectedTags}
                            handleChangeRedux={handleChangeRedux}
                            reduxStore={veri.reduxStore?.ads_config}
                            keyPrefix={veri.keyPrefix}
                            version={veri.version}
                        />
                    </EForm>
                </Col>
            </Row>
            <ConditionalComponent
                shouldRender={startsWithAny("grpc_services", selectedTags)}
                Component={ComponentGrpcServices}
                componentProps={{
                    version: veri.version,
                    index: 0,
                    controllerIndex: veri?.reduxStore?.ads_config?.grpc_services?.[0]?.initial_metadata?.[0]?.value,
                    reduxStore: veri.reduxStore?.ads_config?.grpc_services?.[0]?.target_specifier?.envoy_grpc,
                    keyPrefix: `dynamic_resources.ads_config.grpc_services.0.envoy_grpc`,
                    tagMatchPrefix: `Bootstrap.dynamic_resources.ads_config.grpc_services.target_specifier.envoy_grpc`,
                    id: `grpc_services_0`,
                }}
            />
        </ECard>
    )
};


export default memorizeComponent(ComponentDynamicResources, compareVeri);