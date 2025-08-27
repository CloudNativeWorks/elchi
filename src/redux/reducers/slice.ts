import {
    InitVersions,
    CombinedPayload,
    SetPayload,
    AppendUpdatePayload,
    DeletePayload,
    AppendWithExtension,
    DeleteConfigDiscoveryPayload,
} from "./slice-helper";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UpdateNestedObject, DeleteNestedObject, UpdateNestedArray, deleteValueInNestedArray, DeleteConfigDiscoveryByParentName, DeleteNestedObjectByParentName, UpdateMainListWithNewPriorities } from "@/redux/reducers/nested-update";
import { ActionType, VERSIONS } from '@/redux/reducer-helpers/common'
import { syncResourceFilterOrdering } from './filter-ordering-utils';


const initialState: InitVersions = Object.entries(VERSIONS).reduce((acc, [version]) => {
    acc[version] = {
        Resource: {} as object | [],
        CustomResource: [],
        ConfigDiscovery: [],
        Scenario: {},
        ElchiDiscovery: [],
    };
    return acc;
}, {} as InitVersions);


const ResourceSlice = createSlice({
    name: "ResourcesStore",
    initialState,
    reducers: {
        ResourceAction: (state, action: PayloadAction<CombinedPayload>) => {
            const { version, type, resourceType } = action.payload;
            const resourceStore = state[version][resourceType];

            if (!resourceStore) { throw new Error(`Invalid Resource Type`) }

            switch (type) {
                case ActionType.Set: {
                    const setPayload = action.payload as SetPayload;
                    state[version][resourceType] = setPayload.val;
                    break;
                }
                case ActionType.Append: {
                    const appendPayload = action.payload as AppendUpdatePayload;
                    UpdateNestedArray(resourceStore, appendPayload.keys, appendPayload.val)
                    break;
                }
                case ActionType.Update: {
                    const updatePayload = action.payload as AppendUpdatePayload;
                    UpdateNestedObject(resourceStore, updatePayload.keys, updatePayload.val);
                    break;
                }
                case ActionType.Delete: {
                    const deletePayload = action.payload as DeletePayload;
                    DeleteNestedObject(resourceStore, deletePayload.keys);
                    break;
                }
                case ActionType.AppendFilter: {
                    const appendWEPayload = action.payload as AppendWithExtension;
                    UpdateNestedArray(resourceStore, appendWEPayload.keys, appendWEPayload.val)
                    state[version].ConfigDiscovery.unshift(appendWEPayload.extension);
                    
                    // Update priorities after unshift
                    state[version].ConfigDiscovery.forEach((item, index) => {
                        if (item && typeof item === 'object' && 'priority' in item) {
                            item.priority = index;
                        }
                    });

                    // Synchronize resource ordering with ConfigDiscovery
                    syncResourceFilterOrdering({
                        resourceStore: state[version].Resource,
                        configDiscovery: state[version].ConfigDiscovery,
                        resourcePath: appendWEPayload.keys
                    });
                    break;
                }
                case ActionType.DeleteFromList: {
                    const deleteFromArrayPayload = action.payload as AppendUpdatePayload;
                    deleteValueInNestedArray(resourceStore, deleteFromArrayPayload.keys, deleteFromArrayPayload.val);
                    break;
                }
                case ActionType.UpdatePriority: {
                    const updatePriorityPayload = action.payload as SetPayload;
                    UpdateMainListWithNewPriorities(resourceStore, updatePriorityPayload.val);
                    break;
                }
                case ActionType.DeleteConfigDiscovery: {
                    const deleteConfigDiscovery = action.payload as DeleteConfigDiscoveryPayload;
                    DeleteConfigDiscoveryByParentName(resourceStore, deleteConfigDiscovery.parent_name);
                    DeleteNestedObjectByParentName(state[version].Resource, deleteConfigDiscovery.keys, deleteConfigDiscovery.parent_name);
                    break;
                }
                default:
                    throw new Error("Invalid action type");
            }
        },
        ClearResources: (state, action: PayloadAction<{ version: string, initialValue: any }>) => {
            const { version, initialValue } = action.payload;

            for (const key in window.APP_CONFIG.AVAILABLE_VERSIONS) {
                state[window.APP_CONFIG.AVAILABLE_VERSIONS[key]].CustomResource = [];
                state[window.APP_CONFIG.AVAILABLE_VERSIONS[key]].ConfigDiscovery = [];
                state[window.APP_CONFIG.AVAILABLE_VERSIONS[key]].Resource = [];
                state[window.APP_CONFIG.AVAILABLE_VERSIONS[key]].Scenario = {};
                state[window.APP_CONFIG.AVAILABLE_VERSIONS[key]].ElchiDiscovery = [];
            }

            state[version].Resource = initialValue;
        },
    },
});

export const {
    ResourceAction,
    ClearResources,
} = ResourceSlice.actions;

export default ResourceSlice.reducer;
