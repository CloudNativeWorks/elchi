import React from "react";
import { Col, Divider, Row } from 'antd';
import { memorizeComponent, compareVeri } from "@/hooks/useMemoComponent";
import { FieldComponent } from "@/elchi/components/common/FormItems";
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { FieldConfigType, getFieldValue, startsWithAny } from "@/utils/tools";
import { useTags } from "@/hooks/useTags";
import { modtag_endpoint_hc } from "../_modtag_";
import { generateFields } from "@/common/generate-fields";
import useResourceForm from "@/hooks/useResourceForm";
import ECard from "@/elchi/components/common/ECard";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";
import CommonComponentSocketAddress from "@resources/common/Address/socket_address";
import { navigateCases } from "@/elchi/helpers/navigate-cases";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any
        keyPrefix: string;
    }
};

const CommonComponentEndpointHC: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_endpoint_hc);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.eh?.Endpoint_HealthCheckConfig,
            sf: vTags.eh?.Endpoint_HealthCheckConfig_SingleFields,
        }),
    ]

    return (
        <ECard title="Health Check Config">
            <HorizonTags veri={{
                tags: vTags.eh?.Endpoint_HealthCheckConfig,
                selectedTags: selectedTags,
                unsupportedTags: [],
                handleChangeTag: handleChangeTag,
                keyPrefix: veri.keyPrefix,
            }} />
            <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
            <Col md={24}>
                <EForm>
                    <Row gutter={[5, 1]}>
                        {fieldConfigs.map((config) => {
                            return (<FieldComponent key={config.tag}
                                veri={{
                                    selectedTags: selectedTags,
                                    handleChange: handleChangeRedux,
                                    tag: config.tag,
                                    keyPrefix: config.keyPrefix ? `${veri.keyPrefix}.${config.keyPrefix}` : veri.keyPrefix,
                                    value: getFieldValue(veri.reduxStore, config, veri.version),
                                    type: config.type,
                                    tagPrefix: config.tagPrefix,
                                    placeholder: config.placeHolder,
                                    values: config.values,
                                }}
                            />);
                        })}
                    </Row>
                </EForm>
                <ConditionalComponent
                    shouldRender={startsWithAny("address", selectedTags)}
                    Component={CommonComponentSocketAddress}
                    componentProps={{
                        version: veri.version,
                        reduxStore: navigateCases(veri.reduxStore, 'address.address.socket_address'),
                        keyPrefix: `${veri.keyPrefix}.address.socket_address`,
                        unsupportedAddressTag: [],
                        unsupportedSocketAddressTag: [],
                        id: `address.socket_address`,
                    }}
                />
            </Col>
        </ECard>
    )
};

export default memorizeComponent(CommonComponentEndpointHC, compareVeri);
