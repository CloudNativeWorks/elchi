import { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { handleChangeResources } from "@/redux/dispatcher";
import { extractNestedKeys } from "@/utils/get-active-tags";
import { handleAddRemoveTags } from "@/elchi/helpers/tag-operations";
import { ActionType, ResourceType } from "@/redux/reducer-helpers/common";
import { ResourceAction } from "@/redux/reducers/slice";


type UseResourceFormProps = {
    version: string;
    reduxStore: any;
};

const useResourceForm = ({ version, reduxStore }: UseResourceFormProps) => {
    const dispatch = useDispatch();
    const [selectedTags, setSelectedTags] = useState<string[]>(extractNestedKeys(reduxStore));
    useEffect(() => {
        setSelectedTags(extractNestedKeys(reduxStore));
    }, [reduxStore]);

    const handleChangeRedux = useCallback((keys: string, val: any) => {
        handleChangeResources({
            version,
            type: ActionType.Update,
            keys,
            val,
            resourceType: ResourceType.Resource
        }, dispatch, ResourceAction);
    },
        [dispatch, version]
    );

    const handleDeleteRedux = useCallback(
        (keys: string, val?: string | boolean | number) => {
            handleChangeResources({
                version,
                type: ActionType.Delete,
                keys,
                val,
                resourceType: ResourceType.Resource
            }, dispatch, ResourceAction);
        },
        [dispatch, version]
    );

    const handleChangeTag = useCallback((keyPrefix: string, tagPrefix: string, tag: string, checked: boolean, _: number, doNotChange: boolean) => {
        handleAddRemoveTags(keyPrefix, tagPrefix, tag, checked, selectedTags, setSelectedTags, handleDeleteRedux, doNotChange);

    }, [selectedTags, handleDeleteRedux]);

    return { selectedTags, handleChangeRedux, handleDeleteRedux, handleChangeTag };
};

export default useResourceForm;