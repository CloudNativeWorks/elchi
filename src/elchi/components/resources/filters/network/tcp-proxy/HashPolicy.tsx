import React from "react";
import { Col, Divider, Row } from 'antd';
import { memorizeComponent, compareVeri } from "@/hooks/useMemoComponent";
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { FieldTypes } from "@/common/statics/general";
import { FieldConfigType } from "@/utils/tools";
import useResourceForm from "@/hooks/useResourceForm";
import ECard from "@/elchi/components/common/ECard";
import { useTags } from "@/hooks/useTags";
import { modtag_hash_policy } from "./_modtag_";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import { EFields } from "@/elchi/components/common/e-components/EFields";


type GeneralProps = {
    veri: {
        version: string;
        keyPrefix: string;
        reduxStore: any;
        reduxAction: any;
        tagMatchPrefix: string;
    }
};

const ComponentHashPolicy: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_hash_policy);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        { tag: "source_ip", type: FieldTypes.EmptyObject, fieldPath: 'policy_specifier.source_ip', tagPrefix: 'policy_specifier', additionalTags: ['policy_specifier.source_ip'], navigate: true },
        { tag: "filter_state.key", type: FieldTypes.String, placeHolder: "(string)", fieldPath: 'policy_specifier.filter_state.key', tagPrefix: 'policy_specifier', additionalTags: ['policy_specifier.filter_state'], navigate: true },
    ];

    return (
        <ECard title={'Hash Policy'}>
            <Row>
                <HorizonTags veri={{
                    tags: vTags.hp?.HashPolicy,
                    selectedTags: selectedTags,
                    handleChangeTag: handleChangeTag,
                    keyPrefix: veri.keyPrefix,
                    tagPrefix: ``,
                    tagMatchPrefix: `${veri.tagMatchPrefix}.hash_policy`,
                    specificTagPrefix: { 'source_ip': 'policy_specifier', 'filter_state': 'policy_specifier' },
                    onlyOneTag: [['policy_specifier.source_ip', 'policy_specifier.filter_state']]
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

export default memorizeComponent(ComponentHashPolicy, compareVeri);
