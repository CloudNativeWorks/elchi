import React from "react";
import { Col, Divider } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import { FieldConfigType, startsWithAny } from "@/utils/tools";
import useResourceForm from "@/hooks/useResourceForm";
import CommonComponentCommonDirectionConfig from "./CommonDirectionConfig"
import ECard from "@/elchi/components/common/ECard";
import { modtag_compressor_response_direction_config } from "./_modtag_";
import { useTags } from "@/hooks/useTags";
import { generateFields } from "@/common/generate-fields";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import { EFields } from "@/elchi/components/common/e-components/EFields";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
        tagMatchPrefix: string;
        title: string;
    }
};

const ComponentResponseDirectionConfig: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_compressor_response_direction_config);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.crsdc?.Compressor_ResponseDirectionConfig,
            sf: vTags.crsdc?.Compressor_ResponseDirectionConfig_SingleFields,
        })
    ];

    return (
        <ECard title={veri.title}>
            <HorizonTags veri={{
                tags: vTags.crsdc?.Compressor_ResponseDirectionConfig,
                selectedTags: selectedTags,
                unsupportedTags: [],
                handleChangeTag: handleChangeTag,
                tagMatchPrefix: veri.tagMatchPrefix,
                keyPrefix: veri.keyPrefix,
            }} />
            <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
            <Col md={24}>
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
                    shouldRender={startsWithAny("common_config", selectedTags)}
                    Component={CommonComponentCommonDirectionConfig}
                    componentProps={{
                        version: veri.version,
                        reduxStore: veri.reduxStore?.common_config,
                        keyPrefix: `${veri.keyPrefix}.common_config`,
                        tagMatchPrefix: `${veri.tagMatchPrefix}.common_config`,
                        title: "Common Config",
                        id: `common_config_0`,
                    }}
                />
            </Col>
        </ECard>
    )
};

export default memorizeComponent(ComponentResponseDirectionConfig, compareVeri);
