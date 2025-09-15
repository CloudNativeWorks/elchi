import React from 'react';
import { Col, Divider } from 'antd';
import { HorizonTags } from '@/elchi/components/common/HorizonTags';
import { memorizeComponent, compareVeri } from '@/hooks/useMemoComponent';
import { FieldConfigType, startsWithAny } from '@/utils/tools';
import CommonComponentRegexMatchAndSubstitute from '../../common/RegexMatchAndSubstitute/RegexMatchAndSubstitute';
import useResourceForm from '@/hooks/useResourceForm';
import ECard from '@/elchi/components/common/ECard';
import { modtag_hash_policy_header } from '../_modtag_';
import { useTags } from '@/hooks/useTags';
import { generateFields } from '@/common/generate-fields';
import { ConditionalComponent } from '@/elchi/components/common/ConditionalComponent';
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

const ComponentHeader: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_hash_policy_header);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.hph?.RouteAction_HashPolicy_Header,
            sf: vTags.hph?.RouteAction_HashPolicy_Header_SingleFields,
            sn: 24,
            r: ['header_name']
        })
    ];

    return (
        <ECard title={`Header`}>
            <Col md={24}>
                <HorizonTags veri={{
                    tags: vTags.hph?.RouteAction_HashPolicy_Header,
                    selectedTags: selectedTags,
                    tagPrefix: '',
                    tagMatchPrefix: veri.tagMatchPrefix,
                    handleChangeTag: handleChangeTag,
                    keyPrefix: veri.keyPrefix,
                    required: ['header_name']
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
                <ConditionalComponent
                    shouldRender={startsWithAny('regex_rewrite', selectedTags)}
                    Component={CommonComponentRegexMatchAndSubstitute}
                    componentProps={{
                        version: veri.version,
                        reduxAction: veri.reduxAction,
                        reduxStore: veri.reduxStore?.regex_rewrite,
                        keyPrefix: `${veri.keyPrefix}.regex_rewrite`,
                        tagPrefix: `regex_rewrite`,
                        tagMatchPrefix: `${veri.tagMatchPrefix}.regex_rewrite`,
                        id: `${veri.keyPrefix}.regex_rewrite`,
                    }}
                />
            </Col>
        </ECard>
    )
};

export default memorizeComponent(ComponentHeader, compareVeri);
