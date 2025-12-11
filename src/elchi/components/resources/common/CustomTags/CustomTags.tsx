import React, { useEffect, useState } from 'react';
import { Col, Tabs, Divider } from 'antd';
import { HorizonTags } from '@/elchi/components/common/HorizonTags';
import { EForm } from '@/elchi/components/common/e-components/EForm';
import { EFields } from '@/elchi/components/common/e-components/EFields';
import ECard from '@/elchi/components/common/ECard';
import { useTags } from '@/hooks/useTags';
import { useLoading } from '@/hooks/loadingContext';
import { useManagedLoading } from '@/hooks/useManageLoading';
import RenderLoading from '@/elchi/components/common/Loading';
import { generateFields } from '@/common/generate-fields';
import useResourceForm from '@/hooks/useResourceForm';
import { FieldConfigType, matchesEndOrStartOf } from '@/utils/tools';
import { ByteToObj } from '@/utils/typed-config-op';
import useTabManager from '@/hooks/useTabManager';
import { modtag_custom_tags } from './_modtag_';
import { memorizeComponent, compareVeri } from '@/hooks/useMemoComponent';
import { ConditionalComponent } from '@/elchi/components/common/ConditionalComponent';
import ComponentCustomTagLiteral from './CustomTagLiteral';
import ComponentCustomTagEnvironment from './CustomTagEnvironment';
import ComponentCustomTagHeader from './CustomTagHeader';


type Props = {
    veri: {
        version: string;
        reduxStore: any[];
        reduxAction: any;
        keyPrefix: string;
        id?: string;
    }
};

const CommonComponentCustomTags: React.FC<Props> = ({ veri }) => {
    const { vTags, loading } = useTags(veri.version, modtag_custom_tags);
    const { loadingCount } = useLoading();
    const [rState, setRState] = useState<any>();
    const { state, onChangeTabs, addTab } = useTabManager({
        initialActiveTab: "0",
        reduxStore: veri.reduxStore,
        keyPrefix: veri.keyPrefix,
        version: veri.version,
        reduxAction: veri.reduxAction
    });

    useEffect(() => {
        if (veri.reduxStore) {
            setRState(ByteToObj(veri.reduxStore));
        }
    }, [veri.reduxStore]);

    useManagedLoading(loading);
    if (loadingCount > 0) {
        return <RenderLoading checkPage={true} isLoadingQuery={true} error={""} />;
    }

    return (
        <ECard title="Custom Tags" id={veri.id}>
            <Tabs
                onChange={onChangeTabs}
                type="editable-card"
                activeKey={state.activeTab}
                onEdit={addTab}
                style={{ width: "99%" }}
                items={rState?.map((data: any, index: number) => {
                    return {
                        key: index.toString(),
                        label: `Custom Tag ${index}`,
                        forceRender: true,
                        children: (
                            <Col md={24}>
                                <CustomTagContent
                                    veri={{
                                        version: veri.version,
                                        reduxStore: data,
                                        keyPrefix: `${veri.keyPrefix}.${index}`,
                                        vTags,
                                    }}
                                />
                            </Col>
                        ),
                    };
                })}
            />
        </ECard>
    );
};

type ContentProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
        vTags: any;
    }
};

const CustomTagContent: React.FC<ContentProps> = ({ veri }) => {
    const { version, reduxStore, keyPrefix, vTags } = veri;
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version,
        reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.ct?.CustomTag,
            sf: vTags.ct?.CustomTag_SingleFields,
            e: [],
        }),
    ];

    return (
        <>
            <HorizonTags veri={{
                tags: vTags.ct?.CustomTag,
                selectedTags: selectedTags,
                unsupportedTags: ["type.metadata"],
                handleChangeTag: handleChangeTag,
                keyPrefix: keyPrefix,
                tagPrefix: '',
                required: ['tag'],
                specificTagPrefix: { 'literal': 'type', 'environment': 'type', 'request_header': 'type', 'metadata': 'type' },
                onlyOneTag: [['type.literal', 'type.environment', 'type.request_header', 'type.metadata']]
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
                shouldRender={matchesEndOrStartOf('type.literal', selectedTags)}
                Component={ComponentCustomTagLiteral}
                componentProps={{
                    version: version,
                    reduxStore: reduxStore?.type?.literal,
                    keyPrefix: `${keyPrefix}.literal`,
                }}
            />

            <ConditionalComponent
                shouldRender={matchesEndOrStartOf('type.environment', selectedTags)}
                Component={ComponentCustomTagEnvironment}
                componentProps={{
                    version: version,
                    reduxStore: reduxStore?.type?.environment,
                    keyPrefix: `${keyPrefix}.environment`,
                }}
            />

            <ConditionalComponent
                shouldRender={matchesEndOrStartOf('type.request_header', selectedTags)}
                Component={ComponentCustomTagHeader}
                componentProps={{
                    version: version,
                    reduxStore: reduxStore?.type?.request_header,
                    keyPrefix: `${keyPrefix}.request_header`,
                }}
            />
        </>
    );
};

export default memorizeComponent(CommonComponentCustomTags, compareVeri);
