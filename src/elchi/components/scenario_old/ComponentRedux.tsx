import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@redux/store";
import { ActionType, ResourceType } from "@/redux/reducer-helpers/common";
import { handleChangeResources } from "@/redux/dispatcher";
import { ResourceAction } from "@/redux/reducers/slice";


type UseResourceStoreProps = {
    version: string;
};

const ComponentRedux = ({ version }: UseResourceStoreProps) => {
    const dispatch = useDispatch();

    const reduxStore = useSelector(
        (state: RootState) => state.VersionedResources[version]?.Scenario
    );

    const handleChangeRedux = useCallback((keys: string, val?: string | boolean | number) => {
        handleChangeResources({ version, type: ActionType.Update, keys, val, resourceType: ResourceType.Scenario }, dispatch, ResourceAction);
    }, [dispatch, version]);

    const handleDeleteRedux = useCallback((keys: any) => {
        handleChangeResources({ version, type: ActionType.Delete, keys, resourceType: ResourceType.Scenario }, dispatch, ResourceAction);
    }, [dispatch, version]);

    return { reduxStore, handleChangeRedux, handleDeleteRedux };
};

export default ComponentRedux;


export const buildDotPath = (base: string, obj: any): [string, any][] => {
    const entries: [string, any][] = [];
    Object.entries(obj).forEach(([key, value]) => {
        if (typeof value === "object" && !Array.isArray(value)) {
            const nestedEntries = buildDotPath(`${base}.${key}`, value);
            entries.push(...nestedEntries);
        } else {
            entries.push([`${base}.${key}`, value]);
        }
    });
    return entries;
};