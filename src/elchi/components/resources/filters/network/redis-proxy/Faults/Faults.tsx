import React, { useState, useEffect } from 'react';
import { Col, Divider, Tabs } from 'antd';
import { useDispatch } from 'react-redux';
import ECard from '@/elchi/components/common/ECard';
import { HorizonTags } from '@/elchi/components/common/HorizonTags';
import { EForm } from '@/elchi/components/common/e-components/EForm';
import { EFields } from '@/elchi/components/common/e-components/EFields';
import { handleChangeResources } from '@/redux/dispatcher';
import { ActionType, ResourceType } from '@/redux/reducer-helpers/common';
import { useTags } from '@/hooks/useTags';
import { useLoading } from '@/hooks/loadingContext';
import { useManagedLoading } from '@/hooks/useManageLoading';
import RenderLoading from '@/elchi/components/common/Loading';
import { modtag_faults } from './_modtag_';
import { generateFields } from '@/common/generate-fields';
import useResourceForm from '@/hooks/useResourceForm';
import { FieldConfigType, matchesEndOrStartOf } from '@/utils/tools';
import { ConditionalComponent } from '@/elchi/components/common/ConditionalComponent';
import CommonComponentRuntimeFractionalPercent from '@resources/common/RuntimeFractionalPercent/RuntimeFractionalPercent';

type Props = {
    veri: {
        version: string;
        reduxStore: any;
        reduxAction: any;
        keyPrefix: string;
    }
};

const ComponentFaults: React.FC<Props> = ({ veri }) => {
    const dispatch = useDispatch();
    const { version, reduxStore, keyPrefix, reduxAction } = veri;
    const [activeKey, setActiveKey] = useState<string>('0');
    const { vTags, loading } = useTags(version, modtag_faults);
    const { loadingCount } = useLoading();

    const faults = reduxStore || [];
    const faultKeys = Array.isArray(faults)
        ? faults.map((_, index) => String(index))
        : [];

    useEffect(() => {
        if (faultKeys.length === 0) {
            handleAddFault();
        } else if (!faultKeys.includes(activeKey)) {
            setActiveKey(faultKeys[0]);
        }
    }, []);

    const handleAddFault = () => {
        const currentFaults = Array.isArray(reduxStore) ? [...reduxStore] : [];
        const newIndex = currentFaults.length;

        currentFaults.push({});

        handleChangeResources(
            {
                version: version,
                type: ActionType.Update,
                keys: keyPrefix,
                val: currentFaults,
                resourceType: ResourceType.Resource
            },
            dispatch,
            reduxAction
        );

        setActiveKey(String(newIndex));
    };

    const handleRemoveFault = (targetKey: string | React.MouseEvent | React.KeyboardEvent) => {
        const key = String(targetKey);
        const currentFaults = Array.isArray(reduxStore) ? [...reduxStore] : [];
        const index = parseInt(key);

        if (index >= 0 && index < currentFaults.length) {
            currentFaults.splice(index, 1);

            handleChangeResources(
                {
                    version: version,
                    type: ActionType.Update,
                    keys: keyPrefix,
                    val: currentFaults,
                    resourceType: ResourceType.Resource
                },
                dispatch,
                reduxAction
            );

            if (activeKey === key) {
                const newIndex = Math.max(0, index - 1);
                setActiveKey(String(newIndex));
            }
        }
    };

    useManagedLoading(loading);
    if (loadingCount > 0) {
        return <RenderLoading checkPage={true} isLoadingQuery={true} error={""} />;
    }

    return (
        <ECard title="Faults">
            <Tabs
                type="editable-card"
                activeKey={activeKey}
                onChange={setActiveKey}
                onEdit={(targetKey, action) => {
                    if (action === 'add') {
                        handleAddFault();
                    } else {
                        handleRemoveFault(targetKey);
                    }
                }}
                items={faultKeys.map((key) => {
                    const index = parseInt(key);
                    const faultData = Array.isArray(faults) ? faults[index] : {};

                    return {
                        key: key,
                        label: `Fault ${index}`,
                        closable: faultKeys.length > 1,
                        children: (
                            <FaultContent
                                version={version}
                                reduxStore={faultData}
                                reduxAction={reduxAction}
                                keyPrefix={`${keyPrefix}.${index}`}
                                vTags={vTags}
                            />
                        ),
                    };
                })}
            />
        </ECard>
    );
};

type FaultContentProps = {
    version: string;
    reduxStore: any;
    reduxAction: any;
    keyPrefix: string;
    vTags: any;
};

const FaultContent: React.FC<FaultContentProps> = ({ version, reduxStore, reduxAction, keyPrefix, vTags }) => {
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version,
        reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.f?.RedisProxy_RedisFault,
            sf: vTags.f?.RedisProxy_RedisFault_SingleFields,
            e: ['fault_enabled'],
        }),
    ];

    return (
        <>
            <HorizonTags veri={{
                tags: vTags.f?.RedisProxy_RedisFault,
                selectedTags: selectedTags,
                unsupportedTags: [],
                handleChangeTag: handleChangeTag,
                keyPrefix: keyPrefix,
                tagPrefix: '',
                required: ['fault_enabled'],
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
                shouldRender={matchesEndOrStartOf('fault_enabled', selectedTags)}
                Component={CommonComponentRuntimeFractionalPercent}
                componentProps={{
                    version: version,
                    reduxStore: reduxStore?.fault_enabled,
                    reduxAction: reduxAction,
                    keyPrefix: `${keyPrefix}.fault_enabled`,
                    tagPrefix: '',
                    tagMatchPrefix: 'RedisProxy_RedisFault',
                    title: 'Fault Enabled',
                }}
            />
        </>
    );
};

export default React.memo(ComponentFaults);
