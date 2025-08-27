import { InType } from '@/elchi/tags/tagsType';
import type { CollapseProps } from 'antd';

type CollapseItemsProps = {
    reduxStore: any;
    version: string;
    reduxAction: any;
    selectedTags?: string[];
    componentName: string;
    component: any;
    keyPrefix: string;
    tagMatchPrefix: string;
    condition: boolean;
    tags?: InType[];
    tagPrefix?: string;
    tags_rmp?: InType[];
    tags_rmp_rf?: InType[];
    toJSON?: any;
}

export const getCollapseItems = (veriler: CollapseItemsProps[]) => {
    const items: CollapseProps['items'] = [];
    veriler.forEach((veri, i) => {
        if (veri.condition) {
            const finVeri = {
                version: veri.version,
                reduxStore: veri.reduxStore,
                reduxAction: veri.reduxAction,
                keyPrefix: veri.keyPrefix,
                tagMatchPrefix: veri.tagMatchPrefix,
            }

            if (veri.tags) { Object.assign(finVeri, { tags: veri.tags }); }
            if (veri.tagPrefix) { Object.assign(finVeri, { tagPrefix: veri.tagPrefix }); }
            if (veri.selectedTags) { Object.assign(finVeri, { selectedTags: veri.selectedTags }); }
            if (veri.tags_rmp_rf) { Object.assign(finVeri, { tags_rmp_rf: veri.tags_rmp_rf }); }
            if (veri.tags_rmp) { Object.assign(finVeri, { tags_rmp: veri.tags_rmp }); }
            if (veri.toJSON) { Object.assign(finVeri, { toJSON: veri.toJSON }); }

            items.push({
                key: veri.componentName + i.toString(),
                label: <div style={{ color: 'white', fontWeight: 'bold' }}>{veri.componentName}</div>,
                children: (
                    <veri.component veri={finVeri} />
                )
            });
        }
    });

    return items;
}