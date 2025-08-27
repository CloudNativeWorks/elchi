import { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { handleChangeResources } from "@/redux/dispatcher";
import { processArray } from "@/utils/get-active-tags";
import { handleAddRemoveTags_A } from "@/elchi/helpers/tag-operations";
import { ActionType, ResourceType } from "@/redux/reducer-helpers/common";


type UseResourceWithMultipleEntriesProps = {
    version: string;
    reduxStore: any[];
    keyPrefix: string;
    reduxAction: any;
};

const useResourceFormMultiple = ({ version, reduxStore, keyPrefix, reduxAction }: UseResourceWithMultipleEntriesProps) => {
    const dispatch = useDispatch();
    const [selectedTags, setSelectedTags] = useState<Record<number, string[]>>(reduxStore ? processArray(reduxStore) : {});

    useEffect(() => {
        setSelectedTags(processArray(reduxStore));
    }, [reduxStore]);

    const handleChangeRedux = useCallback(
        (keys: string, val: string | boolean | number) => {
            handleChangeResources({ version, type: ActionType.Update, keys, val, resourceType: ResourceType.Resource }, dispatch, reduxAction);
        },
        [dispatch, version, reduxAction]
    );

    const handleDeleteRedux = useCallback(
        ({ keys, index }: { keys?: string, index?: number }) => {
            const fullKey = keys ? `${keyPrefix}.${index}.${keys}` : `${keyPrefix}.${index}`;
            handleChangeResources({ version, type: ActionType.Delete, keys: fullKey, resourceType: ResourceType.Resource }, dispatch, reduxAction);
        },
        [dispatch, version, keyPrefix, reduxAction]
    );

    const handleChangeTag = useCallback(
        (keyPrefix: string, tagPrefix: string, tag: string, checked: boolean, index: number, doNotChange = false) => {
            handleAddRemoveTags_A(keyPrefix, tagPrefix, tag, index, checked, selectedTags, setSelectedTags, handleDeleteRedux, doNotChange);
        },
        [selectedTags, handleDeleteRedux]
    );

    return { selectedTags, setSelectedTags, handleChangeRedux, handleDeleteRedux, handleChangeTag };
};

export default useResourceFormMultiple;