import React from "react";
import { Col, Divider } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import { FieldConfigType, startsWithAny } from "@/utils/tools";
import useResourceForm from "@/hooks/useResourceForm";
import ECard from "@/elchi/components/common/ECard";
import { useTags } from "@/hooks/useTags";
import { modtag_keepalive_settings } from "./_modtag_";
import { generateFields } from "@/common/generate-fields";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import { EFields } from "@/elchi/components/common/e-components/EFields";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";
import CommonComponentPercent from "@/elchi/components/resources/common/Percent/Percent";


type GeneralProps = {
    veri: {
        version: string;
        index: number;
        reduxStore: any;
        keyPrefix: string;
        tagMatchPrefix: string;
        title: string;
    }
};

const CommonComponentKeepaliveSettings: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_keepalive_settings);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.ks?.KeepaliveSettings,
            sf: vTags.ks?.KeepaliveSettings_SingleFields,
        }),
    ];

    return (
        <ECard title={veri.title}>
            <HorizonTags veri={{
                tags: vTags.ks?.KeepaliveSettings,
                selectedTags: selectedTags,
                unsupportedTags: [],
                index: veri.index,
                handleChangeTag: handleChangeTag,
                tagMatchPrefix: veri.tagMatchPrefix,
                keyPrefix: `${veri.keyPrefix}`,
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
            <ConditionalComponent
                shouldRender={startsWithAny("interval_jitter", selectedTags)}
                Component={CommonComponentPercent}
                componentProps={{
                    version: veri.version,
                    reduxStore: veri.reduxStore?.interval_jitter,
                    keyPrefix: `${veri.keyPrefix}.interval_jitter`,
                    id: `interval_jitter_0`,
                    title: "Interval Jitter",
                }}
            />
            
        </ECard>
    )
};

export default memorizeComponent(CommonComponentKeepaliveSettings, compareVeri);
