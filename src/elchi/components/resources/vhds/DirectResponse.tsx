import React from "react";
import { Card, Col, Divider, Row } from 'antd';
import { memorizeComponent, compareVeri } from "@/hooks/useMemoComponent";
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { FieldConfigType, startsWithAny } from "@/utils/tools";
import CommonComponentDataSource from '../common/DataSource/DataSource'
import useResourceForm from "@/hooks/useResourceForm";
import { useTags } from "@/hooks/useTags";
import { modtag_direct_response_action } from "./_modtag_";
import { generateFields } from "@/common/generate-fields";
import { ConditionalComponent } from "../../common/ConditionalComponent";
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

const ComponentDirectResponse: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_direct_response_action);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.dra?.DirectResponseAction,
            sf: vTags.dra?.DirectResponseAction_SingleFields,
        })
    ]

    return (
        <Card size='small' title={'Direct Response'} styles={{ header: { background: 'white', color: 'black' } }} style={{ marginBottom: 8, width: '100%' }}>
            <Row>
                <HorizonTags veri={{
                    tags: vTags.dra?.DirectResponseAction,
                    selectedTags: selectedTags,
                    handleChangeTag: handleChangeTag,
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
                        shouldRender={startsWithAny("body", selectedTags)}
                        Component={CommonComponentDataSource}
                        componentProps={{
                            version: veri.version,
                            reduxStore: veri.reduxStore?.body,
                            keyPrefix: `${veri.keyPrefix}.body`,
                            tagPrefix: `body`,
                            parentName: 'Data Source',
                            fileName: 'Direct response file',
                            id: `body_0`
                        }}
                    />
                </Col>
            </Row>
        </Card>
    )
};

export default memorizeComponent(ComponentDirectResponse, compareVeri);
