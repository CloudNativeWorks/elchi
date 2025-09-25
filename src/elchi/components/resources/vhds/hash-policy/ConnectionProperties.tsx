import React from 'react';
import { Col, Divider } from 'antd';
import { HorizonTags } from '@/elchi/components/common/HorizonTags';
import { memorizeComponent, compareVeri } from '@/hooks/useMemoComponent';
import { FieldConfigType } from '@/utils/tools';
import useResourceForm from '@/hooks/useResourceForm';
import ECard from '@/elchi/components/common/ECard';
import { modtag_hash_policy_connection_properties } from '../_modtag_';
import { useTags } from '@/hooks/useTags';
import { generateFields } from '@/common/generate-fields';
import { EForm } from '@/elchi/components/common/e-components/EForm';
import { EFields } from '@/elchi/components/common/e-components/EFields';


type GeneralProps = {
    veri: {
        version: string;
        reduxAction: any;
        reduxStore: any;
        keyPrefix: string;
        tagPrefix: string;
        tagMatchPrefix: string;
    }
};

const ComponentConnectionProperties: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_hash_policy_connection_properties);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.hpcp?.RouteAction_HashPolicy_ConnectionProperties,
            sf: vTags.hpcp?.RouteAction_HashPolicy_ConnectionProperties_SingleFields,
            sn: 6,
            r: ['source_ip']
        })
    ];

    return (
        <ECard title={`Connection Properties`}>
            <Col md={24}>
                <HorizonTags veri={{
                    tags: vTags.hpcp?.RouteAction_HashPolicy_ConnectionProperties,
                    selectedTags: selectedTags,
                    tagMatchPrefix: veri.tagMatchPrefix,
                    handleChangeTag: handleChangeTag,
                    keyPrefix: veri.keyPrefix,
                    required: ['source_ip']
                }} />
                <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type='horizontal' />
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

export default memorizeComponent(ComponentConnectionProperties, compareVeri);
