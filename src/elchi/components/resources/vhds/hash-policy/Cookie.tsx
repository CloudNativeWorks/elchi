import React from 'react';
import { Col, Divider, Row } from 'antd';
import { HorizonTags } from '@/elchi/components/common/HorizonTags';
import { memorizeComponent, compareVeri } from '@/hooks/useMemoComponent';
import { FieldConfigType } from '@/utils/tools';
import useResourceForm from '@/hooks/useResourceForm';
import ECard from '@/elchi/components/common/ECard';
import { modtag_hash_policy_cookie } from '../_modtag_';
import { useTags } from '@/hooks/useTags';
import { generateFields } from '@/common/generate-fields';
import { EForm } from '@/elchi/components/common/e-components/EForm';
import { EFields } from '@/elchi/components/common/e-components/EFields';
import TabComponent from '@/elchi/components/common/TabComponent';
import ComponentCookieAttribute from './CookieAttribute';


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

const ComponentCookie: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_hash_policy_cookie);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.hpc?.RouteAction_HashPolicy_Cookie,
            sf: vTags.hpc?.RouteAction_HashPolicy_Cookie_SingleFields,
            sn: 8,
            r: ['name']
        })
    ];

    return (
        <ECard title={`Cookie`}>
            <HorizonTags veri={{
                tags: vTags.hpc?.RouteAction_HashPolicy_Cookie,
                selectedTags: selectedTags,
                tagPrefix: '',
                tagMatchPrefix: veri.tagMatchPrefix,
                handleChangeTag: handleChangeTag,
                keyPrefix: veri.keyPrefix,
                required: ['name']
            }} />
            <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type='horizontal' />
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
            <TabComponent veri={{
                version: veri.version,
                title: 'Attributes',
                reduxStore: veri.reduxStore?.attributes,
                keyPrefix: `${veri.keyPrefix}.attributes`,
                label: 'attr',
                component: ComponentCookieAttribute,
                veri: {
                    version: veri.version,
                }
            }} />
        </ECard>
    )
};

export default memorizeComponent(ComponentCookie, compareVeri);
