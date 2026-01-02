import { ActionType, ResourceType } from "@/redux/reducer-helpers/common";
import { handleChangeResources } from "@/redux/dispatcher";
import { ResourceAction } from "@/redux/reducers/slice";
import { ObjToBase64, ObjToBase64Per } from "@/utils/typed-config-op";
import { generateUniqueId } from "@/utils/tools";

export interface TypedConfigChangeOptions {
    version: string;
    keyPrefix: string;
    selectedItem: any;
    customName?: string;
    customKeys?: string;
    isPerConfig?: boolean;
    dispatch: any;
}

export interface FilterAddOptions {
    version: string;
    keyPrefix: string;
    selectedItem: any;
    fcName: string;
    dispatch: any;
}

export const handleTransportSocketChange = (options: TypedConfigChangeOptions) => {
    const { version, keyPrefix, selectedItem, dispatch } = options;

    if (!selectedItem) {
        console.error("tls not found");
        return;
    }

    const transportSocket = {
        name: selectedItem.category,
        typed_config: {
            type_url: selectedItem.gtype,
            value: selectedItem
        }
    };

    handleChangeResources({
        version,
        type: ActionType.Update,
        keys: keyPrefix,
        val: ObjToBase64(transportSocket),
        resourceType: ResourceType.Resource
    }, dispatch, ResourceAction);
};

export const handleFilterAdd = (options: FilterAddOptions) => {
    const { version, keyPrefix, selectedItem, fcName, dispatch } = options;

    if (!selectedItem) {
        console.error("Filter not found");
        return;
    }

    const fullFilterName = `${fcName}-filter${generateUniqueId(6)}`;
    const typedConfig = {
        name: fullFilterName,
        typed_config: {
            type_url: selectedItem.gtype,
            value: selectedItem
        }
    };

    handleChangeResources({
        version,
        type: ActionType.Append,
        keys: keyPrefix,
        val: ObjToBase64(typedConfig),
        resourceType: ResourceType.Resource
    }, dispatch, ResourceAction);
};
