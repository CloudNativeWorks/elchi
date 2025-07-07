import React from "react";
import { Col, Divider } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import { startsWithAny } from "@/utils/tools";
import { modtag_compressor_request_direction_config } from "./_modtag_";
import { useTags } from "@/hooks/useTags";
import CommonComponentCommonDirectionConfig from "./CommonDirectionConfig"
import useResourceForm from "@/hooks/useResourceForm";
import ECard from "@/elchi/components/common/ECard";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
        tagMatchPrefix: string;
        title: string;
    }
};

const ComponentRequestDirectionConfig: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_compressor_request_direction_config);
    const { selectedTags, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    return (
        <ECard title={veri.title}>
            <HorizonTags veri={{
                tags: vTags.crdc?.Compressor_RequestDirectionConfig,
                selectedTags: selectedTags,
                unsupportedTags: [],
                handleChangeTag: handleChangeTag,
                tagMatchPrefix: veri.tagMatchPrefix,
                keyPrefix: veri.keyPrefix,
            }} />
            <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
            <Col md={24}>
                <ConditionalComponent
                    shouldRender={startsWithAny("common_config", selectedTags)}
                    Component={CommonComponentCommonDirectionConfig}
                    componentProps={{
                        version: veri.version,
                        reduxStore: veri.reduxStore?.common_config,
                        keyPrefix: `${veri.keyPrefix}.common_config`,
                        tagMatchPrefix: `${veri.tagMatchPrefix}.common_config`,
                        title: "Common Direction Config",
                        id: `common_config_0`,
                    }}
                />
            </Col>
        </ECard>
    )
};

export default memorizeComponent(ComponentRequestDirectionConfig, compareVeri);
