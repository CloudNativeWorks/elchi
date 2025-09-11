import React from 'react';
import { Col, Divider } from 'antd';
import { HorizonTags } from '@/elchi/components/common/HorizonTags';
import { memorizeComponent, compareVeri } from '@/hooks/useMemoComponent';
import { FieldConfigType } from '@/utils/tools';
import useResourceForm from '@/hooks/useResourceForm';
import ECard from '@/elchi/components/common/ECard';
import { modtag_hash_policy_cookie_attribute } from '../_modtag_';
import { useTags } from '@/hooks/useTags';
import { generateFields } from '@/common/generate-fields';
import { EForm } from '@/elchi/components/common/e-components/EForm';
import { EFields } from '@/elchi/components/common/e-components/EFields';


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
    }
};

const ComponentCookieAttribute: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_hash_policy_cookie_attribute);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.hpca?.RouteAction_HashPolicy_CookieAttribute,
            sf: vTags.hpca?.RouteAction_HashPolicy_CookieAttribute_SingleFields,
            sn: 8,
            r: ['name']
        })
    ];

    return (
        <ECard title={`Attribute`}>
            <Col md={24}>
                <HorizonTags veri={{
                    tags: vTags.hpca?.RouteAction_HashPolicy_CookieAttribute,
                    selectedTags: selectedTags,
                    handleChangeTag: handleChangeTag,
                    keyPrefix: veri.keyPrefix,
                    required: ['name']
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

export default memorizeComponent(ComponentCookieAttribute, compareVeri);
