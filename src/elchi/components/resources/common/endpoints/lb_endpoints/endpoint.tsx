import React from "react";
import { Divider, Space } from 'antd';
import { memorizeComponent, compareVeri } from "@/hooks/useMemoComponent";
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { FieldConfigType, getFieldValue, startsWithAny } from "@/utils/tools";
import { useTags } from "@/hooks/useTags";
import { modtag_endpoint } from "../_modtag_";
import useResourceForm from "@/hooks/useResourceForm";
import ECard from "@/elchi/components/common/ECard";
import CommonComponentAddress from "@resources/common/Address/Address";
import CommonComponentEndpointHC from "./endpoint_hc"
import { generateFields } from "@/common/generate-fields";
import { FieldComponent } from "@/elchi/components/common/FormItems";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import { modtag_us_listener } from "../../../listener/_modtag_";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any
        keyPrefix: string;
    }
};

const ComponentEndpoint: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_endpoint);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.e?.Endpoint,
            sf: vTags.e?.Endpoint_SingleFields,
        }),
    ]

    return (
        <ECard title="Endpoint">
            <HorizonTags veri={{
                tags: vTags.e?.Endpoint,
                selectedTags: selectedTags,
                unsupportedTags: ["additional_addresses"],
                handleChangeTag: handleChangeTag,
                keyPrefix: veri.keyPrefix,
            }} />
            <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
            <EForm>
                {fieldConfigs.map((config) => {
                    return (
                        <FieldComponent
                            key={config.tag}
                            veri={{
                                selectedTags: selectedTags,
                                handleChange: handleChangeRedux,
                                tag: config.tag,
                                keyPrefix: `${veri.keyPrefix}`,
                                value: getFieldValue(veri.reduxStore, config, veri.version),
                                type: config.type,
                                placeholder: config.placeHolder,
                                values: config.values,
                                tagPrefix: config.tagPrefix,
                            }}
                        />
                    );
                })}
            </EForm>
            <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                {startsWithAny("address", selectedTags) &&
                    <ECard title="Address">
                        <CommonComponentAddress veri={{
                            version: veri.version,
                            reduxStore: veri.reduxStore?.address,
                            keyPrefix: `${veri.keyPrefix}.address`,
                            tagPrefix: ``,
                            unsupportedAddressTag: modtag_us_listener["address"],
                            unsupportedSocketAddressTag: [],
                        }} />
                    </ECard>
                }
                <ConditionalComponent
                    shouldRender={startsWithAny("health_check_config", selectedTags)}
                    Component={CommonComponentEndpointHC}
                    componentProps={{
                        version: veri.version,
                        reduxStore: veri.reduxStore?.health_check_config,
                        keyPrefix: `${veri.keyPrefix}.health_check_config`,
                        id: `health_check_config_0`,
                    }}
                />
            </Space>
        </ECard>
    )
};

export default memorizeComponent(ComponentEndpoint, compareVeri);
