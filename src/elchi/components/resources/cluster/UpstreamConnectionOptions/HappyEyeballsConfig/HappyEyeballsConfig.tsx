import React from "react";
import { Col, Divider } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { FieldConfigType } from "@/utils/tools";
import { useTags } from "@/hooks/useTags";
import { modtag_happy_eyeballs_config, modtag_us_happy_eyeballs_config } from "./_modtag_";
import { generateFields } from "@/common/generate-fields";
import useResourceForm from "@/hooks/useResourceForm";
import ECard from "@/elchi/components/common/ECard";
import { EForm } from "../../../../common/e-components/EForm";
import { EFields } from "../../../../common/e-components/EFields";

type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
        id: string;
    }
};

const ComponentHappyEyeballsConfig: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_happy_eyeballs_config);

    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.hec?.UpstreamConnectionOptions_HappyEyeballsConfig,
            sf: vTags.hec?.UpstreamConnectionOptions_HappyEyeballsConfig_SingleFields,
        }),
    ];

    return (
        <ECard title="Happy Eyeballs Config" id={veri.id}>
            <HorizonTags veri={{
                tags: vTags.hec?.UpstreamConnectionOptions_HappyEyeballsConfig,
                selectedTags: selectedTags || [],
                unsupportedTags: modtag_us_happy_eyeballs_config.UpstreamConnectionOptions_HappyEyeballsConfig || [],
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

export default ComponentHappyEyeballsConfig;
