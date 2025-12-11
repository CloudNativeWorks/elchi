import React from 'react';
import { Col, Divider, Row } from 'antd';
import { memorizeComponent, compareVeri } from '@/hooks/useMemoComponent';
import { HorizonTags } from '@/elchi/components/common/HorizonTags';
import { FieldConfigType } from '@/utils/tools';
import useResourceForm from '@/hooks/useResourceForm';
import ECard from '@/elchi/components/common/ECard';
import { useTags } from '@/hooks/useTags';
import { modtag_custom_tags } from './_modtag_';
import { generateFields } from '@/common/generate-fields';
import { EForm } from '@/elchi/components/common/e-components/EForm';
import { EFields } from '@/elchi/components/common/e-components/EFields';

type GeneralProps = {
    veri: {
        version: string;
        keyPrefix: string;
        reduxStore: any;
    }
};

const ComponentCustomTagHeader: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_custom_tags);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.cth?.CustomTag_Header,
            sf: vTags.cth?.CustomTag_Header_SingleFields,
            e: [],
        }),
    ];

    return (
        <ECard title={'Request Header Type'}>
            <Row>
                <HorizonTags veri={{
                    tags: vTags.cth?.CustomTag_Header,
                    selectedTags: selectedTags,
                    handleChangeTag: handleChangeTag,
                    keyPrefix: veri.keyPrefix,
                    required: ['name']
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
    );
};

export default memorizeComponent(ComponentCustomTagHeader, compareVeri);
