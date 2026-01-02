import { memo } from 'react';
import _ from 'lodash';
import { InType, OutType } from '@/elchi/tags/tagsType';

type DataStructure = {
    reduxStore?: any;
    drawerOpen?: boolean;
    tags?: InType[] | OutType;
    selectedTags?: string[]
    value?: any;
    tag?: string;
    veri_tags?: string[];
};

//eslint-disable-next-line
export function memorizeComponent<T>(Component: React.FC<T>, compareFunction: (prev: T, next: T) => boolean) {
    return memo(Component, compareFunction);
}

// in veri
export function compareVeri<T extends { veri: DataStructure }>(prev: T, next: T) {
    return _.isEqual(prev.veri, next.veri);
}

export function compareVeriReduxStoreAndConfigDiscovery(prevProps: any, nextProps: any) {
    return _.isEqual(prevProps.veri.reduxStore, nextProps.veri.reduxStore)
        && _.isEqual(prevProps.veri.ConfigDiscovery, nextProps.veri.configDiscovery);
}

export function compareVeriReduxStoreOnly(prevProps: any, nextProps: any) {
    return _.isEqual(prevProps.veri.reduxStore, nextProps.veri.reduxStore);
}

export function compareVeriReduxStoreAndFiltersAndfcIndex(prevProps: any, nextProps: any) {
    return _.isEqual(prevProps.veri.reduxStore, nextProps.veri.reduxStore)
        && _.isEqual(prevProps.veri.filters, nextProps.veri.filters)
        && _.isEqual(prevProps.veri.fcIndex, nextProps.veri.fcIndex)
        && _.isEqual(prevProps.veri.fcName, nextProps.veri.fcName);
}

export function compareVeriReduxStoreAndConfigDiscoveryAndListenerName(prevProps: any, nextProps: any) {
    return _.isEqual(prevProps.veri.reduxStore, nextProps.veri.reduxStore)
        && _.isEqual(prevProps.veri.configDiscovery, nextProps.veri.configDiscovery)
        && _.isEqual(prevProps.veri.listenerName, nextProps.veri.listenerName);

}

export function compareVeriReduxStoreAndHttpFilter(prevProps: any, nextProps: any) {
    return _.isEqual(prevProps.veri.reduxStore, nextProps.veri.reduxStore) && _.isEqual(prevProps.veri.httpFilters, nextProps.veri.httpFilters);
}

export function compareVeriReduxStoreAndSelectedTags(prevProps: any, nextProps: any) {
    return _.isEqual(prevProps.veri.reduxStore, nextProps.veri.reduxStore) && _.isEqual(prevProps.veri.selectedTags, nextProps.veri.selectedTags);
}

export function compareReduxStoreAndNameAndConfigDiscovery(prevProps: any, nextProps: any) {
    return _.isEqual(prevProps.reduxStore, nextProps.reduxStore)
        && _.isEqual(prevProps.name, nextProps.name)
        && _.isEqual(prevProps.configDiscovery, nextProps.configDiscovery)
        && _.isEqual(prevProps.managed, nextProps.managed)
        && _.isEqual(prevProps.validate, nextProps.validate)
        && _.isEqual(prevProps.waf, nextProps.waf);
}

export function compareResourceConfKeys(prevProps: any, nextProps: any) {
    return _.isEqual(prevProps.selectedTags, nextProps.selectedTags)
        && _.isEqual(prevProps.resourceConfKeys, nextProps.resourceConfKeys)
        && _.isEqual(prevProps.handleChangeTag, nextProps.handleChangeTag);
}

