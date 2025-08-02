import { useState, useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@redux/store";
import { ActionType, ResourceType } from "@/redux/reducer-helpers/common";
import { handleChangeResources } from "@/redux/dispatcher";
import { handleAddRemoveTags } from "@/elchi/helpers/tag-operations";
import { extractNestedKeys } from "@/utils/get-active-tags";
import { ResourceAction } from "@/redux/reducers/slice";
import { MessageFns } from "@/common/types";


type UseResourceStoreProps = {
    version: string;
    alias: string;
    vModels: { [key: string]: MessageFns<any, string> };
    vTags: any;
    modelName?: string;
};

const useResourceMain = ({ version, alias, vModels, vTags, modelName }: UseResourceStoreProps) => {
    const dispatch = useDispatch();
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const memoReduxStore = useSelector(
        (state: RootState) => state.VersionedResources[version]?.Resource
    );

    const reduxStore = useMemo(() => {
        if (!vModels || !vTags) return null;
        if (modelName) {
            return vModels[alias]?.[modelName]?.fromJSON(memoReduxStore);
        } else {
            return vModels[alias]?.fromJSON(memoReduxStore);
        }
    }, [memoReduxStore, vModels, vTags, alias]);

    useEffect(() => {
        if (reduxStore) {
            setSelectedTags(extractNestedKeys(reduxStore));
        }
    }, [reduxStore, version]);

    const handleChangeRedux = useCallback((keys: string, val?: string | boolean | number) => {
        handleChangeResources({ version, type: ActionType.Update, keys, val, resourceType: ResourceType.Resource }, dispatch, ResourceAction);
    }, [dispatch, version]);

    const handleChangeTag = useCallback((keyPrefix: string, tagPrefix: string, tag: string, checked: boolean) => {
        handleAddRemoveTags(
            keyPrefix,
            tagPrefix,
            tag,
            checked,
            selectedTags,
            setSelectedTags,
            handleChangeRedux
        );
    }, [selectedTags, handleChangeRedux]);

    return { reduxStore, selectedTags, handleChangeTag };
};

export default useResourceMain;
