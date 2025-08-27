import React from 'react';
import { Col, Divider } from 'antd';
import { HorizonTags } from '@/elchi/components/common/HorizonTags';
import { memorizeComponent, compareVeri } from '@/hooks/useMemoComponent';
import { FieldConfigType } from '@/utils/tools';
import useResourceForm from '@/hooks/useResourceForm';
import ECard from '@/elchi/components/common/ECard';
import { modtag_hash_policy_filter_state } from '../_modtag_';
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

const ComponentFilterState: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_hash_policy_filter_state);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.hpfs?.RouteAction_HashPolicy_FilterState,
            sf: vTags.hpfs?.RouteAction_HashPolicy_FilterState_SingleFields,
            sn: 6,
            r: ['key']
        })
    ];

    return (
        <ECard title={`Filter State`}>
            <Col md={24}>
                <HorizonTags veri={{
                    tags: vTags.hpfs?.RouteAction_HashPolicy_FilterState,
                    selectedTags: selectedTags,
                    tagMatchPrefix: veri.tagMatchPrefix,
                    handleChangeTag: handleChangeTag,
                    keyPrefix: veri.keyPrefix,
                    required: ['key']
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

export default memorizeComponent(ComponentFilterState, compareVeri);
