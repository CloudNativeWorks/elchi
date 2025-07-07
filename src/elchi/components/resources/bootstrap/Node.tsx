import React from "react";
import { Col, Row, Divider } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import { FieldConfigType, startsWithAny } from "@/utils/tools";
import CCard from "@/elchi/components/common/CopyPasteCard";
import CommonComponentLocality from '../common/Locality/Locality';
import useResourceForm from "@/hooks/useResourceForm";
import { modtag_node, modtag_us_bootstrap } from "./_modtag_";
import { useTags } from "@/hooks/useTags";
import { useModels } from "@/hooks/useModels";
import { generateFields } from "@/common/generate-fields";
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

const ComponentNode: React.FC<GeneralProps> = ({ veri }) => {
    const { vModels } = useModels(veri.version, modtag_node);
    const { vTags } = useTags(veri.version, modtag_node);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.n?.Node,
            sf: vTags.n?.Node_SingleFields,
            d: ['id']
        }),
    ]

    return (
        <CCard reduxStore={veri.reduxStore} toJSON={vModels.n?.Node.toJSON} keys={veri.keyPrefix} Paste={handleChangeRedux} ctype="node" title="Node">
            <HorizonTags veri={{
                tags: vTags.n?.Node,
                unsupportedTags: modtag_us_bootstrap["node"],
                selectedTags: selectedTags,
                keyPrefix: veri.keyPrefix,
                handleChangeTag: handleChangeTag,
                tagMatchPrefix: veri.tagMatchPrefix,
                tagPrefix: ``,
                specificTagPrefix: { 'user_agent_version': 'user_agent_version_type' },
            }} />
            <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
            <Row>
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
            <ConditionalComponent
                shouldRender={startsWithAny("locality", selectedTags)}
                Component={CommonComponentLocality}
                componentProps={{
                    version: veri.version,
                    index: 0,
                    reduxStore: veri.reduxStore?.locality,
                    keyPrefix: `node.locality`,
                    tagMatchPrefix: `Bootstrap.node.locality`,
                    id: `locality_0`,
                }}
            />
        </CCard>
    )
};


export default memorizeComponent(ComponentNode, compareVeri);