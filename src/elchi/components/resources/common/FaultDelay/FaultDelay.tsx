import React from 'react';
import { Col, Divider } from 'antd';
import { matchesEndOrStartOf } from '@/utils/tools';
import { HorizonTags } from '@/elchi/components/common/HorizonTags';
import { EForm } from '@/elchi/components/common/e-components/EForm';
import { EFields } from '@/elchi/components/common/e-components/EFields';
import CommonComponentFractionalPercent from '@resources/common/FractionalPercent/FractionalPercent';
import ECard from '@/elchi/components/common/ECard';
import { useTags } from '@/hooks/useTags';
import { useLoading } from '@/hooks/loadingContext';
import { useManagedLoading } from '@/hooks/useManageLoading';
import RenderLoading from '@/elchi/components/common/Loading';
import { modtag_fault_delay } from './_modtag_';
import { generateFields } from '@/common/generate-fields';
import { ConditionalComponent } from '@/elchi/components/common/ConditionalComponent';
import useResourceForm from '@/hooks/useResourceForm';
import { FieldTypes } from '@/common/statics/general';
import { FieldConfigType } from '@/utils/tools';

type Props = {
    veri: {
        version: string;
        reduxStore: any;
        reduxAction: any;
        keyPrefix: string;
        tagMatchPrefix: string;
    }
};

const CommonComponentFaultDelay: React.FC<Props> = ({ veri }) => {
    const { version, reduxStore, keyPrefix } = veri;
    const { vTags, loading } = useTags(version, modtag_fault_delay);
    const { loadingCount } = useLoading();
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version,
        reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.fd?.FaultDelay,
            sf: vTags.fd?.FaultDelay_SingleFields,
            e: ['percentage', 'fault_delay_secifier.header_delay'],
        }),
        {
            tag: 'header_delay',
            type: FieldTypes.EmptyObject,
            tagPrefix: 'fault_delay_secifier',
            fieldPath: 'fault_delay_secifier.header_delay',
            additionalTags: ['fault_delay_secifier.header_delay'],
        }
    ];

    useManagedLoading(loading);
    if (loadingCount > 0) {
        return <RenderLoading checkPage={true} isLoadingQuery={true} error={""} />;
    }

    return (
        <ECard title="Fault Delay">
            <HorizonTags veri={{
                tags: vTags.fd?.FaultDelay,
                selectedTags: selectedTags,
                unsupportedTags: [],
                handleChangeTag: handleChangeTag,
                keyPrefix: keyPrefix,
                tagPrefix: 'fault_delay_secifier',
                onlyOneTag: [['fault_delay_secifier.fixed_delay', 'fault_delay_secifier.header_delay']]
            }} />
            <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
            <Col md={24}>
                <EForm>
                    <EFields
                        fieldConfigs={fieldConfigs}
                        selectedTags={selectedTags}
                        handleChangeRedux={handleChangeRedux}
                        reduxStore={reduxStore}
                        keyPrefix={keyPrefix}
                        version={version}
                    />
                </EForm>
            </Col>
            <ConditionalComponent
                shouldRender={matchesEndOrStartOf('percentage', selectedTags)}
                Component={CommonComponentFractionalPercent}
                componentProps={{
                    version: version,
                    reduxStore: reduxStore?.percentage,
                    keyPrefix: `${keyPrefix}.percentage`,
                    title: "Percentage",
                }}
            />
        </ECard>
    );
};

export default React.memo(CommonComponentFaultDelay);
