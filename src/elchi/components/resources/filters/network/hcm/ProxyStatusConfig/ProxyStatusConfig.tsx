import React from "react";
import { Col, Divider } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import { FieldConfigType } from "@/utils/tools";
import useResourceForm from "@/hooks/useResourceForm";
import ECard from "@/elchi/components/common/ECard";
import { useTags } from "@/hooks/useTags";
import { modtag_http_connection_manager } from "../_modtag_";
import { generateFields } from "@/common/generate-fields";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import { EFields } from "@/elchi/components/common/e-components/EFields";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
        title: string;
        id?: string;
    }
};

const ComponentProxyStatusConfig: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_http_connection_manager);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.psc?.HttpConnectionManager_ProxyStatusConfig,
            sf: vTags.psc?.HttpConnectionManager_ProxyStatusConfig_SingleFields,
            r: []
        }),
    ];

    return (
        <ECard title={veri.title} id={veri.id}>
            <HorizonTags veri={{
                tags: vTags.psc?.HttpConnectionManager_ProxyStatusConfig,
                selectedTags: selectedTags,
                unsupportedTags: [],
                handleChangeTag: handleChangeTag,
                keyPrefix: veri.keyPrefix,
                specificTagPrefix: { "use_node_id": "proxy_name", "literal_proxy_name": "proxy_name" },
                required: [],
                onlyOneTag: [["proxy_name.use_node_id", "proxy_name.literal_proxy_name"]]
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
            </Col>
        </ECard>
    )
};

export default memorizeComponent(ComponentProxyStatusConfig, compareVeri);
