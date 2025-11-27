import React from "react";
import { Col, Divider } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { FieldConfigType } from "@/utils/tools";
import { useTags } from "@/hooks/useTags";
import { modtag_downstream_socket_config, modtag_us_downstream_socket_config } from "./_modtag_";
import { generateFields } from "@/common/generate-fields";
import useResourceForm from "@/hooks/useResourceForm";
import ECard from "@/elchi/components/common/ECard";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import { EFields } from "@/elchi/components/common/e-components/EFields";

type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
        id: string;
        title: string;
    }
};

const ComponentDownstreamSocketConfig: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_downstream_socket_config);

    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.dsc?.UdpSocketConfig,
            sf: vTags.dsc?.UdpSocketConfig_SingleFields,
        }),
    ];

    return (
        <ECard title={veri.title} id={veri.id}>
            <HorizonTags veri={{
                tags: vTags.dsc?.UdpSocketConfig,
                selectedTags: selectedTags || [],
                unsupportedTags: modtag_us_downstream_socket_config.UdpSocketConfig || [],
                keyPrefix: veri.keyPrefix,
                handleChangeTag: handleChangeTag,
            }} />
            <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
            <Col md={24}>
                <EForm>
                    <EFields
                        fieldConfigs={fieldConfigs}
                        selectedTags={selectedTags || []}
                        handleChangeRedux={handleChangeRedux}
                        reduxStore={veri.reduxStore}
                        keyPrefix={veri.keyPrefix}
                        version={veri.version}
                    />
                </EForm>
            </Col>
        </ECard>
    );
};

export default ComponentDownstreamSocketConfig;
