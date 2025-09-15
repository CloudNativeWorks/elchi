import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Col, Row } from 'antd';
import { ActionType, ResourceType } from '@/redux/reducer-helpers/common';
import { handleChangeResources } from '@/redux/dispatcher';
import { extractNestedKeys } from '@/utils/get-active-tags';
import { handleAddRemoveTags } from '@/elchi/helpers/tag-operations';
import { compareVeriReduxStoreAndConfigDiscovery, memorizeComponent } from '@/hooks/useMemoComponent';
import { clearUniqID, FieldConfigType, startsWithAny } from '@/utils/tools';
import { deleteMatchedConfigDiscovery } from './helpers';
import { ResourceAction } from '@/redux/reducers/slice';
import { modtag_listener, modtag_r_listener, modtag_us_listener } from './_modtag_';
import { useTags } from '@/hooks/useTags';
import CustomAnchor from '@/elchi/components/common/CustomAnchor';
import ComponentFilterChain from './filter-chains/FilterChains';
import CommonComponentName from '../common/Name/Name';
import CommonComponentSingleOptions from '../common/SingleOptions/SingleOptions';
import AddressComponent from './address/Address';
import CommonComponentAccessLog from '../common/AccessLog/AccessLog';
import RenderLoading from '../../common/Loading';
import { generateFields } from '@/common/generate-fields';
import ComponentListenerFilters from './ListenerFilters';
import { ConditionalComponent } from '../../common/ConditionalComponent';
import { ConfDiscovery } from '@/common/types';
import { GTypeFieldsBase } from '@/common/statics/gtypes';


type GeneralPropsChild = {
    veri: {
        version: string;
        generalName: string;
        reduxStore: any;
        keyPrefix: string;
        managed: boolean;
        configDiscovery: ConfDiscovery[];
        UniqID: string | undefined;
        freezedNames: string[];
        GType: GTypeFieldsBase;
        vModels: any;
    }
};

const ListenerComponentChild: React.FC<GeneralPropsChild> = ({ veri }) => {
    const dispatch = useDispatch();
    const location = useLocation();
    const { vTags, loading } = useTags(veri.version, modtag_listener);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const handleChangeRedux = (keys: string, val?: string | boolean | number) => {
        let uniqID = '';
        if (keys.endsWith('.name')) { uniqID = veri.UniqID }
        handleChangeResources({ version: veri.version, type: ActionType.Delete, keys, val: `${val}${uniqID}`, resourceType: ResourceType.Resource }, dispatch, ResourceAction);
    };

    const handleChangeTag = (keyPrefix: string, tagPrefix: string, tag: string, checked: boolean) => {
        handleAddRemoveTags(keyPrefix, tagPrefix, tag, checked, selectedTags, setSelectedTags, handleChangeRedux);
        if (tag === 'filter_chains' && !checked) {
            deleteMatchedConfigDiscovery(veri.reduxStore?.name as string, veri.configDiscovery, veri.version, dispatch);
        }
    }

    useEffect(() => {
        setSelectedTags(extractNestedKeys(veri.reduxStore))
    }, [veri.reduxStore]);

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.l?.Listener,
            sf: vTags.l?.Listener_SingleFields,
            e: ["name"]
        })
    ];

    if (loading) {
        return <RenderLoading checkPage={true} isLoadingQuery={true} error={""} />;
    }

    return (
        <Row>
            <Col md={4}>
                <CustomAnchor
                    resourceConfKeys={vTags.l?.Listener}
                    unsuportedTags={modtag_us_listener['listener']}
                    singleOptionKeys={vTags.l?.Listener_SingleFields.filter((item: string) => item !== 'name')}
                    selectedTags={selectedTags}
                    keyPrefix={veri.keyPrefix}
                    index={Number(veri.keyPrefix)}
                    handleChangeTag={handleChangeTag}
                    required={[...modtag_r_listener["listener"], "address"]}
                    unchangeableTags={veri.managed ? ["address", "name"] : ["name"]}
                />
            </Col>
            <Col md={20}>
                <ConditionalComponent
                    shouldRender={selectedTags?.includes('name')}
                    Component={CommonComponentName}
                    componentProps={{
                        version: veri.version,
                        title: 'name',
                        reduxAction: ResourceAction,
                        disabled: location.pathname !== veri.GType.createPath && veri.freezedNames?.includes(veri.reduxStore?.name as string),
                        index: veri.keyPrefix,
                        reduxStore: clearUniqID(veri.reduxStore?.name).remainingName,
                        uniqID: clearUniqID(veri.reduxStore?.name).removedID,
                        id: `name_${veri.keyPrefix}`
                    }}
                />
                <ConditionalComponent
                    shouldRender={startsWithAny('address', selectedTags)}
                    Component={AddressComponent}
                    componentProps={{
                        version: veri.version,
                        reduxAction: ResourceAction,
                        reduxStore: veri.reduxStore?.address,
                        keyPrefix: `${veri.keyPrefix}.address`,
                        tagMatchPrefix: 'address',
                        managed: veri.managed,
                        id: `address_${veri.keyPrefix}`
                    }}
                />
                <ConditionalComponent
                    shouldRender={selectedTags?.some(item => vTags.l?.Listener_SingleFields.includes(item) && item !== "name")}
                    Component={CommonComponentSingleOptions}
                    componentProps={{
                        version: veri.version,
                        selectedTags: selectedTags,
                        fieldConfigs: fieldConfigs,
                        keyPrefix: `${veri.keyPrefix}`,
                        reduxStore: veri.reduxStore,
                        id: `single_options_${veri.keyPrefix}`
                    }}
                />
                <ConditionalComponent
                    shouldRender={selectedTags?.includes('filter_chains')}
                    Component={ComponentFilterChain}
                    componentProps={{
                        version: veri.version,
                        reduxStore: veri.reduxStore?.filter_chains,
                        keyPrefix: `${veri.keyPrefix}.filter_chains`,
                        listenerName: veri.reduxStore?.name as string,
                        tagMatchPrefix: 'Listener.filter_chains',
                        configDiscovery: veri.configDiscovery,
                        id: `filter_chains_${veri.keyPrefix}`
                    }}
                />
                <ConditionalComponent
                    shouldRender={selectedTags?.includes('listener_filters')}
                    Component={ComponentListenerFilters}
                    componentProps={{
                        version: veri.version,
                        reduxStore: veri.reduxStore?.listener_filters,
                        keyPrefix: `${veri.keyPrefix}.listener_filters`,
                        listenerName: veri.reduxStore?.name as string,
                        tagMatchPrefix: 'Listener.listener_filters',
                        configDiscovery: veri.configDiscovery,
                        id: `listener_filters_${veri.keyPrefix}`
                    }}
                />
                <ConditionalComponent
                    shouldRender={selectedTags?.includes('access_log')}
                    Component={CommonComponentAccessLog}
                    componentProps={{
                        version: veri.version,
                        keyPrefix: `${veri.keyPrefix}.access_log`,
                        tagMatchPrefix: `Listener.access_log`,
                        reduxStore: veri.reduxStore?.access_log,
                        reduxAction: ResourceAction,
                        id: `access_log_${veri.keyPrefix}`
                    }}
                />
            </Col>
        </Row>
    );
};


export default memorizeComponent(ListenerComponentChild, compareVeriReduxStoreAndConfigDiscovery);