import React from "react";
import { Col, Divider, Row } from 'antd';
import { memorizeComponent, compareVeri } from "@/hooks/useMemoComponent";
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { FieldConfigType } from "@/utils/tools";
import useResourceForm from "@/hooks/useResourceForm";
import ECard from "../../common/ECard";
import { modtag_max_stream_duration } from "./_modtag_";
import { useTags } from "@/hooks/useTags";
import { generateFields } from "@/common/generate-fields";
import { EForm } from "../../common/e-components/EForm";
import { EFields } from "../../common/e-components/EFields";


type GeneralProps = {
    veri: {
        version: string;
        keyPrefix: string;
        reduxStore: any;
        reduxAction: any;
        tagMatchPrefix: string;
    }
};

const ComponentMaxStreamDuration: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_max_stream_duration);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.msd?.RouteAction_MaxStreamDuration,
            sf: vTags.msd?.RouteAction_MaxStreamDuration_SingleFields,
        }),
    ]

    return (
        <ECard title={'Max Stream Duration'}>
            <Row>
                <HorizonTags veri={{
                    tags: vTags.msd?.RouteAction_MaxStreamDuration,
                    selectedTags: selectedTags,
                    handleChangeTag: handleChangeTag,
                    tagPrefix: `max_stream_duration`,
                    tagMatchPrefix: `${veri.tagMatchPrefix}`,
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
                </Col>
            </Row>
        </ECard>
    )
};

export default memorizeComponent(ComponentMaxStreamDuration, compareVeri);
