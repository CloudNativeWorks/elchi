import React, { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useCustomGetQuery } from "@/common/api";
import { ActionType, ResourceType } from "@/redux/reducer-helpers/common";
import { handleChangeResources } from "@/redux/dispatcher";
import { FieldComponent } from "@/elchi/components/common/FormItems";
import { compareVeriReduxStoreAndSelectedTags, memorizeComponent } from "@/hooks/useMemoComponent";
import { FieldTypes } from "@/common/statics/general";
import { useProjectVariable } from "@/hooks/useProjectVariable";
import { debounce } from "lodash";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: string | undefined;
        keyPrefix?: string;
        reduxAction: any;
        tag: string;
        size: number;
        selectedTags: string[];
        alwaysShow?: boolean;
        tagPrefix?: string;
        isNonEdsCluster?: string;
    }
};

const CommonComponentCluster: React.FC<GeneralProps> = ({ veri }) => {
    const dispatch = useDispatch();
    const { project } = useProjectVariable();

    const [searchQuery, setSearchQuery] = useState<string>('');
    const debouncedSearch = useCallback(debounce((value: string) => setSearchQuery(value), 300), []);

    const { data: queryData } = useCustomGetQuery({
        queryKey: `listCommonClusters_${searchQuery}`,
        enabled: true,
        path: `custom/resource_list_search?collection=clusters&type=clusters&version=${veri.version}&project=${project}&metadata_non_eds_cluster=${veri.isNonEdsCluster}&search=${searchQuery}`,
    });

    const handleUpdateRedux = (keys: string, val: string | boolean | number) => {
        handleChangeResources({ version: veri.version, type: ActionType.Update, keys: keys, val: val, resourceType: ResourceType.Resource }, dispatch, veri.reduxAction);
    };

    return (
        <FieldComponent veri={{
            selectedTags: veri.selectedTags,
            handleChange: handleUpdateRedux,
            tag: veri.tag,
            keyPrefix: veri.keyPrefix,
            value: veri.reduxStore,
            values: queryData ? queryData.map((item: { name: string }) => item.name) : [],
            type: FieldTypes.Select,
            placeholder: "(cluster)",
            spanNum: veri.size,
            alwaysShow: veri.alwaysShow,
            required: true,
            tagPrefix: veri.tagPrefix,
            onSearch: debouncedSearch,
        }} />
    )
};

export default memorizeComponent(CommonComponentCluster, compareVeriReduxStoreAndSelectedTags);