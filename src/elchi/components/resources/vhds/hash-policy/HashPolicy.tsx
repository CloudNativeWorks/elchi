import React from 'react';
import { Col, Divider, Row, Tabs } from 'antd';
import { memorizeComponent, compareVeri } from '@/hooks/useMemoComponent';
import { HorizonTags } from '@/elchi/components/common/HorizonTags';
import { FieldConfigType, matchesEndOrStartOf } from '@/utils/tools';
import { navigateCases } from "@/elchi/helpers/navigate-cases";
import { FieldTypes } from '@/common/statics/general';
import ComponentHeader from './Header';
import useResourceForm from '@/hooks/useResourceForm';
import useTabManager from '@/hooks/useTabManager';
import ECard from '@/elchi/components/common/ECard';
import { useTags } from '@/hooks/useTags';
import { modtag_hash_policy } from '../_modtag_';
import { ConditionalComponent } from '@/elchi/components/common/ConditionalComponent';
import { EForm } from '@/elchi/components/common/e-components/EForm';
import { EFields } from '@/elchi/components/common/e-components/EFields';
import ComponentCookie from './Cookie';
import ComponentConnectionProperties from './ConnectionProperties';
import ComponentQueryParameter from './QueryParameter';
import ComponentFilterState from './FilterState';


type GeneralProps = {
    veri: {
        version: string;
        keyPrefix: string;
        reduxStore: any[] | undefined;
        reduxAction: any;
        tagMatchPrefix: string;
    }
};

type GeneralPropsChild = {
    veri: {
        version: string;
        keyPrefix: string;
        reduxStore: any;
        reduxAction: any;
        tagMatchPrefix: string;
    }
};

const ComponentHashPolicy: React.FC<GeneralProps> = ({ veri }) => {
    const { state, onChangeTabs, addTab } = useTabManager({
        initialActiveTab: "0",
        reduxStore: veri.reduxStore,
        keyPrefix: veri.keyPrefix,
        version: veri.version,
        reduxAction: veri.reduxAction
    });

    return (
        <ECard title={'Hash Policy'}>
            <Tabs
                onChange={onChangeTabs}
                type='editable-card'
                activeKey={state.activeTab}
                onEdit={addTab}
                style={{ width: '100%' }}
                items={veri.reduxStore?.map((data: any, index: number) => {
                    return {
                        key: index.toString(),
                        label: `HP: ${index}`,
                        forceRender: true,
                        children: (
                            <ComponentHashPolicyChild veri={{
                                version: veri.version,
                                reduxAction: veri.reduxAction,
                                reduxStore: data,
                                keyPrefix: `${veri.keyPrefix}.${index}`,
                                tagMatchPrefix: veri.tagMatchPrefix
                            }} />
                        ),
                    };
                })}
            />
        </ECard>
    )
};


const ComponentHashPolicyChild: React.FC<GeneralPropsChild> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_hash_policy);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        { tag: "terminal", type: FieldTypes.Boolean, fieldPath: 'terminal', placeHolder: '(string)', spanNum: 6 },
    ]

    return (
        <Row>
            <HorizonTags veri={{
                tags: vTags.hp?.RouteAction_HashPolicy,
                selectedTags: selectedTags,
                handleChangeTag: handleChangeTag,
                tagPrefix: `policy_specifier`,
                tagMatchPrefix: `${veri.tagMatchPrefix}`,
                keyPrefix: veri.keyPrefix,
                onlyOneTag: [['policy_specifier.header', 'policy_specifier.cookie', 'policy_specifier.connection_properties', 'policy_specifier.query_parameter', 'policy_specifier.filter_state']]
            }} />
            <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type='horizontal' />
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
                <ConditionalComponent
                    shouldRender={matchesEndOrStartOf('policy_specifier.header', selectedTags)}
                    Component={ComponentHeader}
                    componentProps={{
                        version: veri.version,
                        reduxAction: veri.reduxAction,
                        reduxStore: navigateCases(veri.reduxStore, 'policy_specifier.header'),
                        keyPrefix: `${veri.keyPrefix}.header`,
                        tagPrefix: `policy_specifier.header`,
                        tagMatchPrefix: `${veri.tagMatchPrefix}.policy_specifier.header`,
                        id: `${veri.keyPrefix}.header`,
                    }}
                />
                <ConditionalComponent
                    shouldRender={matchesEndOrStartOf('policy_specifier.cookie', selectedTags)}
                    Component={ComponentCookie}
                    componentProps={{
                        version: veri.version,
                        reduxAction: veri.reduxAction,
                        reduxStore: navigateCases(veri.reduxStore, 'policy_specifier.cookie'),
                        keyPrefix: `${veri.keyPrefix}.cookie`,
                        tagPrefix: `policy_specifier.cookie`,
                        tagMatchPrefix: `${veri.tagMatchPrefix}.policy_specifier.cookie`,
                        id: `${veri.keyPrefix}.cookie`,
                    }}
                />
                <ConditionalComponent
                    shouldRender={matchesEndOrStartOf('policy_specifier.connection_properties', selectedTags)}
                    Component={ComponentConnectionProperties}
                    componentProps={{
                        version: veri.version,
                        reduxAction: veri.reduxAction,
                        reduxStore: navigateCases(veri.reduxStore, 'policy_specifier.connection_properties'),
                        keyPrefix: `${veri.keyPrefix}.connection_properties`,
                        tagPrefix: `policy_specifier.connection_properties`,
                        tagMatchPrefix: `${veri.tagMatchPrefix}.policy_specifier.connection_properties`,
                        id: `${veri.keyPrefix}.connection_properties`,
                    }}
                />
                <ConditionalComponent
                    shouldRender={matchesEndOrStartOf('policy_specifier.query_parameter', selectedTags)}
                    Component={ComponentQueryParameter}
                    componentProps={{
                        version: veri.version,
                        reduxAction: veri.reduxAction,
                        reduxStore: navigateCases(veri.reduxStore, 'policy_specifier.query_parameter'),
                        keyPrefix: `${veri.keyPrefix}.query_parameter`,
                        tagPrefix: `policy_specifier.query_parameter`,
                        tagMatchPrefix: `${veri.tagMatchPrefix}.policy_specifier.query_parameter`,
                        id: `${veri.keyPrefix}.query_parameter`,
                    }}
                />
                <ConditionalComponent
                    shouldRender={matchesEndOrStartOf('policy_specifier.filter_state', selectedTags)}
                    Component={ComponentFilterState}
                    componentProps={{
                        version: veri.version,
                        reduxAction: veri.reduxAction,
                        reduxStore: navigateCases(veri.reduxStore, 'policy_specifier.filter_state'),
                        keyPrefix: `${veri.keyPrefix}.filter_state`,
                        tagPrefix: `policy_specifier.filter_state`,
                        tagMatchPrefix: `${veri.tagMatchPrefix}.policy_specifier.filter_state`,
                        id: `${veri.keyPrefix}.filter_state`,
                    }}
                />
                
            </Col>
        </Row>
    )
};

export default memorizeComponent(ComponentHashPolicy, compareVeri);
