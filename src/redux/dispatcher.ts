
import { ActionType, ResourceType } from "@/redux/reducer-helpers/common";
import { Dispatch, UnknownAction } from '@reduxjs/toolkit';


type ActionPayload = {
    version: string;
    type: ActionType;
    keys: string;
    val?: any;
    parent_name?: string;
    extension?: any;
    resourceType?: ResourceType;
};

export const handleChangeResources = (
    payload: ActionPayload,
    dispatchFn: Dispatch<UnknownAction>, //eslint-disable-next-line
    actionCreator: (args: any) => UnknownAction,
) => {
    const { version, type, keys, val, parent_name, extension, resourceType } = payload;
    const action = actionCreator({ version, type, resourceType, keys: keys.split(".").filter(Boolean), val, parent_name, extension });

    try {
        dispatchFn(action);
    } catch (error: any) {
        console.log(error)
    }
};
